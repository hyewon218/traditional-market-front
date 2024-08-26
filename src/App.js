import { useState, useEffect, useMemo } from 'react';

// react-router components
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';

// @mui material components
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import Icon from '@mui/material/Icon';

// Material Dashboard 2 React components
import MDBox from './components/MD/MDBox';
import ProtectedRoute from './components/ProtectedRoute';
import ProtectedRouteSeller from './components/ProtectedRouteSeller';
import Sidenav from './examples/Sidenav';
//import Sidenav from './examples/Navbars/DashboardNavbar';
import Configurator from './examples/Configurator';

// Material Dashboard 2 React themes
import theme from './assets/theme';
import themeRTL from './assets/theme/theme-rtl';

// Material Dashboard 2 React Dark Mode themes
import themeDark from './assets/theme-dark';
import themeDarkRTL from './assets/theme-dark/theme-rtl';

// RTL plugins
import rtlPlugin from 'stylis-plugin-rtl';
import { CacheProvider } from '@emotion/react';
import createCache from '@emotion/cache';

// Material Dashboard 2 React routes
//import routes from './routes';
import RoutesComponent from "./components/route/RouteComponent";

// Material Dashboard 2 React contexts
import { useMaterialUIController, setMiniSidenav, setOpenConfigurator } from './context';

// Images
import brandWhite from './assets/images/logo-ct.png';
import brandDark from './assets/images/logo-ct-dark.png';

// Import layout components
import PostMarket from './layouts/postmarket';
import MarketDetail from './layouts/marketdetail';
import InquiryDetail from './layouts/inquirydetail';
import ModifyMarket from './layouts/modifymarket';
import ShopDetail from './layouts/shopdetail';
import PostShop from './layouts/postshop';
import ModifyShop from './layouts/modifyshop';
import PostItem from './layouts/postitem';
import ItemDetail from './layouts/itemdetail';
import ModifyItem from './layouts/modifyitem';
import ChatDetail from './layouts/chatdetail';
import Cart from './layouts/cart';
import Order from './layouts/order';
import OrderComplete from './layouts/ordercomplete';
import TopFiveItem from './layouts/topfiveitem';
import MarketDetailAdmin from './layouts/admin/marketdetail';
import ShopDetailAdmin from './layouts/admin/shopdetail';
import ItemDetailAdmin from './layouts/admin/itemdetail';
import MemberDetailAdmin from './layouts/admin/memberdetail';
import PostShopAdmin from './layouts/admin/postshop';
import PostItemAdmin from './layouts/admin/postitem';
import PostNoticeAdmin from './layouts/admin/postnotice';
import NoticeDetail from './layouts/noticedetail';
import ModifyNotice from './layouts/admin/modifynotice';
import MyInfoDetail from './layouts/myinfodetail'; // 내 정보 페이지
import CheckPw from './layouts/checkpw'; // 내 정보 진입 시 미인증인 경우, 비밀번호 확인 페이지
import MyInquiries from './layouts/myinquiries'; // 내 문의사항 목록
import DeliveryManage from './layouts/deliverymanage'; // 배송지 관리
import OrderList from './layouts/orderlist'; // complete 주문 목록
import OrderDetail from './layouts/orderdetail'; // complete 주문 상세
import ModifyOAuthInfo from './layouts/modifyoauthinfo'; // OAuth2.0 가입 회원 최초 로그인 시 닉네임 없을 경우 입력하는 페이지
import WithdrawMemberManage from './layouts/admin/withdrawmembermanage'; // 탈퇴회원 관리
import WithdrawMemberDetail from './layouts/admin/withdrawmemberdetail'; // 탈퇴회원 상세 조회
import ShopDetailSeller from './layouts/seller/shop-detail-seller'; // 상점 상세정보 조회 (판매자 권한)
import PostItemSeller from './layouts/seller/post-item-seller'; // 상품 추가 (판매자 전용)
import ModifyItemSeller from './layouts/seller/modify-item-seller'; // 상품 수정 (판매자 전용)
import ModifyShopSeller from './layouts/seller/modify-shop-seller'; // 상점 수정 (판매자 전용)
import ItemDetailSeller from './layouts/seller/item-detail-seller'; // 상품 상세정보 조회 (판매자 전용)
import OrderDetailSeller from './layouts/seller/order-detail-seller'; // 주문 상세정보 조회 (판매자 전용)
import DailySalesItem from './layouts/admin/daily-sales-item'; // 상품 날짜별 매출액 (관리자 전용)

import CoordinatePopupPage from './pages/CoordinatePopupPage'; // 좌표찾기 새창

export default function App() {
    const routes = RoutesComponent();

    const [controller, dispatch] = useMaterialUIController();
    const {
        miniSidenav,
        direction,
        layout,
        openConfigurator,
        sidenavColor,
        transparentSidenav,
        whiteSidenav,
        darkMode,
    } = controller;
    const [onMouseEnter, setOnMouseEnter] = useState(false);
    const [rtlCache, setRtlCache] = useState(null);
    const { pathname } = useLocation();

    // Cache for the rtl
    useMemo(() => {
        const cacheRtl = createCache({
            key: 'rtl',
            stylisPlugins: [rtlPlugin],
        });

        setRtlCache(cacheRtl);
    }, []);

    // Open sidenav when mouse enter on mini sidenav
    const handleOnMouseEnter = () => {
        if (miniSidenav && !onMouseEnter) {
            setMiniSidenav(dispatch, false);
            setOnMouseEnter(true);
        }
    };

    // Close sidenav when mouse leave mini sidenav
    const handleOnMouseLeave = () => {
        if (onMouseEnter) {
            setMiniSidenav(dispatch, true);
            setOnMouseEnter(false);
        }
    };

    // Change the openConfigurator state
    const handleConfiguratorOpen = () => setOpenConfigurator(dispatch, !openConfigurator);

    // Setting the dir attribute for the body element
    useEffect(() => {
        document.body.setAttribute('dir', direction);
    }, [direction]);

    // Setting page scroll to 0 when changing the route
    useEffect(() => {
        document.documentElement.scrollTop = 0;
        document.scrollingElement.scrollTop = 0;
    }, [pathname]);

    const getRoutes = (allRoutes) =>
        allRoutes.map((route) => {
            if (route.collapse) {
                return getRoutes(route.collapse);
            }

            if (route.route) {
                // Admin routes are wrapped with ProtectedRoute
                return route.isAdmin ? (
                    <Route
                        exact
                        path={route.route}
                        element={<ProtectedRoute>{route.component}</ProtectedRoute>}
                        key={route.key}
                    />
                ) : (
                    <Route exact path={route.route} element={route.component} key={route.key} />
                );
            }

            return null;
        });

    const configsButton = (
        <MDBox
            display="flex"
            justifyContent="center"
            alignItems="center"
            width="3.25rem"
            height="3.25rem"
            bgColor="white"
            shadow="sm"
            borderRadius="50%"
            position="fixed"
            right="2rem"
            bottom="2rem"
            zIndex={99}
            color="dark"
            sx={{ cursor: 'pointer' }}
            onClick={handleConfiguratorOpen}
        >
            <Icon fontSize="small" color="inherit">
                settings
            </Icon>
        </MDBox>
    );

    return direction === 'rtl' ? (
        <CacheProvider value={rtlCache}>
            <ThemeProvider theme={darkMode ? themeDarkRTL : themeRTL}>
                <CssBaseline />
                {layout === 'dashboard' && (
                    <>
                        <Sidenav
                            color={sidenavColor}
                            brand={(transparentSidenav && !darkMode) || whiteSidenav ? brandDark : brandWhite}
                            brandName="우리동네 전통시장"
                            routes={routes}
                            onMouseEnter={handleOnMouseEnter}
                            onMouseLeave={handleOnMouseLeave}
                        />
                        <Configurator />
                    </>
                )}
                {layout === 'vr' && <Configurator />}
                <Routes>
                    {getRoutes(routes)}
                    <Route path="*" element={<Navigate to="/market" />} />
                    <Route path="/coordinate-popup" element={<CoordinatePopupPage />} />
                    <Route path="/market-detail" element={<MarketDetail />} />
                    <Route path="/inquiry-detail" element={<InquiryDetail />} />
                    <Route path="/shop-detail" element={<ShopDetail />} />
                    <Route path="/item-detail" element={<ItemDetail />} />
                    <Route path="/chat-detail" element={<ChatDetail />} />
                    <Route path="/notice-detail" element={<NoticeDetail />} />
                    <Route path="/cart" element={<Cart />} />
                    <Route path="/order" element={<Order />} />
                    <Route path="/order-complete" element={<OrderComplete />} />
                    <Route path="/top-five-item" element={<TopFiveItem />} />
                    <Route path="/myinfo-detail" element={<MyInfoDetail />} />
                    <Route path="/check-pw" element={<CheckPw />} />
                    <Route path="/myinquiries" element={<MyInquiries />} />
                    <Route path="/deliverymanage" element={<DeliveryManage />} />
                    <Route path="/order-list" element={<OrderList />} />
                    <Route path="/order-detail" element={<OrderDetail />} />
                    <Route path="/add-info" element={<ModifyOAuthInfo />} />

                    // seller 권한만 접근 가능
                    <Route
                        path="/shop-detail-seller"
                        element={<ProtectedRouteSeller><ShopDetailSeller /></ProtectedRouteSeller>}
                    />
                    <Route
                        path="/post-item-seller"
                        element={<ProtectedRouteSeller><PostItemSeller /></ProtectedRouteSeller>}
                    />
                    <Route
                        path="/modify-item-seller"
                        element={<ProtectedRouteSeller><ModifyItemSeller /></ProtectedRouteSeller>}
                    />
                    <Route
                        path="/modify-shop-seller"
                        element={<ProtectedRouteSeller><ModifyShopSeller /></ProtectedRouteSeller>}
                    />
                    <Route
                        path="/item-detail-seller"
                        element={<ProtectedRouteSeller><ItemDetailSeller /></ProtectedRouteSeller>}
                    />
                    <Route
                        path="/order-detail-seller"
                        element={<ProtectedRouteSeller><OrderDetailSeller /></ProtectedRouteSeller>}
                    />

                    {/*admin 권한만 접근 가능*/}
                    <Route
                        path="/post-market"
                        element={<ProtectedRoute><PostMarket /></ProtectedRoute>}
                    />
                    <Route
                        path="/modify-market"
                        element={<ProtectedRoute><ModifyMarket /></ProtectedRoute>}
                    />
                    <Route
                        path="/post-shop"
                        element={<ProtectedRoute><PostShop /></ProtectedRoute>}
                    />
                    <Route
                        path="/modify-shop"
                        element={<ProtectedRoute><ModifyShop /></ProtectedRoute>}
                    />
                    <Route
                        path="/post-item"
                        element={<ProtectedRoute><PostItem /></ProtectedRoute>}
                    />
                    <Route
                        path="/modify-item"
                        element={<ProtectedRoute><ModifyItem /></ProtectedRoute>}
                    />
                    <Route
                        path="/market-detail-admin"
                        element={<ProtectedRoute><MarketDetailAdmin /></ProtectedRoute>}
                    />
                    <Route
                        path="/shop-detail-admin"
                        element={<ProtectedRoute><ShopDetailAdmin /></ProtectedRoute>}
                    />
                    <Route
                        path="/item-detail-admin"
                        element={<ProtectedRoute><ItemDetailAdmin /></ProtectedRoute>}
                    />
                    <Route
                        path="/member-detail-admin"
                        element={<ProtectedRoute><MemberDetailAdmin /></ProtectedRoute>}
                    />
                    <Route
                        path="/post-shop-admin"
                        element={<ProtectedRoute><PostShopAdmin /></ProtectedRoute>}
                    />
                    <Route
                        path="/post-item-admin"
                        element={<ProtectedRoute><PostItemAdmin /></ProtectedRoute>}
                    />
                    <Route
                        path="/post-notice-admin"
                        element={<ProtectedRoute><PostNoticeAdmin /></ProtectedRoute>}
                    />
                    <Route
                        path="/modify-notice"
                        element={<ProtectedRoute><ModifyNotice /></ProtectedRoute>}
                    />
                    <Route
                        path="/withdrawmember-manage"
                        element={<ProtectedRoute><WithdrawMemberManage /></ProtectedRoute>}
                    />
                    <Route
                        path="/withdrawmember-detail"
                        element={<ProtectedRoute><WithdrawMemberDetail /></ProtectedRoute>}
                    />
                    <Route
                        path="/daily-sales-item"
                        element={<ProtectedRoute><DailySalesItem /></ProtectedRoute>}
                    />
                </Routes>
            </ThemeProvider>
        </CacheProvider>
    ) : (
        <ThemeProvider theme={darkMode ? themeDark : theme}>
            <CssBaseline />
            {layout === 'dashboard' && (
                <>
                    <Sidenav
                        color={sidenavColor}
                        brand={(transparentSidenav && !darkMode) || whiteSidenav ? brandDark : brandWhite}
                        brandName="우리동네 전통시장"
                        routes={routes}
                        onMouseEnter={handleOnMouseEnter}
                        onMouseLeave={handleOnMouseLeave}
                    />
                    <Configurator />
                </>
            )}
            {layout === 'vr' && <Configurator />}
            <Routes>
                {/*< RouterProvider router={root}/>*/}
                {getRoutes(routes)}
                <Route path="*" element={<Navigate to="/market" />} />
                <Route path="/coordinate-popup" element={<CoordinatePopupPage />} />
                <Route path="/market-detail" element={<MarketDetail />} />
                <Route path="/inquiry-detail" element={<InquiryDetail />} />
                <Route path="/shop-detail" element={<ShopDetail />} />
                <Route path="/item-detail" element={<ItemDetail />} />
                <Route path="/chat-detail" element={<ChatDetail />} />
                <Route path="/notice-detail" element={<NoticeDetail />} />
                <Route path="/cart" element={<Cart />} />
                <Route path="/order" element={<Order />} />
                <Route path="/order-complete" element={<OrderComplete />} />
                <Route path="/top-five-item" element={<TopFiveItem />} />
                <Route path="/myinfo-detail" element={<MyInfoDetail />} />
                <Route path="/check-pw" element={<CheckPw />} />
                <Route path="/myinquiries" element={<MyInquiries />} />
                <Route path="/deliverymanage" element={<DeliveryManage />} />
                <Route path="/order-list" element={<OrderList />} />
                <Route path="/order-detail" element={<OrderDetail />} />
                <Route path="/add-info" element={<ModifyOAuthInfo />} />

                // seller 권한만 접근 가능
                <Route
                    path="/shop-detail-seller"
                    element={<ProtectedRouteSeller><ShopDetailSeller /></ProtectedRouteSeller>}
                />
                <Route
                    path="/post-item-seller"
                    element={<ProtectedRouteSeller><PostItemSeller /></ProtectedRouteSeller>}
                />
                <Route
                    path="/modify-item-seller"
                    element={<ProtectedRouteSeller><ModifyItemSeller /></ProtectedRouteSeller>}
                />
                <Route
                    path="/modify-shop-seller"
                    element={<ProtectedRouteSeller><ModifyShopSeller /></ProtectedRouteSeller>}
                />
                <Route
                    path="/item-detail-seller"
                    element={<ProtectedRouteSeller><ItemDetailSeller /></ProtectedRouteSeller>}
                />
                <Route
                    path="/order-detail-seller"
                    element={<ProtectedRouteSeller><OrderDetailSeller /></ProtectedRouteSeller>}
                />


                // admin 권한만 접근 가능
                <Route
                    path="/post-market"
                    element={<ProtectedRoute><PostMarket /></ProtectedRoute>}
                />
                <Route
                    path="/modify-market"
                    element={<ProtectedRoute><ModifyMarket /></ProtectedRoute>}
                />
                <Route
                    path="/post-shop"
                    element={<ProtectedRoute><PostShop /></ProtectedRoute>}
                />
                <Route
                    path="/modify-shop"
                    element={<ProtectedRoute><ModifyShop /></ProtectedRoute>}
                />
                <Route
                    path="/post-item"
                    element={<ProtectedRoute><PostItem /></ProtectedRoute>}
                />
                <Route
                    path="/modify-item"
                    element={<ProtectedRoute><ModifyItem /></ProtectedRoute>}
                />
                <Route
                    path="/market-detail-admin"
                    element={<ProtectedRoute><MarketDetailAdmin /></ProtectedRoute>}
                />
                <Route
                    path="/shop-detail-admin"
                    element={<ProtectedRoute><ShopDetailAdmin /></ProtectedRoute>}
                />
                <Route
                    path="/item-detail-admin"
                    element={<ProtectedRoute><ItemDetailAdmin /></ProtectedRoute>}
                />
                <Route
                    path="/member-detail-admin"
                    element={<ProtectedRoute><MemberDetailAdmin /></ProtectedRoute>}
                />
                <Route
                    path="/post-shop-admin"
                    element={<ProtectedRoute><PostShopAdmin /></ProtectedRoute>}
                />
                <Route
                    path="/post-item-admin"
                    element={<ProtectedRoute><PostItemAdmin /></ProtectedRoute>}
                />
                <Route
                    path="/post-notice-admin"
                    element={<ProtectedRoute><PostNoticeAdmin /></ProtectedRoute>}
                />
                <Route
                    path="/modify-notice"
                    element={<ProtectedRoute><ModifyNotice /></ProtectedRoute>}
                />
                <Route
                    path="/withdrawmember-manage"
                    element={<ProtectedRoute><WithdrawMemberManage /></ProtectedRoute>}
                />
                <Route
                    path="/withdrawmember-detail"
                    element={<ProtectedRoute><WithdrawMemberDetail /></ProtectedRoute>}
                />
                <Route
                    path="/daily-sales-item"
                    element={<ProtectedRoute><DailySalesItem /></ProtectedRoute>}
                />
            </Routes>
        </ThemeProvider>
    );
}
