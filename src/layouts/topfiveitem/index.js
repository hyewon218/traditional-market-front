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
import {useEffect, useRef, useState} from 'react';
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

    const topFiveRef = useRef(null);  // 스크롤할 TOP 5 영역에 대한 ref 생성


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
            // 데이터가 로드된 후, 스크롤을 TOP 5 목록으로 이동
            if (topFiveRef.current) {
                topFiveRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
            }).catch(error => {
            console.error("스크롤 이동에 실패했습니다.", error);
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
            <MDBox pb={3}
                   sx={{display: 'flex', justifyContent: 'center', mt: {xs:-1, sm:5, md:7, lg:1},}}>
                <Card sx={{
                    width: isSmallScreen? '75%':'50%',
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    padding: isSmallScreen? '1px 20px':'10px 20px',
                }}> <MDTypography fontWeight="bold"
                                  sx={{fontSize: isSmallScreen? '1.0rem':'1.5rem', pb:3, pt:3}}
                                  variant="body2">
                    원하시는 상품의 카테고리를 먼저 선택해주세요!
                </MDTypography>

                </Card>
            </MDBox>

            {/* 카테고리 */}
            <Grid container spacing={isSmallScreen ? 1 : 1} justifyContent="center">
                {["과일", "채소", "육류", "생선"].map((category) => (
                    <Grid item xs={3} sm={3} md={2} lg={1} key={category}>
                        <MDBox>
                            <MDButton
                                onClick={() => handleCategorySelect(category)}
                                variant="gradient"
                                size="large"
                                sx={{
                                    backgroundColor: '#50bcdf',
                                    color: '#ffffff',
                                    fontSize: isSmallScreen? '1.0rem':'1.5rem',
                                    padding: isSmallScreen? '2px 4px':'10px 20px',
                                    fontFamily: 'JalnanGothic',
                                    width: '100%',
                                    lineHeight: 2,  // 줄 간격을 줄여 높이를 감소시킴
                                    minHeight: 'auto' // 기본적으로 적용되는 높이를 없앰
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
                        <Grid item xs={4} sm={3} md={3} lg={2} key={index}>
                            <MDBox pt={1} pb={1} px={1} sx={{ textAlign: 'center'}} key={item.id}>
                                <Card>
                                    <MDBox pt={2} pb={2} px={1}>
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
            <Grid container pt={1} pb={10} justifyContent="center">
                {items && items.length > 0 ? (
                    <>
                        {/* TOP 5 목록 텍스트 */}
                        <MDBox pt={3} pb={3} sx={{ textAlign: 'center', width: '100%', fontSize: '2.5rem' }} ref={topFiveRef}>
                            <MDTypography fontWeight="bold">
                                TOP 5 상품 목록
                            </MDTypography>
                        </MDBox>

                        {/* 상품 목록 */}
                        {items.map((item, index) => (
                            <Grid item xs={12} sm={12} md={12} lg={2} key={index}>
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