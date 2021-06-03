import { EMembership, GetCurrentUserResponse, IUser } from 'interfaces';
import React, { FunctionComponent, useCallback, useEffect, useState } from 'react';
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
    refresh?: boolean;
}

export const BaseScreen: FunctionComponent<BaseScreenProps> = ({
    modalShown,
    modalTitle,
    modalText,
    children,
    modalHandler,
    refresh,
}) => {
    const [lastRefresh, setLastRefresh] = useState(false);
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

    const [receivedDels, setReceivedDels] = useState<IUser[]>([]);
    const [givenDels, setGivenDels] = useState<IUser[]>([]);

    const getDels = useCallback((id: string) => {
        apiService
            .getReceivedDelegations(id)
            .then((response: IUser[]) => {
                setReceivedDels([...response]);
            })
            .catch((err) => {
                setIsAuth(false);
            });
        apiService
            .getGivenDelegations(id)
            .then((response: IUser[]) => {
                setGivenDels([...response]);
            })
            .catch((err) => {
                setIsAuth(false);
            });
    }, []);

    const getInfo = useCallback(() => {
        apiService
            .getCurrentUser()
            .then((response: GetCurrentUserResponse) => {
                setIsAuth(true);
                setName(response.name);
                setImageUrl(response.picture);
                setMembershipArray(response.membership);
                getDels(response.userId);
            })
            .catch((err) => {
                setIsAuth(false);
            });
    }, [getDels]);

    useEffect(() => {
        getInfo();
    }, [getInfo]);

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

    if (refresh !== undefined && lastRefresh !== refresh) {
        setLastRefresh(refresh);
        getInfo();
    }

    return isAuth ? (
        <>
            <NavigationBar
                name={name}
                imageUrl={imageUrl}
                membershipArray={membershipArray}
                logoutFunction={logoutFunction}
                givenDelegations={givenDels}
                receivedDelegations={receivedDels}
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
