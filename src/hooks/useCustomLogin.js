//import {useDispatch, useSelector} from "react-redux"
//import {Navigate, useNavigate} from "react-router-dom"
//import {loginPostAsync, logoutPostAsync} from "../slices/loginSlice"
//import {getCookie} from "../util/cookieUtil";
//import {jwtDecode} from "jwt-decode";
//
//const useCustomLogin = () => {
//
//    const navigate = useNavigate()
//
//    const dispatch = useDispatch()
//
//    const loginState = useSelector(state => state.loginSlice) //-------로그인 상태
//
//    //console.log("현재 로그인 상태: ", loginState)
//    //const isLogin = loginState.memberId !== "" //----------로그인 여부
//
//    const isAuthorization = getCookie('Authorization')
//
//    let isAdmin = false;
//    let isSeller = false;
//    let isMember = false;
//    let userId = null;
//
//    if (isAuthorization) {
//        try {
//            /*JWT 를 디코딩하고 해당 페이로드를 검사*/
//            const decodedToken = jwtDecode(isAuthorization);
//            isAdmin = decodedToken.role === 'ROLE_ADMIN';
//            isSeller = decodedToken.role === 'ROLE_SELLER';
//            isMember = decodedToken.role === 'ROLE_MEMBER';
//            userId = decodedToken.sub || decodedToken.id;
//            //console.log("?!?!??!?"+ isMember)
//        } catch (error) {
//            console.error("Invalid token:", error);
//        }
//    }
//
//    const doLogin = async (loginParam) => { //----------로그인 함수
//        const action = await dispatch(loginPostAsync(loginParam))
//        //console.log("doLogin 액션 페이로드: ", action.payload)
//        return action.payload
//    }
//
//    const doLogout = async () => { //---------------로그아웃 함수
//        await dispatch(logoutPostAsync())
//    }
//
//    const moveToPath = (path) => {  //----------------페이지 이동
//        navigate({pathname: path}, {replace: true})
//    }
//
//    const moveToLogin = () => { //----------------------로그인 페이지로 이동
//        navigate({pathname: '/authentication/sign-in'}, {replace: true})
//    }
//
//    const moveToLoginReturn = () => { //----------------------로그인 페이지로 이동 컴포넌트
//        return <Navigate replace to="/authentication/sign-in"/>
//    }
//
//    return {
//        loginState,
//        //isLogin,
//        doLogin,
//        doLogout,
//        moveToPath,
//        moveToLogin,
//        moveToLoginReturn,
//        isAuthorization,
//        isAdmin,
//        isSeller,
//        isMember,
//        userId
//    }
//
//}
//
//export default useCustomLogin


// 서버에서 액세스토큰 호출 함수를 통해 isAuthorization 정의
import { useDispatch, useSelector } from "react-redux";
import { Navigate, useNavigate } from "react-router-dom";
import { loginPostAsync, logoutPostAsync, setAuthorization, clearAuthorization } from "../slices/loginSlice";
import { jwtDecode } from "jwt-decode";
import { getAccessToken } from "../api/tokenApi";
import { useEffect } from "react";

const useCustomLogin = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const loginState = useSelector(state => state.loginSlice);
    const { isAuthorization } = loginState;

    useEffect(() => {
        const fetchAccessToken = async () => {
            try {
                const token = await getAccessToken();
                dispatch(setAuthorization(token)); // 액세스 토큰을 Redux 상태에 설정
            } catch (error) {
                console.error("액세스 토큰 가져오기 오류:", error);
            }
        };

        fetchAccessToken();
    }, [dispatch]);

    let isAdmin = false;
    let isSeller = false;
    let isMember = false;
    let userId = null;

    if (isAuthorization) {
        try {
            const decodedToken = jwtDecode(isAuthorization);
            isAdmin = decodedToken.role === 'ROLE_ADMIN';
            isSeller = decodedToken.role === 'ROLE_SELLER';
            isMember = decodedToken.role === 'ROLE_MEMBER';
            userId = decodedToken.sub || decodedToken.id;
        } catch (error) {
            console.error("Invalid token:", error);
        }
    }

    const doLogin = async (loginParam) => {
        const action = await dispatch(loginPostAsync(loginParam));
        return action.payload;
    }

    const doLogout = async () => {
        await dispatch(logoutPostAsync());
        dispatch(clearAuthorization()); // 로그아웃 시 Redux 상태 초기화
    }

    const moveToPath = (path) => {
        navigate({ pathname: path }, { replace: true });
    }

    const moveToLogin = () => {
        navigate({ pathname: '/authentication/sign-in' }, { replace: true });
    }

    const moveToLoginReturn = () => {
        return <Navigate replace to="/authentication/sign-in" />;
    }

    return {
        loginState,
        doLogin,
        doLogout,
        moveToPath,
        moveToLogin,
        moveToLoginReturn,
        isAuthorization,
        isAdmin,
        isSeller,
        isMember,
        userId
    }
}

export default useCustomLogin;
