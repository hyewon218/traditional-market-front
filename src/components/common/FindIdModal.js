import React, { useState, useEffect } from 'react';
import Modal from '@mui/material/Modal';
import Box from '@mui/material/Box';
import MDTypography from '../MD/MDTypography';
import MDInput from '../MD/MDInput';
import MDButton from '../MD/MDButton';
import MDBox from '../MD/MDBox';
import { CopyToClipboard } from 'react-copy-to-clipboard';
import useMediaQuery from '@mui/material/useMediaQuery';

// Data
import { postSendFindIdCode, postVerifyCode, postFindId } from "../../api/memberApi";

const modalStyle = (isSmallScreen) =>  ({
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: isSmallScreen ? '90%' : 400,  // 600px 이하일 경우 너비 90%
    bgcolor: 'background.paper',
    boxShadow: 24,
    p: 4,
    borderRadius: '8px', // 모서리 둥글게
});

function FindIdModal({ open, handleClose, children }) {
    const [memberEmail, setMemberEmail] = useState('');
    const [findIdCode, setFindIdCode] = useState('');
    const [isVerified, setIsVerified] = useState(false);
    const [verificationError, setVerificationError] = useState('');
    const [verificationSuccess, setVerificationSuccess] = useState('');
    const [isSending, setIsSending] = useState(false); // 인증번호 전송 중 상태
    const [openIdModal, setOpenIdModal] = useState(false); // 아이디 찾기 모달 열기 상태
    const [foundId, setFoundId] = useState(''); // 찾은 아이디 저장 상태
    const [copyMessage, setCopyMessage] = useState(''); // 복사 확인 메시지 상태
    const [timer, setTimer] = useState(0); // 타이머 초기값을 0으로 설정

    // 화면 너비가 600px 이하인 경우 감지
    const isSmallScreen = useMediaQuery('(max-width:600px)');

    // 인증번호 일치 여부 실시간 검증
    useEffect(() => {
        const verifyCode = async () => {
            if (findIdCode.trim() === "") {
                setIsVerified(false);
                setVerificationError('');
                setVerificationSuccess('');
                return;
            }

            try {
                const formData = new FormData();
                formData.append('memberEmail', memberEmail);
                formData.append('code', findIdCode);

                const response = await postVerifyCode(formData);

                if (response) {
                    console.log('인증번호 : ', response);
                    setIsVerified(true);
                    setVerificationSuccess('인증번호가 일치합니다.');
                    setVerificationError('');
                }

            } catch (error) {
                setIsVerified(false);
                setVerificationError(error.response.data);
                setVerificationSuccess('');
            }
        };

        verifyCode();
    }, [findIdCode, memberEmail]);

    // 인증번호 전송
//    const handleSendEmailCode = async () => {
//        setIsSending(true);
//        setVerificationError('');
//        setVerificationSuccess('인증번호 전송중...');
//
//        try {
//            const formData = new FormData();
//            formData.append('memberEmail', memberEmail);
//
//            const emailCode = await postSendFindIdCode(formData);
//            console.log('인증번호 : ', emailCode);
//            setVerificationSuccess('인증번호가 이메일로 전송되었습니다.');
//            setVerificationError('');
//
//        } catch (error) {
//            setVerificationError(error.response.data);
//            setVerificationSuccess('');
//        } finally {
//            setIsSending(false);
//        }
//    };

    const handleSendEmailCode = async () => {
        setIsSending(true);
        setVerificationError('');
        setVerificationSuccess('인증번호 전송중...');

        try {
            const formData = new FormData();
            formData.append('memberEmail', memberEmail);

            const emailCode = await postSendFindIdCode(formData);
            console.log('인증번호 : ', emailCode);
            setVerificationSuccess('인증번호가 이메일로 전송되었습니다.');
            setVerificationError('');
            setTimer(180); // 인증번호 전송 성공 시 타이머 시작 (3분)
        } catch (error) {
            setVerificationError(error.response.data);
            setVerificationSuccess('');
        } finally {
            setIsSending(false);
        }
    };

    // 타이머 효과
    useEffect(() => {
        let interval = null;
        if (timer > 0) {
            interval = setInterval(() => {
                setTimer(timer => timer - 1);
            }, 1000);
        } else {
            clearInterval(interval);
        }
        return () => clearInterval(interval);
    }, [timer]);

    // 모달창이 닫힐 때 타이머 초기화
    useEffect(() => {
        if (!open) {
            setTimer(0);
            setMemberEmail('');
            setFindIdCode('');
            setIsVerified(false);
            setVerificationError('');
            setVerificationSuccess('');
        }
    }, [open]);

    // 아이디 찾기 버튼 누를 시
    const handleFindId = async () => {
        try {
            const formData = new FormData();
            formData.append('memberEmail', memberEmail);
            formData.append('code', findIdCode);
            console.log('memberEmail : ', memberEmail);
            console.log('code : ', findIdCode);

            const response = await postFindId(formData);
            console.log(response);
            setFoundId(response);
            setOpenIdModal(true); // 아이디 찾기 모달 열기
            handleClose(); // 기존 모달 닫기

            // 모든 상태 초기화
            setMemberEmail('');
            setFindIdCode('');
            setIsVerified(false);
            setVerificationError('');
            setVerificationSuccess('');

        } catch (error) {
            alert('아이디 찾기에 실패했습니다.');
        }
    };

    return (
        <>
            <Modal
                open={open}
                onClose={handleClose}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
            >
                <Box sx={modalStyle(isSmallScreen)}>
                    <MDTypography variant="h5" mb={2}>아이디 찾기</MDTypography>
                    <MDInput
                        type="text"
                        label="이메일 입력"
                        fullWidth
                        value={memberEmail}
                        onChange={(e) => setMemberEmail(e.target.value)}
                    />
                    <MDBox mt={2}>
                        <MDInput
                            type="text"
                            label="인증번호 입력"
                            fullWidth
                            value={findIdCode}
                            onChange={(e) => setFindIdCode(e.target.value)}
                        />
                        {timer > 0 && (
                            <MDTypography variant="body2" color="text" ml={2}>
                                {`${Math.floor(timer / 60)}:${(timer % 60).toString().padStart(2, '0')}`}
                            </MDTypography>
                        )}
                        <MDBox mt={1}>
                            {verificationError && (
                                <MDTypography variant="caption" color="error" mt={1}>
                                    {verificationError}
                                </MDTypography>
                            )}
                            {verificationSuccess && (
                                <MDTypography variant="caption" color="success" mt={1}>
                                    {verificationSuccess}
                                </MDTypography>
                            )}
                        </MDBox>
                        <MDButton
                            variant="gradient"
                            color="info"
                            sx={{ width: '50%', mt: 2 }}  // 버튼 너비를 50%로 변경
                            onClick={handleSendEmailCode}
                            disabled={isSending} // 전송 중일 때 버튼 비활성화
                        >
                            인증번호 전송
                        </MDButton>
                    </MDBox>
                    <MDBox mt={2}>
                        <MDButton onClick={handleFindId} variant="gradient" color="info" fullWidth disabled={!isVerified}>
                            아이디 찾기
                        </MDButton>
                    </MDBox>
                </Box>
            </Modal>

            {/* 아이디 찾기 결과 모달 */}
            <Modal
                open={openIdModal}
                onClose={() => setOpenIdModal(false)}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
            >
                <Box sx={modalStyle(isSmallScreen)}>
                    <MDBox mb={2}>
                        <MDBox display="flex" alignItems="center">
                            <MDTypography variant="body1" mr={3}>
                                {foundId ? `찾은 아이디 : ${foundId}` : '아이디를 찾을 수 없습니다.'}
                            </MDTypography>
                            <CopyToClipboard text={foundId} onCopy={() => setCopyMessage('복사했습니다')}>
                                <MDButton variant="outlined" color="info" sx={{ width: '100px' }}>
                                    복사
                                </MDButton>
                            </CopyToClipboard>
                        </MDBox>
                        {copyMessage && (
                            <MDTypography variant="caption" color="success" mt={1}>
                                {copyMessage}
                            </MDTypography>
                        )}
                    </MDBox>
                    <MDButton
                        variant="gradient"
                        color="info"
                        onClick={() => setOpenIdModal(false)}
                    >
                        닫기
                    </MDButton>
                </Box>
            </Modal>
        </>
    );
}

export default FindIdModal;
