///**
// =========================================================
// * Material Dashboard 2 React - v2.1.0
// =========================================================
//
// * Product Page: https://www.creative-tim.com/product/material-dashboard-react
// * Copyright 2022 Creative Tim (https://www.creative-tim.com)
//
// Coded by www.creative-tim.com
//
// =========================================================
//
// * The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.
// */
//
//import React, {useState} from 'react';
//import {useLocation, useNavigate} from 'react-router-dom';
//
//// @mui material components
//import Typography from '@mui/material/Typography';
//import TextField from '@mui/material/TextField';
//import KeyboardArrowLeftIcon from '@mui/icons-material/KeyboardArrowLeft';
//
//// Material Dashboard 2 React components
//import DashboardLayout from '../../examples/LayoutContainers/DashboardLayout';
//
//// API 호출 함수
//import {postCheckPw} from '../../api/memberApi';
//import MDBox from "../../components/MD/MDBox";
//import MDButton from "../../components/MD/MDButton";
//import {Grid, useMediaQuery} from "@mui/material";
//import MDTypography from "../../components/MD/MDTypography";
//import Card from "@mui/material/Card";
//
//import {postSendEmailCode, postVerifyCode} from "../../api/memberApi";
//
//function CheckEmail() {
//  const { state } = useLocation();
//  const member = state; // 전달된 member 데이터를 사용
//
//  const [password, setPassword] = useState('');
//  const [error, setError] = useState('');
//  const navigate = useNavigate();
//  const isSmallScreen = useMediaQuery('(max-width:600px)');
//
//  const handlePasswordChange = (event) => {
//    setPassword(event.target.value);
//  };
//
//  // 일반 회원일 경우(OAuth2.0 X)
//  const handleSubmit = async (event) => {
//    event.preventDefault();
//    console.log('providerType : ', member.providerType);
//
//    try {
//      const formData = new FormData();
//      formData.append('password', password);
//      const verifyResponse = await postCheckPw(formData);
//      console.log('verifyResponse : ', verifyResponse);
//
//      if (verifyResponse) {
//        // isPassword 쿠키만 출력
//        const cookies = document.cookie.split('; ').reduce((acc, cookie) => {
//          const [name, value] = cookie.split('=');
//          acc[name] = value;
//          return acc;
//        }, {});
//        if (cookies['isPasswordVerified']) {
//          console.log('생성된 isPasswordVerified 쿠키:', cookies['isPasswordVerified']);
//        } else {
//          console.log('isPasswordVerified 쿠키가 존재하지 않습니다.');
//        }
//        navigate(`/myinfo-detail`, { state: member });
//      }
//    } catch (error) {
//      console.log(error);
//      setError(error.response.data);
//    }
//  };
//
//  // OAuth2.0 회원일 경우
//  const handleProviderLogin = async () => {
//    console.log('member : ', member);
//    console.log('providerType : ', member.providerType);
//
//    try {
//      const formData = new FormData();
//      formData.append('password', password);
//      const verifyResponse = await postCheckPw(formData);
//      console.log('verifyResponse : ', verifyResponse);
//
//      if (verifyResponse) {
//        navigate(`/myinfo-detail`, { state: member });
//      }
//    } catch (error) {
//      setError('인증에 실패했습니다.');
//    }
//  };
//
//  const handleBack = () => {
//    window.history.back();
//  };
//
//  return (
//    <DashboardLayout>
//        <Grid container>
//            <Grid item xs={6} lg={4}>
//                <MDTypography fontWeight="bold"
//                              sx={{
//                                  ml: isSmallScreen ? 2 : 4,
//                                  mt: isSmallScreen ? 0 : 3,
//                                  fontSize: isSmallScreen ? '1.2rem'
//                                      : '2rem'
//                              }}
//                              variant="body2">
//                    내 정보
//                </MDTypography>
//            </Grid>
//            <Grid item xs={6} lg={8}>
//                <MDBox sx={{
//                    pr: isSmallScreen ? 2 : 3,
//                    width: '100%',
//                    mt: isSmallScreen ? 0 : 4,
//                    display: 'flex',
//                    justifyContent: 'right',
//                }}>
//                    <MDButton
//                        sx={{
//                            fontFamily: 'JalnanGothic',
//                            fontSize: isSmallScreen ? '0.7rem' : '0.9rem',
//                            minWidth: 'auto',
//                            width: isSmallScreen ? '100px' : 'auto', // 가로 너비를 줄임
//                            padding: isSmallScreen
//                                ? '1px 2px'
//                                : '4px 8px',
//                            lineHeight: isSmallScreen ? 2.5 : 2,  // 줄 간격을 줄여 높이를 감소시킴
//                            minHeight: 'auto' // 기본적으로 적용되는 높이를 없앰
//                        }}
//                        variant="contained"
//                        color="white"
//                        onClick={handleBack}
//                        startIcon={<KeyboardArrowLeftIcon/>}
//                    >
//                        돌아가기
//                    </MDButton>
//                </MDBox>
//            </Grid>
//        </Grid>
//
//    {/*  <MDBox
//        sx={{
//          p: 3,
//          display: 'flex',
//          justifyContent: 'center',
//          alignItems: 'center',
//          height: isSmallScreen ? '40vh' :'60vh',
//          mb: isSmallScreen ? 10:10
//        }}
//      >
//        <Card
//          sx={{
//            width: '100%',
//            maxWidth: '500px',
//            p: 4,
//            display: 'flex',
//            flexDirection: 'column',
//            alignItems: 'center',
//          }}
//        >*/}
//        <MDBox pt={5} pb={20} display="flex" justifyContent="center">
//            <MDBox pt={isSmallScreen ? 1 : 1} pb={1} px={isSmallScreen ? 1 : 3}
//                   width="100%"
//                   display="flex"
//                   justifyContent="center">
//                <Card sx={{
//                    maxWidth: isSmallScreen ? '90%' : '30%',  // 카드의 최대 너비 설정
//                    width: '100%',                           // 부모 요소에서 차지하는 너비 설정
//                    margin: '0 auto',                        // 가로로 중앙 정렬
//                }}>
//                    <MDBox pt={2} pb={2} px={isSmallScreen ? 1 : 2}>
//                        <MDTypography
//                            sx={{
//                                fontSize : isSmallScreen ? '0.9rem' : '1.2rem',
//                                textAlign: 'center',
//                                mb : 1
//                            }}
//                            variant="h5" gutterBottom>
//                            비밀번호 확인
//                        </MDTypography>
//                        <form onSubmit={handleSubmit}
//                              style={{width: '100%'}}>
//                            <TextField
//                                label="비밀번호"
//                                type="password"
//                                value={password}
//                                onChange={handlePasswordChange}
//                                required
//                                fullWidth
//                                sx={{mb: 3}}
//                                inputProps={{style: {fontSize: '1rem'}}}
//                            />
//                            <MDButton
//                                type="submit"
//                                variant="contained"
//                                color="primary"
//                                fullWidth
//                                sx={{
//                                    fontFamily: 'JalnanGothic',
//                                    fontSize: isSmallScreen ? '0.8rem' : '1.1rem',
//                                    minWidth: 'auto',
//                                    width: '100%',
//                                    padding: isSmallScreen
//                                        ? '1px 2px'
//                                        : '4px 8px',
//                                    lineHeight: isSmallScreen ? 2.5 : 3,  // 줄 간격을 줄여 높이를 감소시킴
//                                    minHeight: 'auto' // 기본적으로 적용되는 높이를 없앰
//                                }}
//                            >
//                                비밀번호 확인
//                            </MDButton>
//                            {error && <Typography color="error" sx={{
//                                fontSize: isSmallScreen ? '0.8rem' : '1rem'
//                            }}>{error}</Typography>}
//                        </form>
//                    </MDBox>
//                </Card>
//            </MDBox>
//        </MDBox>
//    </DashboardLayout>
//  );
//}
//
//export default CheckEmail;
//


// OAuth2.0 회원이 내정보 열람 시 이메일 인증
import React, {useState} from 'react';
import {useLocation, useNavigate} from 'react-router-dom';

// @mui material components
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import KeyboardArrowLeftIcon from '@mui/icons-material/KeyboardArrowLeft';

// Material Dashboard 2 React components
import DashboardLayout from '../../examples/LayoutContainers/DashboardLayout';
import MDBox from "../../components/MD/MDBox";
import MDButton from "../../components/MD/MDButton";
import {Grid, useMediaQuery} from "@mui/material";
import MDTypography from "../../components/MD/MDTypography";
import Card from "@mui/material/Card";

import {postSendEmailCode, postVerifyCode, postMakeCookie} from "../../api/memberApi";

function CheckEmail() {
  const {state} = useLocation();
  const member = state; // 전달된 member 데이터를 사용

  const [verificationCode, setVerificationCode] = useState('');
  const [error, setError] = useState('');
  const [emailSent, setEmailSent] = useState(false); // 인증번호 전송 여부 확인
  const [isVerified, setIsVerified] = useState(false); // 인증번호 일치 여부 확인
  const navigate = useNavigate();
  const isSmallScreen = useMediaQuery('(max-width:600px)');

  const handleCodeChange = (event) => {
    setVerificationCode(event.target.value);
  };

  // 이메일 인증번호 전송
//  const handleSendCode = async () => {
//    try {
//      await postSendEmailCode(member.memberEmail); // 이메일로 인증번호 전송
//      setEmailSent(true); // 인증번호 전송 완료
//      console.log('인증번호가 전송되었습니다.');
//    } catch (error) {
//      console.log('인증번호 전송 실패:', error);
//      setError('인증번호 전송에 실패했습니다.');
//    }
//  };

  // 이메일 인증번호 전송
  const handleSendCode = async () => {
      try {
          const formData = new FormData();
          formData.append('memberEmail', member.memberEmail);

          const emailCode = await postSendEmailCode(formData);
          console.log('emailCode : ', emailCode);
          setEmailSent(true); // 인증번호 전송 완료
          console.log('인증번호가 전송되었습니다.');

      } catch (error) {
          console.log('인증번호 전송 실패:', error);
          setError('인증번호 전송에 실패했습니다.');
      }
  };

  // 이메일 인증번호 확인
//  const handleSubmit = async (event) => {
//    event.preventDefault();
//    try {
//      const verifyResponse = await postVerifyCode(verificationCode);
//      console.log('verifyResponse:', verifyResponse);
//
//      if (verifyResponse) {
//        navigate(`/myinfo-detail`, { state: member });
//      }
//    } catch (error) {
//      console.log('인증 실패:', error);
//      setError('인증번호가 잘못되었습니다.');
//    }
//  };

  // 이메일 인증번호 확인
  const handleSubmit = async (event) => {
      event.preventDefault();  // 새로고침 방지

      try {
          const formData = new FormData();
          formData.append('memberEmail : ', member.memberEmail);
          formData.append('code : ', verificationCode);

          const response = await postVerifyCode(formData);
          console.log('response : ', response);

          if (response) {
              // 인증 성공 시 쿠키 생성
              await postMakeCookie();
              navigate(`/myinfo-detail`, { state: member });
          } else {
              console.log(error.response.data);
          }
      } catch (error) {
          alert(error.response.data);
      }
  };

  const handleBack = () => {
    window.history.back();
  };

  return (
    <DashboardLayout>
      <Grid container>
        <Grid item xs={6} lg={4}>
          <MDTypography fontWeight="bold"
            sx={{
              ml: isSmallScreen ? 2 : 4,
              mt: isSmallScreen ? 0 : 3,
              fontSize: isSmallScreen ? '1.2rem' : '2rem'
            }}
            variant="body2">
            내 정보
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
                width: isSmallScreen ? '100px' : 'auto',
                padding: isSmallScreen ? '1px 2px' : '4px 8px',
                lineHeight: isSmallScreen ? 2.5 : 2,
                minHeight: 'auto'
              }}
              variant="contained"
              color="white"
              onClick={handleBack}
              startIcon={<KeyboardArrowLeftIcon />}
            >
              돌아가기
            </MDButton>
          </MDBox>
        </Grid>
      </Grid>

      <MDBox pt={5} pb={20} display="flex" justifyContent="center">
        <MDBox pt={isSmallScreen ? 1 : 1} pb={1} px={isSmallScreen ? 1 : 3} width="100%" display="flex" justifyContent="center">
          <Card sx={{
            maxWidth: isSmallScreen ? '90%' : '30%',
            width: '100%',
            margin: '0 auto',
          }}>
            <MDBox pt={2} pb={2} px={isSmallScreen ? 1 : 2}>
              <MDTypography
                sx={{
                  fontSize: isSmallScreen ? '0.9rem' : '1.2rem',
                  textAlign: 'center',
                  mb: 1
                }}
                variant="h5" gutterBottom>
                이메일 인증
              </MDTypography>

              {/* 인증번호 입력 폼 */}
              <form onSubmit={handleSubmit} style={{ width: '100%' }}>
                <TextField
                  label="인증번호"
                  type="text"
                  value={verificationCode}
                  onChange={handleCodeChange}
                  required
                  fullWidth
                  sx={{ mb: 3 }}
                  inputProps={{ style: { fontSize: '1rem' } }}
                />

                {/* 인증번호 전송 버튼 */}
                {!emailSent && (
                  <MDButton
                    variant="contained"
                    color="primary"
                    fullWidth
                    sx={{
                      fontFamily: 'JalnanGothic',
                      fontSize: isSmallScreen ? '0.8rem' : '1.1rem',
                      minWidth: 'auto',
                      width: '100%',
                      padding: isSmallScreen ? '1px 2px' : '4px 8px',
                      lineHeight: isSmallScreen ? 2.5 : 3,
                      minHeight: 'auto'
                    }}
                    onClick={handleSendCode}
                  >
                    인증번호 전송
                  </MDButton>
                )}

                {/* 인증번호 확인 버튼 */}
                {emailSent && (
                  <MDButton
                    type="submit"
                    variant="contained"
                    color="primary"
                    fullWidth
                    sx={{
                      fontFamily: 'JalnanGothic',
                      fontSize: isSmallScreen ? '0.8rem' : '1.1rem',
                      minWidth: 'auto',
                      width: '100%',
                      padding: isSmallScreen ? '1px 2px' : '4px 8px',
                      lineHeight: isSmallScreen ? 2.5 : 3,
                      minHeight: 'auto'
                    }}
                  >
                    인증번호 확인
                  </MDButton>
                )}

                {error && <Typography color="error" sx={{ fontSize: isSmallScreen ? '0.8rem' : '1rem' }}>{error}</Typography>}
              </form>
            </MDBox>
          </Card>
        </MDBox>
      </MDBox>
    </DashboardLayout>
  );
}

export default CheckEmail;
