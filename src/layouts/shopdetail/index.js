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
import {useLocation} from 'react-router-dom';

// @mui material components
import Grid from '@mui/material/Grid';
import Card from '@mui/material/Card';
import IconButton from '@mui/material/IconButton';
import KeyboardArrowLeftIcon from '@mui/icons-material/KeyboardArrowLeft';
import KeyboardArrowRightIcon from '@mui/icons-material/KeyboardArrowRight';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';

// Material Dashboard 2 React components
import MDBox from '../../components/MD/MDBox';
import MDTypography from '../../components/MD/MDTypography';
import MDButton from '../../components/MD/MDButton';

// Material Dashboard 2 React example components
import DashboardLayout from '../../examples/LayoutContainers/DashboardLayout';

import Button from "@mui/material/Button";
import {useNavigate} from "react-router";
import useCustomLogin from "../../hooks/useCustomLogin";
import {
    cancelShopLike,
    deleteShop,
    getShopLike,
    getShopLikeCount,
    postShopLike,
} from "../../api/shopApi";
import {getItemList, getListCategoryByShop} from "../../api/itemApi";
import {getMember} from "../../api/memberApi";
import ShopMapComponent from "../../components/map/ShopMapComponent";
import {useMediaQuery} from "@mui/material"; // 상점 위치 출력

const categoryMapping = {
    "전체": '전체',
    "과일": '과일',
    "채소": '채소',
    "육류": '육류',
    "생선": '생선',
};

function ShopDetail() {
    const {isAdmin, isSeller, isAuthorization} = useCustomLogin()
    const {state} = useLocation();
    const shop = state; // 전달된 shop 데이터를 사용
    console.log(state);

    const [itemPage, setItemPage] = useState(0);

    const [likes, setLikes] = useState(0);
    const [liked, setLiked] = useState(false); // 좋아요 여부 확인

    const [items, setItems] = useState([]);
    const [itemTotalPage, setItemTotalPage] = useState(0);
    const [page, setPage] = useState(0);

    const [currentItemImageIndices, setCurrentItemImageIndices] = useState([]);

    const [selectedCategory, setSelectedCategory] = useState(''); // 선택된 카테고리
    const [filteredItems, setFilteredItems] = useState([]); // 시장 카테고리 조회
    const [categoryTotalPage, setCategoryTotalPage] = useState(0); // 검색 시장 조회 페이지
    const [isCategoryFiltered, setIsCategoryFiltered] = useState(false);// 카테고리 필터 활성화되었는지 확인
    const [currentUser, setCurrentUser] = useState(null);
    const [showButtons, setShowButtons] = useState(false); // 관리자 또는 상점 소유자일 경우 활성화

    const navigate = useNavigate();
    const isSmallScreen = useMediaQuery('(max-width:600px)');

    useEffect(() => {
        // 현재 사용자 정보 가져오기
        const fetchCurrentUser = async () => {
            try {
                 // 현재 사용자 정보 가져오기
                const member = await getMember();
                console.log('member : ', member);
                setCurrentUser(member);

                // 사용자 권한과 상점의 sellerNo 비교
                if (isAdmin || (isSeller && (member.memberNo === shop.sellerNo))) {
                    console.log('memberNo :', member.memberNo);
                    console.log('sellerNo :', shop.sellerNo);
                    setShowButtons(true);
                } else {
                    setShowButtons(false);
                }
            } catch (error) {
                console.error("사용자 정보 조회 오류:", error);
                setShowButtons(false); // 오류 발생 시 버튼 숨김
            }
        };

        handleCountLikes();
        if (isAuthorization) {
            fetchCurrentUser();
            handleCheckLike();
        }
    }, [isAuthorization]);

//    useEffect(() => {
//        if (isCategoryFiltered && selectedCategory) {
//            handleGetCategoryItems(0);
//        } else {
//            handleGetItems(itemPage);
//        }
//    }, [selectedCategory, isCategoryFiltered]);

    useEffect(() => {
        if (isCategoryFiltered && selectedCategory) {
            handleGetCategoryItems(itemPage);
        } else {
            handleGetItems(itemPage);
        }
    }, [itemPage, selectedCategory, isCategoryFiltered]);

    const handleModifyShop = (shop) => {
        console.log('handleModify');
        if (isAdmin) {
            navigate('/modify-shop', {state: shop});
        } else if (isSeller) {
            navigate('/modify-shop-seller', {state: shop});
        }
    };

//    const handleDeleteShop = (sno) => {
//        console.log('handleDelete');
//        deleteShop(sno).then(data => {
//        }).catch(error => {
//            console.error("상점 삭제에 실패했습니다.", error);
//        });
//    };

    const handleDeleteShop = (sno) => {
        const isConfirmed = window.confirm('상점을 삭제하시겠습니까?');
        if (isConfirmed) {
            console.log('handleDelete');
            deleteShop(sno)
                .then(data => {
                    alert('삭제 성공:', data);
                    navigate('/market');
                })
                .catch(error => {
                    alert(error.response.data);
                });
        } else {
            console.log('삭제 취소');
        }
    };

    const handleAddItem = (shop) => {
        console.log('handleAddShop');
        if (isAdmin) {
            navigate('/post-item', {state: shop})
        } else if (isSeller) {
            navigate('/post-item-seller', {state: shop})
        }
    };

    const changeItemsPage = (pageNum) => {
        console.log('change pages');
        console.log(pageNum);
        console.log(itemPage);
        setItemPage(pageNum);
        handleGetItems(pageNum);
    };

    const handleDetail = (item) => {
        console.log('handleDetail');
        console.log("item!!!!!!!!!!!" + item);
        navigate('/item-detail', {state: item});
    };

    const handleCheckLike = () => {
        getShopLike(shop.shopNo).then(data => {
            console.log('좋아요 상태 확인 성공!!!');
            setLiked(data); // 좋아요 true, false 확인
        }).catch(error => {
            console.error("좋아요 상태 확인에 실패했습니다.", error);
        });
    };

    // 상점 좋아요 및 좋아요 취소
    const handlePostOrCancelLike = () => {
        if (!isAuthorization) {
            alert("로그인이 필요합니다.");
            return;
        }
        if (liked) {
            cancelShopLike(shop.shopNo).then(data => {
                console.log('좋아요 취소 성공!!!');
                setLiked(false);
                setLikes(prev => prev - 1); // Update likes count
            }).catch(error => {
                console.error("좋아요 취소에 실패했습니다.", error);
            });
        } else {
            postShopLike(shop.shopNo).then(data => {
                console.log('좋아요 성공!!!');
                setLiked(true);
                setLikes(prev => prev + 1); // Update likes count
            }).catch(error => {
                console.error("상점 좋아요에 실패했습니다.", error);
            });
        }
    };

    const handleCountLikes = () => {
        getShopLikeCount(shop.shopNo).then(data => {
            console.log('상점 댓글 수 조회 성공!!!');
            setLikes(data);
        }).catch(error => {
            console.error("상점 댓글 조회에 실패했습니다.", error);
        });
    };

    // 상점 내 상품 목록
//    const handleGetItems = (pageNum) => {
//        console.log('handleGetItems');
//        const pageParam = {page: pageNum, size: 8};
//        getItemList(shop.shopNo, pageParam).then(data => {
//            console.log('상품 조회 성공!!!');
//            console.log(data);
//            setItems(data.content);
//            setItemTotalPage(data.totalPages);
//            setSelectedCategory('');
//            setIsCategoryFiltered(false); // Reset filter
//            setCurrentItemImageIndices(Array(data.content.length).fill(0)); // 상품 이미지 인덱스 초기화
//        }).catch(error => {
//            console.error("상품 조회에 실패했습니다.", error);
//        });
//    };

    // 상점 내 상품 목록
    const handleGetItems = (pageNum = 0) => {
        const pageParam = { page: pageNum, size: 100 };
        getItemList(shop.shopNo, pageParam).then(data => {
            if (pageNum === 0) {
                // 페이지 번호가 0일 때만 상품 목록을 초기화합니다.
                setItems(data.content);
                setCurrentItemImageIndices(Array(data.content.length).fill(0)); // 상품 이미지 인덱스 초기화
            } else {
                // 기존 목록에 새 목록을 추가합니다.
                setItems(prevItems => [...prevItems, ...data.content]);
                setCurrentItemImageIndices(prevIndices => [
                    ...prevIndices,
                    ...Array(data.content.length).fill(0)
                ]); // 새로 추가된 상품의 이미지 인덱스 초기화
            }
            // 총 페이지 수를 설정합니다.
            setItemTotalPage(data.totalPages);
        }).catch(error => {
            console.error("상품 조회에 실패했습니다.", error);
        });
    };

    /*카테고리 선택*/
//    const handleCategorySelect = (category) => {
//        if (category === "전체") {
//            handleGetItems(0);
//        } else {
//            const mappedCategory = categoryMapping[category] || '';
//            setSelectedCategory(mappedCategory);
//            console.log("mappedCategory!???!?" + mappedCategory);
//            setIsCategoryFiltered(true); // Set filter active
//        }
//    };

    /*카테고리 선택*/
    const handleCategorySelect = (category) => {
        if (category === "전체") {
            setIsCategoryFiltered(false); // 필터링 해제
            setItemPage(0); // 페이지 초기화
            //handleGetItems(0);
        } else {
            const mappedCategory = categoryMapping[category] || '';
            setSelectedCategory(mappedCategory);
            //console.log("mappedCategory!???!?" + mappedCategory);
            setIsCategoryFiltered(true); // 필터 활성화
            setItemPage(0); // 페이지 초기화
            //handleGetCategoryItems(0); // 카테고리 필터링된 목록을 0 페이지부터 가져오기
        }
    };

    /*상점 내 상품 카테고리 조회*/
//    const handleGetCategoryItems = (pageNum) => {
//        console.log('handleGetCategoryShops');
//        //console.log('Selected Category:', selectedCategory); // Debugging line
//        const pageParam = {page: pageNum, size: 8};
//        getListCategoryByShop(shop.shopNo, pageParam, selectedCategory).then(
//            data => {
//                setFilteredItems(data.content);
//                setCategoryTotalPage(data.totalPages);
//            }).catch(error => {
//            console.error("시장 카테고리 조회에 실패했습니다.", error);
//        });
//    };

    /*상점 내 상품 카테고리 조회*/
    const handleGetCategoryItems = (pageNum = 0) => { // 시장 내 상점 카테고리 조회
        console.log('handleGetCategoryItems');
        const pageParam = { page: pageNum, size: 100 };
        getListCategoryByShop(shop.shopNo, pageParam, selectedCategory).then(data => {
            console.log('data : ', data);
            if (pageNum === 0) {
                // 페이지 번호가 0일 때만 필터링된 상품 목록을 초기화합니다.
                setFilteredItems(data.content);
            } else {
                // 기존 목록에 새 목록을 추가합니다.
                setFilteredItems(prevItems => [...prevItems, ...data.content]);
            }
            // 총 페이지 수를 설정합니다.
            setCategoryTotalPage(data.totalPages);
        }).catch(error => {
            console.error("상품 카테고리 조회에 실패했습니다.", error);
        });
    };

    const handleNextItemImage = (index) => {
        setCurrentItemImageIndices((prevIndices) => {
            const newIndices = [...prevIndices];
            newIndices[index] = (newIndices[index] + 1)
                % items[index].imageList.length;
            return newIndices;
        });
    };

    const handlePreviousItemImage = (index) => {
        setCurrentItemImageIndices((prevIndices) => {
            const newIndices = [...prevIndices];
            newIndices[index] = (newIndices[index] - 1
                    + items[index].imageList.length)
                % items[index].imageList.length;
            return newIndices;
        });
    };

    // 카테고리 내 상점이 없으면 페이지네이션 안 보이도록
//    const shouldShowPagination = !isCategoryFiltered || filteredItems.length
//        > 0;

    // 상점 위치 정보 (위도, 경도) 배열
    const locations = [
        {
            latitude: shop.shopLat, // 상점의 위도
            longitude: shop.shopLng, // 상점의 경도
            info: shop.shopName, // 상점 이름
            tel: shop.tel // 상점 전화번호
        }
    ];

    // 가장 위로 스크롤
    const scrollToTop = () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    // 무한 스크롤 로직
    const observer = useRef();
    const lastItemElementRef = useCallback(node => {
        if (observer.current) observer.current.disconnect();
        observer.current = new IntersectionObserver(entries => {
            if (entries[0].isIntersecting) {
                console.log('IntersectionObserver triggered'); // Log trigger
                // 현재 페이지가 마지막 페이지보다 작은지 확인하여 페이지 증가
                if (itemPage < (isCategoryFiltered ? categoryTotalPage : itemTotalPage) - 1) {
                    setItemPage(prevPage => prevPage + 1);
                }
            }
        }, { threshold: 1.0 });
        if (node) observer.current.observe(node);
    }, [itemPage, itemTotalPage, categoryTotalPage, isCategoryFiltered]);

    return (
        <DashboardLayout>
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
                    mt: {xs:-3, sm:1, md:1, lg:1},
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
            <Grid container spacing={isSmallScreen ? 2 : 2}>
                <Grid item xs={12} sm={12} md={12} lg={6}>
                    <MDBox>
                        <Card>
                            <MDBox pt={2} pb={2} px={2.5}>
                                <Grid container>
                                    <Grid item xs={6} sm={6} md={6} lg={6}>
                                        <MDTypography fontWeight="bold" variant="body2" sx={{ fontSize: '1rem' }}>
                                            {shop.shopName}
                                        </MDTypography>
                                    </Grid>
                                    <Grid item xs={6} sm={6} md={6} lg={6}>
                                        <MDTypography variant="body2" textAlign='right' sx={{ fontSize: '1rem' }}>
                                            {shop.shopAddr}
                                        </MDTypography>
                                    </Grid>
                                </Grid>
                                <Grid container spacing={1} justifyContent="center">
                                    <Grid item xs={12}>
                                        <div className="w-full flex flex-col items-center">
                                            {shop.imageList.map((imgUrl, i) => (
                                                <img
                                                    alt="product"
                                                    key={i}
                                                    width={230}
                                                    src={`${imgUrl.imageUrl}`}
                                                />
                                            ))}
                                        </div>
                                    </Grid>
                                </Grid>
                                <MDTypography
                                    variant="body2"
                                    sx={{
                                        fontSize: '0.75rem',
                                        marginLeft: '8px'
                                    }}
                                >{likes} LIKES
                                </MDTypography>

                                <Grid container spacing={isSmallScreen ? 0 : 0}>
                                    <Grid item xs={isSmallScreen ? 2.7 : 1.5}>
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
                                            color="info"
                                        >좋아요 👍🏻
                                        </MDButton>
                                    </Grid>
                                    {showButtons && (
                                        <>
                                            <Grid item xs={isSmallScreen ? 2.7 : 1.5}>
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
                                                    onClick={() => handleModifyShop(shop)}
                                                >
                                                    상점 수정
                                                </MDButton>
                                            </Grid>
                                            <Grid item xs={isSmallScreen ? 2.7 : 1.5}>
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
                                                    onClick={() => handleAddItem(shop)}
                                                >
                                                    상품 추가
                                                </MDButton>
                                            </Grid>
                                        </>
                                    )}
                                    {isAdmin && (
                                        <Grid item xs={isSmallScreen ? 2.5 : 1.5}>
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
                                                onClick={() => handleDeleteShop(shop.shopNo)}
                                            >
                                                상점 삭제
                                            </MDButton>
                                        </Grid>
                                    )}
                                </Grid>
                            </MDBox>
                        </Card>
                    </MDBox>
                </Grid>


                {/* 지도 */}
                <Grid item xs={12} sm={12} md={12} lg={6} sx={{ mb: 3 }}>
                    <Card style={{height: isSmallScreen ? '150px' :'270px'}}>
                        <MDBox component="form" role="form">
                            <ShopMapComponent
                                containerId="shop-map" // 지도 컨테이너 ID
                                locations={locations} // 위치 데이터
                                title={shop.shopName} // 지도 제목
                            />
                        </MDBox>
                    </Card>
                </Grid>
            </Grid>

            {/*카테고리*/}
            <Grid container spacing={isSmallScreen ? 0.4 : 2} justifyContent="center" >
                {Object.keys(categoryMapping).map((displayCategory) => (
                    <Grid item xs={2.4} sm={2} md={2} lg={1} key={displayCategory}>
                        <MDBox>
                            <MDButton
                                onClick={() => handleCategorySelect(displayCategory)}
                                variant="gradient"
                                size="large"
                                sx={{
                                    backgroundColor: '#50bcdf',
                                    color: '#ffffff',
                                    fontSize: isSmallScreen ? '0.8rem':'1.35rem',
                                    fontFamily: 'JalnanGothic',
                                    marginBottom: 1.5,
                                    width: '100%',
                                    padding: isSmallScreen ? '1px 2px':'4px 8px',
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

            {/*상점 내 상품 조회*/}
            <Grid container pb={10}>
                {(isCategoryFiltered && filteredItems.length === 0) ? (
                    <Grid item xs={12}>
                        <MDTypography variant="body2" textAlign="center"
                                      sx={{fontSize: isSmallScreen ? '0.9rem':'1.28rem', pt: 2}}>
                            선택한 카테고리 내 상품이 존재하지 않습니다.
                        </MDTypography>
                    </Grid>
                ) : (
                    (isCategoryFiltered ? filteredItems : items)
                    .filter(item => item.itemSellStatus !== 'SOLD_OUT')
                    .map((item, index) => (
                        <Grid item xs={12} sm={6} md={6} lg={3} key={index} ref={index === (isCategoryFiltered ? filteredItems : items).length - 1 ? lastItemElementRef : null}>
                            <MDBox pt={1} pb={1} px={1} key={shop.shopNo}>
                                <Card>
                                    <MDBox pt={2} pb={2} px={3}>
                                        <Grid container>
                                            <Grid item xs={6}>
                                                <MDTypography
                                                    sx={{fontSize: isSmallScreen ? '1.0rem':'1.28rem'}}
                                                    fontWeight="bold"
                                                    variant="body2">
                                                    {item.itemName}
                                                </MDTypography>
                                            </Grid>
                                            <Grid item xs={6}>
                                                <MDTypography
                                                    sx={{fontSize: isSmallScreen ? '1.0rem':'1.28rem'}}
                                                    variant="body2"
                                                    textAlign="right">
                                                    {item.price}
                                                </MDTypography>
                                            </Grid>
                                        </Grid>
                                        <Grid container>
                                            <Grid item xs={6}>
                                                <MDTypography
                                                    sx={{fontSize: isSmallScreen ? '0.9rem':'1.0rem'}}
                                                    variant="body2">{item.itemDetail}</MDTypography>
                                            </Grid>
                                            <Grid item xs={6} sx={{textAlign: 'right'}}>
                                                <Button
                                                    onClick={() => handleDetail(item)}
                                                    sx={{
                                                        padding: '0px 8px',
                                                        mr: '-10px',
                                                        mt: '-8px',
                                                        fontFamily: 'JalnanGothic',
                                                    }}
                                                >상세보기</Button>
                                            </Grid>
                                        </Grid>
                                        <div
                                            className="w-full flex flex-col items-center justify-center pt-2">
                                            <Grid container
                                                  alignItems="center"
                                                  justifyContent="center">
                                                {/* 이미지가 있는 경우 */}
                                                {item.imageList.length > 0 && (
                                                    <>
                                                        {item.imageList.length > 1 && (
                                                                <Grid item xs={2}
                                                                      display="flex"
                                                                      alignItems="center"
                                                                      justifyContent="center">
                                                                    <MDButton
                                                                        onClick={() => handlePreviousItemImage(index)}
                                                                        sx={{
                                                                            padding: '4px',
                                                                            minWidth: '32px',
                                                                            minHeight: '32px',
                                                                            fontSize: '16px',
                                                                        }}>
                                                                        <KeyboardArrowLeftIcon/>
                                                                    </MDButton>
                                                                </Grid>
                                                        )}
                                                        <Grid item xs={8}
                                                              display="flex"
                                                              alignItems="center"
                                                              justifyContent="center">
                                                            {currentItemImageIndices[index] !== undefined && item.imageList[currentItemImageIndices[index]] ? (
                                                                <img
                                                                    alt="product"
                                                                    width={300}
                                                                    src={`${item.imageList[currentItemImageIndices[index]].imageUrl}`}
                                                                    onClick={() => handleDetail(item)}
                                                                    style={{
                                                                        maxWidth: '100%',
                                                                        height: 'auto',
                                                                        cursor: 'pointer'
                                                                    }}
                                                                />
                                                            ) : (
                                                                <MDTypography variant="body2" color="textSecondary">
                                                                    이미지 없음
                                                                </MDTypography>
                                                            )}
                                                        </Grid>
                                                        {item.imageList.length > 1 && (
                                                            <Grid item xs={2}
                                                                  display="flex"
                                                                  alignItems="center"
                                                                  justifyContent="center">
                                                                <MDButton
                                                                    onClick={() => handleNextItemImage(index)}
                                                                    sx={{
                                                                        padding: '4px', // Reduce padding
                                                                        minWidth: '32px', // Set minimum width to make it smaller
                                                                        minHeight: '32px', // Set minimum height to make it smaller
                                                                        fontSize: '16px', // Adjust font size for smaller text
                                                                    }}>
                                                                    <KeyboardArrowRightIcon/>
                                                                </MDButton>
                                                            </Grid>
                                                        )}
                                                    </>
                                                 )}

                                                 {/* 이미지가 없는 경우 */}
                                                 {item.imageList.length === 0 && (
                                                     <Grid item xs={12}
                                                           display="flex"
                                                           alignItems="center"
                                                           justifyContent="center">
                                                         <MDTypography
                                                             variant="body2"
                                                             color="textSecondary">
                                                             이미지 없음
                                                         </MDTypography>
                                                     </Grid>
                                                 )}
                                            </Grid>
                                        </div>
                                    </MDBox>
                                </Card>
                            </MDBox>
                        </Grid>
                    ))
                )}
            </Grid>

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
                        <KeyboardArrowLeftIcon></KeyboardArrowLeftIcon>
                    </MDPagination>
                    {[...Array(itemTotalPage).keys()].map((i) => (
                        <MDPagination item key={i}
                                      onClick={() => changeItemsPage(i)}>
                            {i + 1}
                        </MDPagination>
                    ))}
                    <MDPagination item>
                        <KeyboardArrowRightIcon></KeyboardArrowRightIcon>
                    </MDPagination>
                </MDPagination>
            )} */}
        </DashboardLayout>
    );
}

export default ShopDetail;
