import {Suspense, lazy} from "react";
import {Navigate} from "react-router-dom";
import ReadPage from "../pages/markets/ReadPage";

const Loading = <div>Loading....</div>
const MarketList = lazy(() => import("../pages/markets/ListPage"))
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
            element: <Suspense fallback={Loading}><ReadPage/></Suspense>
        }
    ]
}
export default marketRouter;