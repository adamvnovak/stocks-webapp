//you actually dont need to do this for each component anymore
import React from 'react'
import { useLocation } from 'react-router-dom' //allows you to look at your curent route
import PropTypes from 'prop-types'
import Button from './Button.jsx'


//props is just an object with key:value pairs
const Header = (props) => {
    const location = useLocation()

    return (
        //you need {{}} for inline CSS
        <header className='header'>
            <h1 style={{ color:'red', backgroundColor:'white'}}> {props.title}Stocks {props.page}</h1>
            {location.pathname === '/' && <Button text='button name' color='blue' onClick={props.onAdd}/>}
        </header>
    )
}

Header.defaultProps = {
    title: 'default prop',
}

Header.propTypes = {
    title: PropTypes.string.isRequired,
    page: PropTypes.number,
}

//css in JS
// eslint-disable-next-line
const headingStyle = {
    color:'red',
    backgroundColor:'black',
}

export default Header
