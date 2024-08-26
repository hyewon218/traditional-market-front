import * as React from 'react';
import { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider } from '@mui/x-date-pickers';
import ko from 'date-fns/locale/ko';
import Card from '@mui/material/Card';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import KeyboardArrowLeftIcon from '@mui/icons-material/KeyboardArrowLeft';
import TextField from '@mui/material/TextField';
import DashboardLayout from '../../../examples/LayoutContainers/DashboardLayout';

function DailySalesItem() {
  const { state } = useLocation();
  const item = state; // 전달된 item 데이터를 사용

  // 현재 날짜로 초기화
  const [selectedDate, setSelectedDate] = useState(new Date());

  const navigate = useNavigate();

  // 뒤로 가기
  const handleBack = () => {
    navigate('/item-detail-admin', { state: item });
  };

  const handleDateChange = (date) => {
    if (date) {
      console.log('선택된 날짜:', date);

      // 날짜의 시간 부분을 00:00:00으로 설정
      const normalizedDate = new Date(date);
      normalizedDate.setHours(0, 0, 0, 0); // 시간 부분을 00:00:00으로 설정

      setSelectedDate(normalizedDate);
    }
  };

  // 요일을 포함한 날짜 포맷팅 함수
  const formatDateWithDay = (date) => {
    const formatter = new Intl.DateTimeFormat('ko-KR', { weekday: 'long', year: 'numeric', month: '2-digit', day: '2-digit' });
    return formatter.format(date);
  };

  return (
    <DashboardLayout>
      <Box sx={{ p: 3 }}>
        <Box sx={{ mt: 2, display: 'flex', gap: 1 }}>
          <Button
            variant="contained"
            color="error"
            onClick={handleBack} // 뒤로 가기 버튼 클릭 시 동작
            startIcon={<KeyboardArrowLeftIcon />}
          >
            돌아가기
          </Button>
        </Box>

        <Box sx={{ display: 'flex', mt: 2 }}>
          <Box sx={{ width: '50%', p: 2 }}>
            <Card sx={{ p: 2, height: '100%' }}>
              <Typography variant="h6" component="div" gutterBottom>
                날짜 선택
              </Typography>
              <LocalizationProvider dateAdapter={AdapterDateFns} locale={ko}>
                <DatePicker
                  value={selectedDate}
                  onChange={handleDateChange}
                  renderInput={(params) => <TextField {...params} />}
                  sx={{ width: '100%', fontSize: '1.5rem' }} // 스타일 조정
                  disableFuture // 미래 날짜 선택 방지 (선택 사항)
                />
              </LocalizationProvider>
            </Card>
          </Box>

          <Box sx={{ width: '50%', p: 2 }}>
            <Card sx={{ p: 3, height: '100%' }}>
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <Typography variant="h4" component="div" paragraph>
                    {item.itemName}
                  </Typography>
                  {/* 선택된 날짜와 요일 출력 */}
                  {selectedDate && (
                    <Typography variant="h6" component="div" paragraph>
                      선택한 날짜: {formatDateWithDay(selectedDate)}
                    </Typography>
                  )}
                </Grid>
              </Grid>
            </Card>
          </Box>
        </Box>
      </Box>
    </DashboardLayout>
  );
}

export default DailySalesItem;
