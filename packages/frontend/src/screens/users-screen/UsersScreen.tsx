import { EMembership, GetUsersResponse, IUser } from 'interfaces';
import React, { FunctionComponent, useCallback, useEffect, useState } from 'react';
import { CustomTableUsers } from '../../components/custom-table/CustomTableUsers';
import { apiService } from '../../utils/ApiService';
import { BaseScreen } from '../base-screen/BaseScreen';

export const UsersScreen: FunctionComponent = () => {
    const [data, setData] = useState([] as IUser[]);
    const [showModal, setModalShown] = useState(false);
    const [modalTitle, setModalTitle] = useState('');
    const [modalText, setModalText] = useState('');
    const handleModal = useCallback(() => {
        setModalShown(!showModal);
    }, [showModal]);
    const membershipClicked = (row: IUser, membership: EMembership) => {
        const membershipFinal = [...row.membership].filter((m) => m !== membership);
        if (membershipFinal.length === row.membership.length) {
            membershipFinal.push(membership);
        }
        apiService
            .updateMembership(membershipFinal, row.userId)
            .then((response: boolean) => {
                if (response) {
                    setModalTitle('Success!');
                    setModalText('Membership updated');
                } else {
                    setModalTitle('Error');
                    setModalText('Could not update membership');
                }
                handleModal();
                getData();
            })
            .catch((err) => {
                setModalTitle('Error');
                setModalText('Could not update membership');
                handleModal();
            });
    };

    const getData = useCallback(() => {
        apiService
            .getUsers()
            .then((response: GetUsersResponse) => {
                setData([...response]);
            })
            .catch((err) => {
                setModalTitle('Error');
                setModalText('Could not fetch data');
                handleModal();
            });
    }, [handleModal]);

    useEffect(() => {
        getData();
    }, [getData]);

    return (
        <BaseScreen
            modalShown={showModal}
            modalTitle={modalTitle}
            modalText={modalText}
            modalHandler={handleModal}
        >
            <CustomTableUsers data={data} membershipClicked={membershipClicked}></CustomTableUsers>
        </BaseScreen>
    );
};
