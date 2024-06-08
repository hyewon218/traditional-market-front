import {useEffect, useState} from "react"
import {getChatRooms} from "../../api/chatApi"
import {useNavigate} from "react-router-dom";

const initState = {
    no: '',
    title: '',
    chatRoomList: []
}
const ListComponent = () => {
    const [chatRoom, setChatRoom] = useState(initState); // 채팅방 기록

    const navigate = useNavigate()

    useEffect(() => {
        getChatRooms().then(data => {
            console.log(data)
            setChatRoom(data)
            console.log(data.chatRoomList)
        })
    }, [])

    return (
        <div className="border-2 border-sky-200 mt-10 m-2 p-4 ">
            {chatRoom && chatRoom.chatRoomList.map((chatRoom) =>
                <div className="flex justify-center">
                    <div
                        className="relative mb-4 flex w-full flex-wrap items-stretch">
                        <div
                            className="w-4/5 p-6 rounded-r border border-solid shadow-md"
                            onClick={() => navigate(
                                `/chatroom/chat/${chatRoom.no}`)}>{chatRoom.title}</div>
                    </div>
                </ div>
            )}
        </div>
    )
}

export default ListComponent