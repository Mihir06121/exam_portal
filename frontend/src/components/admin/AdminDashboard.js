import { useState, useEffect } from "react"
import AdminIndex from "."
import {createCourse, getCourses} from "../../actions/center"
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import {TextField} from "@mui/material"
import Select from '@mui/material/Select';
import FormControl from '@mui/material/FormControl';
const AdminDashboard = () => {

    const [values, setValues] = useState({
        courseName: "",
        courseType: "",
        error: "",
        errorMessage: "",
        refresh: false
    })

    const [courses, setCources] = useState([])

    const {courseName, courseType, error, errorMessage, refresh} = values

    useEffect(() => {
        getCourses().then(res => {
            setCources(res)
        })
    }, [refresh])

    const handleChange = name => event => {
        setValues({...values, errorMessage: "", error: '', [name]: event.target.value})
    }

    const handleSubmit = (data = {courseName, courseType}) => {
        if (courseName === '' || courseType === '') {
            setValues({...values, error: "All Fields are required"})
        } else {
            createCourse(data).then(res => {
                if (res) {
                    setValues({...values, courseName: "", courseType: "", refresh: true})
                }
                if (res.error) {
                    setValues({...values, errorMessage: res.error})
                }
            }).catch(err => {
                console.log(err)
            })

            setValues({...values, refresh: false})
        }
    }

    const stream = [{
        name: "Science"
    }, {
        name: "Information & Technology"
    },{
        name: "Commerce"
    },{
        name: "Marketing"
    }]

    return (
        <AdminIndex>
            <div>
                <h1>Admin Dashboard</h1>
            </div>
            <div className="d-flex justify-content-center">
                <div className="col-10 shadow-lg p-md-5 p-3 row">
                    <div className="col-md">
                        <h2>COURCES</h2>
                        {courses.length !== 0 ? <div>
                            {courses.map((c, i) => (
                                <ul key={i}>
                                    <li><div><h5>{c.courseName}</h5></div>
                                    <div>{c.courseType}</div></li>
                                </ul>
                            ))}
                        </div> : <div className="text-center">No Courses</div>}
                    </div>
                    <div className="col-md">
                    <form >
                            <div className="form-group py-2">
                                <TextField 
                                className="w-100"
                                    error={error === "" ? false : true}
                                    id="standard-basic" 
                                    type="test"
                                    label={error === '' ? "Cource Name" : error} 
                                    value={courseName}
                                    required={true}
                                    variant="standard" 
                                    onChange={handleChange('courseName')}
                                />
                            </div>

                            <div className="form-group py-2">
                            <FormControl sx={{ minWidth: '100%' }} size="small">
                                <InputLabel id="demo-select-small">Select Course Type</InputLabel>
                                <Select
                                    error={error === "" ? false : true}
                                    labelId="demo-select-small"
                                    id="demo-select-small"
                                    value={courseType}
                                    label={error === '' ? "Select Course Type" : error} 
                                    onChange={handleChange('courseType')}
                                >
                                    <MenuItem value="">
                                    <em>None</em>
                                    </MenuItem>
                                    {stream.map((u, i) => (
                                        <MenuItem key={i} value={u.name}>{u.name}</MenuItem>
                                    ))}
                                </Select>
                                </FormControl>
                            </div>
                        </form>
                        <div>
                            <button
                            onClick={() => handleSubmit({courseName, courseType})}
                            className="btn btn-outline-primary col-12">Create Course</button>
                        </div>
                        <div>
                            {errorMessage !== "" ? <div className="text-center text-danger">{errorMessage}</div> : null}
                        </div>
                    </div>
                </div>
            </div>
        </AdminIndex>
    )
}

export default AdminDashboard