
import Box from '@mui/material/Box'
import ListColumn from './ListColumns/ListColumns'
import { mapOrder } from '~/utils/sorts'
import { useState, useEffect, useCallback, useRef } from 'react'
import { arrayMove } from '@dnd-kit/sortable'
import {
  DndContext,
  // PointerSensor,
  MouseSensor,
  TouchSensor,
  useSensor,
  useSensors,
  DragOverlay,
  defaultDropAnimationSideEffects,
  closestCorners,
  pointerWithin,
  // rectIntersection,
  getFirstCollision
  // closestCenter
} from '@dnd-kit/core'
import Column from './ListColumns/Column/Column'
import Card from './ListColumns/Column/ListCards/Card/Card'
import { cloneDeep, isEmpty } from 'lodash'
import { generatePlaceholderCard } from '~/utils/formatters'

const ACTIVE_DRAG_ITEM_TYPE = {
  COLUMN: 'ACTIVE_DRAG_ITEM_TYPE_COLUMN',
  CARD: 'ACTIVE_DRAG_ITEM_TYPE_CARD'
}

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

  // Cung mot thoi diem chi co mot phan tu dang duoc keo (column hoac card)
  const [activeDragItemId, setActiveDragItemId] = useState(null)
  const [activeDragItemType, setActiveDragItemType] = useState(null)
  const [activeDragItemData, setActiveDragItemData] = useState(null)
  const [oldColumn, setOldColumn] = useState(null)

  // Diem va cham cuoi cung truoc do (xu ly thuat toan phat hien va cham)
  const lastOverId = useRef(null)

  useEffect(() => {
    setOrderedColumns(mapOrder(board?.columns, board?.columnOrderIds, '_id'))
  }, [board])

  const findColumnByCardId = (cardId) => {
    // Dung c.cards thay vi c.cardOrderIds vi o buoc handleDragOver chung ta se lam du lieu cho cards
    // hoan chinh truoc roi moi tao ra cardOrderIds moi.
    return orderedColumns.find(column => column.cards.map(card => card._id)?.includes(cardId))
  }

  // Ham xu ly cap nhat lai state khi keo card tu column nay sang column khac
  const moveCardBetweenColumns = (
    active,
    over,
    overColumn,
    overCardId,
    activeColumn,
    activeDraggingCardId,
    activeDraggingCardData
  ) => {
    setOrderedColumns(prevColumns => {
      // Tim vi tri cua cai overcard trong column dich (noi card sap duoc tha)
      const overCardIndex = overColumn?.cards?.findIndex(card => card._id === overCardId)

      // logic tinh toan cardindex moi (tren hoac duoi cua overcard)
      // Logic tren duoc lay ra tu thu vien
      let newCardIndex
      // Kiem tra xem card dang duoc keo co nam duoi card dang tuong tac hay khong. Neu co thi moi cong them 1 vao index cua overcard de dat card dang keo o duoi overcard
      const isBelowOverItem = active.rect.current.translated &&
        active.rect.current.translated.top > over.rect.top + over.rect.height
      const modifier = isBelowOverItem ? 1 : 0
      // Neu overcardIndex >= 0 thi moi cong them modifier vao. Neu khong thi dat newCardIndex = so luong card trong column dich + 1 (them vao cuoi)
      newCardIndex = overCardIndex >= 0 ? overCardIndex + modifier : overColumn?.cards?.length + 1

      // clone mang orderedColumnsState cu ra mot cai moi de xu ly data roi return - cap nhat lai
      // orderedColumnsState moi.
      const nextColumns = cloneDeep(prevColumns)
      const nextActiveColumn = nextColumns.find(c => c._id === activeColumn._id)
      const nextOverColumn = nextColumns.find(c => c._id === overColumn._id)

      if (nextActiveColumn) {
        // Xoa card o column active (da keo di thi phai xoa no di)
        nextActiveColumn.cards = nextActiveColumn.cards.filter(card => card._id !== activeDraggingCardId)

        // Them placeholder card vao column active neu column active dang rong
        if (isEmpty(nextActiveColumn.cards)) {
          nextActiveColumn.cards = [generatePlaceholderCard(nextActiveColumn)]
        }

        // Cap nhat lai cardOrderIds moi cho column active
        nextActiveColumn.cardOrderIds = nextActiveColumn.cards.map(card => card._id)
      }

      if (nextOverColumn) {
        // Kiem tra xem card dang duoc keo co nam trong column dich hay khong. Neu co thi xoa no di de tranh bi duplicate
        nextOverColumn.cards = nextOverColumn.cards.filter(card => card._id !== activeDraggingCardId)

        // Phai cap nhat lai columnId cua card sau khi keo sang column khac.
        const rebuild_activeDraggingCardData = {
          ...activeDraggingCardData,
          columnId: nextOverColumn._id
        }

        // Them card dang keo vao column dich (overColumn) o vi tri moi tinh toan duoc (newCardIndex)
        nextOverColumn.cards = nextOverColumn.cards.toSpliced(newCardIndex, 0, rebuild_activeDraggingCardData)

        // Xoa placeholder card trong column di khi co card moi duoc them vao
        nextOverColumn.cards = nextOverColumn.cards.filter(card => !card?.FE_PlaceholderCard)

        // Cap nhat lai cardOrderIds moi cho column over
        nextOverColumn.cardOrderIds = nextOverColumn.cards.map(card => card._id)
      }

      return nextColumns
    })
  }

  const handleDragStart = (event) => {
    setActiveDragItemId(event?.active?.id)
    setActiveDragItemType(event?.active?.data?.current?.columnId ? ACTIVE_DRAG_ITEM_TYPE.CARD : ACTIVE_DRAG_ITEM_TYPE.COLUMN)
    setActiveDragItemData(event?.active?.data?.current)

    // Neu dang keo card thi luu lai column cu de
    if (event?.active?.data?.current?.columnId) {
      setOldColumn(findColumnByCardId(event?.active?.id))
    }
  }

  const handleDragOver = (event) => {
    // Khong lam gi khi keo column
    if (activeDragItemType === ACTIVE_DRAG_ITEM_TYPE.COLUMN) return

    const { active, over } = event

    if (!active || !over) return

    const { id: activeDraggingCardId, data: { current: activeDraggingCardData } } = active
    // overCard: card dang tuong tac tren hoac duoi so voi cai dang duoc keo
    const { id: overCardId } = over

    // Tim 2 column theo cardId
    const activeColumn = findColumnByCardId(activeDraggingCardId)
    const overColumn = findColumnByCardId(overCardId)

    // Neu khong tim thay 1 trong 2 column thi khong lam gi ca
    if (!activeColumn || !overColumn) return

    // Chi khi 2 keo card qua 2 column khac nhau thi moi chay vao logic ben duoi
    // Day la giai doan xu ly luc keo (over), con xu ly luc tha (end) thi se do handleDragEnd xu ly
    if (activeColumn._id !== overColumn._id) {
      moveCardBetweenColumns(active, over, overColumn, overCardId, activeColumn, activeDraggingCardId, activeDraggingCardData)
    }
  }

  const handleDragEnd = (event) => {
    const { active, over } = event

    // Neu keo ra ngoai column thi khong lam gi ca
    if (!active || !over) return

    // Xu ly keo tha card
    if (activeDragItemType === ACTIVE_DRAG_ITEM_TYPE.CARD) {
      const { id: activeDraggingCardId, data: { current: activeDraggingCardData } } = active
      // overCard: card dang tuong tac tren hoac duoi so voi cai dang duoc keo
      const { id: overCardId } = over

      // Tim 2 column theo cardId
      const activeColumn = findColumnByCardId(activeDraggingCardId)
      const overColumn = findColumnByCardId(overCardId)

      // Neu khong tim thay 1 trong 2 column thi khong lam gi ca
      if (!activeColumn || !overColumn) return

      // Phai dung oldColumn set vao startDrag de lay duoc column cu truoc khi keo. Vi luc keo (over) thi column cu da bi thay doi (da bi setState) roi nen khong dung duoc
      if (oldColumn._id !== overColumn._id) {
        moveCardBetweenColumns(active, over, overColumn, overCardId, activeColumn, activeDraggingCardId, activeDraggingCardData)
      } else {
        // Keo card trong cung mot column
        // Lay vi tri cu tu old column
        const oldCardIndex = oldColumn?.cards?.findIndex(c => c._id === activeDragItemId)
        // Lay vi tri moi tu column over
        const newCardIndex = overColumn?.cards?.findIndex(c => c._id === overCardId)
        // Su dung arrayMove de sap xep lai orderedCards theo vi tri moi
        const dndOrderedCards = arrayMove(oldColumn?.cards, oldCardIndex, newCardIndex)

        //
        setOrderedColumns(prevColumns => {
          const nextColumns = cloneDeep(prevColumns)

          // Tim toi column ma chung ta dang tha
          const targetColumn = nextColumns.find(c => c._id === overColumn._id)

          // Cap nhat lai card va cardOrderIds cua column do
          targetColumn.cards = dndOrderedCards
          targetColumn.cardOrderIds = dndOrderedCards.map(c => c._id)

          return nextColumns
        })

      }
    }

    // Xu ly keo tha column
    if (activeDragItemType === ACTIVE_DRAG_ITEM_TYPE.COLUMN) {
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

    setActiveDragItemId(null)
    setActiveDragItemType(null)
    setActiveDragItemData(null)
    setOldColumn(null)
  }

  const customDropAnimation = {
    sideEffect: defaultDropAnimationSideEffects({ styles: { active: { opacity: 0.5 } } })
  }

  const collisionDetectionStrategy = useCallback((args) => {
    // Neu dang keo column thi dung closestCorners
    if (activeDragItemType === ACTIVE_DRAG_ITEM_TYPE.COLUMN) {
      return closestCorners({ ...args })
    }

    // Tim cac diem giao nhau, va cham - intersections voi con tro
    const pointerIntersections = pointerWithin(args)

    // Fix bug flickering trong truong hop:
    // - Keo mot card co media cover lon va keo len phia tren cung ra khoi khu vuc keo tha
    if (!pointerIntersections?.length) return

    // Thuat toan phat hien va cham se tra ve cac va cham
    // const intersections = pointerIntersections?.length > 0
    //   ? pointerIntersections
    //   : rectIntersection(args)

    // Tim overId dau tien trong cac intersections o tren
    let overId = getFirstCollision(pointerIntersections, 'id')
    if (overId) {
      // Neu cai over la column thi se tim toi cai cardId gan nhat ben trong khu vuc va cham do dua vao thuat toan phat hien va cham closestCorners hoac closestCenter. Tuy nhien closestCorners se muot ma hon
      const checkColumn = orderedColumns.find(c => c._id === overId)
      if (checkColumn) {
        overId = closestCorners({
          ...args,
          droppableContainers: args.droppableContainers.filter(container => {
            return (container.id !== overId) && (checkColumn?.cardOrderIds?.includes(container.id))
          })
        })[0]?.id
      }

      lastOverId.current = overId
      return [{ id: overId }]
    }

    // Neu overId la null thi tra ve mang rong - tranh crash trang
    return lastOverId.current ? [{ id: lastOverId.current }] : []
  }, [activeDragItemType, orderedColumns])

  return (
    <DndContext
      sensors={sensors}
      // collisionDetection={closestCorners}
      collisionDetection={collisionDetectionStrategy}
      onDragStart={handleDragStart}
      onDragOver={handleDragOver}
      onDragEnd={handleDragEnd}
    >
      <Box sx={{
        bgcolor: ( theme ) => (theme.palette.mode === 'dark' ? '#34495e' : '#1976d2'),
        width: '100%',
        height: (theme) => theme.trello.boardContentHeight,
        p: '10px 0'
      }}>
        <ListColumn columns={orderedColumns} />
        <DragOverlay dropAnimation={customDropAnimation}>
          {!activeDragItemType && null}
          {(activeDragItemType === ACTIVE_DRAG_ITEM_TYPE.COLUMN) &&
            <Column column={activeDragItemData} />
          }
          {(activeDragItemType === ACTIVE_DRAG_ITEM_TYPE.CARD) &&
            <Card card={activeDragItemData} />
          }
        </DragOverlay>
      </Box>
    </DndContext>
  )
}

export default BoardContent