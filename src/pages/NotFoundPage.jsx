import { NavLink } from "react-router-dom"

function NotFoundPage(){
    return(
        <>
            This is NotFoundPage, go <NavLink to='/'>Home</NavLink>
        </>
    )
}

export default NotFoundPage