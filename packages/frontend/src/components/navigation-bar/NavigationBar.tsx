import React, { FunctionComponent } from 'react';
import { Button, Nav, Navbar, NavDropdown } from 'react-bootstrap';
import logo from '../../assets/BEST_LOGO.svg';
import './NavigationBar.css'

type NavigationBarProps = {
    name: string;
    imageUrl: string;
    membershipArray: string[];
};

export const NavigationBar: FunctionComponent<NavigationBarProps> = ({
    name,
    imageUrl,
    membershipArray,
}) => {
    return (
        <Navbar bg="light" expand="lg">
            <Navbar.Brand href="#home" className="mr-sm-5">
                <img alt="" src={logo} width="40" height="40" className="d-inline-block" /> WebApp
                Votacions
            </Navbar.Brand>
            <Navbar.Toggle aria-controls="basic-navbar-nav" />
            <Navbar.Collapse id="basic-navbar-nav" className="justify-content-between">
                <Nav className="mr-auto">
                    <Nav.Link href="#users">
                        <i className="fa fa-user fa-fw mr-sm-1"></i>
                        See/edit members
                    </Nav.Link>
                    <Nav.Link href="#delegations">
                        <i className="fa fa-envelope-open fa-fw mr-sm-1"></i>
                        See/edit delegations
                    </Nav.Link>
                    <Nav.Link href="#createPoll">
                        <i className="fa fa-edit fa-fw mr-sm-1"></i>Create poll
                    </Nav.Link>
                </Nav>
                <hr></hr>
                <Nav className="flex-row">
                    <b id="nameB">{name}</b>
                    <img
                        alt=""
                        id="profileImage"
                        src={imageUrl}
                        width="40"
                        height="40"
                        className="d-inline-block align-top ml-sm-1"
                    />{' '}
                    <NavDropdown title="" id="basic-nav-dropdown" alignRight>
                        {' '}
                        {membershipArray.map((membership) => (
                            <NavDropdown.Item>{membership}</NavDropdown.Item>
                        ))}
                        <NavDropdown.Divider />
                        <NavDropdown.Item href="#logout">
                            <Button variant="danger">Log out</Button>
                        </NavDropdown.Item>
                    </NavDropdown>
                </Nav>
            </Navbar.Collapse>
        </Navbar>
    );
};
