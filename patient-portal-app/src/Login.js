import React from 'react'
import GoogleLogin from 'react-google-login'
import { Link } from 'react-router-dom'




const Login = () => {
    

      
      const handleGoogleLogin = () => {
        window.location.href="http://localhost:5000/auth/google";
      }

      return (
          <div>
            <h1>Login:</h1>

            <br/>
            
            <button onClick={handleGoogleLogin}>Login with Google</button>
            <br/> 
            <Link to="/new-account">Create a new account</Link>
          </div>
      )
    }


export default Login