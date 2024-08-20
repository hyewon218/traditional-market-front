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
    cancelShopLike,
    deleteShop,
    getShopLike,
    getShopLikeCount,
    postShopLike,
} from "../../api/shopApi";
import {getItemList, getListCategoryByShop} from "../../api/itemApi";
import FetchingModal from "../../components/common/FetchingModal";
import ResultModal from "../../components/common/ResultModal";
import ShopMapComponent from "../../components/map/ShopMapComponent"; // 상점 위치 출력

const categoryMapping = {
    "전체": '전체',
    "과일": '과일',
    "채소": '채소',
    "육류": '육류',
    "생선": '생선',
};

function ShopDetail() {
    const {isAdmin, isAuthorization} = useCustomLogin()
    const {state} = useLocation();
    const shop = state; // 전달된 shop 데이터를 사용
    console.log(state);

    const [itemPage, setItemPage] = useState(0);

    const [likes, setLikes] = useState(0);
    const [liked, setLiked] = useState(false); // 좋아요 여부 확인

    const [items, setItems] = useState([]);
    const [itemTotalPage, setItemTotalPage] = useState(0);

    const [fetching, setFetching] = useState(false)
    const [result, setResult] = useState(null)

    const [currentItemImageIndices, setCurrentItemImageIndices] = useState([]);

    const [selectedCategory, setSelectedCategory] = useState(''); // 선택된 카테고리
    const [filteredItems, setFilteredItems] = useState([]); // 시장 카테고리 조회
    const [categoryTotalPage, setCategoryTotalPage] = useState(0); // 검색 시장 조회 페이지
    const [isCategoryFiltered, setIsCategoryFiltered] = useState(false);// 카테고리 필터 활성화되었는지 확인

    const navigate = useNavigate();

    useEffect(() => {
        handleCountLikes();
        handleCheckLike();
    }, []);

    useEffect(() => {
        if (isCategoryFiltered && selectedCategory) {
            handleGetCategoryItems(0);
        } else {
            handleGetItems(itemPage);
        }
    }, [selectedCategory, isCategoryFiltered]);

    const handleModifyShop = (shop) => {
        console.log('handleModify');
        navigate('/modify-shop', {state: shop});
    };

    const handleDeleteShop = (sno) => {
        console.log('handleDelete');
        setFetching(true)
        deleteShop(sno).then(data => {
            setFetching(false) //데이터 가져온 후 화면에서 사라지도록
            setResult(data)
        }).catch(error => {
            console.error("상점 삭제에 실패했습니다.", error);
            setResult({success: false, message: "상점 삭제에 실패했습니다."});
        });
    };

    const handleAddItem = (shop) => {
        console.log('handleAddShop');
        navigate('/post-item', {state: shop})
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
        getShopLikeCount().then(data => {
            console.log('상점 댓글 조회 성공!!!');
            setLikes(data);
        }).catch(error => {
            console.error("상점 댓글 조회에 실패했습니다.", error);
        });
    };

    // 상점 내 상품 목록
    const handleGetItems = (pageNum) => {
        console.log('handleGetItems');
        const pageParam = {page: pageNum, size: 8};
        getItemList(shop.shopNo, pageParam).then(data => {
            console.log('상품 조회 성공!!!');
            console.log(data);
            setItems(data.content);
            setItemTotalPage(data.totalPages);
            setSelectedCategory('');
            setIsCategoryFiltered(false); // Reset filter
            setCurrentItemImageIndices(Array(data.content.length).fill(0)); // 상품 이미지 인덱스 초기화
        }).catch(error => {
            console.error("상품 조회에 실패했습니다.", error);
        });
    };

    /*카테고리 선택*/
    const handleCategorySelect = (category) => {
        if (category === "전체") {
            handleGetItems(0);
        } else {
            const mappedCategory = categoryMapping[category] || '';
            setSelectedCategory(mappedCategory);
            console.log("mappedCategory!???!?" + mappedCategory);
            setIsCategoryFiltered(true); // Set filter active
        }
    };

    /*상점 내 상품 카테고리 조회*/
    const handleGetCategoryItems = (pageNum) => {
        console.log('handleGetCategoryShops');
        //console.log('Selected Category:', selectedCategory); // Debugging line
        const pageParam = {page: pageNum, size: 8};
        getListCategoryByShop(shop.shopNo, pageParam, selectedCategory).then(
            data => {
                setFilteredItems(data.content);
                setCategoryTotalPage(data.totalPages);
            }).catch(error => {
            console.error("시장 카테고리 조회에 실패했습니다.", error);
        });
    };

    const closeModal = () => { //ResultModal 종료
        setResult(null)
        navigate('/market')
    }

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
    const shouldShowPagination = !isCategoryFiltered || filteredItems.length
        > 0;

    // 상점 위치 정보 (위도, 경도) 배열
    const locations = [
        {
            latitude: shop.shopLat, // 상점의 위도
            longitude: shop.shopLng, // 상점의 경도
            info: shop.shopName, // 상점 이름
            tel: shop.tel // 상점 전화번호
        }
    ];

    return (
        <DashboardLayout>
            {fetching ? <FetchingModal/> : <></>}

            {result ?
                <ResultModal
                    title={'상점 삭제 결과'}
                    content={`삭제 완료`}
                    callbackFn={closeModal}
                />
                : <></>
            }
            <Grid container spacing={2}>
                <Grid item xs={6}>
                    <MDBox pt={0} pb={3}>
                        <Card>
                            <MDBox pt={3} pb={3} px={3}>
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
                                            {shop.shopAddr}
                                        </MDTypography>
                                    </Grid>
                                </Grid>
                                <Grid container>
                                    <Grid item xs={12}>
                                        <div
                                            className="w-full justify-center flex flex-col m-auto items-center">
                                            {shop.imageList.map((imgUrl, i) =>
                                                <img
                                                    alt="product" key={i}
                                                    width={230}
                                                    src={`${imgUrl.imageUrl}`}/>
                                            )}
                                        </div>
                                    </Grid>
                                </Grid>
                                <MDTypography
                                    variant="body2"
                                    sx={{
                                        fontSize: '0.75rem',
                                        marginLeft: '8px'
                                    }}
                                >{likes} LIKES</MDTypography>

                                <Grid container>
                                    <Grid item xs={1.5}>
                                        <MDButton
                                            onClick={handlePostOrCancelLike}
                                            variant="gradient"
                                            sx={{
                                                fontFamily: 'JalnanGothic',
                                                fontSize: '0.75rem',
                                                padding: '4px 8px',
                                            }}
                                            color="info">
                                            좋아요 👍🏻
                                        </MDButton>
                                    </Grid>
                                    {isAdmin && ( // 관리자일 때 버튼 생성
                                        <>
                                            <Grid item xs={1.5}>
                                                <MDButton
                                                    variant="gradient"
                                                    color="light"
                                                    sx={{
                                                        fontFamily: 'JalnanGothic',
                                                        padding: '4px 8px',
                                                    }}
                                                    onClick={() => handleModifyShop(
                                                        shop)}>상점 수정
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
                                                    onClick={() => handleDeleteShop(
                                                        shop.shopNo)}>상점 삭제
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
                                                    onClick={() => handleAddItem(
                                                        shop)}>상품 추가
                                                </MDButton>
                                            </Grid>
                                        </>
                                    )}
                                </Grid>
                            </MDBox>
                        </Card>
                    </MDBox>
                </Grid>


                {/* 지도 */}
                <Grid item xs={6}>
                    <Card style={{height: '285px'}}>
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
            <Grid container spacing={0.1} justifyContent="center">
                {Object.keys(categoryMapping).map((displayCategory) => (
                    <Grid item xs={1.1}
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
                                    fontSize: '1.35rem',
                                    fontFamily: 'JalnanGothic',
                                    marginBottom: 1.5
                                }}
                            >
                                {displayCategory}
                            </MDButton>
                        </MDBox>
                    </Grid>
                ))}
            </Grid>

            {/*상점 내 상품 조회*/}
            <Grid container pt={0} pb={3}>
                {(isCategoryFiltered && filteredItems.length === 0) ? (
                    <Grid item xs={12}>
                        <MDTypography variant="body2" textAlign="center"
                                      sx={{fontSize: '1.28rem', pt: 2}}>
                            선택한 카테고리 내 상점이 존재하지 않습니다.
                        </MDTypography>
                    </Grid>
                ) : (
                    (isCategoryFiltered ? filteredItems : items)
                    .filter(item => item.itemSellStatus !== 'SOLD_OUT')
                    .map((item, index) => (
                        <Grid item xs={12} sm={6} md={4} lg={3} key={index}>
                            <MDBox pt={1} pb={1} px={1} key={shop.shopNo}>
                                <Card>
                                    <MDBox pt={2} pb={2} px={2}>
                                        <Grid container>
                                            <Grid item xs={6}>
                                                <MDTypography
                                                    fontWeight="bold"
                                                    variant="body2">
                                                    {item.itemName}
                                                </MDTypography>
                                            </Grid>
                                            <Grid item xs={6}>
                                                <MDTypography
                                                    variant="body2"
                                                    textAlign="right">
                                                    {item.price}
                                                </MDTypography>
                                            </Grid>
                                        </Grid>
                                        <Grid container>
                                            <Grid item xs={6}>
                                                <MDTypography
                                                    variant="body2">{item.itemDetail}</MDTypography>
                                            </Grid>
                                            <Grid item xs={6}
                                                  sx={{textAlign: 'right'}}>
                                                <Button
                                                    onClick={() => handleDetail(
                                                        item)}
                                                    sx={{
                                                        padding: '4px 8px',
                                                        mr: '-10px'
                                                    }}
                                                >Detail</Button>
                                            </Grid>
                                        </Grid>
                                        <div
                                            className="w-full flex flex-col items-center justify-center pt-2">
                                            <Grid container
                                                  alignItems="center"
                                                  justifyContent="center">
                                                {item.imageList.length > 1
                                                    && (
                                                        <Grid item xs={2}
                                                              display="flex"
                                                              alignItems="center"
                                                              justifyContent="center">
                                                            <MDButton
                                                                onClick={() => handlePreviousItemImage(
                                                                    index)}>
                                                                <KeyboardArrowLeftIcon/>
                                                            </MDButton>
                                                        </Grid>
                                                    )}
                                                <Grid item xs={8}
                                                      display="flex"
                                                      alignItems="center"
                                                      justifyContent="center">
                                                    <img
                                                        alt="product"
                                                        width={300}
                                                        src={`${item.imageList[currentItemImageIndices[index]].imageUrl}`}
                                                        style={{
                                                            maxWidth: '100%',
                                                            height: 'auto'
                                                        }}
                                                    />
                                                </Grid>
                                                {item.imageList.length > 1
                                                    && (
                                                        <Grid item xs={2}
                                                              display="flex"
                                                              alignItems="center"
                                                              justifyContent="center">
                                                            <MDButton
                                                                onClick={() => handleNextItemImage(
                                                                    index)}>
                                                                <KeyboardArrowRightIcon/>
                                                            </MDButton>
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

            {shouldShowPagination && (
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
            )}
        </DashboardLayout>
    );
}

export default ShopDetail;
