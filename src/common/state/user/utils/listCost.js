import store from 'store/dist/store.modern'

export function setListCost(cost) {
  return store.set('listCost', cost)
}

export function getListCost() {
  return store.get('listCost')
}
