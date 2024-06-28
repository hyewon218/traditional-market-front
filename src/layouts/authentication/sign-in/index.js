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
import {useState} from 'react';

// react-router-dom components
import {Link} from 'react-router-dom';
import {useNavigate} from 'react-router';

// @mui material components
import Card from '@mui/material/Card';
import Grid from '@mui/material/Grid';

// @mui icons
import {TransitionProps} from '@mui/material/transitions';

// Material Dashboard 2 React components
import MDBox from '../../../components/MD/MDBox';
import MDTypography from '../../../components/MD/MDTypography';
import MDInput from '../../../components/MD/MDInput';
import MDButton from '../../../components/MD/MDButton';

import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import Slide from '@mui/material/Slide';

// Authentication layout components
import DashboardLayout
  from '../../../examples/LayoutContainers/DashboardLayout';
import useCustomLogin from "../../../hooks/useCustomLogin";
import {getCookie} from "../../../util/cookieUtil";

const Transition = React.forwardRef(function Transition(
  props: TransitionProps & {
    children: React.ReactElement<any, any>,
  },
  ref: React.Ref<unknown>,
) {
  return <Slide direction="up" ref={ref} {...props} />;
});

const initState = {
  memberId: '',
  memberPw: ''
}

function Basic() {
  const [open, setOpen] = React.useState(false);
  const [dialogTitle, setDialogTitle] = React.useState('');
  const [dialogMessage, setDialogMessage] = React.useState('');
  const navigate = useNavigate();
  const [loginParam, setLoginParam] = useState({...initState})

  const {doLogin, doLogout, moveToPath} = useCustomLogin()

  const handleClickLogout = () => {
    doLogout()
    alert("로그아웃 되었습니다.")
    moveToPath("/")
  }

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleChange = (e) => {
    loginParam[e.target.name] = e.target.value

    setLoginParam({...loginParam})
  }

  const handleSignIn = () => {
    // 비동기 호출
    doLogin(loginParam) // loginSlice 의 비동기 호출
    .then(data => {
      console.log(data)

      if (data.error) {
        alert("이메일과 패스워드를 다시 확인하세요")
      } else {
        alert("로그인 성공")
        moveToPath('/')
      }
    })
  }

  const isAuthorized = getCookie('Authorization');

  if (!isAuthorized) {
    return (
      <DashboardLayout>
        <MDBox mt={30} mb={3}>
          <Grid container spacing={3} justifyContent="center">
            <Grid item xs={12} lg={8}>
              <Card>
                <MDBox
                  variant="gradient"
                  bgColor="info"
                  borderRadius="lg"
                  coloredShadow="info"
                  mx={2}
                  mt={-3}
                  p={2}
                  mb={1}
                  textAlign="center"
                >
                  <MDTypography variant="h4" fontWeight="medium" color="white" mt={1}>
                    로그인
                  </MDTypography>
                </MDBox>
                <MDBox pt={4} pb={3} px={3}>
                  <MDBox component="form" role="form">
                    <MDBox mb={2}>
                      <MDInput
                          type={'text'}
                          name="memberId"
                        label="아이디"
                        value={loginParam.memberId}
                        onChange={handleChange}
                        fullWidth
                      />
                    </MDBox>
                    <MDBox mb={2}>
                      <MDInput
                          type={'password'}
                          name="memberPw"
                        label="비밀번호"
                        value={loginParam.memberPw}
                        onChange={handleChange}
                        fullWidth
                      />
                    </MDBox>
                    <MDBox mt={4} mb={1}>
                      <MDButton onClick={handleSignIn} variant="gradient" color="info" fullWidth>
                        로그인
                      </MDButton>
                    </MDBox>
                    <MDBox mt={3} mb={1} textAlign="center">
                      <MDTypography variant="button" color="text">
                       계정이 없으신가요?{' '}
                        <MDTypography
                          component={Link}
                          to="/authentication/sign-up"
                          variant="button"
                          color="info"
                          fontWeight="medium"
                          textGradient
                        >
                          회원가입
                        </MDTypography>
                      </MDTypography>
                    </MDBox>
                  </MDBox>
                </MDBox>
                <Dialog
                  open={open}
                  TransitionComponent={Transition}
                  keepMounted
                  onClose={handleClose}
                  aria-describedby="alert-dialog-slide-description"
                >
                  <DialogTitle>{dialogTitle}</DialogTitle>
                  <DialogContent>
                    <DialogContentText id="alert-dialog-slide-description">
                      {dialogMessage}
                    </DialogContentText>
                  </DialogContent>
                  <DialogActions>
                    <Button onClick={handleClose}>OK</Button>
                  </DialogActions>
                </Dialog>
              </Card>
            </Grid>
          </Grid>
        </MDBox>
      </DashboardLayout>
    );
  } else {
    return (
      <DashboardLayout>
        <MDBox mt={30} mb={3}>
          <Grid container spacing={3} justifyContent="center">
            <Grid item xs={12} lg={8}>
              <Card>
                <MDBox
                  variant="gradient"
                  bgColor="info"
                  borderRadius="lg"
                  coloredShadow="info"
                  mx={2}
                  mt={-3}
                  p={2}
                  mb={1}
                  textAlign="center"
                >
                  <MDTypography variant="h4" fontWeight="medium" color="white" mt={1}>
                    Already login
                  </MDTypography>
                </MDBox>
                <MDBox pt={4} pb={3} px={3}>
                  <MDBox component="form" role="form">
                    <MDBox mt={4} mb={1}>
                      <MDButton onClick={handleClickLogout} variant="gradient" color="info" fullWidth>
                        로그아웃
                      </MDButton>
                    </MDBox>
                  </MDBox>
                </MDBox>
                <Dialog
                  open={open}
                  TransitionComponent={Transition}
                  keepMounted
                  onClose={handleClose}
                  aria-describedby="alert-dialog-slide-description"
                >
                  <DialogTitle>{dialogTitle}</DialogTitle>
                  <DialogContent>
                    <DialogContentText id="alert-dialog-slide-description">
                      {dialogMessage}
                    </DialogContentText>
                  </DialogContent>
                  <DialogActions>
                    <Button onClick={handleClose}>OK</Button>
                  </DialogActions>
                </Dialog>
              </Card>
            </Grid>
          </Grid>
        </MDBox>
      </DashboardLayout>
    );
  }
}

export default Basic;
