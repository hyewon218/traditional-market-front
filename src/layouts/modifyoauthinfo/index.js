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
import {useEffect, useRef, useState} from 'react';
import {useLocation, useNavigate} from 'react-router-dom';

import ProfanityFilterMDInput from '../../components/common/ProfanityFilter'; // 비속어 필터
import { containsProfanity } from '../../components/common/profanityUtils'; // 분리한 비속어 필터 내 containsProfanity 함수 import

// @mui material components
import Card from '@mui/material/Card';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';
import Tooltip from '@mui/material/Tooltip';
import InfoIcon from '@mui/icons-material/Info';
import Button from '@mui/material/Button';
import Grid from '@mui/material/Grid';

// Material Dashboard 2 React components
import MDBox from '../../components/MD/MDBox';
import MDInput from '../../components/MD/MDInput';
import MDButton from '../../components/MD/MDButton';
import MDTypography from '../../components/MD/MDTypography';

// Material Dashboard 2 React example components
import DashboardLayout from '../../examples/LayoutContainers/DashboardLayout';
import {FormControl, InputLabel, Select, TextField} from "@mui/material";
import MenuItem from "@mui/material/MenuItem";

// Data
import {getMember, putOAuthInfo, getIdCheck} from "../../api/memberApi";

function ModifyOAuthInfo() {
    const [member, setMember] = useState('');
    const navigate = useNavigate()

    useEffect(() => {
        const loadMember = async () => {

            try {
                const memberData = await getMember();
                setMember(memberData);
                console.log('member : ', member);

            } catch (error) {
                console.error("OAuth2.0 회원 데이터 불러오기 오류:", error);
            }
        };

        loadMember();
    }, []);

    const handleChangeMember = (e) => {
        const {name, value} = e.target;
        setMember((prevMember) => ({ ...prevMember, [name]: value }));
    }

    // 추가정보 입력 실행
    const handleModifyOAuthInfo = async () => {
        console.log('memberNickname : ' + member.nicknameWithRandomTag);

        // 유효성 검사
        if (!member.memberNickname) {
            alert('닉네임을 입력해주세요.');
            return;
        }

        if (/\s/.test(member.memberNickname)) {
            alert('닉네임에 공백을 포함할 수 없습니다.');
            return;
        }

        if (containsProfanity(member.memberNickname)) {
           alert('닉네임에 비속어가 포함되어 있습니다. 다른 닉네임을 입력해 주세요.');
           return;
        }

        if (!window.confirm('이대로 가입을 진행하시겠습니까?')) {
            return;
        }

        // FormData 생성
        const formData = new FormData();
        formData.append('memberNickname', member.memberNickname);

        try {
            const data = await putOAuthInfo(formData);
            console.log('추가정보 입력한 OAuth2.0 회원정보 : ', data);
            alert('회원가입을 축하드립니다!');
            navigate('/market');

        } catch (error) {
            console.error("OAuth2.0 추가정보 수정 오류: ", error);
            alert('회원정보 수정 불가');
        }
    };

    return (
        <DashboardLayout>
            <MDBox pt={6} pb={3} display="flex" justifyContent="center">
                <Card sx={{ width: '50%' }}>
                    <MDBox
                        variant="gradient"
                        bgColor="info"
                        borderRadius="lg"
                        coloredShadow="success"
                        mx={2}
                        mt={-3}
                        p={2}
                        mb={-2}
                        textAlign="center"
                      >
                        <MDTypography variant="h4" fontWeight="medium" color="white" mt={1}>
                          회원정보 추가입력
                        </MDTypography>
                      </MDBox>
                    <MDBox pt={4} pb={3} px={3}>
                        {/* 경고 문구 추가 */}
                          <MDBox mb={1} p={2} bgcolor="warning.main" borderRadius="5px">
                            <MDTypography variant="body2" color="error">※ 닉네임에 부적절한 단어(욕설, 비속어 등)를 사용하지 않도록 주의해 주세요. 이런 내용이 발견되면 경고없이 계정에 제재가 있을 수 있습니다.</MDTypography>
                          </MDBox>
                        <MDBox component="form" role="form">
                            <MDBox mb={3}>
                                <ProfanityFilterMDInput
                                    fullWidth
                                    label="닉네임"
                                    name="memberNickname"
                                    value={member.memberNickname}
                                    onChange={handleChangeMember}
                                    InputLabelProps={{
                                        shrink: true, // 라벨이 항상 입력란 위에 고정되도록
                                        style: { fontSize: '1.25rem' } // 라벨 크기 조정
                                    }}
                                    sx={{ mt: 1, mb: -2 }}
                                />
                            </MDBox>
                            <MDBox mt={4} mb={1} right>
                                <MDButton onClick={handleModifyOAuthInfo}
                                          variant="gradient" color="info">
                                    추가정보 저장
                                </MDButton>
                            </MDBox>
                        </MDBox>
                    </MDBox>
                </Card>
            </MDBox>
        </DashboardLayout>
    );
}

export default ModifyOAuthInfo;
