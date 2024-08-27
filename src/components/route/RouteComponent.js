import React from 'react';
import useCustomLogin from "../../hooks/useCustomLogin";

import Market from '../../layouts/market';
import MyInfo from '../../layouts/myinfo';
import SignIn from '../../layouts/authentication/signin';
import SignUp from '../../layouts/authentication/signup';
import PostInquiry from '../../layouts/postinquiry';
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
import OrderManage from '../../layouts/admin/ordermanage';
import OrderManageSeller from '../../layouts/seller/order-manage-seller';
import ShopManageSeller from '../../layouts/seller/shop-manage-seller';

const RoutesComponent = () => {
    const {isAuthorization, isAdmin, isSeller, isMember} = useCustomLogin();

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
                key: 'authentication/signin',
                route: '/authentication/signin',
                component: <SignIn/>,
            },
            {
                type: 'collapse',
                name: '회원가입',
                key: 'authentication/signup',
                route: '/authentication/signup',
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
                name: '1:1 채팅상담',
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

    const memberRoutes = isMember || isSeller ? [ // 회원, 판매자 전용 메뉴 추가
        {
            type: 'collapse',
            name: '문의하기',
            key: 'postinquiry',
            route: '/postinquiry',
            component: <PostInquiry/>,
        },
    ] : [];

    const sellerRoutes = isSeller ? [ // 판매자 전용 메뉴 추가
        {
            type: 'collapse',
            name: '상점 관리',
            key: 'shop-manage-seller',
            route: '/shop-manage-seller',
            component: <ShopManageSeller />,
        },
        {
            type: 'collapse',
            name: '주문 관리',
            key: 'order-manage-seller',
            route: '/order-manage-seller',
            component: <OrderManageSeller />,
        },
    ] : [];

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
            key: 'membermanage',
            route: '/membermanage',
            component: <MemberManage />,
        },
        {
            type: 'collapse',
            name: '주문 관리',
            key: 'order-manage',
            route: '/order-manage',
            component: <OrderManage />,
        },
        {
            type: 'collapse',
            name: '시장 관리',
            key: 'marketmanage',
            route: '/marketmanage',
            component: <MarketManage />,
        },
        {
            type: 'collapse',
            name: '상점 관리',
            key: 'shopmanage',
            route: '/shopmanage',
            component: <ShopManage />,
        },
        {
            type: 'collapse',
            name: '상품 관리',
            key: 'itemmanage',
            route: '/itemmanage',
            component: <ItemManage />,
        },
        {
            type: 'collapse',
            name: '문의사항 관리',
            key: 'inquirymanage',
            route: '/inquirymanage',
            component: <InquiryManage />,
        },
        {
            type: 'collapse',
            name: '공지사항 관리',
            key: 'noticemanage',
            route: '/noticemanage',
            component: <NoticeManage />,
        },
    ] : [];

    return [...publicRoutes, ...authRoutes, ...memberRoutes, ...sellerRoutes, ...adminRoutes];
};

export default RoutesComponent;
