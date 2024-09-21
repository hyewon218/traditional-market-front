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

// 공지사항 내용 html 태그 삭제
import * as React from 'react';
import {useState} from 'react';
import {useLocation, useNavigate} from 'react-router-dom';

// @mui material components
import Card from '@mui/material/Card';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import KeyboardArrowLeftIcon from '@mui/icons-material/KeyboardArrowLeft';

// Material Dashboard 2 React components
import DashboardLayout from '../../examples/LayoutContainers/DashboardLayout';
import useCustomLogin from "../../hooks/useCustomLogin";

// Data
import {deleteNotice} from "../../api/noticeApi";
import {postCheckAdminPw} from "../../api/adminApi";
import MDTypography from "../../components/MD/MDTypography";
import MDBox from "../../components/MD/MDBox";
import MDButton from "../../components/MD/MDButton";
import {useMediaQuery} from "@mui/material";

// 페이지 및 요소 스타일
const styles = {
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
    },
    modalContent: {
        backgroundColor: 'white',
        padding: '20px',
        borderRadius: '8px',
        textAlign: 'center',
        width: '300px',
    },
    errorMessage: {
        color: 'red',
        marginTop: '10px',
    },
    divider: {
        border: '1px solid #ccc',
        margin: '20px 0', // 위아래 간격 조정
    },
};

function NoticeDetail() {
    const {state} = useLocation();
    const notice = state; // 전달된 notice 데이터를 사용

    const [showPasswordModal, setShowPasswordModal] = useState(false);
    const [noticeToDelete, setNoticeToDelete] = useState(null);
    const [password, setPassword] = useState("");
    const [errorMessage, setErrorMessage] = useState("");
    const {isAdmin} = useCustomLogin();
    const navigate = useNavigate();
    const isSmallScreen = useMediaQuery('(max-width:600px)');

    const handleModifyNotice = (notice) => {
        console.log('handleModifyNotice');
        navigate('/modify-notice', {state: notice});
    };

    const handleDeleteWithPassword = (noticeNo) => {
        setNoticeToDelete(noticeNo);
        setShowPasswordModal(true);
    };

    const deleteNoticeByNo = async (noticeNo) => {
        try {
            if (password.trim() === "") {
                setErrorMessage("비밀번호를 입력하세요.");
                return;
            }

            console.log("입력된 비밀번호:", password); // 비밀번호를 콘솔에 로그로 찍음

            // FormData 객체를 생성
            const formData = new FormData();
            formData.append('password', password);

            const verifyResponse = await postCheckAdminPw(formData);
            console.log("verifyResponse :", verifyResponse);

            if (verifyResponse) {
                if (window.confirm("정말 해당 공지사항을 삭제하시겠습니까?")) {
                    const response = await deleteNotice(noticeNo);
                    alert("공지사항 삭제 성공!");
                    navigate('/notice-manage');
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
        setShowPasswordModal(false);
        setPassword('');
        setErrorMessage('');
    };

    // 뒤로 가기
    const handleBack = () => {
        window.history.back();
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

    return (
        <DashboardLayout>
            <Grid container>
                <Grid item xs={4} lg={4}>
                    <MDTypography fontWeight="bold"
                                  sx={{
                                      ml: isSmallScreen ? 2 : 4,
                                      mt: isSmallScreen ? 0 : 3,
                                      fontSize: isSmallScreen ? '1.2rem'
                                          : '2rem'
                                  }}
                                  variant="body2">
                        공지사항
                    </MDTypography>
                </Grid>
                <Grid item xs={8} lg={8}>
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
                        <MDBox pt={isSmallScreen ? 2 : 3} pb={isSmallScreen ? 2 : 3} px={isSmallScreen ? 2 : 2}>
                            <Grid container spacing={2}>
                                <Grid item xs={12} md={8}>
                                    {/* 공지사항 기본 정보 텍스트 */}
                                    <MDTypography
                                        sx={{ fontSize: isSmallScreen ? '1.0rem':'1.5rem' }}
                                        variant="h3"
                                        component="div"
                                                paragraph>
                                        {notice.noticeTitle}
                                    </MDTypography>
                                    <MDTypography
                                        sx={{ fontSize: isSmallScreen ? '0.9rem':'1.2rem' }}
                                        variant="body1" paragraph>
                                       작성 시간 : {formatCreateTime(
                                        notice.createTime)}
                                    </MDTypography>
                                    <MDTypography
                                        sx={{ fontSize: isSmallScreen ? '0.9rem':'1.2rem' }}
                                        variant="body1" paragraph>
                                        공지사항 작성자 : {notice.noticeWriter}
                                    </MDTypography>
                                    {/* 구분선 추가 */}
                                    <hr style={styles.divider}/>

                                    <MDTypography
                                        sx={{ fontSize: isSmallScreen ? '0.9rem':'1.2rem' }}
                                        variant="body1" paragraph>
                                        공지사항 내용 :
                                    </MDTypography>
                                    <MDBox
                                        sx={{
                                            '& .ql-editor': {
                                                minHeight: '200px',
                                                whiteSpace: 'pre-wrap', // Preserve whitespace
                                                fontFamily: 'JalnanGothic', // 폰트 설정
                                            },
                                        }}
                                        dangerouslySetInnerHTML={{__html: notice.noticeContent}}
                                    />

                                    {/* 관리자만 수정 및 삭제 버튼 보이기 */}
                                    {isAdmin && (
                                        <Grid container spacing={isSmallScreen ? 0 : 0}>
                                            <Grid item xs={isSmallScreen ? 2.5 : 1.4}>
                                                <MDButton
                                                    variant="contained"
                                                    color="success"
                                                    onClick={() => handleModifyNotice(notice)}
                                                    sx={{
                                                        fontFamily: 'JalnanGothic',
                                                        fontSize: isSmallScreen
                                                            ? '0.7rem'
                                                            : '0.9rem',
                                                        minWidth: 'auto',
                                                        width: isSmallScreen
                                                            ? '50px' : 'auto', // 가로 너비를 줄임
                                                        padding: isSmallScreen
                                                            ? '1px 2px'
                                                            : '4px 8px',
                                                        lineHeight: isSmallScreen
                                                            ? 2.3 : 2,  // 줄 간격을 줄여 높이를 감소시킴
                                                        minHeight: 'auto' // 기본적으로 적용되는 높이를 없앰
                                                    }}
                                                >
                                                    수정
                                                </MDButton>
                                            </Grid>

                                            <Grid item xs={isSmallScreen ? 1.5 : 1.6}>
                                                <MDButton
                                                    variant="contained"
                                                    color="success"
                                                    onClick={() => handleDeleteWithPassword(notice.noticeNo)}
                                                    sx={{
                                                        fontFamily: 'JalnanGothic',
                                                        fontSize: isSmallScreen
                                                            ? '0.7rem'
                                                            : '0.9rem',
                                                        minWidth: 'auto',
                                                        width: isSmallScreen
                                                            ? '50px' : 'auto', // 가로 너비를 줄임
                                                        padding: isSmallScreen
                                                            ? '1px 2px'
                                                            : '4px 8px',
                                                        lineHeight: isSmallScreen
                                                            ? 2.3 : 2,  // 줄 간격을 줄여 높이를 감소시킴
                                                        minHeight: 'auto' // 기본적으로 적용되는 높이를 없앰
                                                    }}
                                                >
                                                    삭제
                                                </MDButton>
                                            </Grid>
                                        </Grid>
                                    )}

                                    <Grid item xs={12} md={4}>
                                        {/* 이미지 갤러리 */}
                                        <Box sx={{
                                            display: 'flex',
                                            flexDirection: 'column',
                                            alignItems: 'flex-start',
                                            gap: 2
                                        }}>
                                            {notice.imageList.map(
                                                (img, index) => (
                                                    <img
                                                        key={index}
                                                        src={img.imageUrl}
                                                        alt={`notice-image-${index}`}
                                                        width="70%" // 카드의 오른쪽에 이미지가 위치하도록 폭을 조정
                                                        style={{marginBottom: '10px'}}
                                                    />
                                                ))}
                                        </Box>
                                    </Grid>
                                </Grid>
                            </Grid>
                        </MDBox>
                    </Card>
                </MDBox>


                {/* 비밀번호 확인 모달 */}
                {showPasswordModal && (
                    <div style={styles.modal}>
                        <div style={styles.modalContent}>
                            <Typography variant="h6" gutterBottom>
                                {notice.noticeTitle} 삭제
                            </Typography>
                            <form onSubmit={(e) => {
                                e.preventDefault();
                                deleteNoticeByNo(noticeToDelete);
                            }}>
                                <label htmlFor="adminPw">관리자 비밀번호 입력</label>
                                <input
                                    type="password"
                                    id="adminPw"
                                    name="adminPw"
                                    value={password}
                                    placeholder="비밀번호를 입력하세요"
                                    onChange={(e) => setPassword(
                                        e.target.value)}
                                    required
                                />
                                {errorMessage && <Typography
                                    style={styles.errorMessage}>{errorMessage}</Typography>}
                                <Box sx={{
                                    display: 'flex',
                                    justifyContent: 'space-between',
                                    mt: 2
                                }}>
                                    <Button variant="contained" color="error"
                                            type="submit">
                                        확인
                                    </Button>
                                    <Button variant="contained" color="error"
                                            onClick={handleCloseModal}>
                                        취소
                                    </Button>
                                </Box>
                            </form>
                        </div>
                    </div>
                )}
            </MDBox>
        </DashboardLayout>
    );
}

export default NoticeDetail;
