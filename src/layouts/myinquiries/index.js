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
import {useNavigate} from 'react-router-dom';
import Card from '@mui/material/Card';
import MDBox from '../../components/MD/MDBox';
import MDTypography from '../../components/MD/MDTypography';
import DashboardLayout from '../../examples/LayoutContainers/DashboardLayout';
import {getAllMyInquiries, deleteInquiry} from "../../api/inquiryApi";

function MyInquiries() {
    const [inquiries, setInquiries] = useState([]);
    const [currentPage, setCurrentPage] = useState(0);
    const [totalPages, setTotalPages] = useState(0);
    const navigate = useNavigate();

    const handleGetInquiries = (page) => {
        const params = {page, size: 10, sort: 'createTime,desc'};
        getAllMyInquiries(params)
        .then(data => {
            setInquiries(data.content);
            setTotalPages(data.totalPages);
        })
        .catch(error => {
            console.error("내 문의사항 목록을 불러오는 데 실패했습니다.", error);
        });
    };

    useEffect(() => {
        handleGetInquiries(currentPage);
    }, [currentPage]);

    // 해당 문의사항 상세 페이지 이동
    const handleDetail = (inquiry) => {
        console.log('문의사항 상세 페이지로 이동 : ', inquiry);
        navigate('/inquiry-detail', {state: inquiry});
    };

    // 삭제
    const handleDeleteInquiry = async (inquiryNo) => {

        if (!window.confirm('문의사항을 삭제하시겠습니까?')) {
            return; // 사용자가 취소를 선택한 경우, 함수 종료
        }

        try {
            const result = await deleteInquiry(inquiryNo);
            console.log('삭제 성공:', result);
//            window.location.reload();
            handleGetInquiries(currentPage);

        } catch (error) {
            alert('삭제 실패:', error);
        }
    }

    const handlePageClick = (page) => {
        setCurrentPage(page);
    };

    // 작성일 형식 변환
    const formatCreateTime = (dateString) => {
        const date = new Date(dateString);
        return new Intl.DateTimeFormat('ko-KR', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
        }).format(date);
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
        button: {
            margin: '0 5px',
            padding: '8px 16px',
            border: 'none',
            borderRadius: '4px',
            backgroundColor: '#f0f0f0',
            cursor: 'pointer',
        },
        active: {
            backgroundColor: 'blue',
            color: 'white',
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
            <MDTypography fontWeight="bold"
                          sx={{ml: 4, mt: 2, fontSize: '2rem'}}
                          variant="body2">
                문의사항 목록
            </MDTypography>
            <MDBox pt={1} pb={2}>
                <MDBox pt={1} pb={2} px={3}>
                    <Card>
                        <MDBox pt={2} pb={3} px={3}>
                            <div className="inquiryList-contents">
                                {inquiries.length > 0 ? (
                                    <table style={styles.table}>
                                        <thead>
                                        <tr>
                                            <th>
                                                <MDTypography fontWeight="bold"
                                                              variant="body2"
                                                              sx={styles.th}>
                                                    문의 제목
                                                </MDTypography>
                                            </th>
                                            <th>
                                                <MDTypography fontWeight="bold"
                                                              variant="body2"
                                                              sx={styles.th}>
                                                    작성자
                                                </MDTypography>
                                            </th>
                                            <th>
                                                <MDTypography fontWeight="bold"
                                                              variant="body2"
                                                              sx={styles.th}>
                                                    작성일
                                                </MDTypography>
                                            </th>
                                            <th>
                                                <MDTypography fontWeight="bold"
                                                              variant="body2"
                                                              sx={styles.th}>
                                                    답변 상태
                                                </MDTypography>
                                            </th>
                                            <th>
                                                <MDTypography fontWeight="bold"
                                                              variant="body2"
                                                              sx={styles.th}>
                                                    삭제
                                                </MDTypography>
                                            </th>
                                        </tr>
                                        </thead>
                                        <tbody>
                                        {inquiries.map((inquiry) => (
                                            <tr key={inquiry.inquiryNo}>
                                                <td>
                                                    <MDTypography
                                                        style={styles.clickable}
                                                        sx={styles.td}
                                                        variant="body2"
                                                        onClick={() => handleDetail(
                                                            inquiry)}
                                                    >
                                                        {inquiry.inquiryTitle}
                                                    </MDTypography>
                                                </td>
                                                <td>
                                                    <MDTypography sx={styles.td}
                                                                  variant="body2">
                                                        {inquiry.inquiryWriter}
                                                    </MDTypography>
                                                </td>
                                                <td>
                                                    <MDTypography sx={styles.td}
                                                                  variant="body2">
                                                        {formatCreateTime(
                                                            inquiry.createTime)}
                                                    </MDTypography>
                                                </td>
                                                <td>
                                                    <MDTypography sx={styles.td}
                                                                  variant="body2">
                                                        {inquiry.inquiryState}
                                                    </MDTypography>
                                                </td>
                                                <td>
                                                    <MDTypography
                                                        style={styles.clickable}
                                                        sx={styles.td}
                                                        variant="body2"
                                                        onClick={() => handleDeleteInquiry(
                                                            inquiry.inquiryNo)}
                                                    >
                                                        삭제
                                                    </MDTypography>
                                                </td>
                                            </tr>
                                        ))}
                                        </tbody>
                                    </table>
                                ) : (
                                    <MDTypography sx={styles.noInquiries}>
                                        문의사항이 없습니다
                                    </MDTypography>
                                )}
                            </div>
                        </MDBox>
                    </Card>
                </MDBox>
            </MDBox>
            {inquiries.length > 0 && (
                <MDBox sx={styles.pagination}>
                    {renderPagination()}
                </MDBox>
            )}
        </DashboardLayout>
    );
}

export default MyInquiries;

