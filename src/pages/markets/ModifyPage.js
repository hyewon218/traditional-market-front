import {useNavigate} from "react-router-dom";

const ModifyPage = ({mno}) => {
    const navigate = useNavigate()
    const moveToRead = () => {
        navigate({pathname: '/markets/read/${mno}'})
    }

    const moveToList = () => {
        navigate({pathname: '/markets/list'})
    }

    return (
        <div className="text-3xl font-extrabold">
            Market Modify Page </div>
    );
}

export default ModifyPage;