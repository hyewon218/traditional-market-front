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

// 이미지 미리보기, 생성 후 해당 상품 상세 페이지로 이동 추가
import * as React from 'react';
import {useRef, useState} from 'react';
import {postItem, getItemOne} from "../../../api/itemApi";

// @mui material components
import Card from '@mui/material/Card';

// Material Dashboard 2 React components
import MDBox from '../../../components/MD/MDBox';
import MDInput from '../../../components/MD/MDInput';
import MDButton from '../../../components/MD/MDButton';

// Material Dashboard 2 React example components
import DashboardLayout from '../../../examples/LayoutContainers/DashboardLayout';
import {useLocation, useNavigate} from "react-router-dom";
import {FormControl, InputLabel, Select} from "@mui/material";
import MenuItem from "@mui/material/MenuItem";

const categories = {
    판매중: 'SELL',
    판매완료: 'SOLD_OUT'
};

const itemCategories = {
    과일: '과일',
    채소: '채소',
    육류: '육류',
    생선: '생선'
};

const initState = {
    shopNo: 0,
    itemName: '',
    price: 0,
    itemDetail: '',
    stockNumber: 0,
    itemSellStatus: '판매중',
    itemCategory: '과일',
    imageFiles: []
}

// 생성 후 해당 상품 상세 페이지로 가기 위해 해당 상품의 정보 조회
const fetchItem = async (itemNo) => {

    try {
        // getItemOne 함수를 사용하여 API 호출
        const data = await getItemOne(itemNo);
        console.log("fetchItem data: ", data);
        return data;

    } catch (error) {
        console.error("상품 정보 불러오기 오류:", error);
    }
};

function PostItemSeller() {
    const {state} = useLocation();
    const shop = state; // 전달된 shop 데이터를 사용

    const uploadRef = useRef()
    const [previewImages, setPreviewImages] = useState([]);
    const [imageFiles, setImageFiles] = useState([]); // 실제 파일 상태 관리

    const navigate = useNavigate()

    const [item, setItem] = useState({...initState})

    const handleChangeItem = (e) => {
        const {name, value} = e.target;
        setItem((prevItem) => ({...prevItem, [name]: value}));
    }

    const handleFileChange = (event) => {
        const files = Array.from(event.target.files);
        const newPreviewImages = files.map(file => URL.createObjectURL(file));

        // 같은 파일을 다시 업로드할 수 있도록 파일 입력 값(파일 선택 필드의 값)을 리셋
        event.target.value = null;

        setImageFiles(prevFiles => [...prevFiles, ...files]);
        setPreviewImages(prevImages => [...prevImages, ...newPreviewImages]);
    };

    const handleRemoveImage = (index) => {
        setPreviewImages(prevImages => prevImages.filter((_, i) => i !== index));
        setImageFiles(prevFiles => prevFiles.filter((_, i) => i !== index));
    };

    const handleAddItem= async (event) => {
        event.preventDefault(); // 폼 전송 이벤트 방지

        if (!window.confirm('상품을 추가하시겠습니까?')) {
            return;
        }

        // 유효성 검사
        if (!item.itemName || !item.price || !item.itemDetail
            || !item.stockNumber || !item.itemSellStatus || !item.itemCategory
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
        formData.append('itemCategory', itemCategories[item.itemCategory]);
        formData.append('itemSellStatus', categories[item.itemSellStatus]);
        for (let i = 0; i < item.imageFiles.length; i++) {
            formData.append("imageFiles", item.imageFiles[i]);
        }

        console.log(formData)

        try {
            const data = await postItem(formData);
            console.log('data : ', data);
            const itemData = await fetchItem(data.itemNo);
            navigate(`/item-detail`, { state: itemData });

        } catch (error) {
            console.error("상품 추가 오류: ", error);
        }
    };

    return (
        <DashboardLayout>
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
                                        id="category-label">상품 카테고리</InputLabel>
                                    <Select
                                        labelId="category-label"
                                        name="itemCategory"
                                        value={item.itemCategory}
                                        onChange={handleChangeItem}
                                        sx={{minHeight: 56}}
                                    >
                                        {Object.keys(itemCategories).map(
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
                                <FormControl fullWidth>
                                    <InputLabel
                                        id="category-label">상품 판매
                                        상태</InputLabel>
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
                            {previewImages.length > 0 && (
                                <MDBox mb={2} sx={{ display: 'flex', flexWrap: 'wrap' }}>
                                    {previewImages.map((image, index) => (
                                        <MDBox key={index} sx={{ position: 'relative', marginRight: '10px', marginBottom: '10px' }}>
                                            <img
                                                src={image}
                                                alt={`preview-${index}`}
                                                style={{
                                                    maxWidth: '150px',
                                                    maxHeight: '150px',
                                                }}
                                            />
                                            <MDButton
                                                onClick={() => handleRemoveImage(index)}
                                                sx={{
                                                    position: 'absolute',
                                                    top: '5px',
                                                    right: '5px',
                                                    backgroundColor: 'rgba(255, 255, 255, 0.8)',
                                                    padding: '5px',
                                                }}
                                            >
                                                X
                                            </MDButton>
                                        </MDBox>
                                    ))}
                                </MDBox>
                            )}
                            <MDBox mt={4} mb={1} right>
                                <MDButton onClick={handleAddItem}
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

export default PostItemSeller;
