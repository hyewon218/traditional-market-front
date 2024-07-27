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

import {useNavigate} from "react-router";
import useCustomCart from "../../hooks/useCustomCart";
import useCustomLogin from "../../hooks/useCustomLogin";
import {
    deleteItem,
    getItemComments,
    postItemComment,
    postItemLike
} from "../../api/itemApi";
import FetchingModal from "../../components/common/FetchingModal";
import ResultModal from "../../components/common/ResultModal";

function ItemDetail() {
    const [isAdmin, setIsAdmin] = useState(false);
    const {state} = useLocation();
    const item = state; // 전달된 shop 데이터를 사용
    console.log(state);
    const [page, setPage] = useState(0);

    const [likes, setLikes] = useState(0);
    const [comments, setComments] = useState([]);
    const [totalPage, setTotalPage] = useState(0);
    const [comment, setComment] = useState('');

    const [fetching, setFetching] = useState(false)
    const [result, setResult] = useState(null)

    const navigate = useNavigate();

    //장바구니 기능
    const {addCart} = useCustomCart()
    //로그인 정보
    const {loginState} = useCustomLogin()

    const handleModifyItem = (item) => {
        console.log('handleModify');
        navigate('/modify-item', {state: item});
    };

    const handleDeleteItem = (ino) => {
        console.log('handleDelete');
        setFetching(true)
        deleteItem(ino).then(data => {
            setFetching(false) //데이터 가져온 후 화면에서 사라지도록
            setResult(data)
        }).catch(error => {
            console.error("상품 삭제에 실패했습니다.", error);
            setResult({success: false, message: "상점 삭제에 실패했습니다."});
        });
    };

    const changePage = (pageNum) => {
        console.log('change pages');
        console.log(pageNum);
        console.log(page);
        setPage(pageNum);
        handleGetComments(pageNum);
    };

    // 상품 댓글
    const handleWriteComment = () => {
        console.log('handleWriteComment');
        const data = {itemNo: item.itemNo, comment: comment}
        postItemComment(data).then(data => {
            console.log('상품 댓글 작성 성공!!!');
            console.log(data);
            //setComment(''); // 댓글 입력란 초기화
            handleGetComments();
        }).catch(error => {
            console.error("상품 댓글 작성에 실패했습니다.", error);
        });
    };

    const handleGetComments = (pageNum) => {
        console.log('handleGetComments');
        const pageParam = {page: pageNum, size: 2};
        getItemComments(item.itemNo, pageParam).then(data => {
            console.log('상품 댓글 조회 성공!!!');
            setComments(data.content);
            setTotalPage(data.totalPages);
        }).catch(error => {
            console.error("상점 댓글 조회에 실패했습니다.", error);
        });
    };

    // 상품 좋아요
    const handlePostLike = () => {
        postItemLike(item.itemNo).then(data => {
            console.log('좋아요 성공!!!');
            handleLikeCounts();
        }).catch(error => {
            console.error("상품 좋아요에 실패했습니다.", error);
        });
    };

    const handleLikeCounts = () => {
        setLikes(item.likes);
    };

    // 장바구니에 추가
    const handleClickAddCart = () => {
        let count = 1
        addCart(
            {memberId: loginState.memberId, itemNo: item.itemNo, count: count})
        const userConfirmed = window.confirm("장바구니에 추가되었습니다. 장바구니로 이동하시겠습니까?")
        if (userConfirmed) {
            navigate('/cart') // 장바구니로 이동
        }
    }

    // 주문하기
    const handleGoOrder = () => {
        navigate('/', {state: item});
    };

    const buttonStyle = {
        backgroundColor: '#50bcdf',
        color: '#ffffff',
        fontSize: '2rem',
        fontFamily: 'JalnanGothic',
        padding: '20px 40px',
        width: '330px',
    };

    const closeModal = () => { //ResultModal 종료
        setResult(null)
        navigate('/post-detail')
    }

    useEffect(() => {
        const isAdmin = loginState.role === 'ADMIN';
        setIsAdmin(isAdmin); // setIsAdmin 을 사용하여 상태를 업데이트

        handleGetComments();
        handleLikeCounts();
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
                                <div
                                    className="w-full justify-center flex flex-col m-auto items-center">
                                    {item.imageList.map((imgUrl, i) =>
                                        <img
                                            alt="product" key={i}
                                            width={300}
                                            src={`${imgUrl.imageUrl}`}/>
                                    )}
                                </div>
                                <MDTypography
                                    variant="body2">{item.itemDetail}</MDTypography>
                                <MDTypography
                                    variant="body2">{likes} LIKES</MDTypography>
                                <MDButton onClick={handlePostLike}
                                          variant="gradient"
                                          color="info">
                                    좋아요 👍🏻
                                </MDButton>
                                {isAdmin && ( // 관리자일 때 버튼 생성
                                    <>
                                        <MDButton
                                            variant="gradient"
                                            color="warning"
                                            onClick={() => handleModifyItem(
                                                item)}>상품 수정
                                        </MDButton>
                                        <MDButton
                                            variant="gradient"
                                            color="warning"
                                            onClick={() => handleDeleteItem(
                                                item.itemNo)}>상품 삭제
                                        </MDButton>
                                    </>
                                )}
                            </MDBox>
                        </Card>
                    </MDBox>
                </Grid>

                {/*댓글*/}
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

            <Grid container spacing={2} justifyContent="right">
                <Grid item xs={2.45}>
                    <div style={{
                        display: 'flex',
                        justifyContent: 'center'
                    }}>
                        <MDButton onClick={handleClickAddCart}
                                  variant="gradient"
                                  size="large"
                                  sx={buttonStyle}
                        >장바구니
                        </MDButton>
                    </div>
                </Grid>
                <Grid item xs={2.45}>
                    <MDBox>
                        <div style={{
                            display: 'flex',
                            justifyContent: 'center'
                        }}>
                            <MDButton onClick={handleGoOrder}
                                      variant="gradient"
                                      size="large"
                                      sx={buttonStyle}
                            >구매하기
                            </MDButton>
                        </div>
                    </MDBox>
                </Grid>
            </Grid>
        </DashboardLayout>
);
}

export default ItemDetail;
