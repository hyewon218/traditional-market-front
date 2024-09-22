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
import {useEffect, useState, useCallback, useRef} from 'react';
import {useLocation, useNavigate} from 'react-router-dom';

// @mui material components
import Grid from '@mui/material/Grid';
import Card from '@mui/material/Card';
import Button from "@mui/material/Button";
import IconButton from '@mui/material/IconButton';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';

// Material Dashboard 2 React components
import MDBox from '../../components/MD/MDBox';
import MDTypography from '../../components/MD/MDTypography';
import MDButton from '../../components/MD/MDButton';

// Material Dashboard 2 React example components
import DashboardLayout from '../../examples/LayoutContainers/DashboardLayout';
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
import {useMediaQuery} from "@mui/material";

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
    const [page, setPage] = useState(0);

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
    const isSmallScreen = useMediaQuery('(max-width:600px)');


    useEffect(() => {
        handleCountLikes();
        if (isAuthorization) {
            handleCheckLike();
        }
    }, [isAuthorization]);

//    useEffect(() => {
//        if (isCategoryFiltered && selectedCategory) {
//            handleGetCategoryShops(0);
//        } else {
//            handleGetShops(shopPage); // Fetch shops without category filter if not active
//        }
//    }, [selectedCategory, isCategoryFiltered]);

    useEffect(() => {
        if (isCategoryFiltered && selectedCategory) {
            handleGetCategoryShops(shopPage);
        } else {
            handleGetShops(shopPage);
        }
    }, [shopPage, selectedCategory, isCategoryFiltered]);

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
//    const handleGetShops = (pageNum) => {
//        console.log('handleGetShops');
//        const pageParam = {page: pageNum, size: 8};
//        getShopList(market.marketNo, pageParam).then(data => {
//            console.log('상점 조회 성공!!!');
//            console.log(data);
//            setShops(data.content);
//            setShopTotalPage(data.totalPages);
//            setSelectedCategory('');
//            setIsCategoryFiltered(false); // Reset filter
//        }).catch(error => {
//            console.error("상점 조회에 실패했습니다.", error);
//        });
//    };

    // 시장 내 상점 목록
    const handleGetShops = (pageNum = 0) => {
        const pageParam = { page: pageNum, size: 100 };
        getShopList(market.marketNo, pageParam).then(data => {
            if (pageNum === 0) {
                // 페이지 번호가 0일 때만 상점 목록을 초기화합니다.
                setShops(data.content);
            } else {
                // 기존 목록에 새 목록을 추가합니다.
                setShops(prevShops => [...prevShops, ...data.content]);
            }
            // 총 페이지 수를 설정합니다.
            setShopTotalPage(data.totalPages);
        }).catch(error => {
            console.error("상점 조회에 실패했습니다.", error);
        });
    };

    /*카테고리 조회*/
//    const handleCategorySelect = (category) => {
//        if (category === "전체") {
//            handleGetShops(0);
//        } else {
//            const mappedCategory = categoryMapping[category] || '';
//            setSelectedCategory(mappedCategory);
//            console.log("mappedCategory!???!?" + mappedCategory);
//            setIsCategoryFiltered(true); // Set filter active
//        }
//    };

    /*카테고리 조회*/
    const handleCategorySelect = (category) => {
        if (category === "전체") {
            setIsCategoryFiltered(false); // 필터링 해제
            setShopPage(0); // 페이지 초기화
            //handleGetShops(shopPage);
        } else {
            const mappedCategory = categoryMapping[category] || '';
            setSelectedCategory(mappedCategory);
            //console.log("mappedCategory!???!?" + mappedCategory);
            setIsCategoryFiltered(true); // 필터 활성화
            setShopPage(0); // 페이지 초기화
            //handleGetCategoryShops(shopPage);
        }
    };

//    const handleGetCategoryShops = (pageNum) => { // 시장 내 상점 카테고리 조회
//        console.log('handleGetCategoryShops');
//        //console.log('Selected Category:', selectedCategory); // Debugging line
//        const pageParam = {page: pageNum, size: 8};
//        getListCategory(market.marketNo, pageParam, selectedCategory).then(
//            data => {
//                setFilteredShops(data.content);
//                setCategoryTotalPage(data.totalPages);
//            }).catch(error => {
//            console.error("시장 카테고리 조회에 실패했습니다.", error);
//        });
//    };

    const handleGetCategoryShops = (pageNum = 0) => { // 시장 내 상점 카테고리 조회
        const pageParam = { page: pageNum, size: 100 };
        getListCategory(market.marketNo, pageParam, selectedCategory).then(data => {
            console.log('data : ', data);
            if (pageNum === 0) {
                // 페이지 번호가 0일 때만 필터링된 상점 목록을 초기화합니다.
                setFilteredShops(data.content);
            } else {
                // 기존 목록에 새 목록을 추가합니다.
                setFilteredShops(prevShops => [...prevShops, ...data.content]);
            }
            // 총 페이지 수를 설정합니다.
            setCategoryTotalPage(data.totalPages);
        }).catch(error => {
            console.error("상점 카테고리 조회에 실패했습니다.", error);
        });
    };

    // 가격 랭킹
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
            const url = `https://m.search.naver.com/search.naver?query=%EB%B9%A0%EB%A5%B8%EA%B8%B8%EC%B0%BE%EA%B8%B0&nso_path=placeType%5Eplace%3Bname%5E${encodeURIComponent(startLocation)}%3Baddress%5E%3Blongitude%5E${departureCoords.lng}%3Blatitude%5E${departureCoords.lat}%3Bcode%5E%7Ctype%5Eplace%3Bname%5E${encodeURIComponent(market.marketAddr)}%3Baddress%5E%3Blongitude%5E${destinationCoords.lng}%3Blatitude%5E${destinationCoords.lat}%3Bcode%5E%7Cobjtype%5Epath%3Bby%5E${type}`;

            // URL 로그 찍기
            console.log("길찾기 URL:", url);

            window.open(url, '_blank'); // 새 탭에서 열기
            setShowDirectionsModal(false); // 모달 닫기
        } catch (error) {
            console.error("길찾기 URL 생성 중 오류 발생:", error);
        }
    };

    // pc 길찾기
//    const handleDirections = async (type) => {
//        if (!startLocation) {
//            alert("출발지를 입력해 주세요.");
//            setShowDirectionsModal(false);
//            setShowStartLocationModal(true);
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
//            const departureName = encodeURIComponent(startLocation);
//            const destinationName = encodeURIComponent(market.marketAddr);
//            const departureX = departureCoords.lng;
//            const departureY = departureCoords.lat;
//            const destinationX = destinationCoords.lng;
//            const destinationY = destinationCoords.lat;
//            const scale = "15.00";  // 지도 스케일
//            const rotation = "0";   // 지도 회전
//            const centerX = "0";    // 지도 중심 X
//            const centerY = "0";    // 지도 중심 Y
//            const mapMode = "dh";   // 지도 모드
//
//            let url;
//            switch (type) {
//                case 'walk':
//                    // 도보 길찾기 URL
//                    url = `https://map.naver.com/p/directions/${departureX},${departureY},${departureName}/${destinationX},${destinationY},${destinationName}/-/walk?c=${scale},${rotation},${centerX},${centerY},${mapMode}`;
//                    break;
//                case 'transit':
//                    // 대중교통 길찾기 URL
//                    url = `https://map.naver.com/p/directions/${departureX},${departureY},${departureName}/${destinationX},${destinationY},${destinationName}/-/transit?c=${scale},${rotation},${centerX},${centerY},${mapMode}`;
//                    break;
//                case 'car':
//                    // 자동차 길찾기 URL
//                    url = `https://map.naver.com/p/directions/${departureX},${departureY},${departureName}/${destinationX},${destinationY},${destinationName}/-/car?c=${scale},${rotation},${centerX},${centerY},${mapMode}`;
//                    break;
//                default:
//                    // 교통수단이 유효하지 않은 경우 처리
//                    console.error('유효하지않은 교통수단입니다 :', type);
//                    throw new Error('유효하지않은 교통수단입니다');
//            }
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

    // 출발지 입력 모달에서 확인 버튼
    const handleConfirm = () => {
        setShowStartLocationModal(false);
        setShowDirectionsModal(true);
        setDirectionsType('walk');
    };

    // 출발지 입력 모달에서 취소 버튼
    const handleCancel = () => {
        setShowStartLocationModal(false);
        setDirectionsType('');
    };

    // 엔터키
    const handleKeyDown = (event) => {
        if (event.key === 'Enter') {
            event.preventDefault(); // Prevent the default action for Enter key
            handleConfirm(); // Trigger the confirm action
        }
    };

    // 길찾기 모달
    const openDirectionsModal = () => {
        setShowStartLocationModal(true);
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
//    const shouldShowPagination = !isCategoryFiltered || filteredShops.length
//        > 0;

    // 가장 위로 스크롤
    const scrollToTop = () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    // 무한 스크롤 로직
    const observer = useRef();

    const lastShopElementRef = useCallback(node => {
        if (observer.current) observer.current.disconnect();
        observer.current = new IntersectionObserver(entries => {
            if (entries[0].isIntersecting) {
                console.log('IntersectionObserver triggered'); // Log trigger
                // 현재 페이지가 마지막 페이지보다 작은지 확인하여 페이지 증가
                if (shopPage < (isCategoryFiltered ? categoryTotalPage : shopTotalPage) - 1) {
                    setShopPage(prevPage => prevPage + 1);
                }
            }
        }, { threshold: 1.0 });
        if (node) observer.current.observe(node);
    }, [shopPage, shopTotalPage, categoryTotalPage, isCategoryFiltered]);

    return (
        <DashboardLayout>
            {showParkingModal && <ParkingModal open={showParkingModal}
                                               onClose={closeParkingModal}
                                               marketNo={market.marketNo}/>}
            {showTransportModal && <TransportModal open={showTransportModal}
                                                   onClose={closeTransportModal}
                                                   marketNo={market.marketNo}/>}

            {/* 광고 구역 */}
            <MDBox
                sx={{
                    width: '70%',
                    height: { xs: '3rem', sm: '8rem' }, // sm 이하 1.5cm, sm 이상 2cm
                    margin: '0 auto',
                    backgroundColor: '#f5f5f5', // 배경색 예시
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    borderRadius: '8px',
                    boxShadow: 1,
                    position: 'relative', // 상대 위치로 설정
                    zIndex: 10, // 광고가 다른 콘텐츠 위에 표시되도록 함
                    marginBottom: '1rem', // 광고 구역과 그 아래 콘텐츠 사이의 여백
                    mt: {xs:-3, sm:5, md:1, lg:1},
                }}
            >
                <a href="https://www.example.com" target="_blank" rel="noopener noreferrer">
                    <img
                        src="https://via.placeholder.com/728x90.png?text=Ad+Banner" // 광고 배너 이미지 URL
                        alt="Advertisement"
                        style={{
                            width: '100%',
                            height: '100%',
                            objectFit: 'cover', // 이미지가 광고 영역에 맞게 조절되도록 설정
                            borderRadius: '8px',
                        }}
                    />
                </a>
            </MDBox>

            <Grid container spacing={isSmallScreen ? -1 : 2}>
                <Grid item xs={12} sm={12} md={12} lg={6} sx={{ mb:isSmallScreen ? 1.5 : 3 }}>
                    <MDBox>
                        <Card>
                            <MDBox pt={2} pb={2} px={2.5}>
                                <Grid container>
                                    <Grid item xs={3.5}>
                                        <MDTypography
                                            sx={{
                                                fontSize: isSmallScreen
                                                    ? '0.9rem' : '1rem'
                                            }}
                                            fontWeight="bold"
                                            variant="body2">
                                            {market.marketName}
                                        </MDTypography>
                                    </Grid>
                                    <Grid item xs={8.5}>
                                        <MDTypography
                                            sx={{
                                                fontSize: isSmallScreen
                                                    ? '0.8rem' : '1rem'
                                            }}
                                            variant="body2"
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
                                    sx={{
                                        fontSize: isSmallScreen ? '0.8rem':'0.9rem',
                                    }}
                                    variant="body2">{market.marketDetail}</MDTypography>
                                <MDTypography
                                    variant="body2"
                                    sx={{
                                        fontSize: isSmallScreen ? '0.6rem':'0.75rem',
                                        marginLeft: isSmallScreen ? '3px':'8px'
                                    }}
                                >{likes} LIKES</MDTypography>

                                {isAdmin ? (
                                    <>
                                        <Grid container spacing={isSmallScreen ? 0 : 0.2} >
                                            <Grid item xs={isSmallScreen ? 3 : 1.5}>
                                                <MDButton
                                                    onClick={handlePostOrCancelLike}
                                                    variant="gradient"
                                                    sx={{
                                                        fontFamily: 'JalnanGothic',
                                                        fontSize: isSmallScreen ? '0.7rem':'0.9rem',
                                                        minWidth: 'auto',
                                                        width: isSmallScreen ? '60px' : 'auto', // 가로 너비를 줄임
                                                        padding: isSmallScreen
                                                            ? '1px 2px'
                                                            : '4px 8px',
                                                        lineHeight:  isSmallScreen ? 2:2,  // 줄 간격을 줄여 높이를 감소시킴
                                                        minHeight: 'auto' // 기본적으로 적용되는 높이를 없앰
                                                    }}
                                                    color="info">좋아요 👍🏻
                                                </MDButton>
                                            </Grid>
                                            <Grid item xs={isSmallScreen ? 3 : 1.5}>
                                                <MDButton
                                                    variant="gradient"
                                                    color="light"
                                                    sx={{
                                                        fontFamily: 'JalnanGothic',
                                                        fontSize: isSmallScreen ? '0.7rem':'0.9rem',
                                                        minWidth: 'auto',
                                                        width: isSmallScreen ? '60px' : 'auto', // 가로 너비를 줄임
                                                        padding: isSmallScreen
                                                            ? '1px 2px'
                                                            : '4px 8px',
                                                        lineHeight:  isSmallScreen ? 2:2,  // 줄 간격을 줄여 높이를 감소시킴
                                                        minHeight: 'auto' // 기본적으로 적용되는 높이를 없앰
                                                    }}
                                                    onClick={() => handleModifyMarket(
                                                        market)}>시장 수정
                                                </MDButton>
                                            </Grid>
                                            <Grid item xs={isSmallScreen ? 3 : 1.5}>
                                                <MDButton
                                                    variant="gradient"
                                                    color="light"
                                                    sx={{
                                                        fontFamily: 'JalnanGothic',
                                                        fontSize: isSmallScreen ? '0.7rem':'0.9rem',
                                                        minWidth: 'auto',
                                                        width: isSmallScreen ? '60px' : 'auto', // 가로 너비를 줄임
                                                        padding: isSmallScreen
                                                            ? '1px 2px'
                                                            : '4px 8px',
                                                        lineHeight:  isSmallScreen ? 2:2,  // 줄 간격을 줄여 높이를 감소시킴
                                                        minHeight: 'auto' // 기본적으로 적용되는 높이를 없앰
                                                    }}
                                                    onClick={() => handleDeleteMarket(
                                                        market.marketNo)}>시장 삭제
                                                </MDButton>
                                             </Grid>
                                             <Grid item xs={isSmallScreen ? 3 : 1.5}>
                                                <MDButton
                                                    variant="gradient"
                                                    color="success"
                                                    sx={{
                                                        fontFamily: 'JalnanGothic',
                                                        fontSize: isSmallScreen ? '0.7rem':'0.9rem',
                                                        minWidth: 'auto',
                                                        width: isSmallScreen ? '60px' : 'auto', // 가로 너비를 줄임
                                                        padding: isSmallScreen
                                                            ? '1px 2px'
                                                            : '4px 8px',
                                                        lineHeight:  isSmallScreen ? 2:2,  // 줄 간격을 줄여 높이를 감소시킴
                                                        minHeight: 'auto' // 기본적으로 적용되는 높이를 없앰
                                                    }}
                                                    onClick={() => handleAddShop(
                                                        market)}>상점 추가
                                                </MDButton>
                                            </Grid>
                                            <Grid item
                                                  xs={isSmallScreen ? 3 : 1.2}>
                                                <MDButton
                                                    variant="gradient"
                                                    color="primary"
                                                    sx={{
                                                        fontFamily: 'JalnanGothic',
                                                        fontSize: isSmallScreen ? '0.7rem':'0.9rem',
                                                        minWidth: 'auto',
                                                        width: isSmallScreen ? '60px' : 'auto', // 가로 너비를 줄임
                                                        padding: isSmallScreen
                                                            ? '1px 2px'
                                                            : '4px 8px',
                                                        lineHeight:  isSmallScreen ? 2:2,  // 줄 간격을 줄여 높이를 감소시킴
                                                        minHeight: 'auto' // 기본적으로 적용되는 높이를 없앰
                                                    }}
                                                    onClick={openParkingModal}
                                                >
                                                    주차장
                                                </MDButton>
                                            </Grid>
                                            <Grid item
                                                  xs={isSmallScreen ? 3 : 1.4}>
                                                <MDButton
                                                    variant="gradient"
                                                    color="primary"
                                                    sx={{
                                                        fontFamily: 'JalnanGothic',
                                                        fontSize: isSmallScreen ? '0.7rem':'0.9rem',
                                                        minWidth: 'auto',
                                                        width: isSmallScreen ? '60px' : 'auto', // 가로 너비를 줄임
                                                        padding: isSmallScreen
                                                            ? '1px 2px'
                                                            : '4px 8px',
                                                        lineHeight:  isSmallScreen ? 2:2,  // 줄 간격을 줄여 높이를 감소시킴
                                                        minHeight: 'auto' // 기본적으로 적용되는 높이를 없앰
                                                    }}
                                                    onClick={openTransportModal}
                                                >
                                                    대중교통
                                                </MDButton>
                                            </Grid>
                                            <Grid item
                                                  xs={isSmallScreen ? 3 : 1.2}>
                                                <MDButton
                                                    variant="gradient"
                                                    color="secondary"
                                                    sx={{
                                                        fontFamily: 'JalnanGothic',
                                                        fontSize: isSmallScreen ? '0.7rem':'0.9rem',
                                                        minWidth: 'auto',
                                                        width: isSmallScreen ? '60px' : 'auto', // 가로 너비를 줄임
                                                        padding: isSmallScreen
                                                            ? '1px 2px'
                                                            : '4px 8px',
                                                        lineHeight:  isSmallScreen ? 2:2,  // 줄 간격을 줄여 높이를 감소시킴
                                                        minHeight: 'auto' // 기본적으로 적용되는 높이를 없앰
                                                    }}
                                                    onClick={openDirectionsModal}>
                                                    길찾기
                                                </MDButton>
                                            </Grid>
                                            <Grid item
                                                  xs={isSmallScreen ? 3 : 2}>
                                                <MDButton
                                                    onClick={handleGetTopFiveItemPage}
                                                    variant="gradient"
                                                    sx={{
                                                        fontFamily: 'JalnanGothic',
                                                        fontSize: isSmallScreen ? '0.65rem':'0.9rem',
                                                        minWidth: 'auto',
                                                        width: isSmallScreen ? '60px' : 'auto', // 가로 너비를 줄임
                                                        padding: isSmallScreen
                                                            ? '1px 2px'
                                                            : '4px 8px',
                                                        lineHeight:  isSmallScreen ? 2:2,  // 줄 간격을 줄여 높이를 감소시킴
                                                        minHeight: 'auto' // 기본적으로 적용되는 높이를 없앰
                                                    }}
                                                    color="warning"
                                                >상품별순위
                                                </MDButton>
                                            </Grid>
                                        </Grid>
                                    </>
                                ) : (
                                    <>
                                        <Grid container spacing={isSmallScreen ? 5 : 0.2}>
                                            <Grid item xs={isSmallScreen ? 2 : 1.5}>
                                                <MDButton
                                                    onClick={handlePostOrCancelLike}
                                                    variant="gradient"
                                                    sx={{
                                                        fontFamily: 'JalnanGothic',
                                                        fontSize: isSmallScreen ? '0.6rem':'0.9rem',
                                                        minWidth: 'auto',
                                                        width: isSmallScreen ? '50px' : 'auto', // 가로 너비를 줄임
                                                        padding: isSmallScreen
                                                            ? '1px 2px'
                                                            : '4px 8px',
                                                        lineHeight:  isSmallScreen ? 2.5:2,  // 줄 간격을 줄여 높이를 감소시킴
                                                        minHeight: 'auto' // 기본적으로 적용되는 높이를 없앰
                                                    }}
                                                    color="info">좋아요 👍🏻
                                                </MDButton>
                                            </Grid>
                                            <Grid item
                                                  xs={isSmallScreen ? 2 : 1.15}>
                                                <MDButton
                                                    variant="gradient"
                                                    color="primary"
                                                    sx={{
                                                        fontFamily: 'JalnanGothic',
                                                        fontSize: isSmallScreen ? '0.6rem':'0.9rem',
                                                        minWidth: 'auto',
                                                        width: isSmallScreen ? '50px' : 'auto', // 가로 너비를 줄임
                                                        padding: isSmallScreen
                                                            ? '1px 2px'
                                                            : '4px 8px',
                                                        lineHeight:  isSmallScreen ? 2.5:2,  // 줄 간격을 줄여 높이를 감소시킴
                                                        minHeight: 'auto' // 기본적으로 적용되는 높이를 없앰
                                                    }}
                                                    onClick={openParkingModal}
                                                >
                                                    주차장
                                                </MDButton>
                                            </Grid>
                                            <Grid item
                                                  xs={isSmallScreen ? 2 : 1.4}>
                                                <MDButton
                                                    variant="gradient"
                                                    color="secondary"
                                                    sx={{
                                                        fontFamily: 'JalnanGothic',
                                                        fontSize: isSmallScreen ? '0.6rem':'0.9rem',
                                                        minWidth: 'auto',
                                                        width: isSmallScreen ? '50px' : 'auto', // 가로 너비를 줄임
                                                        padding: isSmallScreen
                                                            ? '1px 2px'
                                                            : '4px 8px',
                                                        lineHeight:  isSmallScreen ? 2.5:2,  // 줄 간격을 줄여 높이를 감소시킴
                                                        minHeight: 'auto' // 기본적으로 적용되는 높이를 없앰
                                                    }}
                                                    onClick={openTransportModal}
                                                >
                                                    대중교통
                                                </MDButton>
                                            </Grid>
                                            <Grid item
                                                  xs={isSmallScreen ? 2 : 1.15}>
                                                <MDButton
                                                    variant="gradient"
                                                    color="secondary"
                                                    sx={{
                                                        fontFamily: 'JalnanGothic',
                                                        fontSize: isSmallScreen ? '0.6rem':'0.9rem',
                                                        minWidth: 'auto',
                                                        width: isSmallScreen ? '50px' : 'auto', // 가로 너비를 줄임
                                                        padding: isSmallScreen
                                                            ? '1px 2px'
                                                            : '4px 8px',
                                                        lineHeight:  isSmallScreen ? 2.5:2,  // 줄 간격을 줄여 높이를 감소시킴
                                                        minHeight: 'auto' // 기본적으로 적용되는 높이를 없앰
                                                    }}
                                                    onClick={openDirectionsModal}>
                                                    길찾기
                                                </MDButton>
                                            </Grid>
                                            <Grid item
                                                  xs={isSmallScreen ? 4 : 4}>
                                                <MDButton
                                                    onClick={handleGetTopFiveItemPage}
                                                    variant="gradient"
                                                    color="warning"
                                                    sx={{
                                                        fontFamily: 'JalnanGothic',
                                                        fontSize: isSmallScreen ? '0.6rem':'0.9rem',
                                                        minWidth: 'auto',
                                                        width: isSmallScreen ? '70px' : 'auto',
                                                        padding: isSmallScreen
                                                            ? '1px 2px'
                                                            : '4px 8px',
                                                        lineHeight:  isSmallScreen ? 1.5:2,
                                                        minHeight: 'auto' // 기본적으로 적용되는 높이를 없앰
                                                    }}
                                                >
                                                    {isSmallScreen ? (
                                                        <>
                                                            🔥 상품별<br />가격 순위
                                                        </>
                                                    ) : (
                                                        <>
                                                            🔥 상품별 가격 순위
                                                        </>
                                                    )}
                                                </MDButton>
                                            </Grid>
                                        </Grid>
                                    </>
                                )}
                            </MDBox>
                        </Card>
                    </MDBox>
                </Grid>

                {/*지도*/}
                <Grid item xs={12} sm={12} md={12} lg={6} sx={{ mb: 3 }}>
                    <MDBox>
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
            <Grid container spacing={isSmallScreen ? 0.7 : 1} justifyContent="center">
                {Object.keys(categoryMapping).map((displayCategory, index) => (
                    <Grid item
                          xs={3} sx={2} sm={2} md={2.5} lg={index === 0 ? 0.85 : index === 1 ? 1.0
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
                                    fontSize: isSmallScreen ? '0.8rem' :'1rem',
                                    fontFamily: 'JalnanGothic',
                                    width: '100%',
                                    padding: isSmallScreen ? '2px 4px' : '4px 8px',
                                    lineHeight: 2,  // 줄 간격을 줄여 높이를 감소시킴
                                    minHeight: 'auto' // 기본적으로 적용되는 높이를 없앰
                                }}
                            >
                                {displayCategory}
                            </MDButton>
                        </MDBox>
                    </Grid>
                ))}
            </Grid>

            {/* 시장 내 상점 목록 */}
            <Grid container pt={2} pb={10}>
                {(isCategoryFiltered && filteredShops.length === 0) ? (
                    <Grid item xs={12}>
                        <MDTypography variant="body2" textAlign="center"
                                      sx={{fontSize: '1.28rem', pt: 2}}>
                            선택한 카테고리 내 상점이 존재하지 않습니다.
                        </MDTypography>
                    </Grid>
                ) : (
                    (isCategoryFiltered ? filteredShops : shops).map(
                        (shop, index) => {
                            // 마지막 상점 요소에 lastShopElementRef 연결
                            const isLastElement = index === (isCategoryFiltered ? filteredShops : shops).length - 1;

                            return (
                                <Grid item xs={12} sm={6} md={6} lg={3} key={index}
                                      ref={isLastElement ? lastShopElementRef : null}>
                                    <MDBox pt={1} pb={1} px={1} key={shop.shopNo}>
                                        <Card sx={{
                                            width: '100%',
                                            maxWidth: '380px',
                                            mx: 'auto'
                                        }}>
                                            <MDBox pt={2} pb={2} px={3}>
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
                                                    <Grid item xs={9}>
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
                                                    <Grid item xs={3}>
                                                        <Button
                                                            onClick={() => handleDetail(shop)}
                                                            sx={{
                                                                padding: '0px 8px',
                                                                mr: '-10px',
                                                                mt: '-10px',
                                                                fontFamily: 'JalnanGothic',
                                                            }}
                                                        >상세보기
                                                        </Button>
                                                    </Grid>
                                                </Grid>
                                                <div className="w-full justify-center flex flex-col m-auto items-center">
                                                    {shop.imageList.map(
                                                        (imgUrl, i) => (
                                                            <img alt="product"
                                                                 key={i}
                                                                 width={250}
                                                                 src={`${imgUrl.imageUrl}`}
                                                                 onClick={() => handleDetail(shop)}
                                                                 style={{cursor: 'pointer' }}/>
                                                        ))}
                                                </div>
                                            </MDBox>
                                        </Card>
                                    </MDBox>
                                </Grid>
                            );
                        })
                )}
            </Grid>

            {showStartLocationModal && (
                <Dialog open={showStartLocationModal} onClose={() => setShowStartLocationModal(false)} onKeyDown={handleKeyDown}>
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
                        <Button onClick={handleConfirm}>확인</Button>
                        <Button onClick={handleCancel}>취소</Button>
                    </DialogActions>
                </Dialog>
            )}

            {/* pc 길찾기 */}
            {/* {showDirectionsModal && (
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
            )} */}

            {/* 모바일 길찾기 */}
            {showDirectionsModal && (
                <Dialog open={showDirectionsModal} onClose={closeDirectionsModal}>
                    <DialogTitle>길찾기</DialogTitle>
                    <DialogContent>
                        <Button onClick={() => handleDirections('walk')}>
                            도보
                        </Button>
                        <Button onClick={() => handleDirections('pubtrans')}>
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

            {/* 위쪽 화살표 아이콘 */}
            <IconButton
                onClick={scrollToTop}
                sx={{
                    position: 'fixed',
                    bottom: '20px',
                    right: '20px',
                    backgroundColor: '#50bcdf',
                    color: '#ffffff',
                    zIndex: 2000, // 다른 요소들보다 위에 위치
                    '&:hover': {
                        backgroundColor: '#33a3d0',
                    },
                    '@media (max-width: 600px)': { // 모바일에 대한 스타일링
                        bottom: '70px',  // 모바일에서의 위치 조정
                        right: '15px',   // 모바일에서의 위치 조정
                    }
                }}
            >
                <KeyboardArrowUpIcon />
            </IconButton>
            {/* {shouldShowPagination && (
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
            )} */}
        </DashboardLayout>
    );
}

export default MarketDetail;
