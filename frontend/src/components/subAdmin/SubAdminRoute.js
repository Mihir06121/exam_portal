import { Navigate } from "react-router-dom";
import { isAuthenticated } from "../../actions/auth";

const SubAdminRoute = ({children}) => {
    const auth = isAuthenticated()
    // console.log(auth)

    if (auth === false) {
        return <Navigate to="/login" />
    }
    if (auth.user.role === 2) {
        return <Navigate to="/admin/dashboard"  />
    }
    if (auth.user.role === 0) {
        return <Navigate to="/user/dashboard"  />
    }
    if (auth.user.role === 4) {
        return <Navigate to ="/deactivated/dashboard" />
    }
    return children
}

export default SubAdminRoute