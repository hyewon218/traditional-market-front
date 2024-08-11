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
import { useRef, useEffect, useState } from 'react';

// @mui material components
import Card from '@mui/material/Card';

// Material Dashboard 2 React components
import MDBox from '../../../components/MD/MDBox';
import MDInput from '../../../components/MD/MDInput';
import MDButton from '../../../components/MD/MDButton';

// Material Dashboard 2 React example components
import DashboardLayout from '../../../examples/LayoutContainers/DashboardLayout';
import { useNavigate } from "react-router-dom";
import { FormControl, InputLabel, Select, MenuItem } from "@mui/material";

// Data
import { getList } from "../../../api/marketApi";
import { getShopList } from "../../../api/shopApi";
import { postItem, getItemOne } from "../../../api/itemApi";

const categories = {
    판매중: 'SELL',
    판매완료: 'SOLD_OUT'
};

const itemCategories = {
    과일 : '과일',
    채소 : '채소',
    육류 : '육류',
    생선 : '생선'
};

const initState = {
    marketNo: 0,
    shopNo: 0,
    itemName: '',
    price: '',
    itemDetail: '',
    stockNumber: '',
    itemCategory: '과일',
    itemSellStatus: '판매중',
    imageFiles: []
}

const itemCache = {};

const fetchItem = async (itemNo) => {
  if (itemCache[itemNo]) {
    return itemCache[itemNo];
  }

  try {
    const data = await getItemOne(itemNo);
    console.log("fetchItem data: ", data);
    itemCache[itemNo] = data;
    return data;
  } catch (error) {
    console.error("상품 정보 불러오기 오류:", error);
    itemCache[itemNo] = { itemName : '정보 없음' };
    return { itemName: '정보 없음' };
  }
};

function PostItemAdmin() {
    const uploadRef = useRef();
    const [markets, setMarkets] = useState([]);
    const [shops, setShops] = useState([]);
    const [previewImages, setPreviewImages] = useState([]);
    const [imageFiles, setImageFiles] = useState([]); // 실제 파일 상태 관리
    const navigate = useNavigate();
    const [item, setItem] = useState({ ...initState });

    useEffect(() => {
        // 시장 목록 조회(드롭다운 채우기)
        const loadMarkets = async () => {
            try {
                const data = await getList({ page: 0, size: 100 });
                setMarkets(data.content);
            } catch (err) {
                console.error("시장 목록 불러오기 오류: ", err);
            }
        };

        loadMarkets();
    }, []);

    useEffect(() => {
        // 특정 시장에 해당하는 상점 목록 조회(드롭다운 채우기)
        const loadShopsByMarket = async () => {
//          if (selectedMarketNo === 'all') return; // 전체 보기일 때는 상점 목록을 로드하지 않음
          try {
            const pageParam = { page: 0, size: 100 };
            const data = await getShopList(item.marketNo, pageParam); // size는 드롭다운에 출력될 상점 개수
            console.log("특정 시장에 속한 상점 목록:", data);
            setShops(data.content);
          } catch (err) {
            console.error("상점 목록 불러오기 오류: ", err);
          }
        };

        // 시장이 선택된 경우에만 상점 목록 로드
        if (item.marketNo !== 0) {
          loadShopsByMarket();
        }

      }, [item.marketNo]);


    const handleChangeItem = (e) => {
        const { name, value } = e.target;
        console.log("e.target : ", e.target);
        setItem(prevItem => ({ ...prevItem, [name]: value }));

        // 시장이 변경되면 상점 목록 초기화
        if (name === 'marketNo') {
            setShops([]);
            setItem(prevItem => ({ ...prevItem, shopNo: 0 }));
        }
    };

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

    const handleAddItem = async (event) => {
        event.preventDefault();

        if (!window.confirm('상품을 추가하시겠습니까?')) {
          return;
        }

        if (!item.marketNo || !item.shopNo || !item.itemName || !item.price || !item.itemDetail || !item.stockNumber || !item.itemCategory) {
            alert('모든 필드를 입력하세요.');
            return;
        }

        const maxFileSize = 30 * 1024 * 1024;
        for (let i = 0; i < imageFiles.length; i++) {
            if (imageFiles[i].size > maxFileSize) {
                alert(`파일 크기는 30MB를 초과할 수 없습니다: ${imageFiles[i].name}`);
                return;
            }
        }

        const formData = new FormData();
        formData.append('shopNo', item.shopNo);
        formData.append('itemName', item.itemName);
        formData.append('price', item.price);
        formData.append('itemDetail', item.itemDetail);
        formData.append('stockNumber', item.stockNumber);
        formData.append('itemCategory', itemCategories[item.itemCategory]);
        formData.append('itemSellStatus', categories[item.itemSellStatus]);
        for (let i = 0; i < imageFiles.length; i++) {
            formData.append("imageFiles", imageFiles[i]);
        }

        try {
          const data = await postItem(formData);

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
                                <FormControl fullWidth>
                                    <InputLabel id="market-label">시장 선택</InputLabel>
                                    <Select
                                        labelId="market-label"
                                        name="marketNo"
                                        value={item.marketNo}
                                        onChange={handleChangeItem}
                                        sx={{ minHeight: 56 }}
                                    >
                                        {markets.map(market => (
                                            <MenuItem key={market.marketNo} value={market.marketNo}>
                                                {market.marketName}
                                            </MenuItem>
                                        ))}
                                    </Select>
                                </FormControl>
                            </MDBox>
                            <MDBox mb={2}>
                                <FormControl fullWidth>
                                    <InputLabel id="shop-label">상점 선택</InputLabel>
                                    <Select
                                        labelId="shop-label"
                                        name="shopNo"
                                        value={item.shopNo}
                                        onChange={handleChangeItem}
                                        sx={{ minHeight: 56 }}
                                    >
                                        {shops.map(shop => (
                                            <MenuItem key={shop.shopNo} value={shop.shopNo}>
                                                {shop.shopName}
                                            </MenuItem>
                                        ))}
                                    </Select>
                                </FormControl>
                            </MDBox>
                            <MDBox mb={2}>
                                <MDInput
                                    name="itemName"
                                    label="상품 이름"
                                    onChange={handleChangeItem}
                                    fullWidth
                                />
                            </MDBox>
                            <MDBox mb={2}>
                                <MDInput
                                    name="price"
                                    label="상품 가격"
                                    onChange={handleChangeItem}
                                    fullWidth
                                />
                            </MDBox>
                            <MDBox mb={2}>
                                <MDInput
                                    name="itemDetail"
                                    label="상품 상세설명"
                                    onChange={handleChangeItem}
                                    fullWidth
                                />
                            </MDBox>
                            <MDBox mb={2}>
                                <MDInput
                                    name="stockNumber"
                                    label="상품 재고 갯수"
                                    onChange={handleChangeItem}
                                    fullWidth
                                />
                            </MDBox>
                            <MDBox mb={2}>
                                <FormControl fullWidth>
                                    <InputLabel id="category-label">상품 카테고리</InputLabel>
                                    <Select
                                        labelId="category-label"
                                        name="itemCategory"
                                        value={item.itemCategory}
                                        onChange={handleChangeItem}
                                        sx={{ minHeight: 56 }}
                                    >
                                        {Object.keys(itemCategories).map(
                                            (itemCategory) => (
                                                <MenuItem key={itemCategory} value={itemCategory}>
                                                    {itemCategory}
                                                </MenuItem>
                                            )
                                        )}
                                    </Select>
                                </FormControl>
                            </MDBox>
                            <MDBox mb={2}>
                                <FormControl fullWidth>
                                    <InputLabel id="category-label">상품 판매</InputLabel>
                                    <Select
                                        labelId="category-label"
                                        name="itemSellStatus"
                                        value={item.itemSellStatus}
                                        onChange={handleChangeItem}
                                        sx={{ minHeight: 56 }}
                                    >
                                        {Object.keys(categories).map(
                                            (category) => (
                                                <MenuItem key={category} value={category}>
                                                    {category}
                                                </MenuItem>
                                            )
                                        )}
                                    </Select>
                                </FormControl>
                            </MDBox>
                            <MDBox mb={2}>
                                <MDInput
                                    inputRef={uploadRef}
                                    onChange={handleFileChange}
                                    inputType={'file'}
                                    type={'file'}
                                    multiple={true}
                                    fullWidth
                                />
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
                                <MDButton onClick={handleAddItem} variant="gradient" color="info">
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

export default PostItemAdmin;
