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

    const handleGetAlarm = (pageNum = 0) => {
        const pageParam = { page: pageNum, size: 10 };
        getNotificationList(pageParam).then(data => {
            console.log('알람 목록 조회!!!');
            console.log(data);
            setAlarms(data.content);
            setTotalPage(data.totalPages);
        }).catch(error => {
            console.error("알람 목록 조회에 실패했습니다.", error);
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
            || notificationType ===  "NEW_INQUIRY") {
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
        handleGetAlarm(page);

        const connect = () => {
            eventSource = new EventSourcePolyfill(`${host}/subscribe`, {
                headers: {
                    Authorization: `${getCookie('Authorization')}`
                }
            });

            eventSource.addEventListener("open", function (event) {
                console.log("Connection opened");
            });

            // 서버로부터 "alarm" 이벤트가 수신될 때 발생
            eventSource.addEventListener("alarm", function (event) {
                console.log(event.data);
                handleGetAlarm(); // 알람을 업데이트
            });

            eventSource.addEventListener("error", function (event) {
                console.log("Error occurred:", event);
                if (event.target.readyState === EventSource.CLOSED) { // 연결이 닫힌 경우
                    console.log("Connection closed, attempting to reconnect...");
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

    if (!isAuthorization) {
        return moveToLoginReturn()
    }

    return (
        <DashboardLayout>
            <MDBox
                pb={50}
                sx={{
                    mt: {xs: 5, sm: 5, md: 9, lg: 1},
                }}
            >
                <MDTypography fontWeight="bold"
                              sx={{ml: 4, fontSize: '2rem'}}
                              variant="body2">
                    알람 목록
                </MDTypography>
                <MDBox pt={1} pb={2}>
                    {alarms.length > 0 ? (
                        alarms.map((notification) => (
                            <MDBox pt={2} pb={2} px={3} key={notification.id}>
                                <Card sx={{
                                    backgroundColor: notification.read
                                        ? '#ffffff' : '#fff8b0',
                                    cursor: 'pointer'
                                }}
                                      onClick={() => handleAlarmClick(
                                          notification)}
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
            </MDBox>
        </DashboardLayout>
    );
}

export default Alarm;
