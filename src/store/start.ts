import { getDefaultStore } from 'jotai'
import { atomEs5 } from './index'

const store = getDefaultStore()

export const extraLib = `
  let item: {id: number}
  const logger = (val) => {}
`
const data = [{ id: 1 }, { id: 2 }, { id: 3 }, { id: 4 }]

export const start = ({ Interpreter }) => {
  const code = store.get(atomEs5)

  let result = 0
  for (const item of data) {

    const initFunc = function (interpreter, glObj) {

      interpreter.setProperty(glObj, 'item', interpreter.nativeToPseudo(item))
      interpreter.setProperty(
        glObj,
        'logger',
        interpreter.createNativeFunction((val) => {
          result= result  + interpreter.pseudoToNative(val)
        })
      )
    }

    const myInterpreter = new Interpreter(code, initFunc)
    myInterpreter.run()
  }
  console.log({result})
}
