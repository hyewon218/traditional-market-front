import {Suspense, lazy} from "react";

import {createBrowserRouter} from "react-router-dom" ;

const Loading = <div>Loading....</div>
const Main = lazy(() => import("../pages/MainPage"))
const About = lazy(() => import("../pages/AboutPage"))
const MarketIndex = lazy(() => import("../pages/markets/IndexPage"))
const MarketList = lazy(() => import("../pages/markets/ListPage"))

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
        children: [
            {
                path: "list",
                element: <Suspense fallback={Loading}><MarketList/></Suspense>
            }
        ]
    }
])
export default root;