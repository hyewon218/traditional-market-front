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
import { useEffect, useState } from 'react';
import axios from 'axios';

// @mui material components
import Card from '@mui/material/Card';
import { FormControl, InputLabel, Select, MenuItem } from "@mui/material";

// Material Dashboard 2 React components
import MDBox from '../../../components/MD/MDBox';
import MDTypography from '../../../components/MD/MDTypography';

// Material Dashboard 2 React example components
import DashboardLayout from '../../../examples/LayoutContainers/DashboardLayout';

// Data
import { getCountMembers, getCountMarkets, getCountShops, getCountShopsByMarket, getTodayVisitor, getTotalVisitor } from "../../../api/adminApi";
import { getList } from "../../../api/marketApi";

function Outline() {
    const [countMembers, setCountMembers] = useState(0);
    const [countMarkets, setCountMarkets] = useState(0);
    const [countShops, setCountShops] = useState(0);
    const [countTodayVisitors, setCountTodayVisitors] = useState(0);
    const [countTotalVisitors, setCountTotalVisitors] = useState(0);
    const [markets, setMarkets] = useState([]);
    const [selectedMarket, setSelectedMarket] = useState('');
    const [marketShopCount, setMarketShopCount] = useState('시장을 선택하세요');

    const fetchCountMembers = () => {
        getCountMembers().then(data => {
            setCountMembers(data);
        }).catch(error => {
            console.error("총 회원 수를 불러오는 데 실패했습니다.", error);
        });
    }

    const fetchCountMarkets = () => {
        getCountMarkets().then(data => {
            setCountMarkets(data);
        }).catch(error => {
            console.error("총 시장 수를 불러오는 데 실패했습니다.", error);
        });
    }

    const fetchCountShops = () => {
        getCountShops().then(data => {
            setCountShops(data);
        }).catch(error => {
            console.error("총 상점 수를 불러오는 데 실패했습니다.", error);
        });
    }

    const fetchMarkets = (pageNum = 0) => {
        const pageParam = { page: pageNum, size: 100 }; // size는 드롭다운에서 출력될 시장 개수
        getList(pageParam).then(data => {
            setMarkets(data.content);
        }).catch(error => {
            console.error("시장 목록을 가져오는 데 실패했습니다.", error);
        });
    }

    const fetchMarketShopCount = (marketNo) => {
        getCountShopsByMarket(marketNo).then(data => {
            setMarketShopCount(data);
        }).catch(error => {
            console.error("시장별 상점 수를 가져오는 데 실패했습니다.", error);
        });
    }

    const fetchCountTodayVisitors = () => {
        getTodayVisitor().then(data => {
            setCountTodayVisitors(data);
        }).catch(error => {
            console.error("오늘의 방문자 수를 불러오는 데 실패했습니다.", error);
        });
    }

    const fetchCountTotalVisitors = () => {
        getTotalVisitor().then(data => {
            setCountTotalVisitors(data);
        }).catch(error => {
            console.error("총 방문자 수를 불러오는 데 실패했습니다.", error);
        });
    }

    useEffect(() => {
        fetchCountMembers();
        fetchCountMarkets();
        fetchCountShops();
        fetchMarkets();
        fetchCountTodayVisitors();
        fetchCountTotalVisitors();
    }, []);

    const handleMarketChange = (event) => {
        const marketNo = event.target.value;
        setSelectedMarket(marketNo);

        if (marketNo) {
            fetchMarketShopCount(marketNo);
        } else {
            setMarketShopCount('선택된 시장 없음');
        }
    };

    return (
        <DashboardLayout>
            <MDBox pt={3} pb={3}>
                <MDTypography fontWeight="bold" sx={{ fontSize: '2.5rem' }} variant="body2">
                    홈페이지 현황
                </MDTypography>

                <MDBox pt={3} pb={3}>
                    <Card>
                        <MDBox pt={2} pb={3} px={3}>
                            <div className="memberList-contents">
                                <MDTypography fontWeight="bold" variant="body2">
                                    총 회원 수 : {countMembers}
                                </MDTypography>
                                <MDTypography fontWeight="bold" variant="body2">
                                    총 시장 수 : {countMarkets}
                                </MDTypography>
                                <MDTypography fontWeight="bold" variant="body2">
                                    총 상점 수 : {countShops}
                                </MDTypography>
                                <MDTypography fontWeight="bold" variant="body2">
                                    오늘의 방문자 수 : {countTodayVisitors}
                                </MDTypography>
                                <MDTypography fontWeight="bold" variant="body2">
                                    총 방문자 수 : {countTotalVisitors}
                                </MDTypography>

                                <MDBox mb={2} mt={2}>
                                    <FormControl fullWidth>
                                        <InputLabel id="market-label">시장 선택</InputLabel>
                                        <Select
                                            labelId="market-label"
                                            value={selectedMarket}
                                            onChange={handleMarketChange}
                                            sx={{ minHeight: 56 }}
                                            MenuProps={{
                                                PaperProps: {
                                                    style: {
                                                        maxHeight: 224, // 메뉴 최대 높이 설정
                                                    },
                                                },
                                            }}
                                        >
                                            <MenuItem value="">
                                                <em>선택하세요</em>
                                            </MenuItem>
                                            {markets.map(market => (
                                                <MenuItem key={market.marketNo} value={market.marketNo}>
                                                    {market.marketName}
                                                </MenuItem>
                                            ))}
                                        </Select>
                                    </FormControl>
                                </MDBox>
                                <MDTypography fontWeight="bold" variant="body2">
                                    선택한 시장의 상점 수 : {marketShopCount}
                                </MDTypography>
                            </div>
                        </MDBox>
                    </Card>
                </MDBox>
            </MDBox>
        </DashboardLayout>
    );
}

export default Outline;
