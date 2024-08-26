//// src/components/ProfanityFilter.js
//import React, { useState } from 'react';
//
//const PROFANITY_LIST = [
//  '비속어',
//
//  // 추가 비속어를 여기에 추가
//];
//
//function containsProfanity(text) {
//  const regex = new RegExp(PROFANITY_LIST.join('|'), 'i');
//  return regex.test(text);
//}
//
//function ProfanityFilter({ value, onChange, placeholder }) {
//  const [hasProfanity, setHasProfanity] = useState(false);
//
//  const handleChange = (event) => {
//    const { value } = event.target;
//    if (containsProfanity(value)) {
//      setHasProfanity(true);
//    } else {
//      setHasProfanity(false);
//    }
//    onChange(event);
//  };
//
//  return (
//    <div style={styles.container}>
//      <input
//        type="text"
//        value={value}
//        onChange={handleChange}
//        placeholder={placeholder}
//        style={styles.input}
//      />
//      {hasProfanity && (
//        <p style={styles.warning}>비속어가 포함되어 있습니다. 다른 단어를 사용해 주세요.</p>
//      )}
//    </div>
//  );
//}
//
//const styles = {
//  container: {
//    position: 'relative',
//    width: '100%',
//  },
//  input: {
//    width: '100%',
//    padding: '10px',
//    fontSize: '16px',
//    borderRadius: '5px',
//    border: '1px solid #ccc',
//  },
//  warning: {
//    color: '#D8000C', // 강렬한 빨간색
//    fontSize: '18px', // 큰 폰트 크기
//    fontWeight: 'bold', // 볼드체
//    backgroundColor: '#FFD2D2', // 연한 빨간색 배경
//    border: '1px solid #D8000C', // 빨간색 테두리
//    padding: '10px', // 충분한 패딩
//    borderRadius: '5px', // 테두리 둥글게
//    marginTop: '8px', // 위쪽 여백
//    textAlign: 'center', // 가운데 정렬
//  },
//};
//
//export default ProfanityFilter;




import React, { useState } from 'react';
import MDBox from '../../components/MD/MDBox';
import MDTypography from '../../components/MD/MDTypography';
import MDInput from '../../components/MD/MDInput';

const PROFANITY_LIST = [
  '비속어',
  // 추가 비속어를 여기에 추가
];

function containsProfanity(text) {
  const regex = new RegExp(PROFANITY_LIST.join('|'), 'i');
  return regex.test(text);
}

function ProfanityFilterMDInput({ name, label, value, onChange, placeholder, multiline, rows }) {
  const [hasProfanity, setHasProfanity] = useState(false);

  const handleChange = (event) => {
    const { value } = event.target;
    if (containsProfanity(value)) {
      setHasProfanity(true);
    } else {
      setHasProfanity(false);
    }
    onChange(event);
  };

  return (
    <div style={styles.container}>
      <MDInput
        name={name}
        label={label}
        value={value}
        onChange={handleChange}
        placeholder={placeholder}
        fullWidth
        multiline={multiline}
        rows={rows}
        error={hasProfanity}
      />
      {hasProfanity && (
        <p style={styles.warning}>비속어가 포함되어 있습니다. 다른 단어를 사용해 주세요.</p>
      )}
    </div>
  );
}

const styles = {
  container: {
    position: 'relative',
    width: '100%',
  },
  warning: {
    color: '#D8000C', // 강렬한 빨간색
    fontSize: '18px', // 큰 폰트 크기
    fontWeight: 'bold', // 볼드체
    backgroundColor: '#FFD2D2', // 연한 빨간색 배경
    border: '1px solid #D8000C', // 빨간색 테두리
    padding: '10px', // 충분한 패딩
    borderRadius: '5px', // 테두리 둥글게
    marginTop: '8px', // 위쪽 여백
    textAlign: 'center', // 가운데 정렬
  },
};

export default ProfanityFilterMDInput;
