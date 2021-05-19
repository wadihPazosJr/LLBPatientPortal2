import React, {Component} from 'react'
import Login from './Login'
import PatientPortal from './PatientPortal'
import SocialWorkerPortal from './SocialWorkerPortal'
import {BrowserRouter as Router, Switch, Route, Link} from 'react-router-dom'

export class App extends Component { 
  render(){
    return (
      <Router>
        <Switch>
          <Route path="/">
            <Login></Login>
          </Route>
          <Route path="/p-portal/:pEmail">
            <PatientPortal/>
          </Route>
          <Route path="/s-portal/:sEmail">
            <SocialWorkerPortal></SocialWorkerPortal>
          </Route>
        </Switch>
      </Router>
    )
  }
}

export default App