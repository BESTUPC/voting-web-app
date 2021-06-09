import { EPollState, GetPollsResponse, IPollWithVotes } from 'interfaces';
import React, { FunctionComponent, useEffect, useState } from 'react';
import { Redirect } from 'react-router-dom';
import { CustomTablePolls } from '../../components/custom-table/CustomTablePolls';
import { apiService } from '../../utils/ApiService';
import { BaseScreen } from '../base-screen/BaseScreen';

export const HomeScreen: FunctionComponent = () => {
    const [data, setData] = useState([] as IPollWithVotes[]);
    const [pollId, setPollId] = useState('');
    const [pollState, setPollState] = useState('');
    const [showModal, setModalShown] = useState(false);
    const [modalTitle, setModalTitle] = useState('');
    const [modalText, setModalText] = useState('');
    const goPoll = (poll: IPollWithVotes) => {
        setPollState(poll.state === EPollState.OPEN ? 'vote' : 'results');
        setPollId(poll._id as unknown as string);
    };

    const handleModal = () => {
        setModalShown(!showModal);
    };
    useEffect(() => {
        apiService
            .getPolls()
            .then((response: GetPollsResponse) => {
                setData([...response]);
            })
            .catch((err) => {
                setModalTitle('Error');
                setModalText('Could not fetch polls');
                setModalShown(true);
                setData([]);
            });
    }, []);

    return !pollId ? (
        <BaseScreen
            modalShown={showModal}
            modalTitle={modalTitle}
            modalText={modalText}
            modalHandler={handleModal}
        >
            <CustomTablePolls data={data} rowClicked={goPoll}></CustomTablePolls>
        </BaseScreen>
    ) : (
        <Redirect to={`/${pollState}/${pollId}`}></Redirect>
    );
};
