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
import MDInput from '../../components/MD/MDInput';
import MDButton from '../../components/MD/MDButton';
import MDPagination from '../../components/MD/MDPagination';

// Material Dashboard 2 React example components
import DashboardLayout from '../../examples/LayoutContainers/DashboardLayout';

import Button from "@mui/material/Button";
import {useNavigate} from "react-router";
import useCustomLogin from "../../hooks/useCustomLogin";
import {
    deleteShop,
    getShopComments,
    postShopComment,
    postShopLike
} from "../../api/shopApi";
import {getItemList} from "../../api/itemApi";
import FetchingModal from "../../components/common/FetchingModal";
import ResultModal from "../../components/common/ResultModal";

function ShopDetail() {
    const {isAdmin} = useCustomLogin()
    const {state} = useLocation();
    const shop = state; // 전달된 shop 데이터를 사용
    console.log(state);
    const [page, setPage] = useState(0);
    const [itemPage, setItemPage] = useState(0);

    const [likes, setLikes] = useState(0);
    const [comments, setComments] = useState([]);
    const [totalPage, setTotalPage] = useState(0);
    const [comment, setComment] = useState('');
    const [items, setItems] = useState([]);
    const [itemTotalPage, setItemTotalPage] = useState(0);

    const [fetching, setFetching] = useState(false)
    const [result, setResult] = useState(null)

    const navigate = useNavigate();

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

    const changePage = (pageNum) => {
        console.log('change pages');
        console.log(pageNum);
        console.log(page);
        setPage(pageNum);
        handleGetComments(pageNum);
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

    // 상점 댓글
    const handleWriteComment = () => {
        console.log('handleWriteComment');
        const data = {shopNo: shop.shopNo, comment: comment}
        postShopComment(data).then(data => {
            console.log('상점 댓글 작성 성공!!!');
            console.log(data);
            //setComment(''); // 댓글 입력란 초기화
            handleGetComments();
        }).catch(error => {
            console.error("시장 댓글 작성에 실패했습니다.", error);
        });
    };

    const handleGetComments = (pageNum) => {
        console.log('handleGetComments');
        const pageParam = {page: pageNum, size: 2};
        console.log('handleGetComments');
        getShopComments(shop.shopNo, pageParam).then(data => {
            setComments(data.content);
            setTotalPage(data.totalPages);
        }).catch(error => {
            console.error("상점 댓글 조회에 실패했습니다.", error);
        });
    };

    // 시장 좋아요
    const handlePostLike = () => {
        postShopLike(shop.shopNo).then(data => {
            console.log('좋아요 성공!!!');
            handleLikeCounts();
        }).catch(error => {
            console.error("상점 좋아요에 실패했습니다.", error);
        });
    };

    const handleLikeCounts = () => {
        setLikes(shop.likes);
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
        }).catch(error => {
            console.error("상품 조회에 실패했습니다.", error);
        });
    };

    const closeModal = () => { //ResultModal 종료
        setResult(null)
        navigate('/market')
    }

    useEffect(() => {
        console.log("isAdmin : " + isAdmin)

        handleGetComments();
        handleLikeCounts();
        handleGetItems();
    }, []);

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
                <Grid item xs={7}>
                    <MDBox pt={3} pb={3}>
                        <Card>
                            <MDBox pt={2} pb={3} px={3}>
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
                                            {shop.postCode}
                                        </MDTypography>
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
                                <MDTypography
                                    variant="body2">{shop.streetAddr}</MDTypography>
                                <MDTypography
                                    variant="body2">{likes} LIKES</MDTypography>

                                <Grid container>
                                    <Grid item xs={1.4}>
                                        <MDButton onClick={handlePostLike}
                                                  variant="gradient"
                                                  sx={{fontFamily: 'JalnanGothic'}}
                                                  color="info">
                                            좋아요 👍🏻
                                        </MDButton>
                                    </Grid>
                                    {isAdmin && ( // 관리자일 때 버튼 생성
                                        <>
                                            <Grid item xs={1.4}>
                                                <MDButton
                                                    variant="gradient"
                                                    color="light"
                                                    sx={{fontFamily: 'JalnanGothic'}}
                                                    onClick={() => handleModifyShop(
                                                        shop)}>상점 수정
                                                </MDButton>
                                            </Grid>
                                            <Grid item xs={1.4}>
                                                <MDButton
                                                    variant="gradient"
                                                    color="light"
                                                    sx={{fontFamily: 'JalnanGothic'}}
                                                    onClick={() => handleDeleteShop(
                                                        shop.shopNo)}>상점 삭제
                                                </MDButton>
                                            </Grid>
                                            <Grid item xs={1.4}>
                                                <MDButton
                                                    variant="gradient"
                                                    color="success"
                                                    sx={{fontFamily: 'JalnanGothic'}}
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

                <Grid item xs={5}>
                    <MDBox pt={3} pb={3}>
                        <Card>
                            <MDBox component="form" role="form">
                                <MDBox pt={2} pb={2} px={3}>
                                    {comments.map((comment) => (
                                        <MDBox pt={2} pb={2}>
                                            <Card>
                                                <MDBox pt={2} pb={2} px={3}>
                                                    <Grid container>
                                                        <Grid item xs={6}>
                                                            <MDTypography
                                                                fontWeight="bold"
                                                                variant="body2">
                                                                {comment.comment}
                                                            </MDTypography>
                                                        </Grid>
                                                        <Grid item xs={6}>
                                                            <MDTypography
                                                                variant="body2"
                                                                textAlign="right">
                                                                {comment.username}
                                                            </MDTypography>
                                                        </Grid>
                                                    </Grid>
                                                    <MDTypography
                                                        variant="body2">{comment.body}</MDTypography>
                                                </MDBox>
                                            </Card>
                                        </MDBox>
                                    ))}
                                    <MDPagination>
                                        <MDPagination item>
                                            <KeyboardArrowLeftIcon></KeyboardArrowLeftIcon>
                                        </MDPagination>
                                        {[...Array(totalPage).keys()].map(
                                            (i) => (
                                                <MDPagination item
                                                              key={i}
                                                              onClick={() => changePage(
                                                                  i)}>
                                                    {i + 1}
                                                </MDPagination>
                                            ))}
                                        <MDPagination item>
                                            <KeyboardArrowRightIcon></KeyboardArrowRightIcon>
                                        </MDPagination>
                                    </MDPagination>

                                    <MDInput label="댓글"
                                             onChange={(v) => setComment(
                                                 v.target.value)} fullWidth/>
                                </MDBox>
                                <MDBox pt={2} pb={2} px={3} right>
                                    <MDButton onClick={handleWriteComment}
                                              variant="gradient" color="info">
                                        댓글
                                    </MDButton>
                                </MDBox>
                            </MDBox>
                        </Card>
                    </MDBox>
                </Grid>
            </Grid>

            <Grid container pt={3} pb={3}>
                {items.map((item) => (
                    <MDBox pt={2} pb={2} px={3}>
                        <Card>
                            <MDBox pt={2} pb={2} px={3}>
                                <Grid container>
                                    <Grid item xs={6}>
                                        <MDTypography fontWeight="bold"
                                                      variant="body2">
                                            {item.itemName}
                                        </MDTypography>
                                    </Grid>
                                    <Grid item xs={6}>
                                        <MDTypography variant="body2"
                                                      textAlign="right">
                                            {item.price}
                                        </MDTypography>
                                    </Grid>
                                </Grid>
                                <MDTypography
                                    variant="body2">{item.itemDetail}</MDTypography>
                                <Grid container>
                                    <Grid item xs={10}></Grid>
                                    <Grid item xs={1}>
                                        <Button onClick={() => handleDetail(
                                            item)}>Detail</Button>
                                    </Grid>
                                </Grid>
                                <div
                                    className="w-full justify-center flex flex-col m-auto items-center">
                                    {item.imageList.map((imgUrl, i) =>
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
        </DashboardLayout>
    );
}

export default ShopDetail;
