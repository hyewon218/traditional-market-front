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
import DashboardLayout from '../../examples/LayoutContainers/DashboardLayout';

// Data
import { postCheckAdminPw, putMemberRole, deleteMember } from "../../api/adminApi";

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

function MyInfo() {
  const { state } = useLocation();
  const member = state; // 전달된 member 데이터를 사용

  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [memberToDelete, setMemberToDelete] = useState(null);
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [role, setRole] = useState(member.role); // 선택된 권한을 관리하기 위한 state
  const [isAdmin, setIsAdmin] = useState(member.role === 'ADMIN'); // ADMIN 권한 여부 확인

  const navigate = useNavigate();

  const handleDeleteWithPassword = (memberNo) => {
    setMemberToDelete(memberNo);
    setShowPasswordModal(true);
  };

  const deleteMemberByNo = async (memberNo) => {
    try {
      if (password.trim() === "") {
        setErrorMessage("비밀번호를 입력하세요.");
        return;
      }

      console.log("삭제하려는 회원의 memberNo : ", memberNo);

      // 비밀번호 검증 요청
      const formData = new FormData();
      formData.append('password', password);

      const verifyResponse = await postCheckAdminPw(formData);

      if (verifyResponse) {
        if (window.confirm("정말 이 회원을 삭제하시겠습니까?")) {
          await deleteMember(memberNo);
          alert("회원 삭제 성공!");
          navigate('/member-list');
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

  const handleBack = () => {
    navigate('/member-list');
  };

  // 권한 변경 함수
  const handleRoleChange = (e) => {
    setRole(e.target.value);
  };

  // 권한 업데이트 함수
  const handleUpdateRole = async () => {
    if (isAdmin) {
      alert("ADMIN 권한은 권한 수정이 불가능합니다.");
      return;
    }

    if (!window.confirm('권한을 수정하시겠습니까?')) {
        return;
    }

    try {
      const formData = { role }; // 변경된 권한을 전송할 데이터로 사용
      await putMemberRole(member.memberNo, formData);
      alert("권한이 성공적으로 수정되었습니다.");

    } catch (error) {
      console.error('권한 수정 실패:', error);
      alert("권한 수정에 실패했습니다.");
    }
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
      <Box sx={{ p: 3 }}>
        <Box sx={{ mt: 2, display: 'flex', gap: 1 }}>
            <Button variant="contained" color="error" onClick={handleBack} startIcon={<KeyboardArrowLeftIcon />}>
              돌아가기
            </Button>
        </Box>
        {/* 회원 기본 정보 */}
        <Card sx={{ p: 3, mb: 2 }}>
          <Grid container spacing={2}>
            <Grid item xs={12} md={8}>
              {/* 회원 기본 정보 텍스트 */}
              <Typography variant="h4" component="div" paragraph>
                회원 ID : {member.memberId}
              </Typography>
              <Typography variant="body1" paragraph>
                이메일 : {member.memberEmail}
              </Typography>
              <Typography variant="body1" paragraph>
                닉네임 : {member.nicknameWithRandomTag}
              </Typography>
              <Typography variant="body1" paragraph>
                권한 :
                <select
                  value={role}
                  onChange={handleRoleChange}
                  disabled={isAdmin} // ADMIN 권한일 경우 드롭다운 비활성화
                >
                  <option value="MEMBER">MEMBER</option>
                  <option value="SELLER">SELLER</option>
                  <option value="WARNINGMEMBER">WARNINGMEMBER</option>
                  <option value="MANAGER">MANAGER</option>
                </select>
                <Button
                  variant="contained"
                  color="error"
                  onClick={handleUpdateRole}
                  disabled={isAdmin} // ADMIN 권한일 경우 수정 버튼 비활성화
                >
                  권한 수정
                </Button>
                {isAdmin && (
                  <Typography style={styles.message}>
                    ADMIN 권한은 권한 수정이 불가능합니다.
                  </Typography>
                )}
              </Typography>
              <Typography variant="body1" paragraph>
                가입일 : {formatCreateTime(member.createTime)}
              </Typography>
              <Box sx={{ mt: 2, display: 'flex', gap: 1 }}>
                <Button
                  variant="contained"
                  color="error"
                  onClick={() => handleDeleteWithPassword(member.memberNo)}
                  disabled={isAdmin} // ADMIN 권한일 경우 회원 삭제 버튼 비활성화
                >
                  회원 삭제
                </Button>
              </Box>
            </Grid>
          </Grid>
        </Card>

        {/* 비밀번호 확인 모달 */}
        {showPasswordModal && (
          <div style={styles.modal}>
            <div style={styles.modalContent}>
              <Typography variant="h6" gutterBottom>
                {member.memberId} 삭제
              </Typography>
              <form onSubmit={(e) => {
                e.preventDefault();
                deleteMemberByNo(memberToDelete);
              }}>
                <label htmlFor="adminPw">관리자 비밀번호 입력</label>
                <input
                  type="password"
                  id="adminPw"
                  name="adminPw"
                  value={password}
                  placeholder="비밀번호를 입력하세요"
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
                {errorMessage && <Typography style={styles.errorMessage}>{errorMessage}</Typography>}
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 2 }}>
                  <Button variant="contained" color="error" type="submit">
                    확인
                  </Button>
                  <Button variant="contained" color="error" onClick={handleCloseModal}>
                    취소
                  </Button>
                </Box>
              </form>
            </div>
          </div>
        )}
      </Box>
    </DashboardLayout>
  );
}

export default MyInfo;
