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

// 상점 추가 성공 후 해당 상점 detail로 이동
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
import FetchingModal from "../../../components/common/FetchingModal";
import { useNavigate } from "react-router-dom";
import { FormControl, InputLabel, Select, MenuItem } from "@mui/material";

// Data
import { getList } from "../../../api/marketApi";
import { postShop, getShopOne } from "../../../api/shopApi";

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
  shopAddr: '',
  category: '농산물',
  imageFiles: [],
  shopLat: '',
  shopLng: ''
};

const shopCache = {};

const fetchShop = async (shopNo) => {
  if (shopCache[shopNo]) {
    return shopCache[shopNo];
  }

  try {
    const data = await getShopOne(shopNo);
    console.log("fetchShop data: ", data);
    shopCache[shopNo] = data;
    return data;
  } catch (error) {
    console.error("상점 정보 불러오기 오류:", error);
    shopCache[shopNo] = { shopName: '정보 없음' };
    return { shopName: '정보 없음' };
  }
};

function PostShopAdmin() {
  const uploadRef = useRef();
  const [fetching, setFetching] = useState(false);
  const [markets, setMarkets] = useState([]);
  const [previewImages, setPreviewImages] = useState([]);
  const [imageFiles, setImageFiles] = useState([]);
  const navigate = useNavigate();
  const [shop, setShop] = useState({ ...initState });

  useEffect(() => {
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
    const handleMessage = (event) => {
      if (event.origin === window.location.origin) {
        const { type, coords } = event.data;
        if (type === 'UPDATE_SHOP_COORDS') {
          setShop(prevShop => ({
            ...prevShop,
            shopLat: coords.lat,
            shopLng: coords.lng
          }));
        }
      }
    };

    window.addEventListener('message', handleMessage);

    return () => {
      window.removeEventListener('message', handleMessage);
    };
  }, []);

  const handleOpenMapPopup = () => {
    const width = 600;
    const height = 500;
    const left = (window.innerWidth - width) / 2;
    const top = (window.innerHeight - height) / 2;
    window.open('/coordinate-popup', 'coordinatePopup', `width=${width},height=${height},left=${left},top=${top}`);
  };

  const handleChangeShop = (e) => {
    const { name, value } = e.target;
    setShop(prevShop => ({ ...prevShop, [name]: value }));
  };

  const handleFileChange = (event) => {
    const files = Array.from(event.target.files);
    const newPreviewImages = files.map(file => URL.createObjectURL(file));

    event.target.value = null;

    setImageFiles(prevFiles => [...prevFiles, ...files]);
    setPreviewImages(prevImages => [...prevImages, ...newPreviewImages]);
  };

  const handleRemoveImage = (index) => {
    setPreviewImages(prevImages => prevImages.filter((_, i) => i !== index));
    setImageFiles(prevFiles => prevFiles.filter((_, i) => i !== index));
  };

  const handleAddShop = async (event) => {
    event.preventDefault();

    if (!window.confirm('상점을 추가하시겠습니까?')) {
      return;
    }

    if (!shop.shopName || !shop.tel || !shop.sellerName || !shop.shopAddr || !shop.category) {
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
    formData.append('marketNo', shop.marketNo);
    formData.append('shopName', shop.shopName);
    formData.append('tel', shop.tel);
    formData.append('sellerName', shop.sellerName);
    formData.append('shopAddr', shop.shopAddr);
    formData.append('shopLat', shop.shopLat);
    formData.append('shopLng', shop.shopLng);
    formData.append('category', categories[shop.category]);
    for (let i = 0; i < imageFiles.length; i++) {
      formData.append("imageFiles", imageFiles[i]);
    }

    setFetching(true);

    try {
      const data = await postShop(formData);
      setFetching(false);

      const shopData = await fetchShop(data.shopNo);
      navigate(`/shop-detail`, { state: shopData });

    } catch (error) {
      setFetching(false);
      console.error("상점 추가 오류: ", error);
    }
  };

  return (
    <DashboardLayout>
      {fetching && <FetchingModal />}
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
                    value={shop.marketNo}
                    onChange={handleChangeShop}
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
                <MDInput
                  name="shopName"
                  label="상점 이름"
                  onChange={handleChangeShop}
                  fullWidth
                />
              </MDBox>
              <MDBox mb={2}>
                <MDInput
                  name="tel"
                  label="상점 전화번호"
                  onChange={handleChangeShop}
                  fullWidth
                />
              </MDBox>
              <MDBox mb={2}>
                <MDInput
                  name="sellerName"
                  label="상점 사장님 이름"
                  onChange={handleChangeShop}
                  fullWidth
                />
              </MDBox>
              <MDBox mb={2}>
                <MDInput
                  name="shopAddr"
                  label="상점 주소"
                  multiline
                  onChange={handleChangeShop}
                  fullWidth
                />
              </MDBox>
              <MDBox mb={2}>
                <MDInput
                  fullWidth
                  label="상점 X(위도, lat)"
                  name="shopLat"
                  value={shop.shopLat}
                  onChange={handleChangeShop}
                />
              </MDBox>
              <MDBox mb={2}>
                <MDInput
                  fullWidth
                  label="상점 Y(경도, lng)"
                  name="shopLng"
                  value={shop.shopLng}
                  onChange={handleChangeShop}
                />
              </MDBox>
              <MDBox mb={2}>
                <FormControl fullWidth>
                  <InputLabel id="category-label">카테고리</InputLabel>
                  <Select
                    labelId="category-label"
                    name="category"
                    value={shop.category}
                    onChange={handleChangeShop}
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
                <MDButton onClick={handleOpenMapPopup}>
                  좌표 찾기
                </MDButton>
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
                <MDButton onClick={handleAddShop} variant="gradient" color="info">
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

export default PostShopAdmin;

