import axios from 'axios'
import { toast } from 'react-toastify'
import { interceptorLoadingElements } from '~/utils/formatters'

const authorizeAxiosInstance = axios.create()

// thoi gian cho toi da cua 1 request: 10s
authorizeAxiosInstance.defaults.timeout = 1000 * 60 * 10

// withCredentials: Tu dong gui cookie trong moi request len BE (phuc vu viec luu JWT token, refresh token vao trong httpOnly cookie cua trinh duyet)
authorizeAxiosInstance.defaults.withCredentials = true

// Cau hinh interceptor
// Interceptor request
authorizeAxiosInstance.interceptors.request.use(
  (config) => {
    interceptorLoadingElements(true)
    return config
  },
  (error) => {
    // Do something with request error
    return Promise.reject(error)
  }
)

// Interceptor response
authorizeAxiosInstance.interceptors.response.use(
  (response) => {
    interceptorLoadingElements(false)
    return response
  },
  (error) => {
    interceptorLoadingElements(false)

    // Moi ma http status code khac 2xx se bi coi la loi, va se goi vao ham nay
    // Xu ly tap trung hien thi thong bao loi tra ve tu api
    let errorMessage = error?.message
    if (error.response?.data?.message) {
      errorMessage = error.response?.data?.message
    }

    if (error.response?.status !== 410) {
      toast.error(errorMessage)
    }

    return Promise.reject(error)
  }
)

export default authorizeAxiosInstance