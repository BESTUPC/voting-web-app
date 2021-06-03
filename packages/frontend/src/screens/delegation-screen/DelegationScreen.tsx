import { IUser } from 'interfaces';
import React, { FunctionComponent, useCallback, useEffect, useState } from 'react';
import { Button, Col, Container, Form } from 'react-bootstrap';
import SelectSearch, { fuzzySearch } from 'react-select-search';
import {
    CustomTableDelegations,
    IDelegationData,
} from '../../components/custom-table/CustomTableDelegations';
import { apiService } from '../../utils/ApiService';
import { BaseScreen } from '../base-screen/BaseScreen';
import './DelegationScreen.css';

export const DelegationScreen: FunctionComponent = () => {
    const [modalShown, setModalShown] = useState<boolean>(false);
    const [modalTitle, setModalTitle] = useState<string>('');
    const [modalText, setModalText] = useState<string>('');
    const [data, setData] = useState([] as IDelegationData[]);
    const [users, setUsers] = useState([] as IUser[]);
    const [delegator, setDelegator] = useState('');
    const [receiver, setReceiver] = useState('');
    const [refresh, setRefresh] = useState(false);

    const refreshNav = () => {
        setRefresh(!refresh);
    };
    const options = users.map((u) => ({ name: u.name, value: u.userId }));

    const handleModal = useCallback(() => {
        setModalShown(!modalShown);
    }, [modalShown]);

    const getDelegations = useCallback(() => {
        apiService
            .getDelegationsWithUsers()
            .then((response: IDelegationData[]) => {
                setData([...response]);
            })
            .catch((err) => {
                setModalTitle('Error');
                setModalText('Could not fetch delegtions');
                handleModal();
            });
    }, [handleModal]);

    function createDelegation() {
        apiService
            .giveDelegation(delegator, receiver)
            .then((response: boolean) => {
                if (!response) {
                    setModalTitle('Error');
                    setModalText('Could not create delegation');
                    handleModal();
                }
                getDelegations();
                refreshNav();
            })
            .catch((err) => {
                setModalTitle('Error');
                setModalText('Could not create delegation');
                handleModal();
            });
    }

    function deleteDelegation(delegation: IDelegationData) {
        apiService
            .deleteDelegation(delegation.id)
            .then((response: boolean) => {
                if (!response) {
                    setModalTitle('Error');
                    setModalText('Could not delete delegation');
                    handleModal();
                }
                getDelegations();
                refreshNav();
            })
            .catch((err) => {
                setModalTitle('Error');
                setModalText('Could not create delegation');
                handleModal();
            });
    }

    useEffect(() => {
        getDelegations();
        apiService
            .getUsers()
            .then((response: IUser[]) => {
                setUsers([...response]);
            })
            .catch((err) => {
                setModalTitle('Error');
                setModalText('Could not fetch users');
                handleModal();
            });
    }, [getDelegations, handleModal]);

    return (
        <BaseScreen
            modalShown={modalShown}
            modalText={modalText}
            modalTitle={modalTitle}
            modalHandler={handleModal}
            refresh={refresh}
        >
            <CustomTableDelegations
                data={data}
                rowClicked={deleteDelegation}
            ></CustomTableDelegations>
            <Container>
                <Form>
                    <Form.Row>
                        <Col>
                            <SelectSearch
                                options={options}
                                search
                                filterOptions={fuzzySearch}
                                closeOnSelect
                                autoComplete="on"
                                placeholder="Delegator"
                                value={delegator}
                                onChange={(s) => {
                                    setDelegator(s as unknown as string);
                                }}
                            />
                            <br />
                            <SelectSearch
                                options={options}
                                search
                                filterOptions={fuzzySearch}
                                closeOnSelect
                                autoComplete="on"
                                placeholder="Receiver"
                                value={receiver}
                                onChange={(s) => setReceiver(s as unknown as string)}
                            />
                            <br />
                            <Button onClick={createDelegation}>Create Delegation</Button>
                        </Col>
                    </Form.Row>
                </Form>
            </Container>
        </BaseScreen>
    );
};
