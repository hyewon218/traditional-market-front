//import { useEffect, useState } from 'react';
//import * as React from 'react';
//import { useNavigate, Link } from 'react-router-dom';
//import PrivacyModal from '../../../components/common/PrivacyModal';
//
//import Card from '@mui/material/Card';
//import Grid from '@mui/material/Grid';
//import MDBox from '../../../components/MD/MDBox';
//import MDTypography from '../../../components/MD/MDTypography';
//import MDInput from '../../../components/MD/MDInput';
//import MDButton from '../../../components/MD/MDButton';
//import DashboardLayout from '../../../examples/LayoutContainers/DashboardLayout';
//import { postMember, getEmailCheck, getIdCheck, postSendEmailCode, postVerifyCode } from "../../../api/memberApi";
//
//import ProfanityFilterMDInput from '../../../components/common/ProfanityFilter'; // 비속어 필터
//import { containsProfanity } from '../../../components/common/profanityUtils'; // 분리한 비속어 필터 내 containsProfanity 함수 import
//
//function SignUp() {
//  const [memberId, setMemberId] = useState('');
//  const [memberPw, setMemberPw] = useState('');
//  const [confirmPw, setConfirmPw] = useState('');
//  const [memberNickname, setMemberNickname] = useState('');
//  const [emailId, setEmailId] = useState('');
//  const [domain, setDomain] = useState('');
//  const [customDomain, setCustomDomain] = useState('');
//  const [emailVerificationCode, setEmailVerificationCode] = useState('');
//  const [isVerified, setIsVerified] = useState(false);
//  const [verificationError, setVerificationError] = useState('');
//  const [verificationSuccess, setVerificationSuccess] = useState('');
//  const [isEmailChecked, setIsEmailChecked] = useState(false); // 이메일 중복 확인 상태
//  const [isIdChecked, setIsIdChecked] = useState(false); // 아이디 중복 확인 상태
//  const [isEmailCodeSent, setIsEmailCodeSent] = useState(false); // 이메일 인증번호 전송 상태
//  const [emailCodeSending, setEmailCodeSending] = useState(false); // 이메일 인증번호 전송 중 상태
//  const [idCheckSuccess, setIdCheckSuccess] = useState(''); // 아이디 유효성 검사 성공 메시지
//  const [idCheckError, setIdCheckError] = useState(''); // 아이디 유효성 검사 실패 메시지
//  const [pwError, setPwError] = useState(''); // 비밀번호 유효성 검사 메시지
//  const [confirmPwSuccess, setConfirmPwSuccess] = useState(''); // 비밀번호 일치 성공 메시지
//  const [confirmPwError, setConfirmPwError] = useState(''); // 비밀번호 일치 실패 메시지
//  const [emailCheckSuccess, setEmailCheckSuccess] = useState(''); // 이메일 중복 확인 성공 메시지
//  const [emailCheckError, setEmailCheckError] = useState(''); // 이메일 중복 실패 메시지
//
//  const [hasValidLength, setHasValidLength] = useState(false); // 비밀번호 길이 충족하는지 확인
//  const [hasLowercase, setHasLowercase] = useState(false); // 비밀번호에 영문소문자 포함하는지 확인
//  const [hasNumber, setHasNumber] = useState(false); // 비밀번호에 숫자 포함하는지 확인
//  const [hasSpecialChar, setHasSpecialChar] = useState(false); // 비밀번호에 특수문자 포함하는지 확인
//
//  const navigate = useNavigate();
//
//  const [isCustomDomain, setIsCustomDomain] = useState(true);
//  const memberEmail = `${emailId}@${domain || customDomain}`;
//
//  // 인증번호 일치 실시간 검증
//  useEffect(() => {
//    const verifyCode = async () => {
//      if (emailVerificationCode.trim() === "") {
//        setIsVerified(false);
//        setVerificationError('');
//        setVerificationSuccess('');
//        return;
//      }
//
//      try {
//        const formData = new FormData();
//        formData.append('memberEmail', memberEmail);
//        formData.append('code', emailVerificationCode);
//
//        const response = await postVerifyCode(formData);
//
//        if (response) {
//          setIsVerified(true);
//          setVerificationError('');
//          setVerificationSuccess('인증번호가 일치합니다.');
//        } else {
//          setIsVerified(false);
//          setVerificationError('인증번호가 일치하지 않습니다.');
//          setVerificationSuccess('');
//        }
//      } catch (error) {
//        setIsVerified(false);
//        setVerificationError('인증번호 확인에 실패했습니다.');
//        setVerificationSuccess('');
//      }
//    };
//
//    verifyCode();
//  }, [emailVerificationCode, memberEmail]);
//
//  // 비밀번호 유효성, 일치 실시간 검증
//   useEffect(() => {
//    if (memberPw) {
//      const lowerCasePattern = /[a-z]/;
//      const numberPattern = /\d/;
//      const specialCharPattern = /[\W_]/;
//
//      setHasLowercase(lowerCasePattern.test(memberPw));
//      setHasNumber(numberPattern.test(memberPw));
//      setHasSpecialChar(specialCharPattern.test(memberPw));
//      setHasValidLength(memberPw.length >= 8 && memberPw.length <= 16);
//
//      if (!isValidMemberPw(memberPw)) {
//        setPwError('비밀번호는 8~16자의 영문 소문자, 숫자, 특수문자를 포함해야 합니다.');
//      } else {
//        setPwError('');
//      }
//
//      if (memberPw !== confirmPw) {
//        setConfirmPwError('비밀번호와 비밀번호 확인이 일치하지 않습니다.');
//        setConfirmPwSuccess('');
//      } else {
//        setConfirmPwSuccess('비밀번호가 일치합니다.');
//        setConfirmPwError('');
//      }
//    } else {
//      // 비밀번호 필드가 비어있는 경우 모든 상태를 false로 설정
//      setHasLowercase(false);
//      setHasNumber(false);
//      setHasSpecialChar(false);
//      setHasValidLength(false);
//      setPwError('');
//      setConfirmPwError('');
//    }
//  }, [memberPw, confirmPw]);
//
//  const handleDomainChange = (event) => {
//    const selectedDomain = event.target.value;
//    setDomain(selectedDomain);
//    setIsCustomDomain(selectedDomain === 'custom');
//    if (selectedDomain !== 'custom') {
//      setCustomDomain('');
//    }
//  };
//
//  const handleCustomDomainChange = (event) => {
//    setCustomDomain(event.target.value);
//  };
//
//  // 회원가입 실행
//  const handleSignUp = async (event) => {
//    event.preventDefault();
//
//    if (!isEmailChecked || !isIdChecked || !isEmailCodeSent || !isVerified) {
//      alert('모든 확인 절차를 완료해야 합니다.');
//      return;
//    }
//
//    if (!isValidMemberPw(memberPw)) {
//      setPwError('비밀번호는 8~16자의 영문 소문자, 숫자, 특수문자를 포함해야 합니다.');
//      return;
//    }
//
//    if (!emailId || (!domain && !customDomain) || !emailVerificationCode || !memberId || !memberPw || !confirmPw || !memberNickname) {
//      alert('모든 필드를 입력하세요.');
//      return;
//    }
//
//    if (memberPw !== confirmPw) {
//      alert('비밀번호와 비밀번호 확인이 일치하지 않습니다.');
//      return;
//    }
//
//    if (!window.confirm('회원가입을 진행하시겠습니까?')) {
//      return;
//    }
//
//    const formData = new FormData();
//    formData.append('memberId', memberId);
//    formData.append('memberEmail', memberEmail);
//    formData.append('memberPw', memberPw);
//    formData.append('memberNickname', memberNickname);
//
//    try {
//      const response = await postMember(formData);
//      alert('회원가입 성공');
//      navigate('/authentication/sign-in');
//
//    } catch (error) {
//      const errors = error.response.data;
//      alert(errors);
//      setIdCheckError(errors.memberId || '');
//      setPwError(errors.memberPw || '');
//      setConfirmPwError(errors.confirmPw || '');
//    }
//  };
//
//  // 이메일 아이디 유효성 검사
//  const isValidEmailId = (email) => {
//    const emailRegex = /^[a-z0-9]{1,30}$/; // 예시: 1~30자의 영문 소문자, 숫자만 허용
//    return emailRegex.test(email);
//  };
//
//  // 아이디 유효성 검사
//  const isValidMemberId = (id) => {
//    const idRegex = /^[a-z0-9]{5,20}$/; // 예시: 5~20자의 영문 소문자, 숫자만 허용
//    return idRegex.test(id);
//  };
//
//  // 비밀번호 유효성 검사
//  const isValidMemberPw = (password) => {
//    const pwRegex = /^(?=.*[a-z])(?=.*\d)(?=.*[\W_])[a-z\d\W_]{8,16}$/;
//    return pwRegex.test(password);
//  };
//
//  // 이메일 중복 확인
//  const handleEmailCheck = async () => {
//    const memberEmail = `${emailId}@${isCustomDomain ? customDomain : domain}`;
//
//    if (!emailId || (!domain && !customDomain)) {
//      alert('이메일 아이디와 도메인을 모두 입력하세요.');
//      return;
//    }
//
//    if (!isValidEmailId(emailId)) {
//      setEmailCheckError('이메일 아이디는 최대 30자까지 영문 소문자, 숫자만 사용할 수 있습니다.');
//      return;
//    }
//
//    try {
//      const data = await getEmailCheck(memberEmail);
//
//      if (data.statusCode === 200) {
//        setIsEmailChecked(true);
////        alert('사용가능한 이메일입니다.');
//        setEmailCheckSuccess('사용가능한 이메일입니다.');
//        setEmailCheckError('');
//      }
//    } catch (error) {
//      alert(error.response.data);
//      setIsEmailChecked(false);
//      setEmailCheckError('이미 존재하는 이메일입니다.');
//      setEmailCheckSuccess('');
//    }
//  };
//
//  // 아이디 중복 확인
//  const handleIdCheck = async () => {
//    if (!memberId) {
//      alert('아이디를 입력하세요.');
//      return;
//    }
//
//    if (!isValidMemberId(memberId)) {
//      setIdCheckError('아이디는 5~20자의 영문 소문자, 숫자만 사용할 수 있습니다.');
//      return;
//    }
//
//    try {
//      const data = await getIdCheck(memberId);
//
//      if (data.statusCode === 200) {
//        setIsIdChecked(true);
//        setIdCheckSuccess('사용가능한 아이디입니다.');
//        setIdCheckError(''); // 에러 메시지 초기화
////        alert('사용가능한 아이디입니다.');
//      }
//    } catch (error) {
////      alert('이미 존재하는 아이디입니다');
//      setIdCheckError('이미 사용 중인 아이디입니다.');
//      setIdCheckSuccess('');
//      setIsIdChecked(false);
//    }
//  };
//
//  // 이메일 인증번호 전송
//  const handleSendEmailCode = async () => {
//    if (!isEmailChecked) {
//        alert('이메일 중복 확인을 먼저 해주세요');
//        return;
//    }
//
//    setEmailCodeSending(true); // 전송 중 상태 설정
//
//    try {
//      const formData = new FormData();
//      formData.append('memberEmail', memberEmail);
//
//      const emailCode = await postSendEmailCode(formData);
//      console.log('emailCode : ', emailCode);
//      setIsEmailCodeSent(true);
////      alert('인증번호가 이메일로 전송되었습니다.');
//      setVerificationSuccess('인증번호가 이메일로 전송되었습니다.');
//      setVerificationError('');
//
//    } catch (error) {
////      alert('인증번호 전송에 실패했습니다.');
//      setIsEmailCodeSent(false);
//      setVerificationSuccess('');
//      setVerificationError('인증번호 전송에 실패했습니다.');
//    } finally {
//      setEmailCodeSending(false); // 전송 중 상태 해제
//    }
//  };
//
//  return (
//    <DashboardLayout>
//      <div>
//        <PrivacyModal />
//      </div>
//      <MDBox mt={6} mb={3}>
//        <Grid container spacing={3} justifyContent="center">
//          <Grid item xs={12} lg={6}>
//            <Card>
//              <MDBox
//                variant="gradient"
//                bgColor="info"
//                borderRadius="lg"
//                coloredShadow="success"
//                mx={2}
//                mt={-3}
//                p={2}
//                mb={1}
//                textAlign="center"
//              >
//                <MDTypography variant="h4" fontWeight="medium" color="white" mt={1}>
//                  회원가입
//                </MDTypography>
//              </MDBox>
//
//              <MDBox pb={3} px={3}>
//                  {/* 아이디와 닉네임 입력 필드 사이에 경고 문구 추가 */}
//                  <MDBox mb={1} p={2} bgcolor="warning.main" borderRadius="5px">
//                    <MDTypography
//                      variant="body2"
//                      sx={{ color: '#f44336', fontSize: '1.0rem' }} // 빨간색으로 직접 색상 지정
//                    >
//                      ※ 아이디와 닉네임에 부적절한 단어를 사용하지 마세요. 적발 시 경고 없이 제재 받을 수 있습니다.
//                    </MDTypography>
//                  </MDBox>
//                <MDBox component="form" role="form">
//                  <MDBox mb={2}>
//                    <MDTypography variant="h6">이메일</MDTypography>
//                    <Grid container spacing={1} alignItems="center">
//                      <Grid item xs={12} sm={4}>
//                        <MDInput
//                          type="text"
//                          onChange={(v) => setEmailId(v.target.value)}
//                          placeholder="이메일 아이디 입력"
//                          fullWidth
//                        />
//                      </Grid>
//                      @
//                      <Grid item xs={12} sm={4}>
//                        <MDInput
//                          type="text"
//                          value={isCustomDomain ? customDomain : domain}
//                          onChange={handleCustomDomainChange}
//                          placeholder="도메인 입력"
//                          fullWidth
//                          disabled={!isCustomDomain}
//                        />
//                      </Grid>
//                      <Grid item xs={12} sm={4}>
//                        <select onChange={handleDomainChange} value={domain} fullWidth>
//                          <option value="custom">직접 입력</option>
//                          <option value="gmail.com">gmail.com</option>
//                          <option value="naver.com">naver.com</option>
//                          <option value="nate.com">nate.com</option>
//                          <option value="daum.net">daum.net</option>
//                        </select>
//                      </Grid>
//                      {emailCheckSuccess && (
//                        <MDTypography variant="body2" color="success">
//                          {emailCheckSuccess}
//                        </MDTypography>
//                      )}
//                      {emailCheckError && (
//                        <MDTypography variant="body2" color="error">
//                          {emailCheckError}
//                        </MDTypography>
//                      )}
//                      <Grid item xs={12} sm={12}>
//                        <MDButton
//                          onClick={handleEmailCheck}
//                          variant="gradient"
//                          color="info"
//                          size="small"
//                          fullWidth
//                          sx={{ width: '30%' }}
//                        >
//                          이메일 중복 확인
//                        </MDButton>
//                      </Grid>
//                    </Grid>
//                  </MDBox>
//
//                  <MDBox mb={2}>
//                    <MDTypography variant="h6">인증번호</MDTypography>
//                    <Grid container spacing={1} alignItems="center">
//                      <Grid item xs={12} sm={8}>
//                        <MDInput
//                          type="text"
//                          onChange={(v) => setEmailVerificationCode(v.target.value)}
//                          placeholder="인증번호 입력"
//                          error={!!verificationError}
//                          fullWidth
//                          sx={{ borderColor: isVerified ? 'success' : (verificationError ? 'error' : 'inherit') }}
//                        />
//                        {emailCodeSending && <MDTypography variant="body2" color="text.secondary">인증번호 전송중...</MDTypography>}
//                        {/* 인증번호 검증 메시지 색상 적용 */}
//                        {verificationSuccess && (
//                          <MDTypography variant="body2" color="success">
//                            {verificationSuccess}
//                          </MDTypography>
//                        )}
//                        {verificationError && (
//                          <MDTypography variant="body2" color="error">
//                            {verificationError}
//                          </MDTypography>
//                        )}
//                      </Grid>
//                      <Grid item xs={12} sm={4} container spacing={1} alignItems="center">
//                        <MDButton onClick={handleSendEmailCode} variant="gradient" color="info" size="small" fullWidth>
//                          인증번호 전송
//                        </MDButton>
//                      </Grid>
//                    </Grid>
//                  </MDBox>
//
//                  <MDBox mb={2}>
//                    <MDTypography variant="h6">아이디</MDTypography>
//                    <Grid container spacing={1} alignItems="center">
//                      <Grid item xs={12} sm={8}>
//                        <ProfanityFilterMDInput
//                          type="text"
//                          onChange={(v) => setMemberId(v.target.value)}
//                          placeholder="아이디 입력"
//                          fullWidth
//                          error={!!idCheckError}
//                        />
//                        {idCheckError && (
//                          <MDTypography variant="body2" color="error">
//                            {idCheckError}
//                          </MDTypography>
//                        )}
//                        {idCheckSuccess && (
//                          <MDTypography variant="body2" color="success">
//                            {idCheckSuccess}
//                          </MDTypography>
//                        )}
//                      </Grid>
//                      <Grid item xs={12} sm={4}>
//                        <MDButton onClick={handleIdCheck} variant="gradient" color="info" size="small" fullWidth>
//                          아이디 중복 확인
//                        </MDButton>
//                      </Grid>
//                    </Grid>
//                  </MDBox>
//
//                  <MDBox mb={2}>
//                    <MDTypography variant="h6">비밀번호</MDTypography>
//                    <MDInput
//                      type="password"
//                      onChange={(v) => setMemberPw(v.target.value)}
//                      placeholder="비밀번호는 8~16자의 영문 소문자, 숫자, 특수문자를 포함해야 합니다."
//                      fullWidth
//                      error={!!pwError}
//                    />
//                    {pwError && (
//                      <MDTypography variant="body2" color="error">
//                        {pwError}
//                      </MDTypography>
//                    )}
//                    {memberPw && (
//                      <MDBox mt={2}>
//                        <ul>
//                          <li>
//                            <MDTypography variant="caption" color={hasLowercase ? 'success' : 'error'}>
//                              소문자 포함
//                            </MDTypography>
//                          </li>
//                          <li>
//                            <MDTypography variant="caption" color={hasNumber ? 'success' : 'error'}>
//                              숫자 포함
//                            </MDTypography>
//                          </li>
//                          <li>
//                            <MDTypography variant="caption" color={hasSpecialChar ? 'success' : 'error'}>
//                              특수문자 포함
//                            </MDTypography>
//                          </li>
//                          <li>
//                            <MDTypography variant="caption" color={hasValidLength ? 'success' : 'error'}>
//                              8~16자 사이
//                            </MDTypography>
//                          </li>
//                        </ul>
//                      </MDBox>
//                    )}
//                  </MDBox>
//
//                  <MDBox mb={2}>
//                    <MDTypography variant="h6">비밀번호 확인</MDTypography>
//                    <MDInput
//                      type="password"
//                      onChange={(v) => setConfirmPw(v.target.value)}
//                      placeholder="비밀번호 확인"
//                      fullWidth
//                      error={!!confirmPwError}
//                    />
//                    {confirmPwError && (
//                      <MDTypography variant="body2" color="error">
//                        {confirmPwError}
//                      </MDTypography>
//                    )}
//                    {confirmPwSuccess && (
//                      <MDTypography variant="body2" color="success">
//                        {confirmPwSuccess}
//                      </MDTypography>
//                    )}
//                  </MDBox>
//
//                  <MDBox mb={2}>
//                    <MDTypography variant="h6">닉네임</MDTypography>
//                    <ProfanityFilterMDInput
//                      type="text"
//                      onChange={(v) => setMemberNickname(v.target.value)}
//                      placeholder="닉네임 입력"
//                      fullWidth
//                    />
//                  </MDBox>
//
//                  <MDBox mt={4} mb={1}>
//                    <MDButton onClick={handleSignUp} variant="gradient" color="info" fullWidth>
//                      회원가입
//                    </MDButton>
//                  </MDBox>
//
//                  <MDBox mt={3} mb={1} textAlign="center">
//                    <MDTypography variant="button" color="text">
//                      이미 계정이 있으신가요?{' '}
//                      <MDTypography
//                        component={Link}
//                        to="/authentication/sign-in"
//                        variant="button"
//                        color="info"
//                        fontWeight="medium"
//                        textGradient
//                      >
//                        로그인
//                      </MDTypography>
//                    </MDTypography>
//                  </MDBox>
//                </MDBox>
//              </MDBox>
//            </Card>
//          </Grid>
//        </Grid>
//      </MDBox>
//    </DashboardLayout>
//  );
//}
//
//export default SignUp;

// 반응형
import {useEffect, useState} from 'react';
import * as React from 'react';
import {useNavigate, Link} from 'react-router-dom';
import PrivacyModal from '../../../components/common/PrivacyModal';

import Card from '@mui/material/Card';
import Grid from '@mui/material/Grid';
import MDBox from '../../../components/MD/MDBox';
import MDTypography from '../../../components/MD/MDTypography';
import MDInput from '../../../components/MD/MDInput';
import MDButton from '../../../components/MD/MDButton';
import DashboardLayout
    from '../../../examples/LayoutContainers/DashboardLayout';
import {
    postMember,
    getEmailCheck,
    getIdCheck,
    postSendEmailCode,
    postVerifyCode
} from "../../../api/memberApi";

import ProfanityFilterMDInput from '../../../components/common/ProfanityFilter';
import {useMediaQuery} from "@mui/material"; // 비속어 필터

function SignUp() {
    const [memberId, setMemberId] = useState('');
    const [memberPw, setMemberPw] = useState('');
    const [confirmPw, setConfirmPw] = useState('');
    const [memberNickname, setMemberNickname] = useState('');
    const [emailId, setEmailId] = useState('');
    const [domain, setDomain] = useState('');
    const [customDomain, setCustomDomain] = useState('');
    const [emailVerificationCode, setEmailVerificationCode] = useState('');
    const [isVerified, setIsVerified] = useState(false);
    const [verificationError, setVerificationError] = useState('');
    const [verificationSuccess, setVerificationSuccess] = useState('');
    const [isEmailChecked, setIsEmailChecked] = useState(false); // 이메일 중복 확인 상태
    const [isIdChecked, setIsIdChecked] = useState(false); // 아이디 중복 확인 상태
    const [isEmailCodeSent, setIsEmailCodeSent] = useState(false); // 이메일 인증번호 전송 상태
    const [emailCodeSending, setEmailCodeSending] = useState(false); // 이메일 인증번호 전송 중 상태
    const [idCheckSuccess, setIdCheckSuccess] = useState(''); // 아이디 유효성 검사 성공 메시지
    const [idCheckError, setIdCheckError] = useState(''); // 아이디 유효성 검사 실패 메시지
    const [pwError, setPwError] = useState(''); // 비밀번호 유효성 검사 메시지
    const [confirmPwSuccess, setConfirmPwSuccess] = useState(''); // 비밀번호 일치 성공 메시지
    const [confirmPwError, setConfirmPwError] = useState(''); // 비밀번호 일치 실패 메시지
    const [emailCheckSuccess, setEmailCheckSuccess] = useState(''); // 이메일 중복 확인 성공 메시지
    const [emailCheckError, setEmailCheckError] = useState(''); // 이메일 중복 실패 메시지

    const [hasValidLength, setHasValidLength] = useState(false); // 비밀번호 길이 충족하는지 확인
    const [hasLowercase, setHasLowercase] = useState(false); // 비밀번호에 영문소문자 포함하는지 확인
    const [hasNumber, setHasNumber] = useState(false); // 비밀번호에 숫자 포함하는지 확인
    const [hasSpecialChar, setHasSpecialChar] = useState(false); // 비밀번호에 특수문자 포함하는지 확인

    const navigate = useNavigate();

    const [isCustomDomain, setIsCustomDomain] = useState(true);
    const memberEmail = `${emailId}@${domain || customDomain}`;

    const isSmallScreen = useMediaQuery('(max-width:600px)');

    // 인증번호 일치 실시간 검증
    useEffect(() => {
        const verifyCode = async () => {
            if (emailVerificationCode.trim() === "") {
                setIsVerified(false);
                setVerificationError('');
                setVerificationSuccess('');
                return;
            }

            try {
                const formData = new FormData();
                formData.append('memberEmail', memberEmail);
                formData.append('code', emailVerificationCode);

                const response = await postVerifyCode(formData);

                if (response) {
                    setIsVerified(true);
                    setVerificationError('');
                    setVerificationSuccess('인증번호가 일치합니다.');
                } else {
                    setIsVerified(false);
                    setVerificationError('인증번호가 일치하지 않습니다.');
                    setVerificationSuccess('');
                }
            } catch (error) {
                setIsVerified(false);
                setVerificationError('인증번호 확인에 실패했습니다.');
                setVerificationSuccess('');
            }
        };

        verifyCode();
    }, [emailVerificationCode, memberEmail]);

    // 비밀번호 유효성, 일치 실시간 검증
    useEffect(() => {
        if (memberPw) {
            const lowerCasePattern = /[a-z]/;
            const numberPattern = /\d/;
            const specialCharPattern = /[\W_]/;

            setHasLowercase(lowerCasePattern.test(memberPw));
            setHasNumber(numberPattern.test(memberPw));
            setHasSpecialChar(specialCharPattern.test(memberPw));
            setHasValidLength(memberPw.length >= 8 && memberPw.length <= 16);

            if (!isValidMemberPw(memberPw)) {
                setPwError('비밀번호는 8~16자의 영문 소문자, 숫자, 특수문자를 포함해야 합니다.');
            } else {
                setPwError('');
            }

            if (memberPw !== confirmPw) {
                setConfirmPwError('비밀번호와 비밀번호 확인이 일치하지 않습니다.');
                setConfirmPwSuccess('');
            } else {
                setConfirmPwSuccess('비밀번호가 일치합니다.');
                setConfirmPwError('');
            }
        } else {
            // 비밀번호 필드가 비어있는 경우 모든 상태를 false로 설정
            setHasLowercase(false);
            setHasNumber(false);
            setHasSpecialChar(false);
            setHasValidLength(false);
            setPwError('');
            setConfirmPwError('');
        }
    }, [memberPw, confirmPw]);

    const handleDomainChange = (event) => {
        const selectedDomain = event.target.value;
        setDomain(selectedDomain);
        setIsCustomDomain(selectedDomain === 'custom');
        if (selectedDomain !== 'custom') {
            setCustomDomain('');
        }
    };

    const handleCustomDomainChange = (event) => {
        setCustomDomain(event.target.value);
    };

    // 회원가입 실행
    const handleSignUp = async (event) => {
        event.preventDefault();

        if (!isEmailChecked || !isIdChecked || !isEmailCodeSent
            || !isVerified) {
            alert('모든 확인 절차를 완료해야 합니다.');
            return;
        }

        if (!isValidMemberPw(memberPw)) {
            setPwError('비밀번호는 8~16자의 영문 소문자, 숫자, 특수문자를 포함해야 합니다.');
            return;
        }

        if (!emailId || (!domain && !customDomain) || !emailVerificationCode
            || !memberId || !memberPw || !confirmPw || !memberNickname) {
            alert('모든 필드를 입력하세요.');
            return;
        }

        if (memberPw !== confirmPw) {
            alert('비밀번호와 비밀번호 확인이 일치하지 않습니다.');
            return;
        }

        if (!window.confirm('회원가입을 진행하시겠습니까?')) {
            return;
        }

        const formData = new FormData();
        formData.append('memberId', memberId);
        formData.append('memberEmail', memberEmail);
        formData.append('memberPw', memberPw);
        formData.append('memberNickname', memberNickname);

        try {
            const response = await postMember(formData);
            alert('회원가입 성공');
            navigate('/authentication/sign-in');

        } catch (error) {
            const errors = error.response;
            console.log(errors);
            alert(errors);
            setIdCheckError(errors.memberId || '');
            setPwError(errors.memberPw || '');
            setConfirmPwError(errors.confirmPw || '');
        }
    };

    // 이메일 아이디 유효성 검사
    const isValidEmailId = (email) => {
        const emailRegex = /^[a-z0-9]{1,30}$/; // 예시: 1~30자의 영문 소문자, 숫자만 허용
        return emailRegex.test(email);
    };

    // 아이디 유효성 검사
    const isValidMemberId = (id) => {
        const idRegex = /^[a-z0-9]{5,20}$/; // 예시: 5~20자의 영문 소문자, 숫자만 허용
        return idRegex.test(id);
    };

    // 비밀번호 유효성 검사
    const isValidMemberPw = (password) => {
        const pwRegex = /^(?=.*[a-z])(?=.*\d)(?=.*[\W_])[a-z\d\W_]{8,16}$/;
        return pwRegex.test(password);
    };

    // 이메일 중복 확인
    const handleEmailCheck = async () => {
        const memberEmail = `${emailId}@${isCustomDomain ? customDomain
            : domain}`;

        if (!emailId || (!domain && !customDomain)) {
            alert('이메일 아이디와 도메인을 모두 입력하세요.');
            return;
        }

        if (!isValidEmailId(emailId)) {
            setEmailCheckError('이메일 아이디는 최대 30자까지 영문 소문자, 숫자만 사용할 수 있습니다.');
            return;
        }

        try {
            const data = await getEmailCheck(memberEmail);

            if (data.statusCode === 200) {
                setIsEmailChecked(true);
//        alert('사용가능한 이메일입니다.');
                setEmailCheckSuccess('사용가능한 이메일입니다.');
                setEmailCheckError('');
            }
        } catch (error) {
            setIsEmailChecked(false);
            setEmailCheckError('이미 존재하는 이메일입니다.');
            setEmailCheckSuccess('');
        }
    };

    // 아이디 중복 확인
    const handleIdCheck = async () => {
        if (!memberId) {
            alert('아이디를 입력하세요.');
            return;
        }

        if (!isValidMemberId(memberId)) {
            setIdCheckError('아이디는 5~20자의 영문 소문자, 숫자만 사용할 수 있습니다.');
            return;
        }

        try {
            const data = await getIdCheck(memberId);

            if (data.statusCode === 200) {
                setIsIdChecked(true);
                setIdCheckSuccess('사용가능한 아이디입니다.');
                setIdCheckError(''); // 에러 메시지 초기화
//        alert('사용가능한 아이디입니다.');
            }
        } catch (error) {
//      alert('이미 존재하는 아이디입니다');
            setIdCheckError('이미 사용 중인 아이디입니다.');
            setIdCheckSuccess('');
            setIsIdChecked(false);
        }
    };

    // 이메일 인증번호 전송
    const handleSendEmailCode = async () => {
        if (!isEmailChecked) {
            alert('이메일 중복 확인을 먼저 해주세요');
            return;
        }

        setEmailCodeSending(true); // 전송 중 상태 설정

        try {
            const formData = new FormData();
            formData.append('memberEmail', memberEmail);

            const emailCode = await postSendEmailCode(formData);
            console.log('emailCode : ', emailCode);
            setIsEmailCodeSent(true);
//      alert('인증번호가 이메일로 전송되었습니다.');
            setVerificationSuccess('인증번호가 이메일로 전송되었습니다.');
            setVerificationError('');

        } catch (error) {
//      alert('인증번호 전송에 실패했습니다.');
            setIsEmailCodeSent(false);
            setVerificationSuccess('');
            setVerificationError('인증번호 전송에 실패했습니다.');
        } finally {
            setEmailCodeSending(false); // 전송 중 상태 해제
        }
    };

    return (
        <DashboardLayout>
            <div>
                <PrivacyModal/>
            </div>
            <MDBox
                sx={{
                    mt: {xs:1, sm:1, md:1, lg:5},
                    mb: 30,
                    px: {md: 5, lg: 3},
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    minHeight: '90vh',
                }}
            >
                <Grid container spacing={3} justifyContent="center">
                    <Grid item xs={12} sm={12} md={12} lg={6}>
                        <Card>
                            <MDBox
                                variant="gradient"
                                bgColor="info"
                                borderRadius="lg"
                                coloredShadow="success"
                                mx={2}
                                mt={-3}
                                p={2}
                                mb={1}
                                textAlign="center"
                            >
                                <MDTypography variant="h4" fontWeight="medium"
                                              color="white" mt={1}>
                                    회원가입
                                </MDTypography>
                            </MDBox>

                            <MDBox
                                pb={3}
                                px={3}
                                sx={{
                                    display: 'flex',
                                    flexDirection: 'column',
                                    gap: 0, // gap 제거
                                }}
                            >
                                {/* 아이디와 닉네임 입력 필드 사이에 경고 문구 추가 */}
                                <MDBox mb={isSmallScreen? 0:1} p={2}
                                       bgcolor="warning.main"
                                       borderRadius="5px">
                                    <MDTypography
                                        variant="body2"
                                        sx={{
                                            color: '#f44336',
                                            fontSize: isSmallScreen? '0.65rem':'0.86rem'
                                        }}
                                    >
                                        ※ 아이디와 닉네임에 부적절한 단어를 사용하지 마세요. 적발 시 경고
                                        없이 제재 받을 수 있습니다.
                                    </MDTypography>
                                </MDBox>

                                <MDBox component="form" role="form">
                                    {/* 이메일 입력 필드 */}
                                    <MDBox mb={{xs:2, sm:5, md:5, lg:4}}>
                                        <MDTypography
                                            sx={{
                                                fontSize: isSmallScreen? '0.7rem':'1rem'
                                            }}
                                            variant="h6">이메일</MDTypography>
                                        <Grid container spacing={1}
                                              alignItems="center">
                                            <Grid item xs={4} sm={3} md={3} lg={3}>
                                                <MDInput
                                                    type="text"
                                                    onChange={(v) => setEmailId(
                                                        v.target.value)}
                                                    placeholder="이메일 아이디 입력"
                                                    fullWidth
                                                />
                                            </Grid>
                                            @
                                            <Grid item xs={3.5} sm={3} md={3} lg={3}>
                                                <MDInput
                                                    type="text"
                                                    value={isCustomDomain
                                                        ? customDomain : domain}
                                                    onChange={handleCustomDomainChange}
                                                    placeholder="도메인 입력"
                                                    fullWidth
                                                    disabled={!isCustomDomain}
                                                />
                                            </Grid>
                                            <Grid item xs={3.5} sm={2.5} md={2.5} lg={2.5}>
                                                <select
                                                    onChange={handleDomainChange}
                                                    value={domain}
                                                    style={{
                                                        width: '100%',
                                                        fontSize: '0.875rem' // 글씨 크기를 조정 (14px에 해당)
                                                    }}
                                                >
                                                    <option value="custom">직접 입력
                                                    </option>
                                                    <option
                                                        value="gmail.com">gmail.com
                                                    </option>
                                                    <option
                                                        value="naver.com">naver.com
                                                    </option>
                                                    <option
                                                        value="nate.com">nate.com
                                                    </option>
                                                    <option
                                                        value="daum.net">daum.net
                                                    </option>
                                                </select>
                                            </Grid>
                                            {emailCheckSuccess && (
                                                <MDTypography variant="body2"
                                                              color="success">
                                                    {emailCheckSuccess}
                                                </MDTypography>
                                            )}
                                            {emailCheckError && (
                                                <MDTypography variant="body2"
                                                              color="error">
                                                    {emailCheckError}
                                                </MDTypography>
                                            )}
                                            <Grid item xs={12} sm={3} md={3} lg={3}>
                                                <MDButton
                                                    onClick={handleEmailCheck}
                                                    variant="gradient"
                                                    color="info"
                                                    size="small"
                                                    fullWidth
                                                    sx={{
                                                        backgroundColor: '#50bcdf',
                                                        color: '#ffffff',
                                                        fontSize: isSmallScreen ? '0.8rem':'1rem',
                                                        fontFamily: 'JalnanGothic',
                                                        width: '100%',
                                                        padding: isSmallScreen ? '1px 2px' : '4px 8px',
                                                        lineHeight: isSmallScreen ? 2.5 : 2,  // 줄 간격을 줄여 높이를 감소시킴
                                                        minHeight: 'auto' // 기본적으로 적용되는 높이를 없앰
                                                    }}
                                                >
                                                    이메일 중복 확인
                                                </MDButton>
                                            </Grid>
                                        </Grid>
                                    </MDBox>

                                    {/* 인증번호 입력 필드 */}
                                    <MDBox mb={{xs:2, sm:5, md:5, lg:4}}>
                                        <MDTypography
                                            sx={{
                                                fontSize: isSmallScreen? '0.7rem':'1rem'
                                            }}
                                            variant="h6">인증번호</MDTypography>
                                        <Grid container spacing={1}
                                              alignItems="center">
                                            <Grid item xs={6} sm={5} md={5} lg={5}>
                                                <MDInput
                                                    type="text"
                                                    onChange={(v) => setEmailVerificationCode(
                                                        v.target.value)}
                                                    placeholder="인증번호 입력"
                                                    error={!!verificationError}
                                                    fullWidth
                                                    sx={{
                                                        borderColor: isVerified ? 'success'
                                                            : (verificationError ? 'error' : 'inherit'),
                                                    }}
                                                />
                                                {emailCodeSending && (
                                                    <MDTypography
                                                        variant="body2"
                                                        color="text.secondary">
                                                        인증번호 전송중...
                                                    </MDTypography>
                                                )}
                                                {verificationSuccess && (
                                                    <MDTypography
                                                        variant="body2"
                                                        color="success">
                                                        {verificationSuccess}
                                                    </MDTypography>
                                                )}
                                                {verificationError && (
                                                    <MDTypography
                                                        variant="body2"
                                                        color="error">
                                                        {verificationError}
                                                    </MDTypography>
                                                )}
                                            </Grid>
                                            <Grid item xs={6} sm={2.5} md={2.5} lg={2.5}>
                                                <MDButton
                                                    onClick={handleSendEmailCode}
                                                    variant="gradient"
                                                    color="info"
                                                    size="small"
                                                    fullWidth
                                                    sx={{
                                                        backgroundColor: '#50bcdf',
                                                        color: '#ffffff',
                                                        fontSize: isSmallScreen ? '0.8rem':'1rem',
                                                        fontFamily: 'JalnanGothic',
                                                        width: '100%',
                                                        padding: isSmallScreen ? '1px 2px' : '4px 8px',
                                                        lineHeight: isSmallScreen ? 2.5 : 2,  // 줄 간격을 줄여 높이를 감소시킴
                                                        minHeight: 'auto', // 기본적으로 적용되는 높이를 없앰
                                                        ml: isSmallScreen? 0: '10px'
                                                    }}
                                                >
                                                    인증번호 전송
                                                </MDButton>
                                            </Grid>
                                        </Grid>
                                    </MDBox>

                                    {/* 아이디 입력 필드 */}
                                    <MDBox mb={{xs:2, sm:5, md:5, lg:4}}>
                                        <MDTypography
                                            sx={{
                                                fontSize: isSmallScreen? '0.7rem':'1rem'
                                            }}
                                            variant="h6">아이디</MDTypography>
                                        <Grid container spacing={1}
                                              alignItems="center">
                                            <Grid item xs={6} sm={5} md={5} lg={5}>
                                                <ProfanityFilterMDInput
                                                    type="text"
                                                    onChange={(v) => setMemberId(
                                                        v.target.value)}
                                                    placeholder="아이디 입력"
                                                    fullWidth
                                                    error={!!idCheckError}
                                                />
                                                {idCheckError && (
                                                    <MDTypography
                                                        variant="body2"
                                                        color="error">
                                                        {idCheckError}
                                                    </MDTypography>
                                                )}
                                                {idCheckSuccess && (
                                                    <MDTypography
                                                        variant="body2"
                                                        color="success">
                                                        {idCheckSuccess}
                                                    </MDTypography>
                                                )}
                                            </Grid>
                                            <Grid item xs={6} sm={3} md={3} lg={3}>
                                                <MDButton
                                                    onClick={handleIdCheck}
                                                    variant="gradient"
                                                    color="info"
                                                    size="small"
                                                    fullWidth
                                                    sx={{
                                                        backgroundColor: '#50bcdf',
                                                        color: '#ffffff',
                                                        fontSize: isSmallScreen ? '0.8rem':'1rem',
                                                        fontFamily: 'JalnanGothic',
                                                        width: '100%',
                                                        padding: isSmallScreen ? '1px 2px' : '4px 8px',
                                                        lineHeight: isSmallScreen ? 2.5 : 2,
                                                        minHeight: 'auto', // 기본적으로 적용되는 높이를 없앰
                                                        ml: isSmallScreen? 0: '10px'
                                                    }}
                                                >
                                                    아이디 중복 확인
                                                </MDButton>
                                            </Grid>
                                        </Grid>
                                    </MDBox>

                                    {/* 비밀번호 입력 필드 */}
                                    <MDBox
                                        mb={{xs:2, sm:5, md:5, lg:4}}>
                                        <MDTypography
                                            sx={{
                                                fontSize: isSmallScreen? '0.7rem':'1rem'
                                            }}
                                            variant="h6">비밀번호</MDTypography>
                                        <Grid container spacing={1}>
                                            <Grid item xs={12} sm={8} md={8} lg={8}>
                                                <MDInput
                                                    type="password"
                                                    onChange={(v) => setMemberPw(
                                                        v.target.value)}
                                                    placeholder="비밀번호는 8~16자의 영문 소문자, 숫자, 특수문자를 포함해야 합니다."
                                                    fullWidth
                                                    error={!!pwError}
                                                />
                                                {pwError && (
                                                    <MDTypography
                                                        variant="body2"
                                                        color="error">
                                                        {pwError}
                                                    </MDTypography>
                                                )}
                                                {memberPw && (
                                                    <MDBox mt={2}>
                                                        <ul>
                                                            <li>
                                                                <MDTypography
                                                                    variant="caption"
                                                                    color={hasLowercase
                                                                        ? 'success'
                                                                        : 'error'}>
                                                                    소문자 포함
                                                                </MDTypography>
                                                            </li>
                                                            <li>
                                                                <MDTypography
                                                                    variant="caption"
                                                                    color={hasNumber
                                                                        ? 'success'
                                                                        : 'error'}>
                                                                    숫자 포함
                                                                </MDTypography>
                                                            </li>
                                                            <li>
                                                                <MDTypography
                                                                    variant="caption"
                                                                    color={hasSpecialChar
                                                                        ? 'success'
                                                                        : 'error'}>
                                                                    특수문자 포함
                                                                </MDTypography>
                                                            </li>
                                                            <li>
                                                                <MDTypography
                                                                    variant="caption"
                                                                    color={hasValidLength
                                                                        ? 'success'
                                                                        : 'error'}>
                                                                    8~16자 사이
                                                                </MDTypography>
                                                            </li>
                                                        </ul>
                                                    </MDBox>
                                                )}
                                            </Grid>
                                        </Grid>
                                    </MDBox>

                                    {/* 비밀번호 확인 필드 */}
                                    <MDBox mb={{xs:2, sm:5, md:5, lg:4}}>
                                        <MDTypography
                                            sx={{
                                                fontSize: isSmallScreen? '0.7rem':'1rem'
                                            }}
                                            variant="h6">비밀번호 확인</MDTypography>
                                        <Grid container spacing={1}>
                                            <Grid item xs={12} sm={8} md={9} lg={8}>
                                                <MDInput
                                                    type="password"
                                                    onChange={(v) => setConfirmPw(
                                                        v.target.value)}
                                                    placeholder="비밀번호 확인"
                                                    fullWidth
                                                    error={!!confirmPwError}
                                                />
                                                {confirmPwError && (
                                                    <MDTypography
                                                        variant="body2"
                                                        color="error">
                                                        {confirmPwError}
                                                    </MDTypography>
                                                )}
                                                {confirmPwSuccess && (
                                                    <MDTypography
                                                        variant="body2"
                                                        color="success">
                                                        {confirmPwSuccess}
                                                    </MDTypography>
                                                )}
                                            </Grid>
                                        </Grid>
                                    </MDBox>

                                    {/* 닉네임 입력 필드 */}
                                    <MDBox mb={{xs: 3, sm: 5, md: 5, lg: 4}}>
                                        <MDTypography
                                            sx={{
                                                fontSize: isSmallScreen
                                                    ? '0.7rem' : '1rem'
                                            }}
                                            variant="h6">닉네임</MDTypography>
                                        <Grid container spacing={1}>
                                            <Grid item xs={12} sm={8} md={9} lg={8}>
                                                <ProfanityFilterMDInput
                                                    type="text"
                                                    onChange={(v) => setMemberNickname(
                                                        v.target.value)}
                                                    placeholder="닉네임 입력"
                                                    fullWidth
                                                />
                                            </Grid>
                                        </Grid>
                                    </MDBox>

                                    <MDBox mt={2} mb={1}>
                                        <MDButton
                                            onClick={handleSignUp}
                                            variant="gradient"
                                            color="info"
                                            fullWidth
                                            sx={{
                                                backgroundColor: '#50bcdf',
                                                color: '#ffffff',
                                                fontSize: isSmallScreen ? '0.9rem' :'1.1rem',
                                                fontFamily: 'JalnanGothic',
                                                width: '100%',
                                                padding: isSmallScreen ? '2px 4px' : '10px 8px',
                                                lineHeight: 2,  // 줄 간격을 줄여 높이를 감소시킴
                                                minHeight: 'auto' // 기본적으로 적용되는 높이를 없앰
                                            }}
                                        >
                                            회원가입
                                        </MDButton>
                                    </MDBox>

                                    <MDBox mb={1} textAlign="center">
                                        <MDTypography
                                            sx={{
                                                fontSize: isSmallScreen? '0.7rem':'1rem'
                                            }}
                                            variant="button"
                                                      color="text">
                                            이미 계정이 있으신가요?{' '}
                                            <MDTypography
                                                sx={{
                                                    fontSize: isSmallScreen? '0.7rem':'1rem'
                                                }}
                                                component={Link}
                                                to="/authentication/sign-in"
                                                variant="button"
                                                color="info"
                                                fontWeight="medium"
                                                textGradient
                                            >
                                                로그인
                                            </MDTypography>
                                        </MDTypography>
                                    </MDBox>
                                </MDBox>
                            </MDBox>
                        </Card>
                    </Grid>
                </Grid>
            </MDBox>
        </DashboardLayout>
    );
}

export default SignUp;