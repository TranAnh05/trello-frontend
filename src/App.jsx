import { Routes, Route, Navigate, Outlet } from 'react-router-dom'
import Board from '~/pages/Boards/_id'
import NotFound from '~/pages/404/NotFound'
import Auth from '~/pages/Auth/Auth'
import AccountVerification from '~/pages/Auth/AccountVerification'
import { useSelector } from 'react-redux'
import { selectCurrentUser } from '~/redux/user/userSlice.js'

// Cach 2 - Dieu huong user dua tren trang thai dang nhap
const ProtectedRoute = ({ user }) => {
  if (!user) return <Navigate to='/login' replace={true} />
  return <Outlet />
}

function App() {
  const currentUser = useSelector(selectCurrentUser)

  return (
    <Routes>
      {/* Redirect route */}
      {/* replace={true}: thay the route /, co the hieu route / se khong con nam trong history cua Browser   */}
      <Route path='/' element={<Navigate to='/boards/6a51c33a11efab08e38df961' replace={true} />} />

      {/*
        ProtectedRoute: chi cho phep user da dang nhap truy cap vao cac route con ben trong
        Outlet: se render cac child route ben trong cua ProtectedRoute
        => clean code
      */}
      <Route element={<ProtectedRoute user={currentUser} />}>
        {/* Board route */}
        <Route path='/boards/:boardId' element={<Board />} />
      </Route>

      {/* Authentication route */}
      <Route path='login' element={<Auth />} />
      <Route path='register' element={<Auth />} />
      <Route path='/account/verification' element={<AccountVerification />} />

      {/*
        Not found page - 404
        Neu khong match bat ky route nao o tren thi se vao route nay
      */}
      <Route path='*' element={<NotFound />} />
    </Routes>
  )
}

export default App
