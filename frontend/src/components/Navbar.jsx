import { Link } from 'react-router-dom'
import './Navbar.css'

const Navbar = () => {
  return (
    <nav className="navbar">
      <div className="navbar-container">
        <Link to="/" className="logo">
          ?? Confess & Advise
        </Link>
        <div className="nav-links">
          <Link to="/confessions">Confessions</Link>
          <Link to="/advice">Advice</Link>
          <Link to="/login">Login</Link>
          <Link to="/register">Register</Link>
        </div>
      </div>
    </nav>
  )
}

export default Navbar
