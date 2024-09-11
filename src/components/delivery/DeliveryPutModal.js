import * as React from "react";
import { useEffect, useState } from "react";
import ReactDOM from 'react-dom';
import DaumPostcode from 'react-daum-postcode';

import DashboardLayout from "../../examples/LayoutContainers/DashboardLayout";
import MDBox from "../MD/MDBox";
import Card from "@mui/material/Card";
import MDInput from "../MD/MDInput";
import MDButton from "../MD/MDButton";
import MDTypography from "../MD/MDTypography";
import { putDelivery } from "../../api/deliveryApi";
import {useMediaQuery} from "@mui/material";

const DeliveryPutModal = ({ delivery = {}, callbackFn }) => {
    const defaultDelivery = {
        title: '',
        receiver: '',
        phone: '',
        postCode: '',
        roadAddr: '',
        jibunAddr: '',
        detailAddr: '',
        extraAddr: '',
    };

    const [deliveries, setDeliveries] = useState({ ...defaultDelivery, ...delivery });
    const [isOpen, setIsOpen] = useState(false);

    const isSmallScreen = useMediaQuery('(max-width:900px)');

    useEffect(() => {
        setDeliveries({ ...defaultDelivery, ...delivery });
    }, [delivery]);

    const handleChangeDelivery = (e) => {
        const { name, value } = e.target;
        setDeliveries((prevDeliveries) => ({ ...prevDeliveries, [name]: value }));
    };

    const toggleHandler = () => {
        setIsOpen((prevOpenState) => !prevOpenState);
    };

    const handlePutDelivery = () => { // 배송지 수정
        console.log('handlePutDelivery');
        const deliveryData = { ...deliveries };

        putDelivery(delivery.deliveryNo, deliveryData).then(data => {
            console.log('배송지 수정!!');
            console.log(data);
            if (callbackFn) {
                callbackFn();
            }
        }).catch(error => {
            console.error("배송지 수정에 실패했습니다.", error);
        });
    };

    const themeObj = {
        bgColor: '#FFFFFF',
        pageBgColor: '#FFFFFF',
        postcodeTextColor: '#C05850',
        emphTextColor: '#222222',
    };

    const postCodeStyle = {
        width: '360px',
        height: '480px',
    };

    const completeHandler = (data) => {
        const { address, zonecode, jibunAddress } = data;
        setDeliveries((prevDeliveries) => ({
            ...prevDeliveries,
            postCode: zonecode,
            roadAddr: address,
            jibunAddr: jibunAddress,
        }));
        setIsOpen(false); // 우편번호 검색 후 모달 닫기
    };

    const closeHandler = (state) => {
        if (state === 'FORCE_CLOSE' || state === 'COMPLETE_CLOSE') {
            setIsOpen(false);
        }
    };

    return ReactDOM.createPortal(
        <DashboardLayout>
            <div className={`fixed top-20 md:top-36 lg:top-20 left-0 z-[1100] flex h-full w-full justify-center bg-gray-600 bg-opacity-75`}>
                <MDBox
                    sx={{
                        mt: {xs: 5, sm: 5, md: 3, lg: 3},
                    }}
                    style={{
                        width: isSmallScreen ? '70%' : '50%',
                    }}>
                    <Card>
                        <MDBox pt={2} pb={3} px={3}
                               style={{
                                   maxHeight: isSmallScreen? '66vh':'84vh', // 폼의 최대 높이
                                   overflowY: 'auto', // 폼 내부 스크롤
                                   borderRadius: '15px', // 모서리 라운드
                               }}
                               sx={{
                                   '&::-webkit-scrollbar': {
                                       width: '8px',
                                   },
                                   '&::-webkit-scrollbar-track': {
                                       background: '#f1f1f1',
                                       borderRadius: '12px', // 스크롤 트랙 라운드
                                   },
                                   '&::-webkit-scrollbar-thumb': {
                                       background: '#888',
                                       borderRadius: '12px', // 스크롤바 자체 라운드
                                   },
                                   '&::-webkit-scrollbar-thumb:hover': {
                                       background: '#555',
                                   },
                               }}
                        >
                            <div style={{ marginTop: '5px' }}>
                                <MDTypography fontWeight="bold" variant="body2" fontSize="25px">
                                    배송지 수정
                                </MDTypography>
                            </div>

                            <MDBox component="form" role="form">
                                <MDBox mb={2}>
                                    <MDInput
                                        name="title"
                                        label="배송지 이름"
                                        value={deliveries.title}
                                        onChange={handleChangeDelivery}
                                        fullWidth
                                    />
                                </MDBox>
                                <MDBox mb={2}>
                                    <MDInput
                                        name="receiver"
                                        label="받는 사람"
                                        value={deliveries.receiver}
                                        onChange={handleChangeDelivery}
                                        fullWidth
                                    />
                                </MDBox>
                                <MDBox mb={2}>
                                    <MDInput
                                        name="phone"
                                        label="휴대전화번호"
                                        value={deliveries.phone}
                                        onChange={handleChangeDelivery}
                                        fullWidth
                                    />
                                </MDBox>
                                <MDBox mb={2}>
                                    <MDInput
                                        name="postCode"
                                        label="우편번호"
                                        value={deliveries.postCode}
                                        onChange={handleChangeDelivery}
                                        fullWidth
                                    />
                                </MDBox>
                                <MDBox mb={2}>
                                    <MDButton
                                        onClick={toggleHandler}
                                        variant="gradient"
                                        color="dark"
                                        sx={{
                                            fontFamily: 'JalnanGothic',
                                            fontSize: '0.8rem',
                                            padding: '4px 8px',
                                        }}
                                    >
                                        주소 검색
                                    </MDButton>
                                </MDBox>
                                {isOpen && (
                                    <div>
                                        <DaumPostcode
                                            theme={themeObj}
                                            style={postCodeStyle}
                                            onComplete={completeHandler}
                                            onClose={closeHandler}
                                        />
                                    </div>
                                )}
                                <MDBox mb={2}>
                                    <MDInput
                                        name="roadAddr"
                                        label="도로명주소"
                                        value={deliveries.roadAddr}
                                        onChange={handleChangeDelivery}
                                        fullWidth
                                    />
                                </MDBox>
                                <MDBox mb={2}>
                                    <MDInput
                                        name="jibunAddr"
                                        label="지번주소"
                                        value={deliveries.jibunAddr}
                                        onChange={handleChangeDelivery}
                                        fullWidth
                                    />
                                </MDBox>
                                <MDBox mb={2}>
                                    <MDInput
                                        name="detailAddr"
                                        label="상세주소"
                                        value={deliveries.detailAddr}
                                        onChange={handleChangeDelivery}
                                        fullWidth
                                    />
                                </MDBox>
                                <MDBox mb={2}>
                                    <MDInput
                                        name="extraAddr"
                                        label="참고사항"
                                        value={deliveries.extraAddr}
                                        onChange={handleChangeDelivery}
                                        fullWidth
                                    />
                                </MDBox>

                                <MDBox style={{ display: 'flex', justifyContent: 'flex-end' }}>
                                    <MDButton
                                        onClick={handlePutDelivery}
                                        variant="gradient"
                                        color="info"
                                        style={{ marginRight: '10px' }}
                                        sx={{
                                            fontFamily: 'JalnanGothic',
                                            fontSize: '0.8rem',
                                            padding: '4px 8px',
                                        }}
                                    >
                                        수정
                                    </MDButton>
                                    <MDButton
                                        onClick={() => { if (callbackFn) callbackFn() }}
                                        variant="gradient"
                                        color="info"
                                        sx={{
                                            fontFamily: 'JalnanGothic',
                                            fontSize: '0.8rem',
                                            padding: '4px 8px',
                                        }}
                                    >
                                        취소
                                    </MDButton>
                                </MDBox>
                            </MDBox>
                        </MDBox>
                    </Card>
                </MDBox>
            </div>
        </DashboardLayout>,
        document.body // 포탈을 사용할 target 엘리먼트로 body를 지정
    );
};

export default DeliveryPutModal;
