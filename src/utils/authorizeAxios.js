import axios from 'axios'
import { toast } from 'react-toastify'
import { interceptorLoadingElements } from '~/utils/formatters'
import { refreshTokenAPI } from '~/apis'
import { logoutUserAPI } from '~/redux/user/userSlice'

/**
 * Khong the import { store } from '~/redux/store' theo cach thong thuong o day
 * Giai phap: Inject store: la ky thuat khi can su dung bien redux store o cac file ngoai pham vi component nhu file nay
 * Hieu don gian: Khi ung dung bat dau chay len, code se chay vao main.jsx, tu ben do chung ta goi ham injectStore() de gan bien mainstore vao bien axiosReduxStore cuc bo trong file nay
 */

let axiosReduxStore

export const injectStore = mainStore => {
  axiosReduxStore = mainStore
}

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

// Khoi tao mot promise cho viec goi api refresh token: Muc dich la de khi nao goi api refresh token xong thi moi retry lai nhieu api loi truoc do
let refreshTokenPromise = null


// Interceptor response
authorizeAxiosInstance.interceptors.response.use(
  (response) => {
    interceptorLoadingElements(false)
    return response
  },
  (error) => {
    interceptorLoadingElements(false)

    // Xu ly refresh token tu dong
    // TH1: Neu nhan ma 401 tu BE, goi api dang xuat
    if (error.response?.status === 401) {
      axiosReduxStore.dispatch(logoutUserAPI(false))
    }

    // TH2: Neu nhan ma 410 tu BE, goi api refresh token de lam moi access token
    // B1: Lay cac request api dang bi loi thong qua error.config
    const originalRequest = error.config
    if (error.response?.status === 410 && !originalRequest._retry) {
      // Gan them mot gia tri _retry luon = true trong khoang thoi gian cho, dam bao viec refresh token nay chi luon goi 1 lan tai 1 thoi diem
      originalRequest._retry = true

      // Kiem tra xem neu chua co refreshTokenPromise thi thuc hien gan viec goi api refresh_token, dong thoi gan vao cho cai refreshTokenPromise
      if (!refreshTokenPromise) {
        refreshTokenPromise = refreshTokenAPI()
          .then(data => {
            // Dong thoi access token da nam trong httpOnly cookie
            return data?.accessToken
          })
          .catch((_error) => {
            // Neu nhan bat ky loi nao tu api refresh token, thi logout
            axiosReduxStore.dispatch(logoutUserAPI(false))
            return Promise.reject(_error)
          })
          .finally(() => {
            // Du api ok hay loi thi van phai gan lai refreshTokenPromise = null
            refreshTokenPromise = null
          })
      }

      // Can return truong hop refreshTokenPromise chay thanh cong va xu ly them o day:
      // eslint-disable-next-line no-unused-vars
      return refreshTokenPromise.then(accessToken => {
        /**
         * B1: Doi voi truong hop neu du an can luu accesstoken vao localstorage thi se viet them code o day. Hien tai du an khong can vi access token da nam trong httpOnly cookie (xu ly phia BE)
         *
         * B2: Sau khi refresh token thanh cong, retry lai request bi loi truoc do bang cach goi lai authorizeAxiosInstance(originalRequest)
         */
        return authorizeAxiosInstance(originalRequest)
      })
    }
    // Xu ly tap trung phan hien thi thong bao loi tu moi api


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