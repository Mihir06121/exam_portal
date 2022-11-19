import {
    Collapse,
    Navbar,
    NavbarToggler,
    NavbarBrand,
    Nav,
    NavItem} from 'reactstrap';
import {useState} from "react"
import { Link } from 'react-router-dom';
import { useAuth, logout } from '../../actions/auth';

const UserNav = () => {

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
                    <Nav style={{width:"100%"}} className="d-flex justify-content-end" navbar>
                        <NavItem className='px-2 py-2'>
                            <Link className='px-2 btn btn-sm btn-outline-primary' to="/user/dashboard">User Dashboard</Link>
                        </NavItem>
                        <NavItem className='px-2 py-2'>
                            <Link className='px-2 btn btn-sm btn-outline-primary' to="/user/center-info">Center Information</Link>
                        </NavItem>
                        <NavItem className='px-2 py-2'>
                            <Link onClick={() => logout()} to="/login" className='px-2 btn btn-sm btn-danger'>Logout</Link>
                        </NavItem>
                    </Nav>
                </Collapse>
            </Navbar>
    )
}

export default UserNav