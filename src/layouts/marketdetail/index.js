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

export const API_SERVER_HOST = `http://localhost:8080`
const prefix = `${API_SERVER_HOST}/api/markets`

function MarketDetail() {
    const {state} = useLocation();
    const market = state; // 전달된 market 데이터를 사용
    console.log(state);
    const [page, setPage] = useState(0);

    const [likes, setLikes] = useState(0);
    const [comments, setComments] = useState([]);
    const [totalPage, setTotalPage] = useState(0);
    const [comment, setComment] = useState();

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

    const changePage = (pageNum) => {
        console.log('change pages');
        console.log(pageNum);
        console.log(page);
        setPage(pageNum);
        handleGetComments(pageNum);
    };

    // 시장 댓글 조회
    const handleGetComments = (pageNum) => {
        console.log('handleGetComments');
        axios({
            url: `${prefix}/` + market.marketNo
                + `/comments?size=5&sort=no&page=` + pageNum,
            method: 'GET'
        })
        .then((res) => {
            console.log('시장 댓글 조회 성공!!!');
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
                marketNo: market.marketNo,
                comment: comment,
            },
        })
        .then((res) => {
            console.log('댓글 작성 성공!!!');
            handleGetComments();
        })
        .catch((error) => {
            console.log(error);
        });
    };

    useEffect(() => {
        handleGetComments();
        handleLikeCounts();
    }, '');

    return (
        <DashboardLayout>
            <MDBox pt={6} pb={3}>
                <Card>
                    <MDBox pt={4} pb={3} px={3}>
                        <Grid container>
                            <Grid item xs={6}>
                                <MDTypography fontWeight="bold" variant="body2">
                                    {market.marketName}
                                </MDTypography>
                            </Grid>
                            <Grid item xs={6}>
                                <MDTypography variant="body2" textAlign="right">
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
                    </MDBox>
                </Card>
            </MDBox>

            <MDButton onClick={handleLikePost} variant="gradient" color="info">
                좋아요 👍🏻
            </MDButton>

            {comments.map((comment) => (
                <MDBox pt={2} pb={2}>
                    <Card>
                        <MDBox pt={2} pb={2} px={3}>
                            <Grid container>
                                <Grid item xs={6}>
                                    <MDTypography fontWeight="bold"
                                                  variant="body2">
                                        {comment.comment}
                                    </MDTypography>
                                </Grid>
                                <Grid item xs={6}>
                                    <MDTypography variant="body2"
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
                {[...Array(totalPage).keys()].map((i) => (
                    <MDPagination item onClick={() => changePage(i)}>
                        {i + 1}
                    </MDPagination>
                ))}
                <MDPagination item>
                    <KeyboardArrowRightIcon></KeyboardArrowRightIcon>
                </MDPagination>
            </MDPagination>


            <MDBox pt={3} pb={3}>
                <Card>
                    <MDBox component="form" role="form">
                        <MDBox pt={2} pb={2} px={3}>
                            <MDInput label="댓글" onChange={(v) => setComment(
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
        </DashboardLayout>
    );
}

export default MarketDetail;
