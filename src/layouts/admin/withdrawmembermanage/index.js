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
import {useMediaQuery} from '@mui/material';

import Card from '@mui/material/Card';
import MDBox from '../../../components/MD/MDBox';
import MDTypography from '../../../components/MD/MDTypography';
import DashboardLayout from '../../../examples/LayoutContainers/DashboardLayout';

// Data
import {
getAllWithdrawMembers,
getWithdrawMemberListSearch,
deleteAllWithdrawMembers,
deleteWithdrawMember,
postCheckAdminPw }
from "../../../api/adminApi";

function WithdrawMemberManage() {
    const [withdrawMembers, setWithdrawMembers] = useState([]);
    const [currentPage, setCurrentPage] = useState(0);
    const [totalPages, setTotalPages] = useState(0);
    const [showModal, setShowModal] = useState(false);
    const [adminPw, setAdminPw] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const [searchQuery, setSearchQuery] = useState(''); // 검색 쿼리 상태
    const [searchType, setSearchType] = useState('id'); // 검색 항목 상태 (기본값: id)
    const navigate = useNavigate();

    const handleGetWithdrawMembers = (page) => {
        const params = { page, size: 10, sort: 'createTime,desc' };
        console.log('params : ', params);
        let apiCall;

        if (searchQuery) {
            apiCall = getWithdrawMemberListSearch(params, searchQuery, searchType);
        } else {
            apiCall = getAllWithdrawMembers(params);
        }

        apiCall
            .then(data => {
                setWithdrawMembers(data.content);
                setTotalPages(data.totalPages);
            })
            .catch(error => {
                console.error("탈퇴회원 목록을 불러오는 데 실패했습니다.", error);
            });
    };

    useEffect(() => {
        handleGetWithdrawMembers(currentPage);
    }, [searchQuery, searchType, currentPage]);

    // 검색 기능 추가
    const handleSearchChange = (e) => {
      setSearchQuery(e.target.value);
    };

    const handleSearchSubmit = (e) => {
      e.preventDefault();
      setCurrentPage(0);
      handleGetWithdrawMembers(0);
    };

    const handleSearchTypeChange = (e) => {
      setSearchType(e.target.value);
    };

    const handleDetail = (withdrawMember) => {
        navigate('/withdrawmember-detail', { state: withdrawMember });
    };

    const handleDeleteWithdrawMember = async (withdrawMemberNo) => {
        if (!window.confirm('탈퇴회원을 삭제하시겠습니까?')) return;

        try {
            await deleteWithdrawMember(withdrawMemberNo);
            handleGetWithdrawMembers(currentPage); // 데이터 다시 불러오기
        } catch (error) {
            alert('삭제 실패:', error);
        }
    };

    const handleDeleteAll = async () => {
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
                if (window.confirm("모든 탈퇴회원을 삭제하시겠습니까?")) {
                    await deleteAllWithdrawMembers();
                    handleGetWithdrawMembers(currentPage); // 데이터 다시 불러오기
                    setShowModal(false);
                }
            } else {
                setErrorMessage("비밀번호가 일치하지 않습니다.");
            }
        } catch (error) {
            console.error('삭제 실패:', error);
            setErrorMessage("삭제에 실패했습니다.");
        }
    };

    const handleOpenModal = () => {
        if (withdrawMembers.length === 0) {
            alert('삭제할 탈퇴회원이 없습니다.');
            return;
        }

        setShowModal(true);
        setAdminPw('');
        setErrorMessage('');
    };

    const handleCloseModal = () => {
        setShowModal(false);
        setAdminPw('');
        setErrorMessage('');
    };

    const handlePageClick = (page) => {
        setCurrentPage(page);
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
        deleteAllButton: { marginBottom: '20px', padding: '10px 20px', backgroundColor: 'red', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', fontSize: '1.2rem' },
        active: { backgroundColor: 'blue', color: 'white' },
        pagination: { display: 'flex', justifyContent: 'center', marginTop: '20px' },
        select: { padding: '8px', borderRadius: '4px', border: '1px solid #ccc', marginBottom: '20px' },
        modal: { display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'fixed', top: '0', left: '0', width: '100%', height: '100%', backgroundColor: 'rgba(0,0,0,0.5)' },
        modalContent: { backgroundColor: 'white', padding: '20px', borderRadius: '8px', textAlign: 'center', width: '300px' },
        errorMessage: { color: 'red', marginTop: '10px' },
        searchForm: {marginBottom: '20px'},
        searchInput: {padding: '8px', borderRadius: '4px', border: '1px solid #ccc', marginRight: '10px'},
        searchButton: {padding: '8px 16px', border: 'none', borderRadius: '4px', backgroundColor: '#f0f0f0', cursor: 'pointer'},
        mobileList: {
            display: 'flex',
            flexDirection: 'column',
            gap: '1rem',
        },
        mobileItem: {
            padding: '1rem',
            borderBottom: '1px solid #ddd',
        },
        mobileField: {
            marginBottom: '0.5rem',
        },
        mobileButton: {
            padding: '4px 8px',
            fontSize: '1rem',
            color: '#fff',
            backgroundColor: '#f44336',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
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

    const isMobile = useMediaQuery('(max-width:900px)');

    return (
        <DashboardLayout>
            <MDBox pt={3} pb={3}>
                <MDTypography fontWeight="bold" sx={{ fontSize: '2.5rem' }} variant="body2">
                    탈퇴회원 관리
                </MDTypography>
                <MDBox pt={3} pb={3}>
                <button style={styles.deleteAllButton} onClick={handleOpenModal}>
                    전체 삭제
                </button>
                    <Card style={styles.card}>
                        <MDBox pt={2} pb={3} px={3} sx={{ overflowX: 'auto' }}>
                            {/* 검색 폼 추가 */}
                            <form onSubmit={handleSearchSubmit} style={styles.searchForm}>
                                <select
                                    id="searchType"
                                    name="searchType"
                                    style={styles.select}
                                    value={searchType}
                                    onChange={handleSearchTypeChange}
                                >
                                    <option value="withdrawMemberId">아이디</option>
                                    <option value="withdrawMemberEmail">이메일</option>
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
                            <div className="withdrawMemberList-contents">
                                {withdrawMembers.length > 0 ? (
                                    isMobile ? (
                                        <div style={styles.mobileList}>
                                            {withdrawMembers.map((withdrawMember) => (
                                                <div key={withdrawMember.withdrawMemberNo} style={styles.mobileItem}>
                                                    <MDTypography
                                                        onClick={() => handleDetail(withdrawMember)}
                                                        sx={{ ...styles.clickable, ...styles.mobileField }}
                                                        variant="body2"
                                                    >
                                                        고유번호 : {withdrawMember.withdrawMemberNo}
                                                    </MDTypography>
                                                    <MDTypography sx={styles.mobileField} variant="body2">
                                                        {withdrawMember.withdrawMemberId}
                                                    </MDTypography>
                                                    <MDTypography sx={styles.mobileField} variant="body2">
                                                        {withdrawMember.withdrawMemberEmail}
                                                    </MDTypography>
                                                    <MDTypography sx={styles.mobileField} variant="body2">
                                                        {formatCreateTime(withdrawMember.withdrawDate)}
                                                    </MDTypography>
                                                    <button
                                                        style={styles.mobileButton}
                                                        onClick={() => handleDeleteWithdrawMember(withdrawMember.withdrawMemberNo)}
                                                    >
                                                        삭제
                                                    </button>
                                                </div>
                                            ))}
                                        </div>
                                    ) : (
                                        <table style={styles.table}>
                                            <thead>
                                                <tr>
                                                    <th>
                                                        <MDTypography fontWeight="bold" variant="body2" sx={styles.th}>
                                                            고유번호
                                                        </MDTypography>
                                                    </th>
                                                    <th>
                                                        <MDTypography fontWeight="bold" variant="body2" sx={styles.th}>
                                                            아이디
                                                        </MDTypography>
                                                    </th>
                                                    <th>
                                                        <MDTypography fontWeight="bold" variant="body2" sx={styles.th}>
                                                            이메일
                                                        </MDTypography>
                                                    </th>
                                                    <th>
                                                        <MDTypography fontWeight="bold" variant="body2" sx={styles.th}>
                                                            탈퇴일
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
                                                {withdrawMembers.map((withdrawMember) => (
                                                    <tr key={withdrawMember.withdrawMemberNo}>
                                                        <td>
                                                            <MDTypography
                                                                onClick={() => handleDetail(withdrawMember)}
                                                                sx={{ ...styles.clickable, ...styles.td }}
                                                                variant="body2"
                                                            >
                                                                {withdrawMember.withdrawMemberNo}
                                                            </MDTypography>
                                                        </td>
                                                        <td>
                                                            <MDTypography sx={styles.td} variant="body2">
                                                                {withdrawMember.withdrawMemberId}
                                                            </MDTypography>
                                                        </td>
                                                        <td>
                                                            <MDTypography sx={styles.td} variant="body2">
                                                                {withdrawMember.withdrawMemberEmail}
                                                            </MDTypography>
                                                        </td>
                                                        <td>
                                                            <MDTypography sx={styles.td} variant="body2">
                                                                {formatCreateTime(withdrawMember.withdrawDate)}
                                                            </MDTypography>
                                                        </td>
                                                        <td>
                                                            <button
                                                                style={styles.button}
                                                                onClick={() => handleDeleteWithdrawMember(withdrawMember.withdrawMemberNo)}
                                                            >
                                                                삭제
                                                            </button>
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    )
                                ) : (
                                    <MDTypography variant="body2" sx={{ fontSize: '1.5rem' }}>
                                        탈퇴회원이 없습니다.
                                    </MDTypography>
                                )}
                                {withdrawMembers.length > 0 && (
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
                        <h3>전체 삭제 확인</h3>
                        <input
                            type="password"
                            placeholder="관리자 비밀번호"
                            value={adminPw}
                            onChange={(e) => setAdminPw(e.target.value)}
                        />
                        {errorMessage && <div style={styles.errorMessage}>{errorMessage}</div>}
                        <button style={styles.button} onClick={handleDeleteAll}>
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

export default WithdrawMemberManage;
