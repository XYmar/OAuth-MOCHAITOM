import Cookies from 'js-cookie'

const TokenKey = 'Admin-Token'

export function getToken() {
  return Cookies.get(TokenKey)
}
export function setToken(token) {
  return Cookies.set(TokenKey, token)
}
export function getRefreshToken() {
  return Cookies.get('RefreshTokenKey')
}
export function setRefreshToken(token) {
  return Cookies.set('RefreshTokenKey', token)
}
export function removeToken() {
  return Cookies.remove(TokenKey)
}
export function getIp() {
  return Cookies.get('ip')
}

export function getPort() {
  return Cookies.get('port')
}

export function setUserId(id) {
  return Cookies.set('userId', id)
}

export function removeUserId(id) {
  return Cookies.remove('userId')
}

export function removeProId(id) {
  return Cookies.set('projectId')
}

export function setExpire(timestamp) {
  return Cookies.set('timestamp', timestamp)
}

export function getExpire(timestamp) {
  return Cookies.get('timestamp')
}

export function removeExpire(timestamp) {
  return Cookies.remove('timestamp')
}

export function setExpire2(reTimestamp) {
  return Cookies.set('reTimestamp', reTimestamp)
}

export function getExpire2(reTimestamp) {
  return Cookies.get('reTimestamp')
}

export function removeExpire2(reTimestamp) {
  return Cookies.remove('reTimestamp')
}
