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
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogActions from "@mui/material/DialogActions";
import {useNavigate} from "react-router";
import {TransitionProps} from "@mui/material/transitions";
import Slide from "@mui/material/Slide";

export const API_SERVER_HOST = `http://localhost:8080`
const prefix = `${API_SERVER_HOST}/api/markets`
const shopPrefix = `${API_SERVER_HOST}/api/shops`

const Transition = React.forwardRef(function Transition(
    props: TransitionProps & {
        children: React.ReactElement<any, any>,
    },
    ref: React.Ref<unknown>,
) {
    return <Slide direction="up" ref={ref} {...props} />;
});

function ShopLIVESTOCKDetail() {
    const {state} = useLocation();
    const market = state; // 전달된 market 데이터를 사용
    console.log(state);
    const [page, setPage] = useState(0);
    const [shopPage, setShopPage] = useState(0);

    const [likes, setLikes] = useState(0);
    const [comments, setComments] = useState([]);
    const [commentTotalPage, setCommentTotalPage] = useState(0);
    const [comment, setComment] = useState('');
    const [shopTotalPage, setShopTotalPage] = useState(0);

    const [open, setOpen] = React.useState(false);
    const [dialogTitle, setDialogTitle] = React.useState('');
    const [dialogMessage, setDialogMessage] = React.useState('');
    const navigate = useNavigate();

    const [categoryShop, setCategoryShop] = useState([]);

    //const [currentCategory, setCurrentCategory] = useState('');

    const changeCommentPage = (pageNum) => {
        console.log('change pages');
        console.log(pageNum);
        console.log(page);
        setPage(pageNum);
        handleGetComments(pageNum);
    };

    const changeShopPage = (pageNum) => {
        console.log('change pages');
        console.log(pageNum);
        console.log(shopPage);
        setShopPage(pageNum);
        handleGetCategoryShop(pageNum);
    };

    const handleDetail = (shop) => {
        console.log('handleDetail');
        console.log("shop!!!!!!!!!!!" + shop);
        navigate('/shop-detail', {state: shop});
    };
    const handleClose = () => {
        setOpen(false);
    };

    const handleLikePost = () => {
        axios({
            url: `${prefix}/` + market.marketNo + `/likes`,
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
            url: `${prefix}/` + market.marketNo + `/likes`,
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

    // 시장 댓글 조회
    const handleGetComments = (pageNum) => {
        console.log('handleGetComments');
        axios({
            url: `${prefix}/` + market.marketNo
                + `/comments?size=2&sort=no&page=` + pageNum,
            method: 'GET'
        })
        .then((res) => {
            console.log('시장 댓글 조회 성공!!!');
            console.log(res);
            setComments(res.data.content);
            setCommentTotalPage(res.data.totalPages);
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
                marketNo: market.marketNo,
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

    const handleGetCategoryShop = (pageNum) => {
        console.log('handleGetCategoryShop');
        let LIVESTOCK = 'LIVESTOCK';
        axios({
            url: `${shopPrefix}/category?category=` + LIVESTOCK
                + `&size=8&sort=no&page=` + pageNum,
            method: 'GET',
        })
        .then((res) => {
            console.log('상점 조회 성공!!!');
            console.log(res);
            setCategoryShop(res.data.content);
            setShopTotalPage(res.data.totalPages);
        })
        .catch((error) => {
            console.log(error);
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

    useEffect(() => {
        handleGetComments();
        handleLikeCounts();
        handleGetCategoryShop();
    }, '');

    return (
        <DashboardLayout>
            <Grid container spacing={2}>
                <Grid item xs={7}>
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
                                    {market.imageList.map((imgUrl, i) =>
                                        <img
                                            alt="product" key={i}
                                            width={300}
                                            src={`${imgUrl.imageUrl}`}/>
                                    )}
                                </div>
                                <MDTypography
                                    variant="body2">{market.marketDetail}</MDTypography>
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
                                        {[...Array(
                                            commentTotalPage).keys()].map(
                                            (i) => (
                                                <MDPagination item
                                                              onClick={() => changeCommentPage(
                                                                  i)}>{i + 1}
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
                {categoryShop.map((shop) => (
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

                <Dialog
                    open={open}
                    TransitionComponent={Transition}
                    keepMounted
                    onClose={handleClose}
                    aria-describedby="alert-dialog-slide-description"
                >
                    <DialogTitle>{dialogTitle}</DialogTitle>
                    <DialogContent>
                        <DialogContentText id="alert-dialog-slide-description">
                            {dialogMessage}
                        </DialogContentText>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={handleClose}>OK</Button>
                    </DialogActions>
                </Dialog>
            </Grid>

            <MDPagination>
                <MDPagination item>
                    <KeyboardArrowLeftIcon></KeyboardArrowLeftIcon>
                </MDPagination>
                {[...Array(shopTotalPage).keys()].map((i) => (
                    <MDPagination item onClick={() => changeShopPage(i)}>
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

export default ShopLIVESTOCKDetail;
