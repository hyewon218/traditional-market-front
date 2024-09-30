///**
// =========================================================
// * Material Dashboard 2 React - v2.1.0
// =========================================================
//
// * Product Page: https://www.creative-tim.com/product/material-dashboard-react
// * Copyright 2022 Creative Tim (https://www.creative-tim.com)
//
// Coded by www.creative-tim.com
//
// =========================================================
//
// * The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.
// */
//
//import * as React from 'react';
//import { useRef, useEffect, useState } from 'react';
//
//// @mui material components
//import Card from '@mui/material/Card';
//
//// Material Dashboard 2 React components
//import MDBox from '../../../components/MD/MDBox';
//import MDInput from '../../../components/MD/MDInput';
//import MDButton from '../../../components/MD/MDButton';
//
//// Material Dashboard 2 React example components
//import DashboardLayout from '../../../examples/LayoutContainers/DashboardLayout';
//import { useNavigate } from "react-router-dom";
//import { FormControl, InputLabel, Select, MenuItem } from "@mui/material";
//
//// Data
//import { postNotice, getNotice } from "../../../api/noticeApi";
//
//const initState = {
//  noticeTitle: '',
//  noticeContent: '',
//};
//
//const fetchNotice = async (noticeNo) => {
//
//  try {
//    const data = await getNotice(noticeNo);
//    console.log("fetchNotice data: ", data);
//    return data;
//
//  } catch (error) {
//    console.error("공지사항 정보 불러오기 오류:", error);
//  }
//};
//
//function PostNoticeAdmin() {
//
//  const uploadRef = useRef();
//  const [previewImages, setPreviewImages] = useState([]);
//  const [imageFiles, setImageFiles] = useState([]);
//  const navigate = useNavigate();
//  const [notice, setNotice] = useState({ ...initState });
//
//  const handleChangeNotice = (e) => {
//    const { name, value } = e.target;
//    setNotice(prevNotice => ({ ...prevNotice, [name]: value }));
//  };
//
//  const handleFileChange = (event) => {
//    const files = Array.from(event.target.files);
//    const newPreviewImages = files.map(file => URL.createObjectURL(file));
//
//    event.target.value = null;
//
//    setImageFiles(prevFiles => [...prevFiles, ...files]);
//    setPreviewImages(prevImages => [...prevImages, ...newPreviewImages]);
//  };
//
//  const handleRemoveImage = (index) => {
//    setPreviewImages(prevImages => prevImages.filter((_, i) => i !== index));
//    setImageFiles(prevFiles => prevFiles.filter((_, i) => i !== index));
//  };
//
//  const handleAddNotice = async (event) => {
//    event.preventDefault();
//
//    if (!window.confirm('공지사항을 추가하시겠습니까?')) {
//      return;
//    }
//
//    if (!notice.noticeTitle || !notice.noticeContent) {
//      alert('모든 필드를 입력하세요.');
//      return;
//    }
//
//    const maxFileSize = 30 * 1024 * 1024;
//    for (let i = 0; i < imageFiles.length; i++) {
//      if (imageFiles[i].size > maxFileSize) {
//        alert(`파일 크기는 30MB를 초과할 수 없습니다: ${imageFiles[i].name}`);
//        return;
//      }
//    }
//
//    const formData = new FormData();
//    formData.append('noticeTitle', notice.noticeTitle);
//    formData.append('noticeContent', notice.noticeContent);
//    for (let i = 0; i < imageFiles.length; i++) {
//      formData.append("imageFiles", imageFiles[i]);
//    }
//
//    try {
//      const data = await postNotice(formData);
//      const noticeData = await fetchNotice(data.noticeNo);
//
//      if (window.confirm('작성된 공지사항을 확인하시겠습니까?')) {
//        navigate(`/notice-detail`, { state: noticeData });
//      } else {
//        navigate('/notice-manage');
//      }
//
//    } catch (error) {
//      console.error("공지사항 추가 오류: ", error);
//    }
//  };
//
//  return (
//    <DashboardLayout>
//      <MDBox pt={6} pb={3}>
//        <Card>
//          <MDBox pt={4} pb={3} px={3}>
//            <MDBox component="form" role="form">
//              <MDBox mb={2}>
//                <MDInput
//                  name="noticeTitle"
//                  label="공지사항 제목"
//                  onChange={handleChangeNotice}
//                  fullWidth
//                />
//              </MDBox>
//              <MDBox mb={2}>
//                <MDInput
//                  name="noticeContent"
//                  label="공지사항 내용"
//                  onChange={handleChangeNotice}
//                  fullWidth
//                  multiline
//                  rows={10} // 원하는 높이에 따라 rows 값 조정
//                />
//              </MDBox>
//              <MDBox mb={2}>
//                <MDInput
//                  inputRef={uploadRef}
//                  onChange={handleFileChange}
//                  inputType={'file'}
//                  type={'file'}
//                  multiple={true}
//                  fullWidth
//                />
//              </MDBox>
//              {previewImages.length > 0 && (
//                <MDBox mb={2} sx={{ display: 'flex', flexWrap: 'wrap' }}>
//                  {previewImages.map((image, index) => (
//                    <MDBox key={index} sx={{ position: 'relative', marginRight: '10px', marginBottom: '10px' }}>
//                      <img
//                        src={image}
//                        alt={`preview-${index}`}
//                        style={{
//                          maxWidth: '150px',
//                          maxHeight: '150px',
//                        }}
//                      />
//                      <MDButton
//                        onClick={() => handleRemoveImage(index)}
//                        sx={{
//                          position: 'absolute',
//                          top: '5px',
//                          right: '5px',
//                          backgroundColor: 'rgba(255, 255, 255, 0.8)',
//                          padding: '5px',
//                        }}
//                      >
//                        X
//                      </MDButton>
//                    </MDBox>
//                  ))}
//                </MDBox>
//              )}
//              <MDBox mt={4} mb={1} right>
//                <MDButton onClick={handleAddNotice} variant="gradient" color="info">
//                  공지사항 작성
//                </MDButton>
//              </MDBox>
//            </MDBox>
//          </MDBox>
//        </Card>
//      </MDBox>
//    </DashboardLayout>
//  );
//}
//
//export default PostNoticeAdmin;
//

// 반응형
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

import React, {useRef, useState} from 'react';
import {useNavigate} from 'react-router-dom';
import Card from '@mui/material/Card';
import MDBox from '../../../components/MD/MDBox';
import MDInput from '../../../components/MD/MDInput';
import MDButton from '../../../components/MD/MDButton';
import DashboardLayout
    from '../../../examples/LayoutContainers/DashboardLayout';
import {postNotice, getNotice} from '../../../api/noticeApi';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import {useMediaQuery} from "@mui/material";
import IconButton from "@mui/material/IconButton";
import CloseIcon from "@mui/icons-material/Close"; // Import Quill styles

const initState = {
    noticeTitle: '',
    noticeContent: '',
};

const fetchNotice = async (noticeNo) => {
    try {
        const data = await getNotice(noticeNo);
        console.log("fetchNotice data: ", data);
        return data;
    } catch (error) {
        console.error("공지사항 정보 불러오기 오류:", error);
    }
};

function PostNoticeAdmin() {
    const uploadRef = useRef();
    const [previewImages, setPreviewImages] = useState([]);
    const [imageFiles, setImageFiles] = useState([]);
    const [notice, setNotice] = useState({...initState});
    const navigate = useNavigate();
    const isSmallScreen = useMediaQuery('(max-width:600px)');

    const handleChangeNotice = (e) => {
        const {name, value} = e.target;
        setNotice(prevNotice => ({...prevNotice, [name]: value}));
    };

    const handleQuillChange = (value) => {
        setNotice(prevNotice => ({...prevNotice, noticeContent: value}));
    };

    const handleFileChange = (event) => {
        const files = Array.from(event.target.files);
        const newPreviewImages = files.map(file => URL.createObjectURL(file));

        event.target.value = null;

        setImageFiles(prevFiles => [...prevFiles, ...files]);
        setPreviewImages(prevImages => [...prevImages, ...newPreviewImages]);
    };

    const handleRemoveImage = (index) => {
        setPreviewImages(
            prevImages => prevImages.filter((_, i) => i !== index));
        setImageFiles(prevFiles => prevFiles.filter((_, i) => i !== index));
    };

    const handleAddNotice = async (event) => {
        event.preventDefault();

        if (!window.confirm('공지사항을 추가하시겠습니까?')) {
            return;
        }

        if (!notice.noticeTitle || !notice.noticeContent) {
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
        formData.append('noticeTitle', notice.noticeTitle);
        formData.append('noticeContent', notice.noticeContent);
        for (let i = 0; i < imageFiles.length; i++) {
            formData.append("imageFiles", imageFiles[i]);
        }

        try {
            const data = await postNotice(formData);
            const noticeData = await fetchNotice(data.noticeNo);

            if (window.confirm('작성된 공지사항을 확인하시겠습니까?')) {
                navigate(`/notice-detail`, {state: noticeData});
            } else {
                navigate('/notice-manage');
            }

        } catch (error) {
            console.error("공지사항 추가 오류: ", error);
        }
    };

    return (
        <DashboardLayout>
            <MDBox pt={isSmallScreen ? 0 : 1}
                   pb={20}
                   px={isSmallScreen ? 1 : 3}
                   mt={isSmallScreen ? -2 : 5}
                   width="100%"
                   display="flex"
                   justifyContent="center">
                <Card sx={{
                    maxWidth: isSmallScreen ? '100%' : '40%',
                    width: '100%',
                    margin: '0 auto',
                }}>
                    <MDBox pt={3} pb={isSmallScreen ? 2 : 3} px={3} lineHeight={1.5}>
                        <MDBox component="form" role="form">
                            <MDBox mb={2} sx={{width: '100%'}}>
                                <MDInput
                                    name="noticeTitle"
                                    label="공지사항 제목"
                                    onChange={handleChangeNotice}
                                    fullWidth
                                />
                            </MDBox>
                            <MDBox mb={isSmallScreen ? 10 : 8} sx={{width: '100%'}}>
                                <ReactQuill
                                    value={notice.noticeContent}
                                    onChange={handleQuillChange}
                                    theme="snow"
                                    style={{height: isSmallScreen ? '180px':'300px'}} // 높이는 원하는 대로 조정 가능
                                />
                            </MDBox>
                            <MDBox mb={2} sx={{width: '100%'}}>
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
                                <MDBox mb={2}
                                       sx={{display: 'flex', flexWrap: 'wrap'}}>
                                    {previewImages.map((image, index) => (
                                        <MDBox key={index} sx={{
                                            position: 'relative',
                                            marginRight: '10px',
                                            marginBottom: '0px',
                                            marginTop: '5px'
                                        }}>
                                            <img
                                                src={image}
                                                alt={`preview-${index}`}
                                                style={{
                                                    maxWidth: isSmallScreen ? '80px':'150px',
                                                    maxHeight: isSmallScreen ? '80px':'150px',
                                                }}
                                            />
                                            <IconButton
                                                size="small"
                                                color="secondary"
                                                onClick={() => handleRemoveImage(
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
                            )}
                            <MDBox mt={isSmallScreen ? 1:3} style={{ display: 'flex', justifyContent: 'flex-end' }}>
                                <MDButton
                                    variant="gradient"
                                    color="info"
                                    sx={{
                                        fontFamily: 'JalnanGothic',
                                        fontSize: isSmallScreen ? '0.8rem':'0.9rem',
                                        minWidth: 'auto',
                                        width: isSmallScreen ? '100px' : '120px',
                                        padding: isSmallScreen
                                            ? '1px 2px'
                                            : '2px 4px',
                                        lineHeight:  isSmallScreen ? 2.5:2.2,  // 줄 간격을 줄여 높이를 감소시킴
                                        minHeight: 'auto', // 기본적으로 적용되는 높이를 없앰
                                    }}
                                    onClick={handleAddNotice}>
                                    공지사항 작성
                                </MDButton>
                            </MDBox>
                        </MDBox>
                    </MDBox>
                </Card>
            </MDBox>
        </DashboardLayout>
    );
}

export default PostNoticeAdmin;

// 공지사항 내용 파일 첨부되는 게시판, 파일 경로 문제 있음
//import React, { useRef, useState } from 'react';
//import { useNavigate } from 'react-router-dom';
//import Card from '@mui/material/Card';
//import MDBox from '../../../components/MD/MDBox';
//import MDInput from '../../../components/MD/MDInput';
//import MDButton from '../../../components/MD/MDButton';
//import MDTypography from '../../../components/MD/MDTypography';
//import DashboardLayout from '../../../examples/LayoutContainers/DashboardLayout';
//import { postNotice, getNotice } from '../../../api/noticeApi';
//import { CKEditor } from '@ckeditor/ckeditor5-react';
//import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
//import '@ckeditor/ckeditor5-build-classic/build/translations/ko';
//
//const initState = {
//  noticeTitle: '',
//  noticeContent: '',
//};
//
//const fetchNotice = async (noticeNo) => {
//  try {
//    const data = await getNotice(noticeNo);
//    console.log("fetchNotice data: ", data);
//    return data;
//  } catch (error) {
//    console.error("공지사항 정보 불러오기 오류:", error);
//  }
//};
//
//function PostNoticeAdmin() {
//  const uploadRef = useRef();
//  const [previewImages, setPreviewImages] = useState([]);
//  const [imageFiles, setImageFiles] = useState([]);
//  const [notice, setNotice] = useState({ ...initState });
//  const navigate = useNavigate();
//
//  const handleChangeNotice = (e) => {
//    const { name, value } = e.target;
//    setNotice(prevNotice => ({ ...prevNotice, [name]: value }));
//  };
//
//  const handleEditorChange = (event, editor) => {
//    const data = editor.getData();
//    setNotice(prevNotice => ({ ...prevNotice, noticeContent: data }));
//  };
//
//  const handleFileChange = (event) => {
//    const files = Array.from(event.target.files);
//    const newPreviewImages = files.map(file => URL.createObjectURL(file));
//
//    event.target.value = null;
//
//    setImageFiles(prevFiles => [...prevFiles, ...files]);
//    setPreviewImages(prevImages => [...prevImages, ...newPreviewImages]);
//  };
//
//  const handleRemoveImage = (index) => {
//    setPreviewImages(prevImages => prevImages.filter((_, i) => i !== index));
//    setImageFiles(prevFiles => prevFiles.filter((_, i) => i !== index));
//  };
//
//  const handleAddNotice = async (event) => {
//    event.preventDefault();
//
//    if (!window.confirm('공지사항을 추가하시겠습니까?')) {
//      return;
//    }
//
//    if (!notice.noticeTitle || !notice.noticeContent) {
//      alert('모든 필드를 입력하세요.');
//      return;
//    }
//
//    const maxFileSize = 30 * 1024 * 1024;
//    for (let i = 0; i < imageFiles.length; i++) {
//      if (imageFiles[i].size > maxFileSize) {
//        alert(`파일 크기는 30MB를 초과할 수 없습니다: ${imageFiles[i].name}`);
//        return;
//      }
//    }
//
//    const formData = new FormData();
//    formData.append('noticeTitle', notice.noticeTitle);
//    formData.append('noticeContent', notice.noticeContent);
//    for (let i = 0; i < imageFiles.length; i++) {
//      formData.append("imageFiles", imageFiles[i]);
//    }
//
//    try {
//      const data = await postNotice(formData);
//      const noticeData = await fetchNotice(data.noticeNo);
//
//      if (window.confirm('작성된 공지사항을 확인하시겠습니까?')) {
//        navigate(`/notice-detail`, { state: noticeData });
//      } else {
//        navigate('/notice-manage');
//      }
//
//    } catch (error) {
//      console.error("공지사항 추가 오류: ", error);
//    }
//  };
//
//  return (
//    <DashboardLayout>
//      <MDBox
//        pt={6}
//        pb={3}
//        sx={{
//          display: 'flex',
//          alignItems: 'center',
//          justifyContent: 'center',
//          height: '80vh', // 화면 전체 높이를 차지하도록
//          '@media (max-width:600px)': {
//            height: 'auto', // 모바일에서는 높이를 자동으로 조정
//          },
//        }}
//      >
//        <Card
//          sx={{
//            width: '100%',
//            maxWidth: '1500px', // 최대 너비 설정
//          }}
//        >
//          <MDBox pt={4} pb={3} px={3}>
//            <MDBox component="form" role="form">
//              <MDBox mb={2} sx={{ width: '100%' }}>
//                <MDInput
//                  name="noticeTitle"
//                  label="공지사항 제목"
//                  onChange={handleChangeNotice}
//                  fullWidth
//                />
//              </MDBox>
//              <MDBox mb={2} sx={{ width: '100%' }}>
//                <CKEditor
//                  editor={ClassicEditor}
//                  data={notice.noticeContent}
//                  onChange={handleEditorChange}
//                  config={{
//                    ckfinder: {
//                      uploadUrl: '/api/upload', // Your upload API URL
//                    },
//                    language: 'ko', // 한국어 설정
//                  }}
//                />
//              </MDBox>
//              <MDBox mb={2} sx={{ width: '100%' }}>
//                <MDInput
//                  inputRef={uploadRef}
//                  onChange={handleFileChange}
//                  inputType={'file'}
//                  type={'file'}
//                  multiple={true}
//                  fullWidth
//                />
//              </MDBox>
//              {previewImages.length > 0 && (
//                <MDBox mb={2} sx={{ display: 'flex', flexWrap: 'wrap' }}>
//                  {previewImages.map((image, index) => (
//                    <MDBox key={index} sx={{ position: 'relative', marginRight: '10px', marginBottom: '10px' }}>
//                      <img
//                        src={image}
//                        alt={`preview-${index}`}
//                        style={{
//                          maxWidth: '150px',
//                          maxHeight: '150px',
//                          borderRadius: '8px',
//                        }}
//                      />
//                      <MDButton
//                        onClick={() => handleRemoveImage(index)}
//                        sx={{
//                          position: 'absolute',
//                          top: '5px',
//                          right: '5px',
//                          backgroundColor: 'rgba(255, 255, 255, 0.8)',
//                          padding: '5px',
//                        }}
//                      >
//                        X
//                      </MDButton>
//                    </MDBox>
//                  ))}
//                </MDBox>
//              )}
//              <MDBox mt={4} mb={1} sx={{ width: '100%', textAlign: 'center' }}>
//                <MDButton onClick={handleAddNotice} variant="gradient" color="info">
//                  공지사항 작성
//                </MDButton>
//              </MDBox>
//            </MDBox>
//          </MDBox>
//        </Card>
//      </MDBox>
//    </DashboardLayout>
//  );
//}
//
//export default PostNoticeAdmin;

