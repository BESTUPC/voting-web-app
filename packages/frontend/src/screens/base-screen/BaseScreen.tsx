import { EMembership, GetCurrentUserResponse } from 'interfaces';
import React, { FunctionComponent, useEffect, useState } from 'react';
import { Redirect } from 'react-router-dom';
import { NavigationBar } from '../../components/navigation-bar/NavigationBar';
import { apiService } from '../../services/ApiService';

export const BaseScreen: FunctionComponent = () => {
    const [name, setName] = useState<string>('');
    const [imageUrl, setImageUrl] = useState<string>(
        'https://www.getdigital.eu/web/getdigital/gfx/products/__generated__resized/1100x1100/Aufkleber_Trollface.jpg',
    );
    const [membershipArray, setMembershipArray] = useState<EMembership[]>([]);

    const [isAuth, setIsAuth] = useState<boolean>(false);

    useEffect(() => {
        apiService
            .getCurrentUser()
            .then((response: GetCurrentUserResponse) => {
                setIsAuth(true);
                const webUser = response.web;
                const googleUser = response.google;
                setName(webUser.name);
                if (!!googleUser?.photos?.length) {
                    setImageUrl(googleUser?.photos?.[0].value);
                }
                setMembershipArray(webUser.membership);
            })
            .catch((err) => {
                setIsAuth(false);
            });
    }, []);

    return isAuth ? <NavigationBar name={name} imageUrl={imageUrl} membershipArray={membershipArray} /> : <Redirect to='/login' />;
};
