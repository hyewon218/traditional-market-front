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

// 내 정보 페이지 버튼 4개(내정보, 구매목록, 문의내역, 배송지관리)
import * as React from 'react';
import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';

// @mui material components
import Card from '@mui/material/Card';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import IconButton from '@mui/material/IconButton';
import KeyboardArrowLeftIcon from '@mui/icons-material/KeyboardArrowLeft';
import KeyboardArrowRightIcon from '@mui/icons-material/KeyboardArrowRight';

// Material Dashboard 2 React components
import DashboardLayout from '../../examples/LayoutContainers/DashboardLayout';

// Data
import { postCheckAdminPw } from "../../api/adminApi";
import { getMember } from "../../api/memberApi";

const initState = {
    memberNo: 0,
    memberId: '',
    memberEmail: '',
    memberNickname: '',
    nicknameWithRandomTag: '',
    role: '',
    createTime: new Date().toISOString()
}

function MyInfo() {
    const [member, setMember] = useState({...initState})
    const navigate = useNavigate();

    useEffect(() => {
        handleGetMember();
    }, []);

    const handleGetMember = () => {
        console.log('handleGetMember');
        getMember().then(data => {
            console.log('회원 조회 성공!!!');
            console.log(data);
            setMember(data);
        }).catch(error => {
            console.error("회원 조회에 실패했습니다.", error);
        });
    };

  // 내 정보 보기
  const handleViewMyInfo = (member) => {
    const cookies = document.cookie.split('; ').reduce((acc, cookie) => {
      const [name, value] = cookie.split('=');
      acc[name] = value;
      return acc;
    }, {});

    if (cookies['isPasswordVerified']) {
      console.log('isPasswordVerified 쿠키 : ', cookies['isPasswordVerified']);
      console.log('member : ', member);
      // 쿠키가 존재하고, 랜덤 태그가 일치하면 회원 정보 페이지로 이동
      navigate(`/myinfo-detail`, {state: member});
    } else {
      // 쿠키가 없거나 일치하지 않으면 비밀번호 확인 페이지로 이동
      console.log('isPasswordVerified 쿠키가 존재하지 않습니다.');
      navigate(`/check-pw`, {state: member});
    }
  };

  // 내 문의사항 목록 보기
  const handleViewMyInquiries = () => {
    navigate('/myinquiries');
  }

  // 배송지 관리 보기
  const handleViewDeliveryManage = () => {
    navigate('/deliverymanage');
  }

  // complete 주문 목록 보기
  const handleViewOrderList = () => {
    navigate('/order-list');
  }

  // 뒤로 가기(내 정보 홈으로 가기)
  const handleBack = () => {
      navigate('/myinfo');
  };

  return (
      <DashboardLayout>
        <Box
          sx={{
            p: 3,
            height: '80vh',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center'
          }}
        >
          <Grid container spacing={2} justifyContent="center">
            <Grid item xs={6} sm={3}>
              <Button
                fullWidth
                variant="contained"
                color="primary"
                onClick={() => handleViewMyInfo(member)}
                sx={{ height: '250px', color: '#fff', fontSize: '2.7em' }} // 글자 크기를 키움
              >
                내정보
              </Button>
            </Grid>
            <Grid item xs={6} sm={3}>
              <Button
                fullWidth
                variant="contained"
                color="primary"
                onClick={handleViewOrderList}
                sx={{ height: '250px', color: '#fff', fontSize: '2.7em' }} // 글자 크기를 키움
              >
                구매목록
              </Button>
            </Grid>
            <Grid item xs={6} sm={3}>
              <Button
                fullWidth
                variant="contained"
                color="primary"
                onClick={handleViewMyInquiries}
                sx={{ height: '250px', color: '#fff', fontSize: '2.7em' }} // 글자 크기를 키움
              >
                문의내역
              </Button>
            </Grid>
            <Grid item xs={6} sm={3}>
              <Button
                fullWidth
                variant="contained"
                color="primary"
                onClick={handleViewDeliveryManage}
                sx={{ height: '250px', color: '#fff', fontSize: '2.7em' }} // 글자 크기를 키움
              >
                배송지 관리
              </Button>
            </Grid>
          </Grid>
        </Box>
      </DashboardLayout>
    );
}

export default MyInfo;
