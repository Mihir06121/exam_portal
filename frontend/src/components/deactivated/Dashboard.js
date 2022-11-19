import { useState } from "react";
import ImageUpload from './ImageUpload'
import PanCardUpload from './PanCardUpload'
import CvUpload from './CvUpload'
// import FormControl from '@mui/material/FormControl';
// import Select from '@mui/material/Select';
// import InputLabel from '@mui/material/InputLabel';
// import MenuItem from '@mui/material/MenuItem';
import { Link } from 'react-router-dom';
import CancelledChequeUpload from './CancelledChequeUpload' 
import DeactivatedRoute from "./DeactivatedRoutes"
import { isAuthenticated, updateDeactivatedData, logout } from "../../actions/auth";
import {TextField} from "@mui/material"
import { City }  from 'country-state-city';

const Dashboard = () => {

    const { user } = isAuthenticated();

    const selectCity = City.getAllCities()

    const [values, setValues] = useState({
        firstName: user.firstName,
        lastName: user.lastName,
        middleName: user.middleName,
        email: user.email,
        fullAddress: 'test Add',
        cityName: 'test',
        adhaarCard: {},
        panCard: {},
        cv:{},
        CancelledCheque:{},
        error: '',
        success: false
    });

    const { firstName, lastName, middleName, email, error, adhaarCard, panCard, cv, CancelledCheque, cityName, fullAddress, success } = values;

    const handleChange = name => event => {
        setValues({ ...values, error: '', [name]: event.target.value, error: '', success: false });
    };

    const handleSubmit = (data={
        firstName, lastName, middleName, email, adhaarCard, panCard, cv, CancelledCheque, cityName, fullAddress
    }) => {
        updateDeactivatedData(data).then(res => {
            // console.log(res)
            if (res.error) {
                setValues({...values, error: error})
            }
            if (res) {
                setValues({...values, success: true})
            }
        })
    }

    return (
        <DeactivatedRoute>
            <div className="mx-auto">
                <div align="right" className="p-3 justify-content-center">
                    <Link onClick={() => logout()} to="/login" className='px-2 btn btn-sm btn-danger'>Logout</Link>
                </div>
                {success ? <div align="center" className="mx-auto text-success">Data uploaded successfull wait for the verification.</div> : <div>
                        <h3 align='center' className="text-danger py-md-3 p-2">Please Ensure the data uploaded is authentic, this will speed the verification process. </h3>
                    </div>}
                <div className="p-md-5 py-5 mx-auto col-md-10 col-10 row">
                    <div className="px-3 col-md">
                    <form>
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
                                type="text"
                                label={error === '' ? "Full Address" : error} 
                                value={fullAddress}
                                required={true}
                                variant="standard" 
                                onChange={handleChange('fullAddress')}
                            />
                        </div>
                        <div className="form-group py-2">
                            <TextField 
                            className="w-100"
                                error={error === "" ? false : true}
                                id="standard-basic" 
                                type="text"
                                label={error === '' ? "City Name" : error} 
                                value={cityName}
                                required={true}
                                variant="standard" 
                                onChange={handleChange('cityName')}
                            />
                        </div>
                        {/* <div className="form-group py-2">
                            <FormControl sx={{minWidth: '100%' }} size="small">
                                <InputLabel id="demo-select-small">Location State</InputLabel>
                                <Select
                                    labelId="demo-select-small"
                                    id="demo-select-small"
                                    multiple={false}
                                    value={cityName}
                                    label="City Name"
                                    onChange={handleChange('cityName')}
                                >
                                    {selectCity.length !== 0 ? (
                                        selectCity.map((s, i) => (
                                            <MenuItem key={i} value={s.name}>{s.name}</MenuItem>
                                        ))
                                    ) : null}
                                </Select>
                            </FormControl>
                        </div> */}
                    </form>
                    </div>
                    <div className="mx-auto col-md row">
                        <div className="col-md">
                            <div className="px-2 col-md">
                                <ImageUpload
                                    values={values}
                                    setValues={setValues}
                                />
                            </div>
                            <div className="px-2 col-md">
                                <PanCardUpload
                                    values={values}
                                    setValues={setValues}
                                />
                            </div>
                        </div>
                        <div className="col-md">
                            <div className="px-2 col-md">
                                <CvUpload
                                    values={values}
                                    setValues={setValues}
                                />
                            </div>
                            <div className="px-2 col-md">
                                <CancelledChequeUpload
                                    values={values}
                                    setValues={setValues}
                                />
                            </div>
                        </div>
                    </div>
                    <button onClick={() => handleSubmit({
                        firstName, lastName, middleName, email, adhaarCard, panCard, cv, CancelledCheque, cityName, fullAddress
                    })} className="mx-auto m-3 btn btn-sm btn-success">
                        Submit
                    </button>
                </div>
            </div>
        </DeactivatedRoute>
    )
}

export default Dashboard