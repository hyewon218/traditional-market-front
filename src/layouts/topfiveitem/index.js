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
import {getListCategoryByMarket, getListTopFiveItem} from "../../api/itemApi";

function TopFiveItem() {
    const {state} = useLocation();
    const market = state; // 전달된 market 데이터를 사용

    const [items, setItems] = useState([]);

    /*시장 카테고리*/
    const [selectedCategory, setSelectedCategory] = useState('');
    const [categoryItems, setCategoryItems] = useState([]);

    const navigate = useNavigate();

    const handleDetail = (item) => { // 상품 상세 페이지
        console.log('handleDetail');
        navigate('/item-detail', {state: item});
    };

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
        getListTopFiveItem(market.marketNo, itemName).then(
            data => {
                setItems(data);
                console.log(data);
            }).catch(error => {
            console.error("TOP 5 상품 조회에 실패했습니다.", error);
        });
    };

    useEffect(() => {
        if (selectedCategory) {
            handleGetCategoryItems(0);
        }
    }, [selectedCategory]);

    return (
        <DashboardLayout>
            {/* 시장 검색 */}
            <MDBox pt={5} pb={5}
                   sx={{display: 'flex', justifyContent: 'center'}}>
                <Card sx={{
                    width: '50%',
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center'
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
                    <Grid item xs={1.0} key={category}>
                        <MDBox>
                            <MDButton
                                onClick={() => handleCategorySelect(category)}
                                variant="gradient"
                                size="large"
                                sx={{
                                    backgroundColor: '#50bcdf',
                                    color: '#ffffff',
                                    fontSize: '1.0rem',
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
            <Grid container pt={3} pb={3}>
                {selectedCategory && categoryItems.length === 0 ? (
                    <MDBox pt={3} pb={3} textAlign="center">
                        <MDTypography variant="body2" color="textSecondary">
                            선택한 카테고리 내 상품이 존재하지 않습니다.
                        </MDTypography>
                    </MDBox>
                ) : (
                    categoryItems.map((item) => (
                        <MDBox pt={2} pb={2} px={3} key={item.id}>
                            <Card>
                                <MDBox pt={2} pb={2} px={3}>
                                    <Grid container>
                                        <Grid item xs={6}>
                                            <MDTypography fontWeight="bold"
                                                          onClick={() => handleGetTopFiveItems(item.itemName)}
                                                          sx={{ cursor: 'pointer' }} // Added cursor pointer for better UX
                                                          variant="body2">
                                                {item.itemName}
                                            </MDTypography>
                                        </Grid>
                                    </Grid>
                                </MDBox>
                            </Card>
                        </MDBox>
                    ))
                )}
            </Grid>

            {/* TOP 5 상품 목록 조회 */}
            <Grid container pt={3} pb={3}>
                {items && items.length > 0 ? (
                    items.map((item) => (
                        <MDBox pt={2} pb={2} px={3} key={item.id}>
                            <Card>
                                <MDBox pt={2} pb={2} px={3}>
                                    <Grid container>
                                        <Grid item xs={6}>
                                            <MDTypography fontWeight="bold"
                                                          variant="body2">
                                                {item.rank}
                                            </MDTypography>
                                        </Grid>
                                        <Grid item xs={6}>
                                            <MDTypography variant="body2"
                                                          textAlign="right">
                                                {item.shopName}
                                            </MDTypography>
                                            <MDTypography variant="body2"
                                                          textAlign="right">
                                                {item.price}
                                            </MDTypography>
                                        </Grid>
                                    </Grid>
                                </MDBox>
                            </Card>
                        </MDBox>
                    ))
                ) : (
                    <p></p>
                )}
            </Grid>
        </DashboardLayout>
    );
}

export default TopFiveItem;