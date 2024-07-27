/*
import React from 'react';
import {RouterProvider} from "react-router-dom";
import root from "./router/root" ;

function App() {
    return (
        < RouterProvider router={root}/>
    );
}

export default App;*/

import { useState, useEffect, useMemo } from 'react';

// react-router components
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';

// @mui material components
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import Icon from '@mui/material/Icon';

// Material Dashboard 2 React components
import MDBox from './components/MD/MDBox';

// Material Dashboard 2 React example components
import Sidenav from './examples/Sidenav';
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

// routes
import MarketDetail from './layouts/marketdetail';
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
import root from "./router/root"
import {RouterProvider} from "react-router";

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
                return <Route exact path={route.route} element={route.component} key={route.key} />;
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
                            brandName="우리동네 전통시장 👨🏻‍🌾"
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
                        brandName="우리동네 전통시장 👨🏻‍🌾"
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
                <Route path="/market-detail" element=<MarketDetail /> />
                <Route path="/modify-market" element=<ModifyMarket /> />
                <Route path="/post-shop" element=<PostShop /> />
                <Route path="/shop-detail" element=<ShopDetail /> />
                <Route path="/modify-shop" element=<ModifyShop /> />
                <Route path="/post-item" element=<PostItem /> />
                <Route path="/item-detail" element=<ItemDetail /> />
                <Route path="/modify-item" element=<ModifyItem /> />
                <Route path="/chat-detail" element=<ChatDetail /> />
                <Route path="/cart" element=<Cart /> />
                <Route path="/order" element=<Order /> />
                <Route path="/order-complete" element=<OrderComplete /> />
                <Route path="/top-five-item" element=<TopFiveItem /> />
            </Routes>
        </ThemeProvider>
    );
}
