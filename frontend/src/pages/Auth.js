import React, { Component } from 'react';
import './Auth.css';
import Success from './success.png';
import AuthContext from '../components/context/auth-context';

class AuthPage extends Component {
  state = {
    isLogin: true,
    success: null,
    emailError: "",
    passwordError: "",
    loginError: "",
  };

  static contextType = AuthContext;

  constructor(props) {
    super(props);
    this.emailEl = React.createRef();
    this.passwordEl = React.createRef();
  }

  switchModeHandler = () => {
    this.setState((prevState) => {
      return { isLogin: !prevState.isLogin };
    });
  };

  validateForm = () => {
    let valid = true;
    this.setState({ emailError: "", passwordError: "", loginError: "" });

    const email = this.emailEl.current.value;
    const password = this.passwordEl.current.value;

    if (email.trim().length === 0 || !email.includes('@')) {
      this.setState({ emailError: 'Please enter a valid email address.' });
      valid = false;
    }

    if (password.trim().length < 3) {
      this.setState({
        passwordError: 'Password must be at least 3 characters long.',
      });
      valid = false; 
    }

    return valid;
  };

  checkEmailExists = async (email) => {
    // Make a request to your GraphQL server to check email existence
    const requestBody = {
      query: `
        query CheckEmail($email: String!) {
          checkEmailExists(email: $email)
        }
      `,
      variables: {
        email: email,
      },
    };

    try {
      const response = await fetch('http://localhost:8000/graphql', {
        method: 'POST',
        body: JSON.stringify(requestBody),
        headers: {
          'Content-Type': 'application/json',
        },
      });

      const responseData = await response.json();

      return responseData.data.checkEmailExists;
    } catch (error) {
      console.log(error);
      return false;
    }
  };

  submitHandler = async (event) => {
    event.preventDefault();

    if (this.validateForm()) {
      const email = this.emailEl.current.value;
      const password = this.passwordEl.current.value;

      // If it's a signup form, check if the email already exists
      if (!this.state.isLogin) {
        const emailExists = await this.checkEmailExists(email);
        if (emailExists) {
          this.setState({ emailError: 'User already exists.' });
          return;
        }
      }

      let requestBody = {
        query: `
          query {
            login(email: "${email}", password: "${password}") {
              userId
              token
              tokenExpiration
            }
          }
        `,
      };

      if (!this.state.isLogin) {
        requestBody = {
          query: `
            mutation {
              createUser(userInput: {email: "${email}", password: "${password}"}) {
                _id
                email
              }
            }
          `,
        };
      }

      try {
        const response = await fetch('http://localhost:8000/graphql', {
          method: 'POST',
          body: JSON.stringify(requestBody),
          headers: {
            'Content-Type': 'application/json',
          },
        });

        if (response.status !== 200 && response.status !== 201) {
          throw new Error('Failed!');
        }

        const responseData = await response.json();

        if (this.state.isLogin) {
          if (responseData.data.login.token) {
            const { token, userId, tokenExpiration } = responseData.data.login;
            this.context.login(token, userId, tokenExpiration);
            this.setState({ success: 'Successfully logged in!', loginError: "" });
          } else {
            this.setState({ loginError: 'Login failed.' });
          }
        } else {
          if (responseData.data.createUser) {
            this.setState({ success: 'Successfully signed up!', emailError: "" });
          } else {
            this.setState({ success: 'Sign up failed.' });
          }
        }
      } catch (error) {
        console.log(error);
        this.setState({ loginError: this.state.isLogin ? 'Login failed.' : 'Sign up failed.' });
      }
    }
  };

  render() {
    return (
      <div className='container'>
        {this.state.isLogin ? (
          <form className='auth-form' onSubmit={this.submitHandler}>
            <div className='heading '>
              {this.state.isLogin ? 'LOGIN' : 'SIGNUP'}
            </div>
            <div className='form-control'>
              <label htmlFor='email'>E-Mail</label>
              <input type='email' id='email' ref={this.emailEl} />
              <p className='error'>{this.state.emailError}</p>
            </div>
            <div className='form-control'>
              <label htmlFor='password'>Password</label>
              <input type='password' id='password' ref={this.passwordEl} />
              <p className='error'>{this.state.passwordError}</p>
              <p className='error'>{this.state.loginError}</p> {/* Display login error */}
            </div>
            <div className='form-actions'>
              <button type='submit'>Submit</button>
              <button type='button' onClick={this.switchModeHandler}>
                Switch to {this.state.isLogin ? 'Signup' : 'Login'}
              </button>
            </div>
          </form>
        ) : (
          <form className='signup-auth-form' onSubmit={this.submitHandler}>
            <div className='heading '>
              {this.state.isLogin ? 'LOGIN' : 'SIGNUP'}
            </div>
            <div className='form-control'>
              <label htmlFor='email'>E-Mail</label>
              <input type='email' id='email' ref={this.emailEl} />
              <p className='error'>{this.state.emailError}</p>
            </div>
            <div className='form-control'>
              <label htmlFor='password'>Password</label>
              <input type='password' id='password' ref={this.passwordEl} />
              <p className='error'>{this.state.passwordError}</p>
              <p className='error'>{this.state.loginError}</p> {/* Display login error */}
            </div>
            <div className='form-actions'>
              <button type='submit'>Submit</button>
              <button type='button' onClick={this.switchModeHandler}>
                Switch to {this.state.isLogin ? 'Signup' : 'Login'}
              </button>
            </div>
          </form>
        )}

        {this.state.success && !this.state.emailError && !this.state.passwordError && !this.state.isLogin && (
          <div className='success-message'>
            <img src={Success} alt='Success Icon' />
            {this.state.success}
          </div>
        )}
      </div>
    );
  }
}

export default AuthPage;
