import {
    Collapse,
    Navbar,
    NavbarToggler,
    NavbarBrand,
    Nav,
    NavItem} from 'reactstrap';
import {useState} from "react"
import { Link } from 'react-router-dom';
import { useAuth } from '../actions/auth';
const DefaultNavbar = () => {

    const [isOpen, setIsOpen] = useState(false)

    const toggle = () => {
        setIsOpen(!isOpen);
    };

    const auth = useAuth().contextUser

    return (
            <Navbar color="light" light expand="md">
                <NavbarBrand href="/">Exam Portal</NavbarBrand>
                <NavbarToggler className='border-none' onClick={toggle} />
                <Collapse isOpen={isOpen} navbar>
                    {auth ? 
                    <Nav style={{width:"100%"}} className="d-flex justify-content-end" navbar>
                    {auth && auth.user.role === 1 ? 
                        <NavItem className='px-2 py-2'>
                            <Link className='px-2 btn btn-sm btn-outline-danger' to="/admin/dashboard">Admin Dashboard</Link>
                        </NavItem> : 
                        <NavItem className='px-2 py-2'>
                            <Link className='px-2 btn btn-sm btn-outline-danger' to="/user/dashboard">User Dashboard</Link>
                        </NavItem>}
                        {auth && auth.user.role === 1 ? 
                        <NavItem className='px-2 py-2'>
                            <Link className='px-2 btn btn-sm btn-outline-primary' to="/admin/create-center">Create Center</Link>
                        </NavItem> : 
                        <NavItem className='px-2 py-2'>
                            <Link className='px-2 btn btn-sm btn-outline-primary' to="/user/dashboard">Create Center</Link>
                        </NavItem>}
                    </Nav> : 
                    <Nav style={{width:"100%"}} className="d-flex justify-content-end" navbar>
                        <NavItem className='px-2 py-2'>
                            <Link className='px-2 btn btn-sm btn-outline-primary' to="/login">Login</Link>
                        </NavItem>
                        <NavItem className='px-2 py-2'>
                            <Link className='px-2 btn btn-sm btn-outline-primary' to="/register">Register</Link>
                        </NavItem>
                    </Nav>}
                </Collapse>
            </Navbar>
    )
}

export default DefaultNavbar