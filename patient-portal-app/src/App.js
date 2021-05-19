import React, {Component} from 'react'
import Login from './Login'
import PatientPortal from './PatientPortal'
import SocialWorkerPortal from './SocialWorkerPortal'
import {BrowserRouter as Router, Switch, Route} from 'react-router-dom'

export class App extends Component { 
  render(){
    return (
      <Router>
        <Switch>
          
          <Route path="/p-portal/:pEmail">
            <PatientPortal/>
          </Route>
          <Route path="/s-portal/:sEmail">
            <SocialWorkerPortal />
          </Route>
          <Route path="/">
            <Login />
          </Route>
        </Switch>
      </Router>
    )
  }
}

export default App