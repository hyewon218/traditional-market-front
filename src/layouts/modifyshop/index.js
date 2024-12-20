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
import useCustomLogin from "../../hooks/useCustomLogin";

// Material Dashboard 2 React example components
import DashboardLayout from '../../examples/LayoutContainers/DashboardLayout';

import {putShop, getShopOne} from "../../api/shopApi";
import {getOne} from "../../api/marketApi";
import {FormControl, InputLabel, Select, useMediaQuery} from "@mui/material";
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

// 수정 후 해당 상점 상세 페이지로 가기 위해 해당 상점의 정보 조회
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

function ModifyShop() {
    const {state} = useLocation();
    const initShop = state || {}; // state 가 정의 되었는지 확인
    const {isAdmin} = useCustomLogin();
    console.log(initShop);

    const uploadRef = useRef()

    const [shop, setShop] = useState({...initShop,
        category: getCategoryKeyByValue(initShop.category) || '', // key 값 얻기
        imageFiles: initShop.imageFiles || [],
    });

    const [initialImages, setInitialImages] = useState(initShop.imageList || []); // 기존에 있던 이미지들
    const [filePreviews, setFilePreviews] = useState([]); // 새로 추가한 이미지들
    const [removedImages, setRemovedImages] = useState([]); // 제거된 이미지를 추적하기 위한 상태
    const [market, setMarket] = useState(''); // 소속 시장 매핑하기 위한 상태
    const navigate = useNavigate()
    const isSmallScreen = useMediaQuery('(max-width:600px)');

    useEffect(() => {
        // 소속 시장 데이터를 불러오기
        const loadMarket = async () => {
            try {
                if (shop.marketNo) {
                    const marketData = await getOne(shop.marketNo);
                    setMarket(marketData);
                }

            } catch (error) {
                console.error("시장 데이터 불러오기 오류:", error);
            }
        };

        loadMarket();
    }, []);

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

    // 좌표 찾기 서비스 새 창으로 열기
    const handleOpenMapPopup = () => {
        const width = 600;
        const height = 500;
        const left = (window.innerWidth - width) / 2;
        const top = (window.innerHeight - height) / 2;
        window.open('/coordinate-popup', 'coordinatePopup', `width=${width},height=${height},left=${left},top=${top}`);
    };

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

    const handleModifyShop = async () => {
        console.log('shopName : ' + shop.shopName);
        console.log('shopAddr : ' + shop.shopAddr);
        console.log('shopNo : ' + shop.shopNo);
        console.log('sellerNo : ' + shop.sellerNo);

        if (!window.confirm('상점을 수정하시겠습니까?')) {
            return;
        }

        // 유효성 검사
        if (!shop.shopName || !shop.tel || !shop.sellerName || !shop.shopAddr || !shop.category) {
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
        formData.append('shopName', shop.shopName);
        formData.append('tel', shop.tel); //상점 전화번호
        formData.append('sellerName', shop.sellerName); //상점 사장님 이름
        formData.append('shopAddr', shop.shopAddr); //상점 주소
        formData.append('shopLat', shop.shopLat);
        formData.append('shopLng', shop.shopLng);
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

        try {
            const data = await putShop(shop.shopNo, formData);
            const shopData = await fetchShop(data.shopNo);
            navigate(`/shop-detail`, { state: shopData });
        } catch (error) {
            console.error("상점 수정 오류: ", error);
        }
    };

    useEffect(() => {
        console.log('shop : ', shop)
        // Clean up previews on component unmount
        return () => {
            filePreviews.forEach(preview => URL.revokeObjectURL(preview));
        };
    }, [filePreviews]);

    return (
        <DashboardLayout>
            <MDBox pt={isSmallScreen ? 0 : 1}
                   pb={20}
                   px={isSmallScreen ? 1 : 3}
                   mt={isSmallScreen ? -3 : 0}
                   width="100%"
                   display="flex"
                   justifyContent="center">
                <Card sx={{
                    maxWidth: isSmallScreen ? '90%' : '40%',
                    width: '100%',
                    margin: '0 auto',
                }}>
                    <MDBox pt={3} pb={3} px={3} lineHeight={1.5}>
                        <MDBox component="form" role="form">
                            <MDBox mb={2}>
                                <MDInput
                                    name="marketName"
                                    label="소속 시장"
                                    value={market.marketName || ''}
                                    disabled={true}
                                    fullWidth/>
                            </MDBox>
                            <MDBox mb={2}>
                                <MDInput
                                    name="sellerNo"
                                    label="판매자 고유번호"
                                    defaultValue={shop.sellerNo}
                                    onChange={handleChangeShop}
                                    fullWidth/>
                            </MDBox>
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
                                    name="shopAddr"
                                    label="상점 주소"
                                    defaultValue={shop.shopAddr}
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
                                        sx={{ minHeight: 45 }}
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
                                <MDButton
                                    sx={{
                                        fontFamily: 'JalnanGothic',
                                        fontSize: isSmallScreen ? '0.6rem':'0.8rem',
                                        minWidth: 'auto',
                                        width: isSmallScreen ? '70px' : '90px',
                                        padding: isSmallScreen
                                            ? '1px 2px'
                                            : '2px 4px',
                                        lineHeight:  isSmallScreen ? 2.3:2.2,  // 줄 간격을 줄여 높이를 감소시킴
                                        minHeight: 'auto', // 기본적으로 적용되는 높이를 없앰
                                        mr : isSmallScreen ? '10px' : '10px'
                                    }}
                                    variant="outlined" color="primary"
                                    onClick={handleOpenMapPopup}>
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
                            <MDBox mb={2} display="flex" flexWrap="wrap">
                                {initialImages.map((img, index) => (
                                    <MDBox key={index} position="relative"
                                           mr={2} mb={2}>
                                        <img key={index} src={`${img.imageUrl}`}
                                             alt={`preview-${index}`}
                                             style={{
                                                 maxWidth: isSmallScreen ? '100px':'150px',
                                                 maxHeight: isSmallScreen ? '100px':'150px',
                                                 marginRight: '10px'
                                             }}
                                        />
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
                                {filePreviews.map((preview, index) => (
                                    <MDBox key={index} position="relative" mr={2} mb={2}>
                                        <img src={preview}
                                             alt={`preview-${index}`}
                                             style={{
                                                 maxWidth: isSmallScreen ? '100px':'150px',
                                                 maxHeight: isSmallScreen ? '100px':'150px',
                                                 marginRight: '10px'
                                             }}/>
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
                            <MDBox style={{ display: 'flex', justifyContent: 'flex-end' }}>
                                <MDButton onClick={handleModifyShop}
                                          variant="gradient"
                                          color="info"
                                          sx={{
                                              fontFamily: 'JalnanGothic',
                                              fontSize: isSmallScreen ? '0.7rem':'0.9rem',
                                              minWidth: 'auto',
                                              width: isSmallScreen ? '50px' : '70px',
                                              padding: isSmallScreen
                                                  ? '1px 2px'
                                                  : '2px 4px',
                                              lineHeight:  isSmallScreen ? 2.3:2.2,  // 줄 간격을 줄여 높이를 감소시킴
                                              minHeight: 'auto', // 기본적으로 적용되는 높이를 없앰
                                              mr : isSmallScreen ? '10px' : '10px'
                                          }}
                                >
                                    수정
                                </MDButton>
                                <MDButton onClick={() => {
                                    window.history.back();  // 이전 페이지로 돌아감
                                }}
                                          variant="gradient"
                                          color="info"
                                          sx={{
                                              fontFamily: 'JalnanGothic',
                                              fontSize: isSmallScreen ? '0.7rem':'0.9rem',
                                              minWidth: 'auto',
                                              width: isSmallScreen ? '50px' : '70px',
                                              padding: isSmallScreen
                                                  ? '1px 2px'
                                                  : '2px 4px',
                                              lineHeight:  isSmallScreen ? 2.3:2.2,  // 줄 간격을 줄여 높이를 감소시킴
                                              minHeight: 'auto' // 기본적으로 적용되는 높이를 없앰
                                          }}
                                >
                                    취소
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
