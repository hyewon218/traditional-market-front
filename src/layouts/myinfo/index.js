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
import {useEffect, useState} from 'react';
import {useNavigate} from 'react-router-dom';

// @mui material components
import Grid from '@mui/material/Grid';
import {useMediaQuery} from "@mui/material";
import MDBox from "../../components/MD/MDBox";
import MDButton from "../../components/MD/MDButton";

// Material Dashboard 2 React components
import DashboardLayout from '../../examples/LayoutContainers/DashboardLayout';

// Data
import {getMember, getVerifiedCookie} from "../../api/memberApi";

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
    const isSmallScreen = useMediaQuery('(max-width:600px)');

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
//  const handleViewMyInfo = (member) => {
//    const cookies = document.cookie.split('; ').reduce((acc, cookie) => {
//      const [name, value] = cookie.split('=');
//      acc[name] = value;
//      return acc;
//    }, {});
//
//    if (cookies['isPasswordVerified']) {
//      console.log('isPasswordVerified 쿠키 : ', cookies['isPasswordVerified']);
//      console.log('member : ', member);
//      // 쿠키가 존재하고, 랜덤 태그가 일치하면 회원 정보 페이지로 이동
//      navigate(`/myinfo-detail`, {state: member});
//    } else {
//      // 쿠키가 없거나 일치하지 않으면 비밀번호 확인 페이지로 이동
//      console.log('isPasswordVerified 쿠키가 존재하지 않습니다.');
//      navigate(`/check-pw`, {state: member});
//    }
//  };

  // 내 정보 보기
  const handleViewMyInfo = async (member) => {
    const response = await getVerifiedCookie();
    console.log('isPasswordVerified 쿠키 보유 여부 : ', response);

    if (response) {
      console.log('member : ', member);
      // 쿠키가 존재하고, 랜덤 태그가 일치하면 회원 정보 페이지로 이동
      navigate(`/myinfo-detail`, { state: member });
    } else {
      // 쿠키가 없거나 일치하지 않으면 인증 방법에 따라 리디렉션
      if (member.providerType === "LOCAL") {
        console.log('isPasswordVerified 쿠키가 존재하지 않습니다. 비밀번호 확인 페이지로 이동합니다.');
        navigate(`/check-pw`, { state: member });
      } else {
        console.log('isPasswordVerified 쿠키가 존재하지 않습니다. 이메일 확인 페이지로 이동합니다.');
        navigate(`/check-email`, { state: member });
      }
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
          <MDBox
              mb={isSmallScreen ? 10 : 10}
              sx={{
                  p: 3,
                  height: isSmallScreen ? '60vh' :'80vh',
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center'
              }}
          >
              <Grid container spacing={isSmallScreen ? 5 : 2} justifyContent="center" alignItems="center">
                  <Grid item xs={6} sm={3} lg={3} sx={{ display: 'flex', justifyContent: 'center' }}>
                      <MDButton
                          fullWidth
                          variant="gradient"
                          color="info"
                          onClick={() => handleViewMyInfo(member)}
                          sx={{
                              fontFamily: 'JalnanGothic',
                              fontSize: isSmallScreen ? '0.9rem' : '1.5rem',
                              minWidth: 'auto',
                              width: isSmallScreen ? '100px' : '200px', // 가로 너비를 줄임
                              padding: isSmallScreen ? '1px 2px' : '4px 8px',
                              lineHeight: isSmallScreen ? 5 : 6, // 줄 간격을 줄여 높이를 감소시킴
                              minHeight: 'auto' // 기본적으로 적용되는 높이를 없앰
                          }}
                      >
                          내정보
                      </MDButton>
                  </Grid>
                  <Grid item xs={6} sm={3} lg={3} sx={{ display: 'flex', justifyContent: 'center' }}>
                      <MDButton
                          fullWidth
                          variant="gradient"
                          color="info"
                          onClick={handleViewOrderList}
                          sx={{
                              fontFamily: 'JalnanGothic',
                              fontSize: isSmallScreen ? '0.9rem' : '1.5rem',
                              minWidth: 'auto',
                              width: isSmallScreen ? '100px' : '200px', // 가로 너비를 줄임
                              padding: isSmallScreen ? '1px 2px' : '4px 8px',
                              lineHeight: isSmallScreen ? 5 : 6, // 줄 간격을 줄여 높이를 감소시킴
                              minHeight: 'auto' // 기본적으로 적용되는 높이를 없앰
                          }}
                      >
                          구매목록
                      </MDButton>
                  </Grid>
                  <Grid item xs={6} sm={3} lg={3} sx={{ display: 'flex', justifyContent: 'center' }}>
                      <MDButton
                          fullWidth
                          variant="gradient"
                          color="info"
                          onClick={handleViewMyInquiries}
                          sx={{
                              fontFamily: 'JalnanGothic',
                              fontSize: isSmallScreen ? '0.9rem' : '1.5rem',
                              minWidth: 'auto',
                              width: isSmallScreen ? '100px' : '200px', // 가로 너비를 줄임
                              padding: isSmallScreen ? '1px 2px' : '4px 8px',
                              lineHeight: isSmallScreen ? 5 : 6, // 줄 간격을 줄여 높이를 감소시킴
                              minHeight: 'auto' // 기본적으로 적용되는 높이를 없앰
                          }}
                      >
                          문의내역
                      </MDButton>
                  </Grid>
                  <Grid item xs={6} sm={3} lg={3} sx={{ display: 'flex', justifyContent: 'center' }}>
                      <MDButton
                          fullWidth
                          variant="gradient"
                          color="info"
                          onClick={handleViewDeliveryManage}
                          sx={{
                              fontFamily: 'JalnanGothic',
                              fontSize: isSmallScreen ? '0.9rem' : '1.5rem',
                              minWidth: 'auto',
                              width: isSmallScreen ? '100px' : '200px', // 가로 너비를 줄임
                              padding: isSmallScreen ? '1px 2px' : '4px 8px',
                              lineHeight: isSmallScreen ? 5 : 6, // 줄 간격을 줄여 높이를 감소시킴
                              minHeight: 'auto' // 기본적으로 적용되는 높이를 없앰
                          }}
                      >
                          배송지 관리
                      </MDButton>
                  </Grid>
              </Grid>
          </MDBox>
      </DashboardLayout>
    );
}

export default MyInfo;
