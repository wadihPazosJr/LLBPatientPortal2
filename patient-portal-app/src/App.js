import React from 'react'
import Login from './Login'
import PatientPortal from './PatientPortal'
import SocialWorkerPortal from './SocialWorkerPortal'
import CreateAccount from './CreateAccount'
import PatientServices from './PatientServices.js'
import {BrowserRouter as Router, Switch, Route} from 'react-router-dom'
import NewService from './NewService'
import SocialWorkerPatients from './SocialWorkerPatients'
import SocialWorkerPatientServices from './SocialWorkerPatientServices'
import SocialWorkerPatientNewService from './SocialWorkerPatientNewService'
import NewSocialWorker from './NewSocialWorker'
import './App.css';

function App() {
  return (
    <div>
      <Router>
        <Switch>
          <Route exact path="/" component={Login}/>
          <Route exact path="/new-account" component={CreateAccount}/>
          <Route exact path="/p-portal/:parentId" component={PatientPortal}/>
          <Route exact path="/s-portal/:socialWorkerId" component={SocialWorkerPortal}/>
          <Route exact path="/s-portal/:socialWorkerId/patients" component={SocialWorkerPatients}/>
          <Route exact path="/s-portal/:socialWorkerId/patients/services/new" component={SocialWorkerPatientNewService}/>
          <Route exact path="/s-portal/:socialWorkerId/patients/services" component={SocialWorkerPatientServices}/>
          <Route exact path="/p-portal/:parentId/services" component={PatientServices}/>
          <Route exact path="/p-portal/:parentId/services/new" component={NewService}/>
          <Route exact path="/new-s-worker/:patientId/:swEmail" component={NewSocialWorker}/>
        </Switch>
      </Router>
    </div>
  )
}

export default App;