import { useState } from "react"
import { Link, Navigate } from "react-router-dom"
import {TextField} from "@mui/material"
// import axios from "axios"
import { isAuthenticated,  authenticate, login, loginSubAdmin } from "../../actions/auth"

const Login = () => {

    const [values, setValues] = useState({
        name: '',
        email: '',
        password: '',
        error: '',
        errorMessage: '',
        success: false
    });

    const { email, password, error, success, errorMessage } = values;

    const { user } = isAuthenticated();

    const emailRegex = /\S+@\S+\.\S+/;

    const handleLogin = (email, password) => {
        if (email === '' || password === '') {
            return setValues({...values, error: 'All fields are required'})
        }
        if(emailRegex.test(email)) {
            const user = { email, password };
            login(user).then(res => {
                if (res.error) {
                   return setValues({...values, errorMessage: res.error})
                } else {
                    authenticate(res, () => {
                        setValues({
                            ...values,
                            email: '',
                            password: '',
                            error: '',
                            success: true
                        });
                    })
                }
            }).catch(err => {
                console.log(err)
            })
        } else {
            setValues({...values, error: 'Please enter valid email', success: false})
        }
    }

    const handleSubAdminLogin = (email, password) => {
        if (email === '' || password === '') {
            return setValues({...values, error: 'All fields are required'})
        }
        if(emailRegex.test(email)) {
            const user = { email, password };
            loginSubAdmin(user).then(res => {
                if (res.error) {
                   return setValues({...values, errorMessage: res.error})
                } else {
                    authenticate(res, () => {
                        setValues({
                            ...values,
                            email: '',
                            password: '',
                            error: '',
                            success: true
                        });
                    })
                }
            }).catch(err => {
                console.log(err)
            })
        } else {
            setValues({...values, error: 'Please enter valid email', success: false})
        }
    }

    const redirectUser = () => {
        if (success) {
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
        }
        if (isAuthenticated()){
            return <Navigate to="/" />;
        }
    };

    const handleChange = name => event => {
        setValues({ ...values, error: '', errorMessage: '', [name]: event.target.value });
    };

    return (
        <div style={{height:"100vh"}} className="d-flex justify-content-center align-items-center">
            <div className="col-md-4">
            <h1 className="text-primary display-1">Login</h1>
                <div className="">
                    <form onSubmit={() => handleLogin(email, password)}>
                        <div className="form-group py-2">
                            <TextField 
                            className="w-100"
                                error={error === "" ? false : true}
                                id="standard-basic" 
                                type="email"
                                label={error === '' ? "Email" : error} 
                                value={email}
                                required={true}
                                variant="standard" 
                                onChange={handleChange('email')}
                            />
                        </div>
                        <div className="form-group py-2">
                            <TextField 
                            className="w-100"
                            error={error === "" ? false : true}
                                id="standard-basic" 
                                type="password"
                                label={error === '' ? "Password" : error} 
                                value={password}
                                required={true}
                                variant="standard" 
                                onChange={handleChange('password')}
                            />
                        </div>
                    </form>
                </div>
                {errorMessage !== "" ? <div className="text-danger text-center">{errorMessage}</div> : null}
                <div className="py-3 d-flex justify-content-around align-items-center">
                        <button onClick={() => handleLogin(email, password)} className="btn btn-outline-danger">Login as Admin/Sub-Admin</button>
                        <button onClick={() => handleSubAdminLogin(email, password)} className="btn btn-outline-success">
                            Login as Center
                        </button>
                </div>
                <div className="text-center">
                    <Link style={{textDecoration: 'none'}} className="text-primary" to="/register">Don't have account Register</Link>
                </div>
            </div>
            {redirectUser()}
        </div>
    )
}

export default Login