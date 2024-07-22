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
import {deleteMarket, postMarketLike,} from "../../api/marketApi";
import {getShopList} from "../../api/shopApi";
import FetchingModal from "../../components/common/FetchingModal";
import ResultModal from "../../components/common/ResultModal";
import MapComponent from "../../components/map/MapComponent";

function MarketDetail() {
    const {loginState} = useCustomLogin()
    const [isAdmin, setIsAdmin] = useState(false);
    const {state} = useLocation();
    const market = state; // 전달된 market 데이터를 사용
    console.log(state);
    const [shopPage, setShopPage] = useState(0);

    const [likes, setLikes] = useState(0);
    const [shops, setShops] = useState([]);
    const [shopTotalPage, setShopTotalPage] = useState(0);

    const [fetching, setFetching] = useState(false)
    const [result, setResult] = useState(null)

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

    // 시장 좋아요
    const handlePostLike = () => {
        postMarketLike(market.marketNo).then(data => {
            console.log('좋아요 성공!!!');
            handleLikeCounts();
        }).catch(error => {
            console.error("시장 좋아요에 실패했습니다.", error);
        });
    };

    const handleLikeCounts = () => {
        setLikes(market.likes);
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
        }).catch(error => {
            console.error("상점 조회에 실패했습니다.", error);
        });
    };

    const handleGetAGRIShop = () => {
        navigate('/shop-AGRI-detail', {state: market});
    };
    const handleGetMARINEShop = () => {
        navigate('/shop-MARINE-detail', {state: market});
    };
    const handleGetLIVESTOCKShop = () => {
        navigate('/shop-LIVESTOCK-detail', {state: market});
    };
    const handleGetFRUITSShop = () => {
        navigate('/shop-FRUITS-detail', {state: market});
    };
    const handleGetPROCESSEDShop = () => {
        navigate('/shop-PROCESSED-detail', {state: market});
    };
    const handleGetRICEShop = () => {
        navigate('/shop-RICE-detail', {state: market});
    };
    const handleGetRESTAURANTShop = () => {
        navigate('/shop-RESTAURANT-detail', {state: market});
    };
    const handleGetSIDEDISHShop = () => {
        navigate('/shop-SIDEDISH-detail', {state: market});
    };
    const handleGetSTUFFShop = () => {
        navigate('/shop-STUFF-detail', {state: market});
    };
    const handleGetETCShop = () => {
        navigate('/shop-ETC-detail', {state: market});
    };

    const buttonStyle = {
        backgroundColor: '#50bcdf',
        color: '#ffffff',
        fontSize: '1.28rem',
        fontFamily: 'JalnanGothic'
    };

    const closeModal = () => { //ResultModal 종료
        setResult(null)
        navigate('/market')
        //moveToList({page: 1}) //모달 창이 닫히면 이동
    }

    useEffect(() => {
        const isAdmin = loginState.role === 'ADMIN';
        setIsAdmin(isAdmin); // setIsAdmin 을 사용하여 상태를 업데이트

        handleLikeCounts();
        handleGetShops();
    }, []);

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
                                <MDButton onClick={handlePostLike}
                                          variant="gradient"
                                          color="info">좋아요 👍🏻
                                </MDButton>
                                {isAdmin && ( // 관리자일 때 버튼 생성
                                    <>
                                        <MDButton
                                            variant="gradient"
                                            color="warning"
                                            onClick={() => handleModifyMarket(
                                                market)}>시장 수정
                                        </MDButton>
                                        <MDButton
                                            variant="gradient"
                                            color="warning"
                                            onClick={() => handleDeleteMarket(
                                                market.marketNo)}>시장 삭제
                                        </MDButton>
                                        <MDButton
                                            variant="gradient"
                                            color="success"
                                            onClick={() => handleAddShop(
                                                market)}>상점 추가
                                        </MDButton>
                                    </>
                                )}
                            </MDBox>
                        </Card>
                    </MDBox>
                </Grid>

                {/*지도*/}
                <Grid item xs={6}>
                    <MDBox pt={3} pb={3}>
                        <Card>
                            <MDBox component="form" role="form">
                                <MapComponent marketAddr={market.marketAddr} marketName={market.marketName} />
                            </MDBox>
                        </Card>
                    </MDBox>
                </Grid>
            </Grid>

            {/*카테고리*/}
            <Grid container spacing={1} justifyContent="center">
                <Grid item xs={1.0}>
                    <MDButton onClick={handleGetAGRIShop}
                              variant="gradient"
                              size="large"
                              sx={buttonStyle}
                    >농산물 🌾
                    </MDButton>

                </Grid>
                <Grid item xs={1.0}>
                    <MDBox>
                        <MDButton onClick={handleGetMARINEShop}
                                  variant="gradient"
                                  size="large"
                                  sx={buttonStyle}
                        >수산물 🐟
                        </MDButton>
                    </MDBox>
                </Grid>
                <Grid item xs={1.0}>
                    <MDBox>
                        <MDButton onClick={handleGetLIVESTOCKShop}
                                  variant="gradient"
                                  size="large"
                                  sx={buttonStyle}
                        >축산물 🐂
                        </MDButton>
                    </MDBox>
                </Grid>
                <Grid item xs={1.0}>
                    <MDBox>
                        <MDButton onClick={handleGetFRUITSShop}
                                  variant="gradient"
                                  size="large"
                                  sx={buttonStyle}
                        >청과물 🍓
                        </MDButton>
                    </MDBox>
                </Grid>
                <Grid item xs={1.2}>
                    <MDBox>
                        <MDButton onClick={handleGetPROCESSEDShop}
                                  variant="gradient"
                                  size="large"
                                  sx={buttonStyle}
                        >가공식품 🍱
                        </MDButton>
                    </MDBox>
                </Grid>
                <Grid item xs={1.3}>
                    <MDBox>
                        <MDButton onClick={handleGetRICEShop}
                                  variant="gradient"
                                  size="large"
                                  sx={buttonStyle}
                        >떡•방앗간 🍡
                        </MDButton>
                    </MDBox>
                </Grid>
                <Grid item xs={1.0}>
                    <MDBox>
                        <MDButton onClick={handleGetRESTAURANTShop}
                                  variant="gradient"
                                  size="large"
                                  sx={buttonStyle}
                        >음식점 🧑🏻‍🍳
                        </MDButton>
                    </MDBox>
                </Grid>
                <Grid item xs={0.9}>
                    <MDBox>
                        <MDButton onClick={handleGetSIDEDISHShop}
                                  variant="gradient"
                                  size="large"
                                  sx={buttonStyle}
                        >반찬 🥗
                        </MDButton>
                    </MDBox>
                </Grid>
                <Grid item xs={1.2}>
                    <MDBox>
                        <MDButton onClick={handleGetSTUFFShop}
                                  variant="gradient"
                                  size="large"
                                  sx={buttonStyle}
                        >잡화•의류 👗
                        </MDButton>
                    </MDBox>
                </Grid>
                <Grid item xs={1.2}>
                    <MDBox>
                        <MDButton onClick={handleGetETCShop}
                                  variant="gradient"
                                  size="large"
                                  sx={buttonStyle}
                        >기타•마트 🧺
                        </MDButton>
                    </MDBox>
                </Grid>
            </Grid>

            {/* 시장 내 상점 목록 */}
            <Grid container pt={3} pb={3}>
                {shops.map((shop) => (
                    <MDBox pt={2} pb={2} px={3}>
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
                                <MDTypography
                                    variant="body2">{shop.sellerName}</MDTypography>
                                <Grid container>
                                    <Grid item xs={10}></Grid>
                                    <Grid item xs={1}>
                                        <Button onClick={() => handleDetail(
                                            shop)}>Detail</Button>
                                    </Grid>
                                </Grid>
                                <div
                                    className="w-full justify-center flex flex-col m-auto items-center">
                                    {shop.imageList.map((imgUrl, i) =>
                                        <img
                                            alt="product" key={i}
                                            width={300}
                                            src={`${imgUrl.imageUrl}`}/>
                                    )}
                                </div>
                            </MDBox>
                        </Card>
                    </MDBox>
                ))}
            </Grid>

            <MDPagination>
                <MDPagination item>
                    <KeyboardArrowLeftIcon></KeyboardArrowLeftIcon>
                </MDPagination>
                {[...Array(shopTotalPage).keys()].map((i) => (
                    <MDPagination item key={i}
                                  onClick={() => changeShopPage(i)}>
                        {i + 1}
                    </MDPagination>
                ))}
                <MDPagination item>
                    <KeyboardArrowRightIcon></KeyboardArrowRightIcon>
                </MDPagination>
            </MDPagination>
        </DashboardLayout>
    );
}

export default MarketDetail;
