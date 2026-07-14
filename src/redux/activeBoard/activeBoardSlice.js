import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import authorizeAxiosInstance from '~/utils/authorizeAxios'
import { API_ROOT } from '~/utils/constants'
import { isEmpty } from 'lodash'
import { mapOrder } from '~/utils/sorts'
import { generatePlaceholderCard } from '~/utils/formatters'

// Khoi tao gia tri cua mot slice trong Redux
const initialState = {
  currentActiveBoard: null
}

// Cac actions call api (bat dong bo) va cap nhat du lieu vao redux, dung middleware createAsyncThunk() di kem voi extraReducers
// Khoi tao mot slice trong kho luu tru Redux Store
export const fetchBoardDetailsAPI = createAsyncThunk(
  'activeBoard/fetchBoardDetailsAPI',
  async (boardId) => {
    const response = await authorizeAxiosInstance.get(`${API_ROOT}/v1/boards/${boardId}`)
    return response.data
  }
)


export const activeBoardSlice = createSlice({
  name: 'activeBoard',
  initialState,
  // Noi xu ly du lieu dong bo
  reducers: {
    updateCurrentActiveBoard: (state, action) => {
      // Payload: nhan du lieu tu action va dua vao reducer
      const board = action.payload

      // Xu ly du lieu neu can thiet

      // Update lai du lieu cua currentActiveBoard
      state.currentActiveBoard = board
    }
  },
  extraReducers: (builder) => {
    builder.addCase(fetchBoardDetailsAPI.fulfilled, (state, action) => {
      // action.payload chinh la response.data tu API tra ve
      let board = action.payload

      // Xu ly du lieu
      board.columns = mapOrder(board.columns, board.columnOrderIds, '_id')

      board.columns.forEach(column => {
        if (isEmpty(column.cards)) {
          column.cards = [generatePlaceholderCard(column)]
          column.cardOrderIds = [generatePlaceholderCard(column)._id]
        } else {
          // Sap xep thu tu cac card truoc khi dua du lieu xuong ben duoi
          column.cards = mapOrder(column.cards, column.cardOrderIds, '_id')
        }
      })

      state.currentActiveBoard = board
    })
  }
})

// Actions: la noi danh cho cac components ben duoi goi bang dispatch() toi no de cap nhat lai du lieu thong qua reducer (chay dong bo)
export const { updateCurrentActiveBoard } = activeBoardSlice.actions

// selectors: la noi danh cho cac components ben duoi goi bang hook useSelector() de lay du lieu tu kho redux ra su dung
export const selectCurrentActiveBoard = (state) => {
  return state.activeBoard.currentActiveBoard
}

export const activeBoardReducer = activeBoardSlice.reducer