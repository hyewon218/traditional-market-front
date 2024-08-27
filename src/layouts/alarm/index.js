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
import {API_SERVER_HOST, getOne} from "../../api/marketApi";
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
import {useNavigate} from "react-router-dom";
import {getChatRoom} from "../../api/chatApi";
import {getIsRead, putIsRead} from "../../api/notificationApi";
import {getInquiryAnswer} from "../../api/inquiryAnswerApi";
import {getShopOne} from "../../api/shopApi";
import {getItemOne} from "../../api/itemApi";

const initState = {
    no: 0,
    title: '',
    username: '',
    createTime: null,
    isRead: false
}

const notificationTypeMessages = {
    NEW_LIKE_ON_MARKET: "시장에 좋아요가 눌렸어요!",
    NEW_LIKE_ON_SHOP: "상점에 좋아요가 눌렸어요!",
    NEW_LIKE_ON_ITEM: "상품에 좋아요가 눌렸어요!",
    NEW_COMMENT_ON_MARKET: "시장에 댓글이 달렸어요!",
    NEW_COMMENT_ON_SHOP: "상점에 댓글이 달렸어요!",
    NEW_COMMENT_ON_ITEM: "상품에 댓글이 달렸어요!",
    NEW_PURCHASE_ON_SHOP: "판매 상품에 구매요청이 왔어요!",
    NEW_CHAT_ON_CHATROOM: "1:1 채팅 상담 답변이 왔습니다!",
    NEW_CHAT_REQUEST_ON_CHATROOM: "1:1 채팅 상담 요청이 왔습니다!",
    NEW_INQUIRY_ANSWER: "문의사항 답변이 달렸어요!"
};

function Alarm() {
    const [page, setPage] = useState(0);
    const [alarms, setAlarms] = useState([]);
    const [totalPage, setTotalPage] = useState(0);
    const [alarmEvent, setAlarmEvent] = useState(undefined);
    const [charRoom, setChatRoom] = useState({...initState});

    let eventSource = undefined;

    const {moveToLoginReturn, isAuthorization} = useCustomLogin() // 로그인이 필요한 페이지

    const host = `${API_SERVER_HOST}/api/notifications`

    const navigate = useNavigate();

    const changePage = (pageNum) => {
        console.log('change pages');
        console.log(pageNum);
        console.log(page);
        setPage(pageNum);
        handleGetAlarm(pageNum);
    };

    const handleGetAlarm = (pageNum) => {
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

    const handleGetIsRead = (notificationNo) => {
        getIsRead(notificationNo).then(data => {
            console.log('알람 읽음 상태 조회!!!');
            console.log(data);
        }).catch(error => {
            console.error("알람 읽음 상태 조회에 실패했습니다.", error);
        });
    }

    const handlePutRead = (notificationNo) => {
        putIsRead(notificationNo).then(data => {
            console.log('알람 읽음 상태로 변경!!!');
            handleGetIsRead(notificationNo);
        }).catch(error => {
            console.error("알람 읽음 상태로 변경에 실패했습니다.", error);
        });
    }

    const fetchChatRoom = (chatRoomNo) => {
        getChatRoom(chatRoomNo)
        .then((data) => {
            setChatRoom(data);
            navigate('/chat-detail', {state: data});
        })
        .catch((error) => {
            console.error('채팅방 조회에 실패했습니다.', error);
        });
    };

    const fetchInquiryAnswer = (inquiryAnswerNo) => {
        getInquiryAnswer(inquiryAnswerNo)
        .then((data) => {
            navigate('/inquiry-detail', {state: data});
        })
        .catch((error) => {
            console.error('채팅방 조회에 실패했습니다.', error);
        });
    };

    const fetchMarket = (marketNo) => {
        getOne(marketNo)
        .then((data) => {
            navigate('/market-detail', {state: data});
        })
        .catch((error) => {
            console.error('시장 조회에 실패했습니다.', error);
        });
    };

    const fetchShop = (shopNo) => {
        getShopOne(shopNo)
        .then((data) => {
            navigate('/shop-detail', {state: data});
        })
        .catch((error) => {
            console.error('상점 조회에 실패했습니다.', error);
        });
    };

    const fetchItem = (itemNo) => {
        getItemOne(itemNo)
        .then((data) => {
            navigate('/item-detail', {state: data});
        })
        .catch((error) => {
            console.error('상품 조회에 실패했습니다.', error);
        });
    };

    const handleAlarmClick = (notification) => {
        if (!notification.read) {
            handlePutRead(notification.no);
        }

        const {notificationType, args} = notification;
        const targetId = args.targetId;

        if (notificationType === "NEW_CHAT_REQUEST_ON_CHATROOM"
            || notificationType === "NEW_CHAT_ON_CHATROOM") {
            fetchChatRoom(targetId);
        } else if (notificationType === "NEW_INQUIRY_ANSWER") {
            fetchInquiryAnswer(targetId);
        } else if (notificationType === "NEW_LIKE_ON_MARKET" ||
            notificationType === "NEW_COMMENT_ON_MARKET") {
            fetchMarket(targetId);
        } else if (notificationType === "NEW_LIKE_ON_SHOP" ||
            notificationType === "NEW_COMMENT_ON_SHOP" ||
            notificationType === "NEW_PURCHASE_ON_SHOP") {
            fetchShop(targetId);
        } else if (notificationType === "NEW_LIKE_ON_ITEM" ||
            notificationType === "NEW_COMMENT_ON_ITEM") { /*seller 에게 알람*/
            fetchItem(targetId);
        }
    };

    useEffect(() => {
        // 초기 알람을 가져오는 함수
        handleGetAlarm(page);

        // 백오프 전략을 사용하여 EventSource 연결을 설정하는 함수
        const connect = (retryCount = 0) => {
            eventSource = new EventSourcePolyfill(`${host}/subscribe`, {
                headers: {
                    Authorization: `${getCookie('Authorization')}`
                }
            });

            eventSource.addEventListener("open", function (event) {
                console.log("Connection opened");
                retryCount = 0; // 연결이 성공하면 retryCount 를 0으로 재설정
            });

            eventSource.addEventListener("alarm", function (event) {
                console.log(event.data);
                handleGetAlarm();
            });

            eventSource.addEventListener("error", function (event) {
                console.log("Error occurred:", event);
                if (event.target.readyState === EventSource.CLOSED) {
                    console.log(
                        "Connection closed, attempting to reconnect...");

                    // 지수형 백오프 전략
                    const maxRetries = 5; // 최대 재시도 횟수
                    const baseDelay = 3000; // 기본 지연 시간(밀리초)
                    const backoffDelay = Math.min(
                        baseDelay * Math.pow(2, retryCount), 60000); // 최대 60초까지 지연

                    if (retryCount < maxRetries) {
                        setTimeout(() => connect(retryCount + 1), backoffDelay);
                    } else {
                        console.log("최대 재시도 횟수에 도달했습니다. 재연결 시도를 중지합니다.");
                    }
                }
            });

            setAlarmEvent(eventSource);
        };

        connect(); // 초기 retryCount 0으로 연결 설정

        // 컴포넌트 언마운트 시 정리 작업
        return () => {
            if (eventSource) {
                eventSource.close();
            }
        };
    }, [page]); // 의존성 배열

    if (!isAuthorization) {
        return moveToLoginReturn()
    }

    return (
        <DashboardLayout>
            <MDTypography fontWeight="bold"
                          sx={{ml: 4, mt: 2, fontSize: '2rem'}}
                          variant="body2">
                알람 목록
            </MDTypography>
            <MDBox pt={1} pb={2}>
                {alarms.length > 0 ? (
                    alarms.map((notification) => (
                        <MDBox pt={2} pb={2} px={3} key={notification.id}>
                            <Card sx={{
                                backgroundColor: notification.read
                                    ? '#ffffff' : '#fff8b0', cursor: 'pointer'
                            }}
                                  onClick={() => handleAlarmClick(notification)}
                            >
                                <MDBox pt={2} pb={2} px={3}>
                                    <Grid container>
                                        <Grid item xs={8}>
                                            <MDTypography fontWeight="bold"
                                                          variant="body2"
                                            >
                                                {notificationTypeMessages[notification.notificationType]
                                                    || "알림이 도착했습니다!"}
                                            </MDTypography>
                                        </Grid>
                                        <Grid item xs={4}>
                                            <MDTypography fontWeight="bold"
                                                          variant="body2"
                                            >
                                                {notification.createTime}
                                            </MDTypography>
                                        </Grid>
                                    </Grid>
                                </MDBox>
                            </Card>
                        </MDBox>
                    ))
                ) : (
                    <MDTypography fontWeight="bold"
                                  sx={{ml: 4, mt: 2, fontSize: '1.5rem'}}
                                  variant="body2">
                        알람이 없습니다
                    </MDTypography>
                )}
            </MDBox>

            {alarms.length > 0 && totalPage > 1 && (
                <MDPagination>
                    <MDPagination item>
                        <KeyboardArrowLeftIcon/>
                    </MDPagination>
                    {[...Array(totalPage).keys()].map((i) => (
                        <MDPagination item key={i}
                                      onClick={() => changePage(i)}>
                            {i + 1}
                        </MDPagination>
                    ))}
                    <MDPagination item>
                        <KeyboardArrowRightIcon/>
                    </MDPagination>
                </MDPagination>
            )}
        </DashboardLayout>
    );
}

export default Alarm;
