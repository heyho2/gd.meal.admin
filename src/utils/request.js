import axios from 'axios'
import { Message, MessageBox } from 'element-ui'
import store from '../store'
import { getToken } from '@/utils/auth'
import { Loading } from 'element-ui';

// 创建axios实例
const service = axios.create({
  baseURL: process.env.VUE_APP_BASE_API, // api 的 base_url
  timeout: 50000 // 请求超时时间
})

// request拦截器
service.interceptors.request.use(
  config => {
    if (store.getters.token) {
      config.headers['Authorization'] = "Bearer " + getToken() // 让每个请求携带自定义token 请根据实际情况自行修改
    }
    /**loading */
    config.isLoading = config.isLoading !== false ? true : false//默认启动
    let loadingInstance;
    if (config.isLoading) {
      loadingInstance = Loading.service({
        text: config.loadingText || "加载中...",
      });
      store.commit('app/setLoadingInstance', loadingInstance)
    }
    return config
  },
  error => {
    // Do something with request error
    console.log(error) // for debug
    Promise.reject(error)
  }
)
// response 拦截器
service.interceptors.response.use(
  response => {
    var loadingInstance = store.getters.loadingInstance;
    if (loadingInstance) {
      if (response.config.loadingTime) {
        setTimeout(() => {
          loadingInstance.close();
        }, response.config.loadingTime || 0)
      } else {
        loadingInstance.close();
      }
    }

    const res = response.data
    /**
     * code为非0是抛错 可结合自己业务进行修改
     */
    if (response.status == 200 && res.code !== 0) {
      Message({
        message: res.message || "服务器异常或网络错误！",
        type: 'warning',
        duration: 5 * 1000
      });
      return Promise.reject(res.message || "服务器异常或网络错误！")
    } else {
      return res
    }
  },
  error => {
    var loadingInstance = store.getters.loadingInstance;
    if (loadingInstance)
      loadingInstance.close();
    //401 登陆失败;
    if (error.response && error.response.status === 401) {
      MessageBox.confirm('你已被登出，可以取消继续留在该页面，或者重新登录', '确定登出', {
        confirmButtonText: '重新登录',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        store.dispatch('user/logout').then(() => {
          location.reload() // 为了重新实例化vue-router对象 避免bug
        })
      })
      return Promise.reject(error)
    }
    //字段验证
    if (error && error.response && error.response.status === 400 && error.response.statusText == "Bad Request") {
      Message({
        message: error.response.data[0],
        type: 'warning',
        duration: 5 * 1000
      })
      return Promise.reject(error)
    }
    Message({
      message: error.message == "Network Error" ? "服务器异常或网络错误！" : error.message,
      type: 'error',
      duration: 5 * 1000
    })
    return Promise.reject(error)
  }
)

export default service
