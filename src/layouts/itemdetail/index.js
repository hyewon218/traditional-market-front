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

import axios from 'axios';
import {useNavigate} from "react-router";
import {TransitionProps} from "@mui/material/transitions";
import Slide from "@mui/material/Slide";
import useCustomCart from "../../hooks/useCustomCart";
import useCustomLogin from "../../hooks/useCustomLogin";

export const API_SERVER_HOST = `http://localhost:8080`
const prefix = `${API_SERVER_HOST}/api/items`

const Transition = React.forwardRef(function Transition(
    props: TransitionProps & {
        children: React.ReactElement<any, any>,
    },
    ref: React.Ref<unknown>,
) {
    return <Slide direction="up" ref={ref} {...props} />;
});

function ShopDetail() {
    const {state} = useLocation();
    const item = state; // 전달된 shop 데이터를 사용
    console.log(state);
    const [page, setPage] = useState(0);

    const [likes, setLikes] = useState(0);
    const [comments, setComments] = useState([]);
    const [totalPage, setTotalPage] = useState(0);
    const [comment, setComment] = useState('');

    const navigate = useNavigate();


    //장바구니 기능
    const {addCart} = useCustomCart()
    //로그인 정보
    const {loginState} = useCustomLogin()

    const changePage = (pageNum) => {
        console.log('change pages');
        console.log(pageNum);
        console.log(page);
        setPage(pageNum);
        handleGetComments(pageNum);
    };

    const handleLikePost = () => {
        axios({
            url: `${prefix}/` + item.itemNo + `/likes`,
            method: 'POST'
        })
        .then((res) => {
            console.log('좋아요 성공!!!');
            handleLikeCounts();
        })
        .catch((error) => {
            console.log(error);
        });
    };

    const handleLikeCounts = () => {
        axios({
            url: `${prefix}/` + item.itemNo + `/likes`,
            method: 'GET'
        })
        .then((res) => {
            console.log('좋아요 갯수 조회 성공!!!');
            console.log(res);
            setLikes(res.data);
        })
        .catch((error) => {
            console.log(error);
        });
    };

    // 상품 댓글 조회
    const handleGetComments = (pageNum) => {
        console.log('handleGetComments');
        axios({
            url: `${prefix}/` + item.itemNo
                + `/comments?size=3&sort=no&page=` + pageNum,
            method: 'GET'
        })
        .then((res) => {
            console.log('상품 댓글 조회 성공!!!');
            console.log(res);
            setComments(res.data.content);
            setTotalPage(res.data.totalPages);
        })
        .catch((error) => {
            console.log(error);
        });
    };

    const handleWriteComment = () => {
        console.log('handleWriteComment');
        axios({
            url: `${prefix}/comments`,
            method: 'POST',
            data: {
                itemNo: item.itemNo,
                comment: comment,
            },
        })
        .then((res) => {
            console.log('댓글 작성 성공!!!');
            //setComment(''); // 댓글 입력란 초기화
            handleGetComments();
        })
        .catch((error) => {
            console.log(error);
        });
    };



    const handleClickAddCart = () => {
        let count = 1

        addCart({memberId: loginState.memberId, itemNo: item.itemNo, count: count})

        window.confirm("장바구니에 추가되었습니다.")
    }

    const handleGoOrder = () => {
        navigate('/shop-AGRI-detail', {state: item});
    };

    const buttonStyle = {
        backgroundColor: '#50bcdf',
        color: '#ffffff',
        fontSize: '2rem',
        fontFamily: 'JalnanGothic',
        padding: '20px 40px',
        width: '330px',
    };

    useEffect(() => {
        handleGetComments();
        handleLikeCounts();
    }, '');

    return (
        <DashboardLayout>
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
                                <MDButton onClick={handleLikePost}
                                          variant="gradient"
                                          color="info">
                                    좋아요 👍🏻
                                </MDButton>
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
                    <MDButton onClick={handleClickAddCart}
                              variant="gradient"
                              size="large"
                              sx={buttonStyle}
                    >장바구니
                    </MDButton>

                </Grid>
                <Grid item xs={2.45}>
                    <MDBox>
                        <MDButton onClick={handleGoOrder}
                                  variant="gradient"
                                  size="large"
                                  sx={buttonStyle}
                        >구매하기
                        </MDButton>
                    </MDBox>
                </Grid>
            </Grid>

        </DashboardLayout>
    );
}

export default ShopDetail;
