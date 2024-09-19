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

import React, {useState} from 'react';
import {useLocation, useNavigate} from 'react-router-dom';

// @mui material components
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import KeyboardArrowLeftIcon from '@mui/icons-material/KeyboardArrowLeft';

// Material Dashboard 2 React components
import DashboardLayout from '../../examples/LayoutContainers/DashboardLayout';

// API 호출 함수
import {postCheckPw} from '../../api/memberApi';
import MDBox from "../../components/MD/MDBox";
import MDButton from "../../components/MD/MDButton";
import {useMediaQuery} from "@mui/material";
import MDTypography from "../../components/MD/MDTypography";
import Card from "@mui/material/Card";

function CheckPw() {
  const { state } = useLocation();
  const member = state; // 전달된 member 데이터를 사용

  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const isSmallScreen = useMediaQuery('(max-width:600px)');

  const handlePasswordChange = (event) => {
    setPassword(event.target.value);
  };

  // 일반 회원일 경우(OAuth2.0 X)
  const handleSubmit = async (event) => {
    event.preventDefault();
    console.log('providerType : ', member.providerType);

    try {
      const formData = new FormData();
      formData.append('password', password);
      const verifyResponse = await postCheckPw(formData);
      console.log('verifyResponse : ', verifyResponse);

      if (verifyResponse) {
        // isPassword 쿠키만 출력
        const cookies = document.cookie.split('; ').reduce((acc, cookie) => {
          const [name, value] = cookie.split('=');
          acc[name] = value;
          return acc;
        }, {});
        if (cookies['isPasswordVerified']) {
          console.log('생성된 isPasswordVerified 쿠키:', cookies['isPasswordVerified']);
        } else {
          console.log('isPasswordVerified 쿠키가 존재하지 않습니다.');
        }
        navigate(`/myinfo-detail`, { state: member });
      }
    } catch (error) {
      console.log(error);
      setError(error.response.data);
    }
  };

  // OAuth2.0 회원일 경우
  const handleProviderLogin = async () => {
    console.log('member : ', member);
    console.log('providerType : ', member.providerType);

    try {
      const formData = new FormData();
      formData.append('password', password);
      const verifyResponse = await postCheckPw(formData);
      console.log('verifyResponse : ', verifyResponse);

      if (verifyResponse) {
        navigate(`/myinfo-detail`, { state: member });
      }
    } catch (error) {
      setError('인증에 실패했습니다.');
    }
  };

  const handleBack = () => {
    window.history.back();
  };

  return (
    <DashboardLayout>
        <MDBox sx={{ width: '100%', mt: 2, display: 'flex', justifyContent: 'flex-start' }}>
            <MDButton
                sx={{ fontFamily: 'JalnanGothic' }}
                variant="contained"
                color="white"
                onClick={handleBack}
                startIcon={<KeyboardArrowLeftIcon />}
            >
                돌아가기
            </MDButton>
        </MDBox>

      <MDBox
        sx={{
          p: 3,
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          height: isSmallScreen ? '40vh' :'60vh',
          mb: isSmallScreen ? 10:10
        }}
      >
        <Card
          sx={{
            width: '100%',
            maxWidth: '500px',
            p: 4,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}
        >
          <MDTypography
              variant="h5" gutterBottom>
            비밀번호 확인
          </MDTypography>

          {member.providerType === 'LOCAL' ? (
            <form onSubmit={handleSubmit} style={{ width: '100%' }}>
              <TextField
                label="비밀번호"
                type="password"
                value={password}
                onChange={handlePasswordChange}
                required
                fullWidth
                sx={{ mb: 3 }}
                inputProps={{ style: { fontSize: '1rem' } }}
              />
              <MDButton
                type="submit"
                variant="contained"
                color="primary"
                fullWidth
                sx={{
                    fontFamily: 'JalnanGothic',
                    fontSize: isSmallScreen ? '0.8rem':'1.1rem',
                    minWidth: 'auto',
                    width: '100%',
                    padding: isSmallScreen
                        ? '1px 2px'
                        : '4px 8px',
                    lineHeight:  isSmallScreen ? 3:3,  // 줄 간격을 줄여 높이를 감소시킴
                    minHeight: 'auto' // 기본적으로 적용되는 높이를 없앰
                }}
              >
                비밀번호 확인
              </MDButton>
              {error && <Typography color="error" sx={{ fontSize: isSmallScreen ? '0.8rem':'1rem' }}>{error}</Typography>}
            </form>
          ) : (
            <MDButton
              variant="contained"
              color="primary"
              fullWidth
              sx={{ mb: 2, fontSize: '1.2rem', color: '#fff' }}
              onClick={handleProviderLogin}
            >
              {member.providerType}로 인증
            </MDButton>
          )}
        </Card>
      </MDBox>
    </DashboardLayout>
  );
}

export default CheckPw;

