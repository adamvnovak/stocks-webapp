import React from 'react'
import { useState, useEffect, useContext } from 'react'
import { useHistory  } from 'react-router-dom'
import emptystar from '../assets/emptystar.png'
import goldstar from '../assets/goldstar.png'


const StockInfo = (props) => {
    const [searchedStock, setSearchedStock] = useState(false)
    const [quantity, setQuantity] = useState(0)

    function financial(x) {
        return Number.parseFloat(x).toFixed(2);
      }

    //custom hook
    const history = useHistory()
        
    //function in useEffect() is run AFTER the component render/rerender(aka after the DOM is updated)
    //similar to a class's "component did update"
    //used to fetch data, manually edit DOM
    //allows access to component's state
    //each render will generate a new effect, because the effect might change based on the component's state
    useEffect(() => {
        const getStock = async () => {
            const stockFromServer = await props.fetchStock((history.location.pathname).slice(7))
            setSearchedStock(stockFromServer)
        }
        getStock()
    }, [])
    //here at the bottom is a dependency array. if you want useEffect to run when User changes, pass User here.

    const toggleFavorite = () => {
        var toggle = 'add'
        if (isFavorite) {
            toggle = 'remove'
        }
        props.toggleFavoritedStock(searchedStock.info.ticker, toggle)
        isFavorite = !isFavorite
        console.log(isFavorite);
    }

    const onBuy = async () => {
        console.log("buying");
        if (!isMarketOpen || quantity <1) { 
            alert('FAILED: Purchase not possible')
            return
        }
        else {
            //buy at ask price, sell at bid price
            const price = searchedStock.prices.askPrice
            var updatedPortfolio = await props.buyOrder(searchedStock.info.ticker, quantity, price)
            console.log(updatedPortfolio)
            if (Object.entries(updatedPortfolio).length !== 0) {
                alert(`SUCCESS: Executed purchase of ${quantity} shares of ${searchedStock.info.ticker} for $${searchedStock.prices.askPrice}`)
                return
            } else {
                alert('FAILED: Purchase not possible. Insufficient funds.')
                return
            }
        }   
    }

    //if initial state, dont load anything until page is rerendered when stock info arrives
    if (!searchedStock) {
        return (<div />)
    } else if (Object.entries(searchedStock.info).length === 0) {
        return (
            <div>
                Stock could not be found. Please search again.
            </div>
        )
    }
    else {
        let stockName, description, ticker, exchangeCode, startDate, endDate, askPrice, askSize, bidPrice, bidSize, high, last, lastSaleTimestamp, lastSize, low, mid, open, prevClose, quoteTimestamp, ticker2, timestamp, tngoLast, volume;
        ({ stockName, description, ticker, exchangeCode, startDate, endDate} = searchedStock.info);
        ({ askPrice, askSize, bidPrice, bidSize, high, last, lastSaleTimestamp, lastSize, low, mid, open, prevClose, quoteTimestamp, ticker2, timestamp, tngoLast, volume } = searchedStock.prices);

        var change = Math.round((last - prevClose) * 100) / 100
        var changePercentage = Math.round((change * 100) / prevClose * 100) / 100
        
        stockName = searchedStock.info.name //for some reason the array destructuring doesnt set stockName, so i need this
        var isMarketOpen = true;
        if (!mid) {
            isMarketOpen = false
        }
        var isFavorite = false
        if (props.userFavorites !== null && Array.isArray(props.userFavorites) && props.userFavorites.includes(ticker)) {
            isFavorite = true
        }
        //style={{textAlign: `${props.userId === 'guest' ? 'center' : 'left'}`}}
        return (
        <div className='container'>
            <div style={{float: `${props.userId === 'guest' ? 'none' : 'left'}`}}>
                <div>
                    <h1 style={{float: `${props.userId === 'guest' ? 'none' : 'left'}`}}>{ticker}</h1>
                    {props.userId !== 'guest' && <input style={{width:'70px', float:'left', marginLeft:'20px'}} type='image' src={isFavorite ? goldstar : emptystar} onClick={toggleFavorite} alt='submit'></input>}
                </div>
                <h3 style={{color: 'gray', clear:'both', textAlign: `${props.userId === 'guest' ? 'center' : 'left'}`}} >{stockName}</h3>
                <div style={{textAlign: `${props.userId === 'guest' ? 'center' : 'left'}`}}>{exchangeCode}</div><br/>
                {props.userId !== 'guest' && <label style={{float: 'left'}}>Quantity:</label>}
                {props.userId !== 'guest' && <input style={{float: 'left', width:'70px', height: '20px', marginLeft:'10px', textAlign:'left', border:'1px solid black'}} type='number' value={quantity} onChange={(event) => setQuantity(event.target.value)}></input>}<br/>
                {props.userId !== 'guest' && <input style={{float: 'left', width:'70px', height:'30px', border: 'none', backgroundColor:'green', color:'white', cursor:'pointer'}} type='button' onClick={onBuy} value={'Buy'}></input>}

            </div>

            {props.userId !== 'guest' && 
            <div className='stock-numbers-header' style={{color: `${change >= 0 ? 'green' : 'red'}`, textAlign: 'right'}}>
                <h2 className='stock-numbers-header'>{financial(last)}</h2>
                <h3 style={{clear:'right', textAlign: 'right'}}>{change >= 0 ? 'Up ' : 'Down '}{`${financial(change)} (${financial(changePercentage)})%`}</h3>
                <span style={{color: 'black', clear:'right', textAlign: 'right'}}>{quoteTimestamp.substr(0,10) + '\t' + quoteTimestamp.substr(11,11)}</span>
            </div>}
            <br/><br/><div className='lower-section'>
            {props.userId !== 'guest' &&  <span style={{color: 'black'}} className={isMarketOpen ? 'open-market' : 'closed-market'}>{isMarketOpen ? 'Market is Open' : 'Market is Closed'}</span>}<br/>
                <span style={{color: 'gray'}}>Summary</span> <br/><br/>
                <hr style={{color: "rgb(113, 74, 204)"}}/> <br/><br/>
                <div className ='prices-info'>
                    <div className={props.userId !=='guest' && 'prices-info-section'}>
                        High Price: {high} <br/>
                        Low Price: {low} <br/>
                        Open Price: {open} <br/>
                        Prev. Close: {prevClose} <br/>
                        Volume: {volume} <br/>
                    </div>
                    {(props.userId !== 'guest' && isMarketOpen) && 
                    <div className='prices-info-section'>
                        Mid Price: {mid} <br/>
                        Ask Price: {askPrice} <br/>
                        Ask Size: {askSize} <br/>
                        Bid Price: {bidPrice} <br/>
                        Bid Size: {bidSize} <br/>
                    </div>
                    }
                </div>
                <br/><br/>
                <div className='company-description'>
                    <h3>Company's Description</h3> <br/><br/>
                    <div style={{textAlign:'left', fontSize: '15px'}}>
                        Start Date: {startDate} <br/> <br/>
                        {description}
                    </div>
                </div><br/><br/><br/>
            </div>
        </div>
        )
    }
}



export default StockInfo
