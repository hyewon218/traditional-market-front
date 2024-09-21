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
import {Grid, useMediaQuery} from "@mui/material";
import MDButton from "../../components/MD/MDButton";
import KeyboardArrowLeftIcon from "@mui/icons-material/KeyboardArrowLeft";

function MyInquiries() {
    const [inquiries, setInquiries] = useState([]);
    const [currentPage, setCurrentPage] = useState(0);
    const [totalPages, setTotalPages] = useState(0);
    const navigate = useNavigate();
    const isSmallScreen = useMediaQuery('(max-width:600px)');

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

    // 뒤로 가기(내 정보 홈으로 가기)
    const handleBack = () => {
        navigate('/myinfo');
    };

    // Inline styles
    const styles = {
        table: {
            width: '100%',
            borderCollapse: 'collapse',
        },
        th: {
            fontWeight: 'bold',
            fontSize: '1.3rem',
        },
        td: {
            fontWeight: 'bold',
            fontSize: '1.0rem',
            marginTop: 1,
        },
        clickable: {
            cursor: 'pointer',
        },
        button: {
            fontFamily: 'JalnanGothic',
            backgroundColor: '#f0f0f0',
            fontSize: isSmallScreen ? '0.6rem' : '1.2rem',
            minWidth: 'auto',
            width: isSmallScreen ? '30px' : 'auto', // 가로 너비를 줄임
            padding: isSmallScreen
                ? '1px 2px'
                : '2px 16px',
            lineHeight: isSmallScreen ? 2.5 : 2,  // 줄 간격을 줄여 높이를 감소시킴
            minHeight: 'auto', // 기본적으로 적용되는 높이를 없앰
            cursor: 'pointer',
            borderRadius: '4px',
            border: 'none',
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
        inquiryItem: {
            borderBottom: '1px solid #ddd',
            padding: '10px',
            marginBottom: '10px',
            cursor: 'pointer'
        },
        inquiryTitle: {
            fontWeight: 'bold'
        },
        inquiryWriter: {
            fontSize: '0.9rem',
            color: '#555'
        }
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
                        문의사항 목록
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

            <MDBox pt={2} pb={20}>
                <MDBox pt={isSmallScreen ? 1 : 1} pb={1} px={isSmallScreen ? 1 : 3}>
                    <Card>
                        <MDBox pt={2} pb={2} px={isSmallScreen ? 1 : 2}>
                            <div className="inquiryList-contents">
                                {isSmallScreen ? (
                                    // 모바일 실선 리스트 형식
                                    inquiries.length > 0 ? (
                                        inquiries.map((inquiry) => (
                                            <div key={inquiry.inquiryNo}
                                                 style={styles.inquiryItem}
                                                 onClick={() => handleDetail(
                                                     inquiry)}
                                                 >
                                                <MDTypography
                                                    sx={styles.inquiryTitle}
                                                    variant="body2">
                                                    {inquiry.inquiryTitle}
                                                </MDTypography>
                                                <MDTypography
                                                    sx={styles.inquiryWriter}
                                                    variant="body2">
                                                    {inquiry.inquiryWriter}
                                                </MDTypography>
                                                <MDTypography
                                                    sx={styles.inquiryWriter}
                                                    variant="body2">
                                                    {formatCreateTime(
                                                        inquiry.createTime)}
                                                </MDTypography>
                                                <MDTypography
                                                    sx={styles.inquiryWriter}
                                                    variant="body2">
                                                    {inquiry.inquiryState}
                                                </MDTypography>
                                                <MDButton
                                                    onClick={() => handleDeleteInquiry(
                                                        inquiry.inquiryNo)}
                                                    color="info"
                                                    variant="gradient"
                                                    sx={{
                                                        fontFamily: 'JalnanGothic',
                                                        fontSize: isSmallScreen ? '0.75rem':'1rem',
                                                        minWidth: 'auto',
                                                        width: isSmallScreen ? '50px' : 'auto', // 가로 너비를 줄임
                                                        padding: isSmallScreen
                                                            ? '1px 2px'
                                                            : '4px 8px',
                                                        lineHeight:  isSmallScreen ? 2:2,  // 줄 간격을 줄여 높이를 감소시킴
                                                        minHeight: 'auto', // 기본적으로 적용되는 높이를 없앰
                                                        mt: isSmallScreen ? 1:0.5
                                                    }}
                                                    >
                                                    삭제
                                                </MDButton>
                                            </div>
                                        ))
                                    ) : (
                                        <MDTypography
                                            variant="body2"
                                            sx={{
                                                ml : 1,
                                                fontSize : '0.8rem'
                                        }}
                                        >문의사항이 없습니다.</MDTypography>
                                    )
                                ) : (
                                    // 테이블 형식
                                    inquiries.length > 0 ? (
                                        <table style={styles.table}>
                                            <thead>
                                            <tr>
                                                <th>
                                                    <MDTypography
                                                        fontWeight="bold"
                                                        variant="body2"
                                                        sx={styles.th}>
                                                        문의 제목
                                                    </MDTypography>
                                                </th>
                                                <th>
                                                    <MDTypography
                                                        fontWeight="bold"
                                                        variant="body2"
                                                        sx={styles.th}>
                                                        작성자
                                                    </MDTypography>
                                                </th>
                                                <th>
                                                    <MDTypography
                                                        fontWeight="bold"
                                                        variant="body2"
                                                        sx={styles.th}>
                                                        작성일
                                                    </MDTypography>
                                                </th>
                                                <th>
                                                    <MDTypography
                                                        fontWeight="bold"
                                                        variant="body2"
                                                        sx={styles.th}>
                                                        답변 상태
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
                                                        <MDTypography
                                                            sx={styles.td}
                                                            variant="body2">
                                                            {inquiry.inquiryWriter}
                                                        </MDTypography>
                                                    </td>
                                                    <td>
                                                        <MDTypography
                                                            sx={styles.td}
                                                            variant="body2">
                                                            {formatCreateTime(
                                                                inquiry.createTime)}
                                                        </MDTypography>
                                                    </td>
                                                    <td>
                                                        <MDTypography
                                                            sx={styles.td}
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
                                    )
                                )}
                                {inquiries.length > 0 && (
                                    <MDBox sx={styles.pagination}>
                                        {renderPagination()}
                                    </MDBox>
                                )}
                            </div>
                        </MDBox>
                    </Card>
                </MDBox>
            </MDBox>

        </DashboardLayout>
    );
}

export default MyInquiries;

