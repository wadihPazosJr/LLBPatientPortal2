import React, {Component} from 'react'
import Login from './Login'
import PatientPortal from './PatientPortal'
import SocialWorkerPortal from './SocialWorkerPortal'
import CreateAccount from './CreateAccount'
import {BrowserRouter as Router, Switch, Route} from 'react-router-dom'

export class App extends Component { 
  render(){
    return (
      <div>
        <Router>
          <Switch>
            <Route exact path="/" component={Login}/>
            <Route exact path="/new-account" component={CreateAccount}/>
            <Route exact path="/p-portal/:parentId" component={PatientPortal}/>
            <Route exact path="/s-portal/:sEmail" component={SocialWorkerPortal}/>
          </Switch>
        </Router>
      </div>
    )
  }
}

export default App