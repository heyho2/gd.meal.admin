import { login, GetLoginUserInfoAsync } from '@/api/user'
import {
  getToken,
  setToken,
  removeToken,
  getUserInfo,
  setUserInfo,
  removeUserInfo
} from '@/utils/auth'
import router, { resetRouter } from '@/router'
import md5 from 'js-md5';

const state = {
  token: getToken(),
  name: '',
  avatar: '',
  introduction: '',
  roles: [],
  hospitalName: (getUserInfo() || {}).hospitalName,
  hospitalId: (getUserInfo() || {}).hospitalId,
}

const mutations = {
  SET_TOKEN: (state, token) => {
    state.token = token
  },
  SET_INTRODUCTION: (state, introduction) => {
    state.introduction = introduction
  },
  SET_NAME: (state, name) => {
    state.name = name
  },
  SET_AVATAR: (state, avatar) => {
    state.avatar = avatar
  },
  SET_ROLES: (state, roles) => {
    state.roles = roles
  },
  SET_HospitalId: (state, hospitalId) => {
    state.hospitalId = hospitalId
  },
  SET_HospitalName: (state, hospitalName) => {
    state.hospitalName = hospitalName
  },
}

const actions = {
  // user login
  login({ commit }, userInfo) {
    const username = userInfo.username.trim();
    const password = md5(userInfo.password).toUpperCase();
    return new Promise((resolve, reject) => {
      login(username, password).then(response => {
        debugger
        const { data } = response
        commit('SET_TOKEN', data.token)
        setToken(data.token)
        setUserInfo({
          hospitalName: data.hospitalName,
          hospitalId: data.hospitalId,
          userName: data.userName,
        })
        commit('SET_HospitalId', data.hospitalId)
        commit('SET_HospitalName', data.hospitalName)
        resolve()
      }).catch(error => {
        reject(error)
      })
    })
  },

  // get user info
  getInfo({ commit, state }) {
    return new Promise((resolve, reject) => {
      var { hospitalName, hospitalId, userName } = getUserInfo();
      commit('SET_ROLES', ['admin'])
      commit('SET_AVATAR', "admin")
      commit('SET_INTRODUCTION', "admin")
      commit('SET_NAME', userName)
      resolve({ roles: ['admin'] })
    })
  },

  // user logout
  logout({ commit, state }) {
    return new Promise((resolve, reject) => {
      commit('SET_TOKEN', '')
      commit('SET_ROLES', [])
      removeToken()
      resetRouter()
      removeUserInfo()
      resolve()
    })
  },

  // remove token
  resetToken({ commit }) {
    return new Promise(resolve => {
      commit('SET_TOKEN', '')
      commit('SET_ROLES', [])
      removeToken()
      removeUserInfo()
      resolve()
    })
  },

  // Dynamically modify permissions
  changeRoles({ commit, dispatch }, role) {
    return new Promise(async resolve => {
      const token = role + '-token'
      commit('SET_TOKEN', token)
      setToken(token)
      const { roles } = await dispatch('getInfo')

      resetRouter()

      // generate accessible routes map based on roles
      const accessRoutes = await dispatch('permission/generateRoutes', roles, { root: true })

      // dynamically add accessible routes
      router.addRoutes(accessRoutes)

      resolve()
    })
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
