import {Suspense, lazy} from "react";

import {createBrowserRouter} from "react-router-dom" ;
import marketRouter from "./marketRouter";
import memberRouter from "./memberRouter";
import chatroomRouter from "./chatroomRouter";

const Loading = <div>Loading....</div>
const Main = lazy(() => import("../pages/MainPage"))
const About = lazy(() => import("../pages/AboutPage"))
const MarketIndex = lazy(() => import("../pages/markets/IndexPage"))

const root = createBrowserRouter([
    {
        path: "",
        element: <Suspense fallback={Loading}><Main/></Suspense>
    },
    {
        path: "about",
        element: <Suspense fallback={Loading}> <About/></Suspense>
    },
    {
        path: "markets",
        element: <Suspense fallback={Loading}><MarketIndex/></Suspense>,
        children: marketRouter()
    },
    {
        path: "member",
        children: memberRouter()
    },
    {
        path: "chatroom",
        children: chatroomRouter()
    }
])
export default root;