import React, {Component} from 'react'
import GoogleLogin from 'react-google-login'
import {Redirect, useHistory} from 'react-router-dom'




const Login = () => {
    const successfulGoogleResponse = async (response) => {
        console.log(response.profileObj)
        const email = response.profileObj.email;
        const constituentCodes = await getConstituentCodesFromEmail(email);
      }

      const getConstituentCodesFromEmail = (email) => {
        fetch(`/constituentFromEmail?email=${email}`)
        .then((res) => {
          console.log(res)
          if (res.redirected) {
            window.location.href = res.url;
          } else {
            return res.json();
          }
        })
        .then((res) => {
          console.log(res)
          
          if(res.status && res.status === "error") {
            // do something with error
            alert(res.error);
          } else {
            console.log(res)
          }
        })
        .catch(err => {
          alert(err);
        })
      }

      
      const failGoogleResponse = (response) => {
        console.log(response);
      }

      return (
          <div>
            <h1>Login:</h1>
            <GoogleLogin
            clientId="129639375721-m54t28dg3n64j6t8lhj26qb220mv4joi.apps.googleusercontent.com"
            onSuccess={successfulGoogleResponse}
            onFailure={failGoogleResponse}
            cookiePolicy={'single_host_origin'}
            />
          </div>
      )
    }


export default Login