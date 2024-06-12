import {Suspense, lazy} from "react";
import {Navigate} from "react-router-dom";

const Loading = <div>Loading....</div>
const NotificationList = lazy(
    () => import("../pages/notification/NotificationListPage"))

const notificationRouter = () => {

    return [
        {
            path: "list",
            element: <Suspense fallback={Loading}><NotificationList/></Suspense>
        },
        {
            path: "",
            element: <Navigate replace to="list"/>
        },
    ]
}
export default notificationRouter;