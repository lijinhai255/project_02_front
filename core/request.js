import axios from 'axios' // 为什么使用axios，上手简单
import { SERVER } from './constant'

const req = axios.create({
  baseURL: `${SERVER}/api`,
  timeout: 15000,
})
const TOKKEN_KEY = "USER_TOKEN"
// 请求拦截器
axios.interceptors.request.use(
  (config) => {
    const token = window.localStorage.getItem(TOKKEN_KEY)
    // console.log(token,"token-token")
    if (token) {
      config.headers.common['Authorization'] = 'Bearer ' + token
    }
    return config
  },
  () => {
    console.error('请求异常')
  },
)

// 响应拦截器
axios.interceptors.response.use((response) => {
  const d = response.data || {}
  // console.log(d, "123432")

  return d
})
const Http = {
  base: (options,othoptions) => {
    return new Promise((resolve, reject) => {
      // console.log(req,"req-req")
      axios({ ...req, ...options,...othoptions }).then(res => {
        // console.log(data,"data-data",res)
        // let { data } = res
        // Store.removeStatus()
        resolve(res)
      }).catch(error => {
        reject(error)
      })
    })
  },
  get: function (url, params) {
    let options = {
      url: url,
      method: 'get',
      params: params
    };
    return this.base(options);
  },
  post: function (url, params,othoptions) {
    let options = {
      url: url,
      method: 'post',
      data: params,
      othoptions
    };
    return this.base(options,othoptions);
  },
  put: function (url, params) {
    let options = {
      url: url,
      method: 'put',
      data: params
    };
    return this.base(options);
  },

}
export default Http
