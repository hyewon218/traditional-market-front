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
import useCustomLogin from "../../hooks/useCustomLogin";
import {useNavigate} from "react-router-dom";
import {getChatRoom} from "../../api/chatApi";
import {
    getIsRead,
    getNotificationList,
    putIsRead
} from "../../api/notificationApi";
import {getShopOne} from "../../api/shopApi";
import {getItemOne} from "../../api/itemApi";
import {getInquiryOne} from "../../api/inquiryApi";
import {useMediaQuery} from "@mui/material";
import {EventSourcePolyfill} from "event-source-polyfill";

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
    NEW_INQUIRY_ANSWER: "문의사항 답변이 달렸어요!",
    NEW_INQUIRY: "문의사항이 도착했어요!"
};

function Alarm() {
    const [page, setPage] = useState(0);
    const [alarms, setAlarms] = useState([]);
    const [totalPage, setTotalPage] = useState(0);
    const [alarmEvent, setAlarmEvent] = useState(undefined);
    let eventSource = undefined;
    const [data, setData] = useState(null);
    const {moveToLoginReturn, isAuthorization} = useCustomLogin() // 로그인이 필요한 페이지
    const host = `${API_SERVER_HOST}/api/notifications`
    const navigate = useNavigate();
    const isSmallScreen = useMediaQuery('(max-width:600px)');
    const [token, setToken] = useState(null);
    const [notifications, setNotifications] = useState([]);
    let longPollTimeout;

    const changePage = (pageNum) => {
        //console.log('change pages');
        //console.log(pageNum);
        //console.log(page);
        setPage(pageNum);
        handleGetAlarm(pageNum);
    };

    const handleGetAlarm = (pageNum = 0) => {
        const pageParam = {page: pageNum, size: 10};
        getNotificationList(pageParam).then(data => {
            //console.log('알람 목록 조회!!!');
            //console.log(data);
            setAlarms(data.content);
            setTotalPage(data.totalPages);
        }).catch(error => {
            console.error("알람 목록 조회에 실패했습니다.", error);
        });
    };

    const handleGetIsRead = (notificationNo) => {
        getIsRead(notificationNo).then(data => {
            //console.log('알람 읽음 상태 조회!!!');
            //console.log(data);
        }).catch(error => {
            console.error("알람 읽음 상태 조회에 실패했습니다.", error);
        });
    }

    const handlePutRead = (notificationNo) => {
        putIsRead(notificationNo).then(data => {
            //console.log('알람 읽음 상태로 변경!!!');
            handleGetIsRead(notificationNo);
        }).catch(error => {
            console.error("알람 읽음 상태로 변경에 실패했습니다.", error);
        });
    }

    const fetchChatRoom = (chatRoomNo) => {
        getChatRoom(chatRoomNo)
        .then((data) => {
            navigate('/chat-detail', {state: data});
        })
        .catch((error) => {
            console.error('채팅방 조회에 실패했습니다.', error);
        });
    };

    const fetchInquiryAnswer = (inquiryNo) => {
        getInquiryOne(inquiryNo)
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
        } else if (notificationType === "NEW_INQUIRY_ANSWER"
            || notificationType === "NEW_INQUIRY") {
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

     /*sse*/
    useEffect(() => {
        handleGetAlarm(page);

        const connect = () => {
            eventSource = new EventSourcePolyfill(`${host}/subscribe`, {
                headers: {
                    // Retrieve the token from Redux state
                    Authorization: `${isAuthorization}`
                }
            });

            eventSource.addEventListener("open", function () {
                console.log("Connection opened");
            });

            // 서버로부터 "alarm" 이벤트가 수신될 때 발생
            eventSource.addEventListener("alarm", function (event) {
/*                console.log(event.data);
                // Record the current time
                const currentTime = new Date();

                // Function to pad single-digit numbers with leading zeros
                const pad = (num) => (num < 10 ? '0' + num : num);
                // Extract hours, minutes, seconds, and milliseconds
                const hours = pad(currentTime.getHours());
                const minutes = pad(currentTime.getMinutes());
                const seconds = pad(currentTime.getSeconds());
                const milliseconds = currentTime.getMilliseconds();

                // Print in the desired format
                console.log(`Current time: ${hours}:${minutes}:${seconds}.${milliseconds}`);*/

                handleGetAlarm(); // 알람을 업데이트
            });

            eventSource.addEventListener("error", function (event) {
                console.log("Error occurred:", event);
                if (event.target.readyState === EventSource.CLOSED) { // 연결이 닫힌 경우
                    console.log(
                        "Connection closed, attempting to reconnect...");
                    // 3초 후 connect() 함수를 사용하여 다시 연결을 시도
                    setTimeout(() => connect(), 3000);
                }
            });
            setAlarmEvent(eventSource);
        };

        connect();

        return () => {
            if (eventSource) {
                eventSource.close();
            }
        };
    }, [page]);

    /*폴링*/
/*    useEffect(() => {
        handleGetAlarm(page);

        const interval = setInterval(() => {
            fetch('http://localhost:8080/api/notifications/poll', {
                method: 'GET',
                credentials: 'include',
                headers: {
                    'Authorization': isAuthorization,
                }
            })
            .then(response => response.json())
            .then(data => {
                handleGetAlarm();
            })
            .catch(error => {
                console.error("Error fetching notifications", error);
            });
        }, 3000); // 3초 간격으로 폴링(서버에 요청)

        return () => clearInterval(interval); // cleanup 함수로 interval 을 정리
    }, [isAuthorization]);*/

    /*롱폴링*/
/*    useEffect(() => {
        handleGetAlarm(); // Initial alarm fetch logic (optional)
    }, []);

    useEffect(() => {
            longPoll();
        return () => {
            if (pollingTimeoutId) {
                clearTimeout(pollingTimeoutId); // Clear the polling timeout
            }
            setAlarms([]); // Clear notifications on unmount
        };
    }, []);

    let pollingTimeoutId = null;

    const longPoll = async () => {
        try {
            const response = await axios.get('http://localhost:8080/api/notifications/longpoll', {
                headers: {
                    Authorization: `${isAuthorization}`,
                    'Content-Type': 'application/json',
                },
                withCredentials: true,
                //timeout: 30000
            });
            // Record the current time
            const currentTime = new Date();

            // Function to pad single-digit numbers with leading zeros
            const pad = (num) => (num < 10 ? '0' + num : num);
            // Extract hours, minutes, seconds, and milliseconds
            const hours = pad(currentTime.getHours());
            const minutes = pad(currentTime.getMinutes());
            const seconds = pad(currentTime.getSeconds());
            const milliseconds = currentTime.getMilliseconds();

            // Print in the desired format
            console.log(`Current time: ${hours}:${minutes}:${seconds}.${milliseconds}`);


            const newNotifications = response.data;
            if (newNotifications.length > 0) { // 새로운 알람이 있으면
                //console.log("?!?!??!?"+newNotifications);
                handleGetAlarm();
            }
            // 성공적인 응답을 받으면 5초 지연 후 다음 폴링 요청이 발생하도록 설정
            pollingTimeoutId = setTimeout(longPoll, 3000);
        } catch (error) {
            console.error("Error during long polling:", error);
            // 1초 지연 후에 다시 호출되도록 예약
            pollingTimeoutId = setTimeout(longPoll, 1000); // Retry on error
        }
    }*/


    if (!isAuthorization) {
        return moveToLoginReturn()
    }

    return (
        <DashboardLayout>
            <MDTypography fontWeight="bold"
                          sx={{
                              ml: isSmallScreen? 2:4, mt: isSmallScreen? 0:3,
                              fontSize: isSmallScreen? '1.2rem':'2rem'
                          }}
                          variant="body2">
                알람 목록
            </MDTypography>
            <MDBox pt={1} pb={20}>
                {alarms.length > 0 ? (
                    alarms.map((notification) => (
                        <MDBox pt={isSmallScreen? 1:1} pb={1} px={isSmallScreen? 1:3} key={notification.id}>
                            <Card sx={{
                                backgroundColor: notification.read
                                    ? '#ffffff' : '#fff8b0',
                                cursor: 'pointer'
                            }}
                                  onClick={() => handleAlarmClick(
                                      notification)}
                            >
                                <MDBox pt={2} pb={2} px={isSmallScreen? 2:2}>
                                    <Grid container>
                                        <Grid item xs={8} lg={8}>
                                            <MDTypography
                                                sx={{
                                                    fontSize: isSmallScreen? '0.8rem':'1rem'
                                                }}
                                                fontWeight="bold"
                                                variant="body2"
                                            >
                                                {notificationTypeMessages[notification.notificationType]
                                                    || "알림이 도착했습니다!"}
                                            </MDTypography>
                                        </Grid>
                                        <Grid item xs={4} lg={4}>
                                            <MDTypography
                                                sx={{
                                                    fontSize: isSmallScreen? '0.55rem':'1rem'
                                                }}
                                                fontWeight="bold"
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
                                  sx={{
                                      ml: isSmallScreen ? 2 : 4,
                                      mt: isSmallScreen ? 0 : 2,
                                      fontSize: isSmallScreen ? '0.9rem' : '1.5rem'
                                  }}
                                  variant="body2">
                        알람이 없습니다
                    </MDTypography>
                )}

                <MDBox sx={{ marginTop: 2 }}>
                {alarms.length > 0 && totalPage > 1 && (
                    <MDPagination size={"small"}>
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
                </MDBox>
            </MDBox>

        </DashboardLayout>
    );
}

export default Alarm;
