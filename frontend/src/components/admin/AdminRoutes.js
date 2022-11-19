import { Navigate } from "react-router-dom";
import { isAuthenticated } from "../../actions/auth";

const AdminRoute = ({children}) => {
    const auth = isAuthenticated()

    if (auth === false) {
        return <Navigate to="/login" />
    }
    if (auth.user.role === 0) {
        return <Navigate to="/user/dashboard"  />
    }
    if (auth.user.role === 1) {
        return <Navigate to ="/sub-admin/dashboard" />
    }
    if (auth.user.role === 4) {
        return <Navigate to ="/deactivated/dashboard" />
    }
    return children
}

export default AdminRoute