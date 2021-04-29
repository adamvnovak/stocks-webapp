import { Link, NavLink } from 'react-router-dom'
import { useLocation } from 'react-router-dom' //allows you to look at your curent route

const NavBar = (props) => {
    const location = useLocation();
    return (
        <div className='navbar'>
            <NavLink className='navbutton nav-left' to='/'>SalStonks</NavLink>
            {props.userId === 'guest' && <Link className='navbutton nav-right' activeClassName='navbutton-selected' to='/login'>Login/Sign Up</Link>}

            {props.userId !== 'guest' && <Link className={`navbutton nav-right`} to='/' onClick={() => props.onLogOut()}>Logout</Link>}
            {props.userId !== 'guest' && <Link className={`navbutton nav-right ${location.pathname === '/portfolio' && 'navbutton-selected'}`} to='/portfolio'>Portfolio</Link>}
            {props.userId !== 'guest' && <Link className={`navbutton nav-right ${location.pathname === '/favorites' && 'navbutton-selected'}`} to='/favorites'>Favorites</Link>}

            <Link className={`navbutton nav-right ${location.pathname === '/' && 'navbutton-selected'}`} to='/'>Home/Search</Link>

        </div>
    )
}

export default NavBar
