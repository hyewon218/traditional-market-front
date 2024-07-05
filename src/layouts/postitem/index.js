/**
 =========================================================
 * Material Dashboard 2 React - v2.1.0
 =========================================================

 * Product Page: https://www.creative-tim.com/product/material-dashboard-react
 * Copyright 2022 Creative Tim (https://www.creative-tim.com)

 Coded by www.creative-tim.com

 =========================================================

 * The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.
 */

import * as React from 'react';
import {useRef, useState} from 'react';
import {postItem} from "../../api/itemApi";

// @mui material components
import Card from '@mui/material/Card';

// Material Dashboard 2 React components
import MDBox from '../../components/MD/MDBox';
import MDInput from '../../components/MD/MDInput';
import MDButton from '../../components/MD/MDButton';

// Material Dashboard 2 React example components
import DashboardLayout from '../../examples/LayoutContainers/DashboardLayout';
import FetchingModal from "../../components/common/FetchingModal";
import ResultModal from "../../components/common/ResultModal";
import {useLocation, useNavigate} from "react-router-dom";
import {FormControl, InputLabel, Select} from "@mui/material";
import MenuItem from "@mui/material/MenuItem";

const categories = {
    판매중: 'SELL',
    판매완료: 'SOLD_OUT'
};

const initState = {
    shopNo: 0,
    itemName: '',
    price: 0,
    itemDetail: '',
    stockNumber: 0,
    itemSellStatus: '판매중',
    imageFiles: []
}

function PostItem() {
    const {state} = useLocation();
    const shop = state; // 전달된 shop 데이터를 사용

    const uploadRef = useRef()
    const [fetching, setFetching] = useState(false)
    const [result, setResult] = useState(null)

    const navigate = useNavigate()

    const [item, setItem] = useState({...initState})

    const handleChangeItem = (e) => {
        const {name, value} = e.target;
        setItem((prevItem) => ({...prevItem, [name]: value}));
    }

    const handleFileChange = (e) => {
        const files = e.target.files;
        setItem((prevItem) => ({...prevItem, imageFiles: files}));
    };

    const handleAddMarket = (event) => {
        event.preventDefault(); // 폼 전송 이벤트 방지

        // 유효성 검사
        if (!item.itemName || !item.price || !item.itemDetail || !item.stockNumber
            || !item.itemSellStatus || !item.imageFiles
        ) {
            alert('모든 필드를 입력하고 파일을 선택해주세요.');
            return;
        }

        // 파일 크기 제한
        const maxFileSize = 30 * 1024 * 1024; // 30MB 제한
        for (let i = 0; i < item.imageFiles.length; i++) {
            if (item.imageFiles[i].size > maxFileSize) {
                alert(`파일 크기는 30MB를 초과할 수 없습니다: ${item.imageFiles[i].name}`);
                return;
            }
        }

        // FormData 생성
        const formData = new FormData();
        formData.append('shopNo', shop.shopNo);
        formData.append('itemName', item.itemName);
        formData.append('price', item.price);
        formData.append('itemDetail', item.itemDetail);
        formData.append('stockNumber', item.stockNumber);
        formData.append('itemSellStatus', categories[item.itemSellStatus]);
        for (let i = 0; i < item.imageFiles.length; i++) {
            formData.append("imageFiles", item.imageFiles[i]);
        }

        console.log(formData)

        setFetching(true)

        postItem(formData).then(data => {
            setFetching(false) //데이터 가져온 후 화면에서 사라지도록
            console.log(data)
            setResult(data)
        })
    };
    const closeModal = () => { //ResultModal 종료
        setResult(null)
        navigate('/market') //모달 창이 닫히면 이동
        //moveToList({page: 1})
    }

    return (
        <DashboardLayout>
            {fetching ? <FetchingModal/> : <></>}

            {result ?
                <ResultModal
                    title={'Product Add Result'}
                    content={`${result.itemName} 등록 완료`}
                    callbackFn={closeModal}
                />
                : <></>
            }
            <MDBox pt={6} pb={3}>
                <Card>
                    <MDBox pt={4} pb={3} px={3}>
                        <MDBox component="form" role="form">
                            <MDBox mb={2}>
                                <MDInput
                                    name="itemName"
                                    label="상품 이름"
                                    onChange={handleChangeItem}
                                    fullWidth/>
                            </MDBox>
                            <MDBox mb={2}>
                                <MDInput
                                    name="price"
                                    label="상품 가격"
                                    onChange={handleChangeItem}
                                    fullWidth/>
                            </MDBox>
                            <MDBox mb={2}>
                                <MDInput
                                    name="itemDetail"
                                    label="상품 상세설명"
                                    multiline
                                    onChange={handleChangeItem}
                                    fullWidth
                                />
                            </MDBox>
                            <MDBox mb={2}>
                                <MDInput
                                    name="stockNumber"
                                    label="상품 재고 갯수"
                                    multiline
                                    onChange={handleChangeItem}
                                    fullWidth
                                />
                            </MDBox>
                            <MDBox mb={2}>
                                <FormControl fullWidth>
                                    <InputLabel
                                        id="category-label">상품 판매 상태</InputLabel>
                                    <Select
                                        labelId="category-label"
                                        name="itemSellStatus"
                                        value={item.itemSellStatus}
                                        onChange={handleChangeItem}
                                        sx={{minHeight: 56}}
                                    >
                                        {Object.keys(categories).map(
                                            (category) => (
                                                <MenuItem key={category}
                                                          value={category}>
                                                    {category}
                                                </MenuItem>
                                            ))}
                                    </Select>
                                </FormControl>
                            </MDBox>
                            <MDBox mb={2}>
                                <MDInput
                                    inputRef={uploadRef}
                                    onChange={handleFileChange}
                                    inputType={'file'}
                                    type={'file'} multiple={true}
                                    fullWidth/>
                            </MDBox>
                            <MDBox mt={4} mb={1} right>
                                <MDButton onClick={handleAddMarket}
                                          variant="gradient" color="info">
                                    저장
                                </MDButton>
                            </MDBox>
                        </MDBox>
                    </MDBox>
                </Card>
            </MDBox>
        </DashboardLayout>
    );
}

export default PostItem;
