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

// 좌표 찾기 서비스, 수정 후 해당 시장 상세 페이지로 이동 추가한 코드
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

import {putMarket, getOne} from "../../api/marketApi";
import {FormControl, InputLabel, Select, useMediaQuery} from "@mui/material";
import MenuItem from "@mui/material/MenuItem";

const categories = {
    서울: '서울',
    인천: '인천',
    경기도: '경기도',
    강원: '강원',
    충청도: '충청도',
    경상도: '경상도',
    전라도: '전라도',
    제주도: '제주도',
};

const getCategoryKeyByValue = (value) => {
    return Object.keys(categories).find(key => categories[key] === value);
};

// 수정 후 해당 시장 상세 페이지로 가기 위해 해당 시장의 정보 조회
const fetchMarket = async (marketNo) => {

  try {
      // getOne 함수를 사용하여 API 호출
      const data = await getOne(marketNo);
      console.log("fetchMarket data: ", data);
      return data;

  } catch (error) {
      console.error("시장 정보 불러오기 오류:", error);
  }
};

function ModifyMarket() {
    const {state} = useLocation();
    const initMarket = state || {}; // state 가 정의 되었는지 확인
    console.log(initMarket);

    const uploadRef = useRef();

    const [market, setMarket] = useState({
        ...initMarket,
        category: getCategoryKeyByValue(initMarket.category) || '', // key 값 얻기
        imageFiles: initMarket.imageFiles || [],
    });

    const [initialImages, setInitialImages] = useState(initMarket.imageList || []); // 기존에 있던 이미지들
    const [filePreviews, setFilePreviews] = useState([]); // 새로 추가한 이미지들
    const [removedImages, setRemovedImages] = useState([]); // 제거된 이미지를 추적하기 위한 상태
    const navigate = useNavigate();
    const isSmallScreen = useMediaQuery('(max-width:600px)');

    const handleChangeMarket = (e) => {
        const { name, value } = e.target;
        setMarket((prevMarket) => ({ ...prevMarket, [name]: value }));
    };

    const handleFileChange = (e) => {
        const files = Array.from(e.target.files);
        setMarket((prevMarket) => ({ ...prevMarket, imageFiles: files }));

        const previews = files.map(file => URL.createObjectURL(file));
        setFilePreviews(previews);
    };

    const handleRemoveInitialImage = (index) => {
        setRemovedImages((prevRemovedImages) => [...prevRemovedImages, initialImages[index].imageUrl]);

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
            return { ...prevMarket, imageFiles: updatedFiles };
        });

        setFilePreviews((prevPreviews) => {
            const updatedPreviews = [...prevPreviews];
            URL.revokeObjectURL(updatedPreviews[index]);
            updatedPreviews.splice(index, 1);
            return updatedPreviews;
        });
    };

    const handleModifyMarket = async (event) => {
        console.log('marketName : ' + market.marketName);
        console.log('marketAddr : ' + market.marketAddr);
        console.log('no : ' + market.marketNo);

        if (!window.confirm('시장을 수정하시겠습니까?')) {
            return;
        }

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
        formData.append('parkingInfo1', market.parkingInfo1);
        formData.append('parkingInfo2', market.parkingInfo2);
        formData.append('busInfo', market.busInfo);
        formData.append('busLat', market.busLat);
        formData.append('busLng', market.busLng);
        formData.append('subwayInfo', market.subwayInfo);
        formData.append('subwayLat', market.subwayLat);
        formData.append('subwayLng', market.subwayLng);

        // 새로 추가된 이미지 추가
        for (let i = 0; i < market.imageFiles.length; i++) {
            formData.append("imageFiles", market.imageFiles[i]);
        }

        // 기존 이미지 중 삭제되지 않은(남은) 이미지만 추가
        if (initialImages != null) {
            const remainingInitialImages = initialImages.filter(img => !removedImages.includes(img.imageUrl));
            remainingInitialImages.forEach(img => {
                formData.append('imageUrls', img.imageUrl);
            });
            console.log("Remaining initial images:", remainingInitialImages);
        }

        console.log(formData);

        try {
            const data = await putMarket(formData);
            const marketData = await fetchMarket(data.marketNo);
            navigate(`/market-detail`, { state: marketData });

        } catch (error) {
            console.error("시장 수정 오류: ", error);
        }
    };

    const handleOpenMapPopup = () => {
        const width = 600;
        const height = 500;
        const left = (window.innerWidth - width) / 2;
        const top = (window.innerHeight - height) / 2;
        window.open('/coordinate-popup', 'coordinatePopup', `width=${width},height=${height},left=${left},top=${top}`);
    };

    useEffect(() => {
        const handleMessage = (event) => {
            if (event.origin === window.location.origin) {
                const { type, coords } = event.data;
                if (type === 'UPDATE_BUS_COORDS') {
                    setMarket(prevMarket => ({
                        ...prevMarket,
                        busLat: coords.lat,
                        busLng: coords.lng
                    }));
                } else if (type === 'UPDATE_SUBWAY_COORDS') {
                    setMarket(prevMarket => ({
                        ...prevMarket,
                        subwayLat: coords.lat,
                        subwayLng: coords.lng
                    }));
                }
            }
        };

        window.addEventListener('message', handleMessage);

        return () => {
            window.removeEventListener('message', handleMessage);
        };
    }, []);

    useEffect(() => {
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
                        <MDBox mb={2}>
                            <MDInput
                                fullWidth
                                label="시장 이름"
                                name="marketName"
                                value={market.marketName || ''}
                                onChange={handleChangeMarket}
                            />
                        </MDBox>
                        <MDBox mb={2}>
                            <MDInput
                                fullWidth
                                label="시장 주소"
                                name="marketAddr"
                                value={market.marketAddr || ''}
                                onChange={handleChangeMarket}
                            />
                        </MDBox>
                        <MDBox mb={2}>
                            <FormControl fullWidth>
                                <InputLabel>카테고리</InputLabel>
                                <Select
                                    name="category"
                                    value={market.category || ''}
                                    onChange={handleChangeMarket}
                                    sx={{minHeight: 45}}
                                    fullWidth
                                >
                                    {Object.keys(categories).map(categoryKey => (
                                        <MenuItem key={categoryKey} value={categoryKey}>
                                            {categories[categoryKey]}
                                        </MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                        </MDBox>
                        <MDBox mb={2}>
                            <MDInput
                                fullWidth
                                multiline
                                rows={2}
                                label="상세 정보"
                                name="marketDetail"
                                value={market.marketDetail || ''}
                                onChange={handleChangeMarket}
                            />
                        </MDBox>
                        <MDBox mb={2}>
                            <MDInput
                                fullWidth
                                label="주차 정보 1"
                                name="parkingInfo1"
                                value={market.parkingInfo1 || ''}
                                onChange={handleChangeMarket}
                            />
                        </MDBox>
                        <MDBox mb={2}>
                            <MDInput
                                fullWidth
                                label="주차 정보 2"
                                name="parkingInfo2"
                                value={market.parkingInfo2 || ''}
                                onChange={handleChangeMarket}
                            />
                        </MDBox>
                        <MDBox mb={2}>
                            <MDInput
                                fullWidth
                                label="버스 정보"
                                name="busInfo"
                                value={market.busInfo || ''}
                                onChange={handleChangeMarket}
                            />
                        </MDBox>
                        <MDBox mb={2}>
                            <MDInput
                                fullWidth
                                label="버스 위도"
                                name="busLat"
                                value={market.busLat || ''}
                                onChange={handleChangeMarket}
                            />
                        </MDBox>
                        <MDBox mb={2}>
                            <MDInput
                                fullWidth
                                label="버스 경도"
                                name="busLng"
                                value={market.busLng || ''}
                                onChange={handleChangeMarket}
                            />
                        </MDBox>
                        <MDBox mb={2}>
                            <MDInput
                                fullWidth
                                label="지하철 정보"
                                name="subwayInfo"
                                value={market.subwayInfo || ''}
                                onChange={handleChangeMarket}
                            />
                        </MDBox>
                        <MDBox mb={2}>
                            <MDInput
                                fullWidth
                                label="지하철 위도"
                                name="subwayLat"
                                value={market.subwayLat || ''}
                                onChange={handleChangeMarket}
                            />
                        </MDBox>
                        <MDBox mb={2}>
                            <MDInput
                                fullWidth
                                label="지하철 경도"
                                name="subwayLng"
                                value={market.subwayLng || ''}
                                onChange={handleChangeMarket}
                            />
                        </MDBox>
                        <MDBox mb={2}>
                            <input
                                type="file"
                                ref={uploadRef}
                                onChange={handleFileChange}
                                multiple
                                style={{ display: 'none' }}
                            />
                            <MDButton
                                sx={{
                                    fontFamily: 'JalnanGothic',
                                    fontSize: isSmallScreen ? '0.6rem':'0.8rem',
                                    minWidth: 'auto',
                                    width: isSmallScreen ? '80px' : '120px',
                                    padding: isSmallScreen
                                        ? '1px 2px'
                                        : '2px 4px',
                                    lineHeight:  isSmallScreen ? 2.3:2.2,  // 줄 간격을 줄여 높이를 감소시킴
                                    minHeight: 'auto', // 기본적으로 적용되는 높이를 없앰
                                    mr : isSmallScreen ? '10px' : '20px'
                                }}
                                variant="outlined" color="primary" onClick={() => uploadRef.current.click()}>
                                이미지 업로드
                            </MDButton>
                            <MDButton
                                sx={{
                                    fontFamily: 'JalnanGothic',
                                    fontSize: isSmallScreen ? '0.6rem':'0.8rem',
                                    minWidth: 'auto',
                                    width: isSmallScreen ? '70px' : '100px',
                                    padding: isSmallScreen
                                        ? '1px 2px'
                                        : '2px 4px',
                                    lineHeight:  isSmallScreen ? 2.3:2.2,  // 줄 간격을 줄여 높이를 감소시킴
                                    minHeight: 'auto', // 기본적으로 적용되는 높이를 없앰
                                    mr : isSmallScreen ? '10px' : '10px'
                                }}
                                variant="outlined" color="primary" onClick={handleOpenMapPopup}>
                                좌표 찾기
                            </MDButton>
                        </MDBox>
                        <MDBox mb={2} sx={{ display: 'flex', flexWrap: 'wrap' }}>
                                {filePreviews.map((preview, index) => (
                                    <div key={index} style={{ position: 'relative' , marginRight: '10px', marginBottom: '10px' }}>
                                        <img src={preview} alt={`preview ${index}`}
                                             style={{
                                                 maxWidth: isSmallScreen ? '100px':'150px',
                                                 maxHeight: isSmallScreen ? '100px':'150px',
                                             }}
                                        />
                                        <IconButton
                                            size="small"
                                            color="secondary"
                                            onClick={() => handleRemovePreviewFile(index)}
                                            style={{
                                                position: 'absolute',
                                                top: 0,
                                                right: 0,
                                                backgroundColor: 'rgba(255, 255, 255, 0.7)',
                                                zIndex: 1, // z-index 추가
                                                padding: '2px', // 버튼 크기 조정
                                            }}
                                        >
                                            <CloseIcon/>
                                        </IconButton>
                                    </div>
                                ))}
                                {initialImages.map((img, index) => (
                                    <div key={index}  style={{ position: 'relative', marginRight: '10px', marginBottom: '10px'  }}>
                                        <img src={img.imageUrl} alt={`initial ${index}`}
                                             style={{
                                            maxWidth: isSmallScreen ? '100px':'150px',
                                            maxHeight: isSmallScreen ? '100px':'150px',
                                            }}
                                        />
                                        <IconButton
                                            size="small"
                                            color="secondary"
                                            onClick={() => handleRemoveInitialImage(index)}
                                            style={{
                                                position: 'absolute',
                                                top: 0,
                                                right: 0,
                                                backgroundColor: 'rgba(255, 255, 255, 0.7)',
                                                zIndex: 1, // z-index 추가
                                                padding: '2px', // 버튼 크기 조정
                                            }}
                                        >
                                            <CloseIcon/>
                                        </IconButton>
                                    </div>
                                ))}
                        </MDBox>
                        <MDBox style={{ display: 'flex', justifyContent: 'flex-end' }}>
                            <MDButton variant="gradient"
                                      color="info"
                                      onClick={handleModifyMarket}
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
                </Card>
            </MDBox>
        </DashboardLayout>
    );
}

export default ModifyMarket;
