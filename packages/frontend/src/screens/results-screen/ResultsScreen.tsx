// import { ResponsiveBar } from '@nivo/bar';
import { GetPollResponse, IPoll, ResultsInterface } from 'interfaces';
import React, { FunctionComponent, useEffect, useState } from 'react';
import { Col, Form, FormText, ListGroup } from 'react-bootstrap';
import { Redirect, useParams } from 'react-router-dom';
import { AdminTools } from '../../components/admin-tools/AdminTools';
import { BarChart } from '../../components/bar-chart/BarChart';
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
    const [page, setPage] = useState(0);

    const handleModal = () => {
        setModalShown(!showModal);
        if (
            modalText === 'Poll deleted successfully.' ||
            modalText === 'Poll updated successfully.'
        ) {
            setRedirect(true);
        }
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
                {results.length > 0 && results[page].votes.length > 0 ? (
                    <>
                        <Form.Row
                            style={{
                                display: 'flex',
                                justifyContent: 'center',
                                marginBottom: '30px',
                                width: '100%',
                                height: '500px',
                            }}
                        >
                            <BarChart data={results[page].votes}></BarChart>
                        </Form.Row>
                        <Form.Row style={{ marginBottom: '30px' }}>
                            {results[page].voters.map((v, i) => (
                                <Col key={i}>
                                    <Form.Label>{v[0]}</Form.Label>
                                    <ListGroup>
                                        {v[1].map((u, j) => (
                                            <ListGroup.Item key={j}>{u}</ListGroup.Item>
                                        ))}
                                    </ListGroup>
                                </Col>
                            ))}
                        </Form.Row>
                    </>
                ) : (
                    <FormText style={{ marginBottom: '30px' }}> No votes for this poll.</FormText>
                )}
                <Form.Row>
                    <Col>
                        <AdminTools poll={poll} closePoll={closePoll} deletePoll={deletePoll} />
                    </Col>
                </Form.Row>
            </Form>
        </BaseScreen>
    ) : (
        <Redirect to={`/`}></Redirect>
    );
};
