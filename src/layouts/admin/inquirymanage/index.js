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
import MDInput from "../../../components/MD/MDInput";
import MDTypography from '../../../components/MD/MDTypography';
import DashboardLayout
    from '../../../examples/LayoutContainers/DashboardLayout';

// Data
import {
    getAllInquiries,
    deleteAllInquiry,
    postCheckAdminPw,
    getMemberOne
} from "../../../api/adminApi";
import {getInquiryListSearch, deleteInquiry} from "../../../api/inquiryApi";
import MDButton from "../../../components/MD/MDButton";

function InquiryManage() {
    const [inquiries, setInquiries] = useState([]);
    const [currentPage, setCurrentPage] = useState(0);
    const [totalPages, setTotalPages] = useState(0);
    const [showModal, setShowModal] = useState(false);
    const [adminPw, setAdminPw] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const [searchQuery, setSearchQuery] = useState(''); // 검색 쿼리 상태
    const [searchType, setSearchType] = useState('id'); // 검색 타입 (ID 또는 닉네임)
    const navigate = useNavigate();

    const handleGetInquiries = (page) => {
        const params = {page, size: 10, sort: 'createTime,desc'};
        let apiCall;

        if (searchQuery) {
            apiCall = getInquiryListSearch(params, searchQuery, searchType);
        } else {
            apiCall = getAllInquiries(params);
        }

        apiCall
        .then(data => {
            setInquiries(data.content);
            setTotalPages(data.totalPages);
        })
        .catch(error => {
            console.error("문의사항 목록을 불러오는 데 실패했습니다.", error);
        });
    };

    useEffect(() => {
        handleGetInquiries(currentPage);
    }, [currentPage, searchQuery]);

    const handleDetail = (inquiry) => {
        navigate('/inquiry-detail', {state: inquiry});
    };

    const handleDetailMember = async (memberNo) => {
        try {
            const memberData = await getMemberOne(memberNo);
            navigate('/member-detail-admin', {state : memberData.memberNo});
        } catch (error) {
            console.error('회원 정보를 불러오는 데 실패했습니다.', error);
        }
    };

    // 검색 기능 추가
    const handleSearchChange = (e) => {
        setSearchQuery(e.target.value);
    };

    // 검색 타입 변경 핸들러
    const handleSearchTypeChange = (event) => {
        setSearchType(event.target.value);
    };

    const handleSearchSubmit = (e) => {
        e.preventDefault();
        setCurrentPage(0);
        handleGetInquiries(0);
    };

    const handleDeleteInquiry = async (inquiryNo) => {
        if (!window.confirm('문의사항을 삭제하시겠습니까?')) {
            return;
        }

        try {
            await deleteInquiry(inquiryNo);
            handleGetInquiries(currentPage); // 데이터 다시 불러오기
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
                if (window.confirm("모든 문의사항을 삭제하시겠습니까?")) {
                    await deleteAllInquiry();
                    handleGetInquiries(currentPage); // 데이터 다시 불러오기
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
        table: {width: '100%', borderCollapse: 'collapse'},
        th: {fontWeight: 'bold', fontSize: '1.5rem', paddingBottom: '10px'},
        td: {fontWeight: 'bold', fontSize: '1.2rem', paddingBottom: '7px', marginTop: 3},
        clickable: {cursor: 'pointer'},
        card: {padding: '16px'},
        button: {
            margin: '0 5px',
            padding: '8px 16px',
            border: 'none',
            borderRadius: '4px',
            backgroundColor: '#f0f0f0',
            cursor: 'pointer'
        },
        active: {backgroundColor: 'blue', color: 'white'},
        pagination: {
            display: 'flex',
            justifyContent: 'center',
            marginTop: '20px'
        },
        select: {
            padding: '8px',
            borderRadius: '4px',
            border: '1px solid #ccc',
            marginBottom: '20px'
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
            backgroundColor: 'rgba(0,0,0,0.5)'
        },
        modalContent: {
            backgroundColor: 'white',
            padding: '20px',
            borderRadius: '8px',
            textAlign: 'center',
            width: '300px'
        },
        errorMessage: {
            color: 'red',
            marginTop: '10px'
        },
        searchForm: {
            marginBottom: '20px',
        },
        searchInput: {
            width: '33%',
            padding: '4px',
            borderRadius: '2px',
            marginRight: '5px',
            marginTop: '3px'
        },
        mobileList: {
            display: 'flex',
            flexDirection: 'column',
            gap: '1rem',
          },
          mobileInquiryItem: {
            padding: '1rem',
            borderBottom: '1px solid #ddd',
          },
          mobileLabel: {
            fontWeight: 'bold',
            marginBottom: '0.5rem',
          },
          mobileValue: {
            marginBottom: '1rem',
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

    const isMobile = useMediaQuery('(max-width:600px)');

    return (
        <DashboardLayout>
            <MDTypography fontWeight="bold"
                          sx={{ml: 4, mt: 2, fontSize: '2rem'}}
                          variant="body2">
                문의사항 관리
            </MDTypography>
            <MDButton
                variant="gradient"
                color="error"
                sx={{
                    fontFamily: 'JalnanGothic',
                    fontSize: '1.1rem',
                    padding: '4px 8px',
                    marginLeft: '30px',
                    marginTop: '10px'
                }}
                onClick={() => setShowModal(true)}>전체 삭제
            </MDButton>
            <MDBox pt={1} pb={2}>
                <MDBox pt={1} pb={2} px={3}>
                    <Card>
                    {/* 검색 폼 추가 */}
                    <form onSubmit={handleSearchSubmit} style={styles.searchForm}>
                        <select
                            id="searchType"
                            name="searchType"
                            style={styles.searchSelect}
                            value={searchType}
                            onChange={handleSearchTypeChange}
                        >
                            <option value="id">아이디</option>
                            <option value="title">제목</option>
                        </select>
                        <MDInput
                            type="text"
                            value={searchQuery}
                            onChange={handleSearchChange}
                            placeholder="검색어를 입력하세요"
                            style={styles.searchInput}
                        />
                        <MDButton
                            type="submit"
                            variant="gradient"
                            sx={{
                                fontFamily: 'JalnanGothic',
                                fontSize: '1.2rem',
                                padding: '4px 8px',   // Adjust padding (top-bottom left-right)
                                mt:'8px'
                            }}
                            color="info">검색
                        </MDButton>
                    </form>
                        <MDBox pt={2} pb={3} px={3}>
                            <div className="inquiryList-contents">
                                {inquiries.length > 0 ? (
                                  isMobile ? (
                                    <div style={styles.mobileList}>
                                      {inquiries.map((inquiry) => (
                                        <div key={inquiry.inquiryNo} style={styles.mobileInquiryItem}>
                                          <MDTypography
                                            onClick={() => handleDetail(inquiry)}
                                            sx={{ ...styles.clickable, ...styles.mobileValue }}
                                            variant="body2"
                                          >
                                            {inquiry.inquiryTitle}
                                          </MDTypography>
                                          <MDTypography
                                            onClick={() => handleDetailMember(inquiry.memberNo)}
                                            sx={{ ...styles.clickable, ...styles.mobileValue }}
                                            variant="body2"
                                          >
                                            {inquiry.inquiryWriter}
                                          </MDTypography>
                                          <MDTypography sx={styles.mobileValue} variant="body2">
                                            {formatCreateTime(inquiry.createTime)}
                                          </MDTypography>
                                          <MDTypography sx={styles.mobileValue} variant="body2">
                                            {inquiry.inquiryState}
                                          </MDTypography>
                                          <MDButton
                                            variant="gradient"
                                            color="light"
                                            sx={{
                                              fontFamily: 'JalnanGothic',
                                              padding: '4px 8px',
                                              marginTop: '6px',
                                              fontSize: '1rem',
                                            }}
                                            onClick={() => handleDeleteInquiry(inquiry.inquiryNo)}
                                          >
                                            삭제
                                          </MDButton>
                                        </div>
                                      ))}
                                    </div>
                                  ) : (
                                    <table style={styles.table}>
                                      <thead>
                                        <tr>
                                          <th>
                                            <MDTypography fontWeight="bold" variant="body2" sx={styles.th}>
                                              문의 제목
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
                                              답변 상태
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
                                        {inquiries.map((inquiry) => (
                                          <tr key={inquiry.inquiryNo}>
                                            <td>
                                              <MDTypography
                                                onClick={() => handleDetail(inquiry)}
                                                sx={{ ...styles.clickable, ...styles.td }}
                                                variant="body2"
                                              >
                                                {inquiry.inquiryTitle}
                                              </MDTypography>
                                            </td>
                                            <td>
                                              <MDTypography
                                                onClick={() => handleDetailMember(inquiry.memberNo)}
                                                sx={{ ...styles.clickable, ...styles.td }}
                                                variant="body2"
                                              >
                                                {inquiry.inquiryWriter}
                                              </MDTypography>
                                            </td>
                                            <td>
                                              <MDTypography sx={styles.td} variant="body2">
                                                {formatCreateTime(inquiry.createTime)}
                                              </MDTypography>
                                            </td>
                                            <td>
                                              <MDTypography sx={styles.td} variant="body2">
                                                {inquiry.inquiryState}
                                              </MDTypography>
                                            </td>
                                            <td>
                                              <MDButton
                                                variant="gradient"
                                                color="light"
                                                sx={{
                                                  fontFamily: 'JalnanGothic',
                                                  padding: '4px 8px',
                                                  marginTop: '-6px',
                                                  marginRight: '3px',
                                                  fontSize: '1rem',
                                                }}
                                                onClick={() => handleDeleteInquiry(inquiry.inquiryNo)}
                                              >
                                                삭제
                                              </MDButton>
                                            </td>
                                          </tr>
                                        ))}
                                      </tbody>
                                    </table>
                                  )
                                ) : (
                                  <MDTypography variant="body2">문의사항이 없습니다.</MDTypography>
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
                        {errorMessage && <div
                            style={styles.errorMessage}>{errorMessage}</div>}
                        <button style={styles.button} onClick={handleDeleteAll}>
                            삭제
                        </button>
                        <button style={styles.button}
                                onClick={handleCloseModal}>
                            취소
                        </button>
                    </div>
                </div>
            )}
        </DashboardLayout>
    );
}

export default InquiryManage;
