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
            <div className={`fixed top-0 left-0 z-[1100] flex h-full w-full justify-center bg-gray-600 bg-opacity-75`}>
                <MDBox pt={6} pb={3} style={{ width: '80%', maxWidth: '900px', marginTop: '50px' }}>
                    <Card>
                        <MDBox pt={4} pb={3} px={3}>
                            <div>
                                <MDTypography fontWeight="bold" variant="body2" fontSize="25px">
                                    배송지 수정
                                </MDTypography>
                            </div>

                            <MDBox component="form" role="form" style={{ maxHeight: '700px', overflowY: 'auto' }}>
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
                                    <MDButton onClick={toggleHandler} variant="gradient" color="dark">
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

                                <MDBox mt={4} mb={1} style={{ display: 'flex', justifyContent: 'flex-end' }}>
                                    <MDButton onClick={handlePutDelivery} variant="gradient" color="info" style={{ marginRight: '10px' }}>
                                        수정
                                    </MDButton>
                                    <MDButton onClick={() => { if (callbackFn) callbackFn() }} variant="gradient" color="info">
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
