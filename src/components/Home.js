import React from 'react'

import { Well } from 'react-bootstrap'

import './Home.css'

class Home extends React.Component {
    render() {
        return (
            <Well bsSize="large">
                <p>Welcome to your very own simplified checking register.</p>
                <p>
                    Please note, this is a <span className="wip">Work In Progress</span>.<br/>
                    Approximate completion percentage: 20%
                </p>
                <p>'Track Your Cash' is a project I am in the process of creating to get a better understanding of how the React ecosystem works.</p>
            </Well>
        )
    }
}

export default Home