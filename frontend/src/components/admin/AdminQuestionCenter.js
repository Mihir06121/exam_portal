import { useState, useEffect } from "react"
import AdminIndex from "."
import {TextField} from "@mui/material"
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormControl from '@mui/material/FormControl';
import FormLabel from '@mui/material/FormLabel';
import { isAuthenticated } from "../../actions/auth"
import { getCourses } from "../../actions/center";
import {createQuestion, getAllQuestions} from '../../actions/question'

const AdminQuestionCenter = () => {

    const {user} = isAuthenticated()

    useEffect(() => {
        getAdminCourses()
        getQuestion()
    },[])

    const [refresh, setRefresh] = useState(false)

    const [open, setOpen] = useState(false)
    const [options, setOptions] = useState([])

    const [values, setValues] = useState({
        questionData: "",
        optionOne: "",
        optionTwo: "",
        optionThree: "",
        optionFour: "",
        optionCorrect: "",
        course: "",
        error: "",
        success: false,
        questionSubmit: false
    })

    const [courses, setCources] = useState([])
    const [allQuestions, setAllQuestions] = useState([])
    const { questionData, optionOne, optionTwo, optionThree, optionFour, optionCorrect, course, error, success, questionSubmit } = values

    const getAdminCourses = () => {
        getCourses().then(res => {
            setCources(res)
        })
    }

    const handleChange = name => event => {
        setValues({ ...values, [name]: event.target.value, error: '' });
    };

    const handleProcced = ({questionData, course, optionOne, optionTwo, optionThree, optionFour}) => {
        if (questionData !== '' && course !== '' && optionOne !== '' && optionTwo !== '' && optionThree !== '' && optionFour !== '') {
            setOpen(true)
            setOptions([{name: optionOne}, {name: optionTwo}, {name: optionThree}, {name: optionFour}])
        } else {
           setValues({...values, error: "All fields are required"})
        }
    }

    const handleSubmit = (data ={questionData, course, optionCorrect, options}) => {
        createQuestion(data).then(res => {
            if (res.error) {
                return setValues({...values, error: 'Something went wrong! try again or contact the developer'})
            }
            if (res) {
                return (setValues({...values, questionData: '', optionOne:'', optionTwo:'', optionThree: '', optionFour: ''}),
                setOptions([]), setOpen(false), setRefresh(true)) 
            }
        }).catch(err => {
            console.log(err)
        }) 
        setRefresh(false)
    }

    const getQuestion = () => {
        getAllQuestions().then(res => {
            setAllQuestions(res)
        }).catch(err => {
            console.log(err)
        })
    }

    return(
        <AdminIndex>
            <div>
                <h1>Question Center</h1>
            </div>
            <div className="row py-5">
                {error !== "" ? <div className="text-danger text-center">{error}</div> : null}
                <div className="px-5 p-2">
                    <form className="col-10 row m-auto">
                        <div className="form-group py-2 col-md">
                            <TextField 
                            className="w-100"
                                id="standard-basic" 
                                type="text"
                                label={"Question"} 
                                value={questionData}
                                required={true}
                                variant="standard" 
                                onChange={handleChange('questionData')}
                            />
                        </div>
                        <div className="form-group py-2 col-md">
                            <FormControl sx={{minWidth: '100%' }} size="small">
                                <InputLabel id="demo-select-small">Course</InputLabel>
                                <Select
                                    labelId="demo-select-small"
                                    id="demo-select-small"
                                    multiple={false}
                                    value={course}
                                    label="Course"
                                    variant="standard" 
                                    onChange={handleChange('course')}
                                >
                                    {courses.length !== 0 ? (
                                        courses.map((s, i) => (
                                            <MenuItem key={i} value={s._id}>{s.courseName}</MenuItem>
                                        ))
                                    ) : null}
                                </Select>
                            </FormControl>
                        </div>
                    </form>
                    {open === false ? 
                    <div>
                    <div className="py-md-5 py-3"><h2 align="center">Options</h2></div>
                    <form className="col-10 row m-auto">
                        <div className="form-group py-2 col-md">
                            <TextField 
                            className="w-100"
                                id="standard-basic" 
                                type="text"
                                label={"Option One"} 
                                value={optionOne}
                                required={true}
                                variant="standard" 
                                onChange={handleChange('optionOne')}
                            />
                        </div>
                        <div className="form-group py-2 col-md">
                            <TextField 
                            className="w-100"
                                id="standard-basic" 
                                type="text"
                                label={"Option Two"} 
                                value={optionTwo}
                                required={true}
                                variant="standard" 
                                onChange={handleChange('optionTwo')}
                            />
                        </div>
                    </form>
                    <form className="col-10 row m-auto">
                        <div className="form-group py-2 col-md">
                            <TextField 
                            className="w-100"
                                id="standard-basic" 
                                type="text"
                                label={"Option Three"} 
                                value={optionThree}
                                required={true}
                                variant="standard" 
                                onChange={handleChange('optionThree')}
                            />
                        </div>
                        <div className="form-group py-2 col-md">
                            <TextField 
                            className="w-100"
                                id="standard-basic" 
                                type="text"
                                label={"OptionFour"} 
                                value={optionFour}
                                required={true}
                                variant="standard" 
                                onChange={handleChange('optionFour')}
                            />
                        </div>
                    </form>
                    <div className="py-5 p-3">
                        <button onClick={() => 
                            handleProcced({questionData, course, optionOne, optionTwo, optionThree, optionFour})} 
                            className="btn col-12 btn-outline-success">Procced</button>
                    </div>
                    </div> :
                    <div align="center">
                        <FormControl>
                            <FormLabel id="demo-radio-buttons-group-label">Choose correct answer</FormLabel>
                            <RadioGroup
                                row
                                aria-labelledby="demo-radio-buttons-group-label"
                                name="radio-buttons-group"
                                value={optionCorrect}
                                onChange={handleChange('optionCorrect')}
                            >   
                                {options.map((op, i) => (
                                    <div className="col">
                                      <FormControlLabel key={i} value={op.name} control={<Radio />} label={op.name} />
                                    </div>
                                ))}
                            </RadioGroup>
                        </FormControl>
                        <div className="text-center">
                            <button
                            onClick={() => handleSubmit({questionData, course, optionCorrect, options})}
                            className="btn col-6 btn-outline-primary">Submit Question</button>
                        </div>
                    </div>}
                </div>
            </div> 
            <div>
                <h2 align="center">All Questions</h2>
                <div className="col-10 mx-auto">
                    {allQuestions.map((ques, i) => (
                    <div key={i} className="card border-0 p-2 m-auto">
                        <h5>Course: {ques.course.courseName}</h5>
                        <h3>Q{i+1}.<span>{ques.questionData}</span></h3>
                        <div className="d-flex justify-content-around">
                            {ques.options.map((o, i) => (
                                <div key={i}>
                                    <h4>{i+1}. <span className="btn btn-sm btn-outline-primary">{o.name}</span></h4>
                                </div>
                            ))}
                        </div>
                        <p>Correct Option: {ques.optionCorrect}</p>
                        <hr className="bg-dark"/>
                    </div>
                ))}
                </div>
            </div>
        </AdminIndex>
    )
}

export default AdminQuestionCenter