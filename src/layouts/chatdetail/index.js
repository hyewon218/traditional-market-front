import * as React from 'react';
import {useEffect, useState} from 'react';
import useCustomLogin from "../../hooks/useCustomLogin";
import {getCookie} from "../../util/cookieUtil";
import * as StompJs from "@stomp/stompjs";
import 'bootstrap/dist/css/bootstrap.min.css';
import {useLocation, useNavigate} from "react-router-dom";
import DashboardLayout from "../../examples/LayoutContainers/DashboardLayout";
import MDBox from "../../components/MD/MDBox";
import Card from "@mui/material/Card";
import Grid from "@mui/material/Grid";
import MDTypography from "../../components/MD/MDTypography";
import MDInput from "../../components/MD/MDInput";
import MDButton from "../../components/MD/MDButton";
import {yellow} from "@mui/material/colors";
import {getChatDetails} from '../../api/chatApi';

function ChatDetail() {
    const {state} = useLocation();
    const charRoom = state; // 전달된 charRoom 데이터를 사용

    let [client, changeClient] = useState(null);
    const [chat, setChat] = useState(""); // 입력된 chat 을 받을 변수
    const [chatList, setChatList] = useState([]); // 채팅 기록

    const {moveToLoginReturn, isAuthorization, userId} = useCustomLogin()
    const navigate = useNavigate()

    const handleGetChatDetails = () => {
        getChatDetails(charRoom.no).then(data => {
            setChatList(data);
            console.log(data);
        }).catch(error => {
            console.error("채팅방 조회에 실패했습니다.", error);
        });
    };

    useEffect(() => {
        // 최초 렌더링 시 , 웹소켓에 연결
        // 우리는 사용자가 방에 입장하자마자 연결 시켜주어야 하기 때문에
        connect();

        return () => disConnect();
    }, []);

    useEffect(() => {
        handleGetChatDetails();
    }, [charRoom, navigate]);

    if(!isAuthorization){
        return moveToLoginReturn()
    }

    const msgBox = chatList.map((chat) => {
        console.log("로그인 사용자 ID = " + userId + "/sender =" + chat.sender)

        if (chat.sender === userId) {
            return (
                <MDBox pt={2} pb={2} px={3}>
                    <Card sx={{backgroundColor: yellow[500]}}>
                        <MDBox pt={2} pb={2} px={3}>
                            <Grid container>
                                <Grid item xs={8}>
                                    <MDTypography fontWeight="bold"
                                                  variant="body2">
                                        {chat.message}
                                    </MDTypography>
                                </Grid>
                                <Grid item xs={2}>
                                    <MDTypography fontWeight="bold"
                                                  variant="body2">
                                        {chat.sender}
                                    </MDTypography>
                                </Grid>
                                <Grid item xs={2}>
                                    <MDTypography fontWeight=""
                                                  variant="body2">
                                        {chat.createdAt}
                                    </MDTypography>
                                </Grid>
                            </Grid>
                        </MDBox>
                    </Card>
                </MDBox>
            );
        } else {
            return (
                <MDBox pt={2} pb={2} px={3}>
                    <Card>
                        <MDBox pt={2} pb={2} px={3}>
                            <Grid container>
                                <Grid item xs={8}>
                                    <MDTypography fontWeight="bold"
                                                  variant="body2">
                                        {chat.message}
                                    </MDTypography>
                                </Grid>
                                <Grid item xs={2}>
                                    <MDTypography fontWeight="bold"
                                                  variant="body2">
                                        {chat.sender}
                                    </MDTypography>
                                </Grid>
                                <Grid item xs={2}>
                                    <MDTypography fontWeight=""
                                                  variant="body2">
                                        {chat.createdAt}
                                    </MDTypography>
                                </Grid>
                            </Grid>
                        </MDBox>
                    </Card>
                </MDBox>
            );
        }
    })

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

// 채팅 배열에 새로 받은 메시지를 추가
    const sendChat = () => {
        if (chat === "") {
            return;
        }

        const formattedDate = new Date().toLocaleTimeString(); // UTC 시간으로 포맷

        const newMessage = {
            sender: userId,
            message: chat,
            createdAt: formattedDate
        };

        client.publish({
            destination: "/pub/chat/message/" + charRoom.no,
            body: JSON.stringify(newMessage),
        });

        console.log("formattedDate!!!!!" + formattedDate)
        setChat("");
    };
    // destination 과 body 를 publish 를 사용해 서버단에 보내준다.

    const callback = function (message) {
        if (message.body) {
            let msg = JSON.parse(message.body);
            console.log("callback!!!!!!!!!!!" + JSON.stringify(msg))

            // 메시지에 시간이 포함되어 있다면 로그에 출력
            if (msg.createdAt) {
                console.log("채팅 보내는 시간!!!!!!!!: " + msg.createdAt);
            }

            setChatList((chats) => [...chats, msg]);// 채팅 배열에 새로 받은 메시지를 추가
        }
    };
    // 채팅방 번호가 담긴 주소로 구독요청. 구독과 동시에 실행할 콜백함수를 인자로 넘긴다.

    const onChangeChat = (e) => {
        setChat(e.target.value);
    };

    // Enter 키로 메시지 전송 핸들러
    const handleKeyDown = (e) => {
        if (e.keyCode === 13) {
            sendChat();
        }
    }

    return (
        <DashboardLayout>
            {msgBox}
            <MDBox pt={2} pb={2} px={3}>
                <Card>
                    <MDBox pt={2} pb={2} px={3}>
                        <Grid container>
                            <Grid item xs={10}>
                                <MDInput label="메시지 보내기"
                                         type="text"
                                         id="msg"
                                         onChange={onChangeChat}
                                         onKeyDown={handleKeyDown} fullWidth/>
                            </Grid>
                            <Grid item xs={2}>
                                <MDBox pb={2} px={3} right>
                                    <MDButton onClick={sendChat}
                                              variant="gradient" color="info"
                                              fullWidth>
                                        전송
                                    </MDButton>
                                </MDBox>
                            </Grid>
                        </Grid>
                    </MDBox>
                </Card>
            </MDBox>
        </DashboardLayout>
    );
}

export default ChatDetail
