import { GetPollsResponse, IPollWithVotes } from 'interfaces';
import React, { FunctionComponent, useEffect, useState } from 'react';
import { Redirect } from 'react-router-dom';
import { CustomTablePolls } from '../../components/custom-table/CustomTablePolls';
import { apiService } from '../../utils/ApiService';
import { BaseScreen } from '../base-screen/BaseScreen';

export const HomeScreen: FunctionComponent = () => {
    const [data, setData] = useState([] as IPollWithVotes[]);
    const [pollId, setPollId] = useState('');
    const goPoll = (poll: IPollWithVotes) => {
        setPollId(poll._id as unknown as string);
    };
    useEffect(() => {
        apiService
            .getPolls()
            .then((response: GetPollsResponse) => {
                setData([...response]);
            })
            .catch((err) => {
                setData([]);
            });
    }, []);

    return !pollId ? (
        <BaseScreen>
            <CustomTablePolls data={data} rowClicked={goPoll}></CustomTablePolls>
        </BaseScreen>
    ) : (
        <Redirect to={`vote/${pollId}`}></Redirect>
    );
};
