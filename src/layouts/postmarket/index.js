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
import {postMarket} from "../../api/marketApi";

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
import {useNavigate} from "react-router-dom";
import {FormControl, InputLabel, Select} from "@mui/material";
import MenuItem from "@mui/material/MenuItem";

const categories = {
    서울: '서울',
    인천: '인천',
    경기도: '경기도',
    강원도: '강원도',
    충청도: '충청도',
    경상도: '경상도',
    전라도: '전라도',
    제주도: '제주도',
};

const initState = {
    marketName: '',
    marketAddr: '',
    marketDetail: '',
    imageFiles: []
}

function PostMarket() {
    const uploadRef = useRef()
    const [fetching, setFetching] = useState(false)
    const [result, setResult] = useState(null)

    const navigate = useNavigate()

    const [market, setMarket] = useState({...initState})

    const handleChangeMarket = (e) => {
        const {name, value} = e.target;
        setMarket((prevMarket) => ({...prevMarket, [name]: value}));
    }

    const handleFileChange = (e) => {
        const files = e.target.files;
        setMarket((prevMarket) => ({...prevMarket, imageFiles: files}));
    };

    const handleAddMarket = (event) => {
        event.preventDefault(); // 폼 전송 이벤트 방지

        // 유효성 검사
        if (!market.marketName || !market.marketAddr || !market.category
            ) {
            alert('모든 필드를 입력하고 파일을 선택해주세요.');
            return;
        }

        // 파일 크기 제한
        const maxFileSize = 30 * 1024 * 1024; // 30MB 제한
        for (let i = 0; i < market.imageFiles.length; i++) {
            if (market.imageFiles[i].size > maxFileSize) {
                alert(`파일 크기는 30MB를 초과할 수 없습니다: ${market.imageFiles[i].name}`);
                return;
            }
        }

        // FormData 생성
        const formData = new FormData();
        formData.append('marketName', market.marketName);
        formData.append('marketAddr', market.marketAddr);
        formData.append('category', categories[market.category]); // 상점 카테고리 코드
        formData.append('marketDetail', market.marketDetail);
        for (let i = 0; i < market.imageFiles.length; i++) {
            formData.append("imageFiles", market.imageFiles[i]);
        }

        console.log(formData)

        setFetching(true)

        postMarket(formData).then(data => {
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
                    content={`${result.marketName} 등록 완료`}
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
                                    name="marketName"
                                    label="시장 이름"
                                    onChange={handleChangeMarket}
                                    fullWidth/>
                            </MDBox>
                            <MDBox mb={2}>
                                <MDInput
                                    name="marketAddr"
                                    label="시장 주소"
                                    onChange={handleChangeMarket}
                                    fullWidth/>
                            </MDBox>
                            <MDBox mb={2}>
                                <FormControl fullWidth>
                                    <InputLabel
                                        id="category-label">카테고리</InputLabel>
                                    <Select
                                        labelId="category-label"
                                        name="category"
                                        value={market.category}
                                        onChange={handleChangeMarket}
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
                                    name="marketDetail"
                                    label="시장 상세설명"
                                    multiline
                                    rows={10}
                                    onChange={handleChangeMarket}
                                    fullWidth
                                />
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

export default PostMarket;
