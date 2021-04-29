import React, { useEffect, useState } from 'react'
import { useHistory } from 'react-router-dom';
import x from '../assets/x.png'

function financial(x) {
    return Number.parseFloat(x).toFixed(2);
  }

const Favorites = (props) => {
    const [favoritesInfo, setFavoritesInfo] = useState(new Map())

    //you can either set initial state here^, or create a useEffect hook which will only occur on the first render and set state there. both work

    //occurs after EVERY render aka when the DOM has been updated. even happens after first render
    //rerender also occurs after setState function called
    //q:
    const history = useHistory()

    useEffect(() => {
        const getFavoritesInfo = async () => {
            console.log(props.userFavorites);
            var favoritesInfoMap = new Map()
            if (Array.isArray(props.userFavorites)) {
                console.log('yea its an array');
                for (const ticker of props.userFavorites) {
                    console.log('looping');
                    var newFavoriteInfo = await props.fetchStock(ticker)

                    const lastPrice = newFavoriteInfo.prices.last;
                    const change = Math.round((newFavoriteInfo.prices.last - newFavoriteInfo.prices.prevClose) * 100) / 100
                    const changePercentage = Math.round((change * 100) / newFavoriteInfo.prices.prevClose * 100) / 100
                    const stockName = newFavoriteInfo.info.name;

                    favoritesInfoMap.set(ticker, {last: lastPrice, change: change, changeP: changePercentage, stockName: stockName})
                    console.log(ticker)
                }
            }
            setFavoritesInfo(favoritesInfoMap)
        }
        getFavoritesInfo()
    }, []); //adding this empty array here means the hook is ONLY called upon component mount and not component update

    const onDelete = (event) => {
        event.stopPropagation() //prevents the button behind from also being clicked
        var ticker = event.target.getAttribute('data-index')
        console.log(ticker);
        props.toggleFavoritedStock(ticker, 'remove')
        console.log(favoritesInfo.delete(ticker))
        const newFavsMap = favoritesInfo
        setFavoritesInfo(newFavsMap)
    }

    const onClicky = (event) => {
        var ticker = event.target.getAttribute('data-index')
        history.push({
            pathname: `/stock/${ticker}`
        })
    }

    const favoritesList = Array.from(favoritesInfo).map(([ key, value] ) =>
        <div data-index={key} className='favorites-box' onClick={onClicky} style={{cursor:'pointer'}}>
            <div style={{textAlign:'left', float:'left', marginLeft:'10px'}}>
                <strong>{key}</strong><br/>
                <strong style={{fontSize:'13px'}}>{value.stockName}</strong>
            </div>
            <div style={{textAlign:'right', float:'right', color: `${value.change >= 0 ? 'green' : 'red'}`}} >
                <span>{financial(value.last)}</span><br/>
                <span style={{fontSize:'13px'}}>{value.change >= 0 ? 'Up ' : 'Down '}{`${financial(value.change)} (${financial(value.changeP)})%`}</span>
            </div>
            <input  data-index={key} className='favorites-x' src={x} type='image' alt='delete' onClick={onDelete}></input>
        </div>
    )

    return (
        <div id='favorites-container'>
            <h4 style={{textAlign:'left'}}>My Favorites</h4>
                {favoritesList}
        </div>
    )
}

export default Favorites
