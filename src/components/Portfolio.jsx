import { getByLabelText } from '@testing-library/dom';
import React, { useEffect, useState, useRef } from 'react'

function change(last, prevClose) {
    return Math.round((last - prevClose) * 100) / 100
        
}

function changeP(last, prevClose) {
    let change= Math.round((last - prevClose) * 100) / 100
    return Math.round((change * 100) / prevClose * 100) / 100
}

function financial(x) {
    return Number.parseFloat(x).toFixed(2);
  }

const Portfolio = (props) => {
    const [userBalance, setUserBalance] = useState(0)
    const [userPurchasedStocks, setUserPurchasedStocks] = useState(new Map())
    const [totalStockValue, setTotalStockValue] = useState(0)
    const [quantityForEachStock, setQuantityForEachStock] = useState({})

    const formatUserPurchasesForDisplay = async (purchases) => {
        var uniquePurchasesMap = new Map()
        let tsv = 0;
        let quantities = {}
        let isSelecteds = {}
        //loop through userPurchases and fetch stock data'
        for (const purchase of purchases) {
            //if the ticker has already been added once, add the new purchaseBatch data to the existing purchase object
            if (uniquePurchasesMap.has(purchase.ticker)) {
                uniquePurchasesMap.set(purchase.ticker, {
                    totalPurchases: 1 + uniquePurchasesMap.get(purchase.ticker).totalPurchases,
                    totalPurchasePrice: purchase.purchasePrice + uniquePurchasesMap.get(purchase.ticker).totalPurchasePrice,
                    stockInfo: uniquePurchasesMap.get(purchase.ticker).stockInfo
                })
                //for each purchase, add its last price to the total account value
                tsv = tsv + uniquePurchasesMap.get(purchase.ticker).stockInfo.prices.last
            } else { //else make a new purchase object
                //NEED TO DEAL W THE PROMISES given by fetchstock i think..????
                uniquePurchasesMap.set(purchase.ticker, {
                    totalPurchases: 1,
                    totalPurchasePrice: purchase.purchasePrice, 
                    stockInfo: await props.fetchStock(purchase.ticker) 
                })
                tsv = tsv + uniquePurchasesMap.get(purchase.ticker).stockInfo.prices.last
                quantities = {...quantities, [purchase.ticker]:0 }
            }
        }
        return [uniquePurchasesMap, tsv, quantities, isSelecteds]
    }

    //NOTE this is how you have to do async/await with effects. you call setState() within the async function
    useEffect( () => {
        const getPortfolio = async () => {
            const result = await fetch(`http://localhost:8080/stocks-webapp/get/user/portfolio?userId=${props.userId}`)
            const userPortfolio = await result.json();
            console.log(userPortfolio)
            setUserBalance(userPortfolio.balance)
            let formattedUserPurchasedStocks, tsv, quantities, isSelecteds;
            [formattedUserPurchasedStocks, tsv, quantities, isSelecteds] = await formatUserPurchasesForDisplay(userPortfolio.purchases)
                //idk why js is getting mad at me here
            setQuantityForEachStock(quantities)
            console.log(isSelecteds);
            setUserPurchasedStocks(formattedUserPurchasedStocks)
            
            setTotalStockValue(tsv)
        }

        getPortfolio();
    }, []); //adding this empty array here means the hook is ONLY called upon component mount and not component update

    const handleChange = (event) => {
        let ticker = event.target.getAttribute('data-index')
        setQuantityForEachStock({ ...quantityForEachStock, [ticker]:event.target.value})
        console.log(ticker);
    }

    const onSell = async (event) => {
        //CHECK IF MARKET IS OPEN NEED TO ADD THIS CODE HERE
        let ticker = event.target.getAttribute('data-index')
        let amount, price;
        console.log(event);
        [amount, price] = [quantityForEachStock[ticker], userPurchasedStocks.get(ticker).stockInfo.prices.prevClose]
        console.log(amount);
        console.log(price);
        if (amount < 1) {
            alert("Trade could not be completed")
            return
        }
        const userPortfolio = await props.sellOrder(ticker, amount, price)
        if (Object.entries(userPortfolio).length === 0) {
            alert("Trade could not be completed")
            return
        }
        setUserBalance(userPortfolio.balance)
        setUserPurchasedStocks(await formatUserPurchasesForDisplay(userPortfolio.purchases))
        alert(`SUCCESS: Executed sale of ${amount} shares of ${ticker} for $${price}`)
    }

    const onBuy = async (event) => {
        let ticker = event.target.getAttribute('data-index')
        let amount, price;
        [amount, price] = [quantityForEachStock.ticker, userPurchasedStocks.get(ticker).stockInfo.prices.prevClose]
        if (true) {
            alert("Trade could not be completed")
            return
        }
        const userPortfolio = await props.buyOrder(ticker, amount, price)
        if (Object.entries(userPortfolio).length === 0) {
            alert("Trade could not be completed")
            return
        }
        setUserBalance(userPortfolio.balance)
        setUserPurchasedStocks(await formatUserPurchasesForDisplay(userPortfolio))
        alert(`SUCCESS: Executed purchase of ${amount} shares of ${ticker} for $${price}`)
    }

    //keys help react identity items in a list and greatly improve efficiency in updating. keys dont get passed as props.
    //keys and refs are the two props which dont get pased down automatically
    const portfolioItems = Array.from(userPurchasedStocks).map(([ key, value] ) =>
        <div data-index={key} className='portfolio-box'>
            <div style={{width:'100%', display:'inline-block', verticalAlign:'top', height: '10px', lineHeight: '20px', textAlign: 'left', marginLeft:'10px', marginBottom:'20px'}}>
                <strong>{key}</strong><strong style={{fontSize:'10px', color:'grey'}}>       {value.stockInfo.info.name}</strong>
            </div> <br/>
            <div style={{width:'100%', height:'80px',  display:'inline-block', backgroundColor:'white', border:'1px solid lightgrey', textAlign:'left'}} >
                <div className="portfolio-info-section">
                    <div style={{position:'absolute', left:'0', top:'0'}}>
                        <div style={{textAlign:'left'}}>Quantity: </div>
                        <div style={{textAlign:'left'}}>Avg. Cost / Share:</div>
                        <div style={{textAlign:'left'}}>Total Cost:</div>
                    </div>
                    <div style={{position:'absolute', right:'0', top:'0'}}>
                        <div style={{textAlign:'right'}}>{userPurchasedStocks.get(key).totalPurchases}</div>
                        <div style={{textAlign:'right'}}>{financial(userPurchasedStocks.get(key).totalPurchasePrice / userPurchasedStocks.get(key).totalPurchases)}</div>
                        <div style={{textAlign:'right'}}>{financial(userPurchasedStocks.get(key).totalPurchasePrice)}</div>
                    </div>
                </div>
                <div className="portfolio-info-section">
                    <div style={{position:'absolute', left:'0', top:'0'}}>
                        <div style={{textAlign:'left'}}>Change: </div>
                        <div style={{textAlign:'left'}}>Current Price:</div>
                        <div style={{textAlign:'left'}}>Market Value:</div>
                    </div>
                    <div style={{position:'absolute', right:'0', top:'0'}}>
                        <div style={{textAlign:'right', color: `${change(userPurchasedStocks.get(key).stockInfo.prices.last, userPurchasedStocks.get(key).stockInfo.prices.prevClose) >= 0 ? 'green' : 'red'}`}}>{change(userPurchasedStocks.get(key).stockInfo.prices.last, userPurchasedStocks.get(key).stockInfo.prices.prevClose) >= 0 ? 'Up ' : 'Down '}{`${financial(change(userPurchasedStocks.get(key).stockInfo.prices.last, userPurchasedStocks.get(key).stockInfo.prices.prevClose))} (${financial(changeP(userPurchasedStocks.get(key).stockInfo.prices.last, userPurchasedStocks.get(key).stockInfo.prices.prevClose))})%`}</div>
                        <div style={{textAlign:'right'}}>{financial(userPurchasedStocks.get(key).stockInfo.prices.last)}</div>
                        <div style={{textAlign:'right'}}>{financial(userPurchasedStocks.get(key).stockInfo.prices.last * userPurchasedStocks.get(key).totalPurchases)}</div>
                    </div>
                </div>
                
            </div> <br/>
            <div style={{display:'inline-block', textAlign:'center', marginTop:'10px'}} className='portfolio-form'>
                <label style={{float: 'none'}}>Quantity: </label>
                <input style={{width: '50px', textAlign:'left'}} data-index={key} type='number' value={quantityForEachStock[key]} onChange={handleChange}></input>
                <br/>
                <input style={{width: '20px', marginLeft:'20px'}} checked={true} name={`${key}radio`} value={true} type='radio'></input>
                <label>SELL</label>
                <br/>
                <input style={{width: '40px'}} type='submit'  data-index={key} onClick={onSell}></input>
            </div>
        </div>
    )

    return (
        <div id='portfolio-container'>
            <div style={{textAlign:'left', float:'left'}}>
                <strong style={{fontSize:'30px'}}>My Portfolio</strong><br/>
                <strong style={{marginLeft:'20px'}}>Cash Balance: {financial(userBalance)}</strong><br/>
                <strong style={{fontSize:'15px', marginLeft:'20px'}}>Total Account Value: </strong><strong style={{fontSize:'15px', backgroundColor:"yellow"}}>{financial(userBalance + totalStockValue)}</strong>
            </div>
            <div style={{clear:'both'}}>
                <ul>
                    {portfolioItems}
                </ul>
            </div>
        </div>
    )
}

export default Portfolio
