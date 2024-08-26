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

// 이미지 미리보기, 좌표 찾기 서비스, 생성 후 해당 상점 상세 페이지로 이동 추가
import * as React from 'react';
import {useRef, useState, useEffect} from 'react';
import {postShop, getShopOne} from "../../api/shopApi";

// @mui material components
import Card from '@mui/material/Card';

// Material Dashboard 2 React components
import MDBox from '../../components/MD/MDBox';
import MDInput from '../../components/MD/MDInput';
import MDButton from '../../components/MD/MDButton';

// Material Dashboard 2 React example components
import DashboardLayout from '../../examples/LayoutContainers/DashboardLayout';
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
    shopAddr: '',
    category: '농산물',
    imageFiles: []
}

// 생성 후 해당 상점 상세 페이지로 가기 위해 해당 상점의 정보 조회
const fetchShop = async (shopNo) => {

    try {
        // getShopOne 함수를 사용하여 API 호출
        const data = await getShopOne(shopNo);
        console.log("fetchShop data: ", data);
        return data;

    } catch (error) {
        console.error("상점 정보 불러오기 오류:", error);
    }
};

function PostShop() {
    const {state} = useLocation();
    const market = state; // 전달된 market 데이터를 사용

    const uploadRef = useRef()
    const [result, setResult] = useState(null)
    const [previewImages, setPreviewImages] = useState([]);
    const [imageFiles, setImageFiles] = useState([]); // 실제 파일 상태 관리

    const navigate = useNavigate()

    const [shop, setShop] = useState({...initState})

    // 지도에서 선택한 좌표를 버스 X/Y, 지하철 X/Y에 대입
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

    // 좌표 찾기 서비스 새창으로 열기
    const handleOpenMapPopup = () => {
        const width = 600;
        const height = 500;
        const left = (window.innerWidth - width) / 2;
        const top = (window.innerHeight - height) / 2;
        window.open('/coordinate-popup', 'coordinatePopup', `width=${width},height=${height},left=${left},top=${top}`);
    };

    const handleChangeShop = (e) => {
        const {name, value} = e.target;
        setShop((prevShop) => ({...prevShop, [name]: value}));
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

    const handleAddShop = async (event) => {
        event.preventDefault(); // 폼 전송 이벤트 방지

        if (!window.confirm('상점을 추가하시겠습니까?')) {
            return;
        }

        // 유효성 검사
        if (!shop.shopName || !shop.tel || !shop.sellerName || !shop.shopAddr || !shop.category
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

        if (shop.sellerNo) {
            formData.append('sellerNo', shop.sellerNo);
        }
        formData.append('marketNo', market.marketNo);
        formData.append('shopName', shop.shopName);
        formData.append('tel', shop.tel); //상점 전화번호
        formData.append('sellerName', shop.sellerName); //상점 사장님 이름
        formData.append('shopAddr', shop.shopAddr); //상점 주소
        formData.append('shopLat', shop.shopLat); // 상점 X(위도)
        formData.append('shopLng', shop.shopLng); // 상점 Y(경도)
        formData.append('category', categories[shop.category]); // 상점 카테고리 코드
        for (let i = 0; i < imageFiles.length; i++) {
            formData.append("imageFiles", imageFiles[i]);
        }

        console.log(formData)

        try {
            const data = await postShop(formData);
            const shopData = await fetchShop(data.shopNo);
            navigate(`/shop-detail`, { state: shopData });

        } catch (error) {
            console.error("상점 추가 오류: ", error);
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
                                    name="sellerNo"
                                    label="판매자 고유번호"
                                    onChange={handleChangeShop}
                                    placeholder="판매자 계정이 있을 경우 입력하세요"
                                    fullWidth/>
                            </MDBox>
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
                                    name="shopAddr"
                                    label="상점 주소"
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
                                <MDButton onClick={handleOpenMapPopup}>
                                    좌표 찾기
                                </MDButton>
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
