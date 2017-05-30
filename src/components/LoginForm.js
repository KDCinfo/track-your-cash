import React from "react"

import { Form, Row, Col } from 'react-bootstrap'

const LoginForm = ({loggedInId, handleChangeLogin, handleSubmit, inputMessage}) => {
    return (
        <Form onSubmit={handleSubmit} className="login-form">
            <Row className="show-grid">
                <Col xs={12} sm={7}>
                    <input type="email"
                        placeholder={inputMessage}
                        title={inputMessage}
                        value={loggedInId}
                        onChange={handleChangeLogin}
                        required />
                </Col>
                <Col xs={12} sm={5}>
                    <button>Your Register Awaits...</button>
                </Col>
            </Row>
        </Form>
    )
}

export default LoginForm