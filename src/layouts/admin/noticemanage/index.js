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
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import Card from '@mui/material/Card';
import MDBox from '../../../components/MD/MDBox';
import MDTypography from '../../../components/MD/MDTypography';
import DashboardLayout from '../../../examples/LayoutContainers/DashboardLayout';

// Data
import { getAllNotice, getNoticeListSearch, putNotice, deleteNotice } from "../../../api/noticeApi";
import { postCheckAdminPw } from "../../../api/adminApi";

function NoticeManage() {
    const [notices, setNotices] = useState([]);
    const [currentPage, setCurrentPage] = useState(0);
    const [totalPages, setTotalPages] = useState(0);
    const [searchQuery, setSearchQuery] = useState(''); // 검색 쿼리 상태
    const [showModal, setShowModal] = useState(false);
    const [adminPw, setAdminPw] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const [selectedNoticeNo, setSelectedNoticeNo] = useState(null); // 삭제할 공지사항 번호 상태
    const navigate = useNavigate();

    const handleGetNotices = (page) => {
        const params = { page, size: 3, sort: 'createTime,desc' };
        let apiCall;

        if (searchQuery) {
            apiCall = getNoticeListSearch(params, searchQuery);
        } else {
            apiCall = getAllNotice(params);
        }

        apiCall
            .then(data => {
                setNotices(data.content);
                setTotalPages(data.totalPages);
            })
            .catch(error => {
                console.error("공지사항 목록을 불러오는 데 실패했습니다.", error);
            });
    };

    useEffect(() => {
        handleGetNotices(currentPage);
    }, [currentPage]);

    const handleAddNotice = () => {
        console.log('handleAddNotice');
        navigate('/post-notice-admin');
    };

    const handleDetail = (notice) => {
        navigate('/notice-detail', { state: notice });
    };

    const handleUpdateNotice = (notice) => {
        navigate('/modify-notice', { state: notice });
    };

    const handleDeleteNotice = async () => {
        if (adminPw.trim() === "") {
              setErrorMessage("비밀번호를 입력하세요.");
              return;
        }

        try {
            // 비밀번호 확인
            const formData = new FormData();
            formData.append('password', adminPw);
            const verifyResponse = await postCheckAdminPw(formData);

            if (verifyResponse) {
                if (window.confirm("공지사항을 삭제하시겠습니까?")) {
                    await deleteNotice(selectedNoticeNo);
                    setShowModal(false);
                    handleGetNotices(currentPage); // 데이터 다시 불러오기
                }
            } else {
                setErrorMessage("비밀번호가 일치하지 않습니다.");
            }
        } catch (error) {
            console.error('삭제 실패:', error);
            setErrorMessage("삭제에 실패했습니다.");
        }
    };

    // 삭제 처리 모달 열기
    const openDeleteModal = (notice) => {
        setAdminPw('');
        setErrorMessage('');
        setSelectedNoticeNo(notice.noticeNo);
        setShowModal(true);
    };

    const handleCloseModal = () => {
        setShowModal(false);
        setAdminPw('');
        setErrorMessage('');
    };

    // 검색 기능 추가
    const handleSearchChange = (e) => {
      setSearchQuery(e.target.value);
    };

    const handleSearchSubmit = (e) => {
      e.preventDefault();
      setCurrentPage(0);
      handleGetNotices(0);
    };

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

    const styles = {
        table: { width: '1200px', borderCollapse: 'collapse' },
        th: { fontWeight: 'bold', fontSize: '1.8rem', paddingBottom: '10px' },
        td: { fontWeight: 'bold', fontSize: '1.2rem', paddingBottom: '7px' },
        clickable: { cursor: 'pointer' },
        card: { padding: '16px' },
        button: { margin: '0 5px', padding: '8px 16px', border: 'none', borderRadius: '4px', backgroundColor: '#f0f0f0', cursor: 'pointer' },
        addNoticeButton: { marginBottom: '20px', padding: '10px 20px', backgroundColor: 'green', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', fontSize: '1.2rem' },
        active: { backgroundColor: 'blue', color: 'white' },
        pagination: { display: 'flex', justifyContent: 'center', marginTop: '20px' },
        select: { padding: '8px', borderRadius: '4px', border: '1px solid #ccc', marginBottom: '20px' },
        searchForm: { marginBottom: '20px' },
        searchInput: { padding: '8px', borderRadius: '4px', border: '1px solid #ccc', marginRight: '10px' },
        searchButton: { padding: '8px 16px', border: 'none', borderRadius: '4px', backgroundColor: '#f0f0f0', cursor: 'pointer' },
        modal: { display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'fixed', top: '0', left: '0', width: '100%', height: '100%', backgroundColor: 'rgba(0,0,0,0.5)' },
        modalContent: { backgroundColor: 'white', padding: '20px', borderRadius: '8px', textAlign: 'center', width: '300px' },
        errorMessage: { color: 'red', marginTop: '10px' },
        deleteAllButton: { marginBottom: '20px', padding: '10px 20px', backgroundColor: 'red', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', fontSize: '1.2rem' },
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
                    공지사항 관리
                </MDTypography>
                <MDBox pt={3} pb={3}>
                <button style={styles.addNoticeButton} onClick={() => handleAddNotice()}>
                      공지사항 생성
                </button>
                    <Card style={styles.card}>
                        <MDBox pt={2} pb={3} px={3}>
                            {/* 검색 폼 추가 */}
                                <form onSubmit={handleSearchSubmit} style={styles.searchForm}>
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
                            <div className="noticeList-contents">
                                {notices.length > 0 ? (
                                    <table style={styles.table}>
                                        <thead>
                                            <tr>
                                                <th>
                                                    <MDTypography fontWeight="bold" variant="body2" sx={styles.th}>
                                                        공지사항 제목
                                                    </MDTypography>
                                                </th>
                                                <th>
                                                    <MDTypography fontWeight="bold" variant="body2" sx={styles.th}>
                                                        작성자
                                                    </MDTypography>
                                                </th>
                                                <th>
                                                    <MDTypography fontWeight="bold" variant="body2" sx={styles.th}>
                                                        작성일
                                                    </MDTypography>
                                                </th>
                                                <th>
                                                    <MDTypography fontWeight="bold" variant="body2" sx={styles.th}>
                                                        수정
                                                    </MDTypography>
                                                </th>
                                                <th>
                                                    <MDTypography fontWeight="bold" variant="body2" sx={styles.th}>
                                                        삭제
                                                    </MDTypography>
                                                </th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {notices.map((notice) => (
                                                <tr key={notice.noticeNo}>
                                                    <td>
                                                        <MDTypography onClick={() => handleDetail(notice)} sx={{ ...styles.clickable, ...styles.td }} variant="body2">
                                                            {notice.noticeTitle}
                                                        </MDTypography>
                                                    </td>
                                                    <td>
                                                        <MDTypography sx={styles.td} variant="body2">{notice.noticeWriter}</MDTypography>
                                                    </td>
                                                    <td>
                                                        <MDTypography sx={styles.td} variant="body2">{formatCreateTime(notice.createTime)}</MDTypography>
                                                    </td>
                                                    <td>
                                                        <button style={styles.button} onClick={() => handleUpdateNotice(notice)}>
                                                            수정
                                                        </button>
                                                    </td>
                                                    <td>
                                                        <button style={styles.button} onClick={() => openDeleteModal(notice)}>
                                                            삭제
                                                        </button>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                ) : (
                                    <MDTypography variant="body2">공지사항이 없습니다.</MDTypography>
                                )}
                                {notices.length > 0 && (
                                    <MDBox sx={styles.pagination}>
                                        {renderPagination()}
                                    </MDBox>
                                )}
                            </div>
                        </MDBox>
                    </Card>
                </MDBox>
            </MDBox>

            {/* 비밀번호 모달 */}
            {showModal && (
                <div style={styles.modal}>
                    <div style={styles.modalContent}>
                        <h3>공지사항 삭제 확인</h3>
                        <input
                            type="password"
                            placeholder="관리자 비밀번호"
                            value={adminPw}
                            onChange={(e) => setAdminPw(e.target.value)}
                        />
                        {errorMessage && <div style={styles.errorMessage}>{errorMessage}</div>}
                        <button style={styles.button} onClick={handleDeleteNotice}>
                            삭제
                        </button>
                        <button style={styles.button} onClick={handleCloseModal}>
                            취소
                        </button>
                    </div>
                </div>
            )}
        </DashboardLayout>
    );
}

export default NoticeManage;