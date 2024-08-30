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

// 수정 필드에 소속시장, 소속 상점 추가(수정은 불가), 수정 후 해당 상품 상세 페이지로 이동 추가
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
import {putItem, getItemOne} from "../../api/itemApi";
import {getShopOne} from "../../api/shopApi";
import {getOne} from "../../api/marketApi";
import {FormControl, InputLabel, Select} from "@mui/material";
import MenuItem from "@mui/material/MenuItem";

const itemSellStatusOptions = {
    판매중: 'SELL',
    판매완료: 'SOLD_OUT'
};

const itemCategories = {
    과일: '과일',
    채소: '채소',
    육류: '육류',
    생선: '생선'
};

const getCategoryKeyByValue = (value) => {
    return Object.keys(itemSellStatusOptions).find(
        key => itemSellStatusOptions[key] === value);
};

// 수정 후 해당 상품 상세 페이지로 가기 위해 해당 상품의 정보 조회
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

function ModifyItem() {
    const {state} = useLocation();
    const initItem = state || {}; // state 가 정의 되었는지 확인
    console.log(initItem);

    const uploadRef = useRef()

    const [item, setItem] = useState({
        ...initItem,
        itemSellStatus: getCategoryKeyByValue(initItem.itemSellStatus) || '', // key 값 얻기
        imageFiles: initItem.imageFiles || [],
    });

    const [initialImages, setInitialImages] = useState(
        initItem.imageList || []); // 기존에 있던 이미지들
    const [filePreviews, setFilePreviews] = useState([]); // 새로 추가한 이미지들
    const [removedImages, setRemovedImages] = useState([]); // 제거된 이미지를 추적하기 위한 상태
    const [market, setMarket] = useState(''); // 소속 시장 매핑하기 위한 상태
    const [shop, setShop] = useState(''); // 소속 상점 매핑하기 위한 상태

    const navigate = useNavigate()

    useEffect(() => {
        // 소속 시장과 상점 데이터를 불러오기
        const loadMarketAndShop = async () => {
            try {
                if (item.shopNo) {
                    const shopData = await getShopOne(item.shopNo);
                    setShop(shopData);
                }

                if (shop.marketNo) {
                    const marketData = await getOne(shop.marketNo);
                    setMarket(marketData);
                }

            } catch (error) {
                console.error("시장, 상점 데이터 불러오기 오류:", error);
            }
        };

        loadMarketAndShop();
    }, [shop.shopNo]);

    const handleChangeItem = (e) => {
        const {name, value} = e.target;
        setItem((prevItem) => ({...prevItem, [name]: value}));
    }

    const handleFileChange = (e) => {
        const files = Array.from(e.target.files);
        setItem((prevItem) => ({...prevItem, imageFiles: files}));

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
        setItem((prevItem) => {
            const updatedFiles = [...prevItem.imageFiles];
            updatedFiles.splice(index, 1);
            return {...prevItem, imageFiles: updatedFiles};
        });

        setFilePreviews((prevPreviews) => {
            const updatedPreviews = [...prevPreviews];
            URL.revokeObjectURL(updatedPreviews[index]);
            updatedPreviews.splice(index, 1);
            return updatedPreviews;
        });
    };

    const handleModifyItem = async () => {

        if (!window.confirm('상품을 수정하시겠습니까?')) {
            return;
        }

        // 유효성 검사
        if (!item.itemName || !item.price || !item.itemDetail
            || !item.stockNumber
            || !item.itemSellStatus
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
        formData.append('itemName', item.itemName);
        formData.append('price', item.price);
        formData.append('itemDetail', item.itemDetail);
        formData.append('stockNumber', item.stockNumber);
        formData.append('itemCategory', itemCategories[item.itemCategory]);
        formData.append('itemSellStatus',
            itemSellStatusOptions[item.itemSellStatus]);
        // 새로 추가된 이미지 추가
        for (let i = 0; i < item.imageFiles.length; i++) {
            formData.append("imageFiles", item.imageFiles[i]);
        }

        // 기존 이미지 중 삭제되지 않은(남은) 이미지만 추가
        if (initialImages != null) {
            const remainingInitialImages = initialImages.filter(img =>
                !removedImages.includes(img.imageUrl));
            remainingInitialImages.forEach(img => {
                formData.append('imageUrls', img.imageUrl);
            });
            console.log("Remaining initial images:", remainingInitialImages);
        }

        console.log(formData)

        try {
            const data = await putItem(item.itemNo, formData);
            const itemData = await fetchItem(data.itemNo);
            navigate(`/item-detail`, { state: itemData });
        } catch (error) {
            console.error("상품 수정 오류: ", error);
        }
    };

    useEffect(() => {
        // Clean up previews on component unmount
        return () => {
            filePreviews.forEach(preview => URL.revokeObjectURL(preview));
        };
    }, [filePreviews]);

    return (
        <DashboardLayout>
            <MDBox pb={3}>
                <Card>
                    <MDBox pt={3} pb={3} px={3}>
                        <MDBox component="form" role="form">
                            <MDBox mb={2}>
                                <MDInput
                                    name="marketName"
                                    label="소속 시장"
                                    value={market.marketName || ''}
                                    disabled={true}
                                    fullWidth
                                />
                            </MDBox>
                            <MDBox mb={2}>
                                <MDInput
                                    name="shopName"
                                    label="소속 상점"
                                    value={shop.shopName || ''}
                                    disabled={true}
                                    fullWidth
                                />
                            </MDBox>
                            <MDBox mb={2}>
                                <MDInput
                                    name="itemName"
                                    label="상품 이름"
                                    defaultValue={item.itemName}
                                    onChange={handleChangeItem}
                                    fullWidth/>
                            </MDBox>
                            <MDBox mb={2}>
                                <MDInput
                                    name="price"
                                    label="상품 가격"
                                    defaultValue={item.price}
                                    onChange={handleChangeItem}
                                    fullWidth/>
                            </MDBox>
                            <MDBox mb={2}>
                                <MDInput
                                    name="itemDetail"
                                    label="상품 상세설명"
                                    defaultValue={item.itemDetail}
                                    onChange={handleChangeItem}
                                    fullWidth
                                />
                            </MDBox>
                            <MDBox mb={2}>
                                <MDInput
                                    name="stockNumber"
                                    label="상품 재고 갯수"
                                    defaultValue={item.stockNumber}
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
                                        sx={{minHeight: 45}}
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
                                        sx={{minHeight: 45}}
                                    >
                                        {Object.keys(itemSellStatusOptions).map(
                                            (key) => (
                                                <MenuItem key={key} value={key}>
                                                    {key}
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
                            <MDBox display="flex" flexWrap="wrap">
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
                            <MDBox style={{ display: 'flex', justifyContent: 'flex-end' }}>
                                <MDButton onClick={handleModifyItem}
                                          variant="gradient" color="info"
                                          sx={{
                                              fontFamily: 'JalnanGothic',
                                              fontSize: '0.8rem',
                                              padding: '4px 8px',
                                          }}
                                >
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

export default ModifyItem;
