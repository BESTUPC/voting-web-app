import { EMembership, GetCurrentUserResponse } from 'interfaces';
import React, { FunctionComponent, useEffect, useState } from 'react';
import { Container } from 'react-bootstrap';
import { Redirect } from 'react-router-dom';
import { CustomModal } from '../../components/custom-modal/CustomModal';
import { NavigationBar } from '../../components/navigation-bar/NavigationBar';
import { apiService } from '../../utils/ApiService';

interface BaseScreenProps {
    modalShown?: boolean;
    modalTitle?: string;
    modalText?: string;
    modalHandler?: () => void;
}

export const BaseScreen: FunctionComponent<BaseScreenProps> = ({
    modalShown,
    modalTitle,
    modalText,
    children,
    modalHandler,
}) => {
    const showModal = modalShown || false;
    const titleModal = modalTitle || '';
    const textModal = modalText || '';
    const handleModal = modalHandler || (() => {});
    const [name, setName] = useState<string>('');
    const [imageUrl, setImageUrl] = useState<string>(
        'https://www.getdigital.eu/web/getdigital/gfx/products/__generated__resized/1100x1100/Aufkleber_Trollface.jpg',
    );
    const [membershipArray, setMembershipArray] = useState<EMembership[]>([]);

    const [isAuth, setIsAuth] = useState<boolean>(true);

    useEffect(() => {
        apiService
            .getCurrentUser()
            .then((response: GetCurrentUserResponse) => {
                setIsAuth(true);
                setName(response.name);
                setImageUrl(response.picture);
                setMembershipArray(response.membership);
            })
            .catch((err) => {
                setIsAuth(false);
            });
    }, []);

    const logoutFunction = () => {
        apiService
            .logout()
            .then(() => {
                setIsAuth(false);
            })
            .catch((err) => {
                setIsAuth(false);
            });
    };

    return isAuth ? (
        <>
            <NavigationBar
                name={name}
                imageUrl={imageUrl}
                membershipArray={membershipArray}
                logoutFunction={logoutFunction}
            />
            <Container>{children}</Container>
            <CustomModal
                title={titleModal}
                show={showModal}
                modalHandler={handleModal}
                body={textModal}
            ></CustomModal>
        </>
    ) : (
        <Redirect to="/login" />
    );
};
