import React from 'react';
import useCustomLogin from "../../hooks/useCustomLogin";

import Market from '../../layouts/market';
import MyInfo from '../../layouts/myinfo';
import SignIn from '../../layouts/authentication/sign-in';
import SignUp from '../../layouts/authentication/sign-up';
import PostInquiry from '../../layouts/postinquiry';
import MyInquiries from '../../layouts/myinquiries';
import Notice from '../../layouts/notice';
import Chat from '../../layouts/chat';
import Alarm from '../../layouts/alarm';
import Cart from '../../layouts/cart';
import MemberManage from '../../layouts/admin/membermanage';
import Outline from '../../layouts/admin/outline';
import MarketManage from '../../layouts/admin/marketmanage';
import ShopManage from '../../layouts/admin/shopmanage';
import ItemManage from '../../layouts/admin/itemmanage';
import InquiryManage from '../../layouts/admin/inquirymanage';
import NoticeManage from '../../layouts/admin/noticemanage';

const RoutesComponent = () => {
    const {isAuthorization, isAdmin} = useCustomLogin();

    const publicRoutes = [
        {
            type: 'collapse',
            name: '시장',
            key: 'market',
            route: '/market',
            component: <Market/>,
        },
        {
            type: 'collapse',
            name: '공지사항',
            key: 'notice',
            route: '/notice',
            component: <Notice/>,
        },
    ];

    const authRoutes = !isAuthorization
        ? [
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

        ]
        : [
            {
                type: 'collapse',
                name: '로그아웃',
                key: 'logout',
                route: '/authentication/logout',
                component: <SignIn/>,
            },
            {
                type: 'collapse',
                name: '내정보',
                key: 'myinfo',
                route: '/myinfo',
                component: <MyInfo/>,
            },
            {
                type: 'collapse',
                name: '장바구니',
                key: 'cart',
                route: '/cart',
                component: <Cart/>,
            },
            {
                type: 'collapse',
                name: '문의하기',
                key: 'postinquiry',
                route: '/inquiry',
                component: <PostInquiry/>,
            },
            {
                type: 'collapse',
                name: '내 문의사항',
                key: 'myInquiries',
                route: '/myinquiries',
                component: <MyInquiries/>,
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
        ];

    const adminRoutes = isAdmin ? [ // 관리자 전용 메뉴 추가
        {
            type: 'collapse',
            name: '홈페이지 현황',
            key: 'outline',
            route: '/outline',
            component: <Outline />,
        },
        {
            type: 'collapse',
            name: '회원 관리',
            key: 'member',
            route: '/member-manage',
            component: <MemberManage />,
        },
        {
            type: 'collapse',
            name: '시장 관리',
            key: 'marketManage',
            route: '/market-manage',
            component: <MarketManage />,
        },
        {
            type: 'collapse',
            name: '상점 관리',
            key: 'shopManage',
            route: '/shop-manage',
            component: <ShopManage />,
        },
        {
            type: 'collapse',
            name: '상품 관리',
            key: 'itemManage',
            route: '/item-manage',
            component: <ItemManage />,
        },
        {
            type: 'collapse',
            name: '문의사항 관리',
            key: 'inquiryManage',
            route: '/inquiry-manage',
            component: <InquiryManage />,
        },
        {
            type: 'collapse',
            name: '공지사항 관리',
            key: 'noticeManage',
            route: '/notice-manage',
            component: <NoticeManage />,
        },
    ] : [];

    return [...publicRoutes, ...authRoutes, ...adminRoutes];
};

export default RoutesComponent;
