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
//import * as React from 'react';
//import { useEffect, useState } from 'react';
//import { useNavigate } from 'react-router-dom';
//import Card from '@mui/material/Card';
//import MDBox from '../../components/MD/MDBox';
//import MDTypography from '../../components/MD/MDTypography';
//import {Button, Modal, TextField} from '@mui/material';
//import DashboardLayout from '../../examples/LayoutContainers/DashboardLayout';
//import { postDelivery, getDeliveryList, putDelivery, deleteDelivery, putDeliveryPrimary, putDeliveryDelPrimary } from "../../api/deliveryApi";
//
//function DeliveryManage() {
//    const [deliveries, setDeliveries] = useState([]);
//    const [currentPage, setCurrentPage] = useState(0);
//    const [totalPages, setTotalPages] = useState(0);
//    const [openAddModal, setOpenAddModal] = useState(false);
//    const [openEditModal, setOpenEditModal] = useState(false);
//    const [newDelivery, setNewDelivery] = useState({});
//    const [editDelivery, setEditDelivery] = useState(null);
//    const navigate = useNavigate();
//
//    const handleGetDeliveries = (page) => {
//        const params = { page, size : 7, sort: 'createTime,asc' };
//        getDeliveryList(params)
//            .then(data => {
//                setDeliveries(data.content);
//                setTotalPages(data.totalPages);
//            })
//            .catch(error => {
//                console.error("배송지 목록을 불러오는 데 실패했습니다.", error);
//            });
//    };
//
//    useEffect(() => {
//        handleGetDeliveries(currentPage);
//    }, [currentPage]);
//
//    // 추가
//    const handleOpenAddModal = () => {
//        setNewDelivery({
//            title: '',
//            receiver: '',
//            phone: '',
//            postCode: '',
//            roadAddr: '',
//            jibunAddr: '',
//            detailAddr: '',
//            extraAddr: ''
//        });
//        setOpenAddModal(true);
//    };
//
//    const handleCloseAddModal = () => {
//        setOpenAddModal(false);
//        setNewDelivery(null);
//    };
//
//    const handleNewDeliveryChange = (e) => {
//        setNewDelivery({
//            ...newDelivery,
//            [e.target.name]: e.target.value
//        });
//    };
//
//    const handleAddSubmit = async (event) => {
//        event.preventDefault(); // 폼 전송 이벤트 방지
//
//        if (!window.confirm('배송지를 추가하시겠습니까?')) {
//            return;
//        }
//
//        // 유효성 검사
//        if (!newDelivery.title || !newDelivery.receiver || !newDelivery.phone || !newDelivery.postCode ||
//            !newDelivery.roadAddr || !newDelivery.jibunAddr || !newDelivery.detailAddr || !newDelivery.extraAddr
//        ) {
//            alert('모든 필드를 입력해주세요.');
//            return;
//        }
//
//        // FormData 생성
//        const formData = new FormData();
//        formData.append('title', newDelivery.title);
//        formData.append('receiver', newDelivery.receiver);
//        formData.append('phone', newDelivery.phone);
//        formData.append('postCode', newDelivery.postCode);
//        formData.append('roadAddr', newDelivery.roadAddr);
//        formData.append('jibunAddr', newDelivery.jibunAddr);
//        formData.append('detailAddr', newDelivery.detailAddr);
//        formData.append('extraAddr', newDelivery.extraAddr);
//
//        try {
//            await postDelivery(formData);
//            handleGetDeliveries(currentPage);
//            handleCloseAddModal();
//        } catch (error) {
//            alert('추가 실패:', error);
//        }
//    };
//
//    // 수정
//    const handleOpenEditModal = (delivery) => {
//        setEditDelivery(delivery);
//        setOpenEditModal(true);
//    };
//
//    const handleCloseEditModal = () => {
//        setOpenEditModal(false);
//        setEditDelivery(null);
//    };
//
//    const handleEditChange = (e) => {
//        setEditDelivery({
//            ...editDelivery,
//            [e.target.name]: e.target.value
//        });
//    };
//
//    const handleEditSubmit = async () => {
//
//        // FormData 생성
//        const formData = new FormData();
//        formData.append('title', editDelivery.title);
//        formData.append('receiver', editDelivery.receiver);
//        formData.append('phone', editDelivery.phone);
//        formData.append('postCode', editDelivery.postCode);
//        formData.append('roadAddr', editDelivery.roadAddr);
//        formData.append('jibunAddr', editDelivery.jibunAddr);
//        formData.append('detailAddr', editDelivery.detailAddr);
//        formData.append('extraAddr', editDelivery.extraAddr);
//
//        try {
//            await putDelivery(editDelivery.deliveryNo, formData);
//            handleGetDeliveries(currentPage);
//            handleCloseEditModal();
//        } catch (error) {
//            alert('수정 실패:', error);
//        }
//    };
//
//    // 삭제
//    const handleDeleteDelivery = async (deliveryNo) => {
//
//        if (!window.confirm('해당 배송지를 삭제하시겠습니까?')) {
//            return; // 사용자가 취소를 선택한 경우, 함수 종료
//        }
//
//        try {
//            const result = await deleteDelivery(deliveryNo);
//            console.log('삭제 성공:', result);
//            handleGetDeliveries(currentPage);
//
//        } catch (error) {
//            alert('삭제 실패:', error);
//        }
//    }
//
//    // 기본배송지 설정
//    const handleSetPrimary = async (deliveryNo) => {
//        try {
//            await putDeliveryPrimary(deliveryNo);
//            handleGetDeliveries(currentPage);
//        } catch (error) {
//            alert('기본 배송지 설정 실패:', error);
//        }
//    };
//
//    // 기본배송지 해제
//    const handleDelPrimary = async (deliveryNo) => {
//        try {
//            await putDeliveryDelPrimary(deliveryNo);
//            handleGetDeliveries(currentPage);
//        } catch (error) {
//            alert('기본 배송지 해제 실패:', error);
//        }
//    };
//
//    const openDaumPostcode = (mode) => {
//        if (window.daum && window.daum.Postcode) {
//            new window.daum.Postcode({
//                oncomplete: function(data) {
//                    const roadAddr = data.roadAddress;
//                    let extraRoadAddr = '';
//
//                    if (data.bname !== '' && /[동|로|가]$/g.test(data.bname)) {
//                        extraRoadAddr += data.bname;
//                    }
//                    if (data.buildingName !== '' && data.apartment === 'Y') {
//                        extraRoadAddr += (extraRoadAddr !== '' ? ', ' + data.buildingName : data.buildingName);
//                    }
//                    if (extraRoadAddr !== '') {
//                        extraRoadAddr = ' (' + extraRoadAddr + ')';
//                    }
//
//                    if (mode === 'add') {
//                        setNewDelivery({
//                            ...newDelivery,
//                            postCode: data.zonecode,
//                            roadAddr: roadAddr,
//                            jibunAddr: data.jibunAddress,
//                            extraAddr: extraRoadAddr,
//                        });
//                    } else {
//                        setEditDelivery({
//                            ...editDelivery,
//                            postCode: data.zonecode,
//                            roadAddr: roadAddr,
//                            jibunAddr: data.jibunAddress,
//                            extraAddr: extraRoadAddr,
//                        });
//                    }
//                },
//            }).open();
//        } else {
//            console.error('카카오 주소 검색 api가 로드되지않았습니다.');
//        }
//    };
//
//    // Inline styles
//    const styles = {
//        table: {
//            width: '100%',
//            borderCollapse: 'collapse',
//        },
//        th: {
//            fontWeight: 'bold',
//            fontSize: '1.5rem',
//            paddingBottom: '10px',
//        },
//        td: {
//            fontWeight: 'bold',
//            fontSize: '1.2rem',
//            paddingBottom: '7px',
//            marginTop: 3,
//        },
//        clickable: {
//            cursor: 'pointer',
//        },
//        card: {
//            padding: '16px',
//        },
//        button: {
//            margin: '0 5px',
//            padding: '8px 16px',
//            border: 'none',
//            borderRadius: '4px',
//            backgroundColor: '#f0f0f0',
//            cursor: 'pointer',
//        },
//        addDeliveryButton: {
//            marginBottom: '20px',
//            padding: '10px 20px',
//            backgroundColor: 'green',
//            color: 'white',
//            border: 'none',
//            borderRadius: '4px',
//            cursor: 'pointer',
//            fontSize: '1.2rem'
//        },
//        active: {
//            backgroundColor: 'blue',
//            color: 'white',
//        },
//        primaryActive: {
//            color: 'black',
//        },
//        pagination: {
//            display: 'flex',
//            justifyContent: 'center',
//            marginTop: '20px',
//        },
//        select: {
//            padding: '8px',
//            borderRadius: '4px',
//            border: '1px solid #ccc',
//            marginBottom: '20px',
//        },
//        modal: {
//            display: 'flex',
//            justifyContent: 'center',
//            alignItems: 'center',
//        },
//        modalContent: {
//            backgroundColor: 'white',
//            padding: '20px',
//            borderRadius: '8px',
//            boxShadow: '0 0 10px rgba(0,0,0,0.1)',
//            width: '400px',
//        },
//        disabled: {
//            color: '#ccc',
//            cursor: 'not-allowed',
//        },
//    };
//
//    const handlePageClick = (page) => {
//        setCurrentPage(page);
//    };
//
//    // 페이징
//    const renderPagination = () => {
//        const pagination = [];
//        const groupSize = 5;
//        const currentGroup = Math.floor(currentPage / groupSize);
//        const startPage = currentGroup * groupSize;
//        const endPage = Math.min(startPage + groupSize - 1, totalPages - 1);
//
//        pagination.push(
//            <button
//                key="first-group"
//                style={styles.button}
//                onClick={() => handlePageClick(0)}
//            >
//                처음
//            </button>
//        );
//
//        pagination.push(
//            <button
//                key="prev"
//                style={styles.button}
//                disabled={currentPage === 0}
//                onClick={() => handlePageClick(Math.max(currentPage - 1, 0))}
//            >
//                이전
//            </button>
//        );
//
//        for (let i = startPage; i <= endPage; i++) {
//            pagination.push(
//                <button
//                    key={i}
//                    style={{ ...styles.button, ...(i === currentPage ? styles.active : {}) }}
//                    onClick={() => handlePageClick(i)}
//                >
//                    {i + 1}
//                </button>
//            );
//        }
//
//        pagination.push(
//            <button
//                key="next"
//                style={styles.button}
//                disabled={currentPage >= totalPages - 1}
//                onClick={() => handlePageClick(Math.min(currentPage + 1, totalPages - 1))}
//            >
//                다음
//            </button>
//        );
//
//        pagination.push(
//            <button
//                key="last-group"
//                style={styles.button}
//                onClick={() => handlePageClick(totalPages - 1)}
//            >
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
//                    배송지 관리
//                </MDTypography>
//                <MDBox pt={3} pb={3}>
//                    <Button style={styles.addDeliveryButton} onClick={handleOpenAddModal}>
//                        배송지 추가
//                    </Button>
//                    <Card style={styles.card}>
//                        <MDBox pt={2} pb={3} px={3} sx={{ overflowX: 'auto' }}>
//                            <div className="deliveryList-contents">
//                                {deliveries.length > 0 ? (
//                                    <table style={styles.table}>
//                                        <thead>
//                                            <tr>
//                                                <th>
//                                                    <MDTypography fontWeight="bold" variant="body2" sx={styles.th}>
//                                                        기본배송지
//                                                    </MDTypography>
//                                                </th>
//                                                <th>
//                                                    <MDTypography fontWeight="bold" variant="body2" sx={styles.th}>
//                                                        배송지이름
//                                                    </MDTypography>
//                                                </th>
//                                                <th>
//                                                    <MDTypography fontWeight="bold" variant="body2" sx={styles.th}>
//                                                        받는사람
//                                                    </MDTypography>
//                                                </th>
//                                                <th>
//                                                    <MDTypography fontWeight="bold" variant="body2" sx={styles.th}>
//                                                        휴대전화번호
//                                                    </MDTypography>
//                                                </th>
//                                                <th>
//                                                    <MDTypography fontWeight="bold" variant="body2" sx={styles.th}>
//                                                        우편번호
//                                                    </MDTypography>
//                                                </th>
//                                                <th>
//                                                    <MDTypography fontWeight="bold" variant="body2" sx={styles.th}>
//                                                        도로명주소
//                                                    </MDTypography>
//                                                </th>
//                                                <th>
//                                                    <MDTypography fontWeight="bold" variant="body2" sx={styles.th}>
//                                                        지번주소
//                                                    </MDTypography>
//                                                </th>
//                                                <th>
//                                                    <MDTypography fontWeight="bold" variant="body2" sx={styles.th}>
//                                                        상세주소
//                                                    </MDTypography>
//                                                </th>
//                                                <th>
//                                                    <MDTypography fontWeight="bold" variant="body2" sx={styles.th}>
//                                                        참고사항
//                                                    </MDTypography>
//                                                </th>
//                                                <th>
//                                                    <MDTypography fontWeight="bold" variant="body2" sx={styles.th}>
//                                                        수정
//                                                    </MDTypography>
//                                                </th>
//                                                <th>
//                                                    <MDTypography fontWeight="bold" variant="body2" sx={styles.th}>
//                                                        삭제
//                                                    </MDTypography>
//                                                </th>
//                                                <th>
//                                                    <MDTypography fontWeight="bold" variant="body2" sx={styles.th}>
//                                                        기본배송지 설정
//                                                    </MDTypography>
//                                                </th>
//                                            </tr>
//                                        </thead>
//
//                                        <tbody>
//                                            {deliveries.map((delivery) => (
//                                                <tr key={delivery.deliveryNo}>
//                                                    <td>
//                                                        <MDTypography
//                                                            style={styles.clickable}
//                                                            sx={styles.td}
//                                                            variant="body2"
//                                                        >
//                                                            {delivery.primary ? "기본배송지" : ""}
//                                                        </MDTypography>
//                                                    </td>
//                                                    <td>
//                                                        <MDTypography sx={styles.td} variant="body2">
//                                                            {delivery.title}
//                                                        </MDTypography>
//                                                    </td>
//                                                    <td>
//                                                        <MDTypography sx={styles.td} variant="body2">
//                                                            {delivery.receiver}
//                                                        </MDTypography>
//                                                    </td>
//                                                    <td>
//                                                        <MDTypography sx={styles.td} variant="body2">
//                                                            {delivery.phone}
//                                                        </MDTypography>
//                                                    </td>
//                                                    <td>
//                                                        <MDTypography sx={styles.td} variant="body2">
//                                                            {delivery.postCode}
//                                                        </MDTypography>
//                                                    </td>
//                                                    <td>
//                                                        <MDTypography sx={styles.td} variant="body2">
//                                                            {delivery.roadAddr}
//                                                        </MDTypography>
//                                                    </td>
//                                                    <td>
//                                                        <MDTypography sx={styles.td} variant="body2">
//                                                            {delivery.jibunAddr}
//                                                        </MDTypography>
//                                                    </td>
//                                                    <td>
//                                                        <MDTypography sx={styles.td} variant="body2">
//                                                            {delivery.detailAddr}
//                                                        </MDTypography>
//                                                    </td>
//                                                    <td>
//                                                        <MDTypography sx={styles.td} variant="body2">
//                                                            {delivery.extraAddr}
//                                                        </MDTypography>
//                                                    </td>
//                                                    <td>
//                                                        <MDTypography
//                                                            style={styles.clickable}
//                                                            sx={styles.td}
//                                                            variant="body2"
//                                                            onClick={() => handleOpenEditModal(delivery)}
//                                                        >
//                                                            수정
//                                                        </MDTypography>
//                                                    </td>
//                                                    <td>
//                                                        <MDTypography
//                                                            style={styles.clickable}
//                                                            sx={styles.td}
//                                                            variant="body2"
//                                                            onClick={() => handleDeleteDelivery(delivery.deliveryNo)}
//
//                                                        >
//                                                            삭제
//                                                        </MDTypography>
//                                                    </td>
//                                                    <td>
//                                                        <MDTypography
//                                                            style={{ ...styles.clickable, ...(delivery.primary ? styles.disabled : styles.primaryActive) }}
//                                                            sx={styles.td}
//                                                            variant="body2"
//                                                            onClick={() => {
//                                                                if (!delivery.primary) handleSetPrimary(delivery.deliveryNo);
//                                                            }}
//                                                        >
//                                                            설정
//                                                        </MDTypography>
//                                                        <MDTypography
//                                                            style={{ ...styles.clickable, ...(delivery.primary ? styles.primaryActive : styles.disabled) }}
//                                                            sx={styles.td}
//                                                            variant="body2"
//                                                            onClick={() => {
//                                                                if (delivery.primary) handleDelPrimary(delivery.deliveryNo);
//                                                            }}
//                                                        >
//                                                            해제
//                                                        </MDTypography>
//                                                    </td>
//                                                </tr>
//                                            ))}
//                                        </tbody>
//                                    </table>
//                                ) : (
//                                    <MDTypography sx={styles.noDeliveries}>
//                                        저장된 배송지가 없습니다
//                                    </MDTypography>
//                                )}
//                            </div>
//                        </MDBox>
//                    </Card>
//                </MDBox>
//                {deliveries.length > 0 && (
//                    <MDBox sx={styles.pagination}>
//                        {renderPagination()}
//                    </MDBox>
//                )}
//            </MDBox>
//            {/* 배송지 추가 모달 */}
//            <Modal
//                open={openAddModal}
//                onClose={handleCloseAddModal}
//                aria-labelledby="modal-title"
//                aria-describedby="modal-description"
//                style={styles.modal}
//            >
//                <div style={styles.modalContent}>
//                    <h2>배송지 추가</h2>
//                    <form id="addDeliveryForm">
//                        <TextField
//                            fullWidth
//                            label="배송지 이름"
//                            name="title"
//                            value={newDelivery?.title || ''}
//                            onChange={handleNewDeliveryChange}
//                            margin="normal"
//                            required
//                        />
//                        <TextField
//                            fullWidth
//                            label="받는 사람"
//                            name="receiver"
//                            value={newDelivery?.receiver || ''}
//                            onChange={handleNewDeliveryChange}
//                            margin="normal"
//                            required
//                        />
//                        <TextField
//                            fullWidth
//                            label="휴대전화번호"
//                            name="phone"
//                            value={newDelivery?.phone || ''}
//                            onChange={handleNewDeliveryChange}
//                            margin="normal"
//                            required
//                        />
//                        <TextField
//                            fullWidth
//                            label="우편번호"
//                            name="postCode"
//                            value={newDelivery?.postCode || ''}
//                            onChange={handleNewDeliveryChange}
//                            margin="normal"
//                            required
//                            InputProps={{
//                                endAdornment: (
//                                    <Button
//                                        variant="contained"
//                                        color="error"
//                                        onClick={() => openDaumPostcode('add')}
//                                    >
//                                        우편번호 찾기
//                                    </Button>
//                                ),
//                            }}
//                        />
//                        <TextField
//                            fullWidth
//                            label="도로명주소"
//                            name="roadAddr"
//                            value={newDelivery?.roadAddr || ''}
//                            onChange={handleNewDeliveryChange}
//                            margin="normal"
//                            required
//                        />
//                        <TextField
//                            fullWidth
//                            label="지번주소"
//                            name="jibunAddr"
//                            value={newDelivery?.jibunAddr || ''}
//                            onChange={handleNewDeliveryChange}
//                            margin="normal"
//                            required
//                        />
//                        <TextField
//                            fullWidth
//                            label="상세주소"
//                            name="detailAddr"
//                            value={newDelivery?.detailAddr || ''}
//                            onChange={handleNewDeliveryChange}
//                            margin="normal"
//                            required
//                        />
//                        <TextField
//                            fullWidth
//                            label="참고사항"
//                            name="extraAddr"
//                            value={newDelivery?.extraAddr || ''}
//                            onChange={handleNewDeliveryChange}
//                            margin="normal"
//                            required
//                        />
//                        <Button
//                            variant="contained"
//                            color="error"
//                            onClick={handleAddSubmit}
//                        >
//                            추가하기
//                        </Button>
//                        <Button
//                            variant="contained"
//                            color="error"
//                            onClick={handleCloseAddModal}
//                        >
//                            취소
//                        </Button>
//                    </form>
//                </div>
//            </Modal>
//            {/* 배송지 수정 모달 */}
//            <Modal
//                open={openEditModal}
//                onClose={handleCloseEditModal}
//                aria-labelledby="modal-title"
//                aria-describedby="modal-description"
//                style={styles.modal}
//            >
//                <div style={styles.modalContent}>
//                    <h2>배송지 수정</h2>
//                    <form id="editDeliveryForm">
//                        <TextField
//                            fullWidth
//                            label="배송지 이름"
//                            name="title"
//                            value={editDelivery?.title || ''}
//                            onChange={handleEditChange}
//                            margin="normal"
//                            required
//                        />
//                        <TextField
//                            fullWidth
//                            label="받는 사람"
//                            name="receiver"
//                            value={editDelivery?.receiver || ''}
//                            onChange={handleEditChange}
//                            margin="normal"
//                            required
//                        />
//                        <TextField
//                            fullWidth
//                            label="휴대전화번호"
//                            name="phone"
//                            value={editDelivery?.phone || ''}
//                            onChange={handleEditChange}
//                            margin="normal"
//                            required
//                        />
//                        <TextField
//                            fullWidth
//                            label="우편번호"
//                            name="postCode"
//                            value={editDelivery?.postCode || ''}
//                            onChange={handleEditChange}
//                            margin="normal"
//                            required
//                            InputProps={{
//                                endAdornment: (
//                                    <Button
//                                        variant="contained"
//                                        color="error"
//                                        onClick={() => openDaumPostcode('edit')}
//                                    >
//                                        우편번호 찾기
//                                    </Button>
//                                ),
//                            }}
//                        />
//                        <TextField
//                            fullWidth
//                            label="도로명주소"
//                            name="roadAddr"
//                            value={editDelivery?.roadAddr || ''}
//                            onChange={handleEditChange}
//                            margin="normal"
//                            required
//                        />
//                        <TextField
//                            fullWidth
//                            label="지번주소"
//                            name="jibunAddr"
//                            value={editDelivery?.jibunAddr || ''}
//                            onChange={handleEditChange}
//                            margin="normal"
//                            required
//                        />
//                        <TextField
//                            fullWidth
//                            label="상세주소"
//                            name="detailAddr"
//                            value={editDelivery?.detailAddr || ''}
//                            onChange={handleEditChange}
//                            margin="normal"
//                            required
//                        />
//                        <TextField
//                            fullWidth
//                            label="참고사항"
//                            name="extraAddr"
//                            value={editDelivery?.extraAddr || ''}
//                            onChange={handleEditChange}
//                            margin="normal"
//                            required
//                        />
//                        <Button
//                            variant="contained"
//                            color="error"
//                            onClick={handleEditSubmit}
//                        >
//                            수정하기
//                        </Button>
//                        <Button
//                            variant="contained"
//                            color="error"
//                            onClick={handleCloseEditModal}
//                        >
//                            취소
//                        </Button>
//                    </form>
//                </div>
//            </Modal>
//        </DashboardLayout>
//    );
//}
//
//export default DeliveryManage;
//

// 반응형
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
import Card from '@mui/material/Card';
import MDBox from '../../components/MD/MDBox';
import MDTypography from '../../components/MD/MDTypography';
import {Grid, useMediaQuery} from '@mui/material';
import {Button, Modal, TextField} from '@mui/material';
import DashboardLayout from '../../examples/LayoutContainers/DashboardLayout';
import {
    postDelivery,
    getDeliveryList,
    putDelivery,
    deleteDelivery,
    putDeliveryPrimary,
    putDeliveryDelPrimary, getPrimaryDelivery
} from "../../api/deliveryApi";
import MDButton from "../../components/MD/MDButton";
import KeyboardArrowLeftIcon from "@mui/icons-material/KeyboardArrowLeft";
import {useNavigate} from "react-router-dom";
import DeliveryPostModal from "../../components/delivery/DeliveryPostModal";
import DeliveryPutModal from "../../components/delivery/DeliveryPutModal";

function DeliveryManage() {
    const [deliveries, setDeliveries] = useState([]);
    const [currentPage, setCurrentPage] = useState(0);
    const [totalPages, setTotalPages] = useState(0);
    const [openAddModal, setOpenAddModal] = useState(false);
    const [openEditModal, setOpenEditModal] = useState(false);
    const [newDelivery, setNewDelivery] = useState({});
    const [editDelivery, setEditDelivery] = useState(null);
    const navigate = useNavigate();
    const isSmallScreen = useMediaQuery('(max-width:600px)');
    const [result, setResult] = useState(null)
    const [primaryDeliveryNo, setPrimaryDeliveryNo] = useState(null);
    const [putResult, setPutResult] = useState(null) // 배송지 수정 모달창 관련

    const handleGetDeliveries = (page) => {
        const params = {page, size: 7, sort: 'createTime,asc'};
        getDeliveryList(params)
        .then(data => {
            setDeliveries(data.content);
            setTotalPages(data.totalPages);
        })
        .catch(error => {
            console.error("배송지 목록을 불러오는 데 실패했습니다.", error);
        });
    };

    useEffect(() => {
        handleGetDeliveries(currentPage);
    }, [currentPage]);

    const handleCloseAddModal = () => {
        setOpenAddModal(false);
        setNewDelivery(null);
    };

    const handleNewDeliveryChange = (e) => {
        setNewDelivery({
            ...newDelivery,
            [e.target.name]: e.target.value
        });
    };

    const handleAddSubmit = async (event) => {
        event.preventDefault(); // 폼 전송 이벤트 방지

        if (!window.confirm('배송지를 추가하시겠습니까?')) {
            return;
        }

        // 유효성 검사
        if (!newDelivery.title || !newDelivery.receiver || !newDelivery.phone
            || !newDelivery.postCode ||
            !newDelivery.roadAddr || !newDelivery.jibunAddr
            || !newDelivery.detailAddr || !newDelivery.extraAddr
        ) {
            alert('모든 필드를 입력해주세요.');
            return;
        }

        // FormData 생성
        const formData = new FormData();
        formData.append('title', newDelivery.title);
        formData.append('receiver', newDelivery.receiver);
        formData.append('phone', newDelivery.phone);
        formData.append('postCode', newDelivery.postCode);
        formData.append('roadAddr', newDelivery.roadAddr);
        formData.append('jibunAddr', newDelivery.jibunAddr);
        formData.append('detailAddr', newDelivery.detailAddr);
        formData.append('extraAddr', newDelivery.extraAddr);

        try {
            await postDelivery(formData);
            handleGetDeliveries(currentPage);
            handleCloseAddModal();
        } catch (error) {
            alert('추가 실패:', error);
        }
    };

    // 수정
    const handleOpenEditModal = (delivery) => {
        setEditDelivery(delivery);
        setOpenEditModal(true);
    };

    const handleCloseEditModal = () => {
        setOpenEditModal(false);
        setEditDelivery(null);
    };

    const handleEditChange = (e) => {
        setEditDelivery({
            ...editDelivery,
            [e.target.name]: e.target.value
        });
    };

    const handleEditSubmit = async () => {

        // FormData 생성
        const formData = new FormData();
        formData.append('title', editDelivery.title);
        formData.append('receiver', editDelivery.receiver);
        formData.append('phone', editDelivery.phone);
        formData.append('postCode', editDelivery.postCode);
        formData.append('roadAddr', editDelivery.roadAddr);
        formData.append('jibunAddr', editDelivery.jibunAddr);
        formData.append('detailAddr', editDelivery.detailAddr);
        formData.append('extraAddr', editDelivery.extraAddr);

        try {
            await putDelivery(editDelivery.deliveryNo, formData);
            handleGetDeliveries(currentPage);
            handleCloseEditModal();
        } catch (error) {
            alert('수정 실패:', error);
        }
    };

    // 삭제
    const handleDeleteDelivery = async (deliveryNo) => {

        if (!window.confirm('해당 배송지를 삭제하시겠습니까?')) {
            return; // 사용자가 취소를 선택한 경우, 함수 종료
        }

        try {
            const result = await deleteDelivery(deliveryNo);
            console.log('삭제 성공:', result);
            handleGetDeliveries(currentPage);

        } catch (error) {
            alert('삭제 실패:', error);
        }
    }

    // 기본배송지 설정
    const handleSetPrimary = async (deliveryNo) => {
        try {
            await putDeliveryPrimary(deliveryNo);
            handleGetDeliveries(currentPage);
        } catch (error) {
            alert('기본 배송지 설정 실패:', error);
        }
    };

    // 기본배송지 해제
    const handleDelPrimary = async (deliveryNo) => {
        try {
            await putDeliveryDelPrimary(deliveryNo);
            handleGetDeliveries(currentPage);
        } catch (error) {
            alert('기본 배송지 해제 실패:', error);
        }
    };

    const openDaumPostcode = (mode) => {
        if (window.daum && window.daum.Postcode) {
            new window.daum.Postcode({
                oncomplete: function (data) {
                    const roadAddr = data.roadAddress;
                    let extraRoadAddr = '';

                    if (data.bname !== '' && /[동|로|가]$/g.test(data.bname)) {
                        extraRoadAddr += data.bname;
                    }
                    if (data.buildingName !== '' && data.apartment === 'Y') {
                        extraRoadAddr += (extraRoadAddr !== '' ? ', '
                            + data.buildingName : data.buildingName);
                    }
                    if (extraRoadAddr !== '') {
                        extraRoadAddr = ' (' + extraRoadAddr + ')';
                    }

                    if (mode === 'add') {
                        setNewDelivery({
                            ...newDelivery,
                            postCode: data.zonecode,
                            roadAddr: roadAddr,
                            jibunAddr: data.jibunAddress,
                            extraAddr: extraRoadAddr,
                        });
                    } else {
                        setEditDelivery({
                            ...editDelivery,
                            postCode: data.zonecode,
                            roadAddr: roadAddr,
                            jibunAddr: data.jibunAddress,
                            extraAddr: extraRoadAddr,
                        });
                    }
                },
            }).open();
        } else {
            console.error('카카오 주소 검색 api가 로드되지않았습니다.');
        }
    };

    // 뒤로 가기(내 정보 홈으로 가기)
    const handleBack = () => {
        navigate('/myinfo');
    };

    /*배송지 추가*/
    const handleDeliveryPostModal = () => { // 배송지 목록 모달 내 배송지 추가 버튼
        setResult(true); // Show the DeliveryPostModal
    };

    const postDeliveryModal = () => { // DeliveryPostModal 종료
        setResult(false)
        handleGetDeliveries(); // 모달 창 닫히고 조회
    }

    /*배송지 수정*/
    const handleDeliveryPutModal = (delivery) => { // 배송지 목록 모달 내 배송지 수정 버튼
        console.log('handleDeliveryPutModal');
        //setPutResult(true); // Show the DeliveryPutModal
        setPutResult(delivery); // Pass the selected delivery info to the modal
    };

    const putDeliveryModal = () => { // DeliveryPutModal 종료
        setPutResult(false)
        handleGetDeliveries(); // 모달 창 닫히고 조회
    }

    /*기본 배송지 선택*/
    const handlePrimaryDelivery = (deliveryNo) => { // 기본 배송지 선택 버튼
        console.log('handleSelectDelivery');
        putDeliveryPrimary(deliveryNo).then(data => {
            console.log('기본 배송지로 수정!!');
            console.log(data);
            setPrimaryDeliveryNo(deliveryNo); // Set the selected delivery address
            handleGetPrimaryDelivery();
        }).catch(error => {
            console.error("기본 배송지 수정에 실패했습니다.", error);
        });
    };

    const handleGetPrimaryDelivery = () => { // 기본 배송지 조회
        console.log('handleGetPrimaryDelivery');
        getPrimaryDelivery().then(data => {
            setPrimaryDeliveryNo(data.deliveryNo);
        }).catch(error => {
            console.error("기본 배송지 조회에 실패했습니다.", error);
        });
    };

    // Inline styles
    const styles = {
        table: {
            width: '100%',
            borderCollapse: 'collapse',
        },
        th: {
            fontWeight: 'bold',
            fontSize: '1.5rem',
            paddingBottom: '10px',
        },
        td: {
            fontWeight: 'bold',
            fontSize: '1.2rem',
            paddingBottom: '7px',
            marginTop: 3,
        },
        clickable: {
            cursor: 'pointer',
        },
        card: {
            padding: '16px',
        },
        button: {
            fontFamily: 'JalnanGothic',
            backgroundColor: '#f0f0f0',
            fontSize: isSmallScreen ? '0.6rem':'0.9rem',
            minWidth: 'auto',
            width: isSmallScreen ? '30px' : 'auto', // 가로 너비를 줄임
            padding: isSmallScreen
                ? '1px 2px'
                : '0px 15px',
            lineHeight:  isSmallScreen ? 2.5:2,  // 줄 간격을 줄여 높이를 감소시킴
            minHeight: 'auto', // 기본적으로 적용되는 높이를 없앰
            cursor: 'pointer',
            borderRadius: '4px',
            border: 'none',
        },
        addDeliveryButton: {
            marginBottom: '20px',
            padding: '10px 20px',
            backgroundColor: 'green',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
            fontSize: '1.2rem'
        },
        active: {
            backgroundColor: 'blue',
            color: 'white',
        },
        primaryActive: {
            color: 'black',
        },
        pagination: {
            display: 'flex',
            justifyContent: 'center',
            marginTop: '20px',
        },
        select: {
            padding: '8px',
            borderRadius: '4px',
            border: '1px solid #ccc',
            marginBottom: '20px',
        },
        modal: {
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
        },
        modalContent: {
            backgroundColor: 'white',
            padding: '20px',
            borderRadius: '8px',
            boxShadow: '0 0 10px rgba(0,0,0,0.1)',
            width: '400px',
        },
        disabled: {
            color: '#ccc',
            cursor: 'not-allowed',
        },
        deliveryItem: {
            padding: '10px 0',
        },
        deliveryText: {
            fontSize: '1rem',
            marginBottom: '5px',
        },
        actionsBox: {
            display: 'flex',
            justifyContent: 'flex-end',
            gap: '10px',
        },
        noDeliveries: {
            textAlign: 'center',
            fontSize: '1rem',
        },
        // 모바일 스타일
        '@media (max-width: 600px)': {
            deliveryItem: {
                display: 'block',
                textAlign: 'left',
                paddingBottom: '15px',
                marginBottom: '15px',
                borderBottom: '1px solid #ddd',
            },
            deliveryText: {
                fontSize: '1.2rem',
            },
            actionsBox: {
                justifyContent: 'space-between',
            },
        },
    };

    const handlePageClick = (page) => {
        setCurrentPage(page);
    };

    // 페이징
    const renderPagination = () => {
        const pagination = [];
        const groupSize = 5;
        const currentGroup = Math.floor(currentPage / groupSize);
        const startPage = currentGroup * groupSize;
        const endPage = Math.min(startPage + groupSize - 1, totalPages - 1);

        pagination.push(
            <button
                key="first-group"
                style={styles.button}
                onClick={() => handlePageClick(0)}
            >
                처음
            </button>
        );

        pagination.push(
            <button
                key="prev"
                style={styles.button}
                disabled={currentPage === 0}
                onClick={() => handlePageClick(Math.max(currentPage - 1, 0))}
            >
                이전
            </button>
        );

        for (let i = startPage; i <= endPage; i++) {
            pagination.push(
                <button
                    key={i}
                    style={{
                        ...styles.button, ...(i === currentPage ? styles.active
                            : {})
                    }}
                    onClick={() => handlePageClick(i)}
                >
                    {i + 1}
                </button>
            );
        }

        pagination.push(
            <button
                key="next"
                style={styles.button}
                disabled={currentPage >= totalPages - 1}
                onClick={() => handlePageClick(
                    Math.min(currentPage + 1, totalPages - 1))}
            >
                다음
            </button>
        );

        pagination.push(
            <button
                key="last-group"
                style={styles.button}
                onClick={() => handlePageClick(totalPages - 1)}
            >
                끝
            </button>
        );

        return pagination;
    };

    return (
        <DashboardLayout>
            {result ?
                <DeliveryPostModal
                    callbackFn={postDeliveryModal}
                />
                : <></>
            }
            {putResult ?
                <DeliveryPutModal
                    delivery={putResult}
                    callbackFn={putDeliveryModal}
                />
                : <></>
            }

            <Grid container>
                <Grid item xs={6} lg={4}>
                    <MDTypography fontWeight="bold"
                                  sx={{
                                      ml: isSmallScreen ? 2 : 4,
                                      mt: isSmallScreen ? 0 : 3,
                                      fontSize: isSmallScreen ? '1.2rem'
                                          : '2rem'
                                  }}
                                  variant="body2">
                        배송지 관리
                    </MDTypography>
                </Grid>
                <Grid item xs={6} lg={8}>
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

            <MDBox pt={0} pb={20} display="flex" justifyContent="center">
                <MDBox pt={isSmallScreen ? 1 : 1} pb={1} px={isSmallScreen ? 1 : 3}
                       width="100%"
                       display="flex"
                       justifyContent="center">
                    <Card sx={{
                        maxWidth: isSmallScreen ? '90%' : '50%',  // 카드의 최대 너비 설정
                        width: '100%',                           // 부모 요소에서 차지하는 너비 설정
                        margin: '0 auto',                        // 가로로 중앙 정렬
                    }}>
                        <MDBox pt={2} pb={2} px={isSmallScreen ? 1 : 2}>
                            <div style={{
                                display: 'flex',
                                justifyContent: 'center'
                            }}>
                                <MDButton
                                    onClick={handleDeliveryPostModal}
                                    variant="gradient"
                                    sx={{
                                        color: '#ffffff',
                                        fontSize: '1.2rem',
                                        fontFamily: 'JalnanGothic',
                                        padding: '10px',
                                        width: isSmallScreen ? '90%' : '30%',
                                    }}
                                    color={"light"}>
                                    + 배송지 추가
                                </MDButton>
                            </div>

                            <div className="deliveryList-contents">
                                {deliveries.length > 0 ? (
                                   /* isMobile ? (*/
                                            <ul>
                                                {Array.isArray(deliveries)
                                                    && deliveries.map(
                                                        delivery =>
                                                            <li key={delivery.deliveryNo}>
                                                                <MDBox pt={2}
                                                                       ml={isSmallScreen
                                                                           ? -2
                                                                           : 0}>
                                                                    <Grid container>
                                                                        <Grid
                                                                            item
                                                                            xs={9}
                                                                            sm={9.8}
                                                                            md={9.8}
                                                                            lg={10}>
                                                                            <MDTypography
                                                                                fontWeight="bold"
                                                                                sx={{
                                                                                    fontSize: isSmallScreen
                                                                                        ? '0.9rem'
                                                                                        : '1.1rem',
                                                                                }}
                                                                                variant="body2">
                                                                                {delivery.receiver
                                                                                    + ' '
                                                                                    + '('
                                                                                    + delivery.title
                                                                                    + ')'}
                                                                                {primaryDeliveryNo
                                                                                    === delivery.deliveryNo
                                                                                    && (
                                                                                        <span
                                                                                            style={{
                                                                                                fontSize: isSmallScreen
                                                                                                    ? '0.7rem'
                                                                                                    : '0.9rem',
                                                                                                color: "deeppink"
                                                                                            }}>
                                                                                        기본 배송지
                                                                                    </span>
                                                                                    )}
                                                                            </MDTypography>
                                                                        </Grid>
                                                                    </Grid>

                                                                    <Grid
                                                                        container>
                                                                        <Grid
                                                                            item
                                                                            xs={12}
                                                                            md={5}
                                                                            sx={{mt: -1}}>
                                                                            <MDTypography
                                                                                sx={{
                                                                                    fontSize: isSmallScreen
                                                                                        ? '0.8rem'
                                                                                        : '1rem',
                                                                                }}
                                                                                fontWeight="bold"
                                                                                variant="body2">
                                                                                {delivery.phone}
                                                                            </MDTypography>
                                                                        </Grid>
                                                                    </Grid>
                                                                    <Grid
                                                                        container>
                                                                        <Grid
                                                                            item
                                                                            xs={12}
                                                                            md={12}>
                                                                            <MDTypography
                                                                                sx={{
                                                                                    fontSize: isSmallScreen
                                                                                        ? '0.8rem'
                                                                                        : '1rem',
                                                                                }}
                                                                                fontWeight="bold"
                                                                                variant="body2">
                                                                                {delivery.roadAddr
                                                                                    + ' '
                                                                                    + delivery.detailAddr
                                                                                    + ' '
                                                                                    + '('
                                                                                    + delivery.postCode
                                                                                    + ')'}
                                                                            </MDTypography>
                                                                        </Grid>
                                                                    </Grid>

                                                                    <Grid
                                                                        container>
                                                                        <Grid
                                                                            item
                                                                            xs={1.6}
                                                                            lg={1.2}>
                                                                            <MDButton
                                                                                onClick={() => handleDeliveryPutModal(
                                                                                    delivery)}
                                                                                variant="gradient"
                                                                                color="light"
                                                                                sx={{
                                                                                    color: 'gray',
                                                                                    fontFamily: 'JalnanGothic',
                                                                                    fontSize: isSmallScreen
                                                                                        ? '0.7rem'
                                                                                        : '0.8rem',
                                                                                    minWidth: 'auto',
                                                                                    width: isSmallScreen
                                                                                        ? '30px'
                                                                                        : '60px', // 가로 너비를 줄임
                                                                                    padding: isSmallScreen
                                                                                        ? '1px 2px'
                                                                                        : '4px 8px',
                                                                                    lineHeight: 2,  // 줄 간격을 줄여 높이를 감소시킴
                                                                                    minHeight: 'auto' // 기본적으로 적용되는 높이를 없앰
                                                                                }}
                                                                            >
                                                                                수정
                                                                            </MDButton>
                                                                        </Grid>
                                                                        <Grid
                                                                            item
                                                                            xs={1.6}
                                                                            lg={1.2}>
                                                                            <MDButton
                                                                                onClick={() => handleDeleteDelivery(
                                                                                    delivery.deliveryNo)}
                                                                                variant="gradient"
                                                                                color="light"
                                                                                sx={{
                                                                                    color: 'gray',
                                                                                    fontFamily: 'JalnanGothic',
                                                                                    fontSize: isSmallScreen
                                                                                        ? '0.7rem'
                                                                                        : '0.8rem',
                                                                                    minWidth: 'auto',
                                                                                    width: isSmallScreen
                                                                                        ? '30px'
                                                                                        : '60px', // 가로 너비를 줄임
                                                                                    padding: isSmallScreen
                                                                                        ? '1px 2px'
                                                                                        : '4px 8px',
                                                                                    lineHeight: 2,  // 줄 간격을 줄여 높이를 감소시킴
                                                                                    minHeight: 'auto' // 기본적으로 적용되는 높이를 없앰
                                                                                }}
                                                                            >
                                                                                삭제
                                                                            </MDButton>
                                                                        </Grid>
                                                                        <Grid
                                                                            item
                                                                            xs={4}
                                                                            md={4}
                                                                            lg={4}>
                                                                            <MDButton
                                                                                onClick={() => handlePrimaryDelivery(
                                                                                    delivery.deliveryNo)}
                                                                                variant="gradient"
                                                                                color="warning"
                                                                                sx={{
                                                                                    fontFamily: 'JalnanGothic',
                                                                                    fontSize: isSmallScreen
                                                                                        ? '0.7rem'
                                                                                        : '0.8rem',
                                                                                    minWidth: 'auto',
                                                                                    width: isSmallScreen
                                                                                        ? '100px'
                                                                                        : '150px', // 가로 너비를 줄임
                                                                                    padding: isSmallScreen
                                                                                        ? '1px 2px'
                                                                                        : '4px 8px',
                                                                                    lineHeight: 2,  // 줄 간격을 줄여 높이를 감소시킴
                                                                                    minHeight: 'auto' // 기본적으로 적용되는 높이를 없앰
                                                                                }}
                                                                            >
                                                                                기본배송지
                                                                                설정
                                                                            </MDButton>
                                                                        </Grid>
                                                                    </Grid>
                                                                </MDBox>
                                                            </li>
                                                    )}
                                            </ul>

                                        // 모바일일 때 카드 형식으로 출력
                                        /* deliveries.map((delivery, index) => (
                                             <div
                                                 key={delivery.deliveryNo}
                                                 style={{
                                                     ...styles.deliveryItem,
                                                     borderBottom: index
                                                     < deliveries.length - 1
                                                         ? '1px solid #ddd'
                                                         : 'none',
                                                     paddingBottom: '15px',
                                                     marginBottom: '15px',
                                                 }}
                                             >
                                                 <MDTypography variant="body2"
                                                               sx={styles.deliveryText}>
                                                     {delivery.receiver} ({delivery.title})
                                                 </MDTypography>
                                                 <MDTypography variant="body2"
                                                               sx={styles.deliveryText}>
                                                     {delivery.phone}
                                                 </MDTypography>
                                                 <MDTypography variant="body2"
                                                               sx={styles.deliveryText}>
                                                     {delivery.roadAddr} {delivery.extraAddr
                                                     ? `${delivery.extraAddr}`
                                                     : ''} {delivery.detailAddr} ({delivery.postCode})
                                                 </MDTypography>
                                                 <MDBox sx={styles.actionsBox}>
                                                     <MDTypography
                                                         style={styles.clickable}
                                                         sx={styles.actionText}
                                                         variant="body2"
                                                         onClick={() => handleOpenEditModal(
                                                             delivery)}
                                                     >
                                                         수정
                                                     </MDTypography>
                                                     <MDTypography
                                                         style={styles.clickable}
                                                         sx={styles.actionText}
                                                         variant="body2"
                                                         onClick={() => handleDeleteDelivery(
                                                             delivery.deliveryNo)}
                                                     >
                                                         삭제
                                                     </MDTypography>
                                                     {!delivery.primary ? (
                                                         <MDTypography
                                                             style={{...styles.clickable, ...styles.primaryActive}}
                                                             sx={styles.actionText}
                                                             variant="body2"
                                                             onClick={() => handleSetPrimary(
                                                                 delivery.deliveryNo)}
                                                         >
                                                             기본배송지 설정
                                                         </MDTypography>
                                                     ) : (
                                                         <MDTypography
                                                             style={{...styles.clickable, ...styles.primaryActive}}
                                                             sx={styles.actionText}
                                                             onClick={() => handleDelPrimary(
                                                                 delivery.deliveryNo)}
                                                             variant="body2"
                                                         >
                                                             기본배송지 해제
                                                         </MDTypography>
                                                     )}
                                                 </MDBox>
                                             </div>
                                        ))*/
          /*                          ) : (
                                    // 600px 이상일 때 테이블 형식으로 출력
                                    <table style={styles.table}>
                                <thead>
                                <tr>
                                    <th>
                                        <MDTypography
                                            fontWeight="bold"
                                            variant="body2"
                                            sx={styles.th}>
                                            기본배송지
                                        </MDTypography>
                                    </th>
                                    <th>
                                        <MDTypography
                                            fontWeight="bold"
                                            variant="body2"
                                            sx={styles.th}>
                                            배송지이름
                                        </MDTypography>
                                    </th>
                                    <th>
                                        <MDTypography
                                            fontWeight="bold"
                                            variant="body2"
                                            sx={styles.th}>
                                            받는사람
                                        </MDTypography>
                                    </th>
                                    <th>
                                        <MDTypography
                                            fontWeight="bold"
                                            variant="body2"
                                            sx={styles.th}>
                                            휴대전화번호
                                        </MDTypography>
                                    </th>
                                    <th>
                                        <MDTypography
                                            fontWeight="bold"
                                            variant="body2"
                                            sx={styles.th}>
                                            우편번호
                                        </MDTypography>
                                    </th>
                                    <th>
                                        <MDTypography
                                            fontWeight="bold"
                                            variant="body2"
                                            sx={styles.th}>
                                            도로명주소
                                        </MDTypography>
                                    </th>
                                    <th>
                                        <MDTypography
                                            fontWeight="bold"
                                            variant="body2"
                                            sx={styles.th}>
                                            지번주소
                                        </MDTypography>
                                    </th>
                                    <th>
                                        <MDTypography
                                            fontWeight="bold"
                                            variant="body2"
                                            sx={styles.th}>
                                            상세주소
                                        </MDTypography>
                                    </th>
                                    <th>
                                        <MDTypography
                                            fontWeight="bold"
                                            variant="body2"
                                            sx={styles.th}>
                                            참고사항
                                        </MDTypography>
                                    </th>
                                    <th>
                                        <MDTypography
                                            fontWeight="bold"
                                            variant="body2"
                                            sx={styles.th}>
                                            수정
                                        </MDTypography>
                                    </th>
                                    <th>
                                        <MDTypography
                                            fontWeight="bold"
                                            variant="body2"
                                            sx={styles.th}>
                                            삭제
                                        </MDTypography>
                                    </th>
                                    <th>
                                        <MDTypography
                                            fontWeight="bold"
                                            variant="body2"
                                            sx={styles.th}>
                                            기본배송지 설정
                                        </MDTypography>
                                    </th>
                                </tr>
                                </thead>
                                <tbody>
                                {deliveries.map((delivery) => (
                                    <tr key={delivery.deliveryNo}>
                                        <td>
                                            <MDTypography
                                                style={styles.clickable}
                                                sx={styles.td}
                                                variant="body2"
                                            >
                                                {delivery.primary
                                                    ? "기본배송지" : ""}
                                            </MDTypography>
                                        </td>
                                        <td>
                                            <MDTypography
                                                sx={styles.td}
                                                variant="body2">
                                                {delivery.title}
                                            </MDTypography>
                                        </td>
                                        <td>
                                            <MDTypography
                                                sx={styles.td}
                                                variant="body2">
                                                {delivery.receiver}
                                            </MDTypography>
                                        </td>
                                        <td>
                                            <MDTypography
                                                sx={styles.td}
                                                variant="body2">
                                                {delivery.phone}
                                            </MDTypography>
                                        </td>
                                        <td>
                                            <MDTypography
                                                sx={styles.td}
                                                variant="body2">
                                                {delivery.postCode}
                                            </MDTypography>
                                        </td>
                                        <td>
                                            <MDTypography
                                                sx={styles.td}
                                                variant="body2">
                                                {delivery.roadAddr}
                                            </MDTypography>
                                        </td>
                                        <td>
                                            <MDTypography
                                                sx={styles.td}
                                                variant="body2">
                                                {delivery.jibunAddr}
                                            </MDTypography>
                                        </td>
                                        <td>
                                            <MDTypography
                                                sx={styles.td}
                                                variant="body2">
                                                {delivery.detailAddr}
                                            </MDTypography>
                                        </td>
                                        <td>
                                            <MDTypography
                                                sx={styles.td}
                                                variant="body2">
                                                {delivery.extraAddr}
                                            </MDTypography>
                                        </td>
                                        <td>
                                            <MDTypography
                                                style={styles.clickable}
                                                sx={styles.td}
                                                variant="body2"
                                                onClick={() => handleOpenEditModal(
                                                    delivery)}
                                            >
                                                수정
                                            </MDTypography>
                                        </td>
                                        <td>
                                            <MDTypography
                                                style={styles.clickable}
                                                sx={styles.td}
                                                variant="body2"
                                                onClick={() => handleDeleteDelivery(
                                                    delivery.deliveryNo)}

                                            >
                                                삭제
                                            </MDTypography>
                                        </td>
                                        <td>
                                            <MDTypography
                                                style={{
                                                    ...styles.clickable, ...(delivery.primary
                                                        ? styles.disabled
                                                        : styles.primaryActive)
                                                }}
                                                sx={styles.td}
                                                variant="body2"
                                                onClick={() => {
                                                    if (!delivery.primary) {
                                                        handleSetPrimary(
                                                            delivery.deliveryNo);
                                                    }
                                                }}
                                            >
                                                설정
                                            </MDTypography>
                                            <MDTypography
                                                style={{
                                                    ...styles.clickable, ...(delivery.primary
                                                        ? styles.primaryActive
                                                        : styles.disabled)
                                                            }}
                                                            sx={styles.td}
                                                            variant="body2"
                                                            onClick={() => {
                                                                if (delivery.primary) {
                                                                    handleDelPrimary(
                                                                        delivery.deliveryNo);
                                                                }
                                                            }}
                                                        >
                                                            해제
                                                        </MDTypography>
                                                    </td>
                                                </tr>
                                            ))}
                                            </tbody>
                                        </table>
                                    )*/
                                ) : (
                                    <MDTypography sx={styles.noDeliveries}>
                                        저장된 배송지가 없습니다
                                    </MDTypography>
                                )}
                                {deliveries.length > 0 && (
                                    <MDBox sx={styles.pagination}>
                                        {renderPagination()}
                                    </MDBox>
                                )}
                            </div>
                        </MDBox>
                    </Card>
                </MDBox>
            </MDBox>

            {/* 배송지 추가 모달 */}
            <Modal
                open={openAddModal}
                onClose={handleCloseAddModal}
                aria-labelledby="modal-title"
                aria-describedby="modal-description"
                style={styles.modal}
            >
                <div style={styles.modalContent}>
                    <h2>배송지 추가</h2>
                    <form id="addDeliveryForm">
                        <TextField
                            fullWidth
                            label="배송지 이름"
                            name="title"
                            value={newDelivery?.title || ''}
                            onChange={handleNewDeliveryChange}
                            margin="normal"
                            required
                        />
                        <TextField
                            fullWidth
                            label="받는 사람"
                            name="receiver"
                            value={newDelivery?.receiver || ''}
                            onChange={handleNewDeliveryChange}
                            margin="normal"
                            required
                        />
                        <TextField
                            fullWidth
                            label="휴대전화번호"
                            name="phone"
                            value={newDelivery?.phone || ''}
                            onChange={handleNewDeliveryChange}
                            margin="normal"
                            required
                        />
                        <TextField
                            fullWidth
                            label="우편번호"
                            name="postCode"
                            value={newDelivery?.postCode || ''}
                            onChange={handleNewDeliveryChange}
                            margin="normal"
                            required
                            InputProps={{
                                endAdornment: (
                                    <Button
                                        variant="contained"
                                        color="error"
                                        onClick={() => openDaumPostcode('add')}
                                    >
                                        우편번호 찾기
                                    </Button>
                                ),
                            }}
                        />
                        <TextField
                            fullWidth
                            label="도로명주소"
                            name="roadAddr"
                            value={newDelivery?.roadAddr || ''}
                            onChange={handleNewDeliveryChange}
                            margin="normal"
                            required
                        />
                        <TextField
                            fullWidth
                            label="지번주소"
                            name="jibunAddr"
                            value={newDelivery?.jibunAddr || ''}
                            onChange={handleNewDeliveryChange}
                            margin="normal"
                            required
                        />
                        <TextField
                            fullWidth
                            label="상세주소"
                            name="detailAddr"
                            value={newDelivery?.detailAddr || ''}
                            onChange={handleNewDeliveryChange}
                            margin="normal"
                            required
                        />
                        <TextField
                            fullWidth
                            label="참고사항"
                            name="extraAddr"
                            value={newDelivery?.extraAddr || ''}
                            onChange={handleNewDeliveryChange}
                            margin="normal"
                            required
                        />
                        <Button
                            variant="contained"
                            color="error"
                            onClick={handleAddSubmit}
                        >
                            추가하기
                        </Button>
                        <Button
                            variant="contained"
                            color="error"
                            onClick={handleCloseAddModal}
                        >
                            취소
                        </Button>
                    </form>
                </div>
            </Modal>

            {/* 배송지 수정 모달 */}
            <Modal
                open={openEditModal}
                onClose={handleCloseEditModal}
                aria-labelledby="modal-title"
                aria-describedby="modal-description"
                style={styles.modal}
            >
                <div style={styles.modalContent}>
                    <h2>배송지 수정</h2>
                    <form id="editDeliveryForm">
                        <TextField
                            fullWidth
                            label="배송지 이름"
                            name="title"
                            value={editDelivery?.title || ''}
                            onChange={handleEditChange}
                            margin="normal"
                            required
                        />
                        <TextField
                            fullWidth
                            label="받는 사람"
                            name="receiver"
                            value={editDelivery?.receiver || ''}
                            onChange={handleEditChange}
                            margin="normal"
                            required
                        />
                        <TextField
                            fullWidth
                            label="휴대전화번호"
                            name="phone"
                            value={editDelivery?.phone || ''}
                            onChange={handleEditChange}
                            margin="normal"
                            required
                        />
                        <TextField
                            fullWidth
                            label="우편번호"
                            name="postCode"
                            value={editDelivery?.postCode || ''}
                            onChange={handleEditChange}
                            margin="normal"
                            required
                            InputProps={{
                                endAdornment: (
                                    <Button
                                        variant="contained"
                                        color="error"
                                        onClick={() => openDaumPostcode('edit')}
                                    >
                                        우편번호 찾기
                                    </Button>
                                ),
                            }}
                        />
                        <TextField
                            fullWidth
                            label="도로명주소"
                            name="roadAddr"
                            value={editDelivery?.roadAddr || ''}
                            onChange={handleEditChange}
                            margin="normal"
                            required
                        />
                        <TextField
                            fullWidth
                            label="지번주소"
                            name="jibunAddr"
                            value={editDelivery?.jibunAddr || ''}
                            onChange={handleEditChange}
                            margin="normal"
                            required
                        />
                        <TextField
                            fullWidth
                            label="상세주소"
                            name="detailAddr"
                            value={editDelivery?.detailAddr || ''}
                            onChange={handleEditChange}
                            margin="normal"
                            required
                        />
                        <TextField
                            fullWidth
                            label="참고사항"
                            name="extraAddr"
                            value={editDelivery?.extraAddr || ''}
                            onChange={handleEditChange}
                            margin="normal"
                            required
                        />
                        <Button
                            variant="contained"
                            color="error"
                            onClick={handleEditSubmit}
                        >
                            수정하기
                        </Button>
                        <Button
                            variant="contained"
                            color="error"
                            onClick={handleCloseEditModal}
                        >
                            취소
                        </Button>
                    </form>
                </div>
            </Modal>
        </DashboardLayout>
    );
}

export default DeliveryManage;

