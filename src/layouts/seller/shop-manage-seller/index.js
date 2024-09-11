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
import {useNavigate} from 'react-router-dom';
import {useMediaQuery} from '@mui/material';

import Card from '@mui/material/Card';
import MDBox from '../../../components/MD/MDBox';
import MDTypography from '../../../components/MD/MDTypography';
import DashboardLayout from '../../../examples/LayoutContainers/DashboardLayout';

// API 호출
import { getOne } from "../../../api/marketApi";
import { getShopListBySellerNo } from "../../../api/shopApi";

function ShopManageSeller() {
    const [currentPage, setCurrentPage] = useState(0); // 현재 페이지 상태
    const [sort, setSort] = useState("shopName,asc"); // 정렬 기준
    const [shops, setShops] = useState([]); // 상점 목록 상태
    const [totalPages, setTotalPages] = useState(0); // 전체 페이지 수

    const navigate = useNavigate();

    const categoryTranslations = {
        AGRI: '농산물',
        MARINE: '수산물',
        LIVESTOCK: '축산물',
        FRUITS: '과일',
        PROCESSED: '가공식품',
        RICE: '쌀',
        RESTAURANT: '식당',
        SIDEDISH: '반찬',
        STUFF: '잡화',
        ETC: '기타'
    };

    const marketNamesCache = {};

    const fetchMarketName = async (marketNo) => {
        if (marketNamesCache[marketNo]) {
            return marketNamesCache[marketNo];
        }

        try {
            const data = await getOne(marketNo);
            marketNamesCache[marketNo] = data.marketName;
            return data;
        } catch (error) {
            console.error("시장 정보 불러오기 오류:", error);
            marketNamesCache[marketNo] = '정보 없음';
            return '정보 없음';
        }
    };

    const loadMyShops = async () => {
        try {
            const pageParam = {
                page: currentPage,
                size: 7
            };

            const data = await getShopListBySellerNo({ pageParam, sort });

            const shopsWithMarketNames = await Promise.all(data.content.map(async (shop) => {
                const marketData = await fetchMarketName(shop.marketNo);
                const marketName = marketData.marketName;

                return {
                    ...shop,
                    marketName,
                    marketData,
                };
            }));

            setShops(shopsWithMarketNames);
            setTotalPages(data.totalPages);
        } catch (err) {
            console.error("판매자가 소유한 상점 목록 불러오기 오류: ", err);
        }
    };

    useEffect(() => {
        loadMyShops(); // 페이지 변경 시 상점 로드
    }, [currentPage]);

    const handleDetail = (shop) => {
        console.log('상점 상세로 이동 : ', shop);
        navigate('/shop-detail-seller', { state: shop });
    };

    const handleMarketDetail = (market) => {
        navigate('/market-detail', { state: market });
    };

    const handlePageClick = (page) => {
        setCurrentPage(page);
    };

    const renderPagination = () => {
        const pagination = [];
        const groupSize = 5;
        const currentGroup = Math.floor(currentPage / groupSize);
        const startPage = currentGroup * groupSize;
        const endPage = Math.min(startPage + groupSize - 1, totalPages - 1);

        pagination.push(
            <button
                key="first-group"
                style={styles.button}
                onClick={() => handlePageClick(0)}
            >
                처음
            </button>
        );

        pagination.push(
            <button
                key="prev"
                style={styles.button}
                disabled={currentPage === 0}
                onClick={() => handlePageClick(Math.max(currentPage - 1, 0))}
            >
                이전
            </button>
        );

        for (let i = startPage; i <= endPage; i++) {
            pagination.push(
                <button
                    key={i}
                    style={{ ...styles.button, ...(i === currentPage ? styles.active : {}) }}
                    onClick={() => handlePageClick(i)}
                >
                    {i + 1}
                </button>
            );
        }

        pagination.push(
            <button
                key="next"
                style={styles.button}
                disabled={currentPage >= totalPages - 1}
                onClick={() => handlePageClick(Math.min(currentPage + 1, totalPages - 1))}
            >
                다음
            </button>
        );

        pagination.push(
            <button
                key="last-group"
                style={styles.button}
                onClick={() => handlePageClick(totalPages - 1)}
            >
                끝
            </button>
        );

        return pagination;
    };

    const isMobile = useMediaQuery('(max-width:900px)');

    return (
        <DashboardLayout>
            <MDBox pt={3} pb={3}>
                <MDTypography fontWeight="bold" sx={{ fontSize: '2.5rem' }} variant="body2">
                    상점 관리(판매자 전용)
                </MDTypography>
                <MDTypography fontWeight="bold" sx={{ fontSize: '1.5rem', color: 'blue' }} variant="body2">
                    ※ 상점 정보 수정 및 상품 관리는 아래 상점 이름을 클릭해서 이용해주세요.
                </MDTypography>
                <MDTypography fontWeight="bold" sx={{ fontSize: '1.5rem', color: 'blue' }} variant="body2">
                    ※ 상점 추가는 관리자에게 문의해주세요.
                </MDTypography>
                <MDBox pt={3} pb={3}>
                    <Card style={styles.card}>
                        <MDBox pt={2} pb={3} px={3} sx={{ overflowX: 'auto' }}>
                            {shops.length === 0 ? (
                                <MDTypography style={styles.noShopsMessage} variant="body2">
                                    상점이 존재하지 않습니다.
                                </MDTypography>
                            ) : (
                                <div>
                                    {!isMobile ? (
                                        <table style={styles.table}>
                                            <thead>
                                            <tr>
                                                <th>
                                                    <MDTypography fontWeight="bold" variant="body2" sx={styles.th}>
                                                        상점 이름
                                                    </MDTypography>
                                                </th>
                                                <th>
                                                    <MDTypography fontWeight="bold" variant="body2" sx={styles.th}>
                                                        소속 시장
                                                    </MDTypography>
                                                </th>
                                                <th>
                                                    <MDTypography fontWeight="bold" variant="body2" sx={styles.th}>
                                                        판매자
                                                    </MDTypography>
                                                </th>
                                                <th>
                                                    <MDTypography fontWeight="bold" variant="body2" sx={styles.th}>
                                                        전화번호
                                                    </MDTypography>
                                                </th>
                                                <th>
                                                    <MDTypography fontWeight="bold" variant="body2" sx={styles.th}>
                                                        분류
                                                    </MDTypography>
                                                </th>
                                                <th>
                                                    <MDTypography fontWeight="bold" variant="body2" sx={styles.th}>
                                                        좋아요 수
                                                    </MDTypography>
                                                </th>
                                            </tr>
                                            </thead>
                                            <tbody>
                                            {shops.map((shop) => (
                                                <tr key={shop.shopNo}>
                                                    <td>
                                                        <MDTypography
                                                            sx={styles.td}
                                                            variant="body2"
                                                            onClick={() => handleDetail(shop)}
                                                            style={styles.clickable}
                                                        >
                                                            {shop.shopName}
                                                        </MDTypography>
                                                    </td>
                                                    <td>
                                                        <MDTypography
                                                            sx={styles.td}
                                                            variant="body2"
                                                            onClick={() => handleMarketDetail(shop.marketData)}
                                                            style={styles.clickable}
                                                        >
                                                            {shop.marketName}
                                                        </MDTypography>
                                                    </td>
                                                    <td>
                                                        <MDTypography sx={styles.td} variant="body2">
                                                            {shop.sellerName}
                                                        </MDTypography>
                                                    </td>
                                                    <td>
                                                        <MDTypography sx={styles.td} variant="body2">
                                                            {shop.tel}
                                                        </MDTypography>
                                                    </td>
                                                    <td>
                                                        <MDTypography sx={styles.td} variant="body2">
                                                            {categoryTranslations[shop.category] || shop.category}
                                                        </MDTypography>
                                                    </td>
                                                    <td>
                                                        <MDTypography sx={styles.td} variant="body2">
                                                            {shop.likes}
                                                        </MDTypography>
                                                    </td>
                                                </tr>
                                            ))}
                                            </tbody>
                                        </table>
                                    ) : (
                                        // 모바일 뷰에서는 리스트 형태로 출력
                                        shops.map((shop, index) => {
                                            const isLastItem = index === shops.length - 1;
                                            return (
                                                <div key={shop.shopNo} style={{
                                                    ...styles.mobileItem,
                                                    borderBottom: !isLastItem ? '1px solid #ddd' : 'none',
                                                    marginBottom: '10px' // Add spacing between items
                                                }}>
                                                    <MDTypography
                                                        onClick={() => handleDetail(shop)}
                                                        sx={{ ...styles.clickable, ...styles.mobileField }}
                                                        variant="body2">
                                                        상점 이름: {shop.shopName}
                                                    </MDTypography>
                                                    <MDTypography
                                                        onClick={() => handleMarketDetail(shop.marketData)}
                                                        sx={{ ...styles.clickable, ...styles.mobileField, marginTop: '5px' }}
                                                        variant="body2">
                                                        소속 시장: {shop.marketName}
                                                    </MDTypography>
                                                    <MDTypography sx={{ ...styles.mobileField, marginTop: '5px' }} variant="body2">
                                                        판매자: {shop.sellerName}
                                                    </MDTypography>
                                                    <MDTypography sx={{ ...styles.mobileField, marginTop: '5px' }} variant="body2">
                                                        전화번호: {shop.tel}
                                                    </MDTypography>
                                                    <MDTypography sx={{ ...styles.mobileField, marginTop: '5px' }} variant="body2">
                                                        분류: {categoryTranslations[shop.category] || shop.category}
                                                    </MDTypography>
                                                    <MDTypography sx={{ ...styles.mobileField, marginTop: '5px', marginBottom: '5px' }} variant="body2">
                                                        좋아요 수: {shop.likes}
                                                    </MDTypography>
                                                </div>
                                            );
                                        })
                                    )}
                                    <MDBox sx={styles.pagination}>
                                        {renderPagination()}
                                    </MDBox>
                                </div>
                            )}
                        </MDBox>
                    </Card>
                </MDBox>
            </MDBox>
        </DashboardLayout>
    );
}

// 스타일 정의
const styles = {
    card: {
        padding: '16px',
    },
    table: {
        width: '100%',
        borderCollapse: 'collapse',
        marginTop: '20px',
    },
    th: {
        fontWeight: 'bold',
        fontSize: '2.0rem',
        paddingBottom: '10px',
        borderBottom: '2px solid #ddd',
        textAlign: 'left',
    },
    td: {
        fontSize: '1.5rem',
        paddingBottom: '7px',
        textAlign: 'left',
        marginTop: 3,
    },
    clickable: {
        cursor: 'pointer',
        color: 'green',
    },
    pagination: {
        display: 'flex',
        justifyContent: 'center',
        marginTop: '20px',
    },
    button: {
        margin: '0 5px',
        padding: '5px 10px',
        cursor: 'pointer',
        borderRadius: '5px',
        backgroundColor: '#fff',
    },
    active: {
        backgroundColor: '#007bff',
        color: '#fff',
    },
    noShopsMessage: {
        textAlign: 'center',
        padding: '20px 0',
        fontSize: '1.2rem',
    },
};

export default ShopManageSeller;
