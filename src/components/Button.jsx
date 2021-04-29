import React from 'react'
import PropTypes from 'prop-types'
//type rafce to have this boiler plate code autofill

//below i am "destructuring" the props passed in
const Button = ({text, color, onClick}) => {
    return (
        <button onClick={onClick} className='btn' style={{backgroundColor:color}}>
            {text}
        </button>
    )
}

Button.defaultProps = {
    color: 'steelblue',
}

Button.propTypes = {
    text: PropTypes.string,
    color: PropTypes.string,
    onClick: PropTypes.func.isRequired,
}

export default Button
