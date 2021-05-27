import React, {Component} from 'react'
import Login from './Login'
import PatientPortal from './PatientPortal'
import SocialWorkerPortal from './SocialWorkerPortal'
import CreateAccount from './CreateAccount'
import PatientServices from './PatientServices.js'
import {BrowserRouter as Router, Switch, Route} from 'react-router-dom'
import NewService from './NewService'

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
            <Route exact path="/p-portal/:parentId/services" component={PatientServices}/>
            <Route exact path="/p-portal/:parentId/services/new" component={NewService}/>
          </Switch>
        </Router>
      </div>
    )
  }
}

export default App