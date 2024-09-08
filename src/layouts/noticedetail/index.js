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


// 공지사항 내용 html 태그 삭제
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
import useCustomLogin from "../../hooks/useCustomLogin";

// Data
import { deleteNotice } from "../../api/noticeApi";
import { postCheckAdminPw } from "../../api/adminApi";

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
  divider: {
    border: '1px solid #ccc',
    margin: '20px 0', // 위아래 간격 조정
  },
};

function NoticeDetail() {
  const {state} = useLocation();
  const notice = state; // 전달된 notice 데이터를 사용

  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [noticeToDelete, setNoticeToDelete] = useState(null);
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const {isAdmin} = useCustomLogin();

  const navigate = useNavigate();

  const handleModifyNotice = (notice) => {
    console.log('handleModifyNotice');
    navigate('/modify-notice', { state: notice });
  };

  const handleDeleteWithPassword = (noticeNo) => {
    setNoticeToDelete(noticeNo);
    setShowPasswordModal(true);
  };

  const deleteNoticeByNo = async (noticeNo) => {
    try {
      if (password.trim() === "") {
        setErrorMessage("비밀번호를 입력하세요.");
        return;
      }

      console.log("입력된 비밀번호:", password); // 비밀번호를 콘솔에 로그로 찍음

      // FormData 객체를 생성
      const formData = new FormData();
      formData.append('password', password);

      const verifyResponse = await postCheckAdminPw(formData);
      console.log("verifyResponse :", verifyResponse);

      if (verifyResponse) {
        if (window.confirm("정말 해당 공지사항을 삭제하시겠습니까?")) {
          const response = await deleteNotice(noticeNo);
          alert("공지사항 삭제 성공!");
          navigate('/notice-manage');
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

  // 뒤로 가기
  const handleBack = () => {
    window.history.back();
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
        {/* 공지사항 기본 정보 */}
        <Card sx={{ p: 3, mb: 2 }}>
          <Grid container spacing={2}>
            <Grid item xs={12} md={8}>
              {/* 공지사항 기본 정보 텍스트 */}
              <Typography variant="h3" component="div" paragraph>
                {notice.noticeTitle}
              </Typography>
              <Typography variant="body1" paragraph>
                <strong>작성 시간</strong> : {formatCreateTime(notice.createTime)}
              </Typography>
              <Typography variant="body1" paragraph>
                <strong>공지사항 작성자</strong> : {notice.noticeWriter}
              </Typography>

              {/* 구분선 추가 */}
              <hr style={styles.divider} />

              <Typography variant="body1" paragraph>
                <strong>공지사항 내용</strong> :
              </Typography>
              <Box
                sx={{
                  '& .ql-editor': {
                    minHeight: '200px',
                    whiteSpace: 'pre-wrap', // Preserve whitespace
                  },
                }}
                dangerouslySetInnerHTML={{ __html: notice.noticeContent }}
              />
              {/* <Typography variant="body1" paragraph>
                {notice.noticeContent}
              </Typography> */}

              {/* 관리자만 수정 및 삭제 버튼 보이기 */}
              {isAdmin && (
                <Box sx={{ mt: 2, display: 'flex', gap: 1 }}>
                  <Button
                    variant="contained"
                    color="error"
                    onClick={() => handleModifyNotice(notice)}
                  >
                    공지사항 수정
                  </Button>
                  <Button
                    variant="contained"
                    color="error"
                    onClick={() => handleDeleteWithPassword(notice.noticeNo)}
                  >
                    공지사항 삭제
                  </Button>
                </Box>
              )}
            </Grid>
            <Grid item xs={12} md={4}>
              {/* 이미지 갤러리 */}
              <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: 2 }}>
                {notice.imageList.map((img, index) => (
                  <img
                    key={index}
                    src={img.imageUrl}
                    alt={`notice-image-${index}`}
                    width="70%" // 카드의 오른쪽에 이미지가 위치하도록 폭을 조정
                    style={{ marginBottom: '10px' }}
                  />
                ))}
              </Box>
            </Grid>
          </Grid>
        </Card>

        {/* 비밀번호 확인 모달 */}
        {showPasswordModal && (
          <div style={styles.modal}>
            <div style={styles.modalContent}>
              <Typography variant="h6" gutterBottom>
                {notice.noticeTitle} 삭제
              </Typography>
              <form onSubmit={(e) => {
                e.preventDefault();
                deleteNoticeByNo(noticeToDelete);
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

export default NoticeDetail;
