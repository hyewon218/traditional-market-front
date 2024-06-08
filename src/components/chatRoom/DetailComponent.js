import {useState, useEffect} from 'react';
import useCustomLogin from "../../hooks/useCustomLogin";
import {getCookie} from "../../util/cookieUtil";
import {getChatDetails} from '../../api/chatApi';
import styles from "../../chatRoom.css";
import * as StompJs from "@stomp/stompjs";
import 'bootstrap/dist/css/bootstrap.min.css';
import {Button} from "react-bootstrap";

const initState = {
    chatList: []
}

const DetailComponent = ({rno}) => {
    console.log("rno???" + rno)
    const {loginState} = useCustomLogin()
    const memberId = loginState.memberId;
    let [client, changeClient] = useState(null);
    const [chat, setChat] = useState(""); // 입력된 chat 을 받을 변수

    const [chatListDto, setChatListDto] = useState(initState); // 채팅 기록

    useEffect(() => {
        getChatDetails(rno).then(data => {
            setChatListDto(data)
            console.log(data)
        })
    }, [rno])

    const msgBox = chatListDto.chatList.map((chat, idx) => {
        console.log(
            "로그인 사용자 ID===========" + memberId + "/sender====== " + chat.sender)

        if (Number(chat.sender) === memberId) {
            return (
                <div key={idx} id="my-Chat">
                    <div className={styles.chatAvatar}>
                        <span>{chat.sender}</span>
                    </div>
                    <div className={styles.chatBody}>
                        <div className={styles.chatContent}>
                            <p className={styles.writerRight}>{chat.message}</p>
                            <p className={styles.chatTime}>{chat.dateTime}</p>
                        </div>
                    </div>
                </div>
            );
        } else {
            return (
                <div key={idx} className={styles.otherChat}>
                    <div className={styles.chatAvatar}>
                        <span>{chat.sender}</span>
                    </div>
                    <div className={styles.chatBody}>
                        <div className={styles.chatContent}>
                            <div className={styles.writerLeft}>
                                <p className={styles.writerLeft}>{chat.message}</p>
                                <p className={styles.chatTime}>{chat.dateTime}</p>
                            </div>
                        </div>
                    </div>
                </div>
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
                stompClient.subscribe("/sub/chat/" + rno, function (response) {
                    console.log(response);
                    console.log(JSON.parse(response.body));
                });
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

    /*    const callback = function (message) {
            if (message.body) {
                let msg = JSON.parse(message.body);
                console.log("callback"+msg)
                setChatListDto((chats) => [...chats, msg]);
            }
        };
        // 채팅방 번호가 담긴 주소로 구독요청. 구독과 동시에 실행할 콜백함수를 인자로 넘긴다.
        */

// 채팅 배열에 새로 받은 메시지를 추가
    const sendChat = () => {
        if (chat === "") {
            return;
        }
        client.publish({
            destination: "/pub/chat/message/" + rno,
            body: JSON.stringify({
                sender: memberId,
                message: chat,
            }),
        });
        setChat("");
    };
// destination 과 body 를 publish 를 사용해 서버단에 보내준다.

    useEffect(() => {
        // 최초 렌더링 시 , 웹소켓에 연결
        // 우리는 사용자가 방에 입장하자마자 연결 시켜주어야 하기 때문에
        connect();

        return () => disConnect();
    }, []);

    const onChangeChat = (e) => {
        setChat(e.target.value);
    };

    const handleSubmit = (event) => {
        event.preventDefault();
    };

    // Enter 키로 메시지 전송 핸들러
    const handleKeyPress = (e) => {
        if (e.key === 'Enter') {
            sendChat();
        }
    };

    return (
        <>
            <div className={styles.chatRoom}>
                <div className={styles.chats}>

                    {/* 채팅 리스트 */}
                    <div className={styles.chatBox}>{msgBox}</div>

                    {/* 하단 입력폼 */}
                    <form className={styles.panelFooter}
                          onSubmit={handleSubmit}>
                        <div>
                            <input
                                type="text"
                                id="msg"
                                value={chat}
                                placeholder="메시지 보내기"
                                onChange={onChangeChat}
                            />
                            <Button
                                type="button"
                                value="전송"
                                onClick={handleKeyPress}
                            />
                        </div>
                    </form>
                </div>
            </div>
        </>
    );
}
export default DetailComponent
