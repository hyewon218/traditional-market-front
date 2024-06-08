import {Suspense, lazy} from "react";
import {Navigate} from "react-router-dom";

const Loading = <div>Loading....</div>
const ChatRoomList = lazy(() => import("../pages/chatroom/ChatRoomListPage"))
const ChatRoomDetail = lazy(() => import("../pages/chatroom/ChatRoomDetailPage"))

const chatroomRouter = () => {

    return [
        {
            path: "list",
            element: <Suspense fallback={Loading}><ChatRoomList/> </Suspense>
        },
        {
            path: "",
            element: <Navigate replace to="list"/>
        },
        {
            path: "chat/:rno",
            element: <Suspense fallback={Loading}><ChatRoomDetail/></Suspense>
        },
    ]
}
export default chatroomRouter;