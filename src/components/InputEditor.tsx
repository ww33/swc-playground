import { useEffect, useMemo, useRef } from 'react'
import type { editor } from 'monaco-editor'
import Editor, { useMonaco } from '@monaco-editor/react'
import { Box, Button, Flex, Heading, useToast, HStack } from '@chakra-ui/react'
import { CgShare, CgFileDocument } from 'react-icons/cg'
import { Base64 } from 'js-base64'
import { gzip, ungzip } from 'pako'
import { useAtom } from 'jotai'

import { codeAtom, swcConfigAtom } from '../config/state'
import {
  editorOptions,
  parseSWCError,
  useBorderColor,
  useMonacoThemeValue,
} from '../config/utils'
import { swcVersionAtom } from '../config/swc'
import type { ParserResult, TransformationResult } from '../config/swc'
import { start } from '../store/start'

const STORAGE_KEY = 'v1.code'

interface Props {
  output: TransformationResult | ParserResult
}

export default function InputEditor({ output }: Props) {
  const [code, setCode] = useAtom(codeAtom)
  const [swcConfig] = useAtom(swcConfigAtom)
  const [swcVersion] = useAtom(swcVersionAtom)
  const monacoTheme = useMonacoThemeValue()
  const borderColor = useBorderColor()
  const monaco = useMonaco()
  const editorRef = useRef<editor.IStandaloneCodeEditor | null>(null)
  const toast = useToast()

  useEffect(() => {
    if (monaco) {
      monaco.languages.typescript.typescriptDefaults.setDiagnosticsOptions({
        noSyntaxValidation: true,
        noSemanticValidation: true,
        noSuggestionDiagnostics: true,
      })
    }
  }, [monaco])

  useEffect(() => {
    const model = editorRef.current?.getModel()
    if (!monaco || !model) {
      return
    }

    if (output.err) {
      const markers = Array.from(parseSWCError(output.val)).map(
        ([_, message, line, col]): editor.IMarkerData => {
          const lineNumber = Number.parseInt(line!),
            column = Number.parseInt(col!)

          return {
            source: 'swc',
            message: message!,
            severity: monaco.MarkerSeverity.Error,
            startLineNumber: lineNumber,
            startColumn: column,
            endLineNumber: lineNumber,
            endColumn: column,
          }
        }
      )
      monaco.editor.setModelMarkers(model, 'swc', markers)
    }

    return () => monaco.editor.setModelMarkers(model, 'swc', [])
  }, [output, monaco])

  useEffect(() => {
    const url = new URL(location.href)
    const encodedInput = url.searchParams.get('code')
    const storedInput = localStorage.getItem(STORAGE_KEY)
    if (encodedInput) {
      setCode(ungzip(Base64.toUint8Array(encodedInput), { to: 'string' }))
    } else if (storedInput) {
      setCode(storedInput)
    }
  }, [setCode])

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, code)
  }, [code])

  const shareUrl = useMemo(() => {
    const url = new URL(location.href)
    url.searchParams.set('version', swcVersion)
    const encodedInput = Base64.fromUint8Array(gzip(code))
    url.searchParams.set('code', encodedInput)
    const encodedConfig = Base64.fromUint8Array(gzip(JSON.stringify(swcConfig)))
    url.searchParams.set('config', encodedConfig)
    return url.toString()
  }, [code, swcConfig, swcVersion])

  const handleShare = async () => {
    if (!navigator.clipboard) {
      toast({
        title: 'Error',
        description: 'Clipboard is not supported in your environment.',
        status: 'error',
        duration: 3000,
        position: 'top',
        isClosable: true,
      })
      return
    }

    window.history.replaceState(null, '', shareUrl)
    await navigator.clipboard.writeText(shareUrl)
    toast({
      title: 'URL is copied to clipboard.',
      status: 'success',
      duration: 3000,
      position: 'top',
      isClosable: true,
    })
  }

  const handleEditorDidMount = (instance: editor.IStandaloneCodeEditor) => {
    editorRef.current = instance
  }

  const handleEditorChange = (value: string | undefined) => {
    if (value != null) {
      setCode(value)
    }
  }

  const handleStart = () => {
    start()
    //efaultStore.set(atomCount, defaultStore.get(atomCount)+1);
    //console.log(defaultStore.get(atomCount))
    /*const {x, y} = state
    setState({x,y: y+ 1})
    run()*/
  }

  const language =
    swcConfig.jsc.parser.syntax === 'ecmascript' ? 'javascript' : 'typescript'

  return (
    <Flex direction="column" gridArea="input" minW={0} minH={0}>
      <Flex justifyContent="space-between" alignItems="center">
        <Heading size="md" mb="8px">
          Input
        </Heading>
        <HStack spacing="10px">
          <Button
            colorScheme="red"
            size="xs"
            leftIcon={<CgFileDocument />}
            onClick={handleStart}
          >
            Run
          </Button>

          <Button size="xs" leftIcon={<CgShare />} onClick={handleShare}>
            Share
          </Button>
        </HStack>
      </Flex>
      <Box
        width="full"
        height="full"
        borderColor={borderColor}
        borderWidth="1px"
      >
        <Editor
          value={code}
          language={language}
          defaultLanguage={language}
          theme={monacoTheme}
          options={editorOptions}
          onMount={handleEditorDidMount}
          onChange={handleEditorChange}
        />
      </Box>
    </Flex>
  )
}
