import { useState, useEffect } from "react"
import AdminIndex from "."
import {  getNonActiveSubUser } from "../../actions/auth"
import {TextField} from "@mui/material"
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import Collapse from '@mui/material/Collapse';
import { State, City }  from 'country-state-city';
import { getAdminCenters, getSingleCenterAdmin, updateSubUser, getSingleStudentAdmin, getStudentsResults } from "../../actions/center"
const AdminCenterInfo = () => {

    const [allCenters, setAllCenters] = useState([])
    const [singleCenter, setSingleCenter] = useState(null)
    const [centerStudents, setCenterStudents] = useState([])
    const [update, setUpdate] = useState(false)
    const [updateData, setUpdateData] = useState({})
    const [notAssigned, setNotAssigned] = useState([])
    const [isOpen, setIsOpen] = useState(false);

    const [singleStudent, setSingleStudent] = useState({})

    const [showStudent, setShowStudent] = useState(false)
    const [studentResult, setStudentResult] = useState([])    
    const [refresh, setRefresh] = useState(false)

    const [states, getStates] = useState({})
    const [cities, getCities] = useState({})

    useEffect(() => {
        getAdminCenters(2).then(res => {
            setAllCenters(res)
        })
        notAssignedUser()
        getStates(State.getStatesOfCountry('IN'))
    }, [refresh])


    const getSingleCenter = (subcId) => {
        getSingleCenterAdmin(subcId).then(res => {
            setSingleCenter(res.center)
            setCenterStudents(res.students)
        }).catch(err => {
            console.log(err)
        })
    }
    
    const getSingleStudent = (studentId) => {
        getSingleStudentAdmin(studentId).then(res => {
            setSingleStudent(res)
        })
        getStudentsResults(studentId).then(res => {
            setStudentResult(res)
        }) 
    }

    const updateCenter = (data={centerId: updateData._id, centerName: updateData.centerName, 
        centerLocationState: updateData.centerLocationState, 
        centerLocationCity: updateData.centerLocationCity, 
        createdBy: updateData.createdBy }) => {
        updateSubUser(data).then(res => {
            if (res) {
                setRefresh(true)
                setIsOpen(false)
            }
        }).catch(err => {
            console.log(err)
        })
        setRefresh(false)
    }

    const notAssignedUser = (userId, userRole) => {
        getNonActiveSubUser(userId, userRole).then(res => {
            setNotAssigned(res)
        })
    } 
    const handleChange = name => event => {
        setUpdateData({ ...updateData, [name]: event.target.value });
    };
    return (
        <AdminIndex>
            <div className="p-md-5 p-3 justify-content-center align-items-center">
            <h1>Center Info</h1>
            <Collapse in={isOpen}>
                <div className="">
                    {singleCenter !== null ? 
                    <div className="bg-white m-1 p-2 shadow sticky-top">
                        <div className="d-flex justify-content-around">
                            <h2>Center Name: <span><u>{singleCenter.centerName}</u></span></h2>
                            <h2>Assigned to: <span><u>{singleCenter.assignedTo.ownerName}</u></span></h2>
                        </div>
                    </div> : null}
                    <div className="py-md-5 row justify-content-center align-items-flex-start">
                        {update === true ? <div className="col-6">
                            <h2>Update Center</h2>
                            <form>
                                <div className="form-group py-2">
                                    <TextField 
                                    className="w-100"
                                        id="standard-basic" 
                                        type="text"
                                        label={"Center Name"} 
                                        value={updateData.centerName}
                                        required={true}
                                        variant="standard" 
                                        onChange={handleChange('centerName')}
                                    />
                                </div>
 
                                <div className="form-group py-2">
                                <FormControl sx={{minWidth: '100%' }} size="small">
                                    <InputLabel id="demo-select-small">Location State</InputLabel>
                                    <Select
                                        labelId="demo-select-small"
                                        id="demo-select-small"
                                        multiple={false}
                                        value={updateData.centerLocationState}
                                        label="Location State"
                                        onChange={handleChange('centerLocationState')}
                                    >
                                        {states.length !== 0 ? (
                                            states.map((s, i) => (
                                                <MenuItem key={i} onClick={ () => getCities(City.getCitiesOfState('IN', s.isoCode))} value={s.name}>{s.name}</MenuItem>
                                            ))
                                        ) : null}
                                    </Select>
                                </FormControl>
                            </div>
                            <div className="form-group py-2">
                                <FormControl sx={{minWidth: '100%' }} size="small">
                                    <InputLabel id="demo-select-small">Location City</InputLabel>
                                    <Select
                                        labelId="demo-select-small"
                                        id="demo-select-small"
                                        // disabled={updateData.centerLocationState !== "" ? false : true}
                                        multiple={false}
                                        value={updateData.centerLocationCity}
                                        label="Location City"
                                        onChange={handleChange('centerLocationCity')}
                                    >
                                        {cities && cities.length !== undefined ? (
                                            cities && cities.map((c, i) => (
                                                <MenuItem key={i} value={c.name}>{c.name}</MenuItem>
                                            ))
                                        ) : null}
                                    </Select>
                                </FormControl>
                                </div>
                                <div className="form-group py-2">
                                    <FormControl sx={{minWidth: '100%' }} size="small">
                                        <InputLabel id="demo-select-small">Created By</InputLabel>
                                        <Select
                                            labelId="demo-select-small"
                                            id="demo-select-small"
                                            value={updateData.createdBy}
                                            label="Created By"
                                            onChange={handleChange('createdBy')}
                                        >
                                            <MenuItem value={updateData.createdBy}>
                                            <em>{updateData.createdBy.firstName}</em>
                                            </MenuItem>
                                            {notAssigned.length !== 0 ? (
                                                notAssigned.map((u, i) => (
                                                    <MenuItem key={i} value={u._id}>{u.firstName}</MenuItem>
                                                ))
                                            ) : null}
                                        </Select>
                                    </FormControl>
                                </div>
                            </form>
                            <div>
                                <button onClick={() => updateCenter()} className="btn btn-sm btn-outline-warning">Update</button>
                            </div>
                        </div> : 
                        <div className="row">
                            {centerStudents.length !== 0 ?
                            <div>
                            <Collapse in={!showStudent}>
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
                                        {centerStudents.map((stu, i) => (
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
                                                    <button onClick={() => {
                                                        getSingleStudent(stu._id)
                                                        setShowStudent(true)
                                                    }} className="btn btn-primary">View Student Info</button>
                                                </td>
                                            </tr>
                                        </tbody>
                                    ))}
                                </table>
                                </Collapse>
                                <Collapse in={showStudent}>
                                    <h4>Name: {singleStudent.firstName} {singleStudent.lastName}</h4>
                                <table className="table table-borderless">
                                    <thead>
                                        <tr className="border-bottom border-dark">
                                            <th scope="col">Course</th>
                                            <th scope="col">Score</th>
                                        </tr>
                                    </thead>
                                        {studentResult.map((stu, i) => (
                                        <tbody key={i} className="border-bottom border-dark">
                                            <tr>
                                                <td>{stu.course.courseName}</td>
                                                <td>{stu.score}</td>
                                                {/* {JSON.stringify(stu.testRawData[0].isCorrect)} */}
                                            </tr>
                                        </tbody>
                                    ))}
                                </table>
                                    <button onClick={() => {
                                        setShowStudent(false)
                                    }} className="btn btn-danger">Close</button>
                                </Collapse>
                                </div>
                                : <div className="text-center text-danger">
                                    No student registerest in this center
                                </div>}
                        </div>}
                    </div>
                </div>
                <div className="text-center">
                    <button onClick={() => {setIsOpen(false)
                    setShowStudent(false)}} className="btn btn-outline-danger col-6">
                        Close
                    </button>
                </div>
                </Collapse>
                <Collapse in={!isOpen}>
                <div className="container-fluid col-md-12 row">
                    {allCenters.map((subc, i) => (
                        <div key={i} className="container-fluid col py-3">
                            <div className="card p-3 border-primary rounded-lg">
                                <div className="card-body">
                                    <div className="card-title">
                                        <h4><span><u>Allocated to: </u></span>{subc.assignedTo.firstName} {subc.assignedTo.middleName}</h4>
                                    </div>
                                    <div className="card-text">
                                        <p><span><u>Center Name: </u></span>{subc.centerName}</p>
                                        <p><span><u>Center Location: </u></span>{subc.centerLocationCity} {subc.centerLocationState}</p>
                                        <p><span><u>Created-by: </u></span>{subc.createdBy.firstName} {subc.createdBy.middleName}</p>
                                    </div>
                                </div>
                                <hr className="bg-dark" />
                                <button onClick={() => {setUpdate(true)
                                setIsOpen(true)
                                    setUpdateData(subc)}} className="btn my-2 btn-outline-warning">Update</button>
                                <button onClick={() => {getSingleCenter(subc._id)
                                setIsOpen(true)
                                setUpdate(false)}} className="btn my-2 btn-outline-success">Open center</button>
                            </div>
                        </div>
                    ))}
                </div>
                </Collapse>
                <hr className="bg-dark" />
            </div>
        </AdminIndex>
    )
}

export default AdminCenterInfo