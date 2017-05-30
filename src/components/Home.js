import React from 'react'

import { Well } from 'react-bootstrap'

import './Home.css'

class Home extends React.Component {
    render() {
        return (
            <Well bsSize="large">
                <p>Welcome to your very own simplified checking register.</p>

                <p>'Track Your Cash' is a project I am in the process of creating to get a better understanding of how the React ecosystem works.</p>
                <p>
                    Please note, this is a <span className="wip">Work In Progress</span>.<br/>
                    Approximate completion percentage: 50%
                </p>
                <p>
                    High-Level To-Dos:
                    <ul>
                        <li>Get the actual check registry page working (30%)</li>
                        <li>Leftover tweaks and massaging (15%)</li>
                        <li>Clean up CSS (5%)</li>
                    </ul>
                </p>
                <p>
                    High-Level Completions:
                    <ul>
                        <li>High-level page/component layout and formatting (make somewhat presentable)</li>
                        <li>Get React Router 4 working (with Redux)</li>
                        <li>Get Markdown working (2 components; 1 is local-only)</li>
                        <li>Get project uploaded/shared on GitHub</li>
                        <li className="li-bold">(20%)</li>
                        <li>Get Login/Create account working with session- and local- Storage</li>
                        <li>Restrict actual check registry page</li>
                        <li className="li-bold">(30% += 50%)</li>
                    </ul>
                </p>
            </Well>
        )
    }
}

export default Home