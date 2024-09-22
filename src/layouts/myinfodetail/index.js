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

import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import {
    Card,
    Grid,
    Modal,
    TextField,
    useMediaQuery
} from '@mui/material';
import KeyboardArrowLeftIcon from '@mui/icons-material/KeyboardArrowLeft';
import DashboardLayout from '../../examples/LayoutContainers/DashboardLayout';
import ProfanityFilterMDInput from '../../components/common/ProfanityFilter'; // 비속어 필터
import { containsProfanity } from '../../components/common/profanityUtils'; // 분리한 비속어 필터 내 containsProfanity 함수 import

// Data
import { getMember, putNickname, putPassword, postSendEmailCode, postVerifyCode, deleteMember, getRemainingTime } from '../../api/memberApi';
import { postCheckAdminPw } from '../../api/adminApi';
import MDTypography from "../../components/MD/MDTypography";
import MDButton from "../../components/MD/MDButton";
import MDBox from "../../components/MD/MDBox";

function MyInfoDetail() {
    const { state } = useLocation();
    const [member, setMember] = useState(state);
    const [showNicknameModal, setShowNicknameModal] = useState(false);
    const [nickname, setNickname] = useState(member.memberNickname);
    const [showPasswordModal, setShowPasswordModal] = useState(false);
    const [currentPw, setCurrentPw] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const [showChangePwdModal, setShowChangePwdModal] = useState(false);
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [verificationCode, setVerificationCode] = useState('');
    const [isVerified, setIsVerified] = useState(false);
    const [verificationError, setVerificationError] = useState('');
    const navigate = useNavigate();
    const isSmallScreen = useMediaQuery('(max-width:600px)');

    // 회원 정보 불러오기
    useEffect(() => {
        const fetchMember = async () => {
            const updatedMember = await getMember();
            setMember(updatedMember);
        };
        fetchMember();
    }, []);

    // 인증번호 실시간 검증
    useEffect(() => {
        const verifyCode = async () => {
            if (verificationCode.trim() === "") {
                setIsVerified(false);
                setVerificationError('');
                return;
            }

            try {
                const formData = new FormData();
                formData.append('memberEmail', member.memberEmail);
                formData.append('code', verificationCode);
                const response = await postVerifyCode(formData);

                if (response) {
                    setIsVerified(true);
                    setVerificationError('');
                } else {
                    setIsVerified(false);
                    setVerificationError('인증번호가 일치하지 않습니다.');
                }
            } catch (error) {
                setIsVerified(false);
                setVerificationError('인증번호 확인에 실패했습니다.');
            }
        };

        verifyCode();
    }, [verificationCode, member.memberEmail]);

    // 뒤로 가기(내 정보 홈으로 가기)
    const handleBack = () => {
        navigate('/myinfo');
    };

    // 닉네임 변경 모달 열기
    const handleOpenNicknameModal = () => {
        setNickname(member.memberNickname);
        setShowNicknameModal(true);
    };

    // 닉네임 변경
    const handleNicknameChange = async () => {
        if (nickname.trim() === "") {
            alert("변경할 닉네임을 입력하세요");
            return;
        }

        if (/\s/.test(nickname)) {
            alert('닉네임에 공백을 포함할 수 없습니다.');
            return;
        }

        if (containsProfanity(nickname)) {
           alert('닉네임에 비속어가 포함되어 있습니다. 다른 닉네임을 입력해 주세요.');
           return;
        }

        const formData = new FormData();
        formData.append('memberNickname', nickname);

        try {
            await putNickname(formData);
            alert('닉네임이 성공적으로 변경되었습니다.');
            setShowNicknameModal(false);
            const updatedMember = await getMember();
            setMember(updatedMember);

        } catch (error) {
            const remainingTime = await getRemainingTime(member.memberNo);
            alert(remainingTime);
        }
    };

    // 비밀번호 변경 모달 열기
    const handleOpenPasswordModal = () => {
        setCurrentPw('');
        setErrorMessage('');
        setShowPasswordModal(true);
    };

    // 비밀번호 확인
    const handleCheckPassword = async () => {
        if (currentPw.trim() === "") {
            alert("현재 비밀번호를 입력하세요");
            return;
        }

        const formData = new FormData();
        formData.append('password', currentPw);

        try {
            const response = await postCheckAdminPw(formData);
            if (response) {
                setShowPasswordModal(false);
                alert('비밀번호 일치');
                setShowChangePwdModal(true);
                setNewPassword('');
                setConfirmPassword('');

            } else {
                setErrorMessage('현재 비밀번호가 일치하지 않습니다.');
            }
        } catch (error) {
            setErrorMessage(error.response.data);
        }
    };

    // 비밀번호 변경
    const handleChangePassword = async () => {
        if (newPassword.trim() === "" || confirmPassword.trim() === "") {
            alert("비밀번호를 입력하세요.");
            return;
        }

        if (newPassword !== confirmPassword) {
            alert('새 비밀번호가 일치하지 않습니다.');
            return;
        }

        const formData = new FormData();
        formData.append('changePw', newPassword);
        formData.append('confirmPw', confirmPassword);

        try {
            await putPassword(formData);
            alert('비밀번호가 성공적으로 변경되었습니다.');
            setShowChangePwdModal(false);
        } catch (error) {
            console.log(error.response.data);
            alert('비밀번호 변경에 실패했습니다.');
        }
    };

    // 탈퇴 모달 열기
    const handleOpenDeleteModal = () => {
        setShowDeleteModal(true);
        setVerificationCode('');
        setIsVerified(false);
    };

    // 탈퇴 전 인증
    const handleSendEmailCode = async () => {
        try {
            const formData = new FormData();
            formData.append('memberEmail', member.memberEmail);

            const emailCode = await postSendEmailCode(formData);
            console.log('이메일 인증번호 : ', emailCode);
            alert('인증번호가 이메일로 전송되었습니다.');
        } catch (error) {
            alert('인증번호 전송에 실패했습니다.');
        }
    };

    // 탈퇴
    const handleDeleteMember = async () => {
        if (!isVerified) {
            alert('인증이 완료되지 않았습니다. 인증 후 다시 시도하세요.');
            return;
        }

        if (window.confirm('탈퇴 후 복구는 불가능합니다. 정말 탈퇴하시겠습니까?')) {
            try {
                await deleteMember();
                alert('회원 탈퇴가 성공적으로 완료되었습니다. 탈퇴 후 회원 정보는 30일간 보관되며 이후 자동 폐기됩니다.');
                setShowDeleteModal(false);
                navigate('/market');
            } catch (error) {
                alert('회원 탈퇴에 실패했습니다.');
            }
        }
    };

    // 닉네임 변경까지 남은 시간 구하는 메서드
      const handleGetRemainingTime = async (memberNo) => {
        try {
          const remainingTime = await getRemainingTime(memberNo);
          console.log('memberNo : ', memberNo);
          alert(remainingTime);

        } catch (error) {
          console.error('남은 시간 조회 실패:', error);
          alert('남은 시간 조회에 실패했습니다.');
        }
      };

    // 날짜 형식 변환
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

    // 제재 해제일 구하는 메서드 (+30일)
    const calculateExpirationDate = (startDate) => {
      if (!startDate) return null;
      const start = new Date(startDate);
      const expiration = new Date(start.setDate(start.getDate() + 30));
      return formatCreateTime(expiration);
    };

    return (
        <DashboardLayout>
            <Grid container>
                <Grid item xs={4} lg={4}>
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
                <Grid item xs={8} lg={8}>
                    <MDBox sx={{
                        pr: isSmallScreen ? 2 : 3,
                        width: '100%',
                        mt: isSmallScreen? 0 : 4,
                        display: 'flex',
                        justifyContent: 'right',
                    }}>
                        <MDButton
                            sx={{
                                fontFamily: 'JalnanGothic',
                                fontSize: isSmallScreen ? '0.7rem':'0.9rem',
                                minWidth: 'auto',
                                width: isSmallScreen ? '100px' : 'auto', // 가로 너비를 줄임
                                padding: isSmallScreen
                                    ? '1px 2px'
                                    : '4px 8px',
                                lineHeight:  isSmallScreen ? 2.5:2,  // 줄 간격을 줄여 높이를 감소시킴
                                minHeight: 'auto' // 기본적으로 적용되는 높이를 없앰
                        }}
                            variant="contained"
                            color="white"
                            onClick={handleBack}
                            startIcon={<KeyboardArrowLeftIcon/>}
                        >
                            돌아가기
                        </MDButton>
                    </MDBox>
                </Grid>
            </Grid>

            <MDBox pt={2} pb={20}>
                <MDBox pt={isSmallScreen ? 1 : 1} pb={1} px={isSmallScreen ? 1 : 3}>
                    <Card>
                        <MDBox pt={isSmallScreen ? 2 : 3} pb={isSmallScreen ? 2 : 3} px={isSmallScreen ? 2 : 2}>
                            <Grid container spacing={2}>
                                 <Grid item xs={12} md={8}>
                                    <MDTypography
                                        sx={{ fontSize: isSmallScreen ? '0.8rem':'1rem' }}
                                        variant="body1" paragraph>
                                       회원 ID : {member.memberId}
                                    </MDTypography>
                                    <MDTypography
                                        sx={{ fontSize: isSmallScreen ? '0.8rem':'1rem' }}
                                        variant="body1" paragraph>
                                       이메일 : {member.memberEmail}
                                    </MDTypography>
                                    <MDTypography
                                        sx={{ fontSize: isSmallScreen ? '0.8rem':'1rem' }}
                                        variant="body1" paragraph>
                                        닉네임 :{' '}
                                        {member.memberNickname
                                            ? member.nicknameWithRandomTag
                                            : '설정된 닉네임이 없습니다'}
                                        <MDButton
                                            variant="contained"
                                            color="light"
                                            onClick={() => handleGetRemainingTime(member.memberNo)}
                                            sx={{
                                                fontFamily: 'JalnanGothic',
                                                fontSize: isSmallScreen ? '0.5rem':'0.9rem',
                                                minWidth: 'auto',
                                                width: isSmallScreen ? '110px' : 'auto', // 가로 너비를 줄임
                                                padding: isSmallScreen
                                                    ? '1px 2px'
                                                    : '4px 8px',
                                                lineHeight:  isSmallScreen ? 2:2,  // 줄 간격을 줄여 높이를 감소시킴
                                                minHeight: 'auto', // 기본적으로 적용되는 높이를 없앰
                                                ml : 1
                                            }}
                                        >
                                            닉네임 변경까지 남은 시간
                                        </MDButton>
                                        <br/>
                                        <span
                                            style={{
                                                fontFamily: 'JalnanGothic',
                                                fontSize: isSmallScreen ? '0.6rem':'0.9rem',
                                                color: 'red',
                                            }}
                                        >*닉네임은 한달에 한번 변경 가능합니다.
                                </span>
                                    </MDTypography>
                                    {member.warningStartDate && (
                                        <MDTypography variant="body1" paragraph>
                                           제재일 :{' '}
                                            {formatCreateTime(
                                                    member.warningStartDate) +
                                                ' (제재 해제일 : ' +
                                                calculateExpirationDate(
                                                    member.warningStartDate
                                                ) +
                                                ')'}
                                            <span
                                                style={{
                                                    fontFamily: 'JalnanGothic',
                                                    fontSize: isSmallScreen ? '0.6rem':'0.9rem',
                                                    display: 'block',
                                                    color: 'red',
                                                    fontWeight: 'bold',
                                                    marginTop: '10px',
                                                }}
                                            >*운영정책 위반으로 댓글 및 일대일 채팅상담이 제한됩니다.
                                    </span>
                                        </MDTypography>
                                    )}
                                    <MDTypography
                                        sx={{ fontSize: isSmallScreen ? '0.8rem':'1rem' }}
                                        variant="body1" paragraph>
                                        가입일 : {formatCreateTime(member.createTime)}
                                    </MDTypography>
                                    <Grid container spacing={isSmallScreen ? 0 : 0}>
                                        <Grid item xs={isSmallScreen ? 3.2 : 1.4}>
                                            <MDButton
                                                variant="contained"
                                                color="success"
                                                onClick={handleOpenNicknameModal}
                                                sx={{
                                                    fontFamily: 'JalnanGothic',
                                                    fontSize: isSmallScreen ? '0.7rem':'0.9rem',
                                                    minWidth: 'auto',
                                                    width: isSmallScreen ? '70px' : 'auto', // 가로 너비를 줄임
                                                    padding: isSmallScreen
                                                        ? '1px 2px'
                                                        : '4px 8px',
                                                    lineHeight:  isSmallScreen ? 2:2,  // 줄 간격을 줄여 높이를 감소시킴
                                                    minHeight: 'auto' // 기본적으로 적용되는 높이를 없앰
                                                }}
                                            >
                                                닉네임 변경
                                            </MDButton>
                                        </Grid>
                                        {member.providerType === 'LOCAL'
                                            && (
                                                <Grid item xs={isSmallScreen ? 4.1 : 1.6}>
                                                    <MDButton
                                                        variant="contained"
                                                        color="success"
                                                        onClick={handleOpenPasswordModal}
                                                        sx={{
                                                            fontFamily: 'JalnanGothic',
                                                            fontSize: isSmallScreen ? '0.7rem':'0.9rem',
                                                            minWidth: 'auto',
                                                            width: isSmallScreen ? '90px' : 'auto', // 가로 너비를 줄임
                                                            padding: isSmallScreen
                                                                ? '1px 2px'
                                                                : '4px 8px',
                                                            lineHeight:  isSmallScreen ? 2:2,  // 줄 간격을 줄여 높이를 감소시킴
                                                            minHeight: 'auto' // 기본적으로 적용되는 높이를 없앰
                                                        }}
                                                    >
                                                        비밀번호 변경
                                                    </MDButton>
                                                </Grid>
                                            )}
                                        <Grid item xs={isSmallScreen ? 3 : 1.5}>
                                            <MDButton
                                                variant="contained"
                                                color="error"
                                                onClick={handleOpenDeleteModal}
                                                sx={{
                                                    fontFamily: 'JalnanGothic',
                                                    fontSize: isSmallScreen ? '0.7rem':'0.9rem',
                                                    minWidth: 'auto',
                                                    width: isSmallScreen ? '70px' : 'auto', // 가로 너비를 줄임
                                                    padding: isSmallScreen
                                                        ? '1px 2px'
                                                        : '4px 8px',
                                                    lineHeight:  isSmallScreen ? 2:2,  // 줄 간격을 줄여 높이를 감소시킴
                                                    minHeight: 'auto' // 기본적으로 적용되는 높이를 없앰
                                                }}
                                            >
                                                회원 탈퇴
                                            </MDButton>
                                        </Grid>
                                    </Grid>
                                </Grid>
                            </Grid>
                        </MDBox>
                    </Card>
                </MDBox>

                {/* 닉네임 변경 모달 */}
                <Modal
                    open={showNicknameModal}
                    onClose={() => setShowNicknameModal(false)}
                >
                    <MDBox
                        sx={{
                            position: 'absolute',
                            top: '50%',
                            left: '50%',
                            transform: 'translate(-50%, -50%)',
                            width: isSmallScreen? 300 : 400,
                            bgcolor: 'background.paper',
                            borderRadius: 1,
                            boxShadow: 24,
                            p: 4,
                        }}
                    >
                        <MDTypography
                            variant="h6" component="h2">
                            닉네임 변경
                        </MDTypography>
                        <ProfanityFilterMDInput
                            fullWidth
                            margin="normal"
                            label="새 닉네임"
                            value={nickname}
                            onChange={(e) => setNickname(e.target.value)}
                            required
                        />
                        <MDBox
                            sx={{
                                mt: 2,
                                display: 'flex',
                                justifyContent: 'flex-end',
                                gap: 1,
                            }}
                        >
                            <MDButton
                                sx={{
                                    fontFamily: 'JalnanGothic',
                                    fontSize: isSmallScreen ? '0.7rem':'0.9rem',
                                    minWidth: 'auto',
                                    width: isSmallScreen ? '60px' : 'auto', // 가로 너비를 줄임
                                    padding: isSmallScreen
                                        ? '1px 2px'
                                        : '4px 8px',
                                    lineHeight:  isSmallScreen ? 3:2,  // 줄 간격을 줄여 높이를 감소시킴
                                    minHeight: 'auto' // 기본적으로 적용되는 높이를 없앰
                                }}
                                variant="contained"
                                color="info"
                                onClick={handleNicknameChange}
                            >
                                변경
                            </MDButton>
                            <MDButton
                                sx={{
                                    fontFamily: 'JalnanGothic',
                                    fontSize: isSmallScreen ? '0.7rem':'0.9rem',
                                    minWidth: 'auto',
                                    width: isSmallScreen ? '60px' : 'auto', // 가로 너비를 줄임
                                    padding: isSmallScreen
                                        ? '1px 2px'
                                        : '4px 8px',
                                    lineHeight:  isSmallScreen ? 3:2,  // 줄 간격을 줄여 높이를 감소시킴
                                    minHeight: 'auto' // 기본적으로 적용되는 높이를 없앰
                                }}
                                variant="contained"
                                color="info"
                                onClick={() => setShowNicknameModal(false)}
                            >
                                취소
                            </MDButton>
                        </MDBox>
                    </MDBox>
                </Modal>

                {/* 비밀번호 확인 모달 */}
                <Modal
                    open={showPasswordModal}
                    onClose={() => setShowPasswordModal(false)}
                >
                    <MDBox
                        sx={{
                            position: 'absolute',
                            top: '50%',
                            left: '50%',
                            transform: 'translate(-50%, -50%)',
                            width: isSmallScreen? 300 : 400,
                            bgcolor: 'background.paper',
                            borderRadius: 1,
                            boxShadow: 24,
                            p: 4,
                        }}
                    >
                        <MDTypography variant="h6" component="h2">
                            비밀번호 확인
                        </MDTypography>
                        <TextField
                            fullWidth
                            margin="normal"
                            label="현재 비밀번호"
                            type="password"
                            value={currentPw}
                            onChange={(e) => setCurrentPw(e.target.value)}
                            required
                        />
                        {errorMessage && (
                            <MDTypography color="error" variant="body2">
                                {errorMessage}
                            </MDTypography>
                        )}
                        <MDBox
                            sx={{
                                mt: 2,
                                display: 'flex',
                                justifyContent: 'flex-end',
                                gap: 1,
                            }}
                        >
                            <MDButton
                                sx={{
                                    fontFamily: 'JalnanGothic',
                                    fontSize: isSmallScreen ? '0.7rem':'0.9rem',
                                    minWidth: 'auto',
                                    width: isSmallScreen ? '60px' : 'auto', // 가로 너비를 줄임
                                    padding: isSmallScreen
                                        ? '1px 2px'
                                        : '4px 8px',
                                    lineHeight:  isSmallScreen ? 3:2,  // 줄 간격을 줄여 높이를 감소시킴
                                    minHeight: 'auto' // 기본적으로 적용되는 높이를 없앰
                                }}
                                variant="contained"
                                color="info"
                                onClick={handleCheckPassword}
                            >
                                확인
                            </MDButton>
                            <MDButton
                                sx={{
                                    fontFamily: 'JalnanGothic',
                                    fontSize: isSmallScreen ? '0.7rem':'0.9rem',
                                    minWidth: 'auto',
                                    width: isSmallScreen ? '60px' : 'auto', // 가로 너비를 줄임
                                    padding: isSmallScreen
                                        ? '1px 2px'
                                        : '4px 8px',
                                    lineHeight:  isSmallScreen ? 3:2,  // 줄 간격을 줄여 높이를 감소시킴
                                    minHeight: 'auto' // 기본적으로 적용되는 높이를 없앰
                                }}
                                variant="contained"
                                color="info"
                                onClick={() => setShowPasswordModal(false)}
                            >
                                취소
                            </MDButton>
                        </MDBox>
                    </MDBox>
                </Modal>

                {/* 비밀번호 변경 모달 */}
                <Modal
                    open={showChangePwdModal}
                    onClose={() => setShowChangePwdModal(false)}
                >
                    <MDBox
                        sx={{
                            position: 'absolute',
                            top: '50%',
                            left: '50%',
                            transform: 'translate(-50%, -50%)',
                            width: isSmallScreen? 300 : 400,
                            bgcolor: 'background.paper',
                            borderRadius: 1,
                            boxShadow: 24,
                            p: 4,
                        }}
                    >
                        <MDTypography
                            variant="h6" component="h2">
                            비밀번호 변경
                        </MDTypography>
                        <TextField
                            fullWidth
                            margin="normal"
                            label="새 비밀번호"
                            type="password"
                            value={newPassword}
                            onChange={(e) => setNewPassword(e.target.value)}
                            required
                        />
                        <TextField
                            fullWidth
                            margin="normal"
                            label="새 비밀번호 확인"
                            type="password"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            required
                        />
                        <MDBox
                            sx={{
                                mt: 2,
                                display: 'flex',
                                justifyContent: 'flex-end',
                                gap: 1,
                            }}
                        >
                            <MDButton
                                sx={{
                                    fontFamily: 'JalnanGothic',
                                    fontSize: isSmallScreen ? '0.7rem':'0.9rem',
                                    minWidth: 'auto',
                                    width: isSmallScreen ? '60px' : 'auto', // 가로 너비를 줄임
                                    padding: isSmallScreen
                                        ? '1px 2px'
                                        : '4px 8px',
                                    lineHeight:  isSmallScreen ? 3:2,  // 줄 간격을 줄여 높이를 감소시킴
                                    minHeight: 'auto' // 기본적으로 적용되는 높이를 없앰
                                }}
                                variant="contained"
                                color="info"
                                onClick={handleChangePassword}
                            >
                                변경
                            </MDButton>
                            <MDButton
                                sx={{
                                    fontFamily: 'JalnanGothic',
                                    fontSize: isSmallScreen ? '0.7rem':'0.9rem',
                                    minWidth: 'auto',
                                    width: isSmallScreen ? '60px' : 'auto', // 가로 너비를 줄임
                                    padding: isSmallScreen
                                        ? '1px 2px'
                                        : '4px 8px',
                                    lineHeight:  isSmallScreen ? 3:2,  // 줄 간격을 줄여 높이를 감소시킴
                                    minHeight: 'auto' // 기본적으로 적용되는 높이를 없앰
                                }}
                                variant="contained"
                                color="info"
                                onClick={() => setShowChangePwdModal(false)}
                            >
                                취소
                            </MDButton>
                        </MDBox>
                    </MDBox>
                </Modal>

                {/* 회원 탈퇴 모달 */}
                <Modal
                    open={showDeleteModal}
                    onClose={() => setShowDeleteModal(false)}
                >
                    <MDBox
                        sx={{
                            position: 'absolute',
                            top: '50%',
                            left: '50%',
                            transform: 'translate(-50%, -50%)',
                            width: isSmallScreen? 300 : 400,
                            bgcolor: 'background.paper',
                            borderRadius: 1,
                            boxShadow: 24,
                            p: 4,
                        }}
                    >
                        <MDTypography variant="h6" component="h2">
                            회원 탈퇴
                        </MDTypography>
                        <MDTypography variant="body1">
                            탈퇴를 위해 인증번호를 입력하세요.
                        </MDTypography>
                        <MDBox
                            sx={{
                                mt: 2,
                            }}
                        >
                            <TextField
                                fullWidth
                                margin="normal"
                                label="인증번호 입력"
                                value={verificationCode}
                                onChange={(e) => setVerificationCode(e.target.value)}
                                error={!!verificationError}
                                helperText={verificationError}
                            />
                            <MDButton
                                sx={{
                                    fontFamily: 'JalnanGothic',
                                    fontSize: isSmallScreen ? '0.7rem':'0.9rem',
                                    minWidth: 'auto',
                                    width: isSmallScreen ? '120px' : 'auto', // 가로 너비를 줄임
                                    padding: isSmallScreen
                                        ? '1px 2px'
                                        : '4px 8px',
                                    lineHeight:  isSmallScreen ? 3:2,  // 줄 간격을 줄여 높이를 감소시킴
                                    minHeight: 'auto' // 기본적으로 적용되는 높이를 없앰
                                }}
                                variant="contained"
                                color="dark"
                                onClick={handleSendEmailCode}
                            >
                                인증번호 전송
                            </MDButton>
                        </MDBox>
                        <MDBox
                            sx={{
                                mt: 2,
                                display: 'flex',
                                justifyContent: 'flex-end',
                                gap: 1,
                            }}
                        >
                            <MDButton
                                sx={{
                                    fontFamily: 'JalnanGothic',
                                    fontSize: isSmallScreen ? '0.7rem':'0.9rem',
                                    minWidth: 'auto',
                                    width: isSmallScreen ? '60px' : 'auto', // 가로 너비를 줄임
                                    padding: isSmallScreen
                                        ? '1px 2px'
                                        : '4px 8px',
                                    lineHeight:  isSmallScreen ? 3:2,  // 줄 간격을 줄여 높이를 감소시킴
                                    minHeight: 'auto' // 기본적으로 적용되는 높이를 없앰
                                }}
                                variant="contained"
                                color="error"
                                onClick={handleDeleteMember}
                                disabled={!isVerified}
                            >
                                탈퇴
                            </MDButton>
                            <MDButton
                                sx={{
                                    fontFamily: 'JalnanGothic',
                                    fontSize: isSmallScreen ? '0.7rem':'0.9rem',
                                    minWidth: 'auto',
                                    width: isSmallScreen ? '60px' : 'auto', // 가로 너비를 줄임
                                    padding: isSmallScreen
                                        ? '1px 2px'
                                        : '4px 8px',
                                    lineHeight:  isSmallScreen ? 3:2,  // 줄 간격을 줄여 높이를 감소시킴
                                    minHeight: 'auto' // 기본적으로 적용되는 높이를 없앰
                                }}
                                variant="contained"
                                color="info"
                                onClick={() => setShowDeleteModal(false)}
                            >
                                취소
                            </MDButton>
                        </MDBox>
                    </MDBox>
                </Modal>
            </MDBox>
        </DashboardLayout>
    );
}

export default MyInfoDetail;
