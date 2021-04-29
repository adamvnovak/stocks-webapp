//rafce
import React from 'react'
import { useState, useEffect } from 'react'
import { useHistory  } from 'react-router-dom'

const Login = (props) => {
    const history = useHistory()
    const [logInInput, setLogInInput] = useState({ username: '', password: '' })
    const [signUpInput, setSignUpInput] = useState({ username: '', email: '', password: '', confirmpassword: ''})
    const [checked, setChecked] = useState(false)

    useEffect(() => {
        setLogInInput({ username: '',password: '' });
        setSignUpInput({ username: '', email: '', password: '' , confirmpassword: '' });
        setChecked(false)
    }, [])

    const attemptLogIn = async () => {
        const logInResult = await fetch (`http://localhost:8080/stocks-webapp/post/user/login?username=${logInInput.username}&password=${logInInput.password}`, {
            method: 'POST'
        })
        const logInJSON = await logInResult.json();
        return logInJSON;
    }
    
    const attemptSignUp = async () => {
        const signUpResult = await fetch (`http://localhost:8080/stocks-webapp/post/user/signup?email=${signUpInput.email}&username=${signUpInput.username}&password=${signUpInput.password}`, {
            method: 'POST'
        })
        const signUpJSON = await signUpResult.json();
        return signUpJSON;
    }

    const validateSignUpInput = () => {
        if(signUpInput.username === '' || signUpInput.email === '' || signUpInput.password === '') {
            alert('All fields must be filled out')
            return false
        }

        if(signUpInput.password.length < 8) {
            alert('Password must be at least 8 characters long')
            return false
        }

        if(!signUpInput.email.includes('@') || !(signUpInput.email.substr(signUpInput.email.length - 4) === '.com' || signUpInput.email.substr(signUpInput.email.length - 4) === '.edu' || signUpInput.email.substr(signUpInput.email.length - 4) === '.net')) {
            alert('Email must be a valid email')
            return false
        }
        if (!checked) {
            alert("Must agree to the terms and conditions")
            return false
        }
        return true
    }

    const onSignUp = async (event) => {
        event.preventDefault();
        if(!validateSignUpInput()) {
            return
        }
        let userInfo = await attemptSignUp();
        if (Object.entries(userInfo).length === 0) {
            alert("Sign up failed. Please try again.")
        } else { //else signup succeeded
            console.log(userInfo);
            props.onLogIn(userInfo)
            history.push({
                pathname: `/`,
            })
        }
    }
    
    const onLogIn = async (event) => {
        event.preventDefault();

        let userInfo = await attemptLogIn();
        if (Object.entries(userInfo).length === 0) {
            alert("Log in failed. Please try again.")
        } else { //else signup succeeded
            console.log(userInfo);
            props.onLogIn(userInfo)
            history.push({
                pathname: `/`,
            })
            
        }
    }

    return (
        <div className='container' style={{color:'gray'}}>
            <div id='signup-login' style={{textAlign:'left', float:'left'}} >
                <h3 className='signup-login-label'>Login</h3><br/>
                <form onSubmit={onLogIn}>
                    <label className='signup-login-label'>Username</label>
                    <input className='signup-login-field' type='text' value={logInInput.username} 
                    onChange={(event) => setLogInInput({ username: event.target.value, password: logInInput.password })} 
                    /><br/><br/>
                    <label className='signup-login-label'>Password</label>
                    <input className='signup-login-field' type='password' value={logInInput.password} 
                    onChange={(event) => setLogInInput({ username: logInInput.username, password: event.target.value })} 
                    /><br/><br/>
                    <input className='signup-login-button' type='button' value='Sign In' onClick={onLogIn}></input>
                </form>
            </div>
            <div id='signup-login' style={{textAlign:'left', float:'left'}} >
                <h3 className='signup-login-label'>Sign Up</h3><br/>
                <form onSubmit={onSignUp}>
                    <label className='signup-login-label'>Email</label>
                    <input className='signup-login-field' type='text' value={signUpInput.email} 
                    onChange={(event) => setSignUpInput({ email: event.target.value, username: signUpInput.username, password: signUpInput.password, confirmpassword: signUpInput.confirmpassword })} 
                    /><br/><br/>
                    <label className='signup-login-label'>Username</label>
                    <input className='signup-login-field' type='text' value={signUpInput.username} 
                    onChange={(event) => setSignUpInput({ email: signUpInput.email, username: event.target.value, password: signUpInput.password, confirmpassword: signUpInput.confirmpassword })} 
                    /><br/><br/>
                    <label className='signup-login-label'>Password</label>
                    <input className='signup-login-field' type='password' value={signUpInput.password} 
                    onChange={(event) => setSignUpInput({ email: signUpInput.email, username: signUpInput.username, password: event.target.value, confirmpassword: signUpInput.confirmpassword })} 
                    /><br/><br/>
                    <label className='signup-login-label'>Confirm Password</label>
                    <input className='signup-login-field' type='password' value={signUpInput.confirmpassword} 
                    onChange={(event) => setSignUpInput({ email: signUpInput.email, username: signUpInput.username, password: signUpInput.password, confirmpassword: event.target.value })} 
                    /><br/><br/>
                    <div className='signup-login-label'>
                        <input type='checkbox' name='checkbox'  onClick={() => setChecked(!checked)} value='agree'></input> <span  style={{fontSize:'10px'}}>I have read and agree to all terms and conditions of SalEats.</span>
                    </div><br/>
                    <input className='signup-login-button' type='button' value='Create Account' onClick={onSignUp}></input>
                </form>
            </div>
        </div>
    )
}

export default Login
