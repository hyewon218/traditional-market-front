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
    cancelShopLike,
    deleteShop,
    deleteShopComment,
    getShopComments,
    getShopLike,
    postShopComment,
    postShopLike,
    putShopComment
} from "../../api/shopApi";
import {getItemList} from "../../api/itemApi";
import FetchingModal from "../../components/common/FetchingModal";
import ResultModal from "../../components/common/ResultModal";

function ShopDetail() {
    const {isAdmin, isAuthorization, userId} = useCustomLogin()
    const {state} = useLocation();
    const shop = state; // 전달된 shop 데이터를 사용
    const [page, setPage] = useState(0);
    const [itemPage, setItemPage] = useState(0);

    const [likes, setLikes] = useState(0);
    const [liked, setLiked] = useState(false); // 좋아요 여부 확인
    const [comments, setComments] = useState([]);
    const [totalPage, setTotalPage] = useState(0);
    const [comment, setComment] = useState('');
    const [items, setItems] = useState([]);
    const [itemTotalPage, setItemTotalPage] = useState(0);

    const [fetching, setFetching] = useState(false)
    const [result, setResult] = useState(null)

    const [currentItemImageIndices, setCurrentItemImageIndices] = useState([]);

    const [editingCommentId, setEditingCommentId] = useState(null); // State to manage editing mode
    const [editingCommentText, setEditingCommentText] = useState(''); // State to manage the current comment text being edited

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
        if (!isAuthorization) {
            alert("로그인이 필요합니다.");
            return;
        }
        if (!comment.trim()) { // 댓글 필드 비어있는지 확인
            alert("댓글을 작성해주세요.");
            return;
        }

        console.log('handleWriteComment');
        const data = {shopNo: shop.shopNo, comment: comment}
        postShopComment(data).then(data => {
            console.log('상점 댓글 작성 성공!!!');
            console.log(data);
            setComment(''); // 댓글 입력란 초기화
            handleGetComments();
        }).catch(error => {
            console.error("시장 댓글 작성에 실패했습니다.", error);
        });
    };

    const handleGetComments = (pageNum) => {
        console.log('handleGetComments');
        const pageParam = {page: pageNum, size: 3};
        console.log('handleGetComments');
        getShopComments(shop.shopNo, pageParam).then(data => {
            setComments(data.content);
            setTotalPage(data.totalPages);
        }).catch(error => {
            console.error("상점 댓글 조회에 실패했습니다.", error);
        });
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
            setCurrentItemImageIndices(Array(data.content.length).fill(0)); // 상품 이미지 인덱스 초기화
        }).catch(error => {
            console.error("상품 조회에 실패했습니다.", error);
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

    const handleEditComment = (commentId, text) => {
        setEditingCommentId(commentId);
        setEditingCommentText(text);
    };

    const handleUpdateComment = (commentNo, updatedComment) => {
        if (!updatedComment.trim()) { // 댓글 필드 비어있는지 확인
            alert("댓글을 작성해주세요.");
            return;
        }
        putShopComment(commentNo, updatedComment).then(data => {
            console.log('댓글 수정 성공:', data);
            setComments((prevComments) =>
                prevComments.map((comment) =>
                    comment.id === commentNo ? {
                        ...comment,
                        comment: updatedComment
                    } : comment
                )
            );
        }).catch(error => {
            console.error("상점 댓글 수정에 실패했습니다.", error);
        });

        setEditingCommentId(null);
        setEditingCommentText('');
    };

    const handleDeleteComment = (commentNo) => {
        const confirmed = window.confirm('댓글을 삭제하시겠습니까?');
        if (!confirmed) {
            return; // If the user cancels, do nothing
        }
        deleteShopComment(commentNo).then(data => {
            console.log('댓글 삭제 성공:', data);
            setComments((prevComments) =>
                prevComments.filter((comment) => comment.id !== commentNo)
            );
        }).catch(error => {
            console.error("상점 댓글 삭제에 실패했습니다.", error);
        });

        setEditingCommentId(null);
        setEditingCommentText('');
    };

    useEffect(() => {
        //console.log("isAdmin : " + isAdmin)
        handleCountLikes();
        handleCheckLike();
        handleGetComments();
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
                <Grid item xs={6}>
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
                                            {shop.shopAddr}
                                        </MDTypography>
                                    </Grid>
                                </Grid>
                                <div
                                    className="w-full justify-center flex flex-col m-auto items-center">
                                    {shop.imageList.map((imgUrl, i) =>
                                        <img
                                            alt="product" key={i}
                                            width={250}
                                            src={`${imgUrl.imageUrl}`}/>
                                    )}
                                </div>
                                <MDTypography
                                    variant="body2">{likes} LIKES</MDTypography>

                                <Grid container>
                                    <Grid item xs={1.6}>
                                        <MDButton
                                            onClick={handlePostOrCancelLike}
                                            variant="gradient"
                                            sx={{
                                                fontFamily: 'JalnanGothic',
                                                fontSize: '0.75rem',  // Adjust font size
                                                padding: '4px 8px',   // Adjust padding (top-bottom left-right)
                                            }}
                                            color="info">
                                            좋아요 👍🏻
                                        </MDButton>
                                    </Grid>
                                    {isAdmin && ( // 관리자일 때 버튼 생성
                                        <>
                                            <Grid item xs={1.6}>
                                                <MDButton
                                                    variant="gradient"
                                                    color="light"
                                                    sx={{
                                                        fontFamily: 'JalnanGothic',
                                                        padding: '10px 8px',   // Adjust padding (top-bottom left-right)
                                                    }}
                                                    onClick={() => handleModifyShop(
                                                        shop)}>상점 수정
                                                </MDButton>
                                            </Grid>
                                            <Grid item xs={1.6}>
                                                <MDButton
                                                    variant="gradient"
                                                    color="light"
                                                    sx={{
                                                        fontFamily: 'JalnanGothic',
                                                        padding: '10px 8px',   // Adjust padding (top-bottom left-right)
                                                    }}
                                                    onClick={() => handleDeleteShop(
                                                        shop.shopNo)}>상점 삭제
                                                </MDButton>
                                            </Grid>
                                            <Grid item xs={1.6}>
                                                <MDButton
                                                    variant="gradient"
                                                    color="success"
                                                    sx={{
                                                        fontFamily: 'JalnanGothic',
                                                        padding: '8px 8px',   // Adjust padding (top-bottom left-right)
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

                {/*댓글*/}
                <Grid item xs={6}>
                    <MDBox pt={3} pb={3}>
                        <Card>
                            <MDBox component="form" role="form">
                                <MDBox pt={3} pb={2} px={3}>
                                    {comments.map((comment) => (
                                        <MDBox pt={2} pb={2} key={comment.id}>
                                            <Grid container>
                                                <Grid item xs={6}>
                                                    <MDTypography
                                                        fontWeight="bold"
                                                        sx={{
                                                            mt: -2,
                                                            fontSize: '0.9rem'  // Adjust font size here
                                                        }}
                                                        variant="body2">
                                                        {editingCommentId
                                                        === comment.id ? (
                                                            <MDInput
                                                                type="text"
                                                                value={editingCommentText}
                                                                onChange={(e) => setEditingCommentText(
                                                                    e.target.value)}
                                                                fullWidth
                                                            />
                                                        ) : (
                                                            comment.comment
                                                        )}
                                                    </MDTypography>
                                                </Grid>
                                                <Grid item xs={2}>
                                                    <MDTypography
                                                        variant="body2"
                                                        sx={{
                                                            mt: -2,
                                                            fontSize: '0.9rem'  // Adjust font size here
                                                        }}
                                                        textAlign="right">
                                                        {comment.username}
                                                    </MDTypography>
                                                </Grid>

                                                {comment.username === userId
                                                    && (
                                                        <MDBox mt={-3}>
                                                            {editingCommentId
                                                            === comment.id ? (
                                                                <div>
                                                                    <MDButton
                                                                        variant="contained"
                                                                        sx={{
                                                                            fontFamily: 'JalnanGothic',
                                                                            fontSize: '0.8rem',  // Adjust font size
                                                                            mt: 1,
                                                                            ml: 1
                                                                            //padding: '10px 8px',   // Adjust padding (top-bottom left-right)
                                                                        }}
                                                                        color="success"
                                                                        size="small"
                                                                        onClick={() => handleUpdateComment(
                                                                            comment.id,
                                                                            editingCommentText)}
                                                                    >
                                                                        수정
                                                                    </MDButton>
                                                                    <MDButton
                                                                        variant="contained"
                                                                        sx={{
                                                                            fontFamily: 'JalnanGothic',
                                                                            fontSize: '0.8rem',  // Adjust font size
                                                                            mt: 1,
                                                                            //padding: '10px 8px',   // Adjust padding (top-bottom left-right)
                                                                        }}
                                                                        color="secondary"
                                                                        size="small"
                                                                        onClick={() => {
                                                                            setEditingCommentId(
                                                                                null);
                                                                            setEditingCommentText(
                                                                                '');
                                                                        }}
                                                                        style={{
                                                                            marginLeft: '0.5rem'
                                                                        }}
                                                                    >
                                                                        취소
                                                                    </MDButton>
                                                                </div>
                                                            ) : (
                                                                <>
                                                                    <MDButton
                                                                        onClick={() => handleEditComment(
                                                                            comment.id,
                                                                            comment.comment)}
                                                                    >
                                                                        수정
                                                                    </MDButton>
                                                                    <MDButton
                                                                        onClick={() => handleDeleteComment(
                                                                            comment.id)}
                                                                    >
                                                                        삭제
                                                                    </MDButton>
                                                                </>
                                                            )}
                                                        </MDBox>
                                                    )}
                                            </Grid>
                                        </MDBox>
                                    ))}
                                    <MDPagination size={"small"}>
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

                                    <MDBox sx={{mt: 2, mb: 0.5}}>
                                        <Grid container spacing={2}>
                                            <Grid item
                                                  xs={9}> {/* Adjust xs value to control the width */}
                                                <MDInput
                                                    label="댓글"
                                                    value={comment}
                                                    onChange={(v) => setComment(
                                                        v.target.value)}
                                                    fullWidth
                                                />
                                            </Grid>
                                            <Grid item
                                                  xs={3}> {/* Adjust xs value to control the width */}
                                                <MDButton
                                                    variant="contained"
                                                    color="primary"
                                                    sx={{
                                                        fontFamily: 'JalnanGothic',
                                                        fontSize: '0.9rem',  // Adjust font size
                                                        padding: '4px 8px',   // Adjust padding (top-bottom left-right)
                                                    }}
                                                    onClick={handleWriteComment}
                                                    fullWidth
                                                >
                                                    댓글 작성
                                                </MDButton>
                                            </Grid>
                                        </Grid>
                                    </MDBox>
                                </MDBox>
                            </MDBox>
                        </Card>
                    </MDBox>
                </Grid>

            </Grid>

            <Grid container pt={0} pb={3}>
                {items.map((item, index) => (
                    <Grid item xs={12} sm={6} md={4} lg={3} key={index}>
                        <MDBox pt={1} pb={2} px={1}>
                            <Card>
                                <MDBox pt={2} pb={2} px={2}>
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
                                                    padding: '4px 8px', // Adjust these values as needed
                                                    mr: '-10px'
                                                }}
                                            >Detail</Button>
                                        </Grid>
                                    </Grid>
                                    <div
                                        className="w-full flex flex-col items-center justify-center pt-2">
                                        <Grid container alignItems="center"
                                              justifyContent="center">
                                            {item.imageList.length > 1 && (
                                                <Grid item xs={2} display="flex"
                                                      alignItems="center"
                                                      justifyContent="center">
                                                    <MDButton
                                                        onClick={() => handlePreviousItemImage(
                                                            index)}>
                                                        <KeyboardArrowLeftIcon/>
                                                    </MDButton>
                                                </Grid>
                                            )}
                                            <Grid item xs={8} display="flex"
                                                  alignItems="center"
                                                  justifyContent="center">
                                                <img
                                                    alt="product"
                                                    width={300}
                                                    src={`${item.imageList[currentItemImageIndices[index]].imageUrl}`}
                                                    style={{
                                                        maxWidth: '100%',
                                                        height: 'auto'
                                                    }} // Ensures image is responsive
                                                />
                                            </Grid>
                                            {item.imageList.length > 1 && (
                                                <Grid item xs={2} display="flex"
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
                ))}
            </Grid>


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
        </DashboardLayout>
    );
}

export default ShopDetail;
