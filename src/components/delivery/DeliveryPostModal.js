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
import {useMediaQuery} from "@mui/material";

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
    const [isOpen, setIsOpen] = useState(true);

    const isSmallScreen = useMediaQuery('(max-width:600px)');

    const handleChangeDelivery = (e) => {
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
        const deliveryData = { ...deliveries };
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
        setDeliveries((prevDeliveries) => ({
            ...prevDeliveries,
            postCode: zonecode,
            roadAddr: address,
            jibunAddr: jibunAddress,
        }));
        setIsOpen(false); // 우편번호 검색 후 모달 닫기
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
                <MDBox pt={3} pb={3}
                       style={{
                           width: isSmallScreen ? '80%' : '50%',
                           maxWidth: '900px',
                           marginTop: '10px'
                       }}>
                    <Card>
                        <MDBox pt={2} pb={3} px={3}>
                            <div>
                                <MDTypography
                                    fontWeight="bold"
                                    variant="body2"
                                    fontSize="25px"
                                >
                                    배송지 추가
                                </MDTypography>
                            </div>

                            <MDBox component="form" role="form"  style={{
                                maxHeight: '700px', // Adjust the height as needed
                                overflowY: 'auto'  // Enable vertical scrolling
                            }}>
                                <MDBox mb={2}>
                                    <MDInput
                                        name="title"
                                        label="배송지 이름"
                                        onChange={handleChangeDelivery}
                                        fullWidth/>
                                </MDBox>
                                <MDBox mb={2}>
                                    <MDInput
                                        name="receiver"
                                        label="받는 사람"
                                        onChange={handleChangeDelivery}
                                        fullWidth/>
                                </MDBox>
                                <MDBox mb={2}>
                                    <MDInput
                                        name="phone"
                                        label="휴대전화번호"
                                        onChange={handleChangeDelivery}
                                        fullWidth/>
                                </MDBox>
                                <MDBox mb={2}>
                                    <MDInput
                                        name="postCode"
                                        label="우편번호"
                                        value={deliveries.postCode}
                                        onChange={handleChangeDelivery}
                                        fullWidth/>
                                </MDBox>
                                <MDBox mb={2}>
                                    <MDButton onClick={toggleHandler}
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
                                        value={deliveries.roadAddr}
                                        onChange={handleChangeDelivery}
                                        fullWidth/>
                                </MDBox>
                                <MDBox mb={2}>
                                    <MDInput
                                        name="jibunAddr"
                                        label="지번주소"
                                        value={deliveries.jibunAddr}
                                        onChange={handleChangeDelivery}
                                        fullWidth/>
                                </MDBox>
                                <MDBox mb={2}>
                                    <MDInput
                                        name="detailAddr"
                                        label="상세주소"
                                        onChange={handleChangeDelivery}
                                        fullWidth/>
                                </MDBox>
                                <MDBox mb={2}>
                                    <MDInput
                                        name="extraAddr"
                                        label="참고사항"
                                        onChange={handleChangeDelivery}
                                        fullWidth/>
                                </MDBox>

                                <MDBox mt={4} mb={1} style={{ display: 'flex', justifyContent: 'flex-end' }}>
                                    <MDButton onClick={handlePostDelivery}
                                              variant="gradient"
                                              style={{ marginRight: '10px' }}
                                              color="info"
                                              sx={{
                                                  fontFamily: 'JalnanGothic',
                                                  fontSize: '0.8rem',
                                                  padding: '4px 8px',
                                              }}
                                    >
                                        배송지 추가
                                    </MDButton>
                                    <MDButton onClick={() => {
                                        if (callbackFn) {
                                            callbackFn()
                                        }
                                    }}
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
    document.body // 포탈을 사용할 target 엘리먼트로 body 를 지정
    );
}

export default DeliveryPostModal;