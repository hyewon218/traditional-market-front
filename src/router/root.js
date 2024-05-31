import {Suspense, lazy} from "react";

import {createBrowserRouter} from "react-router-dom" ;
import MarketRouter from "./marketRouter";

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
        children: MarketRouter()
    }
])
export default root;