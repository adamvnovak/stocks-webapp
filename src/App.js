//to use states, need a hook called useState
import { useState, useEffect } from 'react'
import NavBar from './components/NavBar.jsx'
import Search from './components/Search.jsx'
import StockInfo from './components/StockInfo.jsx'
import Login from './components/Login.jsx'

import { BrowserRouter as Router, Route, Switch } from 'react-router-dom'


//need this import for classes
import React from 'react'
import Portfolio from 'components/Portfolio.jsx'
import Favorites from 'components/Favorites.jsx'

  //states get passed down, actions get passed up

  JSON.stringify({foo:'bar'})


function App() {
   //initialstate only used on first render  
  const [userId, setUserId] = useState(sessionStorage.getItem('userId') || 'guest')
  const [userFavorites, setUserFavorites] = useState(() => {
    if (sessionStorage.getItem('userFavorites')) {
      return JSON.parse(sessionStorage.getItem('userFavorites'))
    } else {
      return []
    }
  } )
/*
  useEffect(() => {
    setUserId(sessionStorage.getItem('userId') || 'guest')
    const favs = sessionStorage.getItem('userFavorites')
    if (favs !== '')  || []
    {
      console.log(favs);
      let jsonfavs = JSON.parse(favs)
      console.log(jsonfavs);
      setUserFavorites(jsonfavs)
    }
  }, [])
  */

  const fetchStock = async (ticker) => {
    const pricesResult = await fetch (`http://localhost:8080/stocks-webapp/get/tiingo/prices?ticker=${ticker}`)
    const infoResult = await fetch (`http://localhost:8080/stocks-webapp/get/tiingo/info?ticker=${ticker}`)
    const pricesData = await pricesResult.json();
    const infoData = await infoResult.json();
    return { info: infoData, prices: pricesData[0] }
  }

  const sellOrder = async (ticker, amount, price) => {
    const result = await fetch (`http://localhost:8080/stocks-webapp/post/user/sellOrder?userId=${userId}&ticker=${ticker}&amount=${amount}&purchasePrice=${price}`, {
        method: 'POST'
    })
    const updatedPortfolio = await result.json();
    return updatedPortfolio;
  }

  const buyOrder = async (ticker, amount, price) => {
    const result = await fetch (`http://localhost:8080/stocks-webapp/post/user/buyOrder?userId=${userId}&ticker=${ticker}&amount=${amount}&purchasePrice=${price}`, {
        method: 'POST'
    })
    const updatedPortfolio = await result.json();
    return updatedPortfolio;
  } 

  const toggleFavoritedStock = async (ticker, toggle) => {
    console.log('done');
    const result = await fetch (`http://localhost:8080/stocks-webapp/post/user/toggleFavoritedStock?userId=${userId}&ticker=${ticker}&toggle=${toggle}`, {
      method: 'POST'
    })
    console.log('hi');
    console.log(result);
    const newFavorites = await result.json();
    setUserFavorites(newFavorites)
    console.log(newFavorites +"is new fvorites");
    sessionStorage.setItem('userFavorites', JSON.stringify(newFavorites))
}

  const logOut = () => {
    setUserId('guest')
    sessionStorage.setItem('userId', 'guest')
  }

  const logIn = (userInfo) => {
    console.log("Now logged in: " + userInfo)
    setUserId(userInfo.userID)
    setUserFavorites(userInfo.favoritedStocks)
    sessionStorage.setItem('userId', userInfo.userID)
    //localstorage only supports strings
    var jsonarray = JSON.stringify(userInfo.favoritedStocks)
    console.log(jsonarray);
    sessionStorage.setItem('userFavorites', jsonarray)

  }

  /*
  const getFavoriteTickers = async () => {
    const result = await fetch (`http://localhost:8080/stocks-webapp/get/user/favorites?userId=${userId}`)
    const favoriteTickers = await result.json();
    return favoriteTickers
  }
  const getFavoriteStocks = async () => {
      const favoriteTickers = await getFavoriteTickers();
      var favoriteTickersArray = Object.entries(favoriteTickers) //cast into array
      console.log("outputting favs:" + favoriteTickersArray);
      return(favoriteTickersArray.map(
          (favoriteTicker) => {return }
      ));
  }
  */

  return (
    <Router>
      <div className="app">
        <NavBar userId={userId} onLogOut={logOut}/>
        <div className='content'>
          <Switch>
            <Route path='/' exact render={routeProps => (
              <Search />
            )} />
            <Route path='/stock' render={routeProps => (
              <StockInfo userId={userId} fetchStock={fetchStock} userFavorites={userFavorites} toggleFavoritedStock={toggleFavoritedStock} buyOrder={buyOrder}/>
            )} />
            <Route path='/login' render={routeProps => (
              <Login onLogIn={logIn}/>
            )} />
            <Route path='/portfolio' render={routeProps => (
              <Portfolio userId={userId} fetchStock={fetchStock} sellOrder={sellOrder} buyOrder={buyOrder}/>
            )} />
            <Route path='/favorites' render={routeProps => (
              <Favorites userId={userId} fetchStock={fetchStock} userFavorites={userFavorites} toggleFavoritedStock={toggleFavoritedStock}/>
            )} />
          </Switch>
        </div>
      </div>
    </Router>
  );
}

export default App