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
    cancelItemLike,
    deleteItem,
    deleteItemComment,
    getItemComments,
    getItemLike, getItemLikeCount,
    postItemComment,
    postItemLike,
    putItemComment
} from "../../api/itemApi";
import FetchingModal from "../../components/common/FetchingModal";
import ResultModal from "../../components/common/ResultModal";
import {postOrder} from "../../api/orderApi";
import IconButton from "@mui/material/IconButton";
import {formatDistanceToNow} from "date-fns";
import {ko} from 'date-fns/locale';

function ItemDetail() {
    const {isAdmin, isAuthorization, userId} = useCustomLogin()
    const {state} = useLocation();
    const item = state; // 전달된 shop 데이터를 사용
    console.log(state);
    const [page, setPage] = useState(0);

    const [likes, setLikes] = useState(0);
    const [liked, setLiked] = useState(false); // 좋아요 여부 확인
    const [comments, setComments] = useState([]);
    const [totalPage, setTotalPage] = useState(0);
    const [comment, setComment] = useState('');

    const [fetching, setFetching] = useState(false)
    const [result, setResult] = useState(null)

    const [currentImageIndex, setCurrentImageIndex] = useState(0); // 이미지 인덱스 상태

    const [editingCommentId, setEditingCommentId] = useState(null);
    const [editingCommentText, setEditingCommentText] = useState('');

    const navigate = useNavigate();

    //장바구니 기능
    const {addCart} = useCustomCart()

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
        if (!isAuthorization) {
            alert("로그인이 필요합니다.");
            return;
        }
        if (!comment.trim()) { // 댓글 필드 비어있는지 확인
            alert("댓글을 작성해주세요.");
            return;
        }

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
        const pageParam = {page: pageNum, size: 3};
        getItemComments(item.itemNo, pageParam).then(data => {
            console.log('상품 댓글 조회 성공!!!');
            setComments(data.content);
            setTotalPage(data.totalPages);
        }).catch(error => {
            console.error("상점 댓글 조회에 실패했습니다.", error);
        });
    };

    const handleCheckLike = () => {
        getItemLike(item.itemNo).then(data => {
            console.log('좋아요 상태 확인 성공!!!');
            setLiked(data); // 좋아요 true, false 확인
        }).catch(error => {
            console.error("좋아요 상태 확인에 실패했습니다.", error);
        });
    };

    // 상품 좋아요 및 좋아요 취소
    const handlePostOrCancelLike = () => {
        if (!isAuthorization) {
            alert("로그인이 필요합니다.");
            return;
        }
        if (liked) {
            cancelItemLike(item.itemNo).then(data => {
                console.log('좋아요 취소 성공!!!');
                setLiked(false);
                setLikes(prev => prev - 1); // Update likes count
            }).catch(error => {
                console.error("좋아요 취소에 실패했습니다.", error);
            });
        } else {
            postItemLike(item.itemNo).then(data => {
                console.log('좋아요 성공!!!');
                setLiked(true);
                setLikes(prev => prev + 1); // Update likes count
            }).catch(error => {
                console.error("상품 좋아요에 실패했습니다.", error);
            });
        }
    };

    const handleCountLikes = () => {
        getItemLikeCount(item.itemNo).then(data => {
            console.log('상품 댓글 조회 성공!!!');
            setLikes(data);
        }).catch(error => {
            console.error("상점 댓글 조회에 실패했습니다.", error);
        });
    };

    // 장바구니에 추가
    const handleClickAddCart = () => {
        let count = 1
        addCart(
            {itemNo: item.itemNo, count: count})
        const userConfirmed = window.confirm("장바구니에 추가되었습니다. 장바구니로 이동하시겠습니까?")
        if (userConfirmed) {
            navigate('/cart') // 장바구니로 이동
        }
    }

    // 주문하기
    const handleClickOrder = () => {
        postOrder(item).then(data => {
            console.log('상품 주문 성공!!!');
            console.log(data);
            navigate('/order');
        }).catch(error => {
            console.error("상품 주문에 실패했습니다.", error);
        });
    };

    // 이전 이미지로 이동
    const handlePreviousImage = () => {
        setCurrentImageIndex((prevIndex) =>
            prevIndex === 0 ? item.imageList.length - 1 : prevIndex - 1
        );
    };

    // 다음 이미지로 이동
    const handleNextImage = () => {
        setCurrentImageIndex((prevIndex) =>
            prevIndex === item.imageList.length - 1 ? 0 : prevIndex + 1
        );
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
        // Add your logic to update the comment here
        putItemComment(commentNo, updatedComment).then(data => {
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
            console.error("상품 댓글 수정에 실패했습니다.", error);
        });

        setEditingCommentId(null);
        setEditingCommentText('');
    };

    const handleDeleteComment = (commentNo) => {
        const confirmed = window.confirm('댓글을 삭제하시겠습니까?');
        if (!confirmed) {
            return; // If the user cancels, do nothing
        }
        deleteItemComment(commentNo).then(data => {
            console.log('댓글 삭제 성공:', data);
            setComments((prevComments) =>
                prevComments.filter((comment) => comment.id !== commentNo)
            );
        }).catch(error => {
            console.error("상품 댓글 삭제에 실패했습니다.", error);
        });

        setEditingCommentId(null);
        setEditingCommentText('');
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
        console.log("isAdmin : " + isAdmin)

        handleGetComments();
        handleCountLikes();
        handleCheckLike();
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
                <Grid item xs={12} md={7}>
                    <MDBox pt={0} pb={3}>
                        <Card>
                            <MDBox pt={2} pb={3} px={3}>
                                <Grid container>
                                    <Grid item xs={6}>
                                        <MDTypography fontWeight="bold"
                                                      sx={{
                                                          fontSize: '1.5rem',
                                                      }}
                                                      variant="body2">
                                            {item.itemName}
                                        </MDTypography>
                                    </Grid>
                                    <Grid item xs={6}>
                                        <MDTypography variant="body2"
                                                      sx={{
                                                          fontSize: '1.5rem',
                                                      }}
                                                      textAlign="right">
                                            {item.price}원
                                        </MDTypography>
                                    </Grid>
                                </Grid>
                                <div style={{
                                    position: 'relative',
                                    display: 'flex',
                                    justifyContent: 'center',
                                    alignItems: 'center'
                                }}>
                                    {/* Conditionally render navigation arrows */}
                                    {item.imageList.length > 1 && (
                                        <IconButton
                                            onClick={handlePreviousImage}
                                            style={{
                                                position: 'absolute',
                                                left: 0
                                            }}
                                        >
                                            <KeyboardArrowLeftIcon/>
                                        </IconButton>
                                    )}
                                    <img
                                        alt="product"
                                        width="100%"
                                        style={{maxWidth: '300px'}}
                                        src={`${item.imageList[currentImageIndex]?.imageUrl}`}
                                    />
                                    {item.imageList.length > 1 && (
                                        <IconButton
                                            onClick={handleNextImage}
                                            style={{
                                                position: 'absolute',
                                                right: 0
                                            }}
                                        >
                                            <KeyboardArrowRightIcon/>
                                        </IconButton>
                                    )}
                                </div>
                                <MDTypography
                                    variant="body2"
                                    sx={{
                                        marginBottom: '10px'
                                    }}
                                >{item.itemDetail}</MDTypography>
                                <MDTypography
                                    variant="body2"
                                    sx={{
                                        fontSize: '0.75rem',
                                        marginLeft: '8px'
                                    }}
                                >{likes} LIKES</MDTypography>
                                <Grid container>
                                    <Grid item xs={1.4}>
                                        <MDButton
                                            onClick={handlePostOrCancelLike}
                                            variant="gradient"
                                            sx={{
                                                fontFamily: 'JalnanGothic',
                                                fontSize: '0.75rem',
                                                padding: '4px 8px',
                                                minWidth: 'auto'
                                            }}
                                            color="info"
                                        >
                                            좋아요 👍🏻
                                        </MDButton>
                                    </Grid>
                                    {isAdmin && ( // 관리자일 때 버튼 생성
                                        <>
                                            <Grid item xs={1.4}>
                                                <MDButton
                                                    variant="gradient"
                                                    color="light"
                                                    sx={{
                                                        fontFamily: 'JalnanGothic',
                                                        padding: '4px 8px',   // Adjust padding (top-bottom left-right)
                                                    }}
                                                    onClick={() => handleModifyItem(
                                                        item)}
                                                >
                                                    상품 수정
                                                </MDButton>
                                            </Grid>
                                            <Grid item xs={1.3}>
                                                <MDButton
                                                    variant="gradient"
                                                    color="light"
                                                    sx={{
                                                        fontFamily: 'JalnanGothic',
                                                        padding: '4px 8px',
                                                    }}
                                                    onClick={() => handleDeleteItem(
                                                        item.itemNo)}
                                                >
                                                    상품 삭제
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
                <Grid item xs={5}>
                    <MDBox pt={0} pb={3}>
                        <Card>
                            <MDBox component="form" role="form">
                                <MDBox pt={3} pb={2} px={3}>
                                    {comments.map((comment) => (
                                        <MDBox pt={2} pb={2} key={comment.id}>
                                            <Grid container>
                                                <Grid item xs={5}>
                                                    <MDTypography
                                                        fontWeight="bold"
                                                        sx={{
                                                            mt: -2,
                                                            fontSize: '0.9rem'
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
                                                            fontSize: '0.9rem'
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
                                                                            fontSize: '0.8rem',
                                                                            mt: 1,
                                                                            ml: 1
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
                                                                            fontSize: '0.8rem',
                                                                            mt: 1,
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
                                                <Grid item xs={1.3}>
                                                    <MDTypography
                                                        variant="body2"
                                                        sx={{
                                                            mt: -1.5,
                                                            fontSize: '0.8rem'
                                                        }}
                                                        textAlign="right">
                                                        {formatDistanceToNow(
                                                            new Date(
                                                                comment.createTime),
                                                            {
                                                                addSuffix: true,
                                                                locale: ko
                                                            })}
                                                    </MDTypography>
                                                </Grid>

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
                                                  xs={9}>
                                                <MDInput
                                                    label="댓글"
                                                    value={comment}
                                                    onChange={(v) => setComment(
                                                        v.target.value)}
                                                    fullWidth
                                                />
                                            </Grid>
                                            <Grid item
                                                  xs={3}>
                                                <MDButton
                                                    variant="contained"
                                                    color="primary"
                                                    sx={{
                                                        fontFamily: 'JalnanGothic',
                                                        fontSize: '0.9rem',
                                                        padding: '4px 8px',
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
                    <Grid container spacing={2} justifyContent="right">
                        <Grid item xs={6}>
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
                        <Grid item xs={6}>
                            <MDBox>
                                <div style={{
                                    display: 'flex',
                                    justifyContent: 'center'
                                }}>
                                    <MDButton onClick={handleClickOrder}
                                              variant="gradient"
                                              size="large"
                                              sx={buttonStyle}
                                    >구매하기
                                    </MDButton>
                                </div>
                            </MDBox>
                        </Grid>
                    </Grid>
                </Grid>
            </Grid>
        </DashboardLayout>
    );
}

export default ItemDetail;
