///**
//=========================================================
//* Material Dashboard 2 React - v2.1.0
//=========================================================
//
//* Product Page: https://www.creative-tim.com/product/material-dashboard-react
//* Copyright 2022 Creative Tim (https://www.creative-tim.com)
//
//Coded by www.creative-tim.com
//
// =========================================================
//
//* The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.
//*/
//
//// prop-types is a library for typechecking of props
//import PropTypes from 'prop-types';
//
//// @mui material components
//import Link from '@mui/material/Link';
//import Icon from '@mui/material/Icon';
//
//// Material Dashboard 2 React components
//import MDBox from '../../components/MD/MDBox';
//import MDTypography from '../../components/MD/MDTypography';
//
//// Material Dashboard 2 React base styles
//import typography from '../../assets/theme/base/typography';
//
//function Footer({ company, links }) {
//  const { href, name } = company;
//  const { size } = typography;
//
//  const renderLinks = () =>
//    links.map((link) => (
//      <MDBox key={link.name} component="li" px={2} lineHeight={1}>
//        <Link href={link.href} target="_blank">
//          <MDTypography variant="button" fontWeight="regular" color="text">
//            {link.name}
//          </MDTypography>
//        </Link>
//      </MDBox>
//    ));
//
//  return (
//    <MDBox
//      width="100%"
//      display="flex"
//      flexDirection={{ xs: 'column', lg: 'row' }}
//      justifyContent="space-between"
//      alignItems="center"
//      px={1.5}
//    >
//      <MDBox
//        display="flex"
//        justifyContent="center"
//        alignItems="center"
//        flexWrap="wrap"
//        color="text"
//        fontSize={size.sm}
//        px={1.5}
//      >
//        &copy; {new Date().getFullYear()}, made with
//        <MDBox fontSize={size.md} color="text" mb={-0.5} mx={0.25}>
//          <Icon color="inherit" fontSize="inherit">
//            favorite
//          </Icon>
//        </MDBox>
//        by
//        <Link href={href} target="_blank">
//          <MDTypography variant="button" fontWeight="medium">
//            &nbsp;{name}&nbsp;
//          </MDTypography>
//        </Link>
//        for a better web.
//      </MDBox>
//      <MDBox
//        component="ul"
//        sx={({ breakpoints }) => ({
//          display: 'flex',
//          flexWrap: 'wrap',
//          alignItems: 'center',
//          justifyContent: 'center',
//          listStyle: 'none',
//          mt: 2,
//          mb: 0,
//          p: 0,
//
//          [breakpoints.up('lg')]: {
//            mt: 0,
//          },
//        })}
//      >
//        {renderLinks()}
//      </MDBox>
//    </MDBox>
//  );
//}
//
//// Setting default values for the props of Footer
//Footer.defaultProps = {
//  company: { href: 'https://www.creative-tim.com/', name: 'Creative Tim' },
//  links: [
//    { href: 'https://www.creative-tim.com/', name: 'Creative Tim' },
//    { href: 'https://www.creative-tim.com/presentation', name: 'About Us' },
//    { href: 'https://www.creative-tim.com/blog', name: 'Blog' },
//    { href: 'https://www.creative-tim.com/license', name: 'License' },
//  ],
//};
//
//// Typechecking props for the Footer
//Footer.propTypes = {
//  company: PropTypes.objectOf(PropTypes.string),
//  links: PropTypes.arrayOf(PropTypes.object),
//};
//
//export default Footer;

//import PropTypes from 'prop-types';
//import Link from '@mui/material/Link';
//import MDBox from '../../components/MD/MDBox';
//import MDTypography from '../../components/MD/MDTypography';
//
//function Footer({ email }) {
//  return (
//    <MDBox
//      width="100%"
//      display="flex"
//      flexDirection="column"
//      alignItems="center"
//      px={1.5}
//      py={2}
//      textAlign="center"
//      color="text"
//    >
//      <MDBox
//        display="flex"
//        flexDirection="column"
//        alignItems="center"
//        mb={2}
//      >
//        <MDTypography variant="body2" fontWeight="medium">
//          우리동네 전통시장
//        </MDTypography>
//        <MDTypography variant="body2" color="text">
//          &copy; {new Date().getFullYear()} 우리동네 전통시장. All Rights Reserved.
//        </MDTypography>
//      </MDBox>
//
//      <MDBox
//        display="flex"
//        flexDirection="column"
//        alignItems="center"
//        mb={2}
//      >
//        <MDTypography variant="body2" color="text">
//          본 사이트의 모든 콘텐츠는 "우리동네 전통시장"에 저작권이 있으며, 사전 서면 동의 없이 무단 복제, 배포, 수정, 전시, 출판 등을 금지합니다.
//        </MDTypography>
//        <MDTypography variant="body2" color="text">
//          문의사항이 있으시면 아래 이메일을 통해 연락주시기 바랍니다.
//        </MDTypography>
//      </MDBox>
//
//      <MDBox
//        display="flex"
//        flexDirection="column"
//        alignItems="center"
//      >
//        <MDTypography variant="body2" color="text">
//          이메일 : {email}
//        </MDTypography>
//      </MDBox>
//    </MDBox>
//  );
//}
//
//// Setting default values for the props of Footer
//Footer.defaultProps = {
//  email: 'songwc3@gmail.com',
//};
//
//// Typechecking props for the Footer
//Footer.propTypes = {
//  email: PropTypes.string,
//};
//
//export default Footer;

// 개인정보 취급방침, 이용약관
import PropTypes from 'prop-types';
import Link from '@mui/material/Link';
import MDBox from '../../components/MD/MDBox';
import MDTypography from '../../components/MD/MDTypography';
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';
import React, {useState, useEffect, useRef} from 'react';
import {useMediaQuery} from "@mui/material";

function Footer({email}) {
    const [openPrivacy, setOpenPrivacy] = useState(false);
    const [openTerms, setOpenTerms] = useState(false);
    const scrollY = useRef(0); // 현재 스크롤 위치를 저장할 참조

    const isSmallScreen = useMediaQuery('(max-width:600px)');

    const handleOpenPrivacy = () => {
        scrollY.current = window.scrollY; // 현재 스크롤 위치 저장
        setOpenPrivacy(true);
    };

    const handleClosePrivacy = () => {
        setOpenPrivacy(false);
    };

    const handleOpenTerms = () => {
        scrollY.current = window.scrollY; // 현재 스크롤 위치 저장
        setOpenTerms(true);
    };

    const handleCloseTerms = () => {
        setOpenTerms(false);
    };

    const commonTypographyStyles = {
        fontFamily: 'GowunBatang-Regular',
        fontSize: isSmallScreen ? '0.4rem' : '0.6rem'
    };

    const commonTypographyMediumStyles = {
        fontFamily: 'GowunBatang-Regular',
        fontSize: isSmallScreen ? '0.5rem' : '0.7rem'
    };

    useEffect(() => {
        if (openPrivacy || openTerms) {
            // 스크롤이 고정되면서 페이지 내용이 줄어들지 않도록 설정
            document.body.style.position = 'fixed';
            document.body.style.top = `-${scrollY.current}px`;
            document.body.style.width = '100%'; // 스크롤바 공간을 유지하기 위해 전체 너비를 100%로 설정
        } else {
            // 모달이 닫혔을 때 스크롤 상태를 복원
            document.body.style.position = '';
            document.body.style.top = '';
            document.body.style.width = ''; // 기본 너비로 복원
            window.scrollTo(0, scrollY.current); // 저장한 스크롤 위치 복원
        }
    }, [openPrivacy, openTerms]);

    return (
        <MDBox
            width="100%"
            display="flex"
            flexDirection="column"
            alignItems="center"
            px={1.5}
            py={2}
            textAlign="center"
            color="text"
            sx={{
                mb: {xs:3, sm:3, md:3, lg:1},
            }}
        >
            <MDBox
                display="flex"
                flexDirection="column"
                alignItems="center"
                mb={0.5}
            >
                <MDTypography variant="body2" fontWeight="medium"  sx={commonTypographyMediumStyles}>
                    우리동네 전통시장
                </MDTypography>
                <MDTypography variant="body2" color="text" sx={commonTypographyMediumStyles}>
                    &copy; {new Date().getFullYear()} 우리동네 전통시장. All Rights Reserved.
                </MDTypography>
            </MDBox>

            <MDBox
                display="flex"
                flexDirection="column"
                alignItems="center"
                mb={0.5}
            >
                <MDTypography variant="body2" color="text" sx={commonTypographyStyles}>
                    본 사이트의 모든 콘텐츠는 "우리동네 전통시장"에 저작권이 있으며, 사전 서면 동의 없이 무단 복제, 배포,
                    수정, 전시, 출판 등을 금지합니다.<br/>
                    문의사항이 있으시면 아래 이메일을 통해 연락주시기 바랍니다.
                </MDTypography>
            </MDBox>

            <MDBox
                display="flex"
                flexDirection="row"
                alignItems="center"
                gap={1} // 링크와 이메일 간의 간격을 조절
            >
                <MDTypography variant="body2" color="text" sx={commonTypographyStyles}>
                    이메일 : {email}
                </MDTypography>
                <Link href="#" onClick={handleOpenPrivacy} underline="hover" sx={commonTypographyStyles}>
                    개인정보 취급방침
                </Link>
                <Link href="#" onClick={handleOpenTerms} underline="hover" sx={commonTypographyStyles}>
                    이용약관
                </Link>
            </MDBox>

            {/* 개인정보 처리방침 모달 */}
            <Dialog
                open={openPrivacy}
                onClose={handleClosePrivacy}
                PaperProps={{
                    sx: {
                        maxHeight: '80vh',
                        overflowY: 'auto',
                        color: '#000000',
                    },
                }}
                sx={{
                    position: 'absolute',
                    top: `${scrollY.current}px`
                }} // 모달의 위치 설정
            >
                <DialogTitle>
                    개인정보 취급방침
                    <IconButton
                        edge="end"
                        color="inherit"
                        onClick={handleClosePrivacy}
                        aria-label="close"
                        sx={{position: 'absolute', right: 8, top: 8}}
                    >
                        <CloseIcon/>
                    </IconButton>
                </DialogTitle>
                <DialogContent
                    dividers
                    sx={{
                        whiteSpace: 'pre-wrap',
                        maxHeight: '70vh',
                        overflowY: 'auto',
                        color: '#000000'
                    }}
                >
                    {/* 개인정보 처리방침 내용 */}
                    <div>
                        <p>제 1 조 (목적)</p>
                        <p>본 개인정보 처리방침은 [우리동네 전통시장] (이하 “회사”라 함)에서 운영하는 웹사이트(이하
                            “사이트”라 함)에서 회원 가입 및 상품 주문 시 수집하는 개인정보의 처리 방법과 그 목적을
                            설명합니다.</p>

                        <p>제 2 조 (수집하는 개인정보)</p>
                        <p>회사는 다음과 같은 개인정보를 수집합니다:</p>
                        <ul>
                            <li>회원가입 시: 이메일 주소</li>
                            <li>상품 주문 시: 이름, 휴대전화번호, 주소</li>
                        </ul>

                        <p>제 3 조 (개인정보의 이용 목적)</p>
                        <p>회사는 수집한 개인정보를 다음의 목적을 위해 사용합니다:</p>
                        <ul>
                            <li>회원가입 및 서비스 제공: 회원 가입 및 관리, 서비스 이용에 관한 공지사항 전달
                            </li>
                            <li>상품 주문 처리: 상품 주문 및 배송, 주문 관련 문의 대응</li>
                        </ul>

                        <p>제 4 조 (개인정보의 보유 및 이용 기간)</p>
                        <p>회사는 개인정보를 수집 및 이용 목적이 달성된 후에는 관련 법령에 따라 개인정보를 안전하게
                            파기합니다. 회원가입 시 수집한 개인정보는 회원 탈퇴 시까지 보유하며, 상품 주문 시 수집한
                            개인정보는 주문 완료 후 5년간 보관 후 파기합니다.</p>

                        <p>제 5 조 (개인정보의 제3자 제공)</p>
                        <p>회사는 원칙적으로 수집된 개인정보를 외부에 제공하지 않습니다. 다만, 다음의 경우에는 개인정보를
                            제공할 수 있습니다:</p>
                        <ul>
                            <li>고객님이 사전에 동의한 경우</li>
                            <li>법령의 규정에 의거하거나 수사기관의 요구가 있는 경우</li>
                        </ul>

                        <p>제 6 조 (개인정보의 안전성 확보 조치)</p>
                        <p>회사는 개인정보의 안전성을 확보하기 위해 다음과 같은 조치를 취합니다:</p>
                        <ul>
                            <li>개인정보를 안전하게 저장하고 처리하기 위한 기술적 조치</li>
                            <li>접근 권한 제한 및 관리</li>
                            <li>개인정보 취급 직원의 교육 및 관리</li>
                        </ul>

                        <p>제 7 조 (이용자의 권리와 행사 방법)</p>
                        <p>이용자는 다음의 권리를 행사할 수 있습니다:</p>
                        <ul>
                            <li>개인정보의 열람, 정정, 삭제 요구</li>
                            <li>개인정보 처리 정지 요구</li>
                        </ul>

                        <p>제 8 조 (개인정보 처리방침의 변경)</p>
                        <p>회사는 개인정보 처리방침을 변경할 수 있으며, 변경된 사항은 사이트를 통해 공지합니다. 이용자는
                            변경된 개인정보 처리방침을 확인할 책임이 있습니다.</p>

                        <p>제 9 조 (문의처)</p>
                        <p>개인정보 처리와 관련된 문의는 다음의 연락처로 하시기 바랍니다:</p>
                        <ul>
                            <li>이메일: [songwc3@gmail.com]</li>
                        </ul>

                        <p>시행일: [2024년 9월 10일]</p>
                    </div>
                </DialogContent>
            </Dialog>

            {/* 이용약관 모달 */}
            <Dialog
                open={openTerms}
                onClose={handleCloseTerms}
                PaperProps={{
                    sx: {
                        maxHeight: '80vh',
                        overflowY: 'auto',
                        color: '#000000',
                    },
                }}
                sx={{
                    position: 'absolute',
                    top: `${scrollY.current}px`
                }} // 모달의 위치 설정
            >
                <DialogTitle>
                    이용약관
                    <IconButton
                        edge="end"
                        color="inherit"
                        onClick={handleCloseTerms}
                        aria-label="close"
                        sx={{position: 'absolute', right: 8, top: 8}}
                    >
                        <CloseIcon/>
                    </IconButton>
                </DialogTitle>
                <DialogContent
                    dividers
                    sx={{
                        whiteSpace: 'pre-wrap',
                        maxHeight: '70vh',
                        overflowY: 'auto',
                        color: '#000000'
                    }}
                >
                    {/* 이용약관 내용 */}
                    <div>
                        <p>제 1 조 (목적)</p>
                        <p>본 약관은 [우리동네 전통시장] (이하 “회사”라 함)에서 제공하는 웹사이트 서비스(이하
                            “서비스”라 함)의 이용에 관한 제반 사항을 규정합니다.</p>

                        <p>제 2 조 (약관의 효력 및 변경)</p>
                        <p>1. 회사는 본 약관을 서비스 초기 화면에 게시하여 고객이 알 수 있도록 합니다.</p>
                        <p>2. 회사는 본 약관을 변경할 수 있으며, 변경된 약관은 서비스 초기 화면에 게시하여 고객에게
                            공지합니다.</p>

                        <p>제 3 조 (회원 가입 및 계약의 체결)</p>
                        <p>1. 서비스 이용자는 회사가 정한 절차에 따라 회원 가입을 신청하여야 하며, 회사는 신청자의
                            가입을 승인함으로써 계약이 체결됩니다.</p>
                        <p>2. 회사는 다음의 사유가 있을 경우 회원 가입을 거부할 수 있습니다:</p>
                        <ul>
                            <li>신청자가 본 약관에 위배되는 경우</li>
                            <li>허위 정보를 제공한 경우</li>
                            <li>기타 회사의 정책에 적합하지 않은 경우</li>
                        </ul>

                        <p>제 4 조 (서비스의 제공)</p>
                        <p>1. 회사는 사이트를 통해 다음의 서비스를 제공합니다:</p>
                        <ul>
                            <li>상품의 가격 정보를 게시하고, 상품 구매 기능 제공</li>
                            <li>사용자 문의 및 상담 서비스 제공</li>
                        </ul>
                        <p>2. 서비스의 내용 및 운영 방식은 회사의 정책에 따라 변경될 수 있으며, 고객에게 사전 공지
                            후 변경됩니다.</p>

                        <p>제 5 조 (이용자의 의무)</p>
                        <p>1. 이용자는 서비스 이용 시 다음의 사항을 준수해야 합니다:</p>
                        <ul>
                            <li>관련 법령 및 본 약관을 준수할 것</li>
                            <li>타인의 권리를 침해하지 않을 것</li>
                            <li>서비스를 불법적으로 사용하지 않을 것</li>
                        </ul>
                        <p>2. 이용자는 자신의 아이디 및 비밀번호를 안전하게 관리할 책임이 있습니다.</p>

                        <p>제 6 조 (서비스의 중단 및 종료)</p>
                        <p>1. 회사는 다음의 경우에 서비스의 제공을 중단할 수 있습니다:</p>
                        <ul>
                            <li>시스템의 정기 점검 및 유지보수</li>
                            <li>천재지변 등 불가항력적인 사유 발생</li>
                        </ul>
                        <p>2. 서비스 중단 및 종료에 따른 이용자의 피해에 대해 회사는 책임지지 않습니다.</p>

                        <p>제 7 조 (면책 조항)</p>
                        <p>1. 회사는 서비스 제공에 있어 모든 주의 의무를 다하였으나, 서비스 이용에 따른 손해에
                            대해서는 책임을 지지 않습니다.</p>
                        <p>2. 회사는 이용자가 제공한 정보의 정확성 및 신뢰성에 대해서 보장하지 않습니다.</p>

                        <p>제 8 조 (저작권)</p>
                        <p>1. 회사가 제공하는 모든 콘텐츠에 대한 저작권은 회사에 있으며, 무단 복제 및 배포를
                            금지합니다.</p>

                        <p>제 9 조 (분쟁 해결)</p>
                        <p>1. 본 약관과 관련된 분쟁은 서울중앙지방법원을 제1심 법원으로 합니다.</p>

                        <p>제 10 조 (기타)</p>
                        <p>1. 본 약관에서 정하지 않은 사항은 관련 법령 및 회사의 정책에 따릅니다.</p>

                        <p>시행일: [2024년 9월 10일]</p>
                    </div>
                </DialogContent>
            </Dialog>
        </MDBox>
    );
}

// Setting default values for the props of Footer
Footer.defaultProps = {
    email: 'songwc3@gmail.com',
};

// Typechecking props for the Footer
Footer.propTypes = {
    email: PropTypes.string,
};

export default Footer;
