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
import {useLocation} from 'react-router-dom';

// @mui material components
import Grid from '@mui/material/Grid';
import Card from '@mui/material/Card';
import KeyboardArrowLeftIcon from '@mui/icons-material/KeyboardArrowLeft';
import KeyboardArrowRightIcon from '@mui/icons-material/KeyboardArrowRight';

// Material Dashboard 2 React components
import MDBox from '../../components/MD/MDBox';
import MDTypography from '../../components/MD/MDTypography';
import MDButton from '../../components/MD/MDButton';
import MDPagination from '../../components/MD/MDPagination';

// Material Dashboard 2 React example components
import DashboardLayout from '../../examples/LayoutContainers/DashboardLayout';

import Button from "@mui/material/Button";
import {useNavigate} from "react-router";
import useCustomLogin from "../../hooks/useCustomLogin";
import {
    cancelMarketLike,
    deleteMarket, getMarketLike,
    postMarketLike,
} from "../../api/marketApi";
import {getShopList, getListCategory} from "../../api/shopApi";
import FetchingModal from "../../components/common/FetchingModal";
import ResultModal from "../../components/common/ResultModal";
import MapComponent from "../../components/map/MapComponent";

const categoryMapping = {
    "전체 👨🏻‍🌾": 'ALL',
    "농산물 🌾": 'AGRI',
    "수산물 🐟": 'MARINE',
    "축산물 🐂": 'LIVESTOCK',
    "청과물 🍓": 'FRUITS',
    "가공식품 🍱": 'PROCESSED',
    "떡•방앗간 🍡": 'RICE',
    "음식점 🧑🏻‍🍳": 'RESTAURANT',
    "반찬 🥗": 'SIDEDISH',
    "잡화•의류 👗": 'STUFF',
    "기타•마트 🧺": 'ETC',
};

function MarketDetail() {
    const {isAdmin, isAuthorization} = useCustomLogin()
    const {state} = useLocation();
    const market = state; // 전달된 market 데이터를 사용

    const [shopPage, setShopPage] = useState(0);

    const [likes, setLikes] = useState(market.likes);
    const [liked, setLiked] = useState(false); // 좋아요 여부 확인
    const [shops, setShops] = useState([]);
    const [shopTotalPage, setShopTotalPage] = useState(0);

    const [fetching, setFetching] = useState(false)
    const [result, setResult] = useState(null)

    const [selectedCategory, setSelectedCategory] = useState(''); // 선택된 카테고리
    const [filteredShops, setFilteredShops] = useState([]); // 시장 카테고리 조회
    const [categoryTotalPage, setCategoryTotalPage] = useState(0); // 검색 시장 조회 페이지
    const [isCategoryFiltered, setIsCategoryFiltered] = useState(false);// 카테고리 필터 활성화되었는지 확인

    const navigate = useNavigate();

    const handleModifyMarket = (market) => {
        console.log('handleModify');
        navigate('/modify-market', {state: market});
    };

    const handleDeleteMarket = (mno) => {
        console.log('handleDelete');
        setFetching(true)
        deleteMarket(mno).then(data => {
            setFetching(false) //데이터 가져온 후 화면에서 사라지도록
            setResult(data)
        }).catch(error => {
            console.error("시장 삭제에 실패했습니다.", error);
            setResult({success: false, message: "시장 삭제에 실패했습니다."});
        });
    };

    const handleAddShop = (market) => {
        console.log('handleAddShop');
        navigate('/post-shop', {state: market})
    };

    const changeShopPage = (pageNum) => {
        console.log('change pages');
        console.log(pageNum);
        console.log(shopPage);
        setShopPage(pageNum);
        handleGetShops(pageNum);
    };

    const handleDetail = (shop) => {
        console.log('handleDetail');
        console.log("shop!!!!!!!!!!!" + shop);
        navigate('/shop-detail', {state: shop});
    };

    // 시장 좋아요 및 좋아요 취소
    const handlePostOrCancelLike = () => {
        if (!isAuthorization) {
            alert("로그인이 필요합니다.");
            return;
        }

        if (liked) {
            cancelMarketLike(market.marketNo).then(data => {
                console.log('좋아요 취소 성공!!!');
                setLiked(false);
                setLikes(prev => prev - 1); // Update likes count
            }).catch(error => {
                console.error("좋아요 취소에 실패했습니다.", error);
            });
        } else {
            postMarketLike(market.marketNo).then(data => {
                console.log('좋아요 성공!!!');
                setLiked(true);
                setLikes(prev => prev + 1); // Update likes count
            }).catch(error => {
                console.error("시장 좋아요에 실패했습니다.", error);
            });
        }
    };

    const handleLikeCounts = () => {
        setLikes(market.likes);
    };

    const handleCheckLike = () => {
        getMarketLike(market.marketNo).then(data => {
            console.log('좋아요 상태 확인 성공!!!');
            setLiked(data); // 좋아요 true, false 확인
        }).catch(error => {
            console.error("좋아요 상태 확인에 실패했습니다.", error);
        });
    };

    // 시장 내 상점 목록
    const handleGetShops = (pageNum) => {
        console.log('handleGetShops');
        const pageParam = {page: pageNum, size: 8};
        getShopList(market.marketNo, pageParam).then(data => {
            console.log('상점 조회 성공!!!');
            console.log(data);
            setShops(data.content);
            setShopTotalPage(data.totalPages);
            setSelectedCategory('');
            setIsCategoryFiltered(false); // Reset filter
        }).catch(error => {
            console.error("상점 조회에 실패했습니다.", error);
        });
    };

    /*카테고리 조회*/
    const handleCategorySelect = (category) => {
        if (category === "전체 👨🏻‍🌾") {
            handleGetShops(0);
        } else {
            const mappedCategory = categoryMapping[category] || '';
            setSelectedCategory(mappedCategory);
            console.log("mappedCategory!???!?" + mappedCategory);
            setIsCategoryFiltered(true); // Set filter active
        }
    };

    const handleGetCategoryShops = (pageNum) => { // 시장 내 상점 카테고리 조회
        console.log('handleGetCategoryShops');
        //console.log('Selected Category:', selectedCategory); // Debugging line
        const pageParam = {page: pageNum, size: 8};
        getListCategory(pageParam, selectedCategory).then(data => {
            setFilteredShops(data.content);
            setCategoryTotalPage(data.totalPages);
        }).catch(error => {
            console.error("시장 카테고리 조회에 실패했습니다.", error);
        });
    };

    // 시장 내 상점 목록
    const handleGetTopFiveItemPage = () => {
        navigate('/top-five-item', {state: market});
    };

    const closeModal = () => { //ResultModal 종료
        setResult(null)
        navigate('/market')
    }

    const buttonStyle = {
        backgroundColor: '#50bcdf',
        color: '#ffffff',
        fontSize: '1rem',
        fontFamily: 'JalnanGothic',
        padding: '10px 40px',
        width: '300px',
    };

    useEffect(() => {
        handleLikeCounts();
        handleGetShops(); // Initially fetch all shops
        handleCheckLike();
    }, []);

    useEffect(() => {
        if (isCategoryFiltered && selectedCategory) {
            handleGetCategoryShops(0);
        } else {
            handleGetShops(shopPage); // Fetch shops without category filter if not active
        }
    }, [selectedCategory, isCategoryFiltered]);

    // 카테고리 내 상점이 없으면 페이지네이션 안 보이도록
    const shouldShowPagination = !isCategoryFiltered || filteredShops.length > 0;

    return (
        <DashboardLayout>
            {fetching ? <FetchingModal/> : <></>}

            {result ?
                <ResultModal
                    title={'시장 삭제 결과'}
                    content={`삭제 완료`}
                    callbackFn={closeModal}
                />
                : <></>
            }
            <Grid container spacing={2}>
                <Grid item xs={6}>
                    <MDBox pt={3} pb={3}>
                        <Card>
                            <MDBox pt={4} pb={3} px={3}>
                                <Grid container>
                                    <Grid item xs={6}>
                                        <MDTypography fontWeight="bold"
                                                      variant="body2">
                                            {market.marketName}
                                        </MDTypography>
                                    </Grid>
                                    <Grid item xs={6}>
                                        <MDTypography variant="body2"
                                                      textAlign="right">
                                            {market.marketAddr}
                                        </MDTypography>
                                    </Grid>
                                </Grid>
                                <div
                                    className="w-full justify-center flex flex-col m-auto items-center">
                                    {market.imageList.map((img, i) =>
                                        <img
                                            alt="product" key={i}
                                            width={300}
                                            src={`${img.imageUrl}`}/>
                                    )}
                                </div>
                                <MDTypography
                                    variant="body2">{market.marketDetail}</MDTypography>
                                <MDTypography
                                    variant="body2">{likes} LIKES</MDTypography>
                                <Grid container>
                                    <Grid item xs={1.6}>
                                        <MDButton
                                            onClick={handlePostOrCancelLike}
                                            variant="gradient"
                                            sx={{fontFamily: 'JalnanGothic'}}
                                            color="info">좋아요 👍🏻
                                        </MDButton>
                                    </Grid>


                                    {isAdmin && ( // 관리자일 때 버튼 생성
                                        <>
                                            <Grid item xs={1.6}>
                                                <MDButton
                                                    variant="gradient"
                                                    color="light"
                                                    sx={{fontFamily: 'JalnanGothic'}}
                                                    onClick={() => handleModifyMarket(
                                                        market)}>시장 수정
                                                </MDButton>
                                            </Grid>
                                            <Grid item xs={1.6}>
                                                <MDButton
                                                    variant="gradient"
                                                    color="light"
                                                    sx={{fontFamily: 'JalnanGothic'}}
                                                    onClick={() => handleDeleteMarket(
                                                        market.marketNo)}>시장 삭제
                                                </MDButton>
                                            </Grid>
                                            <Grid item xs={2.7}>
                                                <MDButton
                                                    variant="gradient"
                                                    color="success"
                                                    sx={{fontFamily: 'JalnanGothic'}}
                                                    onClick={() => handleAddShop(
                                                        market)}>상점 추가
                                                </MDButton>
                                            </Grid>
                                        </>
                                    )}
                                    <Grid item xs={4.5}>
                                        <div style={{
                                            display: 'flex',
                                            justifyContent: 'center'
                                        }}>
                                            <MDButton
                                                onClick={handleGetTopFiveItemPage}
                                                variant="gradient"
                                                sx={buttonStyle}
                                                color="warning">🔥상품별 가격 순위
                                                확인
                                            </MDButton>
                                        </div>
                                    </Grid>
                                </Grid>
                            </MDBox>
                        </Card>
                    </MDBox>
                </Grid>

                {/*지도*/}
                <Grid item xs={6}>
                    <MDBox pt={3} pb={3}>
                        <Card>
                            <MDBox component="form" role="form">
                                <MapComponent marketAddr={market.marketAddr}
                                              marketName={market.marketName}/>
                            </MDBox>
                        </Card>
                    </MDBox>
                </Grid>
            </Grid>

            {/*카테고리*/}
            <Grid container spacing={1} justifyContent="center">
                {Object.keys(categoryMapping).map((displayCategory, index) => (
                    <Grid item
                          xs={index === 0 ? 0.9 : index === 1 ? 1.0
                              : index === 2 ? 1.0 : index === 3 ? 1.0
                                  : index === 4 ? 1.0 : index === 5 ? 1.1
                                      : index === 6 ? 1.2 : index === 7 ? 0.9
                                          : index === 8 ? 0.9 : index === 9
                                              ? 1.2 : 1.2}
                          key={displayCategory}>
                        <MDBox>
                            <MDButton
                                onClick={() => handleCategorySelect(
                                    displayCategory)}
                                variant="gradient"
                                size="large"
                                sx={{
                                    backgroundColor: '#50bcdf',
                                    color: '#ffffff',
                                    fontSize: '1.28rem',
                                    fontFamily: 'JalnanGothic'
                                }}
                            >
                                {displayCategory}
                            </MDButton>
                        </MDBox>
                    </Grid>
                ))}
            </Grid>

            {/* 시장 내 상점 목록 */}
            <Grid container pt={3} pb={3}>
                {(isCategoryFiltered && filteredShops.length === 0) ? (
                    <Grid item xs={12}>
                        <MDTypography variant="body2" textAlign="center" sx={{fontSize: '1.28rem', pt:2}}>
                            선택한 카테고리 내 상점이 존재하지 않습니다.
                        </MDTypography>
                    </Grid>
                ) : (
                    (isCategoryFiltered ? filteredShops : shops).map((shop) => (
                        <MDBox pt={2} pb={2} px={3} key={shop.shopNo}>
                            <Card>
                                <MDBox pt={2} pb={2} px={3}>
                                    <Grid container>
                                        <Grid item xs={6}>
                                            <MDTypography fontWeight="bold"
                                                          variant="body2">
                                                {shop.shopName}
                                            </MDTypography>
                                        </Grid>
                                        <Grid item xs={6}>
                                            <MDTypography variant="body2"
                                                          textAlign="right">
                                                {shop.tel}
                                            </MDTypography>
                                        </Grid>
                                    </Grid>
                                    <MDTypography variant="body2">
                                        {shop.sellerName}
                                    </MDTypography>
                                    <Grid container>
                                        <Grid item xs={10}></Grid>
                                        <Grid item xs={1}>
                                            <Button onClick={() => handleDetail(
                                                shop)}>
                                                Detail
                                            </Button>
                                        </Grid>
                                    </Grid>
                                    <div
                                        className="w-full justify-center flex flex-col m-auto items-center">
                                        {shop.imageList.map((imgUrl, i) => (
                                            <img alt="product" key={i}
                                                 width={300}
                                                 src={`${imgUrl.imageUrl}`}/>
                                        ))}
                                    </div>
                                </MDBox>
                            </Card>
                        </MDBox>
                    ))
                )}
            </Grid>

            {shouldShowPagination && (
                <MDPagination>
                    <MDPagination item>
                        <KeyboardArrowLeftIcon/>
                    </MDPagination>
                    {[...Array(isCategoryFiltered ? categoryTotalPage
                        : shopTotalPage).keys()].map((i) => (
                        <MDPagination item key={i}
                                      onClick={() => isCategoryFiltered
                                          ? handleGetCategoryShops(i)
                                          : changeShopPage(i)}>
                            {i + 1}
                        </MDPagination>
                    ))}
                    <MDPagination item>
                        <KeyboardArrowRightIcon/>
                    </MDPagination>
                </MDPagination>
            )}
        </DashboardLayout>
    );
}

export default MarketDetail;
