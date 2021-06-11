import { GetPollResponse, IPoll, ResultsInterface } from 'interfaces';
import React, { FunctionComponent, useEffect, useState } from 'react';
import { Col, Form, FormText, ListGroup, Pagination } from 'react-bootstrap';
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
    const [showingVotes, setShowingVotes] = useState([] as { option: string; votes: number }[]);
    const [showModal, setModalShown] = useState(false);
    const [modalTitle, setModalTitle] = useState('');
    const [modalText, setModalText] = useState('');
    const [redirect, setRedirect] = useState(false);
    const [page, setPage] = useState(0);
    const [winner, setWinner] = useState('');
    const [loading, setLoading] = useState(true);

    const handleModal = () => {
        setModalShown(!showModal);
        if (
            modalText === 'Poll deleted successfully.' ||
            modalText === 'Poll updated successfully.'
        ) {
            setRedirect(true);
        }
    };

    const changePage = (i: number) => {
        setPage(i);
        setWinner('');
        setLoading(true);
        const maxVotes = Math.max(...results[i].votes.map((v) => v.votes));
        setShowingVotes([
            { option: '__Dummy__1', votes: Math.floor(maxVotes + maxVotes / 2) },
            ...results[0].votes.map((v) => ({ option: v.option, votes: 0 })),
            { option: '__Dummy__2', votes: Math.floor(maxVotes + maxVotes / 2) },
        ]);
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
        const timeout = setTimeout(() => {
            let updated = false;
            const newArray = [...showingVotes];
            for (const i in newArray) {
                if (newArray[i].option !== '__Dummy__1' && newArray[i].option !== '__Dummy__2') {
                    const actualVotes = results[page].votes.find(
                        (v) => v.option === newArray[i].option,
                    );
                    if (newArray[i].votes < actualVotes!.votes) {
                        newArray[i].votes = newArray[i].votes + 0.01;
                        updated = true;
                    }
                }
            }
            if (updated) {
                setShowingVotes(newArray);
            } else if (newArray.length > 0) {
                setModalText(results[page].winner);
                setModalTitle('Results');
                setModalShown(true);
                setLoading(false);
                setWinner(results[page].winner);
            }
        }, 1);
        return () => {
            clearTimeout(timeout);
        };
    }, [showingVotes, page, results]);

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
                setLoading(true);
                setResults(response);
                setPage(0);
                if (response.length > 0 && response[0].votes.length > 0) {
                    const maxVotes = Math.max(...response[0].votes.map((v) => v.votes));
                    setShowingVotes([
                        { option: '__Dummy__1', votes: Math.floor(maxVotes + maxVotes / 2) },
                        ...response[0].votes.map((v) => ({ option: v.option, votes: 0 })),
                        { option: '__Dummy__2', votes: Math.floor(maxVotes + maxVotes / 2) },
                    ]);
                }
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
                            <BarChart data={showingVotes} winner={winner}></BarChart>
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
                {!loading && results.length > 1 && (
                    <Form.Row>
                        <Pagination>
                            {results.map((v, i) => (
                                <Pagination.Item
                                    key={i}
                                    active={i === page}
                                    onClick={() => changePage(i)}
                                >
                                    {i}
                                </Pagination.Item>
                            ))}
                        </Pagination>
                    </Form.Row>
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
