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
import DashboardLayout from '../../../examples/LayoutContainers/DashboardLayout';

// Data
import { getWithdrawMemberOne, deleteWithdrawMember } from "../../../api/adminApi";

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
  message: {
    color: 'red',
    fontWeight: 'bold',
    marginTop: '10px',
  },
};

function WithdrawMemberDetail() {
  const { state } = useLocation();
  const withdrawMember = state; // 전달된 withdrawMember 데이터를 사용
//  const [member, setMember] = useState(null); // 회원 정보를 저장할 상태

  const navigate = useNavigate();

//  useEffect(() => {
//    const fetchMember = async () => {
//      try {
//        if (!memberNo) {
//          console.error("회원 번호가 제공되지 않았습니다.");
//          return;
//        }
//
//        const memberData = await getMemberOne(memberNo); // API 호출로 회원 정보 가져오기
//        if (memberData) {
//          console.log('memberData : ', memberData);
//          setMember(memberData); // 가져온 회원 정보를 상태에 저장
//          setRole(memberData.role); // role을 멤버 데이터에서 설정
//          setIsAdmin(memberData.role === 'ADMIN'); // isAdmin 상태를 설정
//        } else {
//          console.error("회원 정보를 가져오는 데 실패했습니다.");
//        }
//      } catch (error) {
//        console.error('회원 정보 조회 오류:', error);
//      }
//    };
//
//    fetchMember(); // API 호출
//  }, [memberNo]);

  const handleDeleteWithdrawMember = async (withdrawMemberNo) => {
      if (!window.confirm('탈퇴회원을 삭제하시겠습니까?')) return;

      try {
          await deleteWithdrawMember(withdrawMemberNo);
          navigate('/withdrawmember-manage');
      } catch (error) {
          alert('삭제 실패:', error);
      }
  };

  const handleBack = () => {
    navigate('/withdrawmember-manage');
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

  // 탈퇴회원 DB 삭제일 구하는 메서드 (+30일)
    const calculateDeleteDate = (startDate) => {
      if (!startDate) return null;
      const start = new Date(startDate);
      const expiration = new Date(start.setDate(start.getDate() + 30));
      return formatCreateTime(expiration);
    };

  return (
    <DashboardLayout>
      <Box sx={{ p: 3 }}>
        {withdrawMember ? (
          <>
            <Box sx={{ mt: 2, display: 'flex', gap: 1 }}>
              <Button variant="contained" color="error" onClick={handleBack} startIcon={<KeyboardArrowLeftIcon />}>
                돌아가기
              </Button>
            </Box>
            {/* 탈퇴회원 기본 정보 */}
            <Card sx={{ p: 3, mb: 2 }}>
              <Grid container spacing={2}>
                <Grid item xs={12} md={8}>
                  {/* 탈퇴회원 기본 정보 텍스트 */}
                  <Typography variant="h4" component="div" paragraph>
                      <strong>고유번호</strong> : {withdrawMember.withdrawMemberNo}
                    </Typography>
                  <Typography variant="body1"paragraph>
                    <strong>탈퇴회원 아이디</strong> : {withdrawMember.withdrawMemberId}
                  </Typography>
                  <Typography variant="body1" paragraph>
                    <strong>탈퇴회원 이메일</strong> : {withdrawMember.withdrawMemberEmail}
                  </Typography>
                  <Typography variant="body1" paragraph>
                      <strong>탈퇴회원 IP 주소</strong> : {withdrawMember.withdrawIpAddr}
                    </Typography>
                <Typography variant="body1" paragraph>
                    <strong>탈퇴일</strong> :
                    {formatCreateTime(withdrawMember.withdrawDate) + " (DB 삭제일 : " + calculateDeleteDate(withdrawMember.withdrawDate) + ")"}
                  </Typography>
                  <Box sx={{ mt: 2, display: 'flex', gap: 1 }}>
                    <Button
                      variant="contained"
                      color="error"
                      onClick={() => handleDeleteWithdrawMember(withdrawMember.withdrawMemberNo)}
                    >
                      탈퇴회원 삭제
                    </Button>
                  </Box>
                </Grid>
              </Grid>
            </Card>
          </>
        ) : (
          <Typography variant="h6" component="div" paragraph>
            탈퇴회원 정보를 불러오는 중입니다...
          </Typography>
        )}
      </Box>
    </DashboardLayout>
  );

}

export default WithdrawMemberDetail;
