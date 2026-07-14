import { Routes, Route, Navigate } from 'react-router-dom'
import Board from '~/pages/Boards/_id'
import NotFound from '~/pages/404/NotFound'
import Auth from '~/pages/Auth/Auth'
import AccountVerification from '~/pages/Auth/AccountVerification'

function App() {
  return (
    <Routes>
      {/* Redirect route */}
      {/* replace={true}: thay the route /, co the hieu route / se khong con nam trong history cua Browser   */}
      <Route path='/' element={<Navigate to='/boards/6a51c33a11efab08e38df961' replace={true} />} />

      {/* Board route */}
      <Route path='/boards/:boardId' element={<Board />} />

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
