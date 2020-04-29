import axios from 'axios'
import { Message, MessageBox } from 'element-ui'
import store from '../store'
import { getToken } from '@/utils/auth'
import { Loading } from 'element-ui';

// 创建axios实例
const service = axios.create({
  baseURL: process.env.VUE_APP_Upload_API, // api 的 base_url
  timeout: 50000 // 请求超时时间
})

// request拦截器
service.interceptors.request.use(
  config => {
    // 让每个请求携带自定义token 请根据实际情况自行修改
    config.headers['Authorization'] = getToken()
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
    /**
     * code为非0是抛错 可结合自己业务进行修改
     */
    const res = response.data
    if (response.status == 200 && res.code !== 0) {
        Message({
            message: res.message || "服务器异常或网络错误！",
            type: 'error',
            duration: 5 * 1000
        });
      return Promise.reject('error')
    } else {
      return res
    }
  },
  error => {
    var loadingInstance = store.getters.loadingInstance;
    if (loadingInstance)
      loadingInstance.close();
    Message({
        message: error.message == "Network Error" ? "服务器异常或网络错误！" : error.message,
        type: 'error',
        duration: 5 * 1000
    })
    return Promise.reject(error)
  }
)

export default service
