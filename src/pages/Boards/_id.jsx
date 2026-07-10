
import Container from '@mui/material/Container'
import AppBar from '~/components/AppBar/AppBar'
import BoardBar from './BoardBar/BoardBar'
import BoardContent from './BoardContent/BoardContent'
import { mockData as data } from '~/apis/mock-data'
import { useEffect, useState } from 'react'
import { fetchBoardDetailsAPI } from '~/apis'

function Board() {
  const [board, setBoard] = useState(null)

  useEffect(() => {
    // Tam thoi set cung
    const boardId = '6a4fc0343782de72f94e13bc'
    // call api
    fetchBoardDetailsAPI(boardId)
      .then((data) => {
        setBoard(data)
      })
  }, [])

  return (
    <Container disableGutters maxWidth={false} sx={{ height: '100vh' }}>
      <AppBar />
      <BoardBar board={data.board} />
      <BoardContent board={data.board} />
    </Container>
  )
}

export default Board