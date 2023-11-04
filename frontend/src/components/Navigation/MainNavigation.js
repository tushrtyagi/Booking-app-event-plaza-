import React from 'react';
import { NavLink } from 'react-router-dom';
import './MainNavigation.css'
import AuthContext from '../context/auth-context';
import logo from './NavLogo.png'


const MainNavigation = (props) => {
  return(

    <AuthContext.Consumer>
          {(context)=>{
            return(
              <header className="main-navigation">
      <div className='main-navigation__logo'>
      <div className='main-navigation__logo'>
              <h1>
                <img src={logo} alt="Your Logo" /> 
              </h1>
            </div>
      </div>
      <nav className='main-navigation__item'>
        <ul>
          {!context.token && <li>
            <NavLink to="/auth">Login/Signup</NavLink>
          </li>}
          <li>
            <NavLink to="/events">Events</NavLink>
          </li>
          {context.token && 
          <>
          <li>
            <NavLink to="/bookings">Bookings</NavLink>
          </li> 
          <li>
            <button onClick={context.logout}> Logout </button>
          </li>
          </>
          }
        </ul>
      </nav>
    </header>
    
            )
          }}
    </AuthContext.Consumer>
  )
 
};

export default MainNavigation;
