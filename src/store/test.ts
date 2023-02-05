import { getDefaultStore } from 'jotai'
import {atomCount} from './index'

const defaultStore = getDefaultStore()
defaultStore.sub(atomCount, () => {
  console.log('!countAtom value is changed to', defaultStore.get(atomCount))
})


export const test = () =>{
  //console.log(defaultStore.get(atomCount))
}
