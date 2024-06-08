import BasicLayout from "../../layouts/BasicLayout";
import ListComponent from "../../components/chatRoom/ListComponent";

const ChatRoomListPage = () => {

    return (
        <BasicLayout>
            <div className="text-3xl font-bold">
                <div>ChatRoom Page</div>

                <ListComponent></ListComponent>
            </div>
        </BasicLayout>
    );
}
export default ChatRoomListPage;