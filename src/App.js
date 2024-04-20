import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Switch, Route, Link } from 'react-router-dom';
import { loadStripe } from '@stripe/stripe-js';
import { Amplify, Auth } from 'aws-amplify';
import { withAuthenticator } from '@aws-amplify/ui-react';
import '@aws-amplify/ui-react/styles.css';
import config from './Config/amplifyconfiguration.json'; 
import Home from './Home/Home';
import AdminHome from './Admin/AdminHome';
import Profile from './Profile/Profile';
import configDetails from './Config/Config';
import CartItems from './Cart/CartItems';
import OrdersHome from './Orders/OrdersHome';
import AdminPageError from './AdminErrorPage';
import "./Styles/App.css"
import About from './Additional/About';


Amplify.configure(config);

function App({ signOut, user }) {
  const [userEmail, setUserEmail] = useState(null);
  const [authToken, setAuthToken] = useState(null);
  const [authIdToken, setAuthIdToken] = useState(null);
  const [showUserProfile, setShowUserProfile] = useState(false);
  const [authUserName, setAuthUserName] = useState('');
  const [authPhone, setAuthPhone] = useState('');
  const [cartItemCount, setCartItemCount] = useState(0); // State to hold the cart item count

  useEffect(() => {
    Auth.currentAuthenticatedUser()
      .then(user => {
        setUserEmail(user.attributes.email);
        setAuthUserName(user.attributes.name);
        setAuthPhone(user.attributes.phone_number);
        setAuthIdToken(user.signInUserSession.idToken.jwtToken);
        setAuthToken(user.signInUserSession.accessToken.jwtToken);

        // Fetch user cart items and count total quantity
        fetchUserCartItemCount(user.attributes.email);
      })
      .catch(err => {
        console.log(err);
        setUserEmail(null);
      });
  }, []);

  const fetchUserCartItemCount = async (email) => {
    try {
      const response = await fetch(`${configDetails.baseUrl}${configDetails.getTotalUserCartQuantity}?email=${email}`);
      if (response.ok) {
        const cartItems = await response.json();
        setCartItemCount(cartItems);
      } else {
        console.error('Failed to fetch user cart items');
      }
    } catch (error) {
      console.error('Error fetching user cart items:', error);
    }
  };

  return (
    <Router>
      <div className="backgroundImageContainer">
        <div className="headerLine1">
          <div className="headerTitle">
            <h1>Denton Shop</h1>
          </div>
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <div style={{ marginRight: '20px', position: 'relative' }}>
              <span style={{ fontSize: '24px', cursor: 'pointer' }} onClick={() => setShowUserProfile(!showUserProfile)}>👨</span>
              {showUserProfile && (
                <div style={{ position: 'absolute', top: '100%', right: 0, background: 'white', padding: '10px', borderRadius: '5px', boxShadow: '0px 0px 10px rgba(0,0,0,0.3)' }}>
                  <span style={{ color: 'blue' }}>{userEmail}</span>
                  <button style={{ backgroundColor: 'green', color: 'white', marginTop: '5px' }} onClick={signOut}>Sign out</button>
                </div>
              )}
            </div>
            </div>
        </div>
        <div className="buttonContainer">
          <Link to="/">
            <button className="homeButton">Home</button>
          </Link>
          <Link to="/orders">
            <button className="ordersButton">Orders</button>
          </Link>
          <Link to="/profile">
            <button className="profileButton">Profile</button>
          </Link>
          <Link to="/cart">
            <button className='cartButton'>Cart</button>
          </Link>
          <Link to="/about">
            <button style={{backgroundColor:'white', color:'black'}}>About</button>
          </Link>
          
          {(configDetails.adminUsers.includes(userEmail)) && (
            <Link to="/admin">
              <button className="adminButton" >Admin</button>
            </Link>
          )}
          
        </div>
        <Switch>
          <Route path="/orders">
            <OrdersHome authIdToken={authIdToken} userEmail={userEmail} />
          </Route>
          <Route path="/profile">
            <Profile authIdToken={authIdToken} userEmail={userEmail} authUserName={authUserName} authPhone={authPhone}/>
          </Route>
          <Route path="/admin" >
            {(configDetails.adminUsers.includes(userEmail))?
            <AdminHome userEmail={userEmail} authIdToken={authIdToken} />:<AdminPageError/>}
          </Route>
          <Route path="/cart">
            <CartItems authIdToken={authIdToken} userEmail={userEmail} userName={authUserName} userPhone={authPhone}/>
          </Route>
          <Route path="/about">
            <About/>
          </Route>
          <Route path="/">
            <Home authIdToken={authIdToken} userEmail={userEmail}/>
          </Route>
        </Switch>
      </div>
    </Router>
  );
}

export default withAuthenticator(App);
