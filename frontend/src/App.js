import React, { Component } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import AuthPage from './pages/Auth';
import EventsPage from './pages/Events';
import BookingsPage from './pages/Bookings';
import MainNavigation from './components/Navigation/MainNavigation';
import AuthContext from "./components/context/auth-context"

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      token: null,
      userId: null
    };
  }

  login = (token, userId, tokenExpiration) => {
    this.setState({ token: token, userId: userId });
  };

  logout = () => {
    this.setState({ token: null, userId: null });
  };

  render() {
    const { token, userId } = this.state;
    return (
      <Router>
        <AuthContext.Provider value={{
          token: token,
          userId: userId,
          login: this.login,
          logout: this.logout
        }}>
          <MainNavigation />
          <main className='main-content'>
            <Routes>
              {token && <Route path="/" element={<Navigate to="/events" />} />}
              {token && <Route path="/auth" element={<Navigate to="/events" />} />}
              {!token && <Route path="/auth" element={<AuthPage />} />}
              <Route path="/events" element={<EventsPage />} />
              {token && <Route path="/bookings" element={<BookingsPage />} />}
              {/* {!token && <Route path="/events" element={<Navigate to="/auth" />} />}
              {!token && <Route path="/bookings" element={<Navigate to="/auth" />} />} */}
              {!token && <Route path="*" element={<Navigate to="/auth" />} />}

            </Routes>
          </main>
        </AuthContext.Provider>
      </Router>
    );
  }
}

export default App;
