import { useState } from "react"
import { Link, Navigate, useNavigate } from "react-router-dom"
import {TextField} from "@mui/material"
// import axios from "axios"
import { register } from "../../actions/auth"
import CircularProgress from '@mui/material/CircularProgress';
import { authenticate, isAuthenticated } from "../../actions/auth";

const Register = () => {

    const navigate = useNavigate();

    const [values, setValues] = useState({
        firstName: 'test',
        lastName: 'test',
        middleName: 'test',
        email: 'test@gmail.com',
        password: '12345678',
        error: '',
        success: false
    });

    const { firstName, lastName, middleName, email, password, error, success } = values;
    // const { user } = isAuthenticated();

    const emailRegex = /\S+@\S+\.\S+/;

    const handleRegister = (email, password, firstName, lastName, middleName) => {
        console.log(email, password)
        if (email === '' || password === '', firstName === '', lastName === '', middleName === '') {
            return setValues({...values, error: 'All fields are required'})
        }
        if(emailRegex.test(email)) {
            const user = { firstName, lastName, middleName, email, password };
            register(user).then(res => {
                if (res.error) {
                   return setValues({...values, error: res.error})
                }
                if (res) {
                    navigate('/login')
                    // return <Navigate to="/" />
                }
            }).catch(err => {
                console.log(err)
            })
        } else {
            // setError('Please enter valid email')
            setValues({...values, error: 'Please enter valid email', success: false})
        }
    }

    const redirectUser = () => {
        if (success) {
            console.log(success)
            navigate('/login')
        }
    };

    const handleChange = name => event => {
        setValues({ ...values, error: '', [name]: event.target.value });
    };

    return (
        <div style={{height:"100vh"}} className="d-flex justify-content-center align-items-center">
            <div className="col-md-4">
            <h1 className="text-primary display-1">Register</h1>
                <div className="">
                    <form onSubmit={() => handleRegister(email, password)}>
                        <div className="form-group py-2">
                            <TextField 
                            className="w-100"
                                error={error === "" ? false : true}
                                id="standard-basic" 
                                type="test"
                                label={error === '' ? "First Name" : error} 
                                value={firstName}
                                required={true}
                                variant="standard" 
                                onChange={handleChange('firstName')}
                            />
                        </div>
                        <div className="form-group py-2">
                            <TextField 
                            className="w-100"
                                error={error === "" ? false : true}
                                id="standard-basic" 
                                type="text"
                                label={error === '' ? "Middle Name" : error} 
                                value={middleName}
                                required={true}
                                variant="standard" 
                                onChange={handleChange('middleName')}
                            />
                        </div>
                        <div className="form-group py-2">
                            <TextField 
                            className="w-100"
                                error={error === "" ? false : true}
                                id="standard-basic" 
                                type="text"
                                label={error === '' ? "Last Name" : error} 
                                value={lastName}
                                required={true}
                                variant="standard" 
                                onChange={handleChange('lastName')}
                            />
                        </div>
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
                <div className="py-3 d-flex justify-content-between align-items-center">
                    <div>
                        <Link style={{textDecoration: 'none'}} className="text-primary" to="/login">Already have account Login</Link>
                    </div>
                    <div>
                    {success === true ? <div align="center"><CircularProgress size={30} /></div>: 
                        <button onClick={() => handleRegister(email, password, firstName, lastName, middleName)} className="btn btn-outline-primary">
                            Register
                        </button>}
                    </div>
                </div>
            </div>
            {redirectUser()}
        </div>
    )
}

export default Register