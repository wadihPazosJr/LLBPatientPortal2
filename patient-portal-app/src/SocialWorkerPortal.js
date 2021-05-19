import React, {Component} from 'react'
import { useParams } from 'react-router'


export class SocialWorkerPortal extends Component {
    
    /* socialWorkerEmail=useParams() */
    render(){
        return (
            <div>
                <h1>Social Worker Portal: {this.socialWorkerEmail}</h1>
            </div>
        )
  }
}

export default SocialWorkerPortal