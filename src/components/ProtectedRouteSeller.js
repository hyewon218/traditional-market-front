// 특정 경로에 대한 접근을 보호하며, 인증 상태와 사용자 역할에 따라 조건부 리디렉션을 처리
import React from 'react';
import { Navigate } from 'react-router-dom';
import useCustomLogin from '../hooks/useCustomLogin'; // useCustomLogin 훅 경로 맞추기

const ProtectedRouteSeller = ({ children  }) => {
    const { isAuthorization, isSeller } = useCustomLogin();

    console.log("ProtectedRouteSeller- isSeller:", isSeller); // 로그 추가
    console.log("ProtectedRouteSeller- isAuthorization:", isAuthorization); // 로그 추가
    console.log("ProtectedRouteSeller - children :", children );

    if (!isAuthorization) {
        return <Navigate to="/authentication/sign-in" />;
    }

    if (!isSeller) {
        return <Navigate to="/market" />; // 권한 없을 경우 이동할 페이지 만들기
    }

    console.log("ProtectedRouteSeller - Rendering element");
    return children ;
};

export default ProtectedRouteSeller;
