//import { useState } from 'react';
//import { Link } from 'react-router-dom';
//import PropTypes from 'prop-types';
//import AppBar from '@mui/material/AppBar';
//import Toolbar from '@mui/material/Toolbar';
//import Typography from '@mui/material/Typography';
//import Button from '@mui/material/Button';
//import Box from '@mui/material/Box';
//import Menu from '@mui/material/Menu';
//import MenuItem from '@mui/material/MenuItem';
//import useCustomLogin from '../../hooks/useCustomLogin';
//import navbarLogoLabel from '../../examples/Topnav/styles/navbarLogoLabel';
//
//function Topnav({ brandName }) {
//  const { isAuthorization, isAdmin, isSeller, isMember } = useCustomLogin();
//  const [adminMenuAnchor, setAdminMenuAnchor] = useState(null);
//  const [sellerMenuAnchor, setSellerMenuAnchor] = useState(null);
//
//  // 권한에 따른 메뉴 항목
//  const menuItems = [
//    { name: '시장', route: '/market', visible: true },
//    { name: '공지사항', route: '/notice', visible: true },
//    { name: '로그인', route: '/authentication/signin', visible: !isAuthorization },
//    { name: '회원가입', route: '/authentication/signup', visible: !isAuthorization },
//    { name: '로그아웃', route: '/authentication/logout', visible: isAuthorization },
//    { name: '내정보', route: '/myinfo', visible: isAuthorization },
//    { name: '장바구니', route: '/cart', visible: isAuthorization },
//    { name: '1:1 채팅상담', route: '/chat', visible: isAuthorization },
//    { name: '알람', route: '/alarms', visible: isAuthorization },
//    { name: '문의하기', route: '/postinquiry', visible: isMember || isSeller },
//    { name: '상점 관리', route: '/shop-manage-seller', visible: false },
//    { name: '주문 관리', route: '/order-manage-seller', visible: false },
//    { name: '홈페이지 현황', route: '/outline', visible: false },
//    { name: '회원 관리', route: '/membermanage', visible: false },
//    { name: '주문 관리', route: '/order-manage', visible: false },
//    { name: '시장 관리', route: '/marketmanage', visible: false },
//    { name: '상점 관리', route: '/shopmanage', visible: false },
//    { name: '상품 관리', route: '/itemmanage', visible: false },
//    { name: '문의사항 관리', route: '/inquirymanage', visible: false },
//    { name: '공지사항 관리', route: '/noticemanage', visible: false },
//  ];
//
//  // 관리자 메뉴 클릭 핸들러
//  const handleAdminMenuClick = (event) => {
//    setAdminMenuAnchor(adminMenuAnchor ? null : event.currentTarget);
//  };
//
//  // 판매자 메뉴 클릭 핸들러
//  const handleSellerMenuClick = (event) => {
//    setSellerMenuAnchor(sellerMenuAnchor ? null : event.currentTarget);
//  };
//
//  // 관리자가 볼 수 있는 드롭다운 메뉴 항목 (seller가 붙은 항목 제외)
//  const adminMenuItems = menuItems.filter(
//    (item) => item.route.includes('manage') && !item.route.includes('seller')
//  );
//
//  // 판매자가 볼 수 있는 드롭다운 메뉴 항목 (seller가 붙은 항목만)
//  const sellerMenuItems = menuItems.filter(
//    (item) => item.route.includes('seller')
//  );
//
//  return (
//    <AppBar position="fixed">
//      <Toolbar sx={{ justifyContent: 'space-between' }}>
//        {/* 브랜드 이름 */}
//        <Typography
//          variant="h2" // 글꼴 크기 더 크게 설정
//          component={Link} // Link 컴포넌트로 설정하여 클릭 시 /market으로 이동
//          to="/market"
//          sx={{
//            ...navbarLogoLabel,
//            color: 'black', // 검정색으로 변경
//            fontWeight: 'bold', // 글자 두께 조정
//            textDecoration: 'none', // 링크 텍스트의 기본 밑줄 제거
//          }}
//        >
//          {brandName}
//        </Typography>
//
//        {/* 메뉴 항목 */}
//        <Box
//          sx={{
//            display: 'flex',
//            gap: 2, // 간격 조정
//            flexWrap: 'nowrap', // 한 줄에 출력되도록 설정
//          }}
//        >
//          {menuItems
//            .filter((item) => item.visible) // visible이 true인 항목만 렌더링
//            .map((item) => (
//              <Button
//                key={item.route}
//                color="inherit"
//                component={Link} // Link 컴포넌트 사용
//                to={item.route} // href 대신 to 사용
//                sx={{
//                  fontSize: '1rem', // 버튼 글꼴 크기
//                  padding: '0.75rem 1.5rem', // 버튼의 상하 좌우 패딩
//                }}
//              >
//                {item.name}
//              </Button>
//            ))}
//
//          {/* 관리자 페이지 버튼 및 드롭다운 메뉴 */}
//          {isAdmin && (
//            <>
//              <Button
//                color="inherit"
//                onClick={handleAdminMenuClick}
//                sx={{
//                  fontSize: '1rem', // 버튼 글꼴 크기
//                  padding: '0.75rem 1.5rem', // 버튼의 상하 좌우 패딩
//                }}
//              >
//                관리자페이지
//              </Button>
//              <Menu
//                anchorEl={adminMenuAnchor}
//                open={Boolean(adminMenuAnchor)}
//                onClose={() => setAdminMenuAnchor(null)}
//              >
//                {adminMenuItems.map((item) => (
//                  <MenuItem
//                    key={item.route}
//                    component={Link}
//                    to={item.route}
//                    onClick={() => setAdminMenuAnchor(null)} // 클릭 시 드롭다운 닫기
//                  >
//                    {item.name}
//                  </MenuItem>
//                ))}
//              </Menu>
//            </>
//          )}
//
//          {/* 판매자 페이지 버튼 및 드롭다운 메뉴 */}
//          {isSeller && (
//            <>
//              <Button
//                color="inherit"
//                onClick={handleSellerMenuClick}
//                sx={{
//                  fontSize: '1rem', // 버튼 글꼴 크기
//                  padding: '0.75rem 1.5rem', // 버튼의 상하 좌우 패딩
//                }}
//              >
//                판매자페이지
//              </Button>
//              <Menu
//                anchorEl={sellerMenuAnchor}
//                open={Boolean(sellerMenuAnchor)}
//                onClose={() => setSellerMenuAnchor(null)}
//              >
//                {sellerMenuItems.map((item) => (
//                  <MenuItem
//                    key={item.route}
//                    component={Link}
//                    to={item.route}
//                    onClick={() => setSellerMenuAnchor(null)} // 클릭 시 드롭다운 닫기
//                  >
//                    {item.name}
//                  </MenuItem>
//                ))}
//              </Menu>
//            </>
//          )}
//        </Box>
//      </Toolbar>
//    </AppBar>
//  );
//}
//
//// Topnav 컴포넌트의 기본 props 설정
//Topnav.defaultProps = {
//  brandName: '우리동네 전통시장',
//};
//
//// Topnav 컴포넌트의 props 타입체크
//Topnav.propTypes = {
//  brandName: PropTypes.string,
//};
//
//export default Topnav;





// 하단바 추가(sm 이하일 경우만 추가), 상단바와 하단바 배경색 및 효과 설정
//import { useState } from 'react';
//import { Link, useLocation } from 'react-router-dom'; // useLocation 훅 추가
//import PropTypes from 'prop-types';
//import AppBar from '@mui/material/AppBar';
//import Toolbar from '@mui/material/Toolbar';
//import Typography from '@mui/material/Typography';
//import Button from '@mui/material/Button';
//import Box from '@mui/material/Box';
//import Menu from '@mui/material/Menu';
//import MenuItem from '@mui/material/MenuItem';
//import useCustomLogin from '../../hooks/useCustomLogin';
//import navbarLogoLabel from '../../examples/Topnav/styles/navbarLogoLabel';
//import NavbarCollapse from '../../examples/Topnav/NavbarCollapse';
//
//function Topnav({ brandName }) {
//  const { isAuthorization, isAdmin, isSeller, isMember } = useCustomLogin();
//  const [adminMenuAnchor, setAdminMenuAnchor] = useState(null);
//  const [sellerMenuAnchor, setSellerMenuAnchor] = useState(null);
//  const location = useLocation(); // 현재 위치 가져오기
//
//  // 권한에 따른 메뉴 항목
//  const menuItems = [
//    { name: '시장', route: '/market', visible: true },
//    { name: '공지사항', route: '/notice', visible: true },
//    { name: '로그인', route: '/authentication/signin', visible: !isAuthorization },
//    { name: '회원가입', route: '/authentication/signup', visible: !isAuthorization },
//    { name: '로그아웃', route: '/authentication/logout', visible: isAuthorization },
//    { name: '내정보', route: '/myinfo', visible: isAuthorization },
//    { name: '장바구니', route: '/cart', visible: isAuthorization },
//    { name: '1:1 채팅상담', route: '/chat', visible: isAuthorization },
//    { name: '알람', route: '/alarms', visible: isAuthorization },
//    { name: '문의하기', route: '/postinquiry', visible: isMember || isSeller },
//    { name: '상점 관리', route: '/shop-manage-seller', visible: false },
//    { name: '주문 관리', route: '/order-manage-seller', visible: false },
//    { name: '홈페이지 현황', route: '/outline', visible: false },
//    { name: '회원 관리', route: '/membermanage', visible: false },
//    { name: '주문 관리', route: '/order-manage', visible: false },
//    { name: '시장 관리', route: '/marketmanage', visible: false },
//    { name: '상점 관리', route: '/shopmanage', visible: false },
//    { name: '상품 관리', route: '/itemmanage', visible: false },
//    { name: '문의사항 관리', route: '/inquirymanage', visible: false },
//    { name: '공지사항 관리', route: '/noticemanage', visible: false },
//  ];
//
//  // 관리자 메뉴 클릭 핸들러
//  const handleAdminMenuClick = (event) => {
//    setAdminMenuAnchor(adminMenuAnchor ? null : event.currentTarget);
//  };
//
//  // 판매자 메뉴 클릭 핸들러
//  const handleSellerMenuClick = (event) => {
//    setSellerMenuAnchor(sellerMenuAnchor ? null : event.currentTarget);
//  };
//
//  // 관리자가 볼 수 있는 드롭다운 메뉴 항목 (seller가 붙은 항목 제외)
//  const adminMenuItems = menuItems.filter(
//    (item) => item.route.includes('manage') && !item.route.includes('seller')
//  );
//
//  // 판매자가 볼 수 있는 드롭다운 메뉴 항목 (seller가 붙은 항목만)
//  const sellerMenuItems = menuItems.filter(
//    (item) => item.route.includes('seller')
//  );
//
//  return (
//    <>
//      {/* 상단바 */}
//      <AppBar
//        position="fixed"
//        sx={{
//          backgroundColor: '#f5f5f5', // 흰색 배경
//          color: 'black', // 검정색 글씨
//        }}
//      >
//        <Toolbar sx={{ justifyContent: 'space-between' }}>
//          {/* 브랜드 이름 */}
//          <Typography
//            variant="h2"
//            component={Link}
//            to="/market"
//            sx={{
//              ...navbarLogoLabel,
//              color: 'black',
//              fontWeight: 'bold',
//              textDecoration: 'none',
//              fontFamily: 'JalnanGothic',
//            }}
//          >
//            {brandName}
//          </Typography>
//
//          {/* 메뉴 항목 */}
//          <Box
//            sx={{
//              display: 'flex',
//              gap: 2,
//              flexWrap: 'nowrap',
//            }}
//          >
//            {menuItems
//              .filter((item) => item.visible)
//              .map((item) => (
//                <Button
//                  key={item.route}
//                  color={location.pathname === item.route ? 'primary' : 'inherit'} // 선택된 항목의 색상을 파란색으로 설정
//                  component={Link}
//                  to={item.route}
//                  sx={{
//                    fontSize: '1rem',
//                    fontFamily: 'JalnanGothic',
//                    padding: '0.75rem 1.5rem',
//                    backgroundColor: location.pathname === item.route ? '#ADD8E6' : 'transparent', // 선택된 항목 배경색을 밝은 파란색으로 설정
//                    '&:hover': {
//                      backgroundColor: '#ADD8E6', // hover 시 배경색도 밝은 파란색으로 설정
//                    },
//                  }}
//                >
//                  {item.name}
//                </Button>
//              ))}
//
//            {/* 관리자 페이지 버튼 및 드롭다운 메뉴 */}
//            {isAdmin && (
//              <>
//                <Button
//                  color="inherit"
//                  onClick={handleAdminMenuClick}
//                  sx={{
//                    fontSize: '1rem',
//                    fontFamily: 'JalnanGothic',
//                    padding: '0.75rem 1.5rem',
//                    color: 'black',
//                  }}
//                >
//                  관리자페이지
//                </Button>
//                <Menu
//                  anchorEl={adminMenuAnchor}
//                  open={Boolean(adminMenuAnchor)}
//                  onClose={() => setAdminMenuAnchor(null)}
//                >
//                  {adminMenuItems.map((item) => (
//                    <MenuItem
//                      key={item.route}
//                      component={Link}
//                      to={item.route}
//                      onClick={() => setAdminMenuAnchor(null)}
//                      sx={{
//                        color: 'black',
//                        fontFamily: 'JalnanGothic',
//                      }}
//                    >
//                      {item.name}
//                    </MenuItem>
//                  ))}
//                </Menu>
//              </>
//            )}
//
//            {/* 판매자 페이지 버튼 및 드롭다운 메뉴 */}
//            {isSeller && (
//              <>
//                <Button
//                  color="inherit"
//                  onClick={handleSellerMenuClick}
//                  sx={{
//                    fontSize: '1rem',
//                    fontFamily: 'JalnanGothic',
//                    padding: '0.75rem 1.5rem',
//                    color: 'black',
//                  }}
//                >
//                  판매자페이지
//                </Button>
//                <Menu
//                  anchorEl={sellerMenuAnchor}
//                  open={Boolean(sellerMenuAnchor)}
//                  onClose={() => setSellerMenuAnchor(null)}
//                >
//                  {sellerMenuItems.map((item) => (
//                    <MenuItem
//                      key={item.route}
//                      component={Link}
//                      to={item.route}
//                      onClick={() => setSellerMenuAnchor(null)}
//                      sx={{
//                        color: 'black',
//                        fontFamily: 'JalnanGothic',
//                      }}
//                    >
//                      {item.name}
//                    </MenuItem>
//                  ))}
//                </Menu>
//              </>
//            )}
//          </Box>
//        </Toolbar>
//      </AppBar>
//
//      {/* 하단바 */}
//      <AppBar
//        position="fixed"
//        sx={{
//          top: 'auto',
//          bottom: 0,
//          display: { lg: 'block', xl: 'none' }, // 화면 폭이 sm 이하일 경우에만 표시
//          zIndex: (theme) => theme.zIndex.drawer + 1,
//          backgroundColor: '#f5f5f5', // 흰색 배경
//          color: 'black', // 검정색 글씨
//        }}
//      >
//        <Toolbar>
//          <Box
//            sx={{
//              display: 'flex',
//              gap: 2,
//              width: '100%',
//              justifyContent: 'center',
//            }}
//          >
//            <Button
//              color="inherit"
//              component={Link}
//              to="/market"
//              sx={{
//                fontSize: '1rem',
//                padding: '0.75rem 1.5rem',
//                color: 'black',
//                fontFamily: 'JalnanGothic',
//              }}
//            >
//              시장
//            </Button>
//            <Button
//              color="inherit"
//              component={Link}
//              to="/myinfo"
//              sx={{
//                fontSize: '1rem',
//                padding: '0.75rem 1.5rem',
//                color: 'black',
//                fontFamily: 'JalnanGothic',
//              }}
//            >
//              내정보
//            </Button>
//          </Box>
//        </Toolbar>
//      </AppBar>
//    </>
//  );
//}
//
//// Topnav 컴포넌트의 기본 props 설정
//Topnav.defaultProps = {
//  brandName: '우리동네 전통시장',
//};
//
//// Topnav 컴포넌트의 props 타입체크
//Topnav.propTypes = {
//  brandName: PropTypes.string,
//};
//
//export default Topnav;







// 왼쪽 브랜드 이미지 추가
//import { useState } from 'react';
//import { Link, useLocation } from 'react-router-dom';
//import PropTypes from 'prop-types';
//import AppBar from '@mui/material/AppBar';
//import Toolbar from '@mui/material/Toolbar';
//import Box from '@mui/material/Box';
//import Button from '@mui/material/Button';
//import Menu from '@mui/material/Menu';
//import MenuItem from '@mui/material/MenuItem';
//import useCustomLogin from '../../hooks/useCustomLogin';
//import navbarLogoLabel from '../../examples/Topnav/styles/navbarLogoLabel';
//
//function Topnav({ brandName, logoSrc }) { // logoSrc를 추가하여 이미지 소스를 받을 수 있도록 수정
//  const { isAuthorization, isAdmin, isSeller, isMember } = useCustomLogin();
//  const [adminMenuAnchor, setAdminMenuAnchor] = useState(null);
//  const [sellerMenuAnchor, setSellerMenuAnchor] = useState(null);
//  const location = useLocation();
//
//  // 권한에 따른 메뉴 항목
//  const menuItems = [
//    { name: '시장', route: '/market', visible: true },
//    { name: '공지사항', route: '/notice', visible: true },
//    { name: '로그인', route: '/authentication/signin', visible: !isAuthorization },
//    { name: '회원가입', route: '/authentication/signup', visible: !isAuthorization },
//    { name: '로그아웃', route: '/authentication/logout', visible: isAuthorization },
//    { name: '내정보', route: '/myinfo', visible: isAuthorization },
//    { name: '장바구니', route: '/cart', visible: isAuthorization },
//    { name: '1:1 채팅상담', route: '/chat', visible: isAuthorization },
//    { name: '알람', route: '/alarms', visible: isAuthorization },
//    { name: '문의하기', route: '/postinquiry', visible: isMember || isSeller },
//    { name: '상점 관리', route: '/shop-manage-seller', visible: false },
//    { name: '주문 관리', route: '/order-manage-seller', visible: false },
//    { name: '홈페이지 현황', route: '/outline', visible: false },
//    { name: '회원 관리', route: '/membermanage', visible: false },
//    { name: '주문 관리', route: '/order-manage', visible: false },
//    { name: '시장 관리', route: '/marketmanage', visible: false },
//    { name: '상점 관리', route: '/shopmanage', visible: false },
//    { name: '상품 관리', route: '/itemmanage', visible: false },
//    { name: '문의사항 관리', route: '/inquirymanage', visible: false },
//    { name: '공지사항 관리', route: '/noticemanage', visible: false },
//  ];
//
//  // 관리자 메뉴 클릭 핸들러
//  const handleAdminMenuClick = (event) => {
//    setAdminMenuAnchor(adminMenuAnchor ? null : event.currentTarget);
//  };
//
//  // 판매자 메뉴 클릭 핸들러
//  const handleSellerMenuClick = (event) => {
//    setSellerMenuAnchor(sellerMenuAnchor ? null : event.currentTarget);
//  };
//
//  // 관리자가 볼 수 있는 드롭다운 메뉴 항목 (seller가 붙은 항목 제외)
//  const adminMenuItems = menuItems.filter(
//    (item) => item.route.includes('manage') && !item.route.includes('seller')
//  );
//
//  // 판매자가 볼 수 있는 드롭다운 메뉴 항목 (seller가 붙은 항목만)
//  const sellerMenuItems = menuItems.filter(
//    (item) => item.route.includes('seller')
//  );
//
//  return (
//    <>
//      {/* 상단바 */}
//      <AppBar
//        position="fixed"
//        sx={{
//          backgroundColor: '#f5f5f5', // 흰색 배경
//          color: 'black', // 검정색 글씨
//        }}
//      >
//        <Toolbar sx={{ justifyContent: 'space-between' }}>
//          {/* 브랜드 로고 이미지 */}
//          <Box component={Link} to="/market" sx={{ display: 'flex', alignItems: 'center' }}>
//            <img
//              src={logoSrc} // 로고 이미지 소스
//              alt="Brand Logo"
//              style={{ height: '90px', width: 'auto' }} // 적절한 크기로 조정
//            />
//          </Box>
//
//          {/* 메뉴 항목 */}
//          <Box
//            sx={{
//              display: 'flex',
//              gap: 2,
//              flexWrap: 'nowrap',
//            }}
//          >
//            {menuItems
//              .filter((item) => item.visible)
//              .map((item) => (
//                <Button
//                  key={item.route}
//                  color={location.pathname === item.route ? 'primary' : 'inherit'} // 선택된 항목의 색상을 파란색으로 설정
//                  component={Link}
//                  to={item.route}
//                  sx={{
//                    fontSize: '1rem',
//                    fontFamily: 'JalnanGothic',
//                    padding: '0.75rem 1.5rem',
//                    backgroundColor: location.pathname === item.route ? '#ADD8E6' : 'transparent', // 선택된 항목 배경색을 밝은 파란색으로 설정
//                    '&:hover': {
//                      backgroundColor: '#ADD8E6', // hover 시 배경색도 밝은 파란색으로 설정
//                    },
//                  }}
//                >
//                  {item.name}
//                </Button>
//              ))}
//
//            {/* 관리자 페이지 버튼 및 드롭다운 메뉴 */}
//            {isAdmin && (
//              <>
//                <Button
//                  color="inherit"
//                  onClick={handleAdminMenuClick}
//                  sx={{
//                    fontSize: '1rem',
//                    fontFamily: 'JalnanGothic',
//                    padding: '0.75rem 1.5rem',
//                    color: 'black',
//                  }}
//                >
//                  관리자페이지
//                </Button>
//                <Menu
//                  anchorEl={adminMenuAnchor}
//                  open={Boolean(adminMenuAnchor)}
//                  onClose={() => setAdminMenuAnchor(null)}
//                >
//                  {adminMenuItems.map((item) => (
//                    <MenuItem
//                      key={item.route}
//                      component={Link}
//                      to={item.route}
//                      onClick={() => setAdminMenuAnchor(null)}
//                      sx={{
//                        color: 'black',
//                        fontFamily: 'JalnanGothic',
//                      }}
//                    >
//                      {item.name}
//                    </MenuItem>
//                  ))}
//                </Menu>
//              </>
//            )}
//
//            {/* 판매자 페이지 버튼 및 드롭다운 메뉴 */}
//            {isSeller && (
//              <>
//                <Button
//                  color="inherit"
//                  onClick={handleSellerMenuClick}
//                  sx={{
//                    fontSize: '1rem',
//                    fontFamily: 'JalnanGothic',
//                    padding: '0.75rem 1.5rem',
//                    color: 'black',
//                  }}
//                >
//                  판매자페이지
//                </Button>
//                <Menu
//                  anchorEl={sellerMenuAnchor}
//                  open={Boolean(sellerMenuAnchor)}
//                  onClose={() => setSellerMenuAnchor(null)}
//                >
//                  {sellerMenuItems.map((item) => (
//                    <MenuItem
//                      key={item.route}
//                      component={Link}
//                      to={item.route}
//                      onClick={() => setSellerMenuAnchor(null)}
//                      sx={{
//                        color: 'black',
//                        fontFamily: 'JalnanGothic',
//                      }}
//                    >
//                      {item.name}
//                    </MenuItem>
//                  ))}
//                </Menu>
//              </>
//            )}
//          </Box>
//        </Toolbar>
//      </AppBar>
//
//      {/* 하단바 */}
//      <AppBar
//        position="fixed"
//        sx={{
//          top: 'auto',
//          bottom: 0,
//          display: { lg: 'block', xl: 'none' }, // 화면 폭이 sm 이하일 경우에만 표시
//          zIndex: (theme) => theme.zIndex.drawer + 1,
//          backgroundColor: '#f5f5f5', // 흰색 배경
//          color: 'black', // 검정색 글씨
//        }}
//      >
//        <Toolbar>
//          <Box
//            sx={{
//              display: 'flex',
//              gap: 2,
//              width: '100%',
//              justifyContent: 'center',
//            }}
//          >
//            <Button
//              color="inherit"
//              component={Link}
//              to="/market"
//              sx={{
//                fontSize: '1rem',
//                padding: '0.75rem 1.5rem',
//                color: 'black',
//                fontFamily: 'JalnanGothic',
//              }}
//            >
//              시장
//            </Button>
//            <Button
//              color="inherit"
//              component={Link}
//              to="/myinfo"
//              sx={{
//                fontSize: '1rem',
//                padding: '0.75rem 1.5rem',
//                color: 'black',
//                fontFamily: 'JalnanGothic',
//              }}
//            >
//              내정보
//            </Button>
//          </Box>
//        </Toolbar>
//      </AppBar>
//    </>
//  );
//}
//
//// Topnav 컴포넌트의 기본 props 설정
//Topnav.defaultProps = {
//  brandName: '우리동네 전통시장',
//  logoSrc: '/brand_logo.png', // 기본 로고 이미지 경로
//};
//
//// Topnav 컴포넌트의 props 타입체크
//Topnav.propTypes = {
//  brandName: PropTypes.string,
//  logoSrc: PropTypes.string, // logoSrc를 문자열로 타입체크
//};
//
//export default Topnav;





// 반응형
import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import PropTypes from 'prop-types';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import useCustomLogin from '../../hooks/useCustomLogin';

function Topnav({ brandName, logoSrc }) {
  const { isAuthorization, isAdmin, isSeller, isMember } = useCustomLogin();
  const [adminMenuAnchor, setAdminMenuAnchor] = useState(null);
  const [sellerMenuAnchor, setSellerMenuAnchor] = useState(null);
  const [profileMenuAnchor, setProfileMenuAnchor] = useState(null);
  const location = useLocation();

  const menuItems = [
    { name: '시장', route: '/market', visible: true },
    { name: '공지사항', route: '/notice', visible: true },
    { name: '로그인', route: '/authentication/signin', visible: !isAuthorization },
    { name: '회원가입', route: '/authentication/signup', visible: !isAuthorization },
    { name: '로그아웃', route: '/authentication/logout', visible: isAuthorization },
    { name: '내정보', route: '/myinfo', visible: isAuthorization },
    { name: '장바구니', route: '/cart', visible: isAuthorization },
    { name: '1:1 채팅상담', route: '/chat', visible: isAuthorization },
    { name: '알람', route: '/alarms', visible: isAuthorization },
    { name: '문의하기', route: '/postinquiry', visible: isMember || isSeller },
    { name: '상점 관리', route: '/shop-manage-seller', visible: false },
    { name: '주문 관리', route: '/order-manage-seller', visible: false },
    { name: '홈페이지 현황', route: '/outline', visible: false },
    { name: '회원 관리', route: '/membermanage', visible: false },
    { name: '주문 관리', route: '/order-manage', visible: false },
    { name: '시장 관리', route: '/marketmanage', visible: false },
    { name: '상점 관리', route: '/shopmanage', visible: false },
    { name: '상품 관리', route: '/itemmanage', visible: false },
    { name: '문의사항 관리', route: '/inquirymanage', visible: false },
    { name: '공지사항 관리', route: '/noticemanage', visible: false },
  ];

  const handleAdminMenuClick = (event) => {
    setAdminMenuAnchor(adminMenuAnchor ? null : event.currentTarget);
  };

  const handleSellerMenuClick = (event) => {
    setSellerMenuAnchor(sellerMenuAnchor ? null : event.currentTarget);
  };

  const adminMenuItems = menuItems.filter(
    (item) => item.route.includes('manage') && !item.route.includes('seller') || item.route === '/outline'
  );

  const sellerMenuItems = menuItems.filter(
    (item) => item.route.includes('seller')
  );

  return (
    <>
      {/* 상단바 */}
      <AppBar
        position="fixed"
        sx={{
          backgroundColor: '#f5f5f5', // 흰색 배경
          color: 'black', // 검정색 글씨
          zIndex: (theme) => theme.zIndex.drawer + 1, // 드로워보다 위에 표시
          '@media (max-width: 900px)': {
            flexDirection: 'column',
            zIndex: 1200,
          },
        }}
      >
        <Toolbar
          sx={{
            justifyContent: 'space-between',
            flexDirection: 'row',
            '@media (max-width: 900px)': {
              flexDirection: 'column',
              alignItems: 'center',
            },
          }}
        >
          {/* 모바일 환경에서는 로고가 가장 상단에 위치 */}
          <Box
            component={Link}
            to="/market"
            sx={{
              display: { xs: 'flex', sm: 'flex', md: 'flex', lg:'none' }, // 모바일에서만 로고 표시
              alignItems: 'center',
              mb: 1, // 모바일에서 하단 여백 추가
              justifyContent: 'center',
              width: '100%',
            }}
          >
            <img
              src={logoSrc}
              alt="Brand Logo"
              style={{ height: '90px', width: 'auto' }}
            />
          </Box>

          {/* 데스크탑 환경에서 로고와 메뉴 항목 배치 */}
          <Box
            sx={{
              display: { xs: 'none', sm: 'none', md: 'none', lg:'flex' }, // 데스크탑에서만 로고 표시
              alignItems: 'center',
              justifyContent: 'flex-start',
              width: '100%',
            }}
          >
            <Box
              component={Link}
              to="/market"
              sx={{
                display: 'flex',
                alignItems: 'center',
                width: 'auto',
                justifyContent: 'center',
              }}
            >
              <img
                src={logoSrc}
                alt="Brand Logo"
                style={{ height: '90px', width: 'auto' }}
              />
            </Box>
          </Box>

          {/* 데스크탑 환경의 메뉴 항목 */}
          <Box
            sx={{
              display: { xs: 'none', sm: 'flex' }, // 데스크탑에서만 메뉴 항목 표시
              justifyContent: 'flex-end',
              overflowX: 'auto', // 가로 스크롤 추가
              whiteSpace: 'nowrap', // 메뉴 항목이 한 줄로 표시되도록
              padding: '0 1rem', // 좌우 여백 추가
              width: '100%',
              boxSizing: 'border-box',
            }}
          >
            {menuItems
              .filter((item) => item.visible)
              .map((item) => (
                <Button
                  key={item.route}
                  color={location.pathname === item.route ? 'primary' : 'inherit'}
                  component={Link}
                  to={item.route}
                  sx={{
                    fontSize: '1rem',
                    fontFamily: 'JalnanGothic',
                    padding: '0.75rem 1.5rem',
                    backgroundColor: location.pathname === item.route ? '#ADD8E6' : 'transparent',
                    '&:hover': {
                      backgroundColor: '#ADD8E6',
                    },
                    whiteSpace: 'nowrap',
                  }}
                >
                  {item.name}
                </Button>
              ))}

            {/* 관리자 페이지 버튼 및 드롭다운 메뉴 */}
            {isAdmin && (
              <>
                <Button
                  color="inherit"
                  onClick={handleAdminMenuClick}
                  sx={{
                    fontSize: '1rem',
                    fontFamily: 'JalnanGothic',
                    padding: '0.75rem 1.5rem',
                    color: 'black',
                    whiteSpace: 'nowrap',
                  }}
                >
                  관리자페이지
                </Button>
                <Menu
                  anchorEl={adminMenuAnchor}
                  open={Boolean(adminMenuAnchor)}
                  onClose={() => setAdminMenuAnchor(null)}
                >
                  {adminMenuItems.map((item) => (
                    <MenuItem
                      key={item.route}
                      component={Link}
                      to={item.route}
                      onClick={() => setAdminMenuAnchor(null)}
                      sx={{
                        color: 'black',
                        fontFamily: 'JalnanGothic',
                      }}
                    >
                      {item.name}
                    </MenuItem>
                  ))}
                </Menu>
              </>
            )}

            {/* 판매자 페이지 버튼 및 드롭다운 메뉴 */}
            {isSeller && (
              <>
                <Button
                  color="inherit"
                  onClick={handleSellerMenuClick}
                  sx={{
                    fontSize: '1rem',
                    fontFamily: 'JalnanGothic',
                    padding: '0.75rem 1.5rem',
                    color: 'black',
                    whiteSpace: 'nowrap',
                  }}
                >
                  판매자페이지
                </Button>
                <Menu
                  anchorEl={sellerMenuAnchor}
                  open={Boolean(sellerMenuAnchor)}
                  onClose={() => setSellerMenuAnchor(null)}
                >
                  {sellerMenuItems.map((item) => (
                    <MenuItem
                      key={item.route}
                      component={Link}
                      to={item.route}
                      onClick={() => setSellerMenuAnchor(null)}
                      sx={{
                        color: 'black',
                        fontFamily: 'JalnanGothic',
                      }}
                    >
                      {item.name}
                    </MenuItem>
                  ))}
                </Menu>
              </>
            )}
          </Box>
        </Toolbar>

        {/* 모바일 환경의 메뉴 항목 */}
        <Box
          sx={{
            display: { xs: 'flex', sm: 'none' }, // 모바일에서만 메뉴 항목 표시
            overflowX: 'auto', // 가로 스크롤 추가
            whiteSpace: 'nowrap', // 메뉴 항목이 한 줄로 표시되도록
            padding: '0 1rem', // 좌우 여백 추가
            width: '100%',
            boxSizing: 'border-box',
            WebkitOverflowScrolling: 'touch', // 터치 스크롤을 지원하도록 설정
            gap: '0.5rem', // 메뉴 항목 간의 간격 추가
            flexWrap: 'nowrap', // 메뉴 항목이 한 줄로 유지되도록
          }}
        >
          {menuItems
            .filter((item) => item.visible)
            .map((item) => (
              <Button
                key={item.route}
                color={location.pathname === item.route ? 'primary' : 'inherit'}
                component={Link}
                to={item.route}
                sx={{
                  fontSize: '1rem',
                  fontFamily: 'JalnanGothic',
                  padding: '0.75rem 1.5rem',
                  backgroundColor: location.pathname === item.route ? '#ADD8E6' : 'transparent',
                  '&:hover': {
                    backgroundColor: '#ADD8E6',
                  },
                  whiteSpace: 'nowrap',
                  margin: '0 0.25rem', // 버튼 간의 간격 추가
                  flex: '1 1 auto', // 버튼 너비를 유동적으로 설정
                  minWidth: '90px', // 버튼의 최소 너비 설정
                }}
              >
                {item.name}
              </Button>
            ))}

          {/* 관리자 페이지 버튼 및 드롭다운 메뉴 */}
          {isAdmin && (
            <>
              <Button
                color="inherit"
                onClick={handleAdminMenuClick}
                sx={{
                  fontSize: '1rem',
                  fontFamily: 'JalnanGothic',
                  padding: '0.75rem 1.5rem',
                  color: 'black',
                  whiteSpace: 'nowrap',
                }}
              >
                관리자페이지
              </Button>
              <Menu
                anchorEl={adminMenuAnchor}
                open={Boolean(adminMenuAnchor)}
                onClose={() => setAdminMenuAnchor(null)}
              >
                {adminMenuItems.map((item) => (
                  <MenuItem
                    key={item.route}
                    component={Link}
                    to={item.route}
                    onClick={() => setAdminMenuAnchor(null)}
                    sx={{
                      color: 'black',
                      fontFamily: 'JalnanGothic',
                    }}
                  >
                    {item.name}
                  </MenuItem>
                ))}
              </Menu>
            </>
          )}

          {/* 판매자 페이지 버튼 및 드롭다운 메뉴 */}
          {isSeller && (
            <>
              <Button
                color="inherit"
                onClick={handleSellerMenuClick}
                sx={{
                  fontSize: '1rem',
                  fontFamily: 'JalnanGothic',
                  padding: '0.75rem 1.5rem',
                  color: 'black',
                  whiteSpace: 'nowrap',
                }}
              >
                판매자페이지
              </Button>
              <Menu
                anchorEl={sellerMenuAnchor}
                open={Boolean(sellerMenuAnchor)}
                onClose={() => setSellerMenuAnchor(null)}
              >
                {sellerMenuItems.map((item) => (
                  <MenuItem
                    key={item.route}
                    component={Link}
                    to={item.route}
                    onClick={() => setSellerMenuAnchor(null)}
                    sx={{
                      color: 'black',
                      fontFamily: 'JalnanGothic',
                    }}
                  >
                    {item.name}
                  </MenuItem>
                ))}
              </Menu>
            </>
          )}
        </Box>
      </AppBar>

      {/* 하단바 */}
      <AppBar
        position="fixed"
        sx={{
          top: 'auto',
          bottom: 0,
          display: { lg: 'none', xl: 'none' }, // 화면 폭이 lg 이하일 경우에만 표시
          zIndex: (theme) => theme.zIndex.drawer + 1,
          backgroundColor: '#f5f5f5', // 흰색 배경
          color: 'black', // 검정색 글씨
        }}
      >
        <Toolbar>
          <Box
            sx={{
              display: 'flex',
              gap: 2,
              width: '100%',
              justifyContent: 'center',
            }}
          >
            <Button
              color="inherit"
              component={Link}
              to="/market"
              sx={{
                fontSize: '1rem',
                padding: '0.75rem 1.5rem',
                color: 'black',
                fontFamily: 'JalnanGothic',
              }}
            >
              시장
            </Button>
            <Button
              color="inherit"
              component={Link}
              to="/myinfo"
              sx={{
                fontSize: '1rem',
                padding: '0.75rem 1.5rem',
                color: 'black',
                fontFamily: 'JalnanGothic',
              }}
            >
              내정보
            </Button>
          </Box>
        </Toolbar>
      </AppBar>
      {/* 여백 추가 */}
        <Box
          sx={{
            height: '100px', // 모바일 상단바 높이에 맞추기
            display: { xs: 'block', sm: 'none' }, // 모바일에서만 여백 표시
          }}
        />
    </>
  );
}

Topnav.defaultProps = {
  brandName: '우리동네 전통시장',
  logoSrc: '/brand_logo.png',
};

Topnav.propTypes = {
  brandName: PropTypes.string,
  logoSrc: PropTypes.string,
};

export default Topnav;
