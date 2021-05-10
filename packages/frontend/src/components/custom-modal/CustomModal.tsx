import React, { FunctionComponent, useState } from 'react';
import { Button, Modal } from 'react-bootstrap';

export interface CustomModalProps {
    title: string;

    body: string;
    show: boolean;

    modalHandler: () => void;
}

export const CustomModal: FunctionComponent<CustomModalProps> = ({
    title,
    body,
    show,
    modalHandler,
}) => {
    return (
        <Modal show={show}>
            <Modal.Header closeButton>
                <Modal.Title>{title}</Modal.Title>
            </Modal.Header>
            <Modal.Body>{body}</Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={modalHandler}>
                    Close
                </Button>
            </Modal.Footer>
        </Modal>
    );
};
