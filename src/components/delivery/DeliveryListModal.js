import * as React from "react";
import {useEffect, useState} from "react";
import useCustomLogin from "../../hooks/useCustomLogin";
import DashboardLayout from "../../examples/LayoutContainers/DashboardLayout";

import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";

import MDBox from "../MD/MDBox";
import MDTypography from "../MD/MDTypography";
import MDButton from "../MD/MDButton";
import {getDeliveryList, putDeliveryPrimary} from "../../api/deliveryApi";
import DeliveryPostModal from "../delivery/DeliveryPostModal";

const DeliveryListModal = ({ callbackFn }) => {

    const {isLogin} = useCustomLogin()
    const [deliveries, setDeliveries] = useState([]);
    const [result, setResult] = useState(null)
    const [selectedDeliveryNo, setSelectedDeliveryNo] = useState(null); // State to track selected delivery address

    const handleGetDeliveries = () => {
        console.log('handleGetDeliveries');
        getDeliveryList().then(data => {
            setDeliveries(data);
        }).catch(error => {
            console.error("배송지 목록 조회에 실패했습니다.", error);
        });
    };

    const handleDeliveryPostModal = () => { // 주문 페이지 내 배송지 추가 버튼
        console.log('handleDeliveryModal');
        setResult(true); // Show the DeliveryPostModal
    };

    const postDeliveryModal = () => { // DeliveryModal 종료 -> 모달창 내 배송지 추가 버튼
        setResult(false)
        handleGetDeliveries(); // 모달 창 닫히고 조회
    }

    const handlePrimaryDelivery = (deliveryNo) => { // 기본 배송지 설정 버튼
        console.log('handlePrimaryDelivery');
        putDeliveryPrimary(deliveryNo).then(data => {
            console.log('기본 배송지로 수정!!');
            console.log(data);
            setSelectedDeliveryNo(deliveryNo); // Set the selected delivery address
        }).catch(error => {
            console.error("기본 배송지 수정에 실패했습니다.", error);
        });
    };

    const closeModal = () => {
        if(callbackFn) {
            callbackFn()
        }
    }

    const buttonStyle = {
        backgroundColor: '#50bcdf',
        color: '#ffffff',
        fontSize: '2rem',
        fontFamily: 'JalnanGothic',
        padding: '20px 40px',
        width: '660px',
    };

    useEffect(() => {
        handleGetDeliveries();
    }, []);

    return (
        <DashboardLayout>
            {result ?
                <DeliveryPostModal
                    callbackFn={postDeliveryModal}
                />
                : <></>
            }

            {isLogin ? (
                <>
                    <div
                        className={`fixed top-0 left-0 z-[1050] flex h-full w-full  justify-center bg-gray-600 bg-opacity-75`}
                    >
                        <MDBox pt={6} pb={3}
                               style={{
                                   width: '80%',
                                   maxWidth: '600px',
                                   marginTop: '50px'
                               }}>
                            <Card>
                                <MDButton
                                    onClick={closeModal}
                                    variant="text"
                                    style={{
                                        position: 'absolute',
                                        top: '10px',
                                        right: '10px',
                                        fontSize: '1.5rem',
                                        color: '#000',
                                        backgroundColor: 'transparent',
                                        border: 'none',
                                        cursor: 'pointer'
                                    }}
                                >
                                    &times;
                                </MDButton>
                                <MDBox pt={4} pb={3} px={3}>
                                    <div>
                                        <MDTypography
                                            fontWeight="bold"
                                            variant="body2"
                                            fontSize="25px"
                                            textAlign="center"
                                        >
                                            배송지 목록
                                        </MDTypography>
                                    </div>
                                    <div>
                                        <MDButton
                                            onClick={handleDeliveryPostModal}
                                            variant="gradient"
                                            color={"light"}>
                                            + 배송지 추가
                                        </MDButton>
                                    </div>
                                    <Grid container spacing={4}>
                                        <Grid item xs={12}>
                                            <MDBox pb={3}>

                                                <div>
                                                    <ul>
                                                        {Array.isArray(
                                                                deliveries)
                                                            && deliveries.map(
                                                                delivery =>
                                                                    <li key={delivery.deliveryNo}
                                                                        style={{marginBottom: '16px'}}>
                                                                        <MDBox
                                                                            pt={2}
                                                                            px={2}>
                                                                            <Grid
                                                                                container
                                                                                spacing={2}>
                                                                                <Grid
                                                                                    item
                                                                                    xs={9}
                                                                                    sx={{mt: 1}}>
                                                                                    <MDTypography
                                                                                        fontWeight="bold"
                                                                                        sx={{fontSize: '1.5rem'}}
                                                                                        variant="body2">
                                                                                        {delivery.title}
                                                                                        {selectedDeliveryNo
                                                                                            === delivery.deliveryNo
                                                                                            && (
                                                                                                <span
                                                                                                    style={{
                                                                                                        fontSize: '1rem',
                                                                                                        color: "hotpink"
                                                                                                    }}>
                                                                                        기본 배송지
                                                                                    </span>
                                                                                            )}
                                                                                    </MDTypography>

                                                                                </Grid>
                                                                                <Grid
                                                                                    item
                                                                                    xs={3}
                                                                                    sx={{mt: 1}}>
                                                                                    <MDButton
                                                                                        onClick={() => handlePrimaryDelivery(
                                                                                            delivery.deliveryNo)}
                                                                                        variant="gradient"
                                                                                        color={"light"}>
                                                                                        선택
                                                                                    </MDButton>
                                                                                </Grid>
                                                                            </Grid>
                                                                            <Grid
                                                                                container>
                                                                                <Grid
                                                                                    item
                                                                                    xs={5}
                                                                                    sx={{mt: 1}}>
                                                                                    <MDTypography
                                                                                        fontWeight="bold"
                                                                                        variant="body2">
                                                                                        {delivery.phone}
                                                                                    </MDTypography>
                                                                                </Grid>
                                                                            </Grid>
                                                                            <Grid
                                                                                container>
                                                                                <Grid
                                                                                    item
                                                                                    xs={5.5}
                                                                                    sx={{mt: 1}}>
                                                                                    <MDTypography
                                                                                        fontWeight="bold"
                                                                                        variant="body2">
                                                                                        {delivery.roadAddr}
                                                                                    </MDTypography>
                                                                                </Grid>
                                                                                <Grid
                                                                                    item
                                                                                    xs={2.5}
                                                                                    sx={{mt: 1}}>
                                                                                    <MDTypography
                                                                                        fontWeight="bold"
                                                                                        variant="body2">
                                                                                        {delivery.detailAddr}
                                                                                    </MDTypography>
                                                                                </Grid>
                                                                                <Grid
                                                                                    item
                                                                                    xs={2}
                                                                                    sx={{mt: 1}}>
                                                                                    <MDTypography
                                                                                        fontWeight="bold"
                                                                                        variant="body2">
                                                                                        ({delivery.postCode})
                                                                                    </MDTypography>
                                                                                </Grid>
                                                                            </Grid>
                                                                        </MDBox>
                                                                    </li>
                                                            )}
                                                    </ul>
                                                </div>

                                            </MDBox>
                                        </Grid>
                                    </Grid>
                                </MDBox>
                            </Card>
                        </MDBox>
                    </div>
                </>
            ) : null}

        </DashboardLayout>
    );
}

export default DeliveryListModal;