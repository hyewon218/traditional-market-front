import {
    createSearchParams,
    useNavigate,
    useParams,
    useSearchParams
} from "react-router-dom";
import {useCallback} from "react";

const ReadPage = () => {

    const {mno} = useParams()
    const navigate = useNavigate()
    const [queryParams] = useSearchParams()
    const page = queryParams.get("page") ? parseInt(queryParams.get("page")) : 1
    const size = queryParams.get("size") ? parseInt(queryParams.get("size")) : 10

    const queryStr = createSearchParams({page, size}).toString()

    const moveToModify = useCallback((mno) => {
        navigate({
            pathname: `/markets/modify/${mno}`,
            search: queryStr
        })
    }, [mno, page, size])

    return (
        <div className="text-3xl font-extrabold">
            Market Read Page Component {mno}

            <div>
                <button onClick={() => moveToModify(33)}>Test Modify</button>
            </div>
        </div>
    );
}
export default ReadPage;