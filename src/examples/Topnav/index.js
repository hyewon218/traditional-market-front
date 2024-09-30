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
    // { name: '내정보', route: '/myinfo', visible: isAuthorization }, // 로그인 시 하단바에 출력
    { name: '장바구니', route: '/cart', visible: isAuthorization },
    { name: '1:1 채팅상담', route: '/chat', visible: isAuthorization },
    { name: '알람', route: '/alarms', visible: isAuthorization },
    { name: '문의하기', route: '/postinquiry', visible: isMember || isSeller },
    { name: '로그아웃', route: '/authentication/logout', visible: isAuthorization },
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
          backgroundColor: '#ECEFF3', // 흰색 배경
          color: 'black', // 검정색 글씨
          zIndex: (theme) => theme.zIndex.drawer + 1, // 드로워보다 위에 표시
          '@media (max-width: 600px)': {
            flexDirection: 'column',
            zIndex: 1200,
          },
        }}
      >
        <Toolbar
          sx={{
            justifyContent: 'space-between',
            flexDirection: 'row',
            '@media (max-width: 600px)': {
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
            //gap: '0.5rem', // 메뉴 항목 간의 간격 추가
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
                  fontSize: '0.9rem',
                  fontFamily: 'JalnanGothic',
                  padding: '0.75rem 1.5rem',
                  backgroundColor: location.pathname === item.route ? '#ADD8E6' : 'transparent',
                  '&:hover': {
                    backgroundColor: '#ADD8E6',
                  },
                  whiteSpace: 'nowrap',
                  margin: '0rem', // 버튼 간의 간격 추가
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
                  fontSize: '0.9rem',
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
            {isAuthorization && (
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
            )}
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
