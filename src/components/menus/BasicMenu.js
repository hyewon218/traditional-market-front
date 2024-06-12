import {Link} from "react-router-dom";
import useCustomLogin from "../../hooks/useCustomLogin";

const BasicMenu = () => {

    const {loginState} = useCustomLogin()

    return (
        <nav id='navbar' className=" flex bg-blue-300">

            <div className="w-4/5 bg-gray-500">
                <ul className="flex p-4 text-white font-bold">
                    <li className="pr-6 text-2x1">
                        <Link to={'/'}>Main</Link>
                    </li>
                    <li className="pr-6 text-2x1">
                        <Link to={'/markets/'}>Market</Link>
                    </li>

                    {loginState.memberId ?  //로그인한 사용자만 출력되는 메뉴
                        <>
                            <li className="pr-6 text-2x1">
                                <Link to={'/about'}>About</Link>
                            </li>
                            <li className="pr-6 text-2x1">
                                <Link to={'/chatroom'}>1 : 1 채팅 상담</Link>
                            </li>
                            <li className="pr-6 text-2x1">
                                <Link to={'/notification'}>알람 목록</Link>
                            </li>
                        </>
                        :
                        <></>
                    }
                </ul>
            </div>

            <div
                className="w-1/5 flex justify-end bg-orange-300 p-4 font-medium">
                {!loginState.memberId ?
                    <div className="text-white text-sm m-1 rounded">
                        <Link to={'/member/login'}>Login</Link>
                    </div>
                    :
                    <div className="text-white text-sm m-1 rounded">
                        <Link to={'/member/logout'}>Logout</Link>
                    </div>
                }
            </div>
        </nav>
    );
}
export default BasicMenu;