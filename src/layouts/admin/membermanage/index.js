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
import {useMediaQuery} from '@mui/material';
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
    const [searchType, setSearchType] = useState('id'); // 검색 타입 (ID 또는 닉네임)
    const navigate = useNavigate();

    const handleGetMembers = (page = 0, role = 'all') => {
        const params = {page, size: 10};
        let apiCall;

        if (searchQuery) {
            apiCall = getMemberListSearch(params, searchQuery, searchType);
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
    }, [currentPage, selectedRole, searchQuery, searchType]);

    const handleDetail = (member) => {
        console.log('회원 상세 페이지로 이동 : ', member);
        navigate('/member-detail-admin', {state: member.memberNo});
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

    // 검색 타입 변경 핸들러
    const handleSearchTypeChange = (event) => {
        setSearchType(event.target.value);
    };

    const handleSearchSubmit = (e) => {
        e.preventDefault();
        setCurrentPage(0);
        handleGetMembers(0, selectedRole);
    };

    const handleManageWithdrawMembers = () => {
        navigate('/withdrawmember-manage');
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

    const styles = {
        table: {
            width: '100%',
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
            marginTop: 3,
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
        memberItem: {
            borderBottom: '1px solid #ddd',
            padding: '10px',
            marginBottom: '10px',
            cursor: 'pointer'
        },
        memberDetails: {
            fontSize: '0.9rem',
            color: '#555'
        }
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

    const isMobile = useMediaQuery('(max-width:600px)');

    return (
        <DashboardLayout>
            <MDTypography
                fontWeight="bold"
                sx={{ ml: 4, mt: 2, fontSize: '2rem' }}
                variant="body2"
            >
                회원 관리
            </MDTypography>
            <MDBox pt={1} pb={2}>
                <MDBox pt={1} pb={2} px={3} sx={{ position: 'relative' }}>
                    {/* "탈퇴회원 관리" 버튼 추가 */}
                    <MDButton
                        onClick={() => handleManageWithdrawMembers()}
                        variant="gradient"
                        color="warning"
                        sx={{
                            position: { xs: 'relative', sm: 'absolute' }, // 모바일에서는 relative, 데스크탑에서는 absolute
                            top: { xs: 'auto', sm: '16px' }, // 데스크탑에서는 상단 여백 설정
                            right: { xs: 'auto', sm: '30px' }, // 데스크탑에서는 오른쪽 여백 설정
                            mb: { xs: '16px', sm: '0' }, // 모바일에서는 버튼 아래에 여백 추가
                            fontFamily: 'JalnanGothic',
                            fontSize: '1rem',
                            padding: '8px 16px',
                            backgroundColor: '#FF5722', // 주황색 배경
                            color: '#FFFFFF', // 흰색 글자
                            zIndex: 10 // 버튼이 다른 요소 위에 보이도록 설정
                        }}
                    >
                        탈퇴회원 관리
                    </MDButton>
                    <Card>
                        <MDBox pt={2} pb={3} px={3} sx={{ overflowX: 'auto' }}>
                            {/* 검색 폼 추가 */}
                            <form onSubmit={handleSearchSubmit} style={{ ...styles.searchForm, marginTop: { xs: '48px', sm: '0' } }}>
                                <select
                                    id="searchType"
                                    name="searchType"
                                    style={styles.searchSelect}
                                    value={searchType}
                                    onChange={handleSearchTypeChange}
                                >
                                    <option value="id">아이디</option>
                                    <option value="nickname">닉네임</option>
                                </select>
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
                                        padding: '4px 8px',
                                        mt: '8px'
                                    }}
                                    color="info"
                                >
                                    검색
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
                                {isMobile ? (
                                    // 모바일 실선 리스트 형식
                                    members.length === 0 ? (
                                        <MDTypography
                                            style={styles.noMembersMessage}
                                            variant="body2"
                                        >
                                            해당 권한에 해당하는 회원이 없습니다
                                        </MDTypography>
                                    ) : (
                                        members.map((member) => (
                                            <div
                                                key={member.memberId}
                                                style={styles.memberItem}
                                                onClick={() => handleDetail(member)}
                                            >
                                                <MDTypography variant="body2">
                                                    <strong>ID:</strong> {member.memberId}
                                                </MDTypography>
                                                <MDTypography variant="body2">
                                                    <strong>이메일:</strong> {member.memberEmail}
                                                </MDTypography>
                                                <MDTypography variant="body2">
                                                    <strong>닉네임:</strong> {member.nicknameWithRandomTag}
                                                </MDTypography>
                                                <MDTypography variant="body2">
                                                    <strong>제재여부:</strong> {member.warning ? "제재중" : "정상"}
                                                </MDTypography>
                                                <MDTypography variant="body2">
                                                    <strong>신고당한횟수:</strong> {member.countReport}
                                                </MDTypography>
                                                <MDTypography variant="body2">
                                                    <strong>가입경로:</strong> {member.providerType}
                                                </MDTypography>
                                                <MDTypography variant="body2">
                                                    <strong>권한:</strong> {member.role}
                                                </MDTypography>
                                                <MDTypography variant="body2">
                                                    <strong>가입일:</strong> {formatCreateTime(member.createTime)}
                                                </MDTypography>
                                            </div>
                                        ))
                                    )
                                ) : (
                                    // 테이블 형식
                                    members.length === 0 ? (
                                        <MDTypography
                                            style={styles.noMembersMessage}
                                            variant="body2"
                                        >
                                            해당 권한에 해당하는 회원이 없습니다
                                        </MDTypography>
                                    ) : (
                                        <table style={styles.table}>
                                            <thead>
                                            <tr>
                                                <th>
                                                    <MDTypography
                                                        fontWeight="bold"
                                                        variant="body2"
                                                        sx={styles.th}
                                                    >
                                                        회원 ID
                                                    </MDTypography>
                                                </th>
                                                <th>
                                                    <MDTypography
                                                        fontWeight="bold"
                                                        variant="body2"
                                                        sx={styles.th}
                                                    >
                                                        이메일
                                                    </MDTypography>
                                                </th>
                                                <th>
                                                    <MDTypography
                                                        fontWeight="bold"
                                                        variant="body2"
                                                        sx={styles.th}
                                                    >
                                                        닉네임
                                                    </MDTypography>
                                                </th>
                                                <th>
                                                    <MDTypography
                                                        fontWeight="bold"
                                                        variant="body2"
                                                        sx={styles.th}
                                                    >
                                                        제재여부
                                                    </MDTypography>
                                                </th>
                                                <th>
                                                    <MDTypography
                                                        fontWeight="bold"
                                                        variant="body2"
                                                        sx={styles.th}
                                                    >
                                                        신고당한횟수
                                                    </MDTypography>
                                                </th>
                                                <th>
                                                    <MDTypography
                                                        fontWeight="bold"
                                                        variant="body2"
                                                        sx={styles.th}
                                                    >
                                                        가입경로
                                                    </MDTypography>
                                                </th>
                                                <th>
                                                    <MDTypography
                                                        fontWeight="bold"
                                                        variant="body2"
                                                        sx={styles.th}
                                                    >
                                                        권한
                                                    </MDTypography>
                                                </th>
                                                <th>
                                                    <MDTypography
                                                        fontWeight="bold"
                                                        variant="body2"
                                                        sx={styles.th}
                                                    >
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
                                                            onClick={() => handleDetail(member)}
                                                            sx={{
                                                                cursor: 'pointer', // 클릭 가능한 커서 표시
                                                                ...styles.td // 기존 스타일을 유지
                                                            }}
                                                            variant="body2"
                                                        >
                                                            {member.memberId}
                                                        </MDTypography>
                                                    </td>
                                                    <td>
                                                        <MDTypography sx={styles.td} variant="body2">
                                                            {member.memberEmail}
                                                        </MDTypography>
                                                    </td>
                                                    <td>
                                                        <MDTypography sx={styles.td} variant="body2">
                                                            {member.nicknameWithRandomTag}
                                                        </MDTypography>
                                                    </td>
                                                    <td>
                                                        <MDTypography sx={styles.td} variant="body2">
                                                            {member.warning ? "제재중" : "정상"}
                                                        </MDTypography>
                                                    </td>
                                                    <td>
                                                        <MDTypography sx={styles.td} variant="body2">
                                                            {member.countReport}
                                                        </MDTypography>
                                                    </td>
                                                    <td>
                                                        <MDTypography sx={styles.td} variant="body2">
                                                            {member.providerType}
                                                        </MDTypography>
                                                    </td>
                                                    <td>
                                                        <MDTypography sx={styles.td} variant="body2">
                                                            {member.role}
                                                        </MDTypography>
                                                    </td>
                                                    <td>
                                                        <MDTypography sx={styles.td} variant="body2">
                                                            {formatCreateTime(member.createTime)}
                                                        </MDTypography>
                                                    </td>
                                                </tr>
                                            ))}
                                            </tbody>
                                        </table>
                                    )
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

