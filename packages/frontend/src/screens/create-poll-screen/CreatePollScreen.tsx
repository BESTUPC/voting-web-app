import React, { FunctionComponent } from 'react';
import { Button, Col, Form, FormControl, InputGroup, Row } from 'react-bootstrap';
import { BaseScreen } from '../base-screen/BaseScreen';

export const CreatePollScreen: FunctionComponent = () => {
    return (
        <BaseScreen>
            <Form className="mt-5">
                <Form.Group controlId="formText">
                    <Form.Control size="lg" type="title" placeholder="Poll title" />
                    <br />
                    <Form.Control as="textarea" rows={3} placeholder="Poll description" />
                </Form.Group>
                <Form>
                    <InputGroup>
                        <InputGroup.Append>
                            <InputGroup.Text>Target</InputGroup.Text>
                        </InputGroup.Append>
                        <Form.Control as="select" defaultValue="All">
                            <option>All</option>
                            <option>Members</option>
                            <option>Full</option>
                        </Form.Control>
                    </InputGroup>
                    <br />
                    <InputGroup>
                        <InputGroup.Append>
                            <InputGroup.Text>Approval</InputGroup.Text>
                        </InputGroup.Append>
                        <Form.Control as="select" defaultValue="Simple">
                            <option>Simple</option>
                            <option>Absolute</option>
                            <option>2/3</option>
                        </Form.Control>
                    </InputGroup>
                    <br />
                    <InputGroup>
                        <ToggleButton
                            type="checkbox"
                            variant="secondary"
                            checked={checked}
                            value="1"
                            onChange={(e) => setChecked(e.currentTarget.checked)}
                        >
                            Checked
                        </ToggleButton>
                    </InputGroup>
                </Form>
                {/* <Form>
                    <Form.Group as={Row} controlId="formTarget">
                        <Form.Label column sm={2}>
                            Target
                        </Form.Label>
                        <Col sm={10}>
                            <Form.Control as="select" defaultValue="All">
                                <option>All</option>
                                <option>Members</option>
                                <option>Full</option>
                            </Form.Control>
                        </Col>
                    </Form.Group>
                    <Form.Group as={Row} controlId="formApproval">
                        <Form.Label column sm={2}>
                            Approval
                        </Form.Label>
                        <Col sm={10}>
                            <Form.Control as="select" defaultValue="Simple">
                                <option>Simple</option>
                                <option>Absolute</option>
                                <option>2/3</option>
                            </Form.Control>
                        </Col>
                    </Form.Group>
                    <Form.Group as={Row} controlId="formPrivate">
                        <Form.Label column sm={2}>
                            Private
                        </Form.Label>
                        <Form.Check type="checkbox" name="formPrivate" id="isPrivate" />
                    </Form.Group>
                </Form> */}
                <Button variant="primary" type="submit">
                    Submit
                </Button>
            </Form>
        </BaseScreen>
    );
};
