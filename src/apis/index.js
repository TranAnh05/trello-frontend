import axios from 'axios'
import { API_ROOT } from '~/utils/constants'

/**
 * Chung ta se khong can try/catch doi voi moi request boi no se gay ra viec du thua code catch loi qua nhieu
 * Giai phap clean code la se xu ly loi tap trung tai mot noi bang cach tan dung interceptor cua axios - Interceptor la 
 * cach ma chung ta se danh chan giua request va response de xu ly logic ma chung ta muon
 */

export const fetchBoardDetailsAPI = async (boardId) => {
  const response = await axios.get(`${API_ROOT}/v1/boards/${boardId}`)
  return response.data
}