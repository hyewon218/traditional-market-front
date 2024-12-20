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

// 주문 목록 카드 형태
import * as React from 'react';
import {useEffect, useState} from 'react';
import {useNavigate} from 'react-router-dom';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';
import CardMedia from '@mui/material/CardMedia';
import TextField from '@mui/material/TextField';
import MDBox from '../../components/MD/MDBox';
import MDTypography from '../../components/MD/MDTypography';
import DashboardLayout from '../../examples/LayoutContainers/DashboardLayout';
import MDButton from "../../components/MD/MDButton";
import {useMediaQuery} from "@mui/material";
import Grid from "@mui/material/Grid";
// Data
import {
    getCompleteOrderList,
    getCancelOrderList,
    deleteOrder,
    cancelOrderKakao
} from "../../api/orderApi";
import {putOrderStatus} from "../../api/adminApi";
import {getItemOne} from "../../api/itemApi";
import KeyboardArrowLeftIcon from "@mui/icons-material/KeyboardArrowLeft";

function OrderList() {
    const [orders, setOrders] = useState([]);
    const [selectedItem, setSelectedItem] = useState(null); // 선택한 상품 상태
    const [currentPage, setCurrentPage] = useState(0);
    const [totalPages, setTotalPages] = useState(0);
    const [orderstatus, setOrderstatus] = useState(null);
    const [openReturnModal, setOpenReturnModal] = useState(false);
    const [selectedOrder, setSelectedOrder] = useState(null);
    const [returnReason, setReturnReason] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const [openCancelModal, setOpenCancelModal] = useState(false);
    const [cancelReason, setCancelReason] = useState('');
    const [selectedCancelOrder, setSelectedCancelOrder] = useState(null);
    const [cancelErrorMessage, setCancelErrorMessage] = useState('');
    const navigate = useNavigate();
    const isSmallScreen = useMediaQuery('(max-width:600px)');

    const handleGetOrders = (page, orderstatus) => {
        const params = {page, size: 5};
        console.log('params : ', params);

        let apiCall;

        if (orderstatus) {
            apiCall = getCancelOrderList(params);
        } else {
            apiCall = getCompleteOrderList(params);
        }

        apiCall
        .then(data => {
            console.log('data : ', data);
            setOrders(data.content);
            setTotalPages(data.totalPages);
            console.log('orders : ', orders);
        })
        .catch(error => {
            console.error("주문 목록을 불러오는 데 실패했습니다.", error);
        });
    };

    useEffect(() => {
        handleGetOrders(currentPage, orderstatus);
    }, [currentPage, orderstatus]);

    const handleDetail = (order) => {
        navigate('/order-detail', {state: order});
    };

    const handleItemDetail = async (itemNo) => {
        try {
            const item = await getItemOne(itemNo);
            setSelectedItem(item);
            console.log('item : ', item);
            navigate('/item-detail', {state: item});
        } catch (error) {
            console.error('상품 정보를 불러오는 데 실패했습니다.', error);
            alert('상품 정보를 불러오는 데 실패했습니다.');
        }

    };

    // 주문 취소 (결제완료(COMPLETE)일때만 가능)
//    const handleCancelOrder = async (orderNo) => {
//        if (!window.confirm('주문을 취소하시겠습니까?')) return;
//
//        try {
//            await cancelOrderKakao(orderNo);
//            handleGetOrders(currentPage);
//            alert('취소 성공');
//        } catch (error) {
//            alert('취소 실패:', error);
//        }
//    };

    // 주문취소 모달
    const handleOpenCancelModal = (orderNo) => {
        setSelectedCancelOrder(orderNo);
        setOpenCancelModal(true);
    };

    const handleCloseCancelModal = () => {
        setOpenCancelModal(false);
        setSelectedCancelOrder(null);
        setCancelReason('');
        setCancelErrorMessage('');
    };

    const handleCancelReasonChange = (event) => {
        setCancelReason(event.target.value);
    };

    // 주문 취소 실행
    const handleSubmitCancelRequest = async () => {
        if (cancelReason.trim() === '') {
            setCancelErrorMessage('취소 사유를 입력해주세요.');
            return;
        }
        setCancelErrorMessage('');

        try {
            await cancelOrderKakao(selectedCancelOrder, 'CANCEL', cancelReason);
            handleGetOrders(currentPage);
            alert('취소 신청이 완료되었습니다.');
            handleCloseCancelModal();
        } catch (error) {
            alert('취소 신청 실패:', error);
        }
    };

    // 주문 내역 삭제
    const handleDeleteOrder = async (orderNo) => {
        if (!window.confirm('주문내역을 삭제하시겠습니까?')) {
            return;
        }

        try {
            await deleteOrder(orderNo);
            handleGetOrders(currentPage);
        } catch (error) {
            alert('삭제 실패:', error);
        }
    };

    // 주문 상태 저장
    const handleStatusFilter = (orderstatus) => {
        setOrderstatus(orderstatus);
        setCurrentPage(0);
    };

    // 구매 확정
    const handlePurchaseConfirm = async (orderNo) => {
        if (!window.confirm('구매 확정 시 반품신청 불가합니다. 구매를 확정하시겠습니까?')) {
            return;
        }

        try {
            await putOrderStatus(orderNo, 'PURCHASECONFIRM');
            handleGetOrders(currentPage);
            alert('구매가 확정되었습니다.');
        } catch (error) {
            alert('구매 확정 실패:', error);
        }
    };

    // 반품 신청 모달
    const handleOpenReturnModal = (order) => {
        setSelectedOrder(order);
        setOpenReturnModal(true);
    };

    const handleCloseReturnModal = () => {
        setOpenReturnModal(false);
        setSelectedOrder(null);
        setReturnReason('');
        setErrorMessage('');
    };

    const handleReturnReasonChange = (event) => {
        setReturnReason(event.target.value);
    };

    // 반품 신청
    const handleSubmitReturnRequest = async () => {
        if (returnReason.trim() === '') {
            setErrorMessage('반품 사유를 입력해주세요.');
            return;
        }
        setErrorMessage('');

        // 사용자에게 반품 진행 여부를 확인하는 confirm 대화 상자 표시
        const isConfirmed = window.confirm('반품 신청을 진행하시겠습니까?');
        if (!isConfirmed) {
            // 사용자가 취소를 클릭한 경우 함수 종료
            return;
        }

        try {
            await putOrderStatus(selectedOrder.orderNo, 'RETURN', returnReason);
            handleGetOrders(currentPage);
            alert('반품 신청이 완료되었습니다.');
            handleCloseReturnModal();
        } catch (error) {
            alert('반품 신청 실패:', error);
        }
    };

    const handlePageClick = (page) => {
        setCurrentPage(page);
    };

    // 뒤로 가기(내 정보 홈으로 가기)
    const handleBack = () => {
        navigate('/myinfo');
    };

    // CSS 스타일
    const styles = {
        //cardContainer: {display: 'flex', flexDirection: 'column', gap: '8px'}, // 상하 여백 줄임
        card: {
            display: 'flex',
            flexDirection: 'row', // 카드의 내용과 이미지를 가로로 정렬
            alignItems: 'flex-start',
            padding: '8px', // 상하 좌우 패딩 줄임
        },
        cardMediaContainer: {
            width: '150px',  // 이미지 너비
            height: '150px', // 이미지 높이
            marginRight: '16px', // 이미지와 내용 간의 간격
            cursor: 'pointer' // 클릭 가능하게
        },
        cardMedia: {
            width: '150px',  // 이미지 너비
            height: '150px', // 이미지 높이
            objectFit: 'cover' // 비율 유지하며 이미지 맞추기
        },
        cardContent: {
            flex: 1,
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between'
        },
        button: {
            fontFamily: 'JalnanGothic',
            backgroundColor: '#f0f0f0',
            fontSize: isSmallScreen ? '0.6rem':'0.9rem',
            minWidth: 'auto',
            width: isSmallScreen ? '30px' : 'auto', // 가로 너비를 줄임
            padding: isSmallScreen
                ? '1px 2px'
                : '2px 16px',
            lineHeight:  isSmallScreen ? 2.5:2,  // 줄 간격을 줄여 높이를 감소시킴
            minHeight: 'auto', // 기본적으로 적용되는 높이를 없앰
            cursor: 'pointer',
            borderRadius: '4px',
            border: 'none',
        },
        confirmButton: {
            margin: '0 5px',
            padding: '6px 12px',
            border: 'none',
            borderRadius: '4px',
            backgroundColor: 'green',
            color: 'white',
            cursor: 'pointer'
        },
        cancelButton: {
            margin: '0 5px',
            padding: '6px 12px',
            border: 'none',
            borderRadius: '4px',
            backgroundColor: 'orange',
            color: 'white',
            cursor: 'pointer'
        },
        active: {
            backgroundColor: 'white',
            color: 'black'
        },
        pagination: {
            display: 'flex',
            justifyContent: 'center',
            marginTop: isSmallScreen ? 0 : '16px' // 페이지네이션 상단 여백 줄임
        },
        statusButtonsContainer: {
            display: 'flex',
            justifyContent: 'flex-end', // 버튼을 왼쪽으로 정렬
            gap: '10px', // 버튼 간 간격 설정
        },
        statusButton: {
            flex: 'none',
            width: '5cm', // 버튼 너비를 3.5cm로 설정
            height: '2cm',
            margin: '0 5px',
            padding: '8px',
            border: 'none',
            borderRadius: '4px',
            backgroundColor: '#c0c0c0',
            cursor: 'pointer',
            textAlign: 'center',
            fontWeight: 'bold'
        },
        blueButton: {
            backgroundColor: 'blue',
            color: 'white'
        },
        redButton: {
            backgroundColor: 'red',
            color: 'white'
        },
        modalTitle: {
            fontWeight: 'bold',
            fontSize: '1.5rem',
            marginBottom: '12px'
        },
        modal: {
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            position: 'fixed',
            top: '0',
            left: '0',
            width: '100%',
            height: '100%',
            backgroundColor: 'rgba(0,0,0,0.5)',
            zIndex: 1000
        },
        modalContent: {
            backgroundColor: 'white',
            padding: '20px',
            borderRadius: '8px',
            textAlign: 'center',
            width: '500px',
            boxShadow: '0px 0px 10px rgba(0,0,0,0.2)'
        },
        modalActions: {
            display: 'flex',
            justifyContent: 'space-between',
            marginTop: '20px'
        },
    };

    const renderPagination = () => {
        const pagination = [];
        const groupSize = 5;
        const currentGroup = Math.floor(currentPage / groupSize);
        const startPage = currentGroup * groupSize;
        const endPage = Math.min(startPage + groupSize - 1, totalPages - 1);

        pagination.push(
            <button key="first-group" style={styles.button}
                    onClick={() => handlePageClick(0)}>
                처음
            </button>
        );

        pagination.push(
            <button key="prev" style={styles.button}
                    disabled={currentPage === 0} onClick={() => handlePageClick(
                Math.max(currentPage - 1, 0))}>
                이전
            </button>
        );

        for (let i = startPage; i <= endPage; i++) {
            pagination.push(
                <button key={i} style={{
                    ...styles.button, ...(i === currentPage ? styles.active
                        : {})
                }} onClick={() => handlePageClick(i)}>
                    {i + 1}
                </button>
            );
        }

        pagination.push(
            <button key="next" style={styles.button}
                    disabled={currentPage >= totalPages - 1}
                    onClick={() => handlePageClick(
                        Math.min(currentPage + 1, totalPages - 1))}>
                다음
            </button>
        );

        pagination.push(
            <button key="last-group" style={styles.button}
                    onClick={() => handlePageClick(totalPages - 1)}>
                끝
            </button>
        );

        return pagination;
    };

    // 주문 항목 집계
    const aggregateOrderItems = (orderItems) => {
        if (orderItems.length === 0) {
            return {names: "", totalPrice: 0};
        }

        const sortedItems = [...orderItems].sort(
            (a, b) => a.itemName.localeCompare(b.itemName));
        const firstItem = sortedItems[0];
        const totalPrice = sortedItems.reduce(
            (sum, item) => sum + (item.orderPrice * item.count), 0);
        const nameList = sortedItems.map(item => item.itemName);
        const displayName = nameList.length > 1
            ? `${firstItem.itemName} 외 ${nameList.length - 1}개`
            : firstItem.itemName;

        return {names: displayName, totalPrice};
    };

    // 주문 상태 변환 함수
    const getOrderStatusText = (status) => {
        switch (status) {
            case 'COMPLETE':
                return '결제 완료';
            case 'READYITEM':
                return '상품준비중';
            case 'READYSHIP':
                return '배송준비중';
            case 'SHIPPED':
                return '배송중';
            case 'FINISH':
                return '배송 완료';
            case 'CANCEL':
                return '주문 취소';
            case 'PURCHASECONFIRM':
                return '구매 확정';
            case 'RETURN':
                return '반품 신청';
            case 'RETURNCOMPLETE':
                return '반품 완료';
            case 'REFUND':
                return '환불 완료';
            default:
                return '상태 미정의';
        }
    };

    return (
        <DashboardLayout>
            <MDBox pb={isSmallScreen ? 1:-1} pr={isSmallScreen ? 0 : 3}>
                <Grid container spacing={isSmallScreen ? 0 : 2}>
                    <Grid item xs={6} md={9}>
                        <MDTypography fontWeight="bold"
                                      sx={{
                                          ml: isSmallScreen ? 2 : 4,
                                          mt: isSmallScreen ? 0 : 3,
                                          mb: isSmallScreen ? 0 : 0,
                                          fontSize: isSmallScreen ? '1.2rem'
                                              : '2rem'
                                      }}
                                      variant="body2">
                            주문 내역
                        </MDTypography>
                    </Grid>
                    <Grid item xs={6} lg={3}>
                        <MDBox sx={{
                            pr: isSmallScreen ? 2 : 3,
                            width: '100%',
                            mt: isSmallScreen ? 0 : 4,
                            display: 'flex',
                            justifyContent: 'right',
                        }}>
                            <MDButton
                                sx={{
                                    fontFamily: 'JalnanGothic',
                                    fontSize: isSmallScreen ? '0.7rem' : '0.9rem',
                                    minWidth: 'auto',
                                    width: isSmallScreen ? '100px' : 'auto', // 가로 너비를 줄임
                                    padding: isSmallScreen
                                        ? '1px 2px'
                                        : '4px 8px',
                                    lineHeight: isSmallScreen ? 2.5 : 2,  // 줄 간격을 줄여 높이를 감소시킴
                                    minHeight: 'auto' // 기본적으로 적용되는 높이를 없앰
                                }}
                                variant="contained"
                                color="white"
                                onClick={handleBack}
                                startIcon={<KeyboardArrowLeftIcon/>}
                            >
                                돌아가기
                            </MDButton>
                        </MDBox>
                    </Grid>

                </Grid>
                <Grid container spacing={isSmallScreen ? 0 : 2} sx={{mt : isSmallScreen ? 2 : 0}}>
                    <Grid item xs={6.5} md={9}>
                        <MDTypography fontWeight="bold"
                                      sx={{
                                          mt: isSmallScreen ? 2 : -3,
                                          fontSize: isSmallScreen ? '0.6rem' : '0.9rem',
                                          color: 'red',
                                          ml : isSmallScreen ? 0 : 4
                                      }}
                                      variant="body2">※ 구매 확정 시 반품 신청 불가합니다.
                        </MDTypography>
                    </Grid>
                    <Grid item xs={3} md={1.7}>
                        <MDButton
                            variant="gradient"
                            color="info"
                            sx={{
                                fontFamily: 'JalnanGothic',
                                fontSize: isSmallScreen ? '0.6rem' : '1.0rem',
                                minWidth: 'auto',
                                width: isSmallScreen ? '60px' : '180px', // 가로 너비를 줄임
                                padding: isSmallScreen ? '1px 2px' : '4px 8px',
                                lineHeight: isSmallScreen ? 1.5 : 2, // 줄 간격을 줄여 높이를 감소시킴
                                minHeight: 'auto', // 기본적으로 적용되는 높이를 없앰
                                ml: isSmallScreen ? 2 : 0
                            }}
                            onClick={() => handleStatusFilter(null)}>
                            {isSmallScreen ? (
                                <>
                                    전체 보기
                                    <br />
                                    (취소 제외)
                                </>
                            ) : '전체 보기(취소 제외)'}
                        </MDButton>
                    </Grid>
                    <Grid item xs={2.5} md={1.3}>
                        <MDButton
                            variant="gradient"
                            color="error"
                            sx={{
                                fontFamily: 'JalnanGothic',
                                fontSize: isSmallScreen ? '0.6rem' : '1.0rem',
                                minWidth: 'auto',
                                width: isSmallScreen ? '60px' : '120px', // 가로 너비를 줄임
                                padding: isSmallScreen ? '1px 2px' : '4px 8px',
                                lineHeight: isSmallScreen ? 3 : 2, // 줄 간격을 줄여 높이를 감소시킴
                                minHeight: 'auto', // 기본적으로 적용되는 높이를 없앰
                            }}
                            onClick={() => handleStatusFilter('CANCEL')}>
                            취소 목록
                        </MDButton>
                    </Grid>
                </Grid>
            </MDBox>

            <MDBox pt={isSmallScreen ? 0 : 2} pb={10}>
                {orders.length > 0 ? (
                    orders.map((order) => {
                        // 상품 항목 집계
                        const {names, totalPrice} = aggregateOrderItems(
                            order.orderItemList);

                        // 첫번째 상품의 이미지 사용
                        const imageUrl = order.orderItemList[0]?.imageList[0].imageUrl
                            || "/path/to/default-image.jpg";
                        console.log('imageUrl : ', imageUrl);
                        console.log('itemNo : ',
                            order.orderItemList[0].itemNo);

                        return (
                            <MDBox pt={isSmallScreen ? 1 : 0} pb={1} px={isSmallScreen ? 1 : 3}>
                                <Card key={order.orderNo}
                                      style={styles.card}>
                                    <div
                                        style={styles.cardMediaContainer}
                                        onClick={() => handleItemDetail(
                                            order.orderItemList[0].itemNo)}
                                    >
                                        <CardMedia
                                            component="img"
                                            image={imageUrl}
                                            alt="Order Item"
                                            style={styles.cardMedia}
                                        />
                                    </div>
                                    <CardContent style={styles.cardContent}>
                                        <MDTypography
                                            sx={{
                                                mt: isSmallScreen ? 1:2,
                                                fontSize: isSmallScreen? '0.8rem':'1rem'
                                        }}
                                            variant="body2">
                                            {getOrderStatusText(order.orderStatus)}
                                        </MDTypography>
                                        <MDTypography
                                            sx={{
                                                fontSize: isSmallScreen? '0.6rem':'1rem'
                                            }}
                                            variant="body2">{order.orderDate}
                                        </MDTypography>
                                        <MDTypography
                                            sx={{
                                                fontSize: isSmallScreen? '0.8rem':'1rem'
                                            }}
                                            variant="body2">{names}
                                        </MDTypography>
                                        <MDTypography
                                            sx={{
                                                fontSize: isSmallScreen? '0.8rem':'1rem'
                                            }}
                                            variant="body2">{totalPrice.toLocaleString()} 원
                                        </MDTypography>
                                        <MDBox mt={isSmallScreen ? 1 : 2}>
                                            <Grid container spacing={isSmallScreen ? 0.2 : 0.1}>
                                                <Grid item xs={isSmallScreen ? 12 : 0.9}>
                                                    <MDButton
                                                        color="light"
                                                        sx={{
                                                            fontFamily: 'JalnanGothic',
                                                            fontSize: isSmallScreen ? '0.7rem' : '0.9rem',
                                                            minWidth: 'auto',
                                                            width: isSmallScreen ? '60px' : 'auto', // 가로 너비를 줄임
                                                            padding: isSmallScreen ? '1px 2px' : '4px 8px',
                                                            lineHeight: isSmallScreen ? 2 : 2,  // 줄 간격을 줄여 높이를 감소시킴
                                                            minHeight: 'auto' // 기본적으로 적용되는 높이를 없앰
                                                        }}
                                                        onClick={() => handleDetail(
                                                            order)}>
                                                        상세보기
                                                    </MDButton>
                                                </Grid>
                                                {order.orderStatus === 'FINISH'
                                                    && (
                                                        <>
                                                            <Grid item xs={isSmallScreen ? 12 : 1.4}>
                                                                <MDButton
                                                                    color="info"
                                                                    sx={{
                                                                        fontFamily: 'JalnanGothic',
                                                                        fontSize: isSmallScreen ? '0.7rem' : '0.9rem',
                                                                        minWidth: 'auto',
                                                                        width: isSmallScreen ? '60px' : 'auto', // 가로 너비를 줄임
                                                                        padding: isSmallScreen ? '1px 2px' : '4px 8px',
                                                                        lineHeight: isSmallScreen ? 2 : 2,  // 줄 간격을 줄여 높이를 감소시킴
                                                                        minHeight: 'auto' // 기본적으로 적용되는 높이를 없앰
                                                                    }}
                                                                    //style={styles.confirmButton}
                                                                    onClick={() => handleOpenReturnModal(
                                                                        order)}>
                                                                    반품 신청
                                                                </MDButton>
                                                            </Grid>
                                                            <Grid item xs={isSmallScreen ? 12 : 1.4}>
                                                                <MDButton
                                                                    color="info"
                                                                    sx={{
                                                                        fontFamily: 'JalnanGothic',
                                                                        fontSize: isSmallScreen ? '0.7rem' : '0.9rem',
                                                                        minWidth: 'auto',
                                                                        width: isSmallScreen ? '60px' : 'auto', // 가로 너비를 줄임
                                                                        padding: isSmallScreen ? '1px 2px' : '4px 8px',
                                                                        lineHeight: isSmallScreen ? 2 : 2,  // 줄 간격을 줄여 높이를 감소시킴
                                                                        minHeight: 'auto' // 기본적으로 적용되는 높이를 없앰
                                                                    }}
                                                                    //style={styles.confirmButton}
                                                                    onClick={() => handlePurchaseConfirm(
                                                                        order.orderNo)}>
                                                                    구매 확정
                                                                </MDButton>
                                                            </Grid>
                                                        </>
                                                    )}
                                            {order.orderStatus === 'COMPLETE' && (
                                                    <Grid item xs={isSmallScreen ? 12 : 1.4}>
                                                        <MDButton
                                                            color="error"
                                                            sx={{
                                                                fontFamily: 'JalnanGothic',
                                                                fontSize: isSmallScreen ? '0.7rem' : '0.9rem',
                                                                minWidth: 'auto',
                                                                width: isSmallScreen ? '60px' : 'auto', // 가로 너비를 줄임
                                                                padding: isSmallScreen ? '1px 2px' : '4px 8px',
                                                                lineHeight: isSmallScreen ? 2 : 2,  // 줄 간격을 줄여 높이를 감소시킴
                                                                minHeight: 'auto' // 기본적으로 적용되는 높이를 없앰
                                                            }}
                                                            //style={styles.cancelButton}
                                                            onClick={() => handleOpenCancelModal(
                                                                order.orderNo)}>
                                                            주문 취소
                                                        </MDButton>
                                                    </Grid>
                                                )}
                                            </Grid>
                                        </MDBox>
                                    </CardContent>
                                    {order.orderStatus === 'PURCHASECONFIRM'
                                        && (
                                            <IconButton
                                                style={styles.deleteButton}
                                                onClick={() => handleDeleteOrder(order.orderNo)}
                                            >
                                                <CloseIcon/>
                                            </IconButton>
                                        )}
                                </Card>
                            </MDBox>
                        );
                    })
                ) : (
                    <MDTypography
                        sx={{
                            ml: isSmallScreen ? 2 : 4,
                            fontSize: isSmallScreen ? '0.8rem' : '1.1rem',
                        }}
                        variant="body1">주문내역이 없습니다.</MDTypography>
                )}
                {orders.length > 0 && (
                    <MDBox sx={styles.pagination}>
                        {renderPagination()}
                    </MDBox>
                )}
            </MDBox>

            {/* 반품 신청 모달 */}
            {openReturnModal && (
                <div style={styles.modal}>
                    <div style={styles.modalContent}>
                        <h2>반품 신청</h2>
                        <div>
                            <TextField
                                autoFocus
                                margin="dense"
                                label="반품 사유"
                                type="text"
                                fullWidth
                                variant="outlined"
                                value={returnReason}
                                onChange={handleReturnReasonChange}
                                error={!!errorMessage}
                                helperText={errorMessage}
                            />
                        </div>
                        <div style={styles.modalActions}>
                            <MDButton style={styles.confirmButton}
                                      onClick={handleSubmitReturnRequest}>
                                반품 진행
                            </MDButton>
                            <MDButton style={styles.cancelButton}
                                      onClick={handleCloseReturnModal}>
                                취소
                            </MDButton>
                        </div>
                    </div>
                </div>
            )}
            {/* 주문 취소 모달 */}
            {openCancelModal && (
                <div style={styles.modal}>
                    <div style={styles.modalContent}>
                        <h2>주문 취소</h2>
                        <div>
                            <TextField
                                autoFocus
                                margin="dense"
                                label="취소 사유"
                                type="text"
                                fullWidth
                                variant="outlined"
                                value={cancelReason}
                                onChange={handleCancelReasonChange}
                                error={!!cancelErrorMessage}
                                helperText={cancelErrorMessage}
                            />
                        </div>
                        <div style={styles.modalActions}>
                            <MDButton style={styles.confirmButton}
                                      onClick={handleSubmitCancelRequest}>
                                취소 진행
                            </MDButton>
                            <MDButton style={styles.cancelButton}
                                      onClick={handleCloseCancelModal}>
                                취소
                            </MDButton>
                        </div>
                    </div>
                </div>
            )}
        </DashboardLayout>
    );
}

export default OrderList;
