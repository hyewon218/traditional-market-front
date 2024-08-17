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

// 최종 코드
import {useEffect, useState} from 'react';
import {useLocation, useNavigate} from 'react-router-dom';

// @mui/material components
import Card from '@mui/material/Card';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import IconButton from '@mui/material/IconButton';
import KeyboardArrowLeftIcon from '@mui/icons-material/KeyboardArrowLeft';
import KeyboardArrowRightIcon from '@mui/icons-material/KeyboardArrowRight';

// Material Dashboard 2 React components
import DashboardLayout from '../../examples/LayoutContainers/DashboardLayout';
import useCustomLogin from "../../hooks/useCustomLogin";

// Data
import {getInquiryAnswer, postInquiryAnswer} from "../../api/inquiryAnswerApi";
import {deleteInquiry} from "../../api/inquiryApi";

const initState = {
    answerNo: 0,
    inquiryWriterNo:0,
    inquiryNo:0,
    answerContent:'',
    answerWriter:'',
    imageList:[],
    createTime: null,
    updateTime: null
}

function InquiryDetail() {
    const {state} = useLocation();
    const inquiry = state; // 전달된 shop 데이터를 사용
    const navigate = useNavigate();

    const [showAnswerForm, setShowAnswerForm] = useState(false);
    const [inquiryAnswer, setInquiryAnswer] = useState("");
    const [previewImages, setPreviewImages] = useState([]);
    const [imageFiles, setImageFiles] = useState([]); // 실제 파일 상태 관리
    const [answerData, setAnswerData] = useState(initState); // 답변 데이터를 저장할 상태 추가
    const {isAdmin} = useCustomLogin();

    useEffect(() => {
        // 컴포넌트가 마운트될 때 문의사항 답변을 가져옵니다.
        const fetchInquiryAnswer = async () => {
            try {
                const data = await getInquiryAnswer(inquiry.inquiryNo);
                setAnswerData(data); // 가져온 데이터를 상태에 저장
                console.log("getInquiryAnswer!!!!!"+data.answerContent)
            } catch (error) {
                console.error("답변을 가져오는 중 오류 발생: ", error);
            }
        };

        fetchInquiryAnswer();
    }, [inquiry.inquiryNo]);

    const deleteInquiryByNo = async (inquiryNo) => {
        if (window.confirm("정말 이 문의사항을 삭제하시겠습니까?")) {
            const response = await deleteInquiry(inquiryNo);
            alert("문의사항 삭제 성공!");
            navigate('/myinquiries');
        }
    };

    const handleAnswerClick = () => {
        setShowAnswerForm(true);
    };

    const handleChangeInquiryAnswer = (e) => {
        const {name, value} = e.target;
        setInquiryAnswer((prevInquiryAnswer) => ({
            ...prevInquiryAnswer,
            [name]: value,
        }));
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

    const handleAddInquiryAnswer = async (event) => {
        event.preventDefault();

        if (!window.confirm('해당 문의사항에 대한 답변을 등록하시겠습니까?')) {
            return;
        }

        if (!inquiryAnswer) {
            alert('답변 내용을 입력하세요.');
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
        formData.append('answerContent', inquiryAnswer.answerContent);
        for (let i = 0; i < imageFiles.length; i++) {
            formData.append("imageFiles", imageFiles[i]);
        }

        try {
            const data = await postInquiryAnswer(inquiry.inquiryNo, formData);
            alert('문의사항 답변이 등록되었습니다');
            window.location.reload();

        } catch (error) {
            console.error("문의사항 답변 생성 오류: ", error);
        }
    };

    const handleBack = () => {
        window.history.back();
    };

    const formatCreateTime = (dateString) => {
        const date = new Date(dateString);
        return new Intl.DateTimeFormat('ko-KR', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
        }).format(date);
    };

    return (
        <DashboardLayout>
            <Box sx={{p: 3}}>
                <Box sx={{mt: 2, display: 'flex', gap: 1}}>
                    <Button variant="contained" color="error"
                            onClick={handleBack}
                            startIcon={<KeyboardArrowLeftIcon/>}>
                        돌아가기
                    </Button>
                </Box>
                {/* 문의사항 기본 정보 */}
                <Card sx={{p: 3, mb: 2}}>
                    <Grid container spacing={2}>
                        <Grid item xs={12} md={8}>
                            <Typography variant="body1" paragraph>
                                <strong>문의사항 제목:</strong> {inquiry.inquiryTitle}
                            </Typography>
                            <Typography variant="body1" paragraph>
                                <strong>문의사항
                                    작성자:</strong> {inquiry.inquiryWriter}
                            </Typography>
                            <Typography variant="body1" paragraph>
                                <strong>작성 시간:</strong> {formatCreateTime(
                                inquiry.createTime)}
                            </Typography>
                            <Typography variant="body1" paragraph>
                                <strong>문의사항
                                    내용:</strong> {inquiry.inquiryContent}
                            </Typography>
                            <Typography variant="body1" paragraph>
                                <strong>답변 상태:</strong> {inquiry.inquiryState}
                            </Typography>
                        </Grid>
                        <Grid item xs={12} md={4}>
                            <Box sx={{
                                display: 'flex',
                                flexDirection: 'column',
                                alignItems: 'flex-start',
                                gap: 2
                            }}>
                                {inquiry.imageList.map((img, index) => (
                                    <img
                                        key={index}
                                        src={img.imageUrl}
                                        alt={`inquiry-image-${index}`}
                                        width="70%"
                                        style={{marginBottom: '10px'}}
                                    />
                                ))}
                            </Box>
                        </Grid>
                    </Grid>
                </Card>

                {/* 답변이 있는 경우 답변 출력 */}
                {answerData.answerNo && (
                    <Card sx={{p: 3, mb: 2}}>
                        <Grid container spacing={2}>
                            <Grid item xs={12} md={8}>
                                <Typography variant="body1" paragraph>
                                    <strong>답변 작성자:</strong> {answerData.answerWriter}
                                </Typography>
                                <Typography variant="body1" paragraph>
                                    <strong>답변 작성 시간:</strong> {formatCreateTime(answerData.createTime)}
                                </Typography>
                                <Typography variant="body1" paragraph>
                                    <strong>답변 내용:</strong> {answerData.answerContent}
                                </Typography>
                            </Grid>
                            <Grid item xs={12} md={4}>
                                <Box sx={{
                                    display: 'flex',
                                    flexDirection: 'column',
                                    alignItems: 'flex-start',
                                    gap: 2
                                }}>
                                    {Array.isArray(answerData.imageList) && answerData.imageList.map(
                                        (img, index) => (
                                            <img
                                                key={index}
                                                src={img.imageUrl}
                                                alt={`answer-image-${index}`}
                                                width="70%"
                                                style={{marginBottom: '10px'}}
                                            />
                                        )
                                    )}
                                </Box>
                            </Grid>
                        </Grid>
                    </Card>
                )}

                {/* 관리자일 경우 답변하기 버튼 (답변이 없는 경우에만 표시) */}
                {isAdmin && !answerData.answerNo && (
                    <Box sx={{
                        display: 'flex',
                        justifyContent: 'flex-start',
                        mb: 2
                    }}>
                        <Button
                            variant="contained"
                            color="primary"
                            onClick={handleAnswerClick}
                        >
                            답변하기
                        </Button>
                    </Box>
                )}

                {/* 답변 폼 */}
                {showAnswerForm && (
                    <Card sx={{p: 3, mb: 2}}>
                        <Box component="form" onSubmit={handleAddInquiryAnswer}>
                            <Typography variant="body1" paragraph>
                                <strong>답변 내용:</strong>
                            </Typography>
                            <textarea
                                name="answerContent"
                                rows="5"
                                cols="100"
                                placeholder="답변 내용을 입력하세요"
                                style={{width: '100%', marginBottom: '10px'}}
                                value={inquiryAnswer.answerContent}
                                onChange={handleChangeInquiryAnswer}
                            />
                            <input
                                type="file"
                                accept="image/*"
                                multiple
                                onChange={handleFileChange}
                                style={{marginBottom: '10px'}}
                            />
                            <Box sx={{
                                display: 'flex',
                                flexDirection: 'column',
                                gap: 2
                            }}>
                                {previewImages.map((src, index) => (
                                    <Box key={index}
                                         sx={{position: 'relative'}}>
                                        <img
                                            src={src}
                                            alt={`preview-${index}`}
                                            style={{
                                                maxWidth: '150px',
                                                maxHeight: '150px',
                                            }}
                                        />
                                        <IconButton
                                            sx={{
                                                position: 'absolute',
                                                top: 0,
                                                right: 0
                                            }}
                                            onClick={() => handleRemoveImage(
                                                index)}
                                        >
                                            <KeyboardArrowRightIcon/>
                                        </IconButton>
                                    </Box>
                                ))}
                            </Box>
                            <Button variant="contained" color="primary"
                                    type="submit">
                                답변 등록
                            </Button>
                            <Button
                                variant="outlined"
                                color="secondary"
                                sx={{ml: 2}}
                                onClick={() => setShowAnswerForm(false)}
                            >
                                취소
                            </Button>
                        </Box>
                    </Card>
                )}

                {/* 삭제 버튼 */}
                <Box sx={{display: 'flex', justifyContent: 'flex-start'}}>
                    <Button
                        variant="contained"
                        color="error"
                        onClick={() => deleteInquiryByNo(inquiry.inquiryNo)}
                    >
                        삭제
                    </Button>
                </Box>
            </Box>
        </DashboardLayout>
    );
}

export default InquiryDetail;
