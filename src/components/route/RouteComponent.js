import React from 'react';
import useCustomLogin from "../../hooks/useCustomLogin";

import Market from '../../layouts/market';
import PostMarket from '../../layouts/postmarket';
import MyPosts from '../../layouts/myposts';
import SignIn from '../../layouts/authentication/sign-in';
import SignUp from '../../layouts/authentication/sign-up';
import Chat from '../../layouts/chat';
import Alarm from '../../layouts/alarm';
import Cart from '../../layouts/cart';
import MemberList from '../../layouts/memberList';

const RoutesComponent = () => {
    const {loginState} = useCustomLogin();

    const routes = [
        {
            type: 'collapse',
            name: '시장',
            key: 'market',
            route: '/market',
            component: <Market/>,
        },
        {
            type: 'collapse',
            name: '로그인',
            key: 'sign-in',
            route: '/authentication/sign-in',
            component: <SignIn/>,
        },
        {
            type: 'collapse',
            name: '회원가입',
            key: 'sign-up',
            route: '/authentication/sign-up',
            component: <SignUp/>,
        },
        {
            type: 'collapse',
            name: '내정보',
            key: 'myposts',
            route: '/my-post',
            component: <MyPosts/>,
        },
        {
            type: 'collapse',
            name: '채팅',
            key: 'chat',
            route: '/chat',
            component: <Chat/>,
        },
        {
            type: 'collapse',
            name: '알람',
            key: 'alarms',
            route: '/alarms',
            component: <Alarm/>,
        },
        {
            type: 'collapse',
            name: '장바구니',
            key: 'cart',
            route: '/cart',
            component: <Cart/>,
        },
    ];

    if (loginState.role === 'ADMIN') {
        routes.push({
                type: 'collapse',
                name: '시장 추가',
                key: 'post',
                route: '/post-market',
                component: <PostMarket/>,
            },
            {
                type: 'collapse',
                name: '회원 목록 조회',
                key: 'member',
                route: '/member-list',
                component: <MemberList/>,
            },
        );
    }

    return routes;
};

export default RoutesComponent;
