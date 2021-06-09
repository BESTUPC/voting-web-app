import { ResponsiveBar } from '@nivo/bar';
import { EPollState, GetPollResponse, IPoll, ResultsInterface } from 'interfaces';
import React, { FunctionComponent, useEffect, useState } from 'react';
import { Accordion, Button, Card, Col, Form, FormText } from 'react-bootstrap';
import { Redirect, useParams } from 'react-router-dom';
import { PollInfo } from '../../components/poll-info/PollInfo';
import { apiService } from '../../utils/ApiService';
import { BaseScreen } from '../base-screen/BaseScreen';

export const ResultsScreen: FunctionComponent = () => {
    const { pollId } = useParams<{ pollId: string }>();
    const [poll, setData] = useState({} as IPoll);
    const [results, setResults] = useState([] as ResultsInterface[]);
    const [showModal, setModalShown] = useState(false);
    const [modalTitle, setModalTitle] = useState('');
    const [modalText, setModalText] = useState('');
    const [redirect, setRedirect] = useState(false);
    const handleModal = () => {
        setModalShown(!showModal);
    };

    const deletePoll = () => {
        apiService
            .deletePoll(poll._id as unknown as string)
            .then((response: boolean) => {
                if (response) {
                    setModalText('Poll deleted successfully.');
                    setModalTitle('Success');
                } else {
                    setModalText('Could not delete poll');
                    setModalTitle('Error');
                }
                setModalShown(true);
            })
            .catch((err) => {
                setModalText('Could not delete poll');
                setModalTitle('Error');
                setModalShown(true);
            });
    };

    const closePoll = () => {
        apiService
            .updatePollState(poll._id as unknown as string)
            .then((response: boolean) => {
                if (response) {
                    setModalText('Poll updated successfully.');
                    setModalTitle('Success');
                } else {
                    setModalText('Could not update poll');
                    setModalTitle('Error');
                }
                setModalShown(true);
            })
            .catch((err) => {
                setModalText('Could not update poll');
                setModalTitle('Error');
                setModalShown(true);
            });
    };

    useEffect(() => {
        apiService
            .getPoll(pollId)
            .then((response: GetPollResponse) => {
                setData(response);
            })
            .catch((err) => {
                setRedirect(true);
            });
        apiService
            .getResults(pollId)
            .then((response: ResultsInterface[]) => {
                setResults(response);
            })
            .catch((err) => {
                setRedirect(true);
            });
    }, [pollId]);
    return !redirect ? (
        <BaseScreen
            modalShown={showModal}
            modalTitle={modalTitle}
            modalText={modalText}
            modalHandler={handleModal}
        >
            <Form className="mt-5 mb-5">
                <PollInfo poll={poll}></PollInfo>
                <Form.Row
                    style={{
                        display: 'flex',
                        justifyContent: 'center',
                        marginBottom: '30px',
                        width: '100%',
                        height: '500px',
                    }}
                >
                    {results.length > 0 && results[0].votes.length > 0 ? (
                        <ResponsiveBar
                            data={results[0].votes}
                            keys={['votes']}
                            indexBy="option"
                            margin={{ top: 60, right: 80, bottom: 60, left: 80 }}
                            colors={{ scheme: 'category10' }}
                            padding={0.5}
                            axisLeft={{
                                format: (e) => Math.floor(e) === e && e,
                            }}
                        />
                    ) : (
                        <FormText> No votes for this poll.</FormText>
                    )}
                </Form.Row>
                <Form.Row>
                    <Col>
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
                                        {poll.state === EPollState.CLOSED_HIDDEN && (
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
                    </Col>
                </Form.Row>
            </Form>
        </BaseScreen>
    ) : (
        <Redirect to={`/`}></Redirect>
    );
};
