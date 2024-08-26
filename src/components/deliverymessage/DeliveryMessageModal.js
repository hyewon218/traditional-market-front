// OrderComponent에 data 전달
import React, { useEffect, useState } from 'react';
import { Modal, Typography, TextareaAutosize, Button, Box } from '@mui/material';
import { postDeliveryMessage, getDeliveryMessage, deleteDeliveryMessage } from "../../api/deliveryMessageApi";

// 배송메시지 모달, 주문 페이지에서 사용
const DeliveryMessageModal = ({ open, onClose, onSelectMessage }) => {
  const [openModal, setOpenModal] = useState(false);
  const [openManageModal, setOpenManageModal] = useState(false);
  const [deliveryMessage, setDeliveryMessage] = useState('');
  const [showTextarea, setShowTextarea] = useState(false);
  const [buttonText, setButtonText] = useState('배송메시지를 선택해주세요');
  const [selectedOption, setSelectedOption] = useState(null);
  const [messageOptions, setMessageOptions] = useState([]); // 배송 메시지 목록 상태

  // 기본 배송 메시지 항목
  const defaultMessages = [
    { no: 'none', content: '선택안함' },
    { no: 'custom', content: '직접 입력하기' },
    { no: 'door', content: '문 앞에 놓아주세요' },
    { no: 'contact', content: '부재 시 연락 부탁드려요' },
    { no: 'call', content: '배송 전 미리 연락해주세요' }
  ];

  useEffect(() => {
    if (openModal || openManageModal) {
      fetchDeliveryMessages();
    }
  }, [openModal, openManageModal]);

  const fetchDeliveryMessages = async () => {
    try {
      const response = await getDeliveryMessage(); // 배송 메시지 조회 API 호출
      console.log('배송메시지 조회 :', response);
      setMessageOptions(response); // 응답 데이터를 상태에 저장
    } catch (error) {
      console.error('API 호출 오류:', error);
      alert('배송 메시지를 가져오는 중 오류가 발생했습니다.');
    }
  };

  const handleOpenModal = () => setOpenModal(true);
  const handleCloseModal = () => setOpenModal(false);

  const handleOpenManageModal = () => {
    setOpenManageModal(true);
    handleCloseModal();
  };

  const handleCloseManageModal = () => {
    setOpenManageModal(false);
    handleOpenModal();
  };

  const handleDeliveryMessageSelect = (value) => {
    if (value === '직접 입력하기') {
      setShowTextarea(true);
      setButtonText('직접 입력하기');
      setDeliveryMessage('');
    } else if (value === '') {
      setButtonText('배송메시지를 선택해주세요');
      setShowTextarea(false);
      setDeliveryMessage('');
    } else {
      setButtonText(value);
      setShowTextarea(false);
      setDeliveryMessage(value);
    }
    setSelectedOption(value);
    console.log('selectedOption : ', value);
    onSelectMessage(value); // 선택된 메시지를 부모에게 전달
    handleCloseModal();
  };

  const handleSaveDeliveryMessage = () => {
    if (deliveryMessage.trim() === '') {
      alert('메시지를 입력해주세요');
      return;
    }

    postDeliveryMessage(deliveryMessage)
      .then(() => {
        alert('배송 메시지가 저장되었습니다.');
        handleCloseModal();
      })
      .catch((error) => {
        alert('저장 중 오류가 발생했습니다.');
        console.error('배송 메시지 저장 오류:', error);
      });
  };

  const handleDeleteMessage = async (messageNo) => {
    try {
      await deleteDeliveryMessage(messageNo); // 배송 메시지 삭제 API 호출
      alert('배송 메시지가 삭제되었습니다.');
      handleCloseManageModal();
    } catch (error) {
      alert('삭제 중 오류가 발생했습니다.');
      console.error('배송 메시지 삭제 오류:', error);
    }
  };

  return (
    <div style={{ padding: '5px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      <button
        onClick={handleOpenModal}
        style={{
          padding: '10px 20px',
          fontSize: '16px',
          backgroundColor: '#003366',
          color: '#ffffff', // 버튼 글씨 색상
          border: 'none',
          borderRadius: '5px',
          cursor: 'pointer',
          outline: 'none',
          fontFamily: 'JalnanGothic',
          width: '100%', // 버튼 너비를 100%로 설정
/*          maxWidth: '300px', // 버튼의 최대 너비를 설정 (필요에 따라 조정)*/
          marginBottom: '10px', // 모달 아래에 요소를 배치할 공간 확보
        }}
      >
        {buttonText}
      </button>
      {showTextarea && (
        <div style={{ width: '100%', maxWidth: '400px', marginTop: '10px' }}>
          <TextareaAutosize
            minRows={2}
            placeholder="메시지를 입력해주세요."
            value={deliveryMessage}
            onChange={(e) => setDeliveryMessage(e.target.value)}
            style={{ width: '100%', padding: '10px' }}
          />
          <Button
            onClick={handleSaveDeliveryMessage}
            variant="contained"
            color="success" // 'success' 색상은 기본적으로 연두색으로 설정됨
            sx={{
              backgroundColor: '#003366', // 고급스러운 파란색
              color: '#ffffff',
              fontFamily: 'JalnanGothic',
              width: '100%', // 버튼이 textarea와 같은 너비를 가지게 함
              height: '40px',
              fontSize: '0.875rem',
              marginTop: '10px', // 버튼과 textarea 사이에 간격 추가
            }}
          >
            저장
          </Button>
        </div>
      )}
      <Modal
        open={openModal}
        onClose={handleCloseModal}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
        sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }} // 중앙 정렬
      >
        <Box
          sx={{
            width: 400,
            bgcolor: 'background.paper',
            borderRadius: '10px',
            boxShadow: 24,
            p: 4,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            position: 'relative',
          }}
        >
          {/* 닫기 버튼 추가 */}
          <Button
            onClick={handleCloseModal}
            sx={{
              position: 'absolute',
              top: '10px',
              right: '10px',
              color: 'black',
              fontFamily: 'JalnanGothic',
            }}
          >
            X
          </Button>
          <Button
            onClick={handleOpenManageModal}
            sx={{
              position: 'absolute',
              top: '10px',
              left: '10px',
              backgroundColor: '#f44336', // 빨간색 배경
              color: '#ffffff',
              fontFamily: 'JalnanGothic',
              '&:hover': {
                backgroundColor: '#d32f2f' // 어두운 빨간색 배경 (hover 시)
              }
            }}
          >
            관리
          </Button>
          <Typography id="modal-modal-title" variant="h6" component="h2" sx={{ textAlign: 'center' }}>
            배송 메시지 선택
          </Typography>
          <Box sx={{ mt: 2, display: 'flex', flexDirection: 'column', width: '100%' }}>
            {defaultMessages.map(option => (
              <Button
                key={option.no} // unique key를 사용하여 객체를 렌더링
                onClick={() => handleDeliveryMessageSelect(option.content)} // 'content' 속성을 사용하여 메시지 선택
                variant="contained"
                sx={{
                  mb: 1,
                  backgroundColor: selectedOption === option.content ? '#002244' : '#003366', // 선택된 옵션일 때 색상 변경
                  color: '#ffffff',
                  fontFamily: 'JalnanGothic',
                  width: '100%', // 버튼 너비를 100%로 설정
                  position: 'relative',
                }}
              >
                {option.content}
                {messageOptions.some(o => o.content === option.content) && (
                  <Typography
                    variant="caption"
                    sx={{
                      position: 'absolute',
                      right: '10px',
                      top: '50%',
                      transform: 'translateY(-50%)',
                      backgroundColor: '#ffeb3b', // 저장된 메시지 배경색 (노란색)
                      color: '#000000', // 저장된 메시지 글자색 (검정색)
                      padding: '2px 4px',
                      borderRadius: '4px',
                    }}
                  >
                    저장됨
                  </Typography>
                )}
              </Button>
            ))}
            {messageOptions.length === 0 ? (
              <Typography>배송 메시지가 없습니다.</Typography>
            ) : (
              messageOptions.map(option => (
                <Button
                  key={option.no} // unique key를 사용하여 객체를 렌더링
                  onClick={() => handleDeliveryMessageSelect(option.content)} // 'content' 속성을 사용하여 메시지 선택
                  variant="contained"
                  sx={{
                    mb: 1,
                    backgroundColor: selectedOption === option.content ? '#002244' : '#003366', // 선택된 옵션일 때 색상 변경
                    color: '#ffffff',
                    fontFamily: 'JalnanGothic',
                    width: '100%', // 버튼 너비를 100%로 설정
                    position: 'relative',
                  }}
                >
                  {option.content}
                  {messageOptions.some(o => o.content === option.content) && (
                    <Typography
                      variant="caption"
                      sx={{
                        position: 'absolute',
                        right: '10px',
                        top: '50%',
                        transform: 'translateY(-50%)',
                        backgroundColor: '#ffeb3b', // 저장된 메시지 배경색 (노란색)
                        color: '#000000', // 저장된 메시지 글자색 (검정색)
                        padding: '2px 4px',
                        borderRadius: '4px',
                      }}
                    >
                      저장됨
                    </Typography>
                  )}
                </Button>
              ))
            )}
          </Box>
        </Box>
      </Modal>

      {/* 관리 모달 */}
      <Modal
        open={openManageModal}
        onClose={handleCloseManageModal}
        aria-labelledby="manage-modal-title"
        aria-describedby="manage-modal-description"
        sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }} // 중앙 정렬
      >
        <Box
          sx={{
            width: 400,
            bgcolor: 'background.paper',
            borderRadius: '10px',
            boxShadow: 24,
            p: 4,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}
        >
          <Typography id="manage-modal-title" variant="h6" component="h2" sx={{ textAlign: 'center' }}>
            저장된 배송 메시지 관리
          </Typography>
          <Box sx={{ mt: 2, display: 'flex', flexDirection: 'column', width: '100%' }}>
            {messageOptions.length === 0 ? (
              <Typography>저장된 메시지가 없습니다.</Typography>
            ) : (
              messageOptions.map(option => (
                <Box key={option.no} sx={{ mb: 1, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <Typography>{option.content}</Typography>
                  <Button
                    onClick={() => handleDeleteMessage(option.no)}
                    variant="contained"
                    sx={{
                      backgroundColor: '#f44336', // 빨간색 배경
                      color: '#ffffff',
                      fontFamily: 'JalnanGothic',
                      width: '100px', // 버튼 너비를 150px로 설정
                      height: '40px',
                      '&:hover': {
                        backgroundColor: '#d32f2f' // 어두운 빨간색 배경 (hover 시)
                      }
                    }}
                  >
                    삭제
                  </Button>
                </Box>
              ))
            )}
          </Box>
        </Box>
      </Modal>
    </div>
  );
};

export default DeliveryMessageModal;

