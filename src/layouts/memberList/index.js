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
import {useEffect, useState} from 'react';

// @mui material components
import Card from '@mui/material/Card';

// Material Dashboard 2 React components
import MDBox from '../../components/MD/MDBox';
import MDTypography from '../../components/MD/MDTypography';

// Material Dashboard 2 React example components
import DashboardLayout from '../../examples/LayoutContainers/DashboardLayout';

// Data
import {getMemberList} from "../../api/memberApi";

function MemberList() {
    const [members, setMembers] = useState([]);

    const handleGetMembers = () => {
        getMemberList().then(data => {
            console.log("result!!!!!!!!!!!!!")
            setMembers(data);
        }).catch(error => {
            console.error("회원 목록을 불러오는 데 실패했습니다.", error);
        });
    }

    useEffect(() => {
        handleGetMembers();
    }, []);

    return (
        <DashboardLayout>
            <MDBox pt={3} pb={3}>
                <MDTypography fontWeight="bold" sx={{fontSize: '2.5rem'}}
                              variant="body2">
                    회원 목록
                </MDTypography>

                <MDBox pt={3} pb={3}>
                    <Card>
                        <MDBox pt={2} pb={3} px={3}>

                            <div className="memberList-contents">
                                <table width={1200}>
                                    <thead>
                                    <tr>
                                        <th><MDTypography fontWeight="bold"
                                                          variant="body2"
                                                          sx={{fontSize: '1.8rem', paddingBottom: '10px'}}>회원
                                            ID</MDTypography></th>
                                        <th><MDTypography fontWeight="bold"
                                                          variant="body2"
                                                          sx={{fontSize: '1.8rem', paddingBottom: '10px'}}>이메일</MDTypography>
                                        </th>
                                        <th><MDTypography fontWeight="bold"
                                                          variant="body2"
                                                          sx={{fontSize: '1.8rem', paddingBottom: '10px'}}>닉네임</MDTypography>
                                        </th>
                                        <th><MDTypography fontWeight="bold"
                                                          variant="body2"
                                                          sx={{fontSize: '1.8rem', paddingBottom: '10px'}}>권한</MDTypography>
                                        </th>
                                        <th><MDTypography fontWeight="bold"
                                                          variant="body2"
                                                          sx={{fontSize: '1.8rem', paddingBottom: '10px'}}>가입일</MDTypography>
                                        </th>
                                    </tr>
                                    </thead>

                                    <tbody>
                                    {members.map((member) => (
                                        <tr key={member.memberId}>
                                            <td><MDTypography fontWeight="bold"
                                                              sx={{fontSize: '1.2rem', paddingBottom: '7px'}}
                                                              variant="body2">{member.memberId}</MDTypography>
                                            </td>
                                            <td><MDTypography fontWeight="bold"
                                                              sx={{fontSize: '1.2rem', paddingBottom: '7px'}}
                                                              variant="body2">{member.memberEmail}</MDTypography>
                                            </td>
                                            <td><MDTypography fontWeight="bold"
                                                              sx={{fontSize: '1.2rem', paddingBottom: '7px'}}
                                                              variant="body2">{member.nicknameWithRandomTag}</MDTypography>
                                            </td>
                                            <td><MDTypography fontWeight="bold"
                                                              sx={{fontSize: '1.2rem', paddingBottom: '7px'}}
                                                              variant="body2">{member.role}</MDTypography>
                                            </td>
                                            <td><MDTypography fontWeight="bold"
                                                              sx={{fontSize: '1.2rem', paddingBottom: '7px'}}
                                                              variant="body2">{member.createTime}</MDTypography>
                                            </td>
                                        </tr>
                                    ))}
                                    </tbody>
                                </table>
                            </div>

                        </MDBox>
                    </Card>
                </MDBox>

            </MDBox>

        </DashboardLayout>
    );
}

export default MemberList;
