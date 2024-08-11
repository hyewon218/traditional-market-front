// CoordinatePopupPage.jsx
import React from 'react';
import CoordinatePopup from '../components/findcoordinate/CoordinatePopup';

const CoordinatePopupPage = () => {
    // 좌표가 선택되었을 때 호출되는 함수
    const handleCoordinateSelect = (coords) => {
        if (window.opener) {
            // 부모 창이 열려있다면 좌표를 부모 창으로 전송
            window.opener.postMessage({ type: 'UPDATE_BUS_COORDS', coords }, window.location.origin);
        }
        // 현재 창 닫기
        window.close();
    };

    // 창 닫기 버튼 클릭 시 호출되는 함수
    const handleClose = () => {
        window.close(); // 현재 창 닫기
    };

    return (
        <CoordinatePopup
            onCoordinateSelect={handleCoordinateSelect} // 좌표 선택 핸들러를 props로 전달
            onClose={handleClose} // 닫기 핸들러를 props로 전달
        />
    );
};

export default CoordinatePopupPage;
