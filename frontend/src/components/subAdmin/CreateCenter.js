import { useState, useEffect } from "react"
import SubAdminIndex from "."
import { getUsers, createCenterSub, getSubCenter, deleteCenter, getSingleCenterAdmin, updateSubCenter } from "../../actions/center"
import {TextField} from "@mui/material"
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import BussinessProof from '../deactivated/BussinessProof'
import PanCardUpload from '../deactivated/PanCardUpload'
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import Collapse from '@mui/material/Collapse';
import CircularProgress from '@mui/material/CircularProgress';
import { isAuthenticated, registerCenterUser,getNotAssignedUser } from "../../actions/auth";
import { Country, State, City }  from 'country-state-city';

const CreateCenter = () => {

    const [users, setUsers] = useState([])
    const [subCenters, setSubCenter] = useState([])

    const [openStudents, setOpenStudents] = useState(false)
    const [viewCenterUser, setViewCenterUser] = useState(false)
    const [centerUserData, setCenterUserData] = useState({})
    const [initiateUpdate, setInitiateUpdate] = useState(false)
    const [states, getStates] = useState({})
    const [cities, getCities] = useState({})

    const [values, setValues] = useState({
        center_id: '',
        centerName: '',
        centerLocationState: 'Maharashtra',
        centerFullAddress:'',
        numberOfClassRooms:'',
        capacityOfClass:'',
        nameOfCompany:'',
        businessProof:{},
        panCard:{},
        centerLocationCity:'Mumbai',
        centerLocationIsoCode:'MH',
        assignedTo: '',
        createdBy: '',
        refresh:false,
        centerDelete:'',
        error: '',
        centerError: '',
        success: false
    });

    const ownerEmailRegex = /\S+@\S+\.\S+/;

    const [isRegistered, setIsRegistered] = useState(false)

    const [registeredUser, setRegisteredUser] = useState({})
    const [singleCenter, setSingleCenter] = useState({})
    const [centerStudents, setCenterStudents] = useState([])
    const [notAssigned, setNotAssigned] = useState([])

    const [registerValues, setRegisterValues] = useState({
        ownerName: 'test center two',
        ownerMobileNumber: '1010101010',
        ownerWhatsAppNumber: '1010101010',
        ownerEmail: 'testcenter2@gmail.com',
        password: '12345678',
        registerError: '',
        registerSuccess: false,
    })

    const {ownerName, ownerMobileNumber, ownerWhatsAppNumber, ownerEmail, password, registerError, registerSuccess} = registerValues

    const { user } = isAuthenticated();

    const { center_id, centerName, centerLocationState, 
        centerFullAddress, numberOfClassRooms, capacityOfClass, nameOfCompany, businessProof, panCard,
    centerLocationIsoCode, centerLocationCity, refresh, centerDelete, centerError, assignedTo, createdBy, error, success } = values;

    useEffect(() => {
        getStates(State.getStatesOfCountry('IN'))
        getSubCenter(user._id).then(res => {
            setSubCenter(res.reverse())
        }).catch(err => {
            console.log(err)
        })
        getUsers(1).then(res => {
            setUsers(res)
        }).catch(err => {
            console.log(err)
        })
        notAssignedUser(user._id)
        setValues({...values, createdBy: user._id})
    }, [refresh])

    const getSingleCenter = (subcId) => {
        getSingleCenterAdmin(subcId).then(res => {
            setSingleCenter(res.center)
            setCenterStudents(res.students)
        }).catch(err => {
            console.log(err)

        })
    }

    const handleSubmit = (data= {centerName, centerLocationState,
        centerFullAddress, numberOfClassRooms, capacityOfClass, nameOfCompany, businessProof, panCard, centerLocationCity, assignedTo, createdBy}) => {
        console.log(data)
        if (data.centerLocationState === '' || data.centerName === '') {
            setValues({...values, error: "Field reqiried"})
        } else {
            console.log(data)
            createCenterSub(data).then(res => {
                if (res) {
                    setValues({...values, refresh: true, centerName: '', centerLocationIsoCode:'', centerLocationState: '', assignedTo: ''})
                }
                if (res.error) {
                    setValues({...values, centerError: res.error})
                }
            })
        }
    }

    const handleChange = name => event => {
        setValues({ ...values, error: '', [name]: event.target.value, refresh:false, centerError: "", centerDelete: "" });
    };

    const registerHandleChange = name => event => {
        setRegisterValues({...registerValues, registerError: '', [name]: event.target.value})
    }

    const submitDeleteCenter = (centerId, assignedToId) => {
        console.log(centerId, assignedToId)
        deleteCenter(centerId, assignedToId).then(res => {
            if (res.message) {
                setValues({...values, refresh: true, centerDelete: res.message})
            }
            if (res.error) {
                setValues({...values, refresh: true, centerDelete: res.error})
            }
            
        })
        setValues({...values, refresh: false})
    }
    
    const notAssignedUser = (userId) => {
        getNotAssignedUser(userId).then(res => {
            setNotAssigned(res)
        })
    } 

    const submitUpdateCenter = (data= {centerName, center_id,
        centerFullAddress, numberOfClassRooms, capacityOfClass, nameOfCompany, businessProof, panCard, centerLocationState, centerLocationCity, assignedTo, createdBy}) => {
        console.log(data)
        updateSubCenter(data).then(res => {
            setValues({...values, refresh: true, centerName: '', centerLocationState: '', centerLocationCity: '', assignedTo: ''})
            setInitiateUpdate(false)
        }).catch(err => {
            console.log(err)
        })
        setValues({...values, refresh:false})
    }

    const submitRegister = (ownerEmail, password, ownerName, ownerMobileNumber, ownerWhatsAppNumber) => {
        if (ownerEmail === '' || password === '', ownerName === '', ownerMobileNumber === '', ownerWhatsAppNumber === '') {
            return setRegisterValues({...registerValues, registerError: 'All fields are required'})
        }
        if(ownerEmailRegex.test(ownerEmail)) {
            const centerUser = { ownerName, ownerMobileNumber, ownerWhatsAppNumber, ownerEmail, password, registeredBy: user._id, role: user.role };
            registerCenterUser(centerUser).then(res => {
                if (res.error) {
                   return setRegisterValues({...registerValues, registerError: res.error})
                } else {
                    setRegisterValues({
                        ...registerValues,
                        ownerEmail: '',
                        password: '',
                        registerError: '',
                        ownerName: '',
                        ownerWhatsAppNumber: '',
                        ownerMobileNumber: '',
                        registerSccess: false
                    });
                    setRegisteredUser(res)
                    setValues({...values, assignedTo: res._id})
                }
                setValues({...values, refresh: true})
            }).catch(err => {
                console.log(err)
            })
            setValues({...values, refresh:false})
        } else {
            setRegisterValues({...values, registerError: 'Please enter valid ownerEmail', success: false})
        }
    }

    return (
        <SubAdminIndex>
            <Collapse in={!openStudents}>
                        <div className="p-md-5 p-3 d-md-flex justify-content-evenly align-items-start">
                        {isRegistered === true ? 
                         <div className="col-md-7 m-3 p-3">
                         <h1>Create Center</h1>
                            <div align="right">
                                <button onClick={() => setIsRegistered(false)} className="btn my-2 btn-outline-secondary">
                                    Go Back
                                </button>
                            </div>
                         <form className="row">
                            <div className="col-md-7">
                             <div className="form-group py-2">
                                 <TextField 
                                 className="w-100"
                                     error={error === "" ? false : true}
                                     id="standard-basic" 
                                     type="text"
                                     label={error === '' ? "Center Name" : error} 
                                     value={centerName}
                                     required={true}
                                     variant="standard" 
                                     onChange={handleChange('centerName')}
                                 />
                             </div>
                             <div className="form-group py-2">
                                 <TextField 
                                 className="w-100"
                                     error={error === "" ? false : true}
                                     id="standard-basic" 
                                     type="text"
                                     label={error === '' ? "Full Address" : error} 
                                     value={centerFullAddress}
                                     required={true}
                                     variant="standard" 
                                     onChange={handleChange('centerFullAddress')}
                                 />
                             </div>
                             <div className="form-group py-2">
                                 <FormControl sx={{minWidth: '100%' }} size="small">
                                     <InputLabel id="demo-select-small">Location State</InputLabel>
                                     <Select
                                         labelId="demo-select-small"
                                         id="demo-select-small"
                                         multiple={false}
                                         value={centerLocationState}
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
                                         disabled={centerLocationState !== "" ? false : true}
                                         multiple={false}
                                         value={centerLocationCity}
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
                                <TextField 
                                className="w-100"
                                    error={error === "" ? false : true}
                                    id="standard-basic mobile-number" 
                                    type="number"
                                    label={error === '' ? "Total Classrooms" : error} 
                                    value={numberOfClassRooms}
                                    required={true}
                                    variant="standard" 
                                    onChange={handleChange('numberOfClassRooms')}
                                />
                            </div>
                             <div className="form-group py-2">
                                <TextField 
                                className="w-100"
                                    error={error === "" ? false : true}
                                    id="standard-basic mobile-number" 
                                    type="number"
                                    label={error === '' ? "Classroom Capacity" : error} 
                                    value={capacityOfClass}
                                    required={true}
                                    variant="standard" 
                                    onChange={handleChange('capacityOfClass')}
                                />
                            </div>
                             <div className="form-group py-2">
                                 <TextField 
                                 className="w-100"
                                     error={error === "" ? false : true}
                                     id="standard-basic" 
                                     type="text"
                                     label={error === '' ? "Company Name" : error} 
                                     value={nameOfCompany}
                                     required={true}
                                     variant="standard" 
                                     onChange={handleChange('nameOfCompany')}
                                 />
                             </div>
                            </div>
                            <div className="col-md-5">
                            <div className="px-2 col-md">
                                <BussinessProof
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
                             <div className="form-group py-2">
                                 <FormControl sx={{minWidth: '100%' }} size="small">
                                     <InputLabel id="demo-select-small">Assign to</InputLabel>
                                     <Select
                                         labelId="demo-select-small"
                                         id="demo-select-small"
                                         value={assignedTo}
                                         label="Created By"
                                         onChange={handleChange('assignedTo')}
                                     >
                                         <MenuItem value={assignedTo}>
                                         <em>{registeredUser.ownerName}</em>
                                         </MenuItem>
                                         {notAssigned.length !== 0 ? (
                                             notAssigned.map((u, i) => (
                                                 <MenuItem key={i} value={u._id}>{u.ownerName}</MenuItem>
                                             ))
                                         ) : null}
                                     </Select>
                                 </FormControl>
                             </div>
                            </div>
                         </form>
                         {initiateUpdate === true ? 
                         <div className="text-center">
                         {success === true ? <div align="center"><CircularProgress size={30} /></div>: 
                             <button onClick={() => submitUpdateCenter({centerName, center_id,
                                centerFullAddress, numberOfClassRooms, capacityOfClass, nameOfCompany, businessProof, panCard, centerLocationState, centerLocationCity, assignedTo, createdBy})} className="col-12 btn btn-outline-warning">
                                 Update Center
                             </button>}
                             <button onClick={() => {setInitiateUpdate(false)
                             setValues({...values, refresh: true, centerName: '', centerLocationState: '', assignedTo: ''})
                             }}className="m-3 col-6 btn btn-outline-warning">
                                 Go to create
                             </button>
                         </div> :
                         <div>
                         {success === true ? <div align="center"><CircularProgress size={30} /></div>: 
                             <button onClick={() => handleSubmit({centerName,
                                centerFullAddress, numberOfClassRooms, capacityOfClass, nameOfCompany, businessProof, panCard, centerLocationState, centerLocationCity, assignedTo, createdBy})} className="col-12 btn btn-outline-primary">
                                 Create Center
                             </button>}
                             <button onClick={() => setIsRegistered(false)} className="btn my-2 btn-outline-secondary col-12">
                                 Go Back
                             </button>
                         </div>}
                     {centerError !== '' ? 
                     <div className="text-center card border-danger m-3">
                         <h3 className="m-0 p-2 text-danger">{centerError}</h3>
                     </div> : null}
                     </div> : <div className="col-md-4 m-3 p-3" >
                         <div className="">
                         <h1>Register User</h1>
                            <div align="right">
                                <button onClick={() => setIsRegistered(true)} className="btn my-2 btn-outline-secondary">
                                    Go to centers
                                </button>
                            </div>
                             <form >
                                 <div className="form-group py-2">
                                     <TextField 
                                     className="w-100"
                                         error={registerError === "" ? false : true}
                                         id="standard-basic" 
                                         type="test"
                                         label={registerError === '' ? "Owner Name" : registerError} 
                                         value={ownerName}
                                         required={true}
                                         variant="standard" 
                                         onChange={registerHandleChange('ownerName')}
                                     />
                                 </div>
                                 <div className="form-group py-2">
                                     <TextField 
                                     className="w-100"
                                         error={registerError === "" ? false : true}
                                         id="standard-basic mobile-number" 
                                         type="number"
                                         label={registerError === '' ? "Mobile Number" : registerError} 
                                         value={ownerMobileNumber}
                                         required={true}
                                         variant="standard" 
                                         onChange={registerHandleChange('ownerMobileNumber')}
                                     />
                                 </div>
                                 <div className="form-group py-2">
                                     <TextField 
                                     className="w-100"
                                         error={registerError === "" ? false : true}
                                         id="standard-basic mobile-number" 
                                         type="number"
                                         label={registerError === '' ? "WhatsApp number" : registerError} 
                                         value={ownerWhatsAppNumber}
                                         required={true}
                                         variant="standard" 
                                         onChange={registerHandleChange('ownerWhatsAppNumber')}
                                     />
                                 </div>
                                 <div className="form-group py-2">
                                     <TextField 
                                     className="w-100"
                                         error={registerError === "" ? false : true}
                                         id="standard-basic" 
                                         type="ownerEmail"
                                         label={registerError === '' ? "Email" : registerError} 
                                         value={ownerEmail}
                                         required={true}
                                         variant="standard" 
                                         onChange={registerHandleChange('ownerEmail')}
                                     />
                                 </div>
                                 <div className="form-group py-2">
                                     <TextField 
                                     className="w-100"
                                     error={registerError === "" ? false : true}
                                         id="standard-basic" 
                                         type="password"
                                         label={registerError === '' ? "Password" : registerError} 
                                         value={password}
                                         required={true}
                                         variant="standard" 
                                         onChange={registerHandleChange('password')}
                                     />
                                 </div>
                             </form>
                         </div>
                         <button onClick={() => submitRegister(ownerEmail, password, ownerName, ownerMobileNumber, ownerWhatsAppNumber)} className="btn col-12 btn-outline-primary">
                             Register
                         </button>
                         <button onClick={() => setIsRegistered(true)} className="btn my-2 col-12 btn-outline-secondary">
                             Go to centers
                         </button>
                         </div>}
                         {/* register User for center */}
                         {isRegistered === true ? 
                         <div className="col-md-5 p-3 m-3">
                             <div className="m-auto">
                                <h4>Centers List</h4>
                             {centerDelete !== '' ? 
                         <div className="text-center card border-danger mb-3">
                             <h3 className="m-0 p-2 text-danger">{centerDelete}</h3>
                         </div> : null}
                                 {subCenters.map((subc, i) => (
                                     <div key={i} className="card border-primary rounded-lg p-3 m-3">
                                         <p>Allocated to: {subc.assignedTo.ownerName}</p>
                                         <p>Center Name: {subc.centerName}</p>
                                         <p>Center Location: {subc.centerLocationCity} {subc.centerLocationState}</p>
                                         <hr className="bg-dark" />
                                         <div className="d-flex justify-content-around align-items-center">
                                             <button
                                             onClick={() => {setOpenStudents(true)
                                             getSingleCenter(subc._id)}}
                                             className="btn btn-outline-primary">View Students</button>
                                             <button onClick={() => {setInitiateUpdate(true)
                                             setValues({...values, 
                                                 center_id: subc._id,    
                                                 centerName: subc.centerName,
                                                 centerLocationState: subc.centerLocationState,
                                                 centerLocationCity: subc.centerLocationCity,
                                                 centerFullAddress: subc.centerFullAddress,
                                                 capacityOfClass: subc.capacityOfClass,
                                                 numberOfClassRooms: subc.numberOfClassRooms,
                                                 nameOfCompany: subc.nameOfCompany,
                                                 businessProof: subc.businessProof,
                                                 panCard: subc.panCard,
                                                 assignedTo: subc.assignedTo._id
                                             })}} className="btn btn-outline-warning">
                                                 Update
                                             </button>
                                             <button onClick={() => submitDeleteCenter(subc._id, subc.assignedTo._id)} className="btn btn-outline-danger">
                                                 Delete
                                             </button>
                                         </div>
                                     </div>
                                 ))}
                             </div>
                         </div> : <div className="col-md-8 p-3 m-3">
                            <Collapse in={viewCenterUser}>
                                <h4>Name: {centerUserData.ownerName}</h4>
                                <h4>Email: {centerUserData.ownerEmail}</h4>
                                <h4>Mobile No.: {centerUserData.ownerMobileNumber}</h4>
                                <h4>WhatsApp No.: {centerUserData.ownerWhatsAppNumber}</h4>
                                    <button onClick={() => {setViewCenterUser(false)}} className='btn btn-sm btn-outline-danger'>Close</button>
                            </Collapse>
                            <Collapse in={!viewCenterUser}>
                             <div className="m-auto">
                                 {users.length === 0 ? <div>
                                     <p className="text-center text-danger">No users registered by you</p>
                                 </div> : <table className="table table-borderless">
                                     <thead>
                                         <tr className="border-bottom border-dark">
                                             <th scope="col">Name</th>
                                             <th scope="col">WhatsApp No.</th>
                                             <th scope="col">Mobile No.</th>
                                             {/* <th scope="col">E-mail</th> */}
                                             <th>Status</th>
                                         </tr>
                                     </thead>
                                         {users.map((u, i) => (
                                         <tbody key={i} className="border-bottom border-dark">
                                            {user._id === u.registeredBy ? 
                                             <tr className="border-bottom border-dark">
                                                 <td>{u.ownerName}</td>
                                                 <td>{u.ownerWhatsAppNumber}</td>
                                                 <td>{u.ownerMobileNumber}</td>
                                                <td>
                                                     {u.isAssigned === true ? <p className="text-danger">Already assigned </p> : 
                                                     <button onClick={() => {setIsRegistered(true)
                                                         setRegisteredUser(u)
                                                         setValues({...values, assignedTo: u._id})} } className="btn btn-sm btn-outline-primary">Click to Assign</button>}
                                                 </td> 
                                                <td>
                                                    <button onClick={() => {setCenterUserData(u)
                                                        setViewCenterUser(true)}} className='btn btn-sm btn-outline-danger'>View Details</button>
                                                </td>
                                             </tr> : null}
                                         </tbody>
                                     ))}
                                 </table>}
                             </div>
                             </Collapse>
                         </div>}
                     </div>
                     </Collapse> : 
                     <Collapse in={openStudents}>
                        <div className="row col-10 mx-auto">
                            {centerStudents.length !== 0 ?
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
                                            </tr>
                                        </tbody>
                                    ))}
                                </table>
                                : <div className="text-center text-danger">
                                    No student registerest in this center
                                </div>}
                        </div>
                        <div className="col-10 mx-auto">
                            <button onClick={() => setOpenStudents(false)} className="btn col-12 btn-outline-danger">Close</button>
                        </div>
                     </Collapse>
        </SubAdminIndex>
    )
}

export default CreateCenter