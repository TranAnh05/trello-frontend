
import Box from '@mui/material/Box'
import ListColumn from './ListColumns/ListColumns'
import { mapOrder } from '~/utils/sorts'
import { useState, useEffect } from 'react'
import { arrayMove } from '@dnd-kit/sortable'
import {
  DndContext,
  // PointerSensor,
  MouseSensor,
  TouchSensor,
  useSensor,
  useSensors
} from '@dnd-kit/core'

function BoardContent({ board }) {
  // Neu dung pointerSensor mac dinh thi phai ket hop thuoc tinh CSS touchAction: 'none' de tranh bi loi keo tha column tren mobile. Neu khong co touchAction thi khi keo tha column tren mobile se bi loi. Khi keo tha column tren mobile thi no se bi scroll theo trang web thay vi keo tha column
  // const pointerSensor = useSensor(PointerSensor, { activationConstraint: { distance: 10 } })
  // Yeu cau chuot di chuyen 10px thi moi kich hoat event. Fix truong hop click bi goi event
  const mouseSensor = useSensor(MouseSensor, { activationConstraint: { distance: 10 } })
  // Nhan giu 250ms va dung sai cua cam ung (di chuyen/chenh lech la 5px) thi moi kich hoat event. Toi uu cho mobile
  const touchSensor = useSensor(TouchSensor, { activationConstraint: { delay: 250, tolerance: 500 } })
  // const sensors = useSensors(pointerSensor)
  // Uu tien su dung 2 loai sensor de co trai nghiem tot nhat tren mobile, khong bi bug
  const sensors = useSensors(mouseSensor, touchSensor)

  const [orderedColumns, setOrderedColumns] = useState([])

  useEffect(() => {
    setOrderedColumns(mapOrder(board?.columns, board?.columnOrderIds, '_id'))
  }, [board])

  const handleDragEnd = (event) => {
    // console.log(event)
    const { active, over } = event

    // Neu keo ra ngoai column thi khong lam gi ca
    if (!over) return

    // Neu column active khac column over thi moi sap xep lai orderedColumns
    if (active.id !== over.id) {
      // Lay vi tri cu tu column active
      const oldIndex = orderedColumns.findIndex(c => c._id === active.id)
      // Lay vi tri moi tu column over
      const newIndex = orderedColumns.findIndex(c => c._id === over.id)
      // Su dung arrayMove de sap xep lai orderedColumns theo vi tri moi
      const dndOrderedColumns = arrayMove(orderedColumns, oldIndex, newIndex)
      // Luu mang id vao db
      // const dndOrderedColumnIds = dndOrderedColumns.map(c => c._id)
      setOrderedColumns(dndOrderedColumns)
    }
  }
  return (
    <DndContext onDragEnd={handleDragEnd} sensors={sensors}>
      <Box sx={{
        bgcolor: ( theme ) => (theme.palette.mode === 'dark' ? '#34495e' : '#1976d2'),
        width: '100%',
        height: (theme) => theme.trello.boardContentHeight,
        p: '10px 0'
      }}>
        <ListColumn columns={orderedColumns} />
      </Box>
    </DndContext>
  )
}

export default BoardContent