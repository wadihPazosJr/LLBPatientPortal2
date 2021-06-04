import React from 'react'
import GoogleLogin from 'react-google-login'
import { Link } from 'react-router-dom'




const Login = () => {
    

      
      const handleGoogleLogin = () => {
        window.location.href="http://localhost:5000/auth/google";
      }

      const handleFacebookLogin = () => {
        window.location.href="http://localhost:5000/auth/facebook";
      }

      const handleMicrosoftLogin = () => {
        window.location.href= "http://localhost:5000/auth/microsoft";
      }

      return (
          <div>
            <h1>Login:</h1>

            <br/>
            <br/>
            <button onClick={handleGoogleLogin}>Login with Google</button>
            <br/>
            <br/>
            <button onClick={handleFacebookLogin}>Login with Facebook</button>
            <br/>
            <br/>
            <button onClick={handleMicrosoftLogin}>Login with Microsoft</button>
            <br/>
            <br/> 
            <Link to="/new-account">Create a new account</Link>
          </div>
      )
    }


export default Login