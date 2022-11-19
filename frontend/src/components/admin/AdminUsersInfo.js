import {useState, useEffect} from 'react'
import AdminIndex from "."
import {TextField} from "@mui/material"
import Collapse from '@mui/material/Collapse';
import { isAuthenticated } from "../../actions/auth";
import {getListUsers, activateUser, deActivateUser} from '../../actions/auth'
const AdminUserInfo = () => {

    const [usersList, setUsersList] = useState([])
    const { user } = isAuthenticated();
    const [refresh, setRefresh] = useState(false)
    const [isOpen, setIsOpen] = useState(false);

    const[adhaarCard, setAdhaarCard] = useState({})
    const[panCard, setPanCard] = useState({})
    const[cv, setCV] = useState({})
    const[cancelledCheque, setCancelledCheque] = useState({})

    const [viewUser, setViewUser] = useState({})

    useEffect(() => {
        getListUsers(user.role).then(res => {
            setUsersList(res)
        }).catch(err => {
            console.log(err)
        })
    },[refresh])

    const [searchTerm, setSearchTerm] = useState('')
    const [searchResults, setSearchResults] = useState([])
    
    const handleSearch = event => {
        setSearchTerm(event.target.value)
    }

    let people = usersList.map(a => a.email);

    useEffect(() => {
        const results = people.filter(person =>
            person.toLowerCase().includes(searchTerm)
        );
          setSearchResults(results);
    }, [searchTerm])

    const handleActivateUser = (userId, userRole = user.role) => {
        const data = {userId, userRole}
        activateUser(data).then(res => {
            if(res) {
                setRefresh(true)
                setIsOpen(false)
            }
        })
        setRefresh(false)
    }

    const handleDeActivateUser = (userId, userRole = user.role) => {
        const data = {userId, userRole}
        deActivateUser(data).then(res => {
            if(res) {
                setRefresh(true)
                setIsOpen(false)
            }
        })
        setRefresh(false)
    }

    return (
        <AdminIndex>
            <div className='d-flex justify-content-center'>
                <div className='col-10'>
                    <Collapse in={!isOpen}>
                {usersList.length !== 0 ? 
                    <table className="table table-borderless">
                        <thead>
                            <tr className="border-bottom border-dark">
                                <th scope="col">First Name</th>
                                <th scope="col">Middle Name</th>
                                <th scope="col">Last Name</th>
                                <th scope="col">E-mail</th>
                            </tr>
                        </thead>
                            {usersList.map((stu, i) => (
                            <tbody key={i} className="border-bottom border-dark">
                                <tr className='m-3' 
                                style={stu.role !== 1 ? (stu.role === 2 ? {backgroundColor:"blue"} : {backgroundColor:" #f7f7f7 "}) : {backgroundColor:" #5cb85c "}}>
                                    <td>{stu.firstName}</td>
                                    <td>{stu.middleName}</td>
                                    <td>{stu.lastName}</td>
                                    <td>{stu.email}</td>
                                    <td>
                                        {stu.role === 2 ? ("Admin") : (
                                        <button onClick={() => {setIsOpen(true)
                                        setViewUser(stu)
                                        setAdhaarCard(stu.adhaarCard)
                                        setPanCard(stu.panCard)
                                        setCV(stu.cv)
                                        setCancelledCheque(stu.CancelledCheque)}} className='btn btn-sm btn-outline-danger'>View</button>)}
                                    </td>
                                </tr>
                            </tbody>
                        ))}
                    </table>
                    : <div className="text-center text-danger">
                        No User Registered
                    </div>
                    }
                    </Collapse>
                    <Collapse in={isOpen}>
                        {viewUser !== undefined ? <div>
                            <h4>Name: {viewUser.lastName} {viewUser.firstName} {viewUser.middleName}</h4>
                            <h4>Email: {viewUser.email}</h4>
                            <h4>Address: {viewUser.fullAddress}</h4>
                            <h4>City: {viewUser.cityName}</h4>
                            <div className='row'>
                                <div className='col-md p-2'>
                                    Adhaar card: 
                                    {adhaarCard !== undefined ?  <img 
                                        className='card-img-top'
                                        src={adhaarCard.url} alt='adhaar card' /> : <span className='text-danger'> No Data Available</span>}
                                </div>
                                <div className='col-md p-2'>
                                    PAN card: 
                                    {panCard !== undefined ?  <img 
                                        className='card-img-top'
                                        src={panCard.url} alt='pan card' /> : <span className='text-danger'> No Data Available</span>}
                                </div>
                                <div className='col-md p-2'>
                                    CV: 
                                    {cv !== undefined ?  <img 
                                        className='card-img-top'
                                        src={cv.url} alt='cv' /> : <span className='text-danger'> No Data Available</span>}
                                </div>
                                <div className='col-md p-2'>
                                    Cancelled Cheque: 
                                    {cancelledCheque !== undefined ?  <img 
                                        className='card-img-top'
                                        src={cancelledCheque.url} alt='Cancelled Cheque' /> : <span className='text-danger'> No Data Available</span>}
                                </div>
                            </div>
                            <div>
                                {viewUser.role === 1 ? <button
                                    onClick={() => handleDeActivateUser(viewUser._id)}
                                    className='btn btn-sm btn-outline-primary my-3'
                                >Deactivate User</button> : <button
                                    onClick={() => handleActivateUser(viewUser._id)}
                                    className='btn btn-sm btn-outline-primary my-3'
                                >Activate User</button>}
                            </div>
                        </div> : null}
                        <button onClick={() => {setIsOpen(false)}} className='btn btn-sm btn-outline-danger'>Close</button>
                    </Collapse>
                </div>
            </div>
        </AdminIndex>
    )
}

export default AdminUserInfo