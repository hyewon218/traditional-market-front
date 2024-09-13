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
import {useEffect, useRef, useState} from 'react';
import useCustomLogin from "../../hooks/useCustomLogin";
import {getCookie} from "../../util/cookieUtil";
import * as StompJs from "@stomp/stompjs";
import 'bootstrap/dist/css/bootstrap.min.css';
import {useLocation} from "react-router-dom";
import DashboardLayout from "../../examples/LayoutContainers/DashboardLayout";
import MDBox from "../../components/MD/MDBox";
import Card from "@mui/material/Card";
import Grid from "@mui/material/Grid";
import MDTypography from "../../components/MD/MDTypography";
import MDButton from "../../components/MD/MDButton";
import {yellow} from "@mui/material/colors";
import {getChatDetails, getIsRead, putIsRead} from '../../api/chatApi';

import ProfanityFilterMDInput from '../../components/common/ProfanityFilter'; // 비속어 필터
import {containsProfanity} from '../../components/common/profanityUtils'; // 분리한 비속어 필터 내 containsProfanity 함수 import

function ChatDetail() {
    const {state} = useLocation();
    const charRoom = state; // 전달된 charRoom 데이터를 사용
    let [client, changeClient] = useState(null);
    const [chat, setChat] = useState(""); // 입력된 chat 을 받을 변수
    const [chatList, setChatList] = useState([]); // 채팅 기록

    const {
        moveToLoginReturn,
        isAuthorization,
        userId,
        isAdmin
    } = useCustomLogin()

    const chatContainerRef = useRef(null);

    useEffect(() => {
        // 최초 렌더링 시 , 웹소켓에 연결
        // 우리는 사용자가 방에 입장하자마자 연결 시켜주어야 하기 때문에
        connect();

        return () => disConnect();
    }, []);

    useEffect(() => {
        handleGetChatDetails();

        if (!charRoom.read) {
            handlePutRead(charRoom.no); // 채팅방 읽음 상태로 변경
        }
    }, []);

    useEffect(() => {
        // 새로운 채팅 메세지가 추가되면 아래쪽으로 스크롤하여 바로 보여줌
        if (chatContainerRef.current) {
            chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
        }
    }, [chatList]);

    const handleGetChatDetails = () => {
        getChatDetails(charRoom.no).then(data => {
            setChatList(data);
            console.log(data);
        }).catch(error => {
            console.error("채팅방 조회에 실패했습니다.", error);
        });
    };

    const handlePutRead = (charRoomNo) => {
        putIsRead(charRoomNo).then(data => {
            console.log('채팅방 읽음 상태로 변경!!!');
            handleGetIsRead(charRoomNo);
        }).catch(error => {
            console.error("채팅방 읽음 상태로 변경에 실패했습니다.", error);
        });
    }

    const handleGetIsRead = (charRoomNo) => { // 알람을 통해 들어왔을 때
        getIsRead(charRoomNo).then(data => {
            console.log('채팅방 읽음 상태 조회!!!');
            console.log(data);
        }).catch(error => {
            console.error("채팅방 읽음 상태 조회에 실패했습니다.", error);
        });
    }

    if (!isAuthorization) {
        return moveToLoginReturn()
    }

    const connect = () => {
        // WebSocket connection
        try {
            const stompClient = new StompJs.Client({
                brokerURL: "ws://localhost:8080/stomp/chat",
                //brokerURL: "ws://3.36.96.0:8080/stomp/chat",
                connectHeaders: {
                    Authorization: getCookie('Authorization')
                },
                debug: function (str) {
                    console.log(str);
                },
                reconnectDelay: 5000, // 자동 재연결
                heartbeatIncoming: 4000,
                heartbeatOutgoing: 4000,
            });

            // 구독
            stompClient.onConnect = function () {
                stompClient.subscribe("/sub/chat/" + charRoom.no, callback);
            };
            stompClient.activate(); // 클라이언트 활성화
            changeClient(stompClient); // 클라이언트 갱신
        } catch (err) {
            console.log(err);
        }
    };

    const disConnect = () => {
        // 연결 끊기
        if (client === null) {
            return;
        }
        client.deactivate();
    };

    const sendChat = () => {
        if (chat === "") {
            return;
        }

        // 비속어 검증
        if (containsProfanity(chat)) {
            alert('비속어가 포함되어 있습니다. 다른 단어를 사용해 주세요.');
            setChat('');
            return;
        }

        const formattedDate = new Date().toLocaleTimeString(); // UTC 시간으로 포맷
        const newMessage = {
            sender: userId, /*로그인한 사용자*/
            message: chat,
            createdAt: formattedDate
        };
        client.publish({ // destination 과 body 를 publish 를 사용해 서버단에 보냄
            destination: "/pub/chat/message/" + charRoom.no,
            body: JSON.stringify(newMessage),
        });
        //console.log("formattedDate!!!!!" + formattedDate)
        setChat("");
    };

    // 채팅방 번호가 담긴 주소로 구독요청
    // 구독과 동시에 실행할 콜백함수를 인자로 넘김
    const callback = function (message) {
        if (message.body) {
            let msg = JSON.parse(message.body);
            //console.log("callback!!!!!!!!!!!" + JSON.stringify(msg))
            setChatList((chats) => [...chats, msg]);// 채팅 배열에 새로 받은 메시지를 추가
        }
    };

    const onChangeChat = (e) => {
        setChat(e.target.value);
    };

    // Enter 키로 메시지 전송 핸들러
    const handleKeyDown = (e) => {
        if (e.keyCode === 13) {
            sendChat();
        }
    }

   /* const msgBox = chatList.map((chat, index) => {
        //console.log("로그인 사용자 ID = " + userId + "/sender =" + chat.sender)
        //const sender = isAdmin ? chat.sender : '관리자' /!*else 에서 사용, - 관리자 1명일 때*!/
        if (chat.sender === userId) {
            return (
                <MDBox key={index} pt={2} pb={2} px={3}>
                    <Grid container justifyContent="flex-end">
                        <Grid item xs={8} sm={6} md={8}>
                            <Card sx={{backgroundColor: yellow[500]}}>
                                <MDBox pt={2} pb={2} px={3}>
                                    <Grid container>
                                        <Grid item xs={6}>
                                            <MDTypography fontWeight="bold"
                                                          variant="body2">
                                                {chat.message}
                                            </MDTypography>
                                        </Grid>
                                        <Grid item xs={3}>
                                            <MDTypography fontWeight="bold"
                                                          variant="body2">
                                                {/!* {chat.sender}*!/}
                                            </MDTypography>
                                        </Grid>
                                        <Grid item xs={3}>
                                            <MDTypography fontWeight=""
                                                          variant="body2">
                                                {chat.createdAt}
                                            </MDTypography>
                                        </Grid>
                                    </Grid>
                                </MDBox>
                            </Card>
                        </Grid>
                    </Grid>
                </MDBox>
            );
        } else {
            return (
                <MDBox key={index} pt={2} pb={2} px={3}>
                    <Grid container justifyContent="flex-start">
                        <Grid item xs={8} sm={6} md={8}>
                            <Card>
                                <MDBox pt={2} pb={2} px={3}>
                                    <Grid container>
                                        <Grid item xs={6}>
                                            <MDTypography fontWeight="bold"
                                                          variant="body2">
                                                {chat.message}
                                            </MDTypography>
                                        </Grid>
                                        <Grid item xs={3}>
                                            <MDTypography fontWeight="bold"
                                                          variant="body2">
                                                {sender}
                                            </MDTypography>
                                        </Grid>
                                        <Grid item xs={3}>
                                            <MDTypography fontWeight=""
                                                          variant="body2">
                                                {chat.createdAt}
                                            </MDTypography>
                                        </Grid>
                                    </Grid>
                                </MDBox>
                            </Card>
                        </Grid>
                    </Grid>
                </MDBox>
            );
        }
    })*/

    const msgBox = chatList.map((chat, index) => {
        /*TODO : 관리자 ID 수정*/
        const adminIds = ['esc0218', 'esc0220']; // 관리자 ID 배열
        const isSenderAdmin = adminIds.includes(chat.sender); // 메시지 보낸 사람이 관리자라면 true
        const senderName = isSenderAdmin ? '관리자' : chat.sender; // 일반 사용자 입장에서 관리자는 '관리자'로 표시

        if (isAdmin) { // 현재 사용자가 관리자일 경우
            if (isSenderAdmin) { // 관리자가 보낸 메시지 (현재 사용자와 동일한 관리자)
                return (
                    <MDBox key={index} pt={2} pb={2} px={3}>
                        <Grid container justifyContent="flex-end">
                            <Grid item xs={8} sm={6} md={8}>
                                <Card sx={{ backgroundColor: yellow[500] }}>
                                    <MDBox pt={2} pb={2} px={3}>
                                        <Grid container>
                                            <Grid item xs={6}>
                                                <MDTypography fontWeight="bold" variant="body2">
                                                    {chat.message}
                                                </MDTypography>
                                            </Grid>
                                            <Grid item xs={3}>
                                                <MDTypography fontWeight="bold" variant="body2">
                                                     {chat.sender}
                                                </MDTypography>
                                            </Grid>
                                            <Grid item xs={3}>
                                                <MDTypography fontWeight="" variant="body2">
                                                    {chat.createdAt}
                                                </MDTypography>
                                            </Grid>
                                        </Grid>
                                    </MDBox>
                                </Card>
                            </Grid>
                        </Grid>
                    </MDBox>
                );
            } else { // 일반 사용자가 보낸 메시지
                return (
                    <MDBox key={index} pt={2} pb={2} px={3}>
                        <Grid container justifyContent="flex-start">
                            <Grid item xs={8} sm={6} md={8}>
                                <Card>
                                    <MDBox pt={2} pb={2} px={3}>
                                        <Grid container>
                                            <Grid item xs={6}>
                                                <MDTypography fontWeight="bold" variant="body2">
                                                    {chat.message}
                                                </MDTypography>
                                            </Grid>
                                            <Grid item xs={3}>
                                                <MDTypography fontWeight="bold" variant="body2">
                                                    {senderName}
                                                </MDTypography>
                                            </Grid>
                                            <Grid item xs={3}>
                                                <MDTypography fontWeight="" variant="body2">
                                                    {chat.createdAt}
                                                </MDTypography>
                                            </Grid>
                                        </Grid>
                                    </MDBox>
                                </Card>
                            </Grid>
                        </Grid>
                    </MDBox>
                );
            }
        } else { // 현재 사용자가 일반 사용자일 경우
            if (chat.sender === userId) { // 사용자가 보낸 메시지
                return (
                    <MDBox key={index} pt={2} pb={2} px={3}>
                        <Grid container justifyContent="flex-end">
                            <Grid item xs={8} sm={6} md={8}>
                                <Card sx={{ backgroundColor: yellow[500] }}>
                                    <MDBox pt={2} pb={2} px={3}>
                                        <Grid container>
                                            <Grid item xs={6}>
                                                <MDTypography fontWeight="bold" variant="body2">
                                                    {chat.message}
                                                </MDTypography>
                                            </Grid>
                                            <Grid item xs={3}>
                                                <MDTypography fontWeight="bold" variant="body2">
                                                    {/* {chat.sender} */}
                                                </MDTypography>
                                            </Grid>
                                            <Grid item xs={3}>
                                                <MDTypography fontWeight="" variant="body2">
                                                    {chat.createdAt}
                                                </MDTypography>
                                            </Grid>
                                        </Grid>
                                    </MDBox>
                                </Card>
                            </Grid>
                        </Grid>
                    </MDBox>
                );
            } else if (isSenderAdmin) { // 관리자가 보낸 메시지
                return (
                    <MDBox key={index} pt={2} pb={2} px={3}>
                        <Grid container justifyContent="flex-start"> {/* 왼쪽에 배치 */}
                            <Grid item xs={8} sm={6} md={8}>
                                <Card>
                                    <MDBox pt={2} pb={2} px={3}>
                                        <Grid container>
                                            <Grid item xs={6}>
                                                <MDTypography fontWeight="bold" variant="body2">
                                                    {chat.message}
                                                </MDTypography>
                                            </Grid>
                                            <Grid item xs={3}>
                                                <MDTypography fontWeight="bold" variant="body2">
                                                    {senderName}
                                                </MDTypography>
                                            </Grid>
                                            <Grid item xs={3}>
                                                <MDTypography fontWeight="" variant="body2">
                                                    {chat.createdAt}
                                                </MDTypography>
                                            </Grid>
                                        </Grid>
                                    </MDBox>
                                </Card>
                            </Grid>
                        </Grid>
                    </MDBox>
                );
            }
        }
    });

    return (
        <DashboardLayout>
            <MDBox
                pb={17}
                sx={{
                mt: {xs: 5, sm: 5, md: 7, lg: 1},
                maxWidth: '800px',
                margin: '0 auto',
                display: 'flex',
                flexDirection: 'column',
            }}>
                <MDBox pt={1} pb={1}
                       sx={{display: 'flex', justifyContent: 'center'}}>
                    <Card sx={{
                        width: '50%',
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center'
                    }}>
                        <MDTypography fontWeight="bold"
                                      sx={{fontSize: '1.7rem', pb: 2, pt: 2}}
                                      variant="body2">
                            무엇을 도와드릴까요?
                        </MDTypography>
                    </Card>
                </MDBox>
                <MDTypography fontWeight="bold"
                              sx={{
                                  fontSize: '0.9rem',
                                  display: 'flex',
                                  justifyContent: 'center',
                                  color: 'blue'
                              }}
                              variant="body2">
                    답변까지 시간이 걸릴 수 있습니다. 알람함을 확인해주세요.
                </MDTypography>

                <MDBox ref={chatContainerRef}
                       sx={{
                           flexGrow: 1,
                           maxHeight: {
                               xs: '300px',  // 모바일 화면
                               sm: '400px',  // 작은 화면
                               md: '350px',  // 중간 화면
                               lg: '400px',  // 큰 화면
                           },
                           overflowY: 'auto',
                       }}>
                    {msgBox}
                </MDBox>

                <MDBox sx={{
                    position: 'fixed',
                    bottom: {
                        xs: 30,  // 모바일 화면
                        sm: 30,  // 작은 화면
                        md: 60,  // 중간 화면에서 더 띄움
                        lg: 30,  // 큰 화면
                        xl: 30   // 매우 큰 화면
                    },
                    width: '100%',
                    backgroundColor: 'white',
                    padding: '16px',
                    maxWidth: '800px',
                    margin: '0 auto',
                    display: 'flex',
                    justifyContent: 'center',
                    zIndex: 1000, // 다른 요소들보다 위에 오도록 설정
                }}>
                    <Card sx={{
                        width: '100%',
                    }}>
                        <MDBox pt={1} pb={1} px={1} sx={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center'
                        }}>
                            <Grid container justifyContent="center"
                                  alignItems="center">
                                <Grid item xs={10.5}>
                                    <ProfanityFilterMDInput label="메시지 보내기"
                                                            type="text"
                                                            id="msg"
                                                            onChange={onChangeChat}
                                                            onKeyDown={handleKeyDown}
                                                            value={chat}
                                                            fullWidth/>
                                </Grid>
                                <Grid item xs={1.5}>
                                    <MDBox sx={{
                                        display: 'flex',
                                        justifyContent: 'center'
                                    }}>
                                        <MDButton onClick={sendChat}
                                                  variant="gradient"
                                                  color="info"
                                                  sx={{
                                                      fontFamily: 'JalnanGothic',
                                                      fontSize: '1rem',
                                                      padding: '4px 20px',
                                                  }}>
                                            전송
                                        </MDButton>
                                    </MDBox>
                                </Grid>
                            </Grid>
                        </MDBox>
                    </Card>
                </MDBox>
            </MDBox>
        </DashboardLayout>
    );
}

export default ChatDetail
