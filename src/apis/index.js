import { toast } from 'react-toastify'
import authorizeAxiosInstance from '~/utils/authorizeAxios'
import { API_ROOT } from '~/utils/constants'

/**
 * Chung ta se khong can try/catch doi voi moi request boi no se gay ra viec du thua code catch loi qua nhieu
 * Giai phap clean code la se xu ly loi tap trung tai mot noi bang cach tan dung interceptor cua axios - Interceptor la cach ma chung ta se danh chan giua request va response de xu ly logic ma chung ta muon
 */

export const updateBoardDetailsAPI = async (boardId, updateData) => {
  const response = await authorizeAxiosInstance.put(`${API_ROOT}/v1/boards/${boardId}`, updateData)
  return response.data
}

export const moveCardToDifferentColumnAPI = async (updateData) => {
  const response = await authorizeAxiosInstance.put(`${API_ROOT}/v1/boards/supports/moving_card`, updateData)
  return response.data
}

export const fetchBoardsAPI = async (searchPath) => {
  const response = await authorizeAxiosInstance.get(`${API_ROOT}/v1/boards${searchPath}`)
  return response.data
}

export const createNewBoardAPI = async (data) => {
  const response = await authorizeAxiosInstance.post(`${API_ROOT}/v1/boards`, data)
  toast.success('Create new board successfully!')
  return response.data
}

// COLUMN API
export const createNewColumnAPI = async (newColumnData) => {
  const response = await authorizeAxiosInstance.post(`${API_ROOT}/v1/columns`, newColumnData)
  return response.data
}

export const updateColumnDetailsAPI = async (columnId, updateData) => {
  const response = await authorizeAxiosInstance.put(`${API_ROOT}/v1/columns/${columnId}`, updateData)
  return response.data
}

export const deleteColumnDetailsAPI = async (columnId) => {
  const response = await authorizeAxiosInstance.delete(`${API_ROOT}/v1/columns/${columnId}`)
  return response.data
}

// CARD API
export const createNewCardAPI = async (newCardData) => {
  const response = await authorizeAxiosInstance.post(`${API_ROOT}/v1/cards`, newCardData)
  return response.data
}

export const updateCardDetailsAPI = async (cardId, updateData) => {
  const response = await authorizeAxiosInstance.put(`${API_ROOT}/v1/cards/${cardId}`, updateData)
  return response.data
}

// USERS
export const registerUserAPI = async (data) => {
  const response = await authorizeAxiosInstance.post(`${API_ROOT}/v1/users/register`, data)
  toast.success('Register successfully! Please check your email to verify your account.', { theme: 'colored' })
  return response.data
}

export const verifyUserAPI = async (data) => {
  const response = await authorizeAxiosInstance.put(`${API_ROOT}/v1/users/verify`, data)
  toast.success('Your account has been verified successfully! Now you can login to enjoy our services!', { theme: 'colored' })
  return response.data
}

export const refreshTokenAPI = async () => {
  const response = await authorizeAxiosInstance.get(`${API_ROOT}/v1/users/refresh_token`)
  return response.data
}