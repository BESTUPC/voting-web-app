import { IPoll, IPollWithVotes } from 'interfaces';
import React, { FunctionComponent, useEffect, useState } from 'react';
import { Button, Col, Form } from 'react-bootstrap';
import { useParams } from 'react-router-dom';
import { CustomModal } from '../../components/custom-modal/CustomModal';
import { PollOption } from '../../components/poll-option/PollOption';
import { apiService } from '../../utils/ApiService';
import { BaseScreen } from '../base-screen/BaseScreen';
import './VoteScreen.css';

export const VoteScreen: FunctionComponent = () => {
    const [modalShown, setModalShown] = useState<boolean>(false);
    const [modalTitle, setModalTitle] = useState<string>('');
    const [modalText, setModalText] = useState<string>('');
    const [poll, setPoll] = useState({} as IPollWithVotes);
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
                    <Form.Control
                        size="lg"
                        type="title"
                        id="title"
                        placeholder={poll.pollName}
                        disabled
                    />
                    <br />
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
                                {(poll.pollOptions || []).map((o, idx) => (
                                    <Form.Group key={idx}>
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
                                        ></PollOption>
                                    </Form.Group>
                                ))}
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
