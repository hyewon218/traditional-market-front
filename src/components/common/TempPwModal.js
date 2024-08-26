import React, { useState, useEffect } from 'react';
import Modal from '@mui/material/Modal';
import Box from '@mui/material/Box';
import MDTypography from '../MD/MDTypography';
import MDInput from '../MD/MDInput';
import MDButton from '../MD/MDButton';
import MDBox from '../MD/MDBox';
import { CopyToClipboard } from 'react-copy-to-clipboard';

// Data
import { postSendTempPw } from "../../api/memberApi";

const modalStyle = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 400,
    bgcolor: 'background.paper',
    boxShadow: 24,
    p: 4,
};

function TempPwModal({ open, handleClose, children }) {
    const [memberId, setMemberId] = useState('');
    const [memberEmail, setMemberEmail] = useState('');
    const [verificationError, setVerificationError] = useState('');
    const [verificationSuccess, setVerificationSuccess] = useState('');
    const [isSending, setIsSending] = useState(false); // 인증번호 전송 중 상태

    // 임시비밀번호 발급
    const handleSendTempPw = async () => {
        setIsSending(true);
        setVerificationError('');
        setVerificationSuccess('임시비밀번호 발급중...');

        try {
            const formData = new FormData();
            formData.append('memberId', memberId);
            formData.append('memberEmail', memberEmail);

            const tempPw = await postSendTempPw(formData);
            console.log('임시비밀번호 : ', tempPw);
            setVerificationSuccess('임시비밀번호가 이메일로 발급되었습니다.');
            setVerificationError('');

        } catch (error) {
            setVerificationError('임시비밀번호 발급에 실패했습니다.');
            setVerificationSuccess('');

        } finally {
            setIsSending(false);
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
                <Box sx={modalStyle}>
                    <MDTypography variant="h5" mb={2}>임시비밀번호 발급</MDTypography>
                    <MDInput
                        type="text"
                        label="아이디 입력"
                        fullWidth
                        value={memberId}
                        onChange={(e) => setMemberId(e.target.value)}
                    />
                    <MDBox mt={2}>
                        <MDInput
                            type="text"
                            label="이메일 입력"
                            fullWidth
                            value={memberEmail}
                            onChange={(e) => setMemberEmail(e.target.value)}
                        />
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
                            sx={{ width: '100%', mt: 2 }}  // 버튼 너비를 50%로 변경
                            onClick={handleSendTempPw}
                            disabled={isSending} // 전송 중일 때 버튼 비활성화
                        >
                            임시비밀번호 발급
                        </MDButton>
                    </MDBox>
                </Box>
            </Modal>
        </>
    );
}

export default TempPwModal;
