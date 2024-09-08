import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

// @mui material components
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import KeyboardArrowLeftIcon from '@mui/icons-material/KeyboardArrowLeft';

// Material Dashboard 2 React components
import DashboardLayout from '../../examples/LayoutContainers/DashboardLayout';

// API 호출 함수
import { postCheckPw } from '../../api/memberApi';

function CheckPw() {
  const { state } = useLocation();
  const member = state; // 전달된 member 데이터를 사용

  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

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
      <Box
        sx={{
          p: 3,
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          height: '80vh',
        }}
      >
        <Box
          sx={{
            width: '100%',
            maxWidth: '500px',
            boxShadow: 3,
            borderRadius: 2,
            p: 4,
            backgroundColor: '#fff',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}
        >
          <Box sx={{ width: '100%', mb: 2, display: 'flex', justifyContent: 'flex-start' }}>
            <Button
              variant="contained"
              color="error"
              onClick={handleBack}
              startIcon={<KeyboardArrowLeftIcon />}
            >
              돌아가기
            </Button>
          </Box>
          <Typography variant="h5" gutterBottom>
            비밀번호 확인
          </Typography>

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
              <Button
                type="submit"
                variant="contained"
                color="primary"
                fullWidth
                sx={{ mb: 2, fontSize: '1.2rem', color: '#fff' }}
              >
                비밀번호 확인
              </Button>
              {error && <Typography color="error" sx={{ fontSize: '1rem' }}>{error}</Typography>}
            </form>
          ) : (
            <Button
              variant="contained"
              color="primary"
              fullWidth
              sx={{ mb: 2, fontSize: '1.2rem', color: '#fff' }}
              onClick={handleProviderLogin}
            >
              {member.providerType}로 인증
            </Button>
          )}
        </Box>
      </Box>
    </DashboardLayout>
  );
}

export default CheckPw;

