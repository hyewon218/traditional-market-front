import * as React from 'react';
import { useState } from 'react';

// react-router-dom components
import { Link } from 'react-router-dom';

// @mui material components
import Card from '@mui/material/Card';
import Grid from '@mui/material/Grid';

// Material Dashboard 2 React components
import MDBox from '../../../components/MD/MDBox';
import MDTypography from '../../../components/MD/MDTypography';
import MDInput from '../../../components/MD/MDInput';
import MDButton from '../../../components/MD/MDButton';
import FindIdModal from '../../../components/common/FindIdModal';  // 아이디 찾기 모달 컴포넌트 import
import TempPwModal from '../../../components/common/TempPwModal';  // 임시비밀번호 발급 모달 컴포넌트 import

// Authentication layout components
import DashboardLayout from '../../../examples/LayoutContainers/DashboardLayout';
import useCustomLogin from "../../../hooks/useCustomLogin";

// Data
import { loginPost, logoutPost } from "../../../api/memberApi";
import {useMediaQuery} from "@mui/material";

const initState = {
    memberId: '',
    memberPw: ''
}

function SignIn() {
    const [loginParam, setLoginParam] = useState({ ...initState })
    const [openIdModal, setOpenIdModal] = useState(false);
    const [openPwModal, setOpenPwModal] = useState(false);

    const isSmallScreen = useMediaQuery('(max-width:600px)');

    const {
        moveToPath,
        isAuthorization
    } = useCustomLogin()

    // 로그아웃
    const handleClickLogout = () => {
        logoutPost().then(() => {
            alert("로그아웃 되었습니다.");
//            moveToPath("/");
            window.location.href = "/";
        });
    }

    const handleChange = (e) => {
        loginParam[e.target.name] = e.target.value
        setLoginParam({ ...loginParam })
    }

    // 로그인
    const handleSignIn = () => {
        if (!loginParam.memberId.trim() || !loginParam.memberPw.trim()) {
            alert("아이디와 비밀번호를 입력해 주세요.");
            return;
        }

        loginPost(loginParam)
            .then((data) => {
                // 로그인 성공 처리
                alert("로그인 성공");
                console.log('data : ', data);
                moveToPath('/');
            })
            .catch((error) => {
                // 예외 처리
                console.error("로그인 오류:", error);
                alert(error.response.data);
            });
    }

    // 엔터 키로 폼 제출을 처리하는 핸들러
    const handleSubmit = (e) => {
        e.preventDefault(); // 기본 폼 제출 방지
        handleSignIn(); // 로그인 함수 호출
    }

    const handleOpenIdModal = () => setOpenIdModal(true);
    const handleCloseIdModal = () => setOpenIdModal(false);
    const handleOpenPwModal = () => setOpenPwModal(true);
    const handleClosePwModal = () => setOpenPwModal(false);

    if (!isAuthorization) {
        return (
            <DashboardLayout>
                <MDBox
                    sx={{
                        mt: {xs:-10, sm:1, md:1, lg:-2},
                        mb: 10,
                        px: {md: 5, lg: 3},
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        minHeight: '90vh',
                    }}
                >
                    <Grid container spacing={3} justifyContent="center">
                        <Grid item xs={12} sm={12} md={12} lg={4}>
                            <Card>
                                <MDBox
                                    variant="gradient"
                                    bgColor="info"
                                    borderRadius="lg"
                                    coloredShadow="info"
                                    mx={2}
                                    mt={-3}
                                    p={2}
                                    mb={1}
                                    textAlign="center"
                                >
                                    <MDTypography
                                        variant="h4"
                                        fontWeight="medium"
                                        color="white" mt={1}>
                                        로그인
                                    </MDTypography>
                                </MDBox>
                                <MDBox pt={3} pb={3} px={3}>
                                    <MDBox component="form" role="form" onSubmit={handleSubmit}>
                                        <MDBox mb={2}>
                                            <MDInput
                                                type={'text'}
                                                name="memberId"
                                                label="아이디"
                                                value={loginParam.memberId}
                                                onChange={handleChange}
                                                fullWidth
                                            />
                                        </MDBox>
                                        <MDBox mb={2}>
                                            <MDInput
                                                type={'password'}
                                                name="memberPw"
                                                label="비밀번호"
                                                value={loginParam.memberPw}
                                                onChange={handleChange}
                                                fullWidth
                                            />
                                        </MDBox>
                                        <MDBox mt={isSmallScreen? 1:4} mb={1}>
                                            <MDButton
                                                sx={{
                                                    backgroundColor: '#50bcdf',
                                                    color: '#ffffff',
                                                    fontSize: isSmallScreen ? '0.8rem':'1rem',
                                                    fontFamily: 'JalnanGothic',
                                                    width: '100%',
                                                    padding: isSmallScreen ? '1px 2px' : '4px 8px',
                                                    lineHeight: isSmallScreen ? 2.5 : 2,  // 줄 간격을 줄여 높이를 감소시킴
                                                    minHeight: 'auto' // 기본적으로 적용되는 높이를 없앰
                                                }}
                                                type="submit"
                                                variant="gradient"
                                                color="info" fullWidth>
                                                로그인
                                            </MDButton>
                                        </MDBox>
                                        <MDBox mt={3} mb={1} textAlign="center">
                                            <MDTypography variant="button" color="text">
                                                <MDBox display="flex" justifyContent="center" spacing={2}>
                                                    <a
                                                        //href="http://localhost:8080/oauth2/authorization/google"
                                                        //href="http://3.36.96.0:8080/oauth2/authorization/google"
                                                        href="http://tmarket.kro.kr:8080/oauth2/authorization/google"
                                                    >
                                                        <img
                                                            src="/google_login.png"
                                                            alt="Google Login"
                                                            style={{
                                                                width: '150px',   // 이미지 크기 조정
                                                                height: '40px',    // 이미지 비율 유지
                                                                cursor: 'pointer', // 클릭 가능하도록 포인터 표시
                                                                margin: isSmallScreen ? '5px' : '10px',  // 화면 크기에 따라 여백 조정,
                                                                padding: isSmallScreen ? '1px 2px' : '4px 8px'
                                                            }}
                                                        />
                                                    </a>
                                                    <a
                                                        //href="http://localhost:8080/oauth2/authorization/naver"
                                                        //href="http://3.36.96.0:8080/oauth2/authorization/naver"
                                                        href="http://tmarket.kro.kr:8080/oauth2/authorization/naver"
                                                    >
                                                        <img
                                                            src="/naver_login.png"
                                                            alt="Naver Login"
                                                            style={{
                                                                width: '150px',
                                                                height: '40px',
                                                                cursor: 'pointer',
                                                                margin: isSmallScreen ? '5px' : '10px',
                                                                padding: isSmallScreen ? '1px 2px' : '4px 8px'
                                                            }}
                                                        />
                                                    </a>
                                                    <a
                                                        //href="http://localhost:8080/oauth2/authorization/kakao"
                                                        //href="http://3.36.96.0:8080/oauth2/authorization/kakao"
                                                        href="http://tmarket.kro.kr:8080/oauth2/authorization/kakao"
                                                    >
                                                        <img
                                                            src="/kakao_login.png"
                                                            alt="Kakao Login"
                                                            style={{
                                                                width: '150px',
                                                                height: '40px',
                                                                cursor: 'pointer',
                                                                margin: isSmallScreen ? '5px' : '10px',
                                                                padding: isSmallScreen ? '1px 2px' : '4px 8px'
                                                            }}
                                                        />
                                                    </a>
                                                </MDBox>
                                            </MDTypography>
                                        </MDBox>
                                        <MDBox mt={isSmallScreen? 2:3} mb={isSmallScreen? -1:1} textAlign="center">
                                            <MDTypography
                                                sx={{
                                                    fontSize: isSmallScreen? '0.7rem':'1rem'
                                                }}
                                                variant="button"
                                                color="text">
                                                계정이 없으신가요?{' '}
                                                <MDTypography
                                                    sx={{
                                                        fontSize: isSmallScreen? '0.7rem':'1rem'
                                                    }}
                                                    component={Link}
                                                    to="/authentication/signup"
                                                    variant="button"
                                                    color="info"
                                                    fontWeight="medium"
                                                    textGradient
                                                >
                                                    회원가입
                                                </MDTypography>
                                            </MDTypography>
                                            <MDBox mt={isSmallScreen? 0:2}>
                                                <MDButton
                                                    variant="text" color="info" onClick={handleOpenIdModal}>
                                                    아이디 찾기
                                                </MDButton>
                                                {' | '}
                                                <MDButton
                                                    variant="text" color="info" onClick={handleOpenPwModal}>
                                                    비밀번호 찾기
                                                </MDButton>
                                            </MDBox>
                                        </MDBox>
                                    </MDBox>
                                </MDBox>

                            </Card>
                        </Grid>
                    </Grid>
                </MDBox>

                {/* 아이디 찾기 모달 */}
                <FindIdModal open={openIdModal} handleClose={handleCloseIdModal} />

                {/* 비밀번호 찾기 모달 */}
                <TempPwModal open={openPwModal} handleClose={handleClosePwModal} />

            </DashboardLayout>
        );
    } else {
        return (
            <DashboardLayout>
                <MDBox
                    sx={{
                        mt: {xs:-10, sm:5, md:1, lg:-1},
                    }}
                    style={{ height: '85vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                >
                    <Grid container spacing={3} justifyContent="center">
                        <Grid item xs={12} lg={4}>
                            <Card>
                                <MDBox
                                    variant="gradient"
                                    bgColor="info"
                                    borderRadius="lg"
                                    coloredShadow="info"
                                    mx={2}
                                    mt={-3}
                                    p={2}
                                    mb={1}
                                    textAlign="center"
                                >
                                    <MDTypography
                                        sx={{
                                            fontSize: isSmallScreen
                                                ? '1rem'
                                                : '1.3rem'
                                        }}
                                        fontWeight="medium"
                                        color="white" mt={1}>
                                        로그아웃 하시겠습니까?
                                    </MDTypography>
                                </MDBox>
                                <MDBox pt={1} pb={3} px={3}>
                                    <MDBox component="form" role="form">
                                        <MDBox mt={4} mb={1}>
                                            <MDButton
                                                sx={{
                                                    backgroundColor: '#50bcdf',
                                                    color: '#ffffff',
                                                    fontSize: isSmallScreen ? '0.8rem':'1rem',
                                                    fontFamily: 'JalnanGothic',
                                                    width: '100%',
                                                    padding: isSmallScreen ? '1px 2px' : '4px 8px',
                                                    lineHeight: isSmallScreen ? 2.5 : 2,  // 줄 간격을 줄여 높이를 감소시킴
                                                    minHeight: 'auto' // 기본적으로 적용되는 높이를 없앰
                                                }}
                                                onClick={handleClickLogout}
                                                variant="gradient" color="info"
                                                fullWidth>
                                                로그아웃
                                            </MDButton>
                                        </MDBox>
                                    </MDBox>
                                </MDBox>
                            </Card>
                        </Grid>
                    </Grid>
                </MDBox>
            </DashboardLayout>
        );
    }
}

export default SignIn;
