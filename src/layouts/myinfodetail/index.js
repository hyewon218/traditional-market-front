import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Card, Typography, Button, Box, Grid, Modal, TextField } from '@mui/material';
import KeyboardArrowLeftIcon from '@mui/icons-material/KeyboardArrowLeft';
import DashboardLayout from '../../examples/LayoutContainers/DashboardLayout';
import ProfanityFilterMDInput from '../../components/common/ProfanityFilter'; // 비속어 필터
import { containsProfanity } from '../../components/common/profanityUtils'; // 분리한 비속어 필터 내 containsProfanity 함수 import

// Data
import { getMember, putNickname, putPassword, postSendEmailCode, postVerifyCode, deleteMember, getRemainingTime } from '../../api/memberApi';
import { postCheckAdminPw } from '../../api/adminApi';

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
            <Box sx={{ p: 3 }}>
                <Typography
                    fontWeight="bold"
                    sx={{ fontSize: '2.5rem' }}
                    variant="body2"
                >
                    내 정보
                </Typography>
                <Box
                    sx={{
                        mt: 2,
                        display: 'flex',
                        gap: 1,
                        '@media (max-width: 900px)': {
                            gap: '1.5cm',
                        },
                    }}
                >
                    <Button
                        variant="contained"
                        color="error"
                        onClick={handleBack}
                        startIcon={<KeyboardArrowLeftIcon />}
                    >
                        돌아가기
                    </Button>
                </Box>
                <Card
                    sx={{
                        p: 3,
                        mb: 2,
                        '@media (max-width: 900px)': {
                            p: '1.5cm',
                        },
                    }}
                >
                    <Grid container spacing={2}>
                        <Grid
                            item
                            xs={12}
                            md={8}
                            sx={{
                                '@media (max-width: 900px)': {
                                    gap: '1.5cm',
                                },
                            }}
                        >
                            <Typography variant="body1" paragraph>
                                <strong>회원 ID</strong> : {member.memberId}
                            </Typography>
                            <Typography variant="body1" paragraph>
                                <strong>이메일</strong> : {member.memberEmail}
                            </Typography>
                            <Typography variant="body1" paragraph>
                                <strong>닉네임</strong> :{' '}
                                {member.memberNickname
                                    ? member.nicknameWithRandomTag
                                    : '설정된 닉네임이 없습니다'}
                                <Button
                                    variant="contained"
                                    color="error"
                                    onClick={() => handleGetRemainingTime(member.memberNo)}
                                    sx={{ ml: 2 }}
                                >
                                    닉네임 변경까지 남은 시간
                                </Button>
                                <span
                                    style={{
                                        color: 'red',
                                        fontWeight: 'bold',
                                        marginLeft: '10px',
                                    }}
                                >
                                    *닉네임은 한달에 한번 변경 가능합니다.
                                </span>
                            </Typography>
                            {member.warningStartDate && (
                                <Typography variant="body1" paragraph>
                                    <strong>제재일</strong> :{' '}
                                    {formatCreateTime(member.warningStartDate) +
                                        ' (제재 해제일 : ' +
                                        calculateExpirationDate(
                                            member.warningStartDate
                                        ) +
                                        ')'}
                                    <span
                                        style={{
                                            display: 'block',
                                            color: 'red',
                                            fontWeight: 'bold',
                                            marginTop: '10px',
                                        }}
                                    >
                                        *운영정책 위반으로 댓글 및 일대일 채팅상담이
                                        제한됩니다.
                                    </span>
                                </Typography>
                            )}
                            <Typography variant="body1" paragraph>
                                <strong>가입일</strong> : {formatCreateTime(member.createTime)}
                            </Typography>
                            <Box
                                sx={{
                                    mt: 2,
                                    display: 'flex',
                                    gap: 1,
                                    '@media (max-width: 900px)': {
                                        gap: '1.5cm',
                                    },
                                }}
                            >
                                <Button
                                    variant="contained"
                                    color="error"
                                    onClick={handleOpenNicknameModal}
                                >
                                    닉네임 변경
                                </Button>
                                {member.providerType === 'LOCAL' && (
                                    <Button
                                        variant="contained"
                                        color="error"
                                        onClick={handleOpenPasswordModal}
                                    >
                                        비밀번호 변경
                                    </Button>
                                )}
                                <Button
                                    variant="contained"
                                    color="error"
                                    onClick={handleOpenDeleteModal}
                                >
                                    회원 탈퇴
                                </Button>
                            </Box>
                        </Grid>
                    </Grid>
                </Card>

                {/* 닉네임 변경 모달 */}
                <Modal
                    open={showNicknameModal}
                    onClose={() => setShowNicknameModal(false)}
                >
                    <Box
                        sx={{
                            position: 'absolute',
                            top: '50%',
                            left: '50%',
                            transform: 'translate(-50%, -50%)',
                            width: 400,
                            bgcolor: 'background.paper',
                            borderRadius: 1,
                            boxShadow: 24,
                            p: 4,
                            '@media (max-width: 900px)': {
                                p: '1.5cm',
                            },
                        }}
                    >
                        <Typography variant="h6" component="h2">
                            닉네임 변경
                        </Typography>
                        <ProfanityFilterMDInput
                            fullWidth
                            margin="normal"
                            label="새 닉네임"
                            value={nickname}
                            onChange={(e) => setNickname(e.target.value)}
                            required
                        />
                        <Box
                            sx={{
                                mt: 2,
                                display: 'flex',
                                justifyContent: 'flex-end',
                                gap: 1,
                                '@media (max-width: 900px)': {
                                    gap: '1.5cm',
                                },
                            }}
                        >
                            <Button
                                variant="contained"
                                color="error"
                                onClick={handleNicknameChange}
                            >
                                변경
                            </Button>
                            <Button
                                variant="contained"
                                color="error"
                                onClick={() => setShowNicknameModal(false)}
                            >
                                취소
                            </Button>
                        </Box>
                    </Box>
                </Modal>

                {/* 비밀번호 확인 모달 */}
                <Modal
                    open={showPasswordModal}
                    onClose={() => setShowPasswordModal(false)}
                >
                    <Box
                        sx={{
                            position: 'absolute',
                            top: '50%',
                            left: '50%',
                            transform: 'translate(-50%, -50%)',
                            width: 400,
                            bgcolor: 'background.paper',
                            borderRadius: 1,
                            boxShadow: 24,
                            p: 4,
                            '@media (max-width: 900px)': {
                                p: '1.5cm',
                            },
                        }}
                    >
                        <Typography variant="h6" component="h2">
                            비밀번호 확인
                        </Typography>
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
                            <Typography color="error" variant="body2">
                                {errorMessage}
                            </Typography>
                        )}
                        <Box
                            sx={{
                                mt: 2,
                                display: 'flex',
                                justifyContent: 'flex-end',
                                gap: 1,
                                '@media (max-width: 900px)': {
                                    gap: '1.5cm',
                                },
                            }}
                        >
                            <Button
                                variant="contained"
                                color="error"
                                onClick={handleCheckPassword}
                            >
                                확인
                            </Button>
                            <Button
                                variant="contained"
                                color="error"
                                onClick={() => setShowPasswordModal(false)}
                            >
                                취소
                            </Button>
                        </Box>
                    </Box>
                </Modal>

                {/* 비밀번호 변경 모달 */}
                <Modal
                    open={showChangePwdModal}
                    onClose={() => setShowChangePwdModal(false)}
                >
                    <Box
                        sx={{
                            position: 'absolute',
                            top: '50%',
                            left: '50%',
                            transform: 'translate(-50%, -50%)',
                            width: 400,
                            bgcolor: 'background.paper',
                            borderRadius: 1,
                            boxShadow: 24,
                            p: 4,
                            '@media (max-width: 900px)': {
                                p: '1.5cm',
                            },
                        }}
                    >
                        <Typography variant="h6" component="h2">
                            비밀번호 변경
                        </Typography>
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
                        <Box
                            sx={{
                                mt: 2,
                                display: 'flex',
                                justifyContent: 'flex-end',
                                gap: 1,
                                '@media (max-width: 900px)': {
                                    gap: '1.5cm',
                                },
                            }}
                        >
                            <Button
                                variant="contained"
                                color="error"
                                onClick={handleChangePassword}
                            >
                                변경
                            </Button>
                            <Button
                                variant="contained"
                                color="error"
                                onClick={() => setShowChangePwdModal(false)}
                            >
                                취소
                            </Button>
                        </Box>
                    </Box>
                </Modal>

                {/* 회원 탈퇴 모달 */}
                <Modal
                    open={showDeleteModal}
                    onClose={() => setShowDeleteModal(false)}
                >
                    <Box
                        sx={{
                            position: 'absolute',
                            top: '50%',
                            left: '50%',
                            transform: 'translate(-50%, -50%)',
                            width: 400,
                            bgcolor: 'background.paper',
                            borderRadius: 1,
                            boxShadow: 24,
                            p: 4,
                            '@media (max-width: 900px)': {
                                p: '1.5cm',
                            },
                        }}
                    >
                        <Typography variant="h6" component="h2">
                            회원 탈퇴
                        </Typography>
                        <Typography variant="body1">
                            탈퇴를 위해 인증번호를 입력하세요.
                        </Typography>
                        <Box
                            sx={{
                                mt: 2,
                                '@media (max-width: 900px)': {
                                    gap: '1.5cm',
                                },
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
                            <Button
                                variant="contained"
                                color="error"
                                onClick={handleSendEmailCode}
                            >
                                인증번호 전송
                            </Button>
                        </Box>
                        <Box
                            sx={{
                                mt: 2,
                                display: 'flex',
                                justifyContent: 'flex-end',
                                gap: 1,
                                '@media (max-width: 900px)': {
                                    gap: '1.5cm',
                                },
                            }}
                        >
                            <Button
                                variant="contained"
                                color="error"
                                onClick={handleDeleteMember}
                                disabled={!isVerified}
                            >
                                탈퇴
                            </Button>
                            <Button
                                variant="contained"
                                color="error"
                                onClick={() => setShowDeleteModal(false)}
                            >
                                취소
                            </Button>
                        </Box>
                    </Box>
                </Modal>
            </Box>
        </DashboardLayout>
    );
}

export default MyInfoDetail;
