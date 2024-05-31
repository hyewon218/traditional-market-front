import {
    createSearchParams,
    useNavigate,
    useParams,
    useSearchParams
} from "react-router-dom";
import {useCallback} from "react";
import ReadComponent from "../../components/markets/ReadComponent";

const ReadPage = () => {

    const {mno} = useParams()
    const navigate = useNavigate()
    const [queryParams] = useSearchParams()
    const page = queryParams.get("page") ? parseInt(queryParams.get("page")) : 1
    const size = queryParams.get("size") ? parseInt(queryParams.get("size"))
        : 10
    const queryStr = createSearchParams({page, size}).toString()

    const moveToList = useCallback(() => {
        navigate({pathname: '/markets/list', search: queryStr})
    }, [page, size])

    return (
        <div className="font-extrabold w-full bg-white mt-6">

            <div className="text-2xl">
                Market Read Page Component {mno}

                <ReadComponent mno={mno}></ReadComponent>
            </div>
        </div>
    );
}
export default ReadPage;