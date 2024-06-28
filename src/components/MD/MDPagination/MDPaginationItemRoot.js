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

// @mui material components
import { styled } from '@mui/material/styles';

// Material Dashboard 2 React components
import MDButton from '../MDButton';

export default styled(MDButton)(({ theme, ownerState }) => {
  const { borders={}, functions={}, typography={}, palette } = theme;
  const { variant, paginationSize, active } = ownerState;

  const { borderColor } = borders;
  const { pxToRem = (size) => `${size / 16}rem` } = functions; // 기본 pxToRem 함수 설정
  const { fontWeightRegular = 400, size: fontSize = { sm: pxToRem(14) } } = typography; // 기본 size 객체 설정
  const { light = { main: '#f0f0f0' } } = palette; // 기본 light 객체와 main 속성 설정

  // width, height, minWidth and minHeight values
  let sizeValue = pxToRem(36);

  if (paginationSize === 'small') {
    sizeValue = pxToRem(30);
  } else if (paginationSize === 'large') {
    sizeValue = pxToRem(46);
  }

  return {
    borderColor,
    margin: `0 ${pxToRem(2)}`,
    pointerEvents: active ? 'none' : 'auto',
    fontWeight: fontWeightRegular,
    fontSize: fontSize.sm, // 기본 fontSize.sm 설정
    width: sizeValue,
    minWidth: sizeValue,
    height: sizeValue,
    minHeight: sizeValue,

    '&:hover, &:focus, &:active': {
      transform: 'none',
      boxShadow: (variant !== 'gradient' || variant !== 'contained') && 'none !important',
      opacity: '1 !important',
    },

    '&:hover': {
      backgroundColor: light.main,
      borderColor,
    },
  };
});
