import {Suspense, lazy} from "react";
import {Navigate} from "react-router-dom";

const Loading = <div>Loading....</div>
const MarketList = lazy(() => import("../pages/markets/ListPage"))
const MarketRead = lazy(() => import("../pages/markets/ReadPage"))
const MarketAdd = lazy(() => import("../pages/markets/AddPage"))
const MarketModify = lazy(() => import("../pages/markets/ModifyPage"))

const marketRouter = () => {

    return [
        {
            path: "list",
            element: <Suspense fallback={Loading}><MarketList/> </Suspense>
        },
        {
            path: "",
            element: <Navigate replace to="list"/>
        },
        {
            path: "read/:mno",
            element: <Suspense fallback={Loading}><MarketRead/></Suspense>
        },
        {
            path: "add",
            element: <Suspense fallback={Loading}><MarketAdd/></Suspense>
        },
        {
            path: "modify/:mno",
            element: <Suspense fallback={Loading}><MarketModify/></Suspense>
        }
    ]
}
export default marketRouter;