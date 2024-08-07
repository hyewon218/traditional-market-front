import * as React from "react"
import {useEffect, useState} from "react"
import {useNavigate} from "react-router-dom";
import MDBox from "../../components/MD/MDBox";
import Card from "@mui/material/Card";
import Grid from "@mui/material/Grid";
import MDTypography from "../../components/MD/MDTypography";
import DashboardLayout from "../../examples/LayoutContainers/DashboardLayout";
import useCustomLogin from "../../hooks/useCustomLogin";
import MDButton from "../../components/MD/MDButton";
import {getChatRooms, getMyChatRooms, postChatRoom} from "../../api/chatApi"

const initState = {
    no: '',
    title: '',
    chatRoomList: []
}
function Chat() {
    const [chatRoom, setChatRoom] = useState(initState); // 채팅방 기록
    const navigate = useNavigate()
    const {moveToLoginReturn, isAuthorization, isAdmin} = useCustomLogin() // 로그인이 필요한 페이지

    const handlePostChatRoom = () => {
        postChatRoom().then(data => {
            console.log(data);
            const newChatRoom = data;
            setChatRoom(prevState => ({
                ...prevState,
                chatRoomList: [...prevState.chatRoomList, newChatRoom]
            }));
            navigate('/chat-detail', { state: newChatRoom });
            console.log(data);
        }).catch(error => {
            console.error("채팅방 생성에 실패했습니다.", error);
        });
    };

    const handleGetChatRooms = () => {
        const apiCall = isAdmin ? getChatRooms : getMyChatRooms;
        apiCall().then(data => {
            setChatRoom(data)
            console.log(data);
        }).catch(error => {
            console.error("채팅방 조회에 실패했습니다.", error);
        });
    };

    const handleDetail = (chatRoom) => {
        console.log('handleDetail');
        console.log("chat!!!!!!!!!!!"+chatRoom);
        navigate('/chat-detail', { state: chatRoom });
    };

    const buttonStyle = {
        backgroundColor: '#50bcdf',
        color: '#ffffff',
        fontSize: '2rem',
        fontFamily: 'JalnanGothic',
        padding: '20px 40px',
        width: '330px',
    };

    useEffect(() => {
        handleGetChatRooms();
    }, [])

    if(!isAuthorization){
        return moveToLoginReturn()
    }

    return (
        <DashboardLayout>
            <MDBox pt={3} pb={3}>
                <MDButton onClick={handlePostChatRoom}
                          variant="gradient"
                          size="large"
                          sx={{
                              ...buttonStyle,
                              ml: 3, mb: 3
                          }}
                >채팅 상담하기
                </MDButton>

                {chatRoom.chatRoomList.map((chatRoom) => (
                    <MDBox pt={2} pb={2} px={3} key={chatRoom.no}>
                        <Card>
                            <MDBox pt={2} pb={2} px={3}>
                                <Grid container onClick={() => handleDetail(chatRoom)}>
                                    <Grid item xs={8}>
                                        <MDTypography fontWeight="bold"
                                                      variant="body2">
                                            {chatRoom.title}
                                        </MDTypography>
                                    </Grid>
                                    {isAdmin && (
                                        <Grid item xs={2}>
                                            <MDTypography fontWeight="bold"
                                                          variant="body2">
                                                {chatRoom.username}
                                            </MDTypography>
                                        </Grid>
                                    )}
                                    <Grid item xs={2}>
                                        <MDTypography fontWeight="bold"
                                                      variant="body2">
                                            {chatRoom.createTime}
                                        </MDTypography>
                                    </Grid>
                                </Grid>
                            </MDBox>
                        </Card>
                    </MDBox>
                ))}
            </MDBox>
        </DashboardLayout>
    )
}

export default Chat