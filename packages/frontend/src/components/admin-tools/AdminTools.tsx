import { EPollState, IPoll } from 'interfaces';
import React, { FunctionComponent } from 'react';
import { Accordion, Button, Card } from 'react-bootstrap';

interface AdminToolsProps {
    poll: IPoll;
    closePoll: () => void;
    deletePoll: () => void;
}

export const AdminTools: FunctionComponent<AdminToolsProps> = ({ poll, closePoll, deletePoll }) => {
    return (
        <Accordion>
            <Card>
                <Card.Header>
                    <Accordion.Toggle as={Button} variant="link" eventKey="0">
                        Admin Tools
                    </Accordion.Toggle>
                </Card.Header>
                <Accordion.Collapse eventKey="0">
                    <Card.Body
                        style={{
                            display: 'flex',
                            justifyContent: 'space-between',
                        }}
                    >
                        {poll.state !== EPollState.CLOSED && (
                            <Button variant="warning" onClick={closePoll}>
                                Close
                            </Button>
                        )}
                        <Button variant="danger" onClick={deletePoll}>
                            Delete
                        </Button>
                    </Card.Body>
                </Accordion.Collapse>
            </Card>
        </Accordion>
    );
};
