import { getDefaultStore } from 'jotai'
import { atomEs5 } from './index'
//import {swcConfig} from '../config/settings'

const store = getDefaultStore()

store.sub(atomEs5, () => {
  console.log(store.get(atomEs5))
})

export const test = () => {
  //console.log(defaultStore.get(atomCount))
}
