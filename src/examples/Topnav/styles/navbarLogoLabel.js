// 파일명: navbarLogoLabel.js

// Material Dashboard 2 React - v2.1.0
export default function navbarLogoLabel(theme) {
  const { functions, transitions, typography, breakpoints } = theme;
  const { pxToRem } = functions;
  const { fontWeightMedium } = typography;

  return {
    ml: 0.5,
    fontWeight: fontWeightMedium,
    wordSpacing: pxToRem(-1),
    transition: transitions.create('opacity', {
      easing: transitions.easing.easeInOut,
      duration: transitions.duration.standard,
    }),

    [breakpoints.up('xl')]: {
      opacity: 1, // 사이드바와 무관하게 항상 보이도록 설정
    },
  };
}
