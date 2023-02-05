import { createStore, atom } from 'jotai/vanilla'
export { atom } from 'jotai'

export const myStore = createStore()


const countAtom = atom(0)
myStore.set(countAtom, 1)
myStore.sub(countAtom, () => {
  console.log('countAtom value is changed to', myStore.get(countAtom))
})
