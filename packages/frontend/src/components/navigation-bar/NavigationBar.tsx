import { EMembership, IUser } from 'interfaces';
import React, { FunctionComponent } from 'react';
import { Accordion, Button, Card, Nav, Navbar, NavDropdown } from 'react-bootstrap';
import logo from '../../assets/BEST_LOGO.svg';
import './NavigationBar.css';

type NavigationBarProps = {
    name: string;
    imageUrl: string;
    membershipArray: EMembership[];
    logoutFunction: () => void;
    receivedDelegations: IUser[];
    givenDelegations: IUser[];
};

export const NavigationBar: FunctionComponent<NavigationBarProps> = ({
    name,
    imageUrl,
    membershipArray,
    logoutFunction,
    receivedDelegations,
    givenDelegations,
}) => {
    return (
        <Navbar variant="dark" bg="primary" expand="lg">
            <Navbar.Brand href="/" className="mr-sm-5">
                <img alt="" src={logo} width="40" height="40" className="d-inline-block" /> WebApp
                Votacions
            </Navbar.Brand>
            <Navbar.Toggle aria-controls="basic-navbar-nav" />
            <Navbar.Collapse id="basic-navbar-nav" className="justify-content-between">
                {membershipArray.includes(EMembership.ADMIN) && (
                    <Nav className="mr-auto">
                        <Nav.Link href="/users">
                            <i className="fa fa-user fa-fw mr-sm-1"></i>
                            See/edit members
                        </Nav.Link>
                        <Nav.Link href="/delegations">
                            <i className="fa fa-envelope-open fa-fw mr-sm-1"></i>
                            See/edit delegations
                        </Nav.Link>
                        <Nav.Link href="/createPoll">
                            <i className="fa fa-edit fa-fw mr-sm-1"></i>Create poll
                        </Nav.Link>
                    </Nav>
                )}
                <hr></hr>
                <Nav className="flex-row">
                    <Nav.Link id="name" href="#" disabled>
                        {name}
                    </Nav.Link>
                    <img
                        alt=""
                        id="profileImage"
                        src={imageUrl}
                        width="40"
                        height="40"
                        className="d-inline-block align-top ml-sm-1"
                    />
                    <NavDropdown title="" id="basic-nav-dropdown" alignRight>
                        {membershipArray.map((membership) => (
                            <NavDropdown.ItemText key={membership}>
                                {membership.toLowerCase()}
                            </NavDropdown.ItemText>
                        ))}
                        <Accordion>
                            <Card>
                                <Card.Header>
                                    <Accordion.Toggle as={Button} variant="link" eventKey="0">
                                        {`${givenDelegations.length} given delegation(s)`}
                                    </Accordion.Toggle>
                                </Card.Header>
                                <Accordion.Collapse eventKey="0">
                                    <Card.Body
                                        style={{
                                            display: 'flex',
                                            justifyContent: 'space-between',
                                        }}
                                    >
                                        {givenDelegations.map((gD) => (
                                            <div key={gD.name}>
                                                <img
                                                    alt=""
                                                    id="profileImage"
                                                    src={gD.picture}
                                                    width="40"
                                                    height="40"
                                                    className="d-inline-block align-top ml-sm-1"
                                                />
                                                {gD.name}
                                            </div>
                                        ))}
                                    </Card.Body>
                                </Accordion.Collapse>
                            </Card>
                        </Accordion>
                        <Accordion>
                            <Card>
                                <Card.Header>
                                    <Accordion.Toggle as={Button} variant="link" eventKey="0">
                                        {`${receivedDelegations.length} given delegation(s)`}
                                    </Accordion.Toggle>
                                </Card.Header>
                                <Accordion.Collapse eventKey="0">
                                    <Card.Body
                                        style={{
                                            display: 'flex',
                                            justifyContent: 'space-between',
                                        }}
                                    >
                                        {receivedDelegations.map((rD) => (
                                            <div key={rD.name} style={{ display: 'flex' }}>
                                                <img
                                                    alt=""
                                                    id="profileImage"
                                                    src={rD.picture}
                                                    width="20"
                                                    height="20"
                                                    className="d-inline-block align-top ml-sm-1"
                                                />
                                                {rD.name}
                                            </div>
                                        ))}
                                    </Card.Body>
                                </Accordion.Collapse>
                            </Card>
                        </Accordion>
                        <NavDropdown.ItemText>
                            <Button variant="danger" onClick={logoutFunction}>
                                Log out
                            </Button>
                        </NavDropdown.ItemText>
                    </NavDropdown>
                </Nav>
            </Navbar.Collapse>
        </Navbar>
    );
};
