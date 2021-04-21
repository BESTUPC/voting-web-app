import React, { FunctionComponent, ReactNode } from 'react';
import {
    Nav,
    Navbar,
    Form,
    FormControl,
    NavDropdown,
    Button,
    Container,
    Image,
} from 'react-bootstrap';
import styled from 'styled-components';
import logo from './BEST_LOGO.svg';

const Styles = styled.div`
    .navbar-brand {
        color: rgba(0, 0, 0, 0.5);
    }

    #profileImage {
        border-radius: 50%;
    }
`;

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
    const isVisible = document.getElementById('#basic-navbar-nav');

    return (
        <Styles>
            <Navbar bg="light" expand="lg">
                <Navbar.Brand href="#home" className="mr-sm-5">
                    <img
                        alt=""
                        src={logo}
                        width="40"
                        height="40"
                        className="d-inline-block align-top"
                    />{' '}
                    WebApp Votacions
                </Navbar.Brand>
                <Nav className="flex-row">
                    <img
                        alt=""
                        id="profileImage"
                        src={imageUrl}
                        width="40"
                        height="40"
                        className="d-inline-block align-top"
                    />{' '}
                    <NavDropdown title="" id="basic-nav-dropdown" alignRight>
                        <NavDropdown.Item>
                            <b>{name}</b>
                        </NavDropdown.Item>
                        {membershipArray.map((membership) => (
                            <NavDropdown.Item>{membership}</NavDropdown.Item>
                        ))}
                        <NavDropdown.Divider />
                        <NavDropdown.Item href="#logout">
                            <Button variant="danger">Log out</Button>
                        </NavDropdown.Item>
                    </NavDropdown>
                </Nav>
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
                </Navbar.Collapse>
            </Navbar>
        </Styles>
    );
};
