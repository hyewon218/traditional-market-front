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
import {
    getChatRooms, getIsRead,
    getMyChatRooms,
    postChatRoom,
    putIsRead
} from "../../api/chatApi"
import MDPagination from "../../components/MD/MDPagination";
import KeyboardArrowLeftIcon from "@mui/icons-material/KeyboardArrowLeft";
import KeyboardArrowRightIcon from "@mui/icons-material/KeyboardArrowRight";

const initState = {
    no: '',
    title: '',
    chatRoomList: []
}
function Chat() {
    const [chatRoom, setChatRoom] = useState(initState); // 채팅방 기록
    const [page, setPage] = useState(0);
    const [totalPage, setTotalPage] = useState(0);

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

    const handleGetChatRooms = (pageNum) => {
        const pageParam = {page: pageNum, size: 7};
        const apiCall = isAdmin ? getChatRooms : getMyChatRooms;
        apiCall(pageParam).then(data => {
            setChatRoom(data.content)
            setTotalPage(data.totalPages);
            console.log("data.content!!!!!!"+ data.content);
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

    const handleGetIsRead = (charRoomNo) => {
        getIsRead(charRoomNo).then(data => {
            console.log('채팅방 읽음 상태 조회!!!');
            console.log(data);
        }).catch(error => {
            console.error("채팅방 읽음 상태 조회에 실패했습니다.", error);
        });
    }

    const handleDetail = (chatRoom) => { // 채팅방 클릭
        if (!chatRoom.read) {
            handlePutRead(chatRoom.no);
        }
        console.log('handleDetail');
        console.log("chat!!!!!!!!!!!"+chatRoom);
        navigate('/chat-detail', { state: chatRoom });
    };

    const changePage = (pageNum) => {
        console.log('change pages');
        console.log(pageNum);
        console.log(page);
        setPage(pageNum);
        handleGetChatRooms(pageNum);
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
        handleGetChatRooms(page);
    }, [page]); // Add 'page' as a dependency to fetch data whenever page changes


    if(!isAuthorization){
        return moveToLoginReturn()
    }

    return (
        <DashboardLayout>
            <MDBox pt={1} pb={3}>
                {!isAdmin && (
                    <MDBox pt={3} pb={3}>
                        <MDButton
                            onClick={handlePostChatRoom}
                            variant="gradient"
                            size="large"
                            sx={{
                                ...buttonStyle,
                                ml: 3, mb: 3
                            }}
                        >
                            채팅 상담하기
                        </MDButton>
                    </MDBox>
                )}

                {Array.isArray(
                        chatRoom)
                    &&chatRoom.map((chatRoom) => (
                    <MDBox pt={2} pb={2} px={3} key={chatRoom.no}>
                        <Card
                            sx={{
                                backgroundColor: chatRoom.read ? '#ffffff' : '#fff8b0', // White for read, light yellow for unread
                                cursor: 'pointer'
                            }}
                            onClick={() => handleDetail(chatRoom)}
                        >
                            <MDBox pt={2} pb={2} px={3}>
                                <Grid container>
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

            <MDPagination size={"small"}>
                <MDPagination item>
                    <KeyboardArrowLeftIcon></KeyboardArrowLeftIcon>
                </MDPagination>
                {[...Array(totalPage).keys()].map(
                    (i) => (
                        <MDPagination item
                                      key={i}
                                      onClick={() => changePage(
                                          i)}>
                            {i + 1}
                        </MDPagination>
                    ))}
                <MDPagination item>
                    <KeyboardArrowRightIcon></KeyboardArrowRightIcon>
                </MDPagination>
            </MDPagination>
        </DashboardLayout>
    )
}

export default Chat