import { getDefaultStore } from 'jotai'
import { atomEs5 } from './index'

const store = getDefaultStore()

const Tttt = `
{
  x: number,
  y:number,
  z:number
}`

export const extraLib = `
  let ttt: ${Tttt}
  const logger = (val) => {}
`

export const start = ({ Interpreter }) => {
  const code = store.get(atomEs5)

  const initFunc = function (interpreter, globalObject) {
    const ttt = interpreter.nativeToPseudo({ x: 4, y: 4, z: 6 })
    interpreter.setProperty(globalObject, 'ttt', ttt)

    const wrapper = function logger(text) {
      return console.log(text)
    }

    interpreter.setProperty(
      globalObject,
      'logger',
      interpreter.createNativeFunction(wrapper)
    )
  }

  const myInterpreter = new Interpreter(code, initFunc)
  myInterpreter.run()
}
