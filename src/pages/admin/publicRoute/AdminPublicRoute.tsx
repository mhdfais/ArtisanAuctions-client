import { RootState } from '@/redux/store/store'
import { JSX } from 'react'
import { useSelector } from 'react-redux'
import { Navigate } from 'react-router-dom'

const AdminPublicRoute = ({ children }: { children: JSX.Element }) => {
    const isLoggedIn=useSelector((state:RootState)=>state.adminAuth.isAdminLoggedIn)
    return isLoggedIn?<Navigate to='/admin/dashboard' />:children
}

export default AdminPublicRoute