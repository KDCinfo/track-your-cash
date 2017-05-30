import React from 'react'

import { Well } from 'react-bootstrap'

class About extends React.Component {
    render() {
        return (
            <Well bsSize="large">
                <p>This little web app thoughtfully brought to you by... <a href="https://kdcinfo.com/resume" target="kdcNewWin">me</a> :)</p>
                <p>Just a simple hard-working front-end dev learning React in 2017.</p>
            </Well>
        )
    }
}

export default About