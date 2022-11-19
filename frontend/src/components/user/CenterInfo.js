import { useState, useEffect } from "react"
import UserIndex from "."
import { getUserCenter, registerStudent, getCenterStudents, subscribeStudent, getCourses } from "../../actions/center"
import { isAuthenticated } from "../../actions/auth";
import { TextField } from "@mui/material";
import ImageUpload from '../deactivated/ImageUpload'
import PanCardUpload from '../deactivated/PanCardUpload'
import TenthMarkSheet from '../deactivated/TenthMarkSheetUpload'
import TwelfthMarsheet from '../deactivated/TwelfthMarksheet'
import GraduUpload from '../deactivated/GraduUpload'
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import Collapse from '@mui/material/Collapse';

const CenterInfo = () => {

    const [center, setCenter] = useState({})
    const [createdBy, setCreatedBy] = useState({})
    const { user } = isAuthenticated();
    const [refresh, setRefresh] = useState(false) 
    const [existingStudent, setExistingStudent] = useState(null)
    const [existRegisteredBy, setExistRegisteredBy] = useState({})
    const [open, setOpen] = useState(false)
    const [openRegister, setOpenRegister] = useState(false)
    const [courses, setCources] = useState([])
    const [viewStudent, setViewStudent] = useState({})
    useEffect(() => {
        getUserCenter(user._id).then(res => {
            setCenter(res)
            console.log(res)
            getCenterStudents(res._id).then(res => {
                setStudents(res.reverse())
            })
            setCreatedBy(res.createdBy)
        })

        getCourses().then(res => {
            setCources(res)
        })
    }, [refresh])

    const [students, setStudents] = useState([])
    // const [studentRegisteredBy, setStudentRegisterdBy] = useState({})

    const [values, setValues] = useState({
        firstName: 'student1',
        middleName: 'middle1',
        lastName: 'last1',
        mobileNumber: '1111111111',
        fullAddress: 'TestAdd',
        cityName:'Test',
        adhaarCard:{},
        panCard:{},
        tenthMarkSheet:{},
        twelfthMarsheet:{},
        graduationCertificate:{},
        selectedCourse:'',
        email: 'student1@gmail.com ',
        password: '12345678',
        error: '',
        submitError: '',
        success: '',
        registeredBy:'',
        role: user.role
    })
    const pattern = /[1-4]/g
    const {firstName, middleName, lastName, 
        fullAddress,
        cityName,
        adhaarCard,
        panCard,
        tenthMarkSheet,
        twelfthMarsheet,
        graduationCertificate,
        selectedCourse,
        mobileNumber, email, password, error, registeredBy, role, submitError, success} = values
    
    const handleSubmit = (data={firstName, middleName, lastName, 
        fullAddress,
        cityName,
        adhaarCard,
        panCard,
        tenthMarkSheet,
        twelfthMarsheet,
        graduationCertificate,
        selectedCourse,
        mobileNumber, email, password, registeredBy, role}) => {
        console.log(data)
        if (pattern.test(data.mobileNumber)) {
            registerStudent(data).then(res => {
                if (res.error) {
                    if (res.student.registeredBy._id !== user._id) {
                        setExistingStudent(res.student)
                        setExistRegisteredBy(res.student.registeredBy)
                    } 
                    setValues({...values, submitError: `${res.error} by you`})
                }
                setRefresh(true)
            }).catch(err => {
                console.log(err)
            })
        }
    }

    const submitStudentSubscribe = (data) => {
        console.log(data.studentId, data.registeredId)
            subscribeStudent(data).then(res => {
                // console.log(res)
                if (res.updated === true) {
                    return setRefresh(true)
                }
            }).catch(err => {
                console.log(err)
            })
            setRefresh(false)
    }
    
    const handleChange = name => event => {
        return setValues({ ...values, error: '', submitError: '', [name]: event.target.value}), setRefresh(false), setExistingStudent(null)
    };

    const displayStudents = () => {
        if (students.length !== 0) {

            return students.length !== 0 ?
                <table className="table table-borderless">
                    <thead>
                        <tr className="border-bottom border-dark">
                            <th scope="col">First Name</th>
                            <th scope="col">Middle Name</th>
                            <th scope="col">Last Name</th>
                            <th scope="col">E-mail</th>
                            <th scope="col">Status</th>
                        </tr>
                    </thead>
                        {students.map((stu, i) => (
                        <tbody key={i} className="border-bottom border-dark">
                            <tr className='m-3' style={stu.isSubscribed === true ? {backgroundColor:"green"} : {backgroundColor:"red"}}>
                                <td>{stu.firstName}</td>
                                <td>{stu.middleName}</td>
                                <td>{stu.lastName}</td>
                                <td>{stu.email}</td>
                                <td className="">
                                    {stu.isSubscribed === false ? <span className="">Not Subscribed</span> : <span className="">Subscribed</span>}
                                </td> 
                                <td>
                                    <button onClick={() => submitStudentSubscribe({studentId: stu._id, registeredId: stu.registeredBy})} className="btn btn-sm btn-outline-warning">Subscribe</button>
                                </td>
                                <td>
                                    <button onClick={() => {setViewStudent(stu)
                                    setOpen(true)}} className="btn btn-sm btn-outline-warning">View Student</button>
                                </td>
                            </tr>
                        </tbody>
                    ))}
                </table>
                : <div className="text-center text-danger">
                    No student registerest in this center
                </div>
        }
    }

    return (
        <UserIndex>
            <div className="p-2 d-flex justify-content-center align-items-center">
                <div className="col-md-10">
                    <div className="card rounded-lg shadow border-primary">
                        <div className="text-fluid p-md-4 p-3 d-flex justify-content-around align-items-center">
                            <h3><span>Center Name: </span> <span className=""><u>{center.centerName}</u></span></h3>
                            <h3><span>Center Location: </span> <span className=""><u>{center.centerLocationCity} {center.centerLocationState}</u></span></h3>
                            {/* <h3><span>Created by: </span> <span className=""><u>{createdBy.firstName} {createdBy.lastName}</u></span></h3> */}
                        </div>
                    </div>
                    <Collapse in={!open}>
                    <div className="py-3 row d-flex justify-content-center align-items-start">
                        <Collapse in={openRegister}>
                        <div className="p-3 bg-light">
                            <div className="text-center">
                            <h1>Student Form</h1>
                            {submitError !== '' ? <div className="text-danger">{submitError}</div> : null}
                            </div>
                            <div className="container-fluid">
                                <form className="row" onSubmit={() => handleSubmit({firstName, middleName, lastName, 
                                    fullAddress,
                                    cityName,
                                    adhaarCard,
                                    panCard,
                                    tenthMarkSheet,
                                    twelfthMarsheet,
                                    graduationCertificate,
                                    selectedCourse,
                                    mobileNumber, email, password, registeredBy: center._id, role})}>
                                    <div className="col-md">
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
                                        <div className="form-group py-2">
                                            <TextField 
                                            className="w-100"
                                                error={error === "" ? false : true}
                                                id="standard-basic mobile-number" 
                                                type="number"
                                                label={error === '' ? "Mobile Number" : error} 
                                                value={mobileNumber}
                                                required={true}
                                                variant="standard" 
                                                onChange={handleChange('mobileNumber')}
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
                                    </div>
                                    <div className="col-md row">
                                        <div className="col">
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
                                            <div className="px-2 col-md">
                                                <TwelfthMarsheet
                                                    values={values}
                                                    setValues={setValues}
                                                />
                                            </div>
                                        </div>
                                        <div className="col">
                                            <div className="px-2 col-md">
                                                <TenthMarkSheet
                                                    values={values}
                                                    setValues={setValues}
                                                />
                                            </div>
                                            <div className="px-2 col-md">
                                                <GraduUpload
                                                    values={values}
                                                    setValues={setValues}
                                                />
                                            </div>
                                        </div>
                                        <div className="form-group py-2">
                                            <FormControl sx={{minWidth: '100%' }} size="small">
                                                <InputLabel id="demo-select-small">Select Course</InputLabel>
                                                <Select
                                                    labelId="demo-select-small"
                                                    id="demo-select-small"
                                                    value={selectedCourse}
                                                    label="Select Course"
                                                    onChange={handleChange('selectedCourse')}
                                                >
                                                    <MenuItem value="none">
                                                    {/* <em>{registeredUser.ownerName}</em> */}
                                                    </MenuItem>
                                                    {courses.length !== 0 ? (
                                                        courses.map((c, i) => (
                                                            <MenuItem key={i} value={c._id}>{c.courseName}</MenuItem>
                                                        ))
                                                    ) : null}
                                                </Select>
                                            </FormControl>
                                        </div>
                                    </div>

                                </form>
                                <button onClick={() => handleSubmit({firstName, middleName, lastName, 
                                    fullAddress,
                                    cityName,
                                    adhaarCard,
                                    panCard,
                                    tenthMarkSheet,
                                    twelfthMarsheet,
                                    graduationCertificate,
                                    selectedCourse,
                                    mobileNumber, email, password, registeredBy: center._id, role})} className="col-12 btn btn-outline-primary">
                                    Submit
                                </button>
                            </div>
                        </div>
                        <button onClick={() => setOpenRegister(false)} className="btn my-4 btn-sm btn-outline-primary col-12">View Students</button>
                        </Collapse>
                        <Collapse in={!openRegister}>
                            <div className="row">
                                {existingStudent === null ? <div></div> : 
                                    <div className="shadow card bg-danger border-danger rounded-lg p-3 my-3">
                                        <h3 className="text-center">Student Already Exist</h3>
                                    <p>Name: {existingStudent.lastName} {existingStudent.firstName}</p>
                                    <p>Mobile Number: {existingStudent.mobileNumber}</p>
                                    <p>E-mail: {existingStudent.email}</p>
                                </div> }
                                {displayStudents()}
                            </div>
                        <button onClick={() => setOpenRegister(true)} className="btn btn-sm btn-outline-primary col-12">Register New Student</button>
                        </Collapse>
                    </div>
                    </Collapse>
                    <Collapse in={open} className="py-3">
                        <h3 align="center">Student Details</h3>
                        {/* {JSON.stringify(viewStudent)} */}
                        <h4>Name: {viewStudent.firstName} {viewStudent.middleName} {viewStudent.lastName}</h4>
                        <h4>Email: {viewStudent.email}</h4>
                        <h4>Mobile No.: {viewStudent.mobileNumber}</h4>
                        <button onClick={() => setOpen(false)} className="btn btn-sm btn-outline-danger col-12">Close</button>
                    </Collapse>
                </div>
            </div>
        </UserIndex>
    )
}

export default CenterInfo