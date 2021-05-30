import { IPoll, IPollWithVotes } from 'interfaces';
import React, { FunctionComponent, useEffect, useState } from 'react';
import { Button, Col, Form, InputGroup, OverlayTrigger, Tooltip } from 'react-bootstrap';
import { OverlayInjectedProps } from 'react-bootstrap/esm/Overlay';
import { BsArrowUpDown, BsFillLockFill, BsFillEnvelopeOpenFill } from 'react-icons/bs';
import { useParams } from 'react-router-dom';
import { CustomModal } from '../../components/custom-modal/CustomModal';
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

    useEffect(() => {
        apiService
            .getPoll(pollId)
            .then((response: IPollWithVotes) => {
                setPoll({ ...response });
            })
            .catch((err) => {
                setModalText('Could not fetch the poll');
                setModalTitle('Error');
                handleModal();
            });
    }, []);

    function handleModal() {
        setModalShown(!modalShown);
    }

    return (
        <BaseScreen>
            <Form className="mt-5 mb-5">
                <Form.Group id="formText">
                    <Form.Control size="lg" type="title" placeholder={poll.pollName} disabled />
                    <br />
                    <InputGroup>
                        <Form.Control
                            size="sm"
                            type="title"
                            placeholder={String(poll.pollDeadline)}
                            disabled
                        />
                    </InputGroup>
                    <br />
                    <Form.Group>
                        {!!poll.isPrivate && (
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
                                overlay={(props) => renderTooltip(props, 'Abstention is valid.')}
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
                    </Form.Group>
                    <Form.Control
                        as="textarea"
                        rows={3}
                        id="description"
                        placeholder={poll.description}
                        disabled
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
                <Button variant="primary" onClick={() => {}}>
                    Submit
                </Button>
            </Form>
            <CustomModal
                title={modalTitle}
                body={modalText}
                modalHandler={handleModal}
                show={modalShown}
            ></CustomModal>
        </BaseScreen>
    );
};
