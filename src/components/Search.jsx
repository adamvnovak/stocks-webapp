import React from 'react'
import { useState } from 'react'
import { BrowserRouter as Router, Route, useHistory  } from 'react-router-dom'
import searchIcon from '../assets/search.jpg'


const Search = (props) => {
    //component-level state
    const [inputText, setInputText] = useState('')
    const [placeholderText, setPlaceholderText] = useState('Enter Stock Ticker')

    //this is a custom hook
    const history = useHistory()

    const onBlur = () => {
        setPlaceholderText('Enter Stock Ticker')
    }

    const onFocus = () => {
        setPlaceholderText('');
    }

    const onSubmit = async (event) => {
        event.preventDefault();
        if(!inputText) {
            alert('Please enter a stock!')
            return
        }

        console.log(props);
        history.push({
            pathname: `/stock/${inputText}`
        })
    }

    return (
        <div className="home">
            <h1>STONK SEARCH</h1>
            <form id='search-bar' onSubmit={onSubmit}>
                <input id= 'search-term' type='text' 
                placeholder={placeholderText} value={inputText} 
                onChange={(event) => setInputText(event.target.value)} 
                onBlur={onBlur} onFocus={onFocus}
                onKeyDown={(event) => {event.keyCode === 13 && onSubmit(event)}}
                />
                <input id='search-icon' type='image' src={searchIcon} value='submit' alt='submit'></input>
            </form>
        </div>
    )
}

export default Search
