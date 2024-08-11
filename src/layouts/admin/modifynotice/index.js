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
import MDBox from '../../../components/MD/MDBox';
import MDInput from '../../../components/MD/MDInput';
import MDButton from '../../../components/MD/MDButton';

// Material Dashboard 2 React example components
import DashboardLayout from '../../../examples/LayoutContainers/DashboardLayout';

import {putNotice, getNotice} from "../../../api/noticeApi";
import {FormControl, InputLabel, Select} from "@mui/material";
import MenuItem from "@mui/material/MenuItem";

// 수정 후 해당 공지사항 상세 페이지로 가기 위해 해당 공지사항의 정보 조회
const fetchNotice = async (noticeNo) => {

  try {
      // getNotice 함수를 사용하여 API 호출
      const data = await getNotice(noticeNo);
      console.log("fetchNotice data: ", data);
      return data;

  } catch (error) {
      console.error("공지사항 정보 불러오기 오류:", error);
  }
};

function ModifyNotice() {
    const {state} = useLocation();
    const initNotice = state || {}; // state 가 정의 되었는지 확인

    const uploadRef = useRef();

    const [notice, setNotice] = useState({
        ...initNotice,
        imageFiles: initNotice.imageFiles || [],
    });

    const [initialImages, setInitialImages] = useState(initNotice.imageList || []); // 기존에 있던 이미지들
    const [filePreviews, setFilePreviews] = useState([]); // 새로 추가한 이미지들
    const [removedImages, setRemovedImages] = useState([]); // 제거된 이미지를 추적하기 위한 상태

    const navigate = useNavigate();

    const handleChangeNotice = (e) => {
        const { name, value } = e.target;
        setNotice((prevNotice) => ({ ...prevNotice, [name]: value }));
    };

    const handleFileChange = (e) => {
        const files = Array.from(e.target.files);
        setNotice((prevNotice) => ({ ...prevNotice, imageFiles: files }));

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
        setNotice((prevNotice) => {
            const updatedFiles = [...prevNotice.imageFiles];
            updatedFiles.splice(index, 1);
            return { ...prevNotice, imageFiles: updatedFiles };
        });

        setFilePreviews((prevPreviews) => {
            const updatedPreviews = [...prevPreviews];
            URL.revokeObjectURL(updatedPreviews[index]);
            updatedPreviews.splice(index, 1);
            return updatedPreviews;
        });
    };

    const handleModifyNotice = async (event) => {
        if (!window.confirm('공지사항을 수정하시겠습니까?')) {
            return;
        }

        // 유효성 검사
        if (!notice.noticeTitle || !notice.noticeContent) {
            alert('모든 필드를 입력하세요.');
            return;
        }

        // 파일 크기 제한
        const maxFileSize = 30 * 1024 * 1024; // 30MB 제한
        for (let i = 0; i < notice.imageFiles.length; i++) {
            if (notice.imageFiles[i].size > maxFileSize) {
                alert(`파일 크기는 30MB를 초과할 수 없습니다: ${notice.imageFiles[i].name}`);
                return;
            }
        }

        // FormData 생성
        const formData = new FormData();
        formData.append('noticeTitle', notice.noticeTitle);
        formData.append('noticeContent', notice.noticeContent);

        // 새로 추가된 이미지 추가
        for (let i = 0; i < notice.imageFiles.length; i++) {
            formData.append("imageFiles", notice.imageFiles[i]);
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
            const data = await putNotice(notice.noticeNo, formData);
            const noticeData = await fetchNotice(data.noticeNo);
            navigate(`/notice-detail`, { state: noticeData });

        } catch (error) {
            console.error("공지사항 수정 오류: ", error);
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
            <MDBox pt={6} pb={3} px={3}>
                <Card>
                    <MDBox pt={3} px={3} lineHeight={1.5}>
                        <MDBox mb={2}>
                            <MDInput
                                fullWidth
                                label="공지사항 제목"
                                name="noticeTitle"
                                value={notice.noticeTitle || ''}
                                onChange={handleChangeNotice}
                            />
                        </MDBox>
                        <MDBox mb={2}>
                            <MDInput
                                fullWidth
                                label="공지사항 내용"
                                name="noticeContent"
                                value={notice.noticeContent || ''}
                                onChange={handleChangeNotice}
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
                            <MDButton variant="outlined" color="primary" onClick={() => uploadRef.current.click()}>
                                이미지 업로드
                            </MDButton>
                        </MDBox>
                        <MDBox mb={2}>
                            <div>
                                {filePreviews.map((preview, index) => (
                                    <div key={index}>
                                        <img src={preview} alt={`preview ${index}`} width="100" />
                                        <IconButton onClick={() => handleRemovePreviewFile(index)}>
                                            <CloseIcon />
                                        </IconButton>
                                    </div>
                                ))}
                                {initialImages.map((img, index) => (
                                    <div key={index}>
                                        <img src={img.imageUrl} alt={`initial ${index}`} width="100" />
                                        <IconButton onClick={() => handleRemoveInitialImage(index)}>
                                            <CloseIcon />
                                        </IconButton>
                                    </div>
                                ))}
                            </div>
                        </MDBox>
                        <MDBox mb={2}>
                            <MDButton variant="contained" color="primary" onClick={handleModifyNotice}>
                                수정 완료
                            </MDButton>
                        </MDBox>
                    </MDBox>
                </Card>
            </MDBox>
        </DashboardLayout>
    );
}

export default ModifyNotice;
