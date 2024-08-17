import * as React from "react";
import {useEffect, useState} from "react";
import DashboardLayout from "../../examples/LayoutContainers/DashboardLayout";

import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";

import MDBox from "../MD/MDBox";
import MDTypography from "../MD/MDTypography";
import MDButton from "../MD/MDButton";
import {
    deleteDelivery,
    getDeliveryList,
    getPrimaryDelivery,
    putDeliveryPrimary
} from "../../api/deliveryApi";
import DeliveryPostModal from "../delivery/DeliveryPostModal";
import DeliveryPutModal from "./DeliveryPutModal";
import MDPagination from "../MD/MDPagination";
import KeyboardArrowLeftIcon from "@mui/icons-material/KeyboardArrowLeft";
import KeyboardArrowRightIcon from "@mui/icons-material/KeyboardArrowRight";

const DeliveryListModal = ({callbackFn}) => {

    const [deliveries, setDeliveries] = useState([]);
    const [result, setResult] = useState(null) // 배송지 추가 모달창 관련
    const [putResult, setPutResult] = useState(null) // 배송지 수정 모달창 관련
    const [primaryDeliveryNo, setPrimaryDeliveryNo] = useState(null);

    const [page, setPage] = useState(0);
    const [totalPage, setTotalPage] = useState(0);

    const handleGetDeliveries = (pageNum) => {
        console.log('handleGetDeliveries');
        const pageParam = {page: pageNum, size: 3};
        getDeliveryList(pageParam).then(data => {
            setDeliveries(data.content);
            //console.log(data.content)
            setTotalPage(data.totalPages);
        }).catch(error => {
            console.error("배송지 목록 조회에 실패했습니다.", error);
        });
    };

    /*배송지 추가*/
    const handleDeliveryPostModal = () => { // 배송지 목록 모달 내 배송지 추가 버튼
        console.log('handleDeliveryModal');
        setResult(true); // Show the DeliveryPostModal
    };

    const postDeliveryModal = () => { // DeliveryPostModal 종료
        setResult(false)
        handleGetDeliveries(); // 모달 창 닫히고 조회
    }

    /*배송지 선택*/
    const handleSelectDelivery = (selectedDelivery) => { // 배송지 선택 버튼
        console.log('handleSelectDelivery');
        // Set the selected delivery address
        if (callbackFn) {
            callbackFn(selectedDelivery);
        }
    };

    /*배송지 수정*/
    const handleDeliveryPutModal = (delivery) => { // 배송지 목록 모달 내 배송지 수정 버튼
        console.log('handleDeliveryPutModal');
        //setPutResult(true); // Show the DeliveryPutModal
        setPutResult(delivery); // Pass the selected delivery info to the modal
    };

    const putDeliveryModal = () => { // DeliveryPutModal 종료
        setPutResult(false)
        handleGetDeliveries(); // 모달 창 닫히고 조회
    }

    /*배송지 삭제*/
    const handleDeleteDelivery = (deliveryNo) => { // 배송지 삭제
        console.log('handleDeleteDelivery');
        const userConfirmed = window.confirm("배송지를 삭제하시겠습니까?");
        if (userConfirmed) {
            deleteDelivery(deliveryNo).then(data => {
                console.log('배송지 삭제!!');
                console.log(data);
                handleGetDeliveries();
            }).catch(error => {
                console.error("배송지 삭제에 실패했습니다.", error);
            });
        } else {
            console.log('Deletion canceled by user.');
        }
    };

    /*기본 배송지 선택*/
    const handlePrimaryDelivery = (deliveryNo) => { // 기본 배송지 선택 버튼
        console.log('handleSelectDelivery');
        putDeliveryPrimary(deliveryNo).then(data => {
            console.log('기본 배송지로 수정!!');
            console.log(data);
            setPrimaryDeliveryNo(deliveryNo); // Set the selected delivery address
            handleGetPrimaryDelivery();
        }).catch(error => {
            console.error("기본 배송지 수정에 실패했습니다.", error);
        });
    };

    const handleGetPrimaryDelivery = () => { // 기본 배송지 조회
        console.log('handleGetPrimaryDelivery');
        getPrimaryDelivery().then(data => {
            setPrimaryDeliveryNo(data.deliveryNo);
        }).catch(error => {
            console.error("기본 배송지 조회에 실패했습니다.", error);
        });
    };

    const closeModal = () => {
        if (callbackFn) {
            callbackFn()
        }
    }

    const changePage = (pageNum) => {
        console.log('change pages');
        console.log(pageNum);
        console.log(page);
        setPage(pageNum);
        handleGetDeliveries(pageNum);
    };

    useEffect(() => {
        handleGetDeliveries();
        handleGetPrimaryDelivery();
    }, []);

    return (
        <DashboardLayout>
            {result ?
                <DeliveryPostModal
                    callbackFn={postDeliveryModal}
                />
                : <></>
            }
            {putResult ?
                <DeliveryPutModal
                    delivery={putResult}
                    callbackFn={putDeliveryModal}
                />
                : <></>
            }

            <div
                className={`fixed top-0 left-0 z-[1050] flex h-full w-full  justify-center bg-gray-600 bg-opacity-75`}
            >
                <MDBox pt={3} pb={3}
                       style={{
                           width: '80%',
                           maxWidth: '600px',
                           marginTop: '25px'
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
                            <div style={{
                                display: 'flex',
                                justifyContent: 'center'
                            }}>
                                <MDButton
                                    onClick={handleDeliveryPostModal}
                                    variant="gradient"
                                    sx={{
                                        backgroundColor: '#50bcdf',
                                        color: '#ffffff',
                                        fontSize: '2rem',
                                        fontFamily: 'JalnanGothic',
                                        padding: '20px',
                                        width: '100%',
                                        maxWidth: '500px',
                                    }}
                                    color={"light"}>
                                    + 배송지 추가
                                </MDButton>
                            </div>
                            <Grid container spacing={4}>
                                <Grid item xs={12}>
                                    <MDBox
                                        pb={1}
                                        style={{
                                            maxHeight: '400px', // Adjust the height as needed
                                            overflowY: 'auto'  // Enable vertical scrolling
                                        }}
                                    >

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
                                                                                {delivery.receiver
                                                                                    + ' '
                                                                                    + '('
                                                                                    + delivery.title
                                                                                    + ')'}
                                                                                {primaryDeliveryNo
                                                                                    === delivery.deliveryNo
                                                                                    && (
                                                                                        <span
                                                                                            style={{
                                                                                                fontSize: '1rem',
                                                                                                color: "deeppink"
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
                                                                                onClick={() => handleSelectDelivery(
                                                                                    delivery)}
                                                                                variant="gradient"
                                                                                color="success">
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
                                                                            xs={12}
                                                                            sx={{mt: 1}}>
                                                                            <MDTypography
                                                                                fontWeight="bold"
                                                                                variant="body2">
                                                                                {delivery.roadAddr
                                                                                    + ' '
                                                                                    + delivery.detailAddr
                                                                                    + ' '
                                                                                    + '('
                                                                                    + delivery.postCode
                                                                                    + ')'}
                                                                            </MDTypography>
                                                                        </Grid>
                                                                    </Grid>
                                                                    <Grid
                                                                        container
                                                                    >
                                                                        <Grid
                                                                            item
                                                                            xs={2}
                                                                            sx={{mt: 1}}>
                                                                            <MDButton
                                                                                onClick={() => handleDeliveryPutModal(
                                                                                    delivery)}
                                                                                variant="gradient"
                                                                                color="light">
                                                                                수정
                                                                            </MDButton>
                                                                        </Grid>
                                                                        <Grid
                                                                            item
                                                                            xs={2}
                                                                            sx={{mt: 1}}>
                                                                            <MDButton
                                                                                onClick={() => handleDeleteDelivery(
                                                                                    delivery.deliveryNo)}
                                                                                variant="gradient"
                                                                                color="light">
                                                                                삭제
                                                                            </MDButton>
                                                                        </Grid>
                                                                        <Grid
                                                                            item
                                                                            xs={4}
                                                                            sx={{mt: 1}}>
                                                                            <MDButton
                                                                                onClick={() => handlePrimaryDelivery(
                                                                                    delivery.deliveryNo)}
                                                                                variant="gradient"
                                                                                color="warning">
                                                                                기본배송지
                                                                                설정
                                                                            </MDButton>
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
                        <MDBox
                            style={{
                                flex: "0 0 auto",
                                display: "flex",
                                justifyContent: "center",
                                alignItems: "center",
                                marginTop: "0rem",
                                marginBottom: "1.5rem"
                            }}
                        >
                            <MDPagination>
                                <MDPagination item>
                                    <KeyboardArrowLeftIcon></KeyboardArrowLeftIcon>
                                </MDPagination>
                                {[...Array(totalPage).keys()].map((i) => (
                                    <MDPagination
                                        item
                                        key={i}
                                        onClick={() => changePage(i)}
                                    >
                                        {i + 1}
                                    </MDPagination>
                                ))}
                                <MDPagination item>
                                    <KeyboardArrowRightIcon></KeyboardArrowRightIcon>
                                </MDPagination>
                            </MDPagination>
                        </MDBox>
                    </Card>
                </MDBox>
            </div>
        </DashboardLayout>
    );
}

export default DeliveryListModal;