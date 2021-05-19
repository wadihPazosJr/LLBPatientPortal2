import React, {Component} from 'react'
import GoogleLogin from 'react-google-login'
import {Redirect, useHistory} from 'react-router-dom'




export class Login extends Component{
    successfulGoogleResponse(response){
        /* console.log(response);
        console.log(response.profileObj) */
        const email = response.profileObj.email;
        /* history.push(`/p-portal/${email}`);   */
        this.setState({patientPortal : true});
        console.log(this.state);
      }

      constructor(props)
      {
          super(props);
          this.state = {patientPortal: false, swPortal: false, email: ""};
      }
    
      failGoogleResponse(response){
        console.log(response);
      }

    render(){
        if(this.state.patientPortal)
        {
            let url = `/p-portal/${this.state.email}`;
            return <Redirect to={url}/>
        }
        return (
            <div>
              <h1>Login:</h1>
              <GoogleLogin
              clientId="129639375721-m54t28dg3n64j6t8lhj26qb220mv4joi.apps.googleusercontent.com"
              onSuccess={this.successfulGoogleResponse}
              onFailure={this.failGoogleResponse}
              cookiePolicy={'single_host_origin'}
              />
            </div>
        )
    }
}

export default Login