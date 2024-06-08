//import BasicLayout from "../../layouts/BasicLayout";
import DetailComponent from "../../components/chatRoom/DetailComponent";
import {useParams} from "react-router-dom";

const ChatRoomDetailPage = () => {

    const {rno} = useParams()

    return (
        <div className="text-3xl font-bold">
            <div>ChatRoom Page</div>

            <DetailComponent rno={rno}></DetailComponent>
        </div>
    );
}
export default ChatRoomDetailPage;