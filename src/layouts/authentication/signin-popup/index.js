import * as React from 'react';
import { useState } from 'react';

// @mui material components
import Card from '@mui/material/Card';
import Grid from '@mui/material/Grid';

// Material Dashboard 2 React components
import MDBox from '../../../components/MD/MDBox';
import MDTypography from '../../../components/MD/MDTypography';
import MDInput from '../../../components/MD/MDInput';
import MDButton from '../../../components/MD/MDButton';

// Authentication layout components
import useCustomLogin from "../../../hooks/useCustomLogin";

// Data
import { loginPost, logoutPost } from "../../../api/memberApi";
import {useMediaQuery} from "@mui/material";

const initState = {
    memberId: '',
    memberPw: ''
}

function SignInPopUp() {
    const [loginParam, setLoginParam] = useState({ ...initState })
    const isSmallScreen = useMediaQuery('(max-width:600px)');

    const {
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

                // 로그인 성공 시 부모 페이지 새로 고치고 현재 창 닫기
                if (window.opener) {
                    window.opener.location.reload(); // 부모 창 새로 고침
                }
                window.close(); // 현재 창 닫기
            })
            .catch((error) => {
                // 예외 처리
                console.error("로그인 오류:", error);
                alert(error.response.data);
            });
    }

    // 소셜로그인 시 처리, 현재 안됨
//    const handleSocialLogin = (url) => {
//        // 현재 페이지에서 소셜 로그인 URL로 이동
//        window.location.href = url;
//
//        if (isAuthorization) {
//            // 로그인 성공 시 부모 페이지 새로 고치고 현재 창 닫기
//            if (window.opener) {
//                window.opener.location.reload(); // 부모 창 새로 고침
//            }
//            window.close(); // 현재 창 닫기
//        } else {
//            // 로그인 실패 시 필요한 처리
//            console.error("로그인 실패");
//        }
//    };

    // 엔터 키로 폼 제출을 처리하는 핸들러
    const handleSubmit = (e) => {
        e.preventDefault(); // 기본 폼 제출 방지
        handleSignIn(); // 로그인 함수 호출
    }

    if (!isAuthorization) {
        return (
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
                                                    {/*<a href="http://localhost:8080/oauth2/authorization/google">*/}
                                                    <a href="https://tmarket.store/api/oauth2/authorization/google">
                                                        <img
                                                            src="/google_login.png"
                                                            alt="Google Login"
                                                            style={{
                                                                width: '150px',
                                                                height: '40px',
                                                                cursor: 'pointer',
                                                                margin: isSmallScreen ? '5px' : '10px'
                                                            }}
                                                        />
                                                    </a>
                                                    {/*<a href="http://localhost:8080/oauth2/authorization/naver">*/}
                                                    <a href="https://tmarket.store/api/oauth2/authorization/naver">
                                                        <img
                                                            src="/naver_login.png"
                                                            alt="Naver Login"
                                                            style={{
                                                                width: '150px',
                                                                height: '40px',
                                                                cursor: 'pointer',
                                                                margin: isSmallScreen ? '5px' : '10px'
                                                            }}
                                                        />
                                                    </a>
                                                    {/*<a href="http://localhost:8080/oauth2/authorization/kakao">*/}
                                                    <a href="https://tmarket.store/api/oauth2/authorization/kakao">
                                                        <img
                                                            src="/kakao_login.png"
                                                            alt="Kakao Login"
                                                            style={{
                                                                width: '150px',
                                                                height: '40px',
                                                                cursor: 'pointer',
                                                                margin: isSmallScreen ? '5px' : '10px'
                                                            }}
                                                        />
                                                    </a>
                                                </MDBox>
                                            </MDTypography>
                                        </MDBox>
                                    </MDBox>
                                </MDBox>

                            </Card>
                        </Grid>
                    </Grid>
                </MDBox>
        );
    } else {
        return (
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
        );
    }
}

export default SignInPopUp;
