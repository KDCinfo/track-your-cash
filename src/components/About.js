import React from 'react'

import { Well } from 'react-bootstrap'

class About extends React.Component {
    render() {
        return (
            <Well bsSize="large">
                <p>This little web app thoughtfully brought to you by... <a href="https://kdcinfo.com/resume" target="kdcNewWin">me</a> :)</p>
                <p>Just a simple hard-working Front-End Dev (...er, Engineer) learning React in 2017. </p>
                <p>
                    <strong><i>Learning</i></strong> includes
                    <ul>
                        <li><code>React-Router 4</code>,</li>
                        <li><code>local component state</code>,</li>
                        <li><code>props and HOCs</code>,</li>
                        <li><code>Redux state</code>,</li>
                        <li><code>client-side localStorage</code>, and</li>
                        <li><code>client-side sessionStorage</code>.</li>
                    </ul>
                    My API endpoint of personal choice is still Laravel (PHP), but I did everyting with client-side local storage on this project.
                    (My professional choice is whatever the Back-End Engineers are comfortable and good with .)
                </p>
            </Well>
        )
    }
}

export default About