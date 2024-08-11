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
import CoordinatePopupPage from './pages/CoordinatePopupPage';

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
            </Routes>
        </ThemeProvider>
    );
}
