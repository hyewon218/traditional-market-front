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
import {API_SERVER_HOST} from "../../api/marketApi";
import {getCookie} from "../../util/cookieUtil";
import {EventSourcePolyfill} from "event-source-polyfill";

// @mui material components
import Grid from '@mui/material/Grid';
import Card from '@mui/material/Card';
import KeyboardArrowLeftIcon from '@mui/icons-material/KeyboardArrowLeft';
import KeyboardArrowRightIcon from '@mui/icons-material/KeyboardArrowRight';

// Material Dashboard 2 React components
import MDBox from '../../components/MD/MDBox';
import MDTypography from '../../components/MD/MDTypography';
import MDPagination from '../../components/MD/MDPagination';

// Material Dashboard 2 React example components
import DashboardLayout from '../../examples/LayoutContainers/DashboardLayout';

// Data
import axios from 'axios';
import useCustomLogin from "../../hooks/useCustomLogin";

function Alarm() {
    const [page, setPage] = useState(0);
    const [alarms, setAlarms] = useState([]);
    const [totalPage, setTotalPage] = useState(0);
    const [alarmEvent, setAlarmEvent] = useState(undefined);

    let eventSource = undefined;

    const {moveToLoginReturn, isAuthorization} = useCustomLogin() // 로그인이 필요한 페이지

    const host = `${API_SERVER_HOST}/api/notifications`
    const accessToken = getCookie('Authorization')

    const changePage = (pageNum) => {
        console.log('change pages');
        console.log(pageNum);
        console.log(page);
        setPage(pageNum);
        handleGetAlarm(pageNum);
    };

    const handleGetAlarm = (pageNum, event) => {
        console.log('handleGetAlarm');
        axios({
            url: `${host}?size=10&sort=no,desc&page=` + pageNum,
            method: 'GET'
        })
        .then((res) => {
            console.log('success');
            console.log(res);
            setAlarms(res.data.content);
            setTotalPage(res.data.totalPages);
        })
        .catch((error) => {
            console.log(error);
            //navigate('/authentication/sign-in');
        });
    };

    useEffect(() => {
        handleGetAlarm();

        console.log("accessToken ==== " + accessToken)
        eventSource = new EventSourcePolyfill(`${host}/subscribe`, {
            headers: {
                Authorization: `${accessToken}`
            }
        });

        setAlarmEvent(eventSource);

        eventSource.addEventListener("open", function (event) {
            console.log("connection opened");
        });

        eventSource.addEventListener("alarm", function (event) {
            console.log(event.data);
            handleGetAlarm();
        });

        eventSource.addEventListener("error", function (event) {
            console.log(event.target.readyState);
            if (event.target.readyState === EventSource.CLOSED) {
                console.log(
                    "eventsource closed (" + event.target.readyState + ")");
            }
            eventSource.close();
        });

    }, []);

    if(!isAuthorization){
        return moveToLoginReturn()
    }

    return (
        <DashboardLayout>
            <MDBox pt={3} pb={3}>
                {alarms.map((alarm) => (
                    <MDBox pt={2} pb={2} px={3}>
                        <Card>
                            <MDBox pt={2} pb={2} px={3}>
                                <Grid container>
                                    <Grid item xs={12}>
                                        <MDTypography fontWeight="bold"
                                                      variant="body2">
                                            {alarm.notificationContent}
                                        </MDTypography>
                                    </Grid>
                                </Grid>
                            </MDBox>
                        </Card>
                    </MDBox>
                ))}
            </MDBox>

            <MDPagination>
                <MDPagination item>
                    <KeyboardArrowLeftIcon></KeyboardArrowLeftIcon>
                </MDPagination>
                {[...Array(totalPage).keys()].map((i) => (
                    <MDPagination item onClick={() => changePage(i)}>
                        {i + 1}
                    </MDPagination>
                ))}
                <MDPagination item>
                    <KeyboardArrowRightIcon></KeyboardArrowRightIcon>
                </MDPagination>
            </MDPagination>
        </DashboardLayout>
    );
}

export default Alarm;
