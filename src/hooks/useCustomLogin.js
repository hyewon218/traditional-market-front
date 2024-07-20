import {useDispatch, useSelector} from "react-redux"
import {Navigate, useNavigate} from "react-router-dom"
import {loginPostAsync, logoutPostAsync} from "../slices/loginSlice"

const useCustomLogin = () => {

    const navigate = useNavigate()

    const dispatch = useDispatch()

    const loginState = useSelector(state => state.loginSlice) //-------로그인 상태

    console.log("현재 로그인 상태: ", loginState)

    const isLogin = loginState.memberId !== "" //----------로그인 여부

    const doLogin = async (loginParam) => { //----------로그인 함수
        const action = await dispatch(loginPostAsync(loginParam))
        //console.log("doLogin 액션 페이로드: ", action.payload)
        return action.payload
    }

    const doLogout = async () => { //---------------로그아웃 함수
        await dispatch(logoutPostAsync())
    }

    const moveToPath = (path) => {  //----------------페이지 이동
        navigate({pathname: path}, {replace: true})
    }

    const moveToLogin = () => { //----------------------로그인 페이지로 이동
        navigate({pathname: '/member/login'}, {replace: true})
    }

    const moveToLoginReturn = () => { //----------------------로그인 페이지로 이동 컴포넌트
        return <Navigate replace to="/member/login"/>
    }

    return {
        loginState,
        isLogin,
        doLogin,
        doLogout,
        moveToPath,
        moveToLogin,
        moveToLoginReturn,
    }

}

export default useCustomLogin
