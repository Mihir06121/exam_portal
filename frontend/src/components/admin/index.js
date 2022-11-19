import AdminNav from "./AdminNav"

const AdminIndex = ({children}) => {
    return (
        <div>
            <AdminNav/>
            {children}
        </div>
    )
}

export default AdminIndex