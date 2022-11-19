import { Navigate, useLocation } from "react-router-dom";
import { isAuthenticated } from "../actions/auth";

const RequireAuth = ({children}) => {
    const location = useLocation()
    const auth = isAuthenticated()
    console.log(auth)

    if (auth === false) {
        return <Navigate to="/login" />
    }
    return children
}

export default RequireAuth