import axios from 'axios'
import { API_ROOT } from '~/utils/constants'

/**
 * Chung ta se khong can try/catch doi voi moi request boi no se gay ra viec du thua code catch loi qua nhieu
 * Giai phap clean code la se xu ly loi tap trung tai mot noi bang cach tan dung interceptor cua axios - Interceptor la 
 * cach ma chung ta se danh chan giua request va response de xu ly logic ma chung ta muon
 */

// BOARD API
export const fetchBoardDetailsAPI = async (boardId) => {
  const response = await axios.get(`${API_ROOT}/v1/boards/${boardId}`)
  return response.data
}

export const updateBoardDetailsAPI = async (boardId, updateData) => {
  const response = await axios.put(`${API_ROOT}/v1/boards/${boardId}`, updateData)
  return response.data
}

// COLUMN API
export const createNewColumnAPI = async (newColumnData) => {
  const response = await axios.post(`${API_ROOT}/v1/columns`, newColumnData)
  return response.data
}

// CARD API
export const createNewCardAPI = async (newCardData) => {
  const response = await axios.post(`${API_ROOT}/v1/cards`, newCardData)
  return response.data
}