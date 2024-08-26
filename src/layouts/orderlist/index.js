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
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';
import CardMedia from '@mui/material/CardMedia';
import TextField from '@mui/material/TextField';
import MDBox from '../../components/MD/MDBox';
import MDTypography from '../../components/MD/MDTypography';
import DashboardLayout from '../../examples/LayoutContainers/DashboardLayout';

// Data
import { getCompleteOrderList, getCancelOrderList, deleteOrder, cancelOrder, cancelOrderKakao } from "../../api/orderApi";
import { putOrderStatus } from "../../api/adminApi";
import { getItemOne } from "../../api/itemApi";

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

    const handleGetOrders = (page, orderstatus) => {
        const params = { page, size: 3, sort: 'createTime,desc' };
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
        navigate('/order-detail', { state: order });
    };

    const handleItemDetail = async (itemNo) => {
        try {
            const item = await getItemOne(itemNo);
            setSelectedItem(item);
            console.log('item : ', item);
            navigate('/item-detail', { state: item });
        } catch(error) {
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
        if (!window.confirm('주문내역을 삭제하시겠습니까?')) return;

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
        if (!window.confirm('구매 확정 시 반품신청 불가합니다. 구매를 확정하시겠습니까?')) return;

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

    // CSS 스타일
    const styles = {
        cardContainer: { display: 'flex', flexDirection: 'column', gap: '8px' }, // 상하 여백 줄임
        card: {
            display: 'flex',
            flexDirection: 'row', // 카드의 내용과 이미지를 가로로 정렬
            alignItems: 'flex-start',
            padding: '8px', // 상하 좌우 패딩 줄임
            border: '1px solid #ddd'
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
            margin: '0 5px',
            padding: '6px 12px', // 버튼 패딩 줄임
            border: 'none',
            borderRadius: '4px',
            backgroundColor: '#f0f0f0',
            cursor: 'pointer'
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
            backgroundColor: 'blue',
            color: 'white'
        },
        pagination: {
            display: 'flex',
            justifyContent: 'center',
            marginTop: '16px' // 페이지네이션 상단 여백 줄임
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
            <button key="first-group" style={styles.button} onClick={() => handlePageClick(0)}>
                처음
            </button>
        );

        pagination.push(
            <button key="prev" style={styles.button} disabled={currentPage === 0} onClick={() => handlePageClick(Math.max(currentPage - 1, 0))}>
                이전
            </button>
        );

        for (let i = startPage; i <= endPage; i++) {
            pagination.push(
                <button key={i} style={{ ...styles.button, ...(i === currentPage ? styles.active : {}) }} onClick={() => handlePageClick(i)}>
                    {i + 1}
                </button>
            );
        }

        pagination.push(
            <button key="next" style={styles.button} disabled={currentPage >= totalPages - 1} onClick={() => handlePageClick(Math.min(currentPage + 1, totalPages - 1))}>
                다음
            </button>
        );

        pagination.push(
            <button key="last-group" style={styles.button} onClick={() => handlePageClick(totalPages - 1)}>
                끝
            </button>
        );

        return pagination;
    };

    // 주문 항목 집계
    const aggregateOrderItems = (orderItems) => {
        if (orderItems.length === 0) return { names: "", totalPrice: 0 };

        const sortedItems = [...orderItems].sort((a, b) => a.itemName.localeCompare(b.itemName));
        const firstItem = sortedItems[0];
        const totalPrice = sortedItems.reduce((sum, item) => sum + (item.orderPrice * item.count), 0);
        const nameList = sortedItems.map(item => item.itemName);
        const displayName = nameList.length > 1 ? `${firstItem.itemName} 외 ${nameList.length - 1}개` : firstItem.itemName;

        return { names: displayName, totalPrice };
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
            <MDBox pt={3} pb={3}>
                {/* 제목과 상태 필터 버튼들을 같은 라인에 배치 */}
                <MDBox display="flex" justifyContent="space-between" alignItems="center">
                    <MDTypography fontWeight="bold" sx={{ fontSize: '2.5rem' }} variant="body2">
                        주문 내역
                    </MDTypography>
                    {/* 상태 필터 버튼들 추가 */}
                    <div style={styles.statusButtonsContainer}>
                        <button style={{ ...styles.statusButton, ...styles.blueButton }} onClick={() => handleStatusFilter(null)}>
                            전체 보기<br />(취소 제외)
                        </button>
                        <button style={{ ...styles.statusButton, ...styles.redButton }} onClick={() => handleStatusFilter('CANCEL')}>
                            취소 목록
                        </button>
                    </div>
                </MDBox>
                <MDTypography fontWeight="bold" sx={{ fontSize: '1.5rem', color: 'red' }} variant="body2">
                    ※ 구매 확정 시 반품 신청 불가합니다.
                </MDTypography>
                <MDBox pt={3} pb={3}>
                    <div style={styles.cardContainer}>
                        {orders.length > 0 ? (
                            orders.map((order) => {
                                // 상품 항목 집계
                                const { names, totalPrice } = aggregateOrderItems(order.orderItemList);

                                // 첫번째 상품의 이미지 사용
                                const imageUrl = order.orderItemList[0]?.imageList[0].imageUrl || "/path/to/default-image.jpg";
                                console.log('imageUrl : ', imageUrl);
                                console.log('itemNo : ', order.orderItemList[0].itemNo);

                                return (
                                    <Card key={order.orderNo} style={styles.card}>
                                        <div
                                            style={styles.cardMediaContainer}
                                            onClick={() => handleItemDetail(order.orderItemList[0].itemNo)}
                                        >
                                            <CardMedia
                                                component="img"
                                                image={imageUrl}
                                                alt="Order Item"
                                                style={styles.cardMedia}
                                            />
                                        </div>
                                        <CardContent style={styles.cardContent}>
                                            <MDTypography variant="body2">
                                                주문 상태: {getOrderStatusText(order.orderStatus)}
                                            </MDTypography>
                                            <MDTypography variant="body2">
                                                주문 날짜: {order.orderDate}
                                            </MDTypography>
                                            <MDTypography variant="body2">
                                                주문 번호: {order.randomOrderNo}
                                            </MDTypography>
                                            <MDTypography variant="body2">
                                                상품명: {names}
                                            </MDTypography>
                                            <MDTypography variant="body2">
                                                가격: {totalPrice.toLocaleString()} 원
                                            </MDTypography>
                                            <MDBox mt={2}>
                                                <button style={styles.button} onClick={() => handleDetail(order)}>
                                                    상세보기
                                                </button>
                                                {order.orderStatus === 'FINISH' && (
                                                    <>
                                                        <button style={styles.confirmButton} onClick={() => handleOpenReturnModal(order)}>
                                                            반품 신청
                                                        </button>
                                                        <button style={styles.confirmButton} onClick={() => handlePurchaseConfirm(order.orderNo)}>
                                                            구매 확정
                                                        </button>
                                                    </>
                                                )}
                                                {order.orderStatus === 'COMPLETE' && (
                                                    <button style={styles.cancelButton} onClick={() => handleOpenCancelModal(order.orderNo)}>
                                                        주문 취소
                                                    </button>
                                                )}
                                            </MDBox>
                                        </CardContent>
                                        {order.orderStatus === 'PURCHASECONFIRM' && (
                                            <IconButton
                                                style={styles.deleteButton}
                                                onClick={() => handleDeleteOrder(order.orderNo)}
                                            >
                                                <CloseIcon />
                                            </IconButton>
                                        )}
                                    </Card>
                                );
                            })
                        ) : (
                            <MDTypography variant="body1">주문내역이 없습니다.</MDTypography>
                        )}
                        {orders.length > 0 && (
                            <MDBox sx={styles.pagination}>
                                {renderPagination()}
                            </MDBox>
                        )}
                    </div>
                </MDBox>
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
                            <button style={styles.confirmButton} onClick={handleSubmitReturnRequest}>
                                반품 진행
                            </button>
                            <button style={styles.cancelButton} onClick={handleCloseReturnModal}>
                                취소
                            </button>
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
                            <button style={styles.confirmButton} onClick={handleSubmitCancelRequest}>
                                취소 진행
                            </button>
                            <button style={styles.cancelButton} onClick={handleCloseCancelModal}>
                                취소
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </DashboardLayout>
    );
}

export default OrderList;
