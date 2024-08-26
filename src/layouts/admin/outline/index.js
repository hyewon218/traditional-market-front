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

// @mui material components
import Card from '@mui/material/Card';
import {FormControl, InputLabel, MenuItem, Select} from "@mui/material";

// Material Dashboard 2 React components
import MDBox from '../../../components/MD/MDBox';
import MDTypography from '../../../components/MD/MDTypography';

// Material Dashboard 2 React example components
import DashboardLayout
    from '../../../examples/LayoutContainers/DashboardLayout';

// Data
import {
    getCountMarkets,
    getCountMembers,
    getCountShops,
    getCountShopsByMarket,
    getTodayVisitor,
    getTotalVisitor,
    getCountMembersByProviderType,
    getTotalSalesPrice,
    getMarketSalesSum
} from "../../../api/adminApi";
import {getList} from "../../../api/marketApi";

function Outline() {
    const [countMembers, setCountMembers] = useState(0);
    const [countMarkets, setCountMarkets] = useState(0);
    const [countShops, setCountShops] = useState(0);
    const [countTodayVisitors, setCountTodayVisitors] = useState(0);
    const [countTotalVisitors, setCountTotalVisitors] = useState(0);
    const [markets, setMarkets] = useState([]);
    const [selectedMarket, setSelectedMarket] = useState('');
    const [marketShopCount, setMarketShopCount] = useState('시장을 선택하세요');
    const [selectedMarketSales, setSelectedMarketSales] = useState('시장을 선택하세요'); // 선택된 시장의 매출액
    const [totalMarketSales, setTotalMarketSales] = useState(0); // 전체 시장의 총매출액
    const [providerCounts, setProviderCounts] = useState({
        NAVER: 0,
        GOOGLE: 0,
        KAKAO: 0,
    });

    const fetchCountMembers = () => {
        getCountMembers().then(data => {
            setCountMembers(data);
        }).catch(error => {
            console.error("총 회원 수를 불러오는 데 실패했습니다.", error);
        });
    }

    // 가입경로 별 회원 수
    const fetchCountProviderType = () => {
        getCountMembersByProviderType().then(data => {
            setProviderCounts({
                NAVER: data.NAVER || 0,
                GOOGLE: data.GOOGLE || 0,
                KAKAO: data.KAKAO || 0,
            });
        }).catch(error => {
            console.error("가입 경로별 회원 수를 불러오는 데 실패했습니다.", error);
        });
    }


    const fetchCountMarkets = () => {
        getCountMarkets().then(data => {
            setCountMarkets(data);
        }).catch(error => {
            console.error("총 시장 수를 불러오는 데 실패했습니다.", error);
        });
    }

    // 전체 시장의 매출 합계
    const fetchTotalMarketSales = () => {
        getMarketSalesSum().then(data => {
            setTotalMarketSales(data);
        }).catch(error => {
            console.error("전체 시장의 매출 합계를 불러오는 데 실패했습니다.", error);
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

    const handleMarketChange = (event) => {
        const marketNo = event.target.value;
        setSelectedMarket(marketNo);

        if (marketNo) {
            fetchMarketShopCount(marketNo);
            getTotalSalesPrice(marketNo).then(data => {
                setSelectedMarketSales(data);
            }).catch(error => {
                console.error("선택된 시장의 매출액을 불러오는 데 실패했습니다.", error);
            });
        } else {
            setMarketShopCount('선택된 시장 없음');
            setSelectedMarketSales('선택된 시장 없음');
        }
    };

    useEffect(() => {
        fetchCountMembers();
        fetchCountMarkets();
        fetchCountShops();
        fetchMarkets();
        fetchCountTodayVisitors();
        fetchCountTotalVisitors();
        fetchCountProviderType();
        fetchTotalMarketSales();
    }, []);

    return (
        <DashboardLayout>
            <MDTypography fontWeight="bold"
                          sx={{ml: 4, mt: 2, fontSize: '2rem'}}
                          variant="body2">
                홈페이지 현황
            </MDTypography>
            <MDBox pt={1} pb={2}>
                <MDBox pt={1} pb={2} px={3}>
                    <Card>
                        <MDBox pt={2} pb={3} px={3}>
                            <div className="memberList-contents">
                                <MDTypography fontWeight="bold" variant="body2">
                                    총 회원 수 : {countMembers}
                                </MDTypography>
                                <MDTypography fontWeight="bold" variant="body2">
                                    네이버 회원 수 : {providerCounts.NAVER}
                                </MDTypography>
                                <MDTypography fontWeight="bold" variant="body2">
                                    구글 회원 수 : {providerCounts.GOOGLE}
                                </MDTypography>
                                <MDTypography fontWeight="bold" variant="body2">
                                    카카오 회원 수 : {providerCounts.KAKAO}
                                </MDTypography>
                                <MDTypography fontWeight="bold" variant="body2">
                                    총 시장 수 : {countMarkets}
                                </MDTypography>
                                <MDTypography fontWeight="bold" variant="body2">
                                    총 상점 수 : {countShops}
                                </MDTypography>
                                <MDTypography fontWeight="bold" variant="body2">
                                    전체 시장 매출액 : {totalMarketSales} 원
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
                                <MDTypography fontWeight="bold" variant="body2">
                                    선택한 시장의 매출액 : {selectedMarketSales}
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
