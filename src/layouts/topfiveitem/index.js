/**
 =========================================================
 * Material Dashboard 2 React - v2.1.0
 =========================================================

 * Product Page: https://www.creative-tim.com/product/material-dashboard-react
 * Copyright 2022 Creative Tim (https://www.creative-tim.com)

 Coded by www.creative-tim.com

 =========================================================

 * The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.
 */

import * as React from 'react';
import {useEffect, useState} from 'react';
import {useNavigate} from 'react-router';

// @mui material components
import Grid from '@mui/material/Grid';
import Card from '@mui/material/Card';

// Material Dashboard 2 React components
import MDBox from '../../components/MD/MDBox';
import MDTypography from '../../components/MD/MDTypography';

// Material Dashboard 2 React example components
import DashboardLayout from '../../examples/LayoutContainers/DashboardLayout';
import MDButton from "../../components/MD/MDButton";
import {useLocation} from "react-router-dom";
import {
    getItemByShop,
    getListCategoryByMarket,
    getListTopFiveItem
} from "../../api/itemApi";
import {useMediaQuery} from "@mui/material";
import {getShopOne} from "../../api/shopApi";

function TopFiveItem() {
    const {state} = useLocation();
    const market = state; // 전달된 market 데이터를 사용

    const [items, setItems] = useState([]);

    /*시장 카테고리*/
    const [selectedCategory, setSelectedCategory] = useState('');
    const [categoryItems, setCategoryItems] = useState([]);

    const navigate = useNavigate();

    const isSmallScreen = useMediaQuery('(max-width:600px)');

    const handleCategorySelect = (category) => {
        setSelectedCategory(category);
        console.log(category);
    };

    const handleGetCategoryItems = () => {
        getListCategoryByMarket(market.marketNo, selectedCategory).then(data => {
            setCategoryItems(data);
            console.log(data);
        }).catch(error => {
            console.error("상품 카테고리 조회에 실패했습니다.", error);
        });
    };

    const handleGetTopFiveItems = (itemName) => {
        getListTopFiveItem(market.marketNo, itemName).then(data => {
                setItems(data);
                console.log(data);
            }).catch(error => {
            console.error("TOP 5 상품 조회에 실패했습니다.", error);
        });
    };

    const GoShopPage = (shopNo) => {
        getShopOne(shopNo).then(data => {
            navigate('/shop-detail', {state: data});
            }).catch(error => {
            console.error("상점 조회에 실패했습니다.", error);
        });
    };

    const GoItemPage = (shopNo, itemNo) => {
        getItemByShop(shopNo, itemNo).then(data => {
            navigate('/item-detail', {state: data});
        }).catch(error => {
            console.error("상품 조회에 실패했습니다.", error);
        });
    };

    useEffect(() => {
        if (selectedCategory) {
            handleGetCategoryItems(0);
        }
    }, [selectedCategory]);

    return (
        <DashboardLayout>
            <MDBox pt={3} pb={3}
                   sx={{display: 'flex', justifyContent: 'center'}}>
                <Card sx={{
                    width: isSmallScreen? '75%':'50%',
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    padding: isSmallScreen? '10px 30px':'10px 20px',
                }}> <MDTypography fontWeight="bold"
                                  sx={{fontSize: '1.5rem', pb:3, pt:3}}
                                  variant="body2">
                    원하시는 상품의 카테고리를 먼저 선택해주세요!
                </MDTypography>

                </Card>
            </MDBox>

            {/* 카테고리 */}
            <Grid container spacing={1} justifyContent="center">
                {["과일", "채소", "육류", "생선"].map((category) => (
                    <Grid item xs={3} md={1.0} key={category}>
                        <MDBox>
                            <MDButton
                                onClick={() => handleCategorySelect(category)}
                                variant="gradient"
                                size="large"
                                sx={{
                                    backgroundColor: '#50bcdf',
                                    color: '#ffffff',
                                    fontSize: '1.5rem',
                                    padding: isSmallScreen? '10px 30px':'10px 20px',
                                    fontFamily: 'JalnanGothic'
                                }}
                            >
                                {category}
                            </MDButton>
                        </MDBox>
                    </Grid>
                ))}
            </Grid>

            {/* 카테고리 상품 목록 조회 */}
            <Grid container pt={3} pb={2}>
                {selectedCategory && categoryItems.length === 0 ? (
                    <MDBox pt={3} pb={3} textAlign="center">
                        <MDTypography variant="body2" color="textSecondary">
                            선택한 카테고리 내 상품이 존재하지 않습니다.
                        </MDTypography>
                    </MDBox>
                ) : (
                    categoryItems.map((item, index) => (
                        <Grid item xs={3} sm={3} md={2} lg={2} key={index}>
                            <MDBox pt={1} pb={1} px={1} key={item.id}>
                                <Card>
                                    <MDBox pt={2} pb={2} px={3}>
                                        <Grid container>
                                            <Grid item xs={12}>
                                                <MDTypography fontWeight="bold"
                                                              onClick={() => handleGetTopFiveItems(
                                                                  item.itemName)}
                                                              sx={{cursor: 'pointer'}} // Added cursor pointer for better UX
                                                              variant="body2">
                                                    {item.itemName}
                                                </MDTypography>
                                            </Grid>
                                        </Grid>
                                    </MDBox>
                                </Card>
                            </MDBox>
                        </Grid>
                    ))
                )}
            </Grid>

            {/* TOP 5 상품 목록 조회 */}

            <Grid container pt={1} pb={3} justifyContent="center">
                {items && items.length > 0 ? (
                    <>
                        {/* TOP 5 목록 텍스트 */}
                        <MDBox pt={3} pb={3} sx={{ textAlign: 'center', width: '100%', fontSize: '2.5rem' }}>
                            <MDTypography fontWeight="bold">
                                TOP 5 상품 목록
                            </MDTypography>
                        </MDBox>

                        {/* 상품 목록 */}
                        {items.map((item, index) => (
                            <Grid item xs={12} sm={12} md={2.4} lg={2} key={index}>
                                <MDBox pt={1} pb={1} px={1} key={item.id}>
                                    <Card>
                                        <MDBox pt={2} pb={2} px={3}>
                                            <Grid container>
                                                <Grid item xs={4.5}>
                                                    <MDTypography fontWeight="bold" variant="body2">
                                                        {item.rank}
                                                    </MDTypography>
                                                </Grid>
                                                <Grid item xs={7.5}>
                                                    <MDTypography variant="body2" textAlign="right"
                                                                  onClick={() => GoShopPage(item.shopNo)}
                                                                  sx={{cursor: 'pointer'}}
                                                    >
                                                        {item.shopName}
                                                    </MDTypography>
                                                    <MDTypography variant="body2" textAlign="right"
                                                                  onClick={() => GoItemPage(item.shopNo, item.itemNo)}
                                                                  sx={{cursor: 'pointer'}}
                                                    >
                                                        {item.price}원
                                                    </MDTypography>
                                                </Grid>
                                            </Grid>
                                        </MDBox>
                                    </Card>
                                </MDBox>
                            </Grid>
                        ))}
                    </>
                ) : (
                    <p></p>
                )}
            </Grid>
        </DashboardLayout>
    );
}

export default TopFiveItem;