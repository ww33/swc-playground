import { getDefaultStore } from 'jotai'
import { atomEs5 } from './index'

const store = getDefaultStore()

export const start = () => {
  const code = store.get(atomEs5)
  console.log({ code })
}
