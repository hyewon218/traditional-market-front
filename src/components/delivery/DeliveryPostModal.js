/*배송지 추가 모달창*/
import * as React from "react";
import ReactDOM from 'react-dom';
import DaumPostcode from 'react-daum-postcode';

import DashboardLayout from "../../examples/LayoutContainers/DashboardLayout";
import MDBox from "../MD/MDBox";
import Card from "@mui/material/Card";
import MDInput from "../MD/MDInput";
import MDButton from "../MD/MDButton";
import MDTypography from "../MD/MDTypography";

import {useState} from "react";
import {postDelivery} from "../../api/deliveryApi";

const initState = {
    title: '',
    receiver: '',
    phone: '',
    postCode: '',
    roadAddr: '',
    jibunAddr: '',
    detailAddr: '',
    extraAddr: '',
}

const DeliveryPostModal = ({callbackFn}) => {

    const [deliveries, setDeliveries] = useState({...initState})
    const [zonecode, setZonecode] = useState('');
    const [address, setAddress] = useState('');
    const [isOpen, setIsOpen] = useState('false');
    const [jibunAddress, setJibunAddress] = useState('');

    const handleChangeMarket = (e) => {
        const {name, value} = e.target;
        setDeliveries((prevDeliveries) => ({...prevDeliveries, [name]: value}));
    }

    const toggleHandler = () => {
        setIsOpen((prevOpenState) => !prevOpenState);
    };


    const handlePostDelivery = (event) => {
        console.log('handlePostDelivery');
        event.preventDefault(); // 폼 전송 이벤트 방지

        // 유효성 검사
/*        if (!deliveries.title || !deliveries.receiver || !deliveries.phone
            || !deliveries.postCode || !deliveries.roadAddr
            || !deliveries.jibunAddr || !deliveries.detailAddr
        ) {
            alert('모든 필드를 입력해주세요');
            return;
        }*/

        // Create JSON data
        const deliveryData = {
            title: deliveries.title,
            receiver: deliveries.receiver,
            phone: deliveries.phone,
            postCode: deliveries.postCode,
            roadAddr: deliveries.roadAddr,
            jibunAddr: deliveries.jibunAddr,
            detailAddr: deliveries.detailAddr,
            extraAddr: deliveries.extraAddr,
        };

        console.log(deliveryData)

        postDelivery(deliveryData).then(data => {
            console.log(data)
            if (callbackFn) {
                callbackFn();
            }
        }).catch(error => {
            console.error("배송지 추가에 실패했습니다.", error);
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
        const {address, zonecode, jibunAddress} = data;
        setZonecode(zonecode);
        setAddress(address);
        setJibunAddress(jibunAddress);
        setDeliveries((prevDeliveries) => ({
            ...prevDeliveries,
            postCode: zonecode,
            roadAddr: address,
            jibunAddr: jibunAddress,
        }));
        //setIsOpen(false); // 우편번호 검색 후 모달 닫기
    };

    const closeHandler = (state) => {
        if (state === 'FORCE_CLOSE') {
            setIsOpen(false);
        } else if (state === 'COMPLETE_CLOSE') {
            setIsOpen(false);
        }
    };

    return ReactDOM.createPortal(
        <DashboardLayout>
            <div
                className={`fixed top-0 left-0 z-[1100] flex h-full w-full  justify-center bg-gray-600 bg-opacity-75`}>
                <MDBox pt={6} pb={3}
                       style={{
                           width: '80%',
                           maxWidth: '900px',
                           marginTop: '50px'
                       }}>
                    <Card>
                        <MDBox pt={4} pb={3} px={3}>
                            <div>
                                <MDTypography
                                    fontWeight="bold"
                                    variant="body2"
                                    fontSize="25px"
                                >
                                    배송지 추가
                                </MDTypography>
                            </div>

                            <MDBox component="form" role="form">
                                <MDBox mb={2}>
                                    <MDInput
                                        name="title"
                                        label="배송지 이름"
                                        onChange={handleChangeMarket}
                                        fullWidth/>
                                </MDBox>
                                <MDBox mb={2}>
                                    <MDInput
                                        name="receiver"
                                        label="받는 사람"
                                        onChange={handleChangeMarket}
                                        fullWidth/>
                                </MDBox>
                                <MDBox mb={2}>
                                    <MDInput
                                        name="phone"
                                        label="휴대전화번호"
                                        onChange={handleChangeMarket}
                                        fullWidth/>
                                </MDBox>
                                <MDBox mb={2}>
                                    <MDInput
                                        name="postCode"
                                        label="우편번호"
                                        value={zonecode}
                                        onChange={handleChangeMarket}
                                        fullWidth/>
                                </MDBox>
                                <MDBox mb={2}>
                                    <MDButton onClick={toggleHandler}
                                              variant="gradient"
                                              color="dark">
                                        주소 검색
                                    </MDButton>
                                </MDBox>
                                {!isOpen && (
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
                                        value={address}
                                        onChange={handleChangeMarket}
                                        fullWidth/>
                                </MDBox>
                                <MDBox mb={2}>
                                    <MDInput
                                        name="jibunAddr"
                                        label="지번주소"
                                        value={jibunAddress}
                                        onChange={handleChangeMarket}
                                        fullWidth/>
                                </MDBox>
                                <MDBox mb={2}>
                                    <MDInput
                                        name="detailAddr"
                                        label="상세주소"
                                        onChange={handleChangeMarket}
                                        fullWidth/>
                                </MDBox>
                                <MDBox mb={2}>
                                    <MDInput
                                        name="extraAddr"
                                        label="참고사항"
                                        onChange={handleChangeMarket}
                                        fullWidth/>
                                </MDBox>

                                <MDBox mt={4} mb={1} right>
                                    <MDButton onClick={handlePostDelivery}
                                              variant="gradient"
                                              color="info">
                                        배송지 추가
                                    </MDButton>
                                    <MDButton onClick={() => {
                                        if (callbackFn) {
                                            callbackFn()
                                        }
                                    }}
                                              variant="gradient"
                                              color="info">
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
}

export default DeliveryPostModal;