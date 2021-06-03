import { IPollWithVotes } from 'interfaces';
import React, { FunctionComponent, useCallback, useEffect, useState } from 'react';
import {
    Accordion,
    Button,
    Card,
    Col,
    Container,
    Form,
    InputGroup,
    OverlayTrigger,
    Tooltip,
} from 'react-bootstrap';
import { OverlayInjectedProps } from 'react-bootstrap/esm/Overlay';
import { BsArrowUpDown, BsFillEnvelopeOpenFill, BsFillLockFill } from 'react-icons/bs';
import { Redirect, useParams } from 'react-router-dom';
import { PollOption } from '../../components/poll-option/PollOption';
import { apiService } from '../../utils/ApiService';
import { BaseScreen } from '../base-screen/BaseScreen';
import './VoteScreen.css';

const renderTooltip = (props: OverlayInjectedProps, name: string) => (
    <Tooltip id="button-tooltip" {...props}>
        {name}
    </Tooltip>
);

export const VoteScreen: FunctionComponent = () => {
    const [modalShown, setModalShown] = useState<boolean>(false);
    const [modalTitle, setModalTitle] = useState<string>('');
    const [modalText, setModalText] = useState<string>('');
    const [poll, setPoll] = useState({} as IPollWithVotes);
    const [selected, setSelected] = useState([] as string[]);
    const { pollId } = useParams<{ pollId: string }>();
    const [voter, setVoter] = useState('');
    const [goHome, setGoHome] = useState<boolean>(false);
    const [isDelegated, setDelegated] = useState(false);

    const handleModal = useCallback(() => {
        setModalShown(!modalShown);
        if (
            modalText === 'Poll deleted successfully.' ||
            modalText === 'Poll updated successfully.'
        ) {
            setGoHome(true);
        }
    }, [modalShown, modalText]);

    const handleChange = (id: string) => {
        setVoter(id);
        const user = poll.voteMap.find((vm) => vm.user.userId === id);
        setSelected(user!.voted);
        setDelegated(user!.delegated);
    };

    const getPoll = useCallback(() => {
        apiService
            .getPoll(pollId)
            .then((response: IPollWithVotes) => {
                setPoll({ ...response });
                setVoter(response.voteMap[0].user.userId);
                setSelected(response.voteMap[0].voted);
                setDelegated(response.voteMap[0].delegated);
            })
            .catch((err) => {
                console.log(err);
                setModalText('Could not fetch the poll');
                setModalTitle('Error');
                setModalShown(true);
            });
    }, [pollId]);

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

    const sendVote = () => {
        if (isDelegated) {
            apiService
                .addDelegatedVote(voter, {
                    option: selected,
                    pollId: poll._id as unknown as string,
                })
                .then((response: boolean) => {
                    if (response) {
                        setModalText('Vote added!');
                        setModalTitle('Success');
                        getPoll();
                    } else {
                        setModalText('Could not add vote');
                        setModalTitle('Error');
                    }
                    setModalShown(true);
                })
                .catch((err) => {
                    setModalText('Could not add vote');
                    setModalTitle('Error');
                    setModalShown(true);
                });
        } else {
            apiService
                .addVote({
                    option: selected,
                    pollId: poll._id as unknown as string,
                })
                .then((response: boolean) => {
                    if (response) {
                        setModalText('Vote added!');
                        setModalTitle('Success');
                    } else {
                        setModalText('Could not add vote');
                        setModalTitle('Error');
                    }

                    setModalShown(true);
                })
                .catch((err) => {
                    setModalText('Could not add vote');
                    setModalTitle('Error');
                    setModalShown(true);
                });
        }
    };

    useEffect(() => {
        getPoll();
    }, [getPoll]);

    console.log(goHome);

    return goHome ? (
        <Redirect to="/" />
    ) : (
        <BaseScreen
            modalShown={modalShown}
            modalText={modalText}
            modalTitle={modalTitle}
            modalHandler={handleModal}
        >
            <Form className="mt-5 mb-5">
                <Form.Group id="formText">
                    <Form.Control
                        as={Container}
                        size="lg"
                        style={{ display: 'flex', justifyContent: 'space-between' }}
                    >
                        {poll.pollName}
                        <span>
                            {!poll.isPrivate && (
                                <OverlayTrigger
                                    placement="bottom"
                                    delay={{ show: 250, hide: 400 }}
                                    overlay={(props) => renderTooltip(props, 'Poll is private.')}
                                >
                                    <BsFillLockFill
                                        size="15"
                                        style={{ marginRight: '8px' }}
                                    ></BsFillLockFill>
                                </OverlayTrigger>
                            )}
                            {!poll.isPriority && (
                                <OverlayTrigger
                                    placement="bottom"
                                    delay={{ show: 250, hide: 400 }}
                                    overlay={(props) =>
                                        renderTooltip(props, 'Poll is a priority poll.')
                                    }
                                >
                                    <BsArrowUpDown
                                        size="15"
                                        style={{ marginRight: '8px' }}
                                    ></BsArrowUpDown>
                                </OverlayTrigger>
                            )}
                            {!poll.abstentionIsValid && (
                                <OverlayTrigger
                                    placement="bottom"
                                    delay={{ show: 50, hide: 100 }}
                                    overlay={(props) =>
                                        renderTooltip(props, 'Abstention is valid.')
                                    }
                                >
                                    <BsFillEnvelopeOpenFill
                                        size="15"
                                        style={{ marginRight: '8px' }}
                                    ></BsFillEnvelopeOpenFill>
                                </OverlayTrigger>
                            )}
                            {!!poll.approvalRatio && (
                                <BsFillLockFill
                                    size="15"
                                    style={{ marginRight: '8px' }}
                                ></BsFillLockFill>
                            )}
                        </span>
                    </Form.Control>
                    <br />
                    <InputGroup>
                        <Form.Control
                            size="sm"
                            type="title"
                            placeholder={
                                new Date(poll.pollDeadline).toLocaleDateString() +
                                ' ' +
                                new Date(poll.pollDeadline).toLocaleTimeString()
                            }
                            disabled
                            style={{ backgroundColor: 'white' }}
                        />
                    </InputGroup>
                    <br />

                    <Form.Control
                        as="textarea"
                        rows={3}
                        id="description"
                        placeholder={poll.description}
                        disabled
                        style={{ backgroundColor: 'white' }}
                    />
                </Form.Group>
                <Form.Group id="formSelections">
                    <Form.Row>
                        <Col id="options">
                            <Form.Group>
                                {(poll.pollOptions || []).map((o, idx) => {
                                    const selectedAssert = o.name === selected[0];
                                    const style = selectedAssert
                                        ? {
                                              borderColor: '#007bff',
                                              backgroundColor: '#007bff',
                                              padding: '2px',
                                              borderRadius: '5px',
                                          }
                                        : {};
                                    return (
                                        <Form.Group
                                            key={idx}
                                            style={style}
                                            onClick={() => {
                                                setSelected([o.name]);
                                            }}
                                        >
                                            <PollOption
                                                key={idx}
                                                name={o.name}
                                                disabled={true}
                                                isAbstention={o.isAbstention}
                                                isAgainst={o.isAgainst}
                                                handleClick={() => {}}
                                                handleButton={() => {}}
                                                handleWrite={() => {}}
                                                idx={idx}
                                                fixed={true}
                                                selected={selectedAssert}
                                            ></PollOption>
                                        </Form.Group>
                                    );
                                })}
                            </Form.Group>
                        </Col>
                    </Form.Row>
                </Form.Group>
                <Form.Group>
                    <InputGroup>
                        <Button
                            variant="primary"
                            onClick={sendVote}
                            style={{ borderBottomRightRadius: 0, borderTopRightRadius: 0 }}
                        >
                            Submit
                        </Button>
                        <Form.Control
                            as="select"
                            value={voter}
                            onChange={(e) => handleChange(e.target.value as string)}
                        >
                            {(poll.voteMap || []).map((vm) => (
                                <option value={vm.user.userId} key={vm.user.name}>
                                    {vm.user.name}
                                </option>
                            ))}
                        </Form.Control>
                    </InputGroup>
                </Form.Group>
                <br></br>
                <Form.Row>
                    <Col>
                        <Accordion defaultActiveKey="0">
                            <Card>
                                <Card.Header>
                                    <Accordion.Toggle as={Button} variant="link" eventKey="0">
                                        Admin Tools
                                    </Accordion.Toggle>
                                </Card.Header>
                                <Accordion.Collapse eventKey="0">
                                    <Card.Body
                                        style={{ display: 'flex', justifyContent: 'space-between' }}
                                    >
                                        <Button variant="warning" onClick={closePoll}>
                                            Close
                                        </Button>
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
    );
};
