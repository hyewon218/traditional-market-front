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
import {containsProfanity} from '../../components/common/profanityUtils';
import {useMediaQuery} from "@mui/material"; // 분리한 비속어 필터 내 containsProfanity 함수 import

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
    const isSmallScreen = useMediaQuery('(max-width:600px)');

    useEffect(() => {
        // 최초 렌더링 시 , 웹소켓에 연결
        // 사용자가 방에 들어가자마자 연결해야 하므로 connect()를 호출
        connect();
        //connectWebsocket();

        // 컴포넌트가 언마운트될 때, 연결을 해제하는 함수를 반환
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

    // WebSocket 구현
/*    const connectWebsocket = () => {
        // WebSocket connection
        try {
            // Create a new WebSocket connection
            const socket = new WebSocket("ws://localhost:8080/chat");

            // When the connection is successfully established
            socket.onopen = function () {
                console.log("WebSocket connection opened");

                // You can send an initial message to join a chat room or authenticate
                socket.send(JSON.stringify({
                    // 낮은 수준의 프로토콜이므로 메시지 페이로드에 메타데이터(예: "type")를 포함하여 메시지 유형을 명시적으로 처리해야 한다.
                    type: 'AUTH',
                    token: `${isAuthorization}`, // Send the token for authentication
                    roomId: charRoom.no // Indicate the chat room you want to join
                }));
            };

            // 서버에서 들어오는 메시지를 처리
            socket.onmessage = function (event) {
                const messageData = JSON.parse(event.data);
                //console.log("event.data!?!?!?"+messageData);

                if (messageData.type === 'CHAT') {
                    // Handle incoming chat messages
                    webSocketCallback(messageData);  // Process the chat message with your callback
                } else {
                    console.log('Other message type received:', messageData);
                }
            };

            // On WebSocket error
            socket.onerror = function (error) {
                console.error('WebSocket error:', error);
            };

            // 연결이 닫히면
            socket.onclose = function (event) {
                console.log('WebSocket connection closed:', event);

                // WebSocket 연결이 종료된 경우 5초 지연 후 재연결을 시도
                setTimeout(() => connectWebsocket(), 5000);
            };

            // Send a heartbeat message every 4 seconds (if needed)
            const heartbeatInterval = setInterval(() => {
                if (socket.readyState === WebSocket.OPEN) {
                    socket.send(JSON.stringify({ type: 'HEARTBEAT' }));
                }
                // WebSocket 연결이 닫힐 때 하트비트 메시지를 중지
                // 연결이 끊어진 후 불필요한 하트비트 메시지가 전송되는 것을 방지
            }, 5000);

            // Store the WebSocket client for future use
            changeClient(socket);

        } catch (err) {
            console.error('Error while connecting to WebSocket:', err);
        }
    };

    const sendWebsocketChat = () => {
        if (chat === "") {
            return;
        }

        const formattedDate = new Date().toLocaleTimeString(); // UTC 시간으로 포맷
        // Create a new chat message object
        const newMessage = {
            type: 'CHAT', // Indicate the type of message
            sender: userId,  // The ID of the user sending the message
            message: chat,   // The chat message content
            roomId: charRoom.no,  // The chat room number (this replaces the STOMP destination)
            createdAt: formattedDate  // Timestamp of the message
        };
        // Send (publish) the message using WebSocket
        client.send(JSON.stringify(newMessage)); // Send the message as a string

        // Clear the input after sending
        setChat("");
    };

    const webSocketCallback = function (message) {
        if (message) {
            // Process the message (e.g., update chat list)
            setChatList((chats) => [...chats, message]);
        }
    };*/

    // Stomp 구현
    const connect = () => {
        // WebSocket connection
        try {
            const stompClient = new StompJs.Client({
                //brokerURL: "ws://localhost:8080/stomp/chat",
                //brokerURL: "ws://3.36.96.0:8080/stomp/chat",
                brokerURL: "wss://tmarket.store/stomp/chat",
                connectHeaders: {
                    Authorization: `${isAuthorization}`
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
        // stomp
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
           //sendWebsocketChat();
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
        const adminIds = ['esc0218', 'esc0220', 'songwc3', 'won11111']; // 관리자 ID 배열
        const isSenderAdmin = adminIds.includes(chat.sender); // 메시지 보낸 사람이 관리자라면 true
        const senderName = isSenderAdmin ? '관리자' : chat.sender; // 일반 사용자 입장에서 관리자는 '관리자'로 표시

        if (isAdmin) { // 현재 사용자가 관리자일 경우
            if (isSenderAdmin) { // 관리자가 보낸 메시지 (현재 사용자와 동일한 관리자)
                return (
                    <MDBox key={index} pt={2} pb={isSmallScreen? 0.5:2} px={isSmallScreen? 0:3}>
                        <Grid container justifyContent="flex-end">
                            <Grid item xs={10} sm={6} md={8} lg={8}>
                                <Card sx={{ backgroundColor: yellow[500] }}>
                                    <MDBox pt={2} pb={2} px={isSmallScreen? 1.5:3}>
                                        <Grid container>
                                            <Grid item xs={6} lg={6}>
                                                <MDTypography
                                                    sx={{
                                                        fontSize: isSmallScreen? '0.8rem':'1rem'
                                                    }}
                                                    fontWeight="bold" variant="body2">
                                                    {chat.message}
                                                </MDTypography>
                                            </Grid>
                                            <Grid item xs={3} lg={3}>
                                                <MDTypography
                                                    sx={{
                                                        fontSize: isSmallScreen? '0.6rem':'1rem'
                                                    }}
                                                    fontWeight="bold" variant="body2">
                                                     {chat.sender}
                                                </MDTypography>
                                            </Grid>
                                            <Grid item xs={3} lg={3}>
                                                <MDTypography
                                                    sx={{
                                                        fontSize: isSmallScreen? '0.6rem':'1rem'
                                                    }}
                                                    fontWeight="" variant="body2">
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
                    <MDBox key={index} pt={2} pb={isSmallScreen? 0.5:2} px={isSmallScreen? 0:3}>
                        <Grid container justifyContent="flex-start">
                            <Grid item xs={10} sm={6} md={8} lg={8}>
                                <Card>
                                    <MDBox pt={2} pb={2} px={isSmallScreen? 1.5:3}>
                                        <Grid container>
                                            <Grid item xs={6} lg={6}>
                                                <MDTypography
                                                    sx={{
                                                        fontSize: isSmallScreen? '0.8rem':'1rem'
                                                    }}
                                                    fontWeight="bold" variant="body2">
                                                    {chat.message}
                                                </MDTypography>
                                            </Grid>
                                            <Grid item xs={3} lg={3}>
                                                <MDTypography
                                                    sx={{
                                                        fontSize: isSmallScreen? '0.6rem':'1rem'
                                                    }}
                                                    fontWeight="bold" variant="body2">
                                                    {senderName}
                                                </MDTypography>
                                            </Grid>
                                            <Grid item xs={3} lg={3}>
                                                <MDTypography
                                                    sx={{
                                                        fontSize: isSmallScreen? '0.6rem':'1rem'
                                                    }}
                                                    fontWeight="" variant="body2">
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
                    <MDBox key={index} pt={2} pb={isSmallScreen? 0.5:2} px={isSmallScreen? 0:3}>
                        <Grid container justifyContent="flex-end">
                            <Grid item xs={10} sm={6} md={8} lg={8}>
                                <Card sx={{ backgroundColor: yellow[500] }}>
                                    <MDBox pt={2} pb={2} px={isSmallScreen? 1.5:3}>
                                        <Grid container>
                                            <Grid item xs={8.5} lg={6}>
                                                <MDTypography
                                                    sx={{
                                                        fontSize: isSmallScreen? '0.8rem':'1rem'
                                                    }}
                                                    fontWeight="bold" variant="body2">
                                                    {chat.message}
                                                </MDTypography>
                                            </Grid>
                                            <Grid item xs={0} lg={3}>
                                                <MDTypography
                                                    sx={{
                                                        fontSize: isSmallScreen? '0.6rem':'1rem'
                                                    }}
                                                    fontWeight="bold" variant="body2">
                                                    {/* {chat.sender} */}
                                                </MDTypography>
                                            </Grid>
                                            <Grid item xs={3.5} lg={3}>
                                                <MDTypography
                                                    sx={{
                                                        fontSize: isSmallScreen? '0.6rem':'1rem'
                                                    }}
                                                    fontWeight="" variant="body2">
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
                    <MDBox key={index} pt={2} pb={isSmallScreen? 0.5:2} px={isSmallScreen? 0:3}>
                        <Grid container justifyContent="flex-start"> {/* 왼쪽에 배치 */}
                            <Grid item xs={10} sm={6} md={8} lg={8}>
                                <Card>
                                    <MDBox pt={2} pb={2} px={3}>
                                        <Grid container>
                                            <Grid item xs={6} lg={6}>
                                                <MDTypography
                                                    sx={{
                                                        fontSize: isSmallScreen? '0.8rem':'1rem'
                                                    }}
                                                    fontWeight="bold" variant="body2">
                                                    {chat.message}
                                                </MDTypography>
                                            </Grid>
                                            <Grid item xs={3} lg={3}>
                                                <MDTypography
                                                    sx={{
                                                        fontSize: isSmallScreen? '0.8rem':'1rem'
                                                    }}
                                                    fontWeight="bold" variant="body2">
                                                    {senderName}
                                                </MDTypography>
                                            </Grid>
                                            <Grid item xs={3} lg={3}>
                                                <MDTypography
                                                    sx={{
                                                        fontSize: isSmallScreen? '0.6rem':'1rem'
                                                    }}
                                                    fontWeight="" variant="body2">
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
                pb={isSmallScreen ? 1 : 5}
                sx={{
                mt: {xs: -3, sm: 3, md: 3, lg: 1},
                maxWidth: '800px',
                margin: '0 auto',
                display: 'flex',
                flexDirection: 'column',
            }}>
                <MDBox pb={1}
                       sx={{display: 'flex', justifyContent: 'center'}}>
                    <Card sx={{
                        width: '50%',
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center'
                    }}>
                        <MDTypography fontWeight="bold"
                                      sx={{
                                          fontSize: isSmallScreen ? '0.9rem' : '1.7rem',
                                          pb: 2, pt: 2
                                      }}
                                      variant="body2">
                            무엇을 도와드릴까요?
                        </MDTypography>
                    </Card>
                </MDBox>
                <MDTypography fontWeight="bold"
                              sx={{
                                  fontSize: isSmallScreen ? '0.75rem' :'0.9rem',
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
                               lg: '450px',  // 큰 화면
                           },
                           overflowY: 'auto',
                       }}>
                    {msgBox}
                </MDBox>

                <MDBox sx={{
                    position: 'fixed',
                    bottom: {
                        xs: 60,  // 모바일 화면
                        sm: 30,  // 작은 화면
                        md: 60,  // 중간 화면에서 더 띄움
                        lg: 60,  // 큰 화면
                        xl: 30   // 매우 큰 화면
                    },
                    width: '100%',
                    backgroundColor: 'white',
                    padding: isSmallScreen ? '2px' :'16px',
                    maxWidth: isSmallScreen ? '330px' :'800px',
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
                                <Grid item xs={8.5} lg={10.5}>
                                    <ProfanityFilterMDInput
                                        label="메시지 보내기"
                                        type="text"
                                        id="msg"
                                        onChange={onChangeChat}
                                        onKeyDown={handleKeyDown}
                                        value={chat}
                                        fullWidth
                                        sx={{ fontSize: '16px' }} // 1rem 은 약 16px 이지만 명시적으로 설정(확대방지)
                                    />
                                </Grid>
                                <Grid item xs={3.5} lg={1.5}>
                                    <MDBox sx={{
                                        display: 'flex',
                                        justifyContent: 'center'
                                    }}>
                                        <MDButton onClick={sendChat}
                                                  variant="gradient"
                                                  color="info"
                                                  sx={{
                                                      fontFamily: 'JalnanGothic',
                                                      fontSize: '16px',  // 1rem 은 약 16px 이지만 명시적으로 설정(확대방지)
                                                      padding: '4px 20px',
                                                  }}
                                        >
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
