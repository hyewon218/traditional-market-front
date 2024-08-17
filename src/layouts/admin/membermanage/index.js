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

// 회원 상세 조회 추가, 날짜 특정 형식으로 변환, 페이징 추가, 권한 검색 기능 추가, 회원 검색 기능 추가
import * as React from 'react';
import {useEffect, useState} from 'react';
import {useNavigate} from 'react-router-dom';
import Card from '@mui/material/Card';
import MDBox from '../../../components/MD/MDBox';
import MDTypography from '../../../components/MD/MDTypography';
import DashboardLayout
    from '../../../examples/LayoutContainers/DashboardLayout';
import {getMemberList} from "../../../api/memberApi";
import {getRole, getMemberListSearch} from "../../../api/adminApi";
import MDButton from "../../../components/MD/MDButton";
import MDInput from "../../../components/MD/MDInput";

function MemberManage() {
    const [members, setMembers] = useState([]);
    const [currentPage, setCurrentPage] = useState(0);
    const [totalPages, setTotalPages] = useState(0);
    const [selectedRole, setSelectedRole] = useState('all');
    const [searchQuery, setSearchQuery] = useState(''); // 검색 쿼리 상태
    const navigate = useNavigate();

    const handleGetMembers = (page = 0, role = 'all') => {
        const params = {page, size: 3};
        let apiCall;

        if (searchQuery) {
            apiCall = getMemberListSearch(params, searchQuery);
        } else if (role && role !== 'all') {
            apiCall = getRole(role, params);
        } else {
            apiCall = getMemberList(params);
        }

        apiCall
        .then(data => {
            setMembers(data.content);
            setTotalPages(data.totalPages);
        })
        .catch(error => {
            console.error("회원 목록을 불러오는 데 실패했습니다.", error);
        });
    };

    useEffect(() => {
        handleGetMembers(currentPage, selectedRole);
    }, [currentPage, selectedRole]);

    const handleDetail = (member) => {
        console.log('회원 상세 페이지로 이동 : ', member);
        navigate('/member-detail-admin', {state: member});
    };

    const handlePageClick = (page) => {
        setCurrentPage(page);
    };

    const handleRoleChange = (event) => {
        setSelectedRole(event.target.value);
        setCurrentPage(0); // 선택된 역할에 따라 페이지를 처음으로 되돌림
        setSearchQuery(''); // 검색 쿼리 초기화
    };

    // 검색 기능 추가
    const handleSearchChange = (e) => {
        setSearchQuery(e.target.value);
    };

    const handleSearchSubmit = (e) => {
        e.preventDefault();
        setCurrentPage(0);
        handleGetMembers(0, selectedRole);
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

    // Inline styles
    const styles = {
        table: {
            width: '1200px',
            borderCollapse: 'collapse',
        },
        th: {
            fontWeight: 'bold',
            fontSize: '1.8rem',
            paddingBottom: '10px',
        },
        td: {
            fontWeight: 'bold',
            fontSize: '1.2rem',
            paddingBottom: '7px',
        },
        clickable: {
            cursor: 'pointer',
        },
        button: {
            margin: '0 5px',
            padding: '8px 16px',
            border: 'none',
            borderRadius: '4px',
            backgroundColor: '#f0f0f0',
            cursor: 'pointer',
        },
        active: {
            backgroundColor: 'blue',
            color: 'white',
        },
        pagination: {
            display: 'flex',
            justifyContent: 'center',
            marginTop: '20px',
        },
        select: {
            padding: '8px',
            borderRadius: '4px',
            border: '1px solid #ccc',
            marginBottom: '20px',
        },
        noMembersMessage: {
            textAlign: 'center',
            fontSize: '1.2rem',
            color: 'red',
            marginTop: '20px',
        },
        searchForm: {
            marginBottom: '20px',
        },
        searchInput: {
            width: '33%',
            padding: '4px',
            borderRadius: '2px',
            marginRight: '5px',
            marginTop: '3px'
        },
    };

    const renderPagination = () => {
        const pagination = [];
        const groupSize = 5;
        const currentGroup = Math.floor(currentPage / groupSize);
        const startPage = currentGroup * groupSize;
        const endPage = Math.min(startPage + groupSize - 1, totalPages - 1);

        pagination.push(
            <button
                key="first-group"
                style={styles.button}
                onClick={() => handlePageClick(0)}
            >
                처음
            </button>
        );

        pagination.push(
            <button
                key="prev"
                style={styles.button}
                disabled={currentPage === 0}
                onClick={() => handlePageClick(Math.max(currentPage - 1, 0))}
            >
                이전
            </button>
        );

        for (let i = startPage; i <= endPage; i++) {
            pagination.push(
                <button
                    key={i}
                    style={{
                        ...styles.button, ...(i === currentPage ? styles.active
                            : {})
                    }}
                    onClick={() => handlePageClick(i)}
                >
                    {i + 1}
                </button>
            );
        }

        pagination.push(
            <button
                key="next"
                style={styles.button}
                disabled={currentPage >= totalPages - 1}
                onClick={() => handlePageClick(
                    Math.min(currentPage + 1, totalPages - 1))}
            >
                다음
            </button>
        );

        pagination.push(
            <button
                key="last-group"
                style={styles.button}
                onClick={() => handlePageClick(totalPages - 1)}
            >
                끝
            </button>
        );

        return pagination;
    };

    return (
        <DashboardLayout>
            <MDTypography fontWeight="bold"
                          sx={{ml: 4, mt: 2, fontSize: '2rem'}}
                          variant="body2">
                회원 관리
            </MDTypography>
            <MDBox pt={1} pb={2}>
                <MDBox pt={1} pb={2} px={3}>
                    <Card>
                        <MDBox pt={2} pb={3} px={3}>
                            {/* 검색 폼 추가 */}
                            <form onSubmit={handleSearchSubmit}
                                  style={styles.searchForm}>
                                <MDInput
                                    type="text"
                                    value={searchQuery}
                                    onChange={handleSearchChange}
                                    placeholder="검색어를 입력하세요"
                                    style={styles.searchInput}
                                />
                                <MDButton
                                    type="submit"
                                    variant="gradient"
                                    sx={{
                                        fontFamily: 'JalnanGothic',
                                        fontSize: '1.2rem',
                                        padding: '4px 8px',   // Adjust padding (top-bottom left-right)
                                        mt:'8px'
                                    }}
                                    color="info">검색
                                </MDButton>
                            </form>
                            {/* 드롭다운 추가 */}
                            <select
                                id="role"
                                name="role"
                                style={styles.select}
                                value={selectedRole}
                                onChange={handleRoleChange}
                            >
                                <option value="all">전체</option>
                                <option value="ADMIN">관리자</option>
                                <option value="MEMBER">회원</option>
                                <option value="SELLER">판매자</option>
                                <option value="MANAGER">중간관리자</option>
                                <option value="WARNINGMEMBER">경고회원</option>
                            </select>

                            <div className="memberList-contents">
                                {members.length === 0 ? (
                                    <MDTypography
                                        style={styles.noMembersMessage}
                                        variant="body2">
                                        해당 권한에 해당하는 회원이 없습니다
                                    </MDTypography>
                                ) : (
                                    <table style={styles.table}>
                                        <thead>
                                        <tr>
                                            <th>
                                                <MDTypography fontWeight="bold"
                                                              variant="body2"
                                                              sx={styles.th}>
                                                    회원 ID
                                                </MDTypography>
                                            </th>
                                            <th>
                                                <MDTypography fontWeight="bold"
                                                              variant="body2"
                                                              sx={styles.th}>
                                                    이메일
                                                </MDTypography>
                                            </th>
                                            <th>
                                                <MDTypography fontWeight="bold"
                                                              variant="body2"
                                                              sx={styles.th}>
                                                    닉네임
                                                </MDTypography>
                                            </th>
                                            <th>
                                                <MDTypography fontWeight="bold"
                                                              variant="body2"
                                                              sx={styles.th}>
                                                    권한
                                                </MDTypography>
                                            </th>
                                            <th>
                                                <MDTypography fontWeight="bold"
                                                              variant="body2"
                                                              sx={styles.th}>
                                                    가입일
                                                </MDTypography>
                                            </th>
                                        </tr>
                                        </thead>

                                        <tbody>
                                        {members.map((member) => (
                                            <tr key={member.memberId}>
                                                <td>
                                                    <MDTypography
                                                        style={styles.clickable}
                                                        sx={styles.td}
                                                        variant="body2"
                                                        onClick={() => handleDetail(
                                                            member)}
                                                    >
                                                        {member.memberId}
                                                    </MDTypography>
                                                </td>
                                                <td>
                                                    <MDTypography sx={styles.td}
                                                                  variant="body2">
                                                        {member.memberEmail}
                                                    </MDTypography>
                                                </td>
                                                <td>
                                                    <MDTypography sx={styles.td}
                                                                  variant="body2">
                                                        {member.nicknameWithRandomTag}
                                                    </MDTypography>
                                                </td>
                                                <td>
                                                    <MDTypography sx={styles.td}
                                                                  variant="body2">
                                                        {member.role}
                                                    </MDTypography>
                                                </td>
                                                <td>
                                                    <MDTypography sx={styles.td}
                                                                  variant="body2">
                                                        {formatCreateTime(
                                                            member.createTime)}
                                                    </MDTypography>
                                                </td>
                                            </tr>
                                        ))}
                                        </tbody>
                                    </table>
                                )}
                            </div>
                        </MDBox>
                    </Card>
                </MDBox>

                <MDBox sx={styles.pagination}>
                    {renderPagination()}
                </MDBox>
            </MDBox>
        </DashboardLayout>
    );
}

export default MemberManage;

