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
import {useEffect, useRef, useState} from 'react';
import {useLocation, useNavigate} from 'react-router-dom';

// @mui material components
import Card from '@mui/material/Card';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';

// Material Dashboard 2 React components
import MDBox from '../../components/MD/MDBox';
import MDInput from '../../components/MD/MDInput';
import MDButton from '../../components/MD/MDButton';

// Material Dashboard 2 React example components
import DashboardLayout from '../../examples/LayoutContainers/DashboardLayout';

import {putMarket} from "../../api/marketApi";
import FetchingModal from "../../components/common/FetchingModal";
import ResultModal from "../../components/common/ResultModal";
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

const getCategoryKeyByValue = (value) => {
    return Object.keys(categories).find(key => categories[key] === value);
};

function ModifyMarket() {
    const {state} = useLocation();
    const initMarket = state || {}; // state 가 정의 되었는지 확인
    console.log(initMarket);

    const uploadRef = useRef()
    const [fetching, setFetching] = useState(false)
    const [result, setResult] = useState(null)

    const [market, setMarket] = useState({...initMarket,
        category: getCategoryKeyByValue(initMarket.category) || '', // key 값 얻기
        imageFiles: initMarket.imageFiles || [],
    });

    const [initialImages, setInitialImages] = useState(initMarket.imageList || []); // 기존에 있던 이미지들
    const [filePreviews, setFilePreviews] = useState([]); // 새로 추가한 이미지들
    const [removedImages, setRemovedImages] = useState([]); // 제거된 이미지를 추적하기 위한 상태

    const navigate = useNavigate()

    const handleChangeMarket = (e) => {
        const {name, value} = e.target;
        setMarket((prevMarket) => ({...prevMarket, [name]: value}));
    }

    const handleFileChange = (e) => {
        const files = Array.from(e.target.files);
        setMarket((prevMarket) => ({...prevMarket, imageFiles: files}));

        const previews = files.map(file => URL.createObjectURL(file));
        setFilePreviews(previews);
    };

    const handleRemoveInitialImage = (index) => {
        setRemovedImages((prevRemovedImages) => [...prevRemovedImages,
            initialImages[index].imageUrl]);

        // 선택된(x버튼) 이미지를 제거하기 위해 initialImages 상태 업데이트
        setInitialImages((prevImages) => {
            const updatedImages = [...prevImages];
            updatedImages.splice(index, 1); // Remove the image at index
            console.log("Initial images after removal:", updatedImages);
            return updatedImages;
        });
    };

    const handleRemovePreviewFile = (index) => {
        setMarket((prevMarket) => {
            const updatedFiles = [...prevMarket.imageFiles];
            updatedFiles.splice(index, 1);
            return {...prevMarket, imageFiles: updatedFiles};
        });

        setFilePreviews((prevPreviews) => {
            const updatedPreviews = [...prevPreviews];
            URL.revokeObjectURL(updatedPreviews[index]);
            updatedPreviews.splice(index, 1);
            return updatedPreviews;
        });
    };

    const handleModifyMarket = () => {

        console.log('marketName : ' + market.marketName);
        console.log('marketAddr : ' + market.marketAddr);
        console.log('no : ' + market.marketNo);

        // 유효성 검사
        if (!market.marketName || !market.marketAddr || !market.category) {
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
        formData.append('marketNo', market.marketNo);
        formData.append('marketName', market.marketName);
        formData.append('marketAddr', market.marketAddr);
        formData.append('category', categories[market.category]); // 상점 카테고리 코드
        formData.append('marketDetail', market.marketDetail);

        // 새로 추가된 이미지 추가
        for (let i = 0; i < market.imageFiles.length; i++) {
            formData.append("imageFiles", market.imageFiles[i]);
        }

        // 기존 이미지 중 삭제되지 않은(남은) 이미지만 추가
        if (initialImages != null) {
            const remainingInitialImages = initialImages.filter(
                img => !removedImages.includes(img.imageUrl));
            remainingInitialImages.forEach(img => {
                formData.append('imageUrls', img.imageUrl);
            });
            console.log("Remaining initial images:", remainingInitialImages);
        }

        console.log(formData)

        setFetching(true)

        putMarket(formData).then(data => {
            setFetching(false) //데이터 가져온 후 화면에서 사라지도록
            console.log("result.marketName!!!!!!!!!!!!!"+data.marketName)
            setResult(data)
        }).catch(error => {
            setFetching(false);
            console.error("Error updating market:", error);
            setResult({ success: false, message: "시장 수정에 실패했습니다." });
        });
    };

    const closeModal = () => { //ResultModal 종료
        setResult(null)
        navigate('/market')
        //moveToList({page: 1}) //모달 창이 닫히면 이동
    }

    useEffect(() => {
        // Clean up previews on component unmount
        return () => {
            filePreviews.forEach(preview => URL.revokeObjectURL(preview));
        };
    }, [filePreviews]);

    return (
        <DashboardLayout>
            {fetching ? <FetchingModal/> : <></>}

            {result ?
                <ResultModal
                    title={'시장 수정 결과'}
                    content={`${result.marketName} 수정 완료`}
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
                                    defaultValue={initMarket.marketName}
                                    onChange={handleChangeMarket}
                                    fullWidth
                                />
                            </MDBox>
                            <MDBox mb={2}>
                                <MDInput
                                    name="marketAddr"
                                    label="시장 주소"
                                    defaultValue={initMarket.marketAddr}
                                    multiline
                                    onChange={handleChangeMarket}
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
                                        value={market.category}
                                        onChange={handleChangeMarket}
                                        sx={{ minHeight: 56 }}
                                    >
                                        {Object.keys(categories).map((category) => (
                                            <MenuItem key={category} value={category}>
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
                                    defaultValue={initMarket.marketDetail}
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
                            <MDBox mb={2} display="flex" flexWrap="wrap">
                                {initialImages.map((img, index) => (
                                    <MDBox key={index} position="relative"
                                           mr={2} mb={2}>
                                        <img key={index} src={`${img.imageUrl}`}
                                             alt={`preview-${index}`}
                                             width="300px"
                                             style={{marginRight: '10px'}}/>
                                        <IconButton
                                            size="small"
                                            color="secondary"
                                            onClick={() => handleRemoveInitialImage(
                                                index)}
                                            style={{
                                                position: 'absolute',
                                                top: 0,
                                                right: 0,
                                                backgroundColor: 'rgba(255, 255, 255, 0.7)'
                                            }}
                                        >
                                            <CloseIcon/>
                                        </IconButton>
                                    </MDBox>
                                ))}
                            </MDBox>
                            <MDBox mb={2} display="flex" flexWrap="wrap">
                                {filePreviews.map((preview, index) => (
                                    <MDBox key={index} position="relative"
                                           mr={2} mb={2}>
                                        <img src={preview}
                                             alt={`preview-${index}`}
                                             width="400px"/>
                                        <IconButton
                                            size="small"
                                            color="secondary"
                                            onClick={() => handleRemovePreviewFile(
                                                index)}
                                            style={{
                                                position: 'absolute',
                                                top: 0,
                                                right: 0,
                                                backgroundColor: 'rgba(255, 255, 255, 0.7)'
                                            }}
                                        >
                                            <CloseIcon/>
                                        </IconButton>
                                    </MDBox>
                                ))}
                            </MDBox>
                            <MDBox mt={4} mb={1} right>
                                <MDButton onClick={handleModifyMarket}
                                          variant="gradient" color="info">
                                    수정하기
                                </MDButton>
                            </MDBox>
                        </MDBox>
                    </MDBox>
                </Card>
            </MDBox>
        </DashboardLayout>
    );
}

export default ModifyMarket;
