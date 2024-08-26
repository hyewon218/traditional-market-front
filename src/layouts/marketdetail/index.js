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
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';


// Material Dashboard 2 React example components
import DashboardLayout from '../../examples/LayoutContainers/DashboardLayout';

import Button from "@mui/material/Button";
import {useNavigate} from "react-router";
import useCustomLogin from "../../hooks/useCustomLogin";
import {
    cancelMarketLike,
    deleteMarket,
    getMarketLike,
    getMarketLikeCount,
    postMarketLike,
} from "../../api/marketApi";
import {getListCategory, getShopList} from "../../api/shopApi";
import MapComponent from "../../components/map/MapComponent";
import ParkingModal from '../../components/common/ParkingModal'; // 주차장 모달
import TransportModal from '../../components/common/TransportModal'; // 대중교통 모달

const categoryMapping = {
    "전체": 'ALL',
    "농산물": 'AGRI',
    "수산물": 'MARINE',
    "축산물": 'LIVESTOCK',
    "청과물": 'FRUITS',
    "가공식품": 'PROCESSED',
    "떡•방앗간": 'RICE',
    "음식점": 'RESTAURANT',
    "반찬": 'SIDEDISH',
    "잡화•의류": 'STUFF',
    "기타": 'ETC',
};

/*const categoryMapping = {
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
};*/

function MarketDetail() {
    const {isAdmin, isAuthorization} = useCustomLogin()
    const {state} = useLocation();
    const market = state; // 전달된 market 데이터를 사용

    const [shopPage, setShopPage] = useState(0);

    const [likes, setLikes] = useState(market.likes);
    const [liked, setLiked] = useState(false); // 좋아요 여부 확인
    const [shops, setShops] = useState([]);
    const [shopTotalPage, setShopTotalPage] = useState(0);

    const [selectedCategory, setSelectedCategory] = useState(''); // 선택된 카테고리
    const [filteredShops, setFilteredShops] = useState([]); // 시장 카테고리 조회
    const [categoryTotalPage, setCategoryTotalPage] = useState(0); // 검색 시장 조회 페이지
    const [isCategoryFiltered, setIsCategoryFiltered] = useState(false);// 카테고리 필터 활성화되었는지 확인
    const [showParkingModal, setShowParkingModal] = useState(false); // 주차장 모달 상태
    const [showTransportModal, setShowTransportModal] = useState(false); // 대중교통 모달 상태
    const [showDirectionsModal, setShowDirectionsModal] = useState(false); // 길찾기 모달 상태
    const [showStartLocationModal, setShowStartLocationModal] = useState(false); // 출발지 입력 모달 상태
    const [startLocation, setStartLocation] = useState(''); // 출발지 입력값
    const [directionsType, setDirectionsType] = useState(''); // 도보, 대중교통, 자차 구분


    const navigate = useNavigate();

    useEffect(() => {
        handleCountLikes();
        handleGetShops();
        handleCheckLike();
    }, []);

    useEffect(() => {
        if (isCategoryFiltered && selectedCategory) {
            handleGetCategoryShops(0);
        } else {
            handleGetShops(shopPage); // Fetch shops without category filter if not active
        }
    }, [selectedCategory, isCategoryFiltered]);

    const handleModifyMarket = (market) => {
        console.log('handleModify');
        navigate('/modify-market', {state: market});
    };

    const handleDeleteMarket = (mno) => {
        console.log('handleDelete');
        deleteMarket(mno).then(data => {
        }).catch(error => {
            console.error("시장 삭제에 실패했습니다.", error);
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

    const handleCheckLike = () => {
        getMarketLike(market.marketNo).then(data => {
            console.log('좋아요 여부 확인 성공!!!');
            setLiked(data); // 좋아요 true, false 확인
        }).catch(error => {
            console.error("좋아요 여부 확인에 실패했습니다.", error);
        });
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

    const handleCountLikes = () => {
        getMarketLikeCount(market.marketNo).then(data => {
            console.log('시장 댓글 조회 성공!!!');
            setLikes(data);
        }).catch(error => {
            console.error("시장 댓글 조회에 실패했습니다.", error);
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
        if (category === "전체") {
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
        getListCategory(market.marketNo, pageParam, selectedCategory).then(
            data => {
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

    // 길찾기 시 주소를 좌표로 변환
    const getCoordinates = async (address) => {
        if (!window.naver || !window.naver.maps) {
            console.error('Naver Maps API is not loaded');
            return null;
        }

        try {
            return new Promise((resolve, reject) => {
                window.naver.maps.Service.geocode({ address }, (status, response) => {
                    if (status === window.naver.maps.Service.Status.OK) {
                        const { x, y } = response.result.items[0].point; // x는 경도, y는 위도
                        console.log('x : ', x);
                        console.log('y : ', y);
                        resolve({ lat: y, lng: x });
                    } else {
                        reject(new Error('좌표를 가져오는 데 실패했습니다.'));
                    }
                });
            });
        } catch (error) {
            console.error("좌표 변환 중 오류 발생:", error);
            throw error;
        }
    };

    // 모바일 길찾기
//    const handleDirections = async (type) => {
//        if (!startLocation) {
//            alert("출발지를 입력해 주세요.");
//            return;
//        }
//
//        try {
//            const destinationCoords = await getCoordinates(market.marketAddr);
//            const departureCoords = await getCoordinates(startLocation);
//
//            if (!destinationCoords || !departureCoords) {
//                throw new Error('좌표를 가져오는 데 실패했습니다.');
//            }
//
//            // URL 생성
//            const url = `https://m.search.naver.com/search.naver?query=%EB%B9%A0%EB%A5%B8%EA%B8%B8%EC%B0%BE%EA%B8%B0&nso_path=placeType%5Eplace%3Bname%5E${encodeURIComponent(startLocation)}%3Baddress%5E%3Blongitude%5E${departureCoords.lng}%3Blatitude%5E${departureCoords.lat}%3Bcode%5E%7Ctype%5Eplace%3Bname%5E${encodeURIComponent(market.marketAddr)}%3Baddress%5E%3Blongitude%5E${destinationCoords.lng}%3Blatitude%5E${destinationCoords.lat}%3Bcode%5E%7Cobjtype%5Epath%3Bby%5E${type}`;
//
//            // URL 로그 찍기
//            console.log("길찾기 URL:", url);
//
//            window.open(url, '_blank'); // 새 탭에서 열기
//            setShowDirectionsModal(false); // 모달 닫기
//        } catch (error) {
//            console.error("길찾기 URL 생성 중 오류 발생:", error);
//        }
//    };

    // 시장 길찾기
    const handleDirections = async (type) => {
        if (!startLocation) {
            alert("출발지를 입력해 주세요.");
            setShowDirectionsModal(false);
            setShowStartLocationModal(true);
            return;
        }

        try {
            const destinationCoords = await getCoordinates(market.marketAddr);
            const departureCoords = await getCoordinates(startLocation);

            if (!destinationCoords || !departureCoords) {
                throw new Error('좌표를 가져오는 데 실패했습니다.');
            }

            // URL 생성
            const departureName = encodeURIComponent(startLocation);
            const destinationName = encodeURIComponent(market.marketAddr);
            const departureX = departureCoords.lng;
            const departureY = departureCoords.lat;
            const destinationX = destinationCoords.lng;
            const destinationY = destinationCoords.lat;
            const scale = "15.00";  // 지도 스케일
            const rotation = "0";   // 지도 회전
            const centerX = "0";    // 지도 중심 X
            const centerY = "0";    // 지도 중심 Y
            const mapMode = "dh";   // 지도 모드

            let url;
            switch (type) {
                case 'walk':
                    // 도보 길찾기 URL
                    url = `https://map.naver.com/p/directions/${departureX},${departureY},${departureName}/${destinationX},${destinationY},${destinationName}/-/walk?c=${scale},${rotation},${centerX},${centerY},${mapMode}`;
                    break;
                case 'transit':
                    // 대중교통 길찾기 URL
                    url = `https://map.naver.com/p/directions/${departureX},${departureY},${departureName}/${destinationX},${destinationY},${destinationName}/-/transit?c=${scale},${rotation},${centerX},${centerY},${mapMode}`;
                    break;
                case 'car':
                    // 자동차 길찾기 URL
                    url = `https://map.naver.com/p/directions/${departureX},${departureY},${departureName}/${destinationX},${destinationY},${destinationName}/-/car?c=${scale},${rotation},${centerX},${centerY},${mapMode}`;
                    break;
                default:
                    // 교통수단이 유효하지 않은 경우 처리
                    console.error('Invalid transportation type:', type);
                    throw new Error('Invalid transportation type');
            }

            // URL 로그 찍기
            console.log("길찾기 URL:", url);

            window.open(url, '_blank'); // 새 탭에서 열기
            setShowDirectionsModal(false); // 모달 닫기
        } catch (error) {
            console.error("길찾기 URL 생성 중 오류 발생:", error);
        }
    };

    // 길찾기 모달
    const openDirectionsModal = () => {
        setShowStartLocationModal(true);
//        setShowDirectionsModal(true);
    };

    const closeDirectionsModal = () => {
        setShowDirectionsModal(false);
    };

    const openParkingModal = () => {
        setShowParkingModal(true);
    };

    const closeParkingModal = () => {
        setShowParkingModal(false);
    };

    const openTransportModal = () => {
        setShowTransportModal(true);
    };

    const closeTransportModal = () => {
        setShowTransportModal(false);
    };

    // 카테고리 내 상점이 없으면 페이지네이션 안 보이도록
    const shouldShowPagination = !isCategoryFiltered || filteredShops.length
        > 0;

    return (
        <DashboardLayout>
            {showParkingModal && <ParkingModal open={showParkingModal}
                                               onClose={closeParkingModal}
                                               marketNo={market.marketNo}/>}
            {showTransportModal && <TransportModal open={showTransportModal}
                                                   onClose={closeTransportModal}
                                                   marketNo={market.marketNo}/>}

            <Grid container spacing={2}>
                <Grid item xs={6}>
                    <MDBox pt={0} pb={3}>
                        <Card>
                            <MDBox pt={3} pb={3} px={3}>
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
                                <Grid container>
                                    <Grid item xs={12}>
                                        <div
                                            className="w-full justify-center flex flex-col m-auto items-center">
                                            {market.imageList.map((img, i) =>
                                                <img
                                                    alt="product" key={i}
                                                    width={230}
                                                    src={`${img.imageUrl}`}/>
                                            )}
                                        </div>
                                    </Grid>

                                </Grid>
                                <MDTypography
                                    variant="body2">{market.marketDetail}</MDTypography>
                                <MDTypography
                                    variant="body2"
                                    sx={{
                                        fontSize: '0.75rem',
                                        marginLeft: '8px'
                                    }}
                                >{likes} LIKES</MDTypography>

                                {isAdmin ? (
                                    <>
                                        <Grid container>
                                            <Grid item xs={1.5}>
                                                <MDButton
                                                    onClick={handlePostOrCancelLike}
                                                    variant="gradient"
                                                    sx={{
                                                        fontFamily: 'JalnanGothic',
                                                        fontSize: '0.75rem',
                                                        padding: '4px 8px',   // Adjust padding (top-bottom left-right)
                                                    }}
                                                    color="info">좋아요 👍🏻
                                                </MDButton>
                                            </Grid>
                                            <Grid item xs={1.5}>
                                                <MDButton
                                                    variant="gradient"
                                                    color="light"
                                                    sx={{
                                                        fontFamily: 'JalnanGothic',
                                                        padding: '4px 8px',
                                                    }}
                                                    onClick={() => handleModifyMarket(
                                                        market)}>시장 수정
                                                </MDButton>
                                            </Grid>
                                            <Grid item xs={1.5}>
                                                <MDButton
                                                    variant="gradient"
                                                    color="light"
                                                    sx={{
                                                        fontFamily: 'JalnanGothic',
                                                        padding: '4px 8px',
                                                    }}
                                                    onClick={() => handleDeleteMarket(
                                                        market.marketNo)}>시장 삭제
                                                </MDButton>
                                            </Grid>
                                            <Grid item xs={1.5}>
                                                <MDButton
                                                    variant="gradient"
                                                    color="success"
                                                    sx={{
                                                        fontFamily: 'JalnanGothic',
                                                        padding: '4px 8px',
                                                    }}
                                                    onClick={() => handleAddShop(
                                                        market)}>상점 추가
                                                </MDButton>
                                            </Grid>
                                            <Grid item xs={6}>
                                                <MDBox>
                                                    <Grid container
                                                          justifyContent="flex-end"
                                                          spacing={0.5}>
                                                        <Grid item>
                                                            <MDButton
                                                                variant="gradient"
                                                                color="primary"
                                                                sx={{
                                                                    fontFamily: 'JalnanGothic',
                                                                    padding: '4px 8px',
                                                                }}
                                                                onClick={openParkingModal}
                                                            >
                                                                주차장
                                                            </MDButton>
                                                        </Grid>
                                                        <Grid item>
                                                            <MDButton
                                                                variant="gradient"
                                                                color="secondary"
                                                                sx={{
                                                                    fontFamily: 'JalnanGothic',
                                                                    padding: '4px 8px',
                                                                }}
                                                                onClick={openTransportModal}
                                                            >
                                                                대중교통
                                                            </MDButton>
                                                        </Grid>
                                                        <Grid item>
                                                            <MDButton
                                                                variant="gradient"
                                                                color="secondary"
                                                                sx={{
                                                                    fontFamily: 'JalnanGothic',
                                                                    padding: '4px 8px',
                                                                }}
                                                                onClick={openDirectionsModal}>
                                                                길찾기
                                                            </MDButton>
                                                        </Grid>
                                                        <Grid item>
                                                            <MDButton
                                                                onClick={handleGetTopFiveItemPage}
                                                                variant="gradient"
                                                                sx={{
                                                                    backgroundColor: '#50bcdf',
                                                                    color: '#ffffff',
                                                                    fontSize: '0.75rem',
                                                                    fontFamily: 'JalnanGothic',
                                                                    padding: '4px 8px',
                                                                    minWidth: '100px',
                                                                }}
                                                                color="warning"
                                                            >
                                                                🔥상품별 가격 순위
                                                            </MDButton>
                                                        </Grid>
                                                    </Grid>
                                                </MDBox>
                                            </Grid>
                                        </Grid>
                                    </>
                                ) : (
                                    <>
                                        <Grid container>
                                            <Grid item xs={1.5}>
                                                <MDButton
                                                    onClick={handlePostOrCancelLike}
                                                    variant="gradient"
                                                    sx={{
                                                        fontFamily: 'JalnanGothic',
                                                        fontSize: '0.75rem',
                                                        padding: '4px 8px',   // Adjust padding (top-bottom left-right)
                                                    }}
                                                    color="info">좋아요 👍🏻
                                                </MDButton>
                                            </Grid>

                                            <Grid item xs={10.5}>
                                                <MDBox>
                                                    <Grid container
                                                          justifyContent="flex-end"
                                                          spacing={0.5}>
                                                        <Grid item>
                                                            <MDButton
                                                                variant="gradient"
                                                                color="primary"
                                                                sx={{
                                                                    fontFamily: 'JalnanGothic',
                                                                    padding: '4px 8px',
                                                                }}
                                                                onClick={openParkingModal}
                                                            >
                                                                주차장
                                                            </MDButton>
                                                        </Grid>
                                                        <Grid item>
                                                            <MDButton
                                                                variant="gradient"
                                                                color="secondary"
                                                                sx={{
                                                                    fontFamily: 'JalnanGothic',
                                                                    padding: '4px 8px',
                                                                }}
                                                                onClick={openTransportModal}
                                                            >
                                                                대중교통
                                                            </MDButton>
                                                        </Grid>
                                                        <Grid item>
                                                            <MDButton
                                                                variant="gradient"
                                                                color="secondary"
                                                                sx={{
                                                                    fontFamily: 'JalnanGothic',
                                                                    padding: '4px 8px',
                                                                }}
                                                                onClick={openDirectionsModal}>
                                                                길찾기
                                                            </MDButton>
                                                        </Grid>
                                                        <Grid item>
                                                            <MDButton
                                                                onClick={handleGetTopFiveItemPage}
                                                                variant="gradient"
                                                                sx={{
                                                                    backgroundColor: '#50bcdf',
                                                                    color: '#ffffff',
                                                                    fontSize: '0.75rem',
                                                                    fontFamily: 'JalnanGothic',
                                                                    padding: '4px 8px',
                                                                    minWidth: '100px',
                                                                }}
                                                                color="warning"
                                                            >
                                                                🔥상품별 가격 순위
                                                            </MDButton>
                                                        </Grid>
                                                    </Grid>
                                                </MDBox>
                                            </Grid>
                                        </Grid>
                                    </>
                                )}
                            </MDBox>
                        </Card>
                    </MDBox>
                </Grid>

                {/*지도*/}
                <Grid item xs={6}>
                    <MDBox pt={0} pb={3}>
                        <Card style={{height: '285px'}}>
                            <MDBox component="form" role="form">
                                <MapComponent marketAddr={market.marketAddr}
                                              marketName={market.marketName}/>
                            </MDBox>
                        </Card>
                    </MDBox>
                </Grid>
            </Grid>

            {/*카테고리*/}
            <Grid container spacing={0.1} justifyContent="center">
                {Object.keys(categoryMapping).map((displayCategory, index) => (
                    <Grid item
                          xs={index === 0 ? 0.85 : index === 1 ? 1.0
                              : index === 2 ? 1.0 : index === 3 ? 1.0
                                  : index === 4 ? 1.0 : index === 5 ? 1.15
                                      : index === 6 ? 1.25 : index === 7 ? 1.0
                                          : index === 8 ? 0.85 : index === 9
                                              ? 1.25 : 1.1}
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
                                    fontSize: '0.88rem',
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
            <Grid container pt={2} pb={3}>
                {(isCategoryFiltered && filteredShops.length === 0) ? (
                    <Grid item xs={12}>
                        <MDTypography variant="body2" textAlign="center"
                                      sx={{fontSize: '1.28rem', pt: 2}}>
                            선택한 카테고리 내 상점이 존재하지 않습니다.
                        </MDTypography>
                    </Grid>
                ) : (
                    (isCategoryFiltered ? filteredShops : shops).map(
                        (shop, index) => (
                            <Grid item xs={12} sm={6} md={4} lg={3} key={index}>
                                <MDBox pt={1} pb={1} px={1} key={shop.shopNo}>
                                    <Card sx={{
                                        width: '100%',
                                        maxWidth: '380px',
                                        mx: 'auto'
                                    }}>
                                        <MDBox pt={2} pb={2} px={2}>
                                            <Grid container>
                                                <Grid item xs={6}>
                                                    <MDTypography
                                                        fontWeight="bold"
                                                        sx={{
                                                            fontSize: '0.9rem',
                                                            minWidth: '100px',
                                                        }}
                                                        variant="body2">
                                                        {shop.shopName}
                                                    </MDTypography>
                                                </Grid>
                                                <Grid item xs={6}>
                                                    <MDTypography
                                                        variant="body2"
                                                        sx={{
                                                            fontSize: '0.9rem',
                                                            minWidth: '100px',
                                                        }}
                                                        textAlign="right">
                                                        {shop.tel}
                                                    </MDTypography>
                                                </Grid>
                                            </Grid>
                                            <Grid container>
                                                <Grid item xs={8.7}>
                                                    <MDTypography
                                                        variant="body2"
                                                        sx={{
                                                            fontSize: '0.9rem',
                                                            minWidth: '100px',
                                                        }}
                                                    >
                                                        {shop.sellerName}
                                                    </MDTypography>
                                                </Grid>
                                                <Grid item xs={3.3}>
                                                    <Button
                                                        onClick={() => handleDetail(
                                                            shop)}>
                                                        Detail
                                                    </Button>
                                                </Grid>
                                            </Grid>
                                            <div
                                                className="w-full justify-center flex flex-col m-auto items-center">
                                                {shop.imageList.map(
                                                    (imgUrl, i) => (
                                                        <img alt="product"
                                                             key={i}
                                                             width={250}
                                                             src={`${imgUrl.imageUrl}`}/>
                                                    ))}
                                            </div>
                                        </MDBox>
                                    </Card>
                                </MDBox>
                            </Grid>
                        ))
                )}
            </Grid>

            {shouldShowPagination && (
                <MDPagination size={"small"}>
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

            {showStartLocationModal && (
                <Dialog open={showStartLocationModal} onClose={() => setShowStartLocationModal(false)}>
                    <DialogTitle>출발지 입력</DialogTitle>
                    <DialogContent>
                        <MDBox component="form" role="form">
                            <MDTypography variant="body2">출발지:</MDTypography>
                            <input
                                type="text"
                                value={startLocation}
                                onChange={(e) => setStartLocation(e.target.value)}
                                placeholder="출발지를 입력하세요"
                                style={{ width: '100%', padding: '8px' }}
                            />
                        </MDBox>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={() => {
                            setShowStartLocationModal(false);
                            setShowDirectionsModal(true);
                            setDirectionsType('walk');
                        }}>확인</Button>
                        <Button onClick={() => {
                            setShowStartLocationModal(false);
                            setDirectionsType('');
                        }}>취소</Button>
                    </DialogActions>
                </Dialog>
            )}

            {showDirectionsModal && (
                <Dialog open={showDirectionsModal} onClose={closeDirectionsModal}>
                    <DialogTitle>길찾기</DialogTitle>
                    <DialogContent>
                        <Button onClick={() => handleDirections('walk')}>
                            도보
                        </Button>
                        <Button onClick={() => handleDirections('transit')}>
                            대중교통
                        </Button>
                        <Button onClick={() => handleDirections('car')}>
                            자차
                        </Button>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={closeDirectionsModal}>닫기</Button>
                    </DialogActions>
                </Dialog>
            )}

        </DashboardLayout>
    );
}

export default MarketDetail;
