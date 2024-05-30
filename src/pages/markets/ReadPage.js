import {useParams} from "react-router-dom";

const ReadPage = () => {

    const {mno} = useParams()

    return (
        <div className="text-3xl font-extrabold">
            Market Read Page Component {mno}
        </div>
    );
}

export default ReadPage;