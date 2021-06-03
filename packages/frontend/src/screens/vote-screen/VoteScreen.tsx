import { IPollWithVotes } from 'interfaces';
import React, { FunctionComponent, useCallback, useEffect, useState } from 'react';
import { Button, Col, Container, Form, InputGroup, OverlayTrigger, Tooltip } from 'react-bootstrap';
import { OverlayInjectedProps } from 'react-bootstrap/esm/Overlay';
import { BsArrowUpDown, BsFillEnvelopeOpenFill, BsFillLockFill } from 'react-icons/bs';
import { useParams } from 'react-router-dom';
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
    const [selected, setSelected] = useState([] as number[]);
    const { pollId } = useParams<{ pollId: string }>();
    const handleModal = useCallback(() => {
        setModalShown(!modalShown);
    }, [modalShown]);

    useEffect(() => {
        apiService
            .getPoll(pollId)
            .then((response: IPollWithVotes) => {
                console.log(response);
                setPoll({ ...response });
            })
            .catch((err) => {
                setModalText('Could not fetch the poll');
                setModalTitle('Error');
                handleModal();
            });
    }, [handleModal, pollId]);

    return (
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
                        <Col className="rounded-borders" id="options">
                            <Form.Group>
                                {(poll.pollOptions || []).map((o, idx) => {
                                    const selectedAssert = idx === selected[0];
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
                                                setSelected([idx]);
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
                <Form.Row style={{ justifyContent: 'space-between' }}>
                    <Button variant="primary" onClick={() => {}}>
                        Submit
                    </Button>
                    <Col>
                        <Form.Control as="select">
                            {(poll.voteMap || []).map((vm) => (
                                <option key={vm.user.name}>{vm.user.name}</option>
                            ))}
                        </Form.Control>
                    </Col>
                </Form.Row>
            </Form>
        </BaseScreen>
    );
};
