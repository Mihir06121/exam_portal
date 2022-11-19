import UserNav from "./UserNav"

const UserIndex = ({children}) => {
    return (
        <div>
            <UserNav/>
            {children}
        </div>
    )
}

export default UserIndex