///**
// =========================================================
// * Material Dashboard 2 React - v2.1.0
// =========================================================
//
// * Product Page: https://www.creative-tim.com/product/material-dashboard-react
// * Copyright 2022 Creative Tim (https://www.creative-tim.com)
//
// Coded by www.creative-tim.com
//
// =========================================================
//
// * The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.
// */
//
//import React, {useEffect, useState} from 'react';
//import {useNavigate} from 'react-router-dom';
//import {useMediaQuery} from '@mui/material';
//import Card from '@mui/material/Card';
//import MDBox from '../../../components/MD/MDBox';
//import MDTypography from '../../../components/MD/MDTypography';
//import DashboardLayout from '../../../examples/LayoutContainers/DashboardLayout';
//import { Modal, Button, Select, MenuItem, FormControl, InputLabel } from '@mui/material';
//
//// Data
//import { putOrderStatus } from "../../../api/adminApi";
//import { getOrderListSearchSeller, getOrderListSeller, getOrderStatusListSeller, getCancelOrderListSeller, cancelOrderKakao } from "../../../api/orderApi";
//
//function OrderManageSeller() {
//    const [orders, setOrders] = useState([]);
//    const [currentPage, setCurrentPage] = useState(0);
//    const [pageSize, setPageSize] = useState(10);
//    const [totalPages, setTotalPages] = useState(0);
//    const [searchQuery, setSearchQuery] = useState('');
//    const [searchType, setSearchType] = useState('randomOrderNo');
//    const [orderstatus, setOrderstatus] = useState(null);
//    const [selectedOrderNo, setSelectedOrderNo] = useState(null);
//    const [selectedOrderStatus, setSelectedOrderStatus] = useState('');
//    const [statusOptions, setStatusOptions] = useState([]);
//    const [openModal, setOpenModal] = useState(false); // 주문상태 변경 모달
//    const navigate = useNavigate();
//
//    const handleGetCompleteOrders = (page = 0, orderstatus) => {
//        const params = { page, size: pageSize, sort: 'createTime,desc' };
//        let apiCall;
//
//        if (searchQuery) {
//            apiCall = getOrderListSearchSeller(params, searchQuery, searchType);
//        } else if (orderstatus) {
//            apiCall = getOrderStatusListSeller(orderstatus, params);
//        } else { // 취소 제외한 전체 주문상태 목록 조회
//            apiCall = getOrderListSeller(params);
//        }
//
//        apiCall
//            .then(data => {
//                console.log('data : ', data);
//                setOrders(data.content);
//                setTotalPages(data.totalPages);
//            })
//            .catch(error => {
//                console.error("주문 목록을 불러오는 데 실패했습니다.", error);
//            });
//    };
//
//    useEffect(() => {
//        handleGetCompleteOrders(currentPage, orderstatus);
//    }, [searchQuery, searchType, currentPage, orderstatus]);
//
//    const handleDetail = (order) => {
//        navigate('/order-detail-seller', { state: order });
//    };
//
//    const handleSearchChange = (e) => {
//      setSearchQuery(e.target.value);
//    };
//
//    const handleSearchSubmit = (e) => {
//      e.preventDefault();
//      setCurrentPage(0);
//      handleGetCompleteOrders(0);
//    };
//
//    const handleSearchTypeChange = (e) => {
//      setSearchType(e.target.value);
//    };
//
//    const handleStatusFilter = (orderstatus) => {
//        setOrderstatus(orderstatus);
//        setCurrentPage(0);
//    };
//
//    // 주문 상태 변경 모달
//    const handleOpenModal = (orderNo, currentStatus) => {
//        setSelectedOrderNo(orderNo);
//        setSelectedOrderStatus(currentStatus);
//        setStatusOptions([
//            { value: 'READYITEM', label: '상품 준비중' },
//            { value: 'READYSHIP', label: '배송 준비중' },
//            { value: 'SHIPPED', label: '배송중' },
//            { value: 'FINISH', label: '배송 완료' },
//        ]);
//        setOpenModal(true);
//    };
//
//    const handleCloseModal = () => {
//        setOpenModal(false);
//    };
//
//    // 주문상태 변경
//    const handleChangeStatus = async () => {
//        if (selectedOrderNo && selectedOrderStatus) {
//            if (window.confirm("주문상태를 변경하시겠습니까?")) {
//                try {
//                    await putOrderStatus(selectedOrderNo, selectedOrderStatus);
//                    alert("주문 상태가 변경되었습니다.");
//                    handleGetCompleteOrders(currentPage, orderstatus);
//                } catch (error) {
//                    console.error("주문 상태 변경에 실패했습니다.", error);
//                    alert("주문 상태 변경에 실패했습니다.");
//                } finally {
//                    handleCloseModal();
//                }
//            }
//        }
//    };
//
//    // 반품 완료 처리
//    const handleCompleteReturn = async (order) => {
//        if (window.confirm("해당 주문을 반품 완료 처리하시겠습니까?")) {
//            try {
//                await cancelOrderKakao(order.orderNo, 'RETURNCOMPLETE');
//                alert("반품이 완료되었습니다.");
//                handleGetCompleteOrders(currentPage, orderstatus);
//            } catch (error) {
//                console.error('반품 처리 실패:', error);
//                alert("반품 처리에 실패했습니다.");
//            }
//        }
//    };
//
//    // 수정된 집계 함수
//    const aggregateOrderItems = (orderItems) => {
//        if (orderItems.length === 0) return { names: "", totalPrice: 0, totalCount: 0 };
//
//        const sortedItems = [...orderItems].sort((a, b) => a.itemName.localeCompare(b.itemName));
//        const firstItem = sortedItems[0];
//        const totalPrice = sortedItems.reduce((sum, item) => sum + (item.orderPrice * item.count), 0);
//        const totalCount = sortedItems.reduce((sum, item) => sum + item.count, 0); // 총 수량 집계
//        const nameList = sortedItems.map(item => item.itemName);
//        const displayName = nameList.length > 1 ? `${firstItem.itemName} 외 ${nameList.length - 1}개` : firstItem.itemName;
//
//        return { names: displayName, totalPrice, totalCount };
//    };
//
//    const getOrderStatusText = (status) => {
//        switch (status) {
//            case 'COMPLETE':
//                return '결제 완료';
//            case 'READYITEM':
//                return '상품준비중';
//            case 'READYSHIP':
//                return '배송준비중';
//            case 'SHIPPED':
//                return '배송중';
//            case 'FINISH':
//                return '배송 완료';
//            case 'CANCEL':
//                return '주문 취소';
//            case 'PURCHASECONFIRM':
//                return '구매 확정';
//            case 'RETURN':
//                return '반품 신청';
//            case 'RETURNCOMPLETE':
//                return '반품 완료';
//            case 'REFUND':
//                return '환불 완료';
//            default:
//                return '상태 미정의';
//        }
//    };
//
//    const isMobile = useMediaQuery('(max-width:600px)');
//
//    const styles = {
//          table: { width: '100%', borderCollapse: 'collapse' },
//          th: { fontWeight: 'bold', fontSize: '1.8rem', paddingBottom: '10px' },
//          td: { fontWeight: 'bold', fontSize: '1.2rem', paddingBottom: '7px', marginTop: 3 },
//          clickable: { cursor: 'pointer' },
//          card: { padding: '16px' },
//          button: { margin: '0 5px', padding: '8px 16px', border: 'none', borderRadius: '4px', backgroundColor: '#f0f0f0', cursor: 'pointer' },
//          active: { backgroundColor: 'blue', color: 'white' },
//          pagination: { display: 'flex', justifyContent: 'center', marginTop: '20px' },
//          select: { padding: '8px', borderRadius: '4px', border: '1px solid #ccc', marginBottom: '20px' },
//          searchForm: { marginBottom: '20px' },
//          searchInput: { padding: '8px', borderRadius: '4px', border: '1px solid #ccc', marginRight: '10px' },
//          searchButton: { padding: '8px 16px', border: 'none', borderRadius: '4px', backgroundColor: '#f0f0f0', cursor: 'pointer' },
//          statusButtonsContainer: { display: 'flex', flexWrap: 'wrap', gap: isMobile ? '4px' : '8px', marginBottom: '20px' },
//          statusButton: { flex: isMobile ? '1 1 48%' : '1 1 120px', padding: isMobile ? '6px' : '8px', fontSize: isMobile ? '0.9rem' : '1rem', border: 'none', borderRadius: '4px', backgroundColor: '#c0c0c0', cursor: 'pointer', textAlign: 'center', fontWeight: 'bold' },
//          blueButton: { backgroundColor: 'blue', color: 'white' },
//          redButton: { backgroundColor: 'red', color: 'white' },
//          modal: { display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'fixed', top: '0', left: '0', width: '100%', height: '100%', backgroundColor: 'rgba(0,0,0,0.5)', zIndex: 1000 },
//          modalContent: { backgroundColor: 'white', padding: '20px', borderRadius: '8px', textAlign: 'center', width: '300px', boxShadow: '0px 0px 10px rgba(0,0,0,0.2)' },
//          modalTitle: { fontWeight: 'bold', fontSize: '1.5rem', marginBottom: '12px' },
//          selectModal: { width: '100%', padding: '8px', marginBottom: '16px', borderRadius: '4px', border: '1px solid #ccc' },
//          buttonContainer: { display: 'flex', justifyContent: 'space-between' },
//          modalButton: { padding: '8px 16px', border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold' },
//          changeButton: { backgroundColor: '#007bff', color: 'white' },
//          cancelButton: { backgroundColor: '#6c757d', color: 'white' },
//          buttonDisabled: { backgroundColor: '#6c757d', color: '#fff', cursor: 'not-allowed', opacity: 0.65 },
//    };
//
//    const handlePageClick = (page) => {
//        setCurrentPage(page);
//    };
//
//    const renderPagination = () => {
//        const pagination = [];
//        const groupSize = 5;
//        const currentGroup = Math.floor(currentPage / groupSize);
//        const startPage = currentGroup * groupSize;
//        const endPage = Math.min(startPage + groupSize - 1, totalPages - 1);
//
//        pagination.push(
//            <button key="first-group" style={styles.button} onClick={() => handlePageClick(0)}>
//                처음
//            </button>
//        );
//
//        pagination.push(
//            <button key="prev" style={styles.button} disabled={currentPage === 0} onClick={() => handlePageClick(Math.max(currentPage - 1, 0))}>
//                이전
//            </button>
//        );
//
//        for (let i = startPage; i <= endPage; i++) {
//            pagination.push(
//                <button key={i} style={{ ...styles.button, ...(i === currentPage ? styles.active : {}) }} onClick={() => handlePageClick(i)}>
//                    {i + 1}
//                </button>
//            );
//        }
//
//        pagination.push(
//            <button key="next" style={styles.button} disabled={currentPage >= totalPages - 1} onClick={() => handlePageClick(Math.min(currentPage + 1, totalPages - 1))}>
//                다음
//            </button>
//        );
//
//        pagination.push(
//            <button key="last-group" style={styles.button} onClick={() => handlePageClick(totalPages - 1)}>
//                끝
//            </button>
//        );
//
//        return pagination;
//    };
//
//    return (
//        <DashboardLayout>
//            <MDBox pt={3} pb={3}>
//                <MDTypography fontWeight="bold" sx={{ fontSize: '2.5rem' }} variant="body2">
//                    주문 관리(판매자 전용)
//                </MDTypography>
//                <MDTypography fontWeight="bold" sx={{ fontSize: '1.5rem', color: 'blue' }} variant="body2">
//                    ※ 주문 취소는 관리자에게 문의해주세요.
//                </MDTypography>
//                <MDBox pt={3} pb={3}>
//                    <Card style={styles.card}>
//                        <MDBox pt={2} pb={3} px={3} sx={{ overflowX: 'auto' }}>
//                            {/* 상태 필터 버튼들 추가 */}
//                            <div style={styles.statusButtonsContainer}>
//                                <button style={{ ...styles.statusButton, ...styles.blueButton }} onClick={() => handleStatusFilter(null)}>전체 보기<br />(취소 제외)</button>
//                                <button style={styles.statusButton} onClick={() => handleStatusFilter('COMPLETE')}>결제 완료</button>
//                                <button style={styles.statusButton} onClick={() => handleStatusFilter('READYITEM')}>상품 준비중</button>
//                                <button style={styles.statusButton} onClick={() => handleStatusFilter('READYSHIP')}>배송 준비중</button>
//                                <button style={styles.statusButton} onClick={() => handleStatusFilter('SHIPPED')}>배송중</button>
//                                <button style={styles.statusButton} onClick={() => handleStatusFilter('FINISH')}>배송 완료</button>
//                                <button style={styles.statusButton} onClick={() => handleStatusFilter('RETURN')}>반품 신청</button>
//                                <button style={styles.statusButton} onClick={() => handleStatusFilter('RETURNCOMPLETE')}>반품 완료</button>
//                                <button style={{ ...styles.statusButton, ...styles.redButton }} onClick={() => handleStatusFilter('CANCEL')}>취소 목록</button>
//                            </div>
//                            {/* 검색 폼 추가 */}
//                            <form onSubmit={handleSearchSubmit} style={styles.searchForm}>
//                                <select
//                                    id="searchType"
//                                    name="searchType"
//                                    style={styles.select}
//                                    value={searchType}
//                                    onChange={handleSearchTypeChange}
//                                >
//                                    <option value="randomOrderNo">랜덤주문번호</option>
//                                    <option value="memberId">아이디</option>
//                                </select>
//                                <input
//                                    type="text"
//                                    value={searchQuery}
//                                    onChange={handleSearchChange}
//                                    placeholder="검색어를 입력하세요"
//                                    style={styles.searchInput}
//                                />
//                                <button type="submit" style={styles.searchButton}>
//                                    검색
//                                </button>
//                            </form>
//                            <div className="orderList-contents">
//                                {orders.length > 0 ? (
//                                    <table style={styles.table}>
//                                        <thead>
//                                            <tr>
//                                                <th>
//                                                    <MDTypography fontWeight="bold" variant="body2" sx={styles.th}>
//                                                        랜덤주문번호
//                                                    </MDTypography>
//                                                </th>
//                                                <th>
//                                                    <MDTypography fontWeight="bold" variant="body2" sx={styles.th}>
//                                                        아이디
//                                                    </MDTypography>
//                                                </th>
//                                                <th>
//                                                    <MDTypography fontWeight="bold" variant="body2" sx={styles.th}>
//                                                        상품명
//                                                    </MDTypography>
//                                                </th>
//                                                <th>
//                                                    <MDTypography fontWeight="bold" variant="body2" sx={styles.th}>
//                                                        상품수량
//                                                    </MDTypography>
//                                                </th>
//                                                <th>
//                                                    <MDTypography fontWeight="bold" variant="body2" sx={styles.th}>
//                                                        총 가격
//                                                    </MDTypography>
//                                                </th>
//                                                <th>
//                                                    <MDTypography fontWeight="bold" variant="body2" sx={styles.th}>
//                                                        결제상태
//                                                    </MDTypography>
//                                                </th>
//                                                <th>
//                                                    <MDTypography fontWeight="bold" variant="body2" sx={styles.th}>
//                                                        주문일
//                                                    </MDTypography>
//                                                </th>
//                                                 {/* 주문 상태가 CANCEL이 아닐 때만 "주문상태 변경" 필드를 렌더링 */}
//                                                {orders.some(order => order.orderStatus !== 'CANCEL') && (
//                                                    <th>
//                                                        <MDTypography fontWeight="bold" variant="body2" sx={styles.th}>
//                                                            주문상태 변경
//                                                        </MDTypography>
//                                                    </th>
//                                                )}
//                                                <th>
//                                                    <MDTypography fontWeight="bold" variant="body2" sx={styles.th}>
//                                                        반품 처리
//                                                    </MDTypography>
//                                                </th>
//                                            </tr>
//                                        </thead>
//                                        <tbody>
//                                            {orders.map((order) => {
//                                                const { names, totalPrice, totalCount } = aggregateOrderItems(order.orderItemList);
//
//                                                return (
//                                                    <tr key={order.orderNo}>
//                                                        <td>
//                                                            <MDTypography onClick={() => handleDetail(order)} sx={{ ...styles.clickable, ...styles.td }} variant="body2">
//                                                                {order.randomOrderNo}
//                                                            </MDTypography>
//                                                        </td>
//                                                        <td>
//                                                            <MDTypography sx={styles.td} variant="body2">{order.memberId}</MDTypography>
//                                                        </td>
//                                                        <td>
//                                                            <MDTypography sx={styles.td} variant="body2">{names}</MDTypography>
//                                                        </td>
//                                                        <td>
//                                                            <MDTypography sx={styles.td} variant="body2">{totalCount}</MDTypography>
//                                                        </td>
//                                                        <td>
//                                                            <MDTypography sx={styles.td} variant="body2">{totalPrice} 원</MDTypography>
//                                                        </td>
//                                                        <td>
//                                                            <MDTypography sx={styles.td} variant="body2">{getOrderStatusText(order.orderStatus)}</MDTypography>
//                                                        </td>
//                                                        <td>
//                                                            <MDTypography sx={styles.td} variant="body2">{order.orderDate}</MDTypography>
//                                                        </td>
//                                                        <td>
//                                                            {order.orderStatus !== 'CANCEL' && (
//                                                                <button
//                                                                    style={{ ...styles.button, ...(order.orderStatus === 'PURCHASECONFIRM' || order.orderStatus === 'RETURNCOMPLETE' ? styles.buttonDisabled : {}) }}
//                                                                    onClick={() => handleOpenModal(order.orderNo, order.orderStatus)}
//                                                                    disabled={order.orderStatus === 'PURCHASECONFIRM' || order.orderStatus === 'RETURNCOMPLETE'} // 주문상태가 PURCHASECONFIRM일 때 버튼 비활성화
//                                                                >
//                                                                    변경
//                                                                </button>
//                                                            )}
//                                                        </td>
//                                                        <td>
//                                                            <button
//                                                                style={{ ...styles.button, ...(order.orderStatus !== 'RETURN' ? styles.buttonDisabled : {}) }}
//                                                                onClick={() => handleCompleteReturn(order)}
//                                                                disabled={order.orderStatus !== 'RETURN'} // 주문상태가 RETURN이 아닐때 버튼 비활성화
//                                                            >
//                                                                반품 완료
//                                                            </button>
//                                                        </td>
//                                                    </tr>
//                                                );
//                                            })}
//                                        </tbody>
//                                    </table>
//                                ) : (
//                                    <MDTypography sx={{ fontSize: '1.5rem', fontWeight: 'bold' }}>
//                                      주문이 없습니다.
//                                    </MDTypography>
//                                )}
//                                {orders.length > 0 && (
//                                    <MDBox sx={styles.pagination}>
//                                        {renderPagination()}
//                                    </MDBox>
//                                )}
//                            </div>
//                        </MDBox>
//                    </Card>
//                </MDBox>
//            </MDBox>
//            {/* 주문 상태 변경 모달 */}
//            <Modal open={openModal} onClose={handleCloseModal}>
//                <div style={styles.modal}>
//                    <div style={styles.modalContent}>
//                        <div style={styles.modalTitle}>
//                            주문 상태 변경
//                        </div>
//                        <FormControl fullWidth margin="normal">
//                            <InputLabel>주문 상태</InputLabel>
//                            <Select
//                                value={selectedOrderStatus}
//                                onChange={(e) => setSelectedOrderStatus(e.target.value)}
//                                label="주문 상태"
//                                style={styles.selectModal}
//                            >
//                                {statusOptions.map((status) => (
//                                    <MenuItem key={status.value} value={status.value}>
//                                        {status.label}
//                                    </MenuItem>
//                                ))}
//                            </Select>
//                        </FormControl>
//                        <div style={styles.buttonContainer}>
//                            <button onClick={handleChangeStatus} style={{ ...styles.modalButton, ...styles.changeButton }}>
//                                변경
//                            </button>
//                            <button onClick={handleCloseModal} style={{ ...styles.modalButton, ...styles.cancelButton }}>
//                                취소
//                            </button>
//                        </div>
//                    </div>
//                </div>
//            </Modal>
//        </DashboardLayout>
//    );
//}
//
//export default OrderManageSeller;






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

import React, {useEffect, useState} from 'react';
import {useNavigate} from 'react-router-dom';
import {useMediaQuery} from '@mui/material';
import Card from '@mui/material/Card';
import MDBox from '../../../components/MD/MDBox';
import MDTypography from '../../../components/MD/MDTypography';
import DashboardLayout from '../../../examples/LayoutContainers/DashboardLayout';
import { Modal, Select, MenuItem, FormControl, InputLabel } from '@mui/material';

// Data
import { putOrderStatus } from "../../../api/adminApi";
import { getOrderListSearchSeller, getOrderListSeller, getOrderStatusListSeller, cancelOrderKakao } from "../../../api/orderApi";

function OrderManageSeller() {
    const [orders, setOrders] = useState([]);
    const [currentPage, setCurrentPage] = useState(0);
    const [pageSize, setPageSize] = useState(10);
    const [totalPages, setTotalPages] = useState(0);
    const [searchQuery, setSearchQuery] = useState('');
    const [searchType, setSearchType] = useState('randomOrderNo');
    const [orderstatus, setOrderstatus] = useState(null);
    const [selectedOrderNo, setSelectedOrderNo] = useState(null);
    const [selectedOrderStatus, setSelectedOrderStatus] = useState('');
    const [statusOptions, setStatusOptions] = useState([]);
    const [openModal, setOpenModal] = useState(false); // 주문상태 변경 모달
    const navigate = useNavigate();

    const handleGetCompleteOrders = (page = 0, orderstatus) => {
        const params = { page, size: pageSize, sort: 'createTime,desc' };
        let apiCall;

        if (searchQuery) {
            apiCall = getOrderListSearchSeller(params, searchQuery, searchType);
        } else if (orderstatus) {
            apiCall = getOrderStatusListSeller(orderstatus, params);
        } else { // 취소 제외한 전체 주문상태 목록 조회
            apiCall = getOrderListSeller(params);
        }

        apiCall
            .then(data => {
                console.log('data : ', data);
                setOrders(data.content);
                setTotalPages(data.totalPages);
            })
            .catch(error => {
                console.error("주문 목록을 불러오는 데 실패했습니다.", error);
            });
    };

    useEffect(() => {
        handleGetCompleteOrders(currentPage, orderstatus);
    }, [searchQuery, searchType, currentPage, orderstatus]);

    const handleDetail = (order) => {
        navigate('/order-detail-seller', { state: order });
    };

    const handleSearchChange = (e) => {
      setSearchQuery(e.target.value);
    };

    const handleSearchSubmit = (e) => {
      e.preventDefault();
      setCurrentPage(0);
      handleGetCompleteOrders(0);
    };

    const handleSearchTypeChange = (e) => {
      setSearchType(e.target.value);
    };

    const handleStatusFilter = (orderstatus) => {
        setOrderstatus(orderstatus);
        setCurrentPage(0);
    };

    // 주문 상태 변경 모달
    const handleOpenModal = (orderNo, currentStatus) => {
        setSelectedOrderNo(orderNo);
        setSelectedOrderStatus(currentStatus);
        setStatusOptions([
            { value: 'READYITEM', label: '상품 준비중' },
            { value: 'READYSHIP', label: '배송 준비중' },
            { value: 'SHIPPED', label: '배송중' },
            { value: 'FINISH', label: '배송 완료' },
        ]);
        setOpenModal(true);
    };

    const handleCloseModal = () => {
        setOpenModal(false);
    };

    // 주문상태 변경
    const handleChangeStatus = async () => {
        if (selectedOrderNo && selectedOrderStatus) {
            if (window.confirm("주문상태를 변경하시겠습니까?")) {
                try {
                    await putOrderStatus(selectedOrderNo, selectedOrderStatus);
                    alert("주문 상태가 변경되었습니다.");
                    handleGetCompleteOrders(currentPage, orderstatus);
                } catch (error) {
                    console.error("주문 상태 변경에 실패했습니다.", error);
                    alert("주문 상태 변경에 실패했습니다.");
                } finally {
                    handleCloseModal();
                }
            }
        }
    };

    // 반품 완료 처리
    const handleCompleteReturn = async (order) => {
        if (window.confirm("해당 주문을 반품 완료 처리하시겠습니까?")) {
            try {
                await cancelOrderKakao(order.orderNo, 'RETURNCOMPLETE');
                alert("반품이 완료되었습니다.");
                handleGetCompleteOrders(currentPage, orderstatus);
            } catch (error) {
                console.error('반품 처리 실패:', error);
                alert("반품 처리에 실패했습니다.");
            }
        }
    };

    // 수정된 집계 함수
    const aggregateOrderItems = (orderItems) => {
        if (orderItems.length === 0) return { names: "", totalPrice: 0, totalCount: 0 };

        const sortedItems = [...orderItems].sort((a, b) => a.itemName.localeCompare(b.itemName));
        const firstItem = sortedItems[0];
        const totalPrice = sortedItems.reduce((sum, item) => sum + (item.orderPrice * item.count), 0);
        const totalCount = sortedItems.reduce((sum, item) => sum + item.count, 0); // 총 수량 집계
        const nameList = sortedItems.map(item => item.itemName);
        const displayName = nameList.length > 1 ? `${firstItem.itemName} 외 ${nameList.length - 1}개` : firstItem.itemName;

        return { names: displayName, totalPrice, totalCount };
    };

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

    const isMobile = useMediaQuery('(max-width:600px)');

    const styles = {
          table: { width: '100%', borderCollapse: 'collapse' },
          th: { fontWeight: 'bold', fontSize: '1.8rem', paddingBottom: '10px' },
          td: { fontWeight: 'bold', fontSize: '1.2rem', paddingBottom: '7px', marginTop: 3 },
          clickable: { cursor: 'pointer' },
          card: { padding: '16px' },
          button: { margin: '0 5px', padding: '8px 16px', border: 'none', borderRadius: '4px', backgroundColor: '#f0f0f0', cursor: 'pointer' },
          active: { backgroundColor: 'blue', color: 'white' },
          pagination: { display: 'flex', justifyContent: 'center', marginTop: '20px' },
          select: { padding: '8px', borderRadius: '4px', border: '1px solid #ccc', marginBottom: '20px' },
          searchForm: { marginBottom: '20px' },
          searchInput: { padding: '8px', borderRadius: '4px', border: '1px solid #ccc', marginRight: '10px' },
          searchButton: { padding: '8px 16px', border: 'none', borderRadius: '4px', backgroundColor: '#f0f0f0', cursor: 'pointer' },
          statusButtonsContainer: { display: 'flex', flexWrap: 'wrap', gap: isMobile ? '4px' : '8px', marginBottom: '20px' },
          statusButton: { flex: isMobile ? '1 1 48%' : '1 1 120px', padding: isMobile ? '6px' : '8px', fontSize: isMobile ? '0.9rem' : '1rem', border: 'none', borderRadius: '4px', backgroundColor: '#c0c0c0', cursor: 'pointer', textAlign: 'center', fontWeight: 'bold' },
          blueButton: { backgroundColor: 'blue', color: 'white' },
          redButton: { backgroundColor: 'red', color: 'white' },
          modal: { display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'fixed', top: '0', left: '0', width: '100%', height: '100%', backgroundColor: 'rgba(0,0,0,0.5)', zIndex: 1000 },
          modalContent: { backgroundColor: 'white', padding: '20px', borderRadius: '8px', textAlign: 'center', width: '300px', boxShadow: '0px 0px 10px rgba(0,0,0,0.2)' },
          modalTitle: { fontWeight: 'bold', fontSize: '1.5rem', marginBottom: '12px' },
          selectModal: { width: '100%', padding: '8px', marginBottom: '16px', borderRadius: '4px', border: '1px solid #ccc' },
          buttonContainer: { display: 'flex', justifyContent: 'space-between' },
          modalButton: { padding: '8px 16px', border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold' },
          changeButton: { backgroundColor: '#007bff', color: 'white' },
          cancelButton: { backgroundColor: '#6c757d', color: 'white' },
          buttonDisabled: { backgroundColor: '#6c757d', color: '#fff', cursor: 'not-allowed', opacity: 0.65 },
    };

    const handlePageClick = (page) => {
        setCurrentPage(page);
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

    return (
        <DashboardLayout>
            <MDBox pt={3} pb={3}>
                <MDTypography fontWeight="bold" sx={{ fontSize: '2.5rem' }} variant="body2">
                    주문 관리(판매자 전용)
                </MDTypography>
                <MDTypography fontWeight="bold" sx={{ fontSize: '1.5rem', color: 'blue' }} variant="body2">
                    ※ 주문 취소는 관리자에게 문의해주세요.
                </MDTypography>
                <MDBox pt={3} pb={3}>
                    <Card style={styles.card}>
                        <MDBox pt={2} pb={3} px={3} sx={{ overflowX: 'auto' }}>
                            {/* 상태 필터 버튼들 추가 */}
                            <div style={styles.statusButtonsContainer}>
                                <button style={{ ...styles.statusButton, ...styles.blueButton }} onClick={() => handleStatusFilter(null)}>전체 보기<br />(취소 제외)</button>
                                <button style={styles.statusButton} onClick={() => handleStatusFilter('COMPLETE')}>결제 완료</button>
                                <button style={styles.statusButton} onClick={() => handleStatusFilter('READYITEM')}>상품 준비중</button>
                                <button style={styles.statusButton} onClick={() => handleStatusFilter('READYSHIP')}>배송 준비중</button>
                                <button style={styles.statusButton} onClick={() => handleStatusFilter('SHIPPED')}>배송중</button>
                                <button style={styles.statusButton} onClick={() => handleStatusFilter('FINISH')}>배송 완료</button>
                                <button style={styles.statusButton} onClick={() => handleStatusFilter('RETURN')}>반품 신청</button>
                                <button style={styles.statusButton} onClick={() => handleStatusFilter('RETURNCOMPLETE')}>반품 완료</button>
                                <button style={{ ...styles.statusButton, ...styles.redButton }} onClick={() => handleStatusFilter('CANCEL')}>취소 목록</button>
                            </div>
                            {/* 검색 폼 추가 */}
                            <form onSubmit={handleSearchSubmit} style={styles.searchForm}>
                                <select
                                    id="searchType"
                                    name="searchType"
                                    style={styles.select}
                                    value={searchType}
                                    onChange={handleSearchTypeChange}
                                >
                                    <option value="randomOrderNo">랜덤주문번호</option>
                                    <option value="memberId">아이디</option>
                                </select>
                                <input
                                    type="text"
                                    value={searchQuery}
                                    onChange={handleSearchChange}
                                    placeholder="검색어를 입력하세요"
                                    style={styles.searchInput}
                                />
                                <button type="submit" style={styles.searchButton}>
                                    검색
                                </button>
                            </form>
                            <div className="orderList-contents">
                                {orders.length > 0 ? (
                                    isMobile ? (
                                        // 모바일 리스트 형식
                                        orders.map((order) => {
                                            const { names, totalPrice, totalCount } = aggregateOrderItems(order.orderItemList);
                                            const isOrderCancelled = order.orderStatus === 'CANCEL'; // 주문 상태가 CANCEL인지 확인

                                            return (
                                                <div key={order.orderNo} style={{ borderBottom: '1px solid #ddd', padding: '8px' }}>
                                                    <MDTypography onClick={() => handleDetail(order)} sx={{ ...styles.clickable }} variant="body2">
                                                        <strong>랜덤주문번호:</strong> {order.randomOrderNo}
                                                    </MDTypography>
                                                    <MDTypography variant="body2">
                                                        <strong>아이디:</strong> {order.memberId}
                                                    </MDTypography>
                                                    <MDTypography variant="body2">
                                                        <strong>상품명:</strong> {names}
                                                    </MDTypography>
                                                    <MDTypography variant="body2">
                                                        <strong>상품수량:</strong> {totalCount}
                                                    </MDTypography>
                                                    <MDTypography variant="body2">
                                                        <strong>총 가격:</strong> {totalPrice} 원
                                                    </MDTypography>
                                                    <MDTypography variant="body2">
                                                        <strong>결제상태:</strong> {getOrderStatusText(order.orderStatus)}
                                                    </MDTypography>
                                                    <MDTypography variant="body2">
                                                        <strong>주문일:</strong> {order.orderDate}
                                                    </MDTypography>
                                                    <div style={{ display: 'flex', gap: '8px', marginTop: '8px' }}>
                                                        {order.orderStatus !== 'CANCEL' && (
                                                            <button
                                                                style={{ ...styles.button, ...(order.orderStatus === 'PURCHASECONFIRM' || order.orderStatus === 'RETURNCOMPLETE' ? styles.buttonDisabled : {}) }}
                                                                onClick={() => handleOpenModal(order.orderNo, order.orderStatus)}
                                                                disabled={order.orderStatus === 'PURCHASECONFIRM' || order.orderStatus === 'RETURNCOMPLETE'} // 주문상태가 PURCHASECONFIRM일 때 버튼 비활성화
                                                            >
                                                                변경
                                                            </button>
                                                        )}
                                                        <button
                                                            style={{ ...styles.button, ...(order.orderStatus !== 'RETURN' ? styles.buttonDisabled : {}) }}
                                                            onClick={() => handleCompleteReturn(order)}
                                                            disabled={order.orderStatus !== 'RETURN'} // 주문상태가 RETURN이 아닐때 버튼 비활성화
                                                        >
                                                            반품 완료
                                                        </button>
                                                    </div>
                                                </div>
                                            );
                                        })
                                    ) : (
                                        // 데스크탑 테이블 형식
                                        <table style={styles.table}>
                                            <thead>
                                                <tr>
                                                    <th>
                                                        <MDTypography fontWeight="bold" variant="body2" sx={styles.th}>
                                                            랜덤주문번호
                                                        </MDTypography>
                                                    </th>
                                                    <th>
                                                        <MDTypography fontWeight="bold" variant="body2" sx={styles.th}>
                                                            아이디
                                                        </MDTypography>
                                                    </th>
                                                    <th>
                                                        <MDTypography fontWeight="bold" variant="body2" sx={styles.th}>
                                                            상품명
                                                        </MDTypography>
                                                    </th>
                                                    <th>
                                                        <MDTypography fontWeight="bold" variant="body2" sx={styles.th}>
                                                            상품수량
                                                        </MDTypography>
                                                    </th>
                                                    <th>
                                                        <MDTypography fontWeight="bold" variant="body2" sx={styles.th}>
                                                            총 가격
                                                        </MDTypography>
                                                    </th>
                                                    <th>
                                                        <MDTypography fontWeight="bold" variant="body2" sx={styles.th}>
                                                            결제상태
                                                        </MDTypography>
                                                    </th>
                                                    <th>
                                                        <MDTypography fontWeight="bold" variant="body2" sx={styles.th}>
                                                            주문일
                                                        </MDTypography>
                                                    </th>
                                                     {/* 주문 상태가 CANCEL이 아닐 때만 "주문상태 변경" 필드를 렌더링 */}
                                                    {orders.some(order => order.orderStatus !== 'CANCEL') && (
                                                        <th>
                                                            <MDTypography fontWeight="bold" variant="body2" sx={styles.th}>
                                                                주문상태 변경
                                                            </MDTypography>
                                                        </th>
                                                    )}
                                                    <th>
                                                        <MDTypography fontWeight="bold" variant="body2" sx={styles.th}>
                                                            반품 처리
                                                        </MDTypography>
                                                    </th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {orders.map((order) => {
                                                    const { names, totalPrice, totalCount } = aggregateOrderItems(order.orderItemList);

                                                    return (
                                                        <tr key={order.orderNo}>
                                                            <td>
                                                                <MDTypography onClick={() => handleDetail(order)} sx={{ ...styles.clickable, ...styles.td }} variant="body2">
                                                                    {order.randomOrderNo}
                                                                </MDTypography>
                                                            </td>
                                                            <td>
                                                                <MDTypography sx={styles.td} variant="body2">{order.memberId}</MDTypography>
                                                            </td>
                                                            <td>
                                                                <MDTypography sx={styles.td} variant="body2">{names}</MDTypography>
                                                            </td>
                                                            <td>
                                                                <MDTypography sx={styles.td} variant="body2">{totalCount}</MDTypography>
                                                            </td>
                                                            <td>
                                                                <MDTypography sx={styles.td} variant="body2">{totalPrice} 원</MDTypography>
                                                            </td>
                                                            <td>
                                                                <MDTypography sx={styles.td} variant="body2">{getOrderStatusText(order.orderStatus)}</MDTypography>
                                                            </td>
                                                            <td>
                                                                <MDTypography sx={styles.td} variant="body2">{order.orderDate}</MDTypography>
                                                            </td>
                                                            <td>
                                                                {order.orderStatus !== 'CANCEL' && (
                                                                    <button
                                                                        style={{ ...styles.button, ...(order.orderStatus === 'PURCHASECONFIRM' || order.orderStatus === 'RETURNCOMPLETE' ? styles.buttonDisabled : {}) }}
                                                                        onClick={() => handleOpenModal(order.orderNo, order.orderStatus)}
                                                                        disabled={order.orderStatus === 'PURCHASECONFIRM' || order.orderStatus === 'RETURNCOMPLETE'} // 주문상태가 PURCHASECONFIRM일 때 버튼 비활성화
                                                                    >
                                                                        변경
                                                                    </button>
                                                                )}
                                                            </td>
                                                            <td>
                                                                <button
                                                                    style={{ ...styles.button, ...(order.orderStatus !== 'RETURN' ? styles.buttonDisabled : {}) }}
                                                                    onClick={() => handleCompleteReturn(order)}
                                                                    disabled={order.orderStatus !== 'RETURN'} // 주문상태가 RETURN이 아닐때 버튼 비활성화
                                                                >
                                                                    반품 완료
                                                                </button>
                                                            </td>
                                                        </tr>
                                                    );
                                                })}
                                            </tbody>
                                        </table>
                                    )
                                ) : (
                                    <MDTypography sx={{ fontSize: '1.5rem', fontWeight: 'bold' }}>
                                      주문이 없습니다.
                                    </MDTypography>
                                )}
                                {orders.length > 0 && (
                                    <MDBox sx={styles.pagination}>
                                        {renderPagination()}
                                    </MDBox>
                                )}
                            </div>
                        </MDBox>
                    </Card>
                </MDBox>
            </MDBox>
            {/* 주문 상태 변경 모달 */}
            <Modal open={openModal} onClose={handleCloseModal}>
                <div style={styles.modal}>
                    <div style={styles.modalContent}>
                        <div style={styles.modalTitle}>
                            주문 상태 변경
                        </div>
                        <FormControl fullWidth margin="normal">
                            <InputLabel>주문 상태</InputLabel>
                            <Select
                                value={selectedOrderStatus}
                                onChange={(e) => setSelectedOrderStatus(e.target.value)}
                                label="주문 상태"
                                style={styles.selectModal}
                            >
                                {statusOptions.map((status) => (
                                    <MenuItem key={status.value} value={status.value}>
                                        {status.label}
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                        <div style={styles.buttonContainer}>
                            <button onClick={handleChangeStatus} style={{ ...styles.modalButton, ...styles.changeButton }}>
                                변경
                            </button>
                            <button onClick={handleCloseModal} style={{ ...styles.modalButton, ...styles.cancelButton }}>
                                취소
                            </button>
                        </div>
                    </div>
                </div>
            </Modal>
        </DashboardLayout>
    );
}

export default OrderManageSeller;
