import { EPollApprovalRatio, IPollWithVotes } from 'interfaces';
import React, { FunctionComponent, useCallback, useEffect, useState } from 'react';
import {
    DragDropContext,
    Draggable,
    DraggingStyle,
    Droppable,
    DropResult,
    NotDraggingStyle,
} from 'react-beautiful-dnd';
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
import {
    BsArrowUpDown,
    BsFillBarChartFill,
    BsFillEnvelopeOpenFill,
    BsFillLockFill,
    BsFillPieChartFill,
} from 'react-icons/bs';
import { GiPodiumWinner } from 'react-icons/gi';
import { Redirect, useParams } from 'react-router-dom';
import { CSSProperties } from 'styled-components';
import { PollOption } from '../../components/poll-option/PollOption';
import { apiService } from '../../utils/ApiService';
import { BaseScreen } from '../base-screen/BaseScreen';
import './VoteScreen.css';

const reorder = (list: string[], startIndex: number, endIndex: number): string[] => {
    const result = Array.from(list);
    const [removed] = result.splice(startIndex, 1);
    result.splice(endIndex, 0, removed);

    return result;
};

const renderTooltip = (props: OverlayInjectedProps, name: string) => (
    <Tooltip id="button-tooltip" {...props}>
        {name}
    </Tooltip>
);

const getItemStyle = (
    isDragging: boolean,
    draggableStyle: DraggingStyle | NotDraggingStyle | undefined,
): CSSProperties => ({
    // some basic styles to make the items look a bit nicer
    userSelect: 'none',
    marginBottom: `5px`,

    background: 'transparent',

    // styles we need to apply on draggables
    ...draggableStyle,
});

const getListStyle = (isDraggingOver: boolean): CSSProperties => ({
    background: 'transparent',
    padding: '5px',
    borderRadius: '5px',
});

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

    function onDragEnd(result: DropResult) {
        console.log(result);
        if (!result.destination) {
            return;
        }

        if (result.destination.index === result.source.index) {
            return;
        }

        const selectedFinal = reorder(selected, result.source.index, result.destination.index);

        setSelected(selectedFinal);
    }

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
        if (poll.isPriority && (user!.voted === undefined || user!.voted.length === 0)) {
            setSelected(poll.pollOptions.map((o) => o.name));
        }
    };

    const getPoll = useCallback(() => {
        apiService
            .getPoll(pollId)
            .then((response: IPollWithVotes) => {
                setPoll({ ...response });
                setVoter(response.voteMap[0].user.userId);
                setSelected(response.voteMap[0].voted);
                setDelegated(response.voteMap[0].delegated);
                if (response.isPriority && response.voteMap[0].voted.length === 0) {
                    setSelected(response.pollOptions.map((o) => o.name));
                }
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
    console.log(selected);
    useEffect(() => {
        getPoll();
    }, [getPoll]);

    return goHome ? (
        <Redirect to="/" />
    ) : (
        <DragDropContext onDragEnd={onDragEnd}>
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
                                {!!poll.isPrivate && (
                                    <OverlayTrigger
                                        placement="bottom"
                                        delay={{ show: 250, hide: 400 }}
                                        overlay={(props) =>
                                            renderTooltip(props, 'Poll is private.')
                                        }
                                    >
                                        <BsFillLockFill
                                            size="15"
                                            style={{ marginRight: '8px' }}
                                        ></BsFillLockFill>
                                    </OverlayTrigger>
                                )}
                                {!!poll.isPriority && (
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
                                {!!poll.abstentionIsValid && (
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
                                {poll.approvalRatio === EPollApprovalRatio.SIMPLE ? (
                                    <OverlayTrigger
                                        placement="bottom"
                                        delay={{ show: 50, hide: 100 }}
                                        overlay={(props) =>
                                            renderTooltip(props, 'Approval is simple.')
                                        }
                                    >
                                        <GiPodiumWinner
                                            size="15"
                                            style={{ marginRight: '8px' }}
                                        ></GiPodiumWinner>
                                    </OverlayTrigger>
                                ) : poll.approvalRatio === EPollApprovalRatio.ABSOLUTE ? (
                                    <OverlayTrigger
                                        placement="bottom"
                                        delay={{ show: 50, hide: 100 }}
                                        overlay={(props) =>
                                            renderTooltip(props, 'Approval is absolute.')
                                        }
                                    >
                                        <BsFillBarChartFill
                                            size="15"
                                            style={{ marginRight: '8px' }}
                                        ></BsFillBarChartFill>
                                    </OverlayTrigger>
                                ) : (
                                    <OverlayTrigger
                                        placement="bottom"
                                        delay={{ show: 50, hide: 100 }}
                                        overlay={(props) =>
                                            renderTooltip(props, 'Approval is two thirds.')
                                        }
                                    >
                                        <BsFillPieChartFill
                                            size="15"
                                            style={{ marginRight: '8px' }}
                                        ></BsFillPieChartFill>
                                    </OverlayTrigger>
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
                                    {poll.isPriority ? (
                                        <Form.Group>
                                            <Droppable droppableId="droppable">
                                                {(provided, snapshot) => (
                                                    <div
                                                        {...provided.droppableProps}
                                                        ref={provided.innerRef}
                                                        style={getListStyle(
                                                            snapshot.isDraggingOver,
                                                        )}
                                                    >
                                                        {selected.map((o, idx) => {
                                                            const style = {
                                                                borderColor: '#007bff',
                                                                backgroundColor: '#007bff',
                                                                padding: '2px',
                                                                borderRadius: '5px',
                                                            };
                                                            const optAux = poll.pollOptions.find(
                                                                (opt) => opt.name === o,
                                                            );
                                                            const isAbstentionAux =
                                                                optAux!.isAbstention;
                                                            const isAgainstAux = optAux!.isAgainst;
                                                            return (
                                                                <Draggable
                                                                    key={o}
                                                                    draggableId={o}
                                                                    index={idx}
                                                                >
                                                                    {(provided, snapshot) => (
                                                                        <div
                                                                            ref={provided.innerRef}
                                                                            {...provided.draggableProps}
                                                                            {...provided.dragHandleProps}
                                                                            key={idx}
                                                                            style={{
                                                                                ...style,
                                                                                ...getItemStyle(
                                                                                    snapshot.isDragging,
                                                                                    provided
                                                                                        .draggableProps
                                                                                        .style,
                                                                                ),
                                                                            }}
                                                                            onClick={() => {}}
                                                                        >
                                                                            <PollOption
                                                                                key={idx}
                                                                                name={o}
                                                                                disabled={true}
                                                                                isAbstention={
                                                                                    isAbstentionAux
                                                                                }
                                                                                isAgainst={
                                                                                    isAgainstAux
                                                                                }
                                                                                handleClick={() => {}}
                                                                                handleButton={() => {}}
                                                                                handleWrite={() => {}}
                                                                                idx={idx}
                                                                                fixed={true}
                                                                                selected={false}
                                                                                style={{
                                                                                    zIndex: -1,
                                                                                }}
                                                                            ></PollOption>
                                                                        </div>
                                                                    )}
                                                                </Draggable>
                                                            );
                                                        })}
                                                        {provided.placeholder}
                                                    </div>
                                                )}
                                            </Droppable>
                                        </Form.Group>
                                    ) : (
                                        (poll.pollOptions || []).map((o, idx) => {
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
                                        })
                                    )}
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
                            <Accordion >
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
        </DragDropContext>
    );
};
