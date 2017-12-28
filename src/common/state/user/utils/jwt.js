import store from 'store/dist/store.modern'

export function getJwt() {
  return store.get('jwt')
}

export function resetJwt() {
  return store.set('jwt', null)
}

export function setJwt(jwt) {
  return store.set('jwt', jwt)
}
