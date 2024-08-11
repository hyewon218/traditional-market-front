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
import MDBox from '../../components/MD/MDBox';
import MDInput from '../../components/MD/MDInput';
import MDButton from '../../components/MD/MDButton';

// Material Dashboard 2 React example components
import DashboardLayout from '../../examples/LayoutContainers/DashboardLayout';
import { useNavigate } from "react-router-dom";
import { FormControl, InputLabel, Select, MenuItem } from "@mui/material";

// Data
import { postInquiry, getInquiryOne } from "../../api/inquiryApi";

const initState = {
  inquiryTitle: '',
  inquiryContent: '',
};

const fetchInquiry = async (inquiryNo) => {

  try {
    const data = await getInquiryOne(inquiryNo);
    console.log("fetchInquiry data: ", data);
    return data;

  } catch (error) {
    console.error("문의사항 정보 불러오기 오류:", error);
  }
};

function PostInquiry() {
  const uploadRef = useRef();
  const [previewImages, setPreviewImages] = useState([]);
  const [imageFiles, setImageFiles] = useState([]);
  const navigate = useNavigate();
  const [inquiry, setInquiry] = useState({ ...initState });

  const handleChangeInquiry = (e) => {
    const { name, value } = e.target;
    setInquiry(prevInquiry => ({ ...prevInquiry, [name]: value }));
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

  const handleAddInquiry = async (event) => {
    event.preventDefault();

    if (!window.confirm('작성 후 수정은 불가능합니다. 문의사항을 추가하시겠습니까?')) {
      return;
    }

    if (!inquiry.inquiryTitle || !inquiry.inquiryContent) {
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
    formData.append('inquiryTitle', inquiry.inquiryTitle);
    formData.append('inquiryContent', inquiry.inquiryContent);
    for (let i = 0; i < imageFiles.length; i++) {
      formData.append("imageFiles", imageFiles[i]);
    }

    try {
      const data = await postInquiry(formData);
      const inquiryData = await fetchInquiry(data.inquiryNo);

      if (window.confirm('작성된 문의사항을 확인하시겠습니까?')) {
        navigate(`/inquiry-detail`, { state: inquiryData });
      } else {
        navigate('/market');
      }

    } catch (error) {
      console.error("문의사항 추가 오류: ", error);
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
                  name="inquiryTitle"
                  label="문의사항 제목"
                  onChange={handleChangeInquiry}
                  fullWidth
                />
              </MDBox>
              <MDBox mb={2}>
                <MDInput
                  name="inquiryContent"
                  label="문의사항 내용"
                  onChange={handleChangeInquiry}
                  fullWidth
                  multiline
                  rows={6} // 원하는 높이에 따라 rows 값 조정
                />
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
                <MDButton onClick={handleAddInquiry} variant="gradient" color="info">
                  문의사항 작성
                </MDButton>
              </MDBox>
            </MDBox>
          </MDBox>
        </Card>
      </MDBox>
    </DashboardLayout>
  );
}

export default PostInquiry;

