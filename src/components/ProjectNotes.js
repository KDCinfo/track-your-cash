import React from 'react'

import Markdown from './Markdown.js'
import myMarkP from '../store/readme-project.js'
import myMarkR from '../store/readme-readme.js'

import './ProjectNotes.css'

class ProjectNotes extends React.Component {
    render() {
        return (
            <div>
                <h2>An Ambitious 1<sup>st</sup> React-based Project</h2>

                    <p>'Track Your Cash' was a project I created to get an understanding of how the React ecosystem works.</p>

                    <p>This project was bootstrapped using [<a href="https://www.npmjs.com/package/create-react-app" target="kdcNewWin">Create React App</a>].</p>

                <h3>Tech Stack</h3>

                    <p>Working on this project provided me an in-depth look into:</p>
                    <ul>
                        <li>React (15.5.4)</li>
                        <li>React-Router 4</li>
                        <li>Redux state management</li>
                        <li>Local component state</li>
                        <li>Props and HOCs/HOFs</li>
                        <li>Client-side localStorage</li>
                        <li>Client-side sessionStorage</li>
                    </ul>
                    <p>
                        My API endpoint of personal choice is still Laravel (PHP), but I did everyting with client-side local storage on this project.
                        (My professional choice is whatever the Back-End Engineers are comfortable and good with -- Front-End should have (little to) no dependence on a back-end tech stack.)
                    </p>
                <div className="clear"></div>

                <hr />
                <div className="text-center"><cite>The following Info/Insights are 'include'd with each included markdown file.</cite></div>
                <Markdown myMark={myMarkP} />

                <hr />
                <Markdown myMark={myMarkR} />
            </div>
        )
    }
}

export default ProjectNotes