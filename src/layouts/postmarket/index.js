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

// 좌표 찾기 서비스, 업로드 이미지 미리보기, 생성 후 해당 시장 상세 페이지로 이동 추가한 코드
import * as React from 'react';
import {useRef, useState, useEffect} from 'react';
import {postMarket, getOne} from "../../api/marketApi";

// @mui material components
import Card from '@mui/material/Card';

// Material Dashboard 2 React components
import MDBox from '../../components/MD/MDBox';
import MDInput from '../../components/MD/MDInput';
import MDButton from '../../components/MD/MDButton';

// Material Dashboard 2 React example components
import DashboardLayout from '../../examples/LayoutContainers/DashboardLayout';
import {useNavigate} from "react-router-dom";
import {FormControl, InputLabel, Select} from "@mui/material";
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

const initState = {
    marketName: '',
    marketAddr: '',
    marketDetail: '',
    parkingInfo1: '',
    parkingInfo2: '',
    busInfo: '',
    busLat: '',
    busLng: '',
    subwayInfo: '',
    subwayLat: '',
    subwayLng: '',
    imageFiles: []
}

// 생성 후 해당 시장 상세 페이지로 가기 위해 해당 시장의 정보 조회
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

function PostMarket() {
    const uploadRef = useRef();
    const [fetching, setFetching] = useState(false);
    const [result, setResult] = useState(null);
    const navigate = useNavigate();
    const [market, setMarket] = useState({ ...initState });
    const [previewImages, setPreviewImages] = useState([]); // 업로드 이미지 미리보기
    const [imageFiles, setImageFiles] = useState([]); // 실제 파일 상태 관리

    // 지도에서 선택한 좌표를 버스 X/Y, 지하철 X/Y에 대입
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

    // 좌표 찾기 서비스 새창으로 열기
    const handleOpenMapPopup = () => {
        const width = 600;
        const height = 500;
        const left = (window.innerWidth - width) / 2;
        const top = (window.innerHeight - height) / 2;
        window.open('/coordinate-popup', 'coordinatePopup', `width=${width},height=${height},left=${left},top=${top}`);
    };

    const handleChangeMarket = (event) => {
        const { name, value } = event.target;
        setMarket(prevMarket => ({ ...prevMarket, [name]: value }));
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

    const handleAddMarket = async (event) => {
        event.preventDefault(); // 폼 전송 이벤트 방지

        if (!window.confirm('시장을 추가하시겠습니까?')) {
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
        for (let i = 0; i < imageFiles.length; i++) {
            formData.append("imageFiles", imageFiles[i]);
        }

        console.log(formData)

        try {
          const data = await postMarket(formData);
          const marketData = await fetchMarket(data.marketNo);
          navigate(`/market-detail`, { state: marketData });

        } catch (error) {
          console.error("시장 추가 오류: ", error);
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
                                    fullWidth
                                    label="시장 이름"
                                    name="marketName"
                                    value={market.marketName}
                                    onChange={handleChangeMarket}
                                />
                            </MDBox>
                            <MDBox mb={2}>
                                <MDInput
                                    fullWidth
                                    label="시장 주소"
                                    name="marketAddr"
                                    value={market.marketAddr}
                                    onChange={handleChangeMarket}
                                />
                            </MDBox>
                            <MDBox mb={2}>
                                <FormControl fullWidth>
                                    <InputLabel id="category-label">카테고리</InputLabel>
                                    <Select
                                        labelId="category-label"
                                        name="category"
                                        value={market.category}
                                        onChange={handleChangeMarket}
                                        sx={{ minHeight: 56 }}
                                    >
                                        {Object.keys(categories).map(category => (
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
                                    multiline
                                    rows={4}
                                    label="시장 상세설명"
                                    name="marketDetail"
                                    value={market.marketDetail}
                                    onChange={handleChangeMarket}
                                />
                            </MDBox>
                            <MDBox mb={2}>
                                <MDInput
                                    fullWidth
                                    label="주차정보1"
                                    name="parkingInfo1"
                                    value={market.parkingInfo1}
                                    onChange={handleChangeMarket}
                                />
                            </MDBox>
                            <MDBox mb={2}>
                                <MDInput
                                    fullWidth
                                    label="주차정보2"
                                    name="parkingInfo2"
                                    value={market.parkingInfo2}
                                    onChange={handleChangeMarket}
                                />
                            </MDBox>
                            <MDBox mb={2}>
                                <MDInput
                                    fullWidth
                                    label="버스정보"
                                    name="busInfo"
                                    value={market.busInfo}
                                    onChange={handleChangeMarket}
                                />
                            </MDBox>
                            <MDBox mb={2}>
                                <MDInput
                                    fullWidth
                                    label="버스 X(위도, lat)"
                                    name="busLat"
                                    value={market.busLat}
                                    onChange={handleChangeMarket}
                                />
                            </MDBox>
                            <MDBox mb={2}>
                                <MDInput
                                    fullWidth
                                    label="버스 Y(경도, lng)"
                                    name="busLng"
                                    value={market.busLng}
                                    onChange={handleChangeMarket}
                                />
                            </MDBox>
                            <MDBox mb={2}>
                                <MDInput
                                    fullWidth
                                    label="지하철정보"
                                    name="subwayInfo"
                                    value={market.subwayInfo}
                                    onChange={handleChangeMarket}
                                />
                            </MDBox>
                            <MDBox mb={2}>
                                <MDInput
                                    fullWidth
                                    label="지하철 X(위도, lat)"
                                    name="subwayLat"
                                    value={market.subwayLat}
                                    onChange={handleChangeMarket}
                                />
                            </MDBox>
                            <MDBox mb={2}>
                                <MDInput
                                    fullWidth
                                    label="지하철 Y(경도, lng)"
                                    name="subwayLng"
                                    value={market.subwayLng}
                                    onChange={handleChangeMarket}
                                />
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
                                <MDButton onClick={handleAddMarket} variant="gradient" color="info">
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


