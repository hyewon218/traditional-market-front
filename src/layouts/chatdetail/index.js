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
import MDInput from "../../components/MD/MDInput";
import MDButton from "../../components/MD/MDButton";
import {yellow} from "@mui/material/colors";
import {getChatDetails, getIsRead, putIsRead} from '../../api/chatApi';

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

    const msgBox = chatList.map((chat, index) => {
        //console.log("로그인 사용자 ID = " + userId + "/sender =" + chat.sender)
        const sender = isAdmin ? chat.sender : '관리자' /*else 에서 사용,*/
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
                                                {/* {chat.sender}*/}
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
    })

    return (
        <DashboardLayout>
            <MDBox sx={{
                maxWidth: '800px',
                margin: '0 auto',
                display: 'flex',
                flexDirection: 'column',
                height: '100vh'
            }}>
                <MDBox pt={5} pb={3}
                       sx={{display: 'flex', justifyContent: 'center'}}>
                    <Card sx={{
                        width: '50%',
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center'
                    }}>
                        <MDTypography fontWeight="bold"
                                      sx={{fontSize: '2rem', pb: 3, pt: 3}}
                                      variant="body2">
                            무엇을 도와드릴까요?
                        </MDTypography>
                    </Card>
                </MDBox>

                <MDBox sx={{
                    flexGrow: 1,
                    overflowY: 'auto',
                    paddingBottom: '72px'
                }}>
                    {msgBox}
                </MDBox>

                <MDBox sx={{
                    position: 'fixed',
                    bottom: 30,
                    left: 450,
                    width: '100%',
                    backgroundColor: 'white',
                    //boxShadow: '0 -2px 5px rgba(0, 0, 0, 0.1)',
                    padding: '16px',
                    maxWidth: '800px',
                    margin: '0 auto',
                    display: 'flex',
                    justifyContent: 'center', /* Centering the content */
                }}>
                    <Card sx={{width: '100%'}}>
                        <MDBox pt={1} pb={1} px={1} sx={{display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
                            <Grid container justifyContent="center" alignItems="center">
                                <Grid item xs={10.5}>
                                    <MDInput label="메시지 보내기"
                                             type="text"
                                             id="msg"
                                             onChange={onChangeChat}
                                             onKeyDown={handleKeyDown}
                                             value={chat}
                                             fullWidth/>
                                </Grid>
                                <Grid item xs={1.5}>
                                    <MDBox sx={{display: 'flex', justifyContent: 'center'}}>
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
