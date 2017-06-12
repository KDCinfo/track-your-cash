import React from "react"

import { Row, Col, Form, FormGroup, InputGroup, FormControl, Button } from 'react-bootstrap'

const LoginForm = ({loggedInId, handleChangeLogin, handleSubmit, inputMessage}) => {
    return (
        <Form onSubmit={handleSubmit} className="login-form">
            <Row className="show-grid">
                <Col xs={12} sm={7}>
                    <FormGroup>
                        <InputGroup>
                            <InputGroup.Addon>@</InputGroup.Addon>
                            <FormControl
                                type="email"
                                placeholder={inputMessage}
                                title={inputMessage}
                                value={loggedInId}
                                onChange={handleChangeLogin}
                                required
                                autoFocus
                            />
                        </InputGroup>
                    </FormGroup>
                </Col>
                <Col xs={12} sm={5}>
                    <Button type="submit">Your Register Awaits...</Button>
                </Col>
            </Row>
        </Form>
    )
}

export default LoginForm