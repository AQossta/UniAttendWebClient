import { NavLink } from "react-router-dom";

function NotFoundPage() {
  return (
    <>
      Бұл бет табылмады, <NavLink to='/'>Басты бетке</NavLink> өтіңіз
    </>
  );
}

export default NotFoundPage;