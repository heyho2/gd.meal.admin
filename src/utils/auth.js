import Cookies from 'js-cookie'

const TokenKey = 'Admin-Token'
const userKey = 'Admin-User'

export function getToken() {
  return Cookies.get(TokenKey)
}

export function setToken(token) {
  return Cookies.set(TokenKey, token)
}

export function removeToken() {
  return Cookies.remove(TokenKey)
}

export function getUserInfo() {
  return JSON.parse(Cookies.get(userKey) || `{}`)
}

export function setUserInfo(userinfo) {
  var sss = JSON.stringify(userinfo || {});
  return Cookies.set(userKey, sss)
}

export function removeUserInfo() {
  return Cookies.remove(userKey)
}