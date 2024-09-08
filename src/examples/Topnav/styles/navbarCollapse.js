//function navbarItem(theme, ownerState) {
//  const { palette, transitions, breakpoints, boxShadows, borders, functions } = theme;
//  const { active, transparentSidenav, whiteSidenav, darkMode, sidenavColor } = ownerState;
//
//  const { white, transparent, dark, grey, gradients } = palette;
//  const { md } = boxShadows;
//  const { borderRadius } = borders;
//  const { pxToRem, rgba, linearGradient } = functions;
//
//  return {
//    background: active
//      ? linearGradient(gradients[sidenavColor].main, gradients[sidenavColor].state)
//      : transparent.main,
//    color:
//      (transparentSidenav && !darkMode && !active) || (whiteSidenav && !active)
//        ? dark.main
//        : white.main,
//    display: 'flex',
//    alignItems: 'center',
//    width: '100%',
//    padding: `${pxToRem(20)} ${pxToRem(10)}`,
//    margin: `${pxToRem(1.5)} ${pxToRem(16)}`,
//    borderRadius: borderRadius.md,
//    cursor: 'pointer',
//    userSelect: 'none',
//    whiteSpace: 'nowrap',
//    boxShadow: active && !whiteSidenav && !darkMode && !transparentSidenav ? md : 'none',
//    [breakpoints.up('xl')]: {
//      transition: transitions.create(['box-shadow', 'background-color'], {
//        easing: transitions.easing.easeInOut,
//        duration: transitions.duration.shorter,
//      }),
//    },
//
//    '&:hover, &:focus': {
//      backgroundColor: () => {
//        let backgroundValue;
//
//        if (!active) {
//          backgroundValue =
//            transparentSidenav && !darkMode
//              ? grey[300]
//              : rgba(whiteSidenav ? grey[400] : white.main, 0.2);
//        }
//
//        return backgroundValue;
//      },
//    },
//  };
//}
//
//function navbarIconBox(theme, ownerState) {
//  const { palette, transitions, borders, functions } = theme;
//  const { transparentSidenav, whiteSidenav, darkMode, active } = ownerState;
//
//  const { white, dark } = palette;
//  const { borderRadius } = borders;
//  const { pxToRem } = functions;
//
//  return {
//    minWidth: pxToRem(32),
//    minHeight: pxToRem(32),
//    color:
//      (transparentSidenav && !darkMode && !active) || (whiteSidenav && !active)
//        ? dark.main
//        : white.main,
//    borderRadius: borderRadius.md,
//    display: 'grid',
//    placeItems: 'center',
//    transition: transitions.create('margin', {
//      easing: transitions.easing.easeInOut,
//      duration: transitions.duration.standard,
//    }),
//
//    '& svg, svg g': {
//      color: transparentSidenav || whiteSidenav ? dark.main : white.main,
//    },
//  };
//}
//
//function navbarText(theme, ownerState) {
//  const { typography, transitions, breakpoints, functions } = theme;
//  const { miniSidenav, transparentSidenav, active } = ownerState;
//
//  const { size, fontWeightRegular, fontWeightLight } = typography;
//  const { pxToRem } = functions;
//
//  return {
//    marginLeft: pxToRem(10),
//
//    [breakpoints.up('xl')]: {
//      opacity: miniSidenav || (miniSidenav && transparentSidenav) ? 0 : 1,
//      maxWidth: miniSidenav || (miniSidenav && transparentSidenav) ? 0 : '100%',
//      marginLeft: miniSidenav || (miniSidenav && transparentSidenav) ? 0 : pxToRem(10),
//      transition: transitions.create(['opacity', 'margin'], {
//        easing: transitions.easing.easeInOut,
//        duration: transitions.duration.standard,
//      }),
//    },
//
//    '& span': {
//      fontWeight: active ? fontWeightRegular : fontWeightLight,
//      fontSize: pxToRem(18),
//      fontFamily: 'JalnanGothic',
//      lineHeight: 0,
//      textAlign: 'left',
//    },
//  };
//}
//
//export { navbarItem, navbarIconBox, navbarText };





// 상단바, 하단바 스타일 설정
function navbarItem(theme, ownerState) {
  const { palette, transitions, breakpoints, boxShadows, borders, functions } = theme;
  const { active, transparentSidenav, whiteSidenav, darkMode, sidenavColor } = ownerState;

  const { white, transparent, dark, grey, gradients } = palette;
  const { md } = boxShadows;
  const { borderRadius } = borders;
  const { pxToRem, rgba, linearGradient } = functions;

  return {
    background: active
      ? '#000000' // 선택된 항목의 배경색을 검정색으로 설정
      : '#333333', // 선택되지 않은 항목의 배경색을 짙은 회색으로 설정
    color:
      active
        ? '#FFFFFF' // 선택된 항목의 텍스트 색상을 흰색으로 설정
        : '#CCCCCC', // 선택되지 않은 항목의 텍스트 색상을 연한 회색으로 설정
    display: 'flex',
    alignItems: 'center',
    width: '100%',
    padding: `${pxToRem(20)} ${pxToRem(10)}`,
    margin: `${pxToRem(1.5)} ${pxToRem(16)}`,
    borderRadius: borderRadius.md,
    cursor: 'pointer',
    userSelect: 'none',
    whiteSpace: 'nowrap',
    boxShadow: active && !whiteSidenav && !darkMode && !transparentSidenav ? md : 'none',
    [breakpoints.up('xl')]: {
      transition: transitions.create(['box-shadow', 'background-color'], {
        easing: transitions.easing.easeInOut,
        duration: transitions.duration.shorter,
      }),
    },

    '&:hover, &:focus': {
      backgroundColor: () => {
        let backgroundValue;

        if (!active) {
          backgroundValue =
            transparentSidenav && !darkMode
              ? '#444444' // 비활성 항목의 배경색을 중간 회색으로 설정
              : '#555555'; // 비활성 항목의 배경색을 중간 회색으로 설정
        }

        return backgroundValue;
      },
    },
  };
}

function navbarIconBox(theme, ownerState) {
  const { palette, transitions, borders, functions } = theme;
  const { transparentSidenav, whiteSidenav, darkMode, active } = ownerState;

  const { white, dark } = palette;
  const { borderRadius } = borders;
  const { pxToRem } = functions;

  return {
    minWidth: pxToRem(32),
    minHeight: pxToRem(32),
    color:
      active
        ? '#FFFFFF' // 선택된 항목의 아이콘 색상을 흰색으로 설정
        : '#CCCCCC', // 비활성 항목의 아이콘 색상을 연한 회색으로 설정
    borderRadius: borderRadius.md,
    display: 'grid',
    placeItems: 'center',
    transition: transitions.create('margin', {
      easing: transitions.easing.easeInOut,
      duration: transitions.duration.standard,
    }),

    '& svg, svg g': {
      color: active ? '#FFFFFF' : '#CCCCCC', // 아이콘 색상 설정
    },
  };
}

function navbarText(theme, ownerState) {
  const { typography, transitions, breakpoints, functions } = theme;
  const { miniSidenav, transparentSidenav, active } = ownerState;

  const { size, fontWeightRegular, fontWeightLight } = typography;
  const { pxToRem } = functions;

  return {
    marginLeft: pxToRem(10),

    [breakpoints.up('xl')]: {
      opacity: miniSidenav || (miniSidenav && transparentSidenav) ? 0 : 1,
      maxWidth: miniSidenav || (miniSidenav && transparentSidenav) ? 0 : '100%',
      marginLeft: miniSidenav || (miniSidenav && transparentSidenav) ? 0 : pxToRem(10),
      transition: transitions.create(['opacity', 'margin'], {
        easing: transitions.easing.easeInOut,
        duration: transitions.duration.standard,
      }),
    },

    '& span': {
      fontWeight: active ? 'bold' : 'normal', // 선택된 항목의 텍스트를 굵게
      fontSize: pxToRem(18),
      fontFamily: 'JalnanGothic',
      lineHeight: 0,
      textAlign: 'left',
      color: active ? '#FFFFFF' : '#CCCCCC', // 텍스트 색상 설정
    },
  };
}

// 하단바 스타일 설정
function footerStyle(theme) {
  const { palette, borders, functions } = theme;
  const { grey } = palette;
  const { borderRadius } = borders;
  const { pxToRem } = functions;

  return {
    backgroundColor: '#333333', // 하단바의 배경색을 짙은 회색으로 설정
    color: '#FFFFFF', // 하단바 텍스트 색상을 흰색으로 설정
    display: 'flex',
    justifyContent: 'space-around',
    alignItems: 'center',
    width: '100%',
    padding: `${pxToRem(10)} ${pxToRem(20)}`,
    borderRadius: borderRadius.md,
    position: 'fixed',
    bottom: 0,
    left: 0,
    boxShadow: '0 -2px 4px rgba(0, 0, 0, 0.2)',
  };
}

export { navbarItem, navbarIconBox, navbarText, footerStyle };
