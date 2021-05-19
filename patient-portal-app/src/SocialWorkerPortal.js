import React, {Component} from 'react'
import { useParams } from 'react-router'


const SocialWorkerPortal = () => {
    
    /* socialWorkerEmail=useParams() */
    let {sEmail} = useParams();
    
        return (
            <div>
                <h1>Social Worker Portal: {sEmail}</h1>
            </div>
        )
  }

export default SocialWorkerPortal