import React from 'react'

import { Well } from 'react-bootstrap'

import './Home.css'

class Home extends React.Component {
    render() {
        return (
            <Well bsSize="large">
                <div>
                    <p>Welcome to your very own simplified checking register.</p>
                    <p>Good for trip expenses (just don't clear your local storage ;)).</p>
                </div>

                <div>
                    <p>'Track Your Cash' is a project I am in the process of creating to get a better understanding of how the React ecosystem works.</p>
                </div>
                <div>
                    <p>
                        Please note, this is a <span className="wip">Work In Progress</span>.<br/>
                        Approximate completion percentage: 85%
                    </p>
                </div>
                <div>
                    <p>High-Level Completions:</p>
                    <ul>
                        <li>High-level page/component layout and formatting (make somewhat presentable)</li>
                        <li>Got React Router 4 working (with Redux)</li>
                        <li>Got Markdown working (3 components; 1 is local-only)</li>
                        <li>Got project uploaded/shared on GitHub</li>
                        <li>Got project uploaded/working on Digital Ocean</li>
                        <li className="li-bold">(20%)</li>
                        <li>Got Login/Create account working with session- and local- Storage</li>
                        <li>Restrict actual check registry page</li>
                        <li className="li-bold">(30% += 50%)</li>
                        <li>Registry 'add new' entry (with client-side validation)</li>
                        <li className="li-bold">(20% += 70%)</li>
                        <li>Registry 'previous entries' update and delete</li>
                        <li className="li-bold">(15% += 85%)</li>
                    </ul>
                </div>
            </Well>
        )
    }
}

export default Home