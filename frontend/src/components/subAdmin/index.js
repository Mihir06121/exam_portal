import SubAdminNav from "./SubAdminNav"

const SubAdmin = ({children}) => {
    return (
        <div>
            <SubAdminNav/>
            {children}
        </div>
    )
}

export default SubAdmin