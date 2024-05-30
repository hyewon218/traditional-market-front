import {Suspense, lazy} from "react";
import {Navigate} from "react-router-dom";

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
        }
    ]
}
export default marketRouter;