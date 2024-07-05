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

import FetchingModal from "../../components/common/FetchingModal";
import ResultModal from "../../components/common/ResultModal";
import {putShop} from "../../api/shopApi";
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

// Helper function to get the key by value
const getCategoryKeyByValue = (value) => {
    return Object.keys(categories).find(key => categories[key] === value);
};

function ModifyShop() {
    const {state} = useLocation();
    const initShop = state || {}; // state 가 정의 되었는지 확인
    console.log(initShop);

    const uploadRef = useRef()
    const [fetching, setFetching] = useState(false)
    const [result, setResult] = useState(null)

    const [shop, setShop] = useState({...initShop,
        category: getCategoryKeyByValue(initShop.category) || '', // key 값 얻기
        imageFiles: initShop.imageFiles || [],
    });

    const [initialImages, setInitialImages] = useState(initShop.imageList || []); // 기존에 있던 이미지들
    const [filePreviews, setFilePreviews] = useState([]); // 새로 추가한 이미지들
    const [removedImages, setRemovedImages] = useState([]); // 제거된 이미지를 추적하기 위한 상태

    const navigate = useNavigate()

    const handleChangeShop = (e) => {
        const {name, value} = e.target;
        if (name === 'category') {
            setShop((prevShop) => ({ ...prevShop, category: value }));
        } else {
            setShop((prevShop) => ({ ...prevShop, [name]: value }));
        }
    }

    const handleFileChange = (e) => {
        const files = Array.from(e.target.files);
        setShop((prevShop) => ({...prevShop, imageFiles: files}));

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
        setShop((prevMarket) => {
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

        console.log('shopName : ' + shop.shopName);
        console.log('postCode : ' + shop.postCode);
        console.log('shopNo : ' + shop.shopNo);

        // 유효성 검사
        if (!shop.shopName || !shop.tel || !shop.sellerName || !shop.postCode
            || !shop.streetAddr || !shop.detailAddr || !shop.category) {
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
        formData.append('shopName', shop.shopName);
        formData.append('tel', shop.tel); //상점 전화번호
        formData.append('sellerName', shop.sellerName); //상점 사장님 이름
        formData.append('postCode', shop.postCode); //상점 우편번호
        formData.append('streetAddr', shop.streetAddr); //상점 도로명주소
        formData.append('detailAddr', shop.detailAddr); //상점 상세주소
        formData.append('category', categories[shop.category]); // 상점 카테고리 코드 value

        // 새로 추가된 이미지 추가
        for (let i = 0; i < shop.imageFiles.length; i++) {
            formData.append("imageFiles", shop.imageFiles[i]);
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

        putShop(shop.shopNo, formData).then(data => {
            setFetching(false) //데이터 가져온 후 화면에서 사라지도록
            console.log("result.shopName!!!!!!!!!!!!!"+data.shopName)
            setResult(data)
        }).catch(error => {
            setFetching(false);
            console.error("Error updating shop:", error);
            setResult({ success: false, message: "상점 수정에 실패했습니다." });
        });
    };

    const closeModal = () => { //ResultModal 종료
        setResult(null)
        navigate('/market')
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
                    content={`${result.shopName} 수정 완료`}
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
                                    defaultValue={shop.shopName}
                                    onChange={handleChangeShop}
                                    fullWidth/>
                            </MDBox>
                            <MDBox mb={2}>
                                <MDInput
                                    name="tel"
                                    label="상점 전화번호"
                                    defaultValue={shop.tel}
                                    onChange={handleChangeShop}
                                    fullWidth/>
                            </MDBox>
                            <MDBox mb={2}>
                                <MDInput
                                    name="sellerName"
                                    label="상점 사장님 이름"
                                    defaultValue={shop.sellerName}
                                    onChange={handleChangeShop}
                                    fullWidth/>
                            </MDBox>
                            <MDBox mb={2}>
                                <MDInput
                                    name="postCode"
                                    label="상점 우편번호"
                                    defaultValue={shop.postCode}
                                    multiline
                                    onChange={handleChangeShop}
                                    fullWidth
                                />
                            </MDBox>
                            <MDBox mb={2}>
                                <MDInput
                                    name="streetAddr"
                                    label="상점 도로명주소"
                                    defaultValue={shop.streetAddr}
                                    multiline
                                    onChange={handleChangeShop}
                                    fullWidth
                                />
                            </MDBox>
                            <MDBox mb={2}>
                                <MDInput
                                    name="detailAddr"
                                    label="상점 상세주소"
                                    defaultValue={shop.detailAddr}
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

export default ModifyShop;
