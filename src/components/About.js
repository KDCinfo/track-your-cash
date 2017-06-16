import React from 'react'

import { Well } from 'react-bootstrap'

class About extends React.Component {
    render() {
        return (
            <Well bsSize="large">
                <p>This little web app thoughtfully brought to you by... <a href="https://kdcinfo.com/resume" target="kdcNewWin">me</a> :)</p>
                <p>Just a simple hard-working Front-End <s>Dev</s> (...er, Engineer) learning React in 2017. </p>
                <p>
                    <strong><i>Related Online References:</i></strong>
                </p>
                <ul>
                    <li>Personal Portfolio - <a href="https://kdcinfo.com" target="kdcNewWin">https://kdcinfo.com</a></li>
                    <li>Online Resume - <a href="https://kdcinfo.com/resume" target="kdcNewWin">https://kdcinfo.com/resume</a></li>
                    <li>GitHub - <a href="https://github.com/KDCinfo" target="kdcNewWin">https://github.com/KDCinfo</a></li>
                    <li className="hide">x - <a href="x" target="kdcNewWin">x</a></li>
                </ul>
            </Well>
        )
    }
}

export default About