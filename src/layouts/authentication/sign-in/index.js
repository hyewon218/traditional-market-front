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
import {useState} from 'react';

// react-router-dom components
import {Link} from 'react-router-dom';

// @mui material components
import Card from '@mui/material/Card';
import Grid from '@mui/material/Grid';

// Material Dashboard 2 React components
import MDBox from '../../../components/MD/MDBox';
import MDTypography from '../../../components/MD/MDTypography';
import MDInput from '../../../components/MD/MDInput';
import MDButton from '../../../components/MD/MDButton';

// Authentication layout components
import DashboardLayout
    from '../../../examples/LayoutContainers/DashboardLayout';
import useCustomLogin from "../../../hooks/useCustomLogin";

const initState = {
    memberId: '',
    memberPw: ''
}

function SignIn() {
    const [loginParam, setLoginParam] = useState({...initState})

    const {
        doLogin,
        doLogout,
        moveToPath,
        isAuthorization
    } = useCustomLogin()

    const handleClickLogout = () => {
        doLogout().then(() => {
            alert("로그아웃 되었습니다.");
            moveToPath("/");
        });
    }

    const handleChange = (e) => {
        loginParam[e.target.name] = e.target.value
        setLoginParam({...loginParam})
    }

    const handleSignIn = () => {
        // 비동기 호출
        doLogin(loginParam) // loginSlice 의 비동기 호출
        .then(data => {
            console.log(data)

            if (data.error) {
                alert("이메일과 패스워드를 다시 확인하세요")
            } else {
                alert("로그인 성공")
                moveToPath('/')
            }
        })
    }

    if (!isAuthorization) {
        return (
            <DashboardLayout>
                <MDBox mt={30} mb={3}>
                    <Grid container spacing={3} justifyContent="center">
                        <Grid item xs={12} lg={8}>
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
                                    <MDTypography variant="h4"
                                                  fontWeight="medium"
                                                  color="white" mt={1}>
                                        로그인
                                    </MDTypography>
                                </MDBox>
                                <MDBox pt={4} pb={3} px={3}>
                                    <MDBox component="form" role="form">
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
                                        <MDBox mt={4} mb={1}>
                                            <MDButton onClick={handleSignIn}
                                                      variant="gradient"
                                                      color="info" fullWidth>
                                                로그인
                                            </MDButton>
                                        </MDBox>
                                        <MDBox mt={3} mb={1} textAlign="center">
                                            <MDTypography variant="button"
                                                          color="text">
                                                계정이 없으신가요?{' '}
                                                <MDTypography
                                                    component={Link}
                                                    to="/authentication/sign-up"
                                                    variant="button"
                                                    color="info"
                                                    fontWeight="medium"
                                                    textGradient
                                                >
                                                    회원가입
                                                </MDTypography>
                                            </MDTypography>
                                        </MDBox>
                                    </MDBox>
                                </MDBox>

                            </Card>
                        </Grid>
                    </Grid>
                </MDBox>
            </DashboardLayout>
        );
    } else {
        return (
            <DashboardLayout>
                <MDBox mt={30} mb={3}>
                    <Grid container spacing={3} justifyContent="center">
                        <Grid item xs={12} lg={8}>
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
                                    <MDTypography variant="h4"
                                                  fontWeight="medium"
                                                  color="white" mt={1}>
                                        Already login
                                    </MDTypography>
                                </MDBox>
                                <MDBox pt={4} pb={3} px={3}>
                                    <MDBox component="form" role="form">
                                        <MDBox mt={4} mb={1}>
                                            <MDButton
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
