import * as React from "react"
import {useEffect, useState} from "react"
import {getChatRooms} from "../../api/chatApi"
import {useNavigate} from "react-router-dom";
import MDBox from "../../components/MD/MDBox";
import Card from "@mui/material/Card";
import Grid from "@mui/material/Grid";
import MDTypography from "../../components/MD/MDTypography";
import DashboardLayout from "../../examples/LayoutContainers/DashboardLayout";
import useCustomLogin from "../../hooks/useCustomLogin";

const initState = {
    no: '',
    title: '',
    chatRoomList: []
}
function Chat() {
    const [chatRoom, setChatRoom] = useState(initState); // 채팅방 기록
    const navigate = useNavigate()
    const {moveToLoginReturn, isAuthorization} = useCustomLogin() // 로그인이 필요한 페이지

    const handleDetail = (chatRoom) => {
        console.log('handleDetail');
        console.log("chat!!!!!!!!!!!"+chatRoom);
        navigate('/chat-detail', { state: chatRoom });
    };

    useEffect(() => {
        getChatRooms().then(data => {
            console.log(data)
            setChatRoom(data)
            //console.log(data.chatRoomList)
        })
    }, [])

    if(!isAuthorization){
        return moveToLoginReturn()
    }

    return (
        <DashboardLayout>
            <MDBox pt={3} pb={3}>
                {chatRoom.chatRoomList.map((chatRoom) => (
                    <MDBox pt={2} pb={2} px={3}>
                        <Card>
                            <MDBox pt={2} pb={2} px={3}>
                                <Grid container onClick={() => handleDetail(chatRoom)}>
                                    <Grid item xs={10}>
                                        <MDTypography fontWeight="bold"
                                                      variant="body2">
                                            {chatRoom.title}
                                        </MDTypography>
                                    </Grid>
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