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
//import { useEffect } from 'react';
//
//// react-router-dom components
//import { useLocation } from 'react-router-dom';
//
//// prop-types is a library for typechecking of props.
//import PropTypes from 'prop-types';
//
//// Material Dashboard 2 React components
//import MDBox from '../../../components/MD/MDBox';
//
//// Material Dashboard 2 React context
//import { useMaterialUIController, setLayout } from '../../../context';
//
//function DashboardLayout({ children }) {
//  const [controller, dispatch] = useMaterialUIController();
//  const { miniSidenav } = controller;
//  const { pathname } = useLocation();
//
//
//  useEffect(() => {
//    setLayout(dispatch, 'dashboard');
//  }, [pathname]);
//
//    return (
//        <MDBox
//            sx={({ breakpoints, transitions, functions: { pxToRem } }) => ({
//                p: 3,
//                position: 'relative',
//
//                [breakpoints.up('xl')]: {
//                    marginLeft: miniSidenav ? pxToRem(120) : pxToRem(215),
//                    transition: transitions.create(['margin-left', 'margin-right'], {
//                        easing: transitions.easing.easeInOut,
//                        duration: transitions.duration.standard,
//                    }),
//                },
//            })}
//        >
//            {children}
//        </MDBox>
//    );
//}
//
//// Typechecking props for the DashboardLayout
//DashboardLayout.propTypes = {
//  children: PropTypes.node.isRequired,
//};
//
//export default DashboardLayout;






// 상단바
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

//import { useEffect } from 'react';
//import { useLocation } from 'react-router-dom';
//import PropTypes from 'prop-types';
//import MDBox from '../../../components/MD/MDBox';
//import { useMaterialUIController, setLayout } from '../../../context';
//
//function DashboardLayout({ children }) {
//  const [controller, dispatch] = useMaterialUIController();
//  const { miniSidenav } = controller;
//  const { pathname } = useLocation();
//
//  useEffect(() => {
//    setLayout(dispatch, 'dashboard');
//  }, [pathname]);
//
//  return (
//    <MDBox
//      sx={({ breakpoints, transitions, functions: { pxToRem } }) => ({
//        p: 3,
//        position: 'relative',
//        marginTop: pxToRem(40), // 기본 상단 여백
//
//        // 화면 폭이 450px 이하일 때 적용
//        [breakpoints.down('xs')]: {
//          marginTop: pxToRem(100), // 450px 이하 화면에서 상단 여백을 크게 설정
//          display: 'flex',
//          flexDirection: 'column',
//          justifyContent: 'center', // 세로 방향으로 중앙 정렬
//        },
//
//        // 화면 폭이 600px 이하 (sm 이하)일 때 적용
//        [breakpoints.between('sm', 'md')]: {
//          marginTop: pxToRem(100), // sm 이상에서 상단 여백을 다르게 설정
//          display: 'flex',
//          flexDirection: 'column',
//          justifyContent: 'center', // 세로 방향으로 중앙 정렬
//        },
//
//        [breakpoints.up('md')]: {
//          marginTop: pxToRem(60), // sm 이상에서 상단 여백을 다르게 설정
//        },
//
//        [breakpoints.up('xl')]: {
//          marginLeft: miniSidenav ? pxToRem(120) : pxToRem(0),
//          transition: transitions.create(['margin-left', 'margin-right'], {
//            easing: transitions.easing.easeInOut,
//            duration: transitions.duration.standard,
//          }),
//        },
//      })}
//    >
//      {children}
//    </MDBox>
//  );
//}
//
//// DashboardLayout 컴포넌트의 props 타입체크
//DashboardLayout.propTypes = {
//  children: PropTypes.node.isRequired,
//};
//
//export default DashboardLayout;





// + 광고구역
import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import PropTypes from 'prop-types';
import MDBox from '../../../components/MD/MDBox';
import { useMaterialUIController, setLayout } from '../../../context';
import Footer from '../../../examples/Footer';

function DashboardLayout({ children }) {
  const [controller, dispatch] = useMaterialUIController();
  const { miniSidenav } = controller;
  const { pathname } = useLocation();

  useEffect(() => {
    setLayout(dispatch, 'dashboard');
  }, [pathname]);

  return (
    <MDBox
      sx={({ breakpoints, transitions, functions: { pxToRem } }) => ({
        p: 3,
        position: 'relative',
        marginTop: pxToRem(50), // 기본 상단 여백

        // 화면 폭이 450px 이하일 때 적용
        [breakpoints.down('xs')]: {
          marginTop: pxToRem(100), // 450px 이하 화면에서 상단 여백을 크게 설정
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center', // 세로 방향으로 중앙 정렬
        },

        // 화면 폭이 600px 이하 (sm 이하)일 때 적용
        [breakpoints.between('sm', 'md')]: {
          marginTop: pxToRem(100), // sm 이상에서 상단 여백을 다르게 설정
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center', // 세로 방향으로 중앙 정렬
        },

        [breakpoints.up('md')]: {
          marginTop: pxToRem(80), // sm 이상에서 상단 여백을 다르게 설정
        },

        [breakpoints.up('xl')]: {
          marginLeft: miniSidenav ? pxToRem(120) : pxToRem(0),
          transition: transitions.create(['margin-left', 'margin-right'], {
            easing: transitions.easing.easeInOut,
            duration: transitions.duration.standard,
          }),
        },
      })}
    >
      {/* 광고 구역 */}
      {/* <MDBox
      sx={{
        width: '70%',
        height: { xs: '2rem', sm: '7rem' }, // sm 이하 1.5cm, sm 이상 2cm
        margin: '0 auto',
        marginTop: 5,
        backgroundColor: '#f5f5f5', // 배경색 예시
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: '8px',
        boxShadow: 1,
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        zIndex: 10, // 광고가 다른 콘텐츠 위에 표시되도록 함
        marginBottom: '1rem' // 광고 구역과 그 아래 콘텐츠 사이의 여백
      }}
    >
      광고 영역
    </MDBox> */}
      {children}
      <Footer /> {/* Footer 컴포넌트 추가 */}
    </MDBox>
  );
}

// DashboardLayout 컴포넌트의 props 타입체크
DashboardLayout.propTypes = {
  children: PropTypes.node.isRequired,
};

export default DashboardLayout;
