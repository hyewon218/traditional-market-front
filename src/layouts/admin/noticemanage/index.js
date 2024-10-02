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
import DashboardLayout
    from '../../../examples/LayoutContainers/DashboardLayout';

// Data
import {
    deleteNotice,
    getAllNotice,
    getNoticeListSearch
} from "../../../api/noticeApi";
import {postCheckAdminPw} from "../../../api/adminApi";
import MDButton from "../../../components/MD/MDButton";
import MDInput from "../../../components/MD/MDInput";
import Grid from "@mui/material/Grid";

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
    const isSmallScreen = useMediaQuery('(max-width:600px)');

    const handleGetNotices = (page) => {
        const params = {page, size: 10, sort: 'createTime,desc'};
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
    }, [currentPage, searchQuery]);

    const handleAddNotice = () => {
        console.log('handleAddNotice');
        navigate('/post-notice-admin');
    };

    const handleDetail = (notice) => {
        navigate('/notice-detail', {state: notice});
    };

    const handleUpdateNotice = (notice) => {
        navigate('/modify-notice', {state: notice});
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
        table: {
            width: '100%',
            borderCollapse: 'collapse',
            marginLeft: '10px', // 왼쪽 여백 추가
        },
        th: {
            fontWeight: 'bold',
            fontSize: '1.2rem',
            paddingBottom: '3px',
        },
        td: {
            fontFamily: 'GowunBatang-Regular',
            fontWeight: 'bold',
            fontSize: '1rem',
            marginTop: 3,
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
        searchForm: {
            marginBottom: isSmallScreen ? '0px' :'30px',
        },
        searchInput: {
            width: isSmallScreen ? '100%':'100%',
            padding: '4px',
            borderRadius: '2px',
            marginRight: '5px',
            marginTop: '3px',
            lineHeight:  isSmallScreen ? 3:2,  // 줄 간격을 줄여 높이를 감소시킴
            minHeight: 'auto' // 기본적으로 적용되는 높이를 없앰
        },
        searchButton: {
            padding: '8px 16px',
            border: 'none',
            borderRadius: '4px',
            backgroundColor: '#f0f0f0',
            cursor: 'pointer'
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
        errorMessage: {color: 'red', marginTop: '10px'},
        deleteAllButton: {
            marginBottom: '20px',
            padding: '10px 20px',
            backgroundColor: 'red',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
            fontSize: '1.2rem'
        },
        updateDeleteButton: {
            fontFamily: 'JalnanGothic',
            fontSize: isSmallScreen ? '0.6rem':'0.8rem',
            minWidth: 'auto',
            width: isSmallScreen ? '40px' : 'auto', // 가로 너비를 줄임
            padding: isSmallScreen
                ? '1px 2px'
                : '4px 8px',
            lineHeight:  isSmallScreen ? 2.5:2,  // 줄 간격을 줄여 높이를 감소시킴
            minHeight: 'auto', // 기본적으로 적용되는 높이를 없앰
            marginTop: isSmallScreen ? '0px':'16px'
        },
        mobileField: {
            fontSize: isSmallScreen ? '0.8rem' : '1rem',
            cursor: 'pointer'
        },
        mobileNoticeItem: {
            borderBottom: '1px solid #ddd',
            padding: '10px',
            marginBottom: '10px',
            cursor: 'pointer'
        },
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
    console.log('isMobile : ', isMobile);

    useEffect(() => {
        const handleResize = () => {
          console.log('현재 너비:', window.innerWidth);
        };

        // 컴포넌트가 처음 마운트될 때 현재 너비를 출력
        handleResize();

        // 리사이즈 이벤트 리스너 추가
        window.addEventListener('resize', handleResize);

        // 컴포넌트가 언마운트될 때 리스너 제거
        return () => {
          window.removeEventListener('resize', handleResize);
        };
      }, []);

    return (
         <DashboardLayout>
             <Grid container>
                 <Grid item xs={7.5} sm={12} md={9} lg={10}>
                     <MDTypography fontWeight="bold"
                                   sx={{
                                       ml: isSmallScreen ? 2 : 4,
                                       mt: isSmallScreen ? 0 : 3,
                                       fontSize: isSmallScreen ? '1.2rem' : '2rem'
                                   }}
                                   variant="body2">
                         공지사항 관리
                     </MDTypography>
                 </Grid>
                 <Grid item xs={4.5} sm={12} md={3} lg={2}>
                     <MDButton
                         variant="gradient"
                         color="success"
                         sx={{
                             fontSize: isSmallScreen ? '0.8rem' : '1.3rem',
                             fontFamily: 'JalnanGothic',
                             padding: isSmallScreen ? '2px 4px' : '10px 20px',
                             width: isSmallScreen ? '90%' : '90%',
                             mt: isSmallScreen ? -1 : 1.5,
                             lineHeight: isSmallScreen ? 2 : 1.8,  // 줄 간격을 줄여 높이를 감소시킴
                             minHeight: 'auto' // 기본적으로 적용되는 높이를 없앰
                         }}
                         onClick={() => handleAddNotice()}>
                         공지사항 생성
                     </MDButton>
                 </Grid>
             </Grid>


             <MDBox pt={1} pb={20}>
                 <MDBox pt={isSmallScreen? 1:1} pb={isSmallScreen? 0:1} px={isSmallScreen? 1:3}>
                     <Card>
                         <MDBox pt={2} pb={5} px={3} sx={{ overflowX: 'auto' }}>
                             {/* 검색 폼 추가 */}
                             <form onSubmit={handleSearchSubmit}
                                   style={styles.searchForm}>
                                 <Grid container>
                                     <Grid item xs={9} lg={2}>
                                         <MDInput
                                             type="text"
                                             value={searchQuery}
                                             onChange={handleSearchChange}
                                             placeholder="검색어를 입력하세요"
                                             style={styles.searchInput}
                                         />
                                     </Grid>
                                     <Grid item xs={3} lg={3}>
                                         <MDButton
                                             type="submit"
                                             variant="gradient"
                                             sx={{
                                                 fontFamily: 'JalnanGothic',
                                                 fontSize: isSmallScreen
                                                     ? '0.8rem' : '0.9rem',
                                                 minWidth: 'auto',
                                                 width: isSmallScreen ? '50px'
                                                     : 'auto', // 가로 너비를 줄임
                                                 padding: isSmallScreen
                                                     ? '1px 2px'
                                                     : '4px 8px',
                                                 lineHeight: isSmallScreen ? 2.2
                                                     : 2,  // 줄 간격을 줄여 높이를 감소시킴
                                                 minHeight: 'auto', // 기본적으로 적용되는 높이를 없앰
                                                 mt: isSmallScreen ? 1.5:1.3
                                             }}
                                             color="info">검색
                                         </MDButton>
                                     </Grid>
                                 </Grid>
                             </form>

                             <div className="noticeList-contents">
                                 {notices.length > 0 ? (
                                     !isMobile ? (
                                         <table style={styles.table}>
                                             <thead>
                                             <tr>
                                                 <th>
                                                     <MDTypography fontWeight="bold"
                                                                   variant="body2"
                                                                   sx={styles.th}>
                                                         공지사항 제목
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
                                                         수정
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
                                             {notices.map((notice) => (
                                                 <tr key={notice.noticeNo}>
                                                     <td>
                                                         <MDTypography
                                                             onClick={() => handleDetail(notice)}
                                                             sx={{ ...styles.clickable, ...styles.td }}
                                                             variant="body2">
                                                             {notice.noticeTitle}
                                                         </MDTypography>
                                                     </td>
                                                     <td>
                                                         <MDTypography sx={styles.td}
                                                                       variant="body2">
                                                             {notice.noticeWriter}
                                                         </MDTypography>
                                                     </td>
                                                     <td>
                                                         <MDTypography sx={styles.td}
                                                                       variant="body2">
                                                             {formatCreateTime(notice.createTime)}
                                                         </MDTypography>
                                                     </td>
                                                     <td>
                                                         <MDButton
                                                             sx={styles.updateDeleteButton}
                                                             variant="contained"
                                                             color="info"
                                                             onClick={() => handleUpdateNotice(notice)}>
                                                             수정
                                                         </MDButton>
                                                     </td>
                                                     <td>
                                                         <MDButton
                                                             sx={styles.updateDeleteButton}
                                                             variant="contained"
                                                             color="error"
                                                             onClick={() => openDeleteModal(notice)}>
                                                             삭제
                                                         </MDButton>
                                                     </td>
                                                 </tr>
                                             ))}
                                             </tbody>
                                         </table>
                                     ) : (
                                         // 모바일에서는 리스트 형태로 출력
                                         notices.map((notice) => (
                                             <div key={notice.noticeNo}
                                                  style={styles.mobileNoticeItem}>
                                                 <MDTypography
                                                     onClick={() => handleDetail(
                                                         notice)}
                                                     sx={styles.mobileField}
                                                     variant="body2">
                                                     {notice.noticeTitle}
                                                 </MDTypography>
                                                 <MDTypography
                                                     sx={styles.mobileField}
                                                     variant="body2">
                                                     {notice.noticeWriter}
                                                 </MDTypography>
                                                 <MDTypography
                                                     sx={styles.mobileField}
                                                     variant="body2">
                                                     {formatCreateTime(
                                                         notice.createTime)}
                                                 </MDTypography>
                                                 <div style={{
                                                     display: 'flex',
                                                     justifyContent: 'flex-end', // Align buttons to the right
                                                     marginTop: '10px',
                                                     marginBottom: '10px',
                                                     gap: '10px' // Space between buttons
                                                 }}>
                                                     <MDButton
                                                         sx={styles.updateDeleteButton}
                                                         variant="contained"
                                                         color="info"
                                                         onClick={() => handleUpdateNotice(
                                                             notice)}>
                                                         수정
                                                     </MDButton>
                                                     <MDButton
                                                         sx={styles.updateDeleteButton}
                                                         variant="contained"
                                                         color="error"
                                                         onClick={() => openDeleteModal(
                                                             notice)}>
                                                         삭제
                                                     </MDButton>
                                                 </div>
                                             </div>
                                         ))
                                     )
                                 ) : (
                                     <MDTypography
                                         variant="body2"
                                         sx={{
                                             marginLeft: '8px'
                                         }}>
                                         공지사항이 없습니다.
                                     </MDTypography>
                                 )}

                             </div>
                         </MDBox>
                     </Card>
                 </MDBox>
                 {notices.length > 0 && (
                     <MDBox sx={styles.pagination}>
                         {renderPagination()}
                     </MDBox>
                 )}
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
                          <MDButton onClick={handleCloseModal}>
                              취소
                          </MDButton>
                         <MDButton color="error" onClick={handleDeleteNotice}>
                             삭제
                         </MDButton>
                     </div>
                 </div>
             )}
         </DashboardLayout>
     );
}

export default NoticeManage;
