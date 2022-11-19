import { Link, Navigate } from "react-router-dom";
import { isAuthenticated,  authenticate, login } from "../actions/auth"

const Home = () => {

    const { user } = isAuthenticated();

    const redirectUser = () => {
            if (user && user.role === 2) {
                return <Navigate to='/admin/dashboard' />
            } 
            if (user && user.role === 1) {
                return <Navigate to='/sub-admin/dashboard' />
            }
            if (user && user.role === 0) {
                return <Navigate to='/user/dashboard' />
            }   
            if (user && user.role === 4) {
                return <Navigate to='/deactivated/dashboard' />
            }          
    };

    return (
        <div style={{height:"100vh"}} className="d-flex justify-content-center align-items-center">
            <div>
            <h1>Home</h1>
            <Link to="/login">Login</Link>
            <Link to="/register">Register</Link>
            {redirectUser()}
            </div>
        </div>
    )
}

export default Home