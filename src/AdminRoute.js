import { useContext } from "react"
import { Navigate } from "react-router-dom"
import { AuthContext } from "./context/AuthContext"


const AdminRoute = ({ children }) => {
    const { user, role } = useContext(AuthContext)
  
    if (!user) {
      return <Navigate to="/login" replace />
    }
  
    if (role !== "admin") {
      return <Navigate to="/" replace />
    }
  
    return children
  }

  export default AdminRoute