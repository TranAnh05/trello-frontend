import { useEffect, useState } from 'react'
import { useSearchParams, Navigate } from 'react-router-dom'
import PageLoadingSpinner from '~/components/Loading/PageLoadingSpinner'
import { verifyUserAPI } from '~/apis'


function AccountVerification() {
  // lay email va token tu url
  let [searchParams] = useSearchParams()
  // Cach 1
  // const email = searchParams.get('email')
  // const token = searchParams.get('token')

  // Cach 2
  const { email, token } = Object.fromEntries([...searchParams])

  const [verified, setVerified] = useState(false)

  // call api verify account
  useEffect(() => {
    if (email && token) {
      verifyUserAPI({ email, token }).then(() => setVerified(true))
    }
  }, [email, token])

  // Neu url khong co email va token thi redirect ve trang 404
  if (!email || !token) {
    return <Navigate to="/404" />
  }

  // Neu chua verify xong thi hien loading
  if (!verified) {
    return <PageLoadingSpinner caption="Verifying your account..." />
  }

  // verify thanh cong thi redirect ve trang login kem verifiedEmail
  return <Navigate to={`/login?verifiedEmail=${email}`}/>
}

export default AccountVerification