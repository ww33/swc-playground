import { createStore } from 'jotai/vanilla'
import { atom} from 'jotai'

export const store = createStore()

export const atomCount = atom(0)

/*defaultStore.sub(atomCount, () => {
  console.log('countAtom value is changed to', defaultStore.get(atomCount))
})*/

//defaultStore.set(atomCount, 0)

