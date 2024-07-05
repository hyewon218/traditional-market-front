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
import {postShop} from "../../api/shopApi";

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
    농산물: 'AGRI',
    수산물: 'MARINE',
    축산물: 'LIVESTOCK',
    과일: 'FRUITS',
    가공식품: 'PROCESSED',
    쌀: 'RICE',
    음식점: 'RESTAURANT',
    반찬: 'SIDEDISH',
    잡화: 'STUFF',
    기타: 'ETC'
};

const initState = {
    marketNo: 0,
    shopName: '',
    tel: '',
    sellerName: '',
    postCode: '',
    streetAddr: '',
    detailAddr: '',
    category: '농산물',
    imageFiles: []
}

function PostShop() {
    const {state} = useLocation();
    const market = state; // 전달된 market 데이터를 사용

    const uploadRef = useRef()
    const [fetching, setFetching] = useState(false)
    const [result, setResult] = useState(null)

    const navigate = useNavigate()

    const [shop, setShop] = useState({...initState})

    const handleChangeShop = (e) => {
        const {name, value} = e.target;
        setShop((prevShop) => ({...prevShop, [name]: value}));
    }

    const handleFileChange = (e) => {
        const files = e.target.files;
        setShop((prevShop) => ({...prevShop, imageFiles: files}));
    };

    const handleAddShop = (event) => {
        event.preventDefault(); // 폼 전송 이벤트 방지

        // 유효성 검사
        if (!shop.shopName || !shop.tel || !shop.sellerName || !shop.postCode
            || !shop.streetAddr || !shop.detailAddr || !shop.category
        ) {
            alert('모든 필드를 입력하고 파일을 선택해주세요.');
            return;
        }

        // 파일 크기 제한
        const maxFileSize = 30 * 1024 * 1024; // 30MB 제한
        for (let i = 0; i < shop.imageFiles.length; i++) {
            if (shop.imageFiles[i].size > maxFileSize) {
                alert(`파일 크기는 30MB를 초과할 수 없습니다: ${shop.imageFiles[i].name}`);
                return;
            }
        }

        // FormData 생성
        const formData = new FormData();
        formData.append('marketNo', market.marketNo);
        formData.append('shopName', shop.shopName);
        formData.append('tel', shop.tel); //상점 전화번호
        formData.append('sellerName', shop.sellerName); //상점 사장님 이름
        formData.append('postCode', shop.postCode); //상점 우편번호
        formData.append('streetAddr', shop.streetAddr); //상점 도로명주소
        formData.append('detailAddr', shop.detailAddr); //상점 상세주소
        formData.append('category', categories[shop.category]); // 상점 카테고리 코드
        for (let i = 0; i < shop.imageFiles.length; i++) {
            formData.append("imageFiles", shop.imageFiles[i]);
        }

        console.log(formData)

        setFetching(true)

        postShop(formData).then(data => {
            setFetching(false) //데이터 가져온 후 화면에서 사라지도록
            console.log(data)
            setResult(data)
        })
    };
    const closeModal = () => { //ResultModal 종료
        setResult(null)
        navigate('/market-detail') //모달 창이 닫히면 이동
        //moveToList({page: 1})
    }

    return (
        <DashboardLayout>
            {fetching ? <FetchingModal/> : <></>}

            {result ?
                <ResultModal
                    title={'Product Add Result'}
                    content={`${result.shopName} 등록 완료`}
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
                                    name="shopName"
                                    label="상점 이름"
                                    onChange={handleChangeShop}
                                    fullWidth/>
                            </MDBox>
                            <MDBox mb={2}>
                                <MDInput
                                    name="tel"
                                    label="상점 전화번호"
                                    onChange={handleChangeShop}
                                    fullWidth/>
                            </MDBox>
                            <MDBox mb={2}>
                                <MDInput
                                    name="sellerName"
                                    label="상점 사장님 이름"
                                    onChange={handleChangeShop}
                                    fullWidth/>
                            </MDBox>
                            <MDBox mb={2}>
                                <MDInput
                                    name="postCode"
                                    label="상점 우편번호"
                                    multiline
                                    onChange={handleChangeShop}
                                    fullWidth
                                />
                            </MDBox>
                            <MDBox mb={2}>
                                <MDInput
                                    name="streetAddr"
                                    label="상점 도로명주소"
                                    multiline
                                    onChange={handleChangeShop}
                                    fullWidth
                                />
                            </MDBox>
                            <MDBox mb={2}>
                                <MDInput
                                    name="detailAddr"
                                    label="상점 상세주소"
                                    multiline
                                    onChange={handleChangeShop}
                                    fullWidth
                                />
                            </MDBox>
                            <MDBox mb={2}>
                                <FormControl fullWidth>
                                    <InputLabel
                                        id="category-label">카테고리</InputLabel>
                                    <Select
                                        labelId="category-label"
                                        name="category"
                                        value={shop.category}
                                        onChange={handleChangeShop}
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
                                <MDButton onClick={handleAddShop}
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

export default PostShop;
