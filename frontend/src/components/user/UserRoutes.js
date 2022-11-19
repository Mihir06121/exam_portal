import { Navigate } from "react-router-dom";
import { isAuthenticated } from "../../actions/auth";

const UserRoute = ({children}) => {
    // const location = useLocation()
    const auth = isAuthenticated()
    // console.log("Auth", auth.user.role)

    if (auth === false || !auth) {
        return <Navigate to="/login"/>
    }
    if (auth.user.role === 1) {
        return <Navigate to="/admin/dashboard"/>
    }
    return children
}

export default UserRoute