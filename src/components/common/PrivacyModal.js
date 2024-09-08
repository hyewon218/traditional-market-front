import { useState } from 'react';

function Modal({ isOpen, onClose, title, content, onCheckboxChange }) {
  if (!isOpen) return null;

  return (
    <div style={styles.modal}>
      <div style={styles.modalContent}>
        <h2 style={styles.title}>{title}</h2>
        <div style={styles.content}>
          <p>{content}</p>
        </div>
        <div style={styles.checkboxContainer}>
          <input
            type="checkbox"
            id="agree-checkbox"
            onChange={onCheckboxChange}
            style={styles.checkbox}
          />
          <label htmlFor="agree-checkbox" style={styles.checkboxLabel}>
            위 사항을 모두 읽었으며 이에 동의합니다.
          </label>
        </div>
      </div>
    </div>
  );
}

function PrivacyModal() {
  const [showPrivacyModal, setShowPrivacyModal] = useState(true);
  const [showTermsModal, setShowTermsModal] = useState(false);

  const handlePrivacyModalClose = (accepted) => {
    if (accepted) {
      setShowPrivacyModal(false);
      setShowTermsModal(true);
    }
  };

  const handleTermsModalClose = (accepted) => {
    if (accepted) {
      setShowTermsModal(false);
    }
  };

  const privacyPolicyContent = `
    제 1 조 (목적)
    본 개인정보 처리방침은 [우리동네 전통시장] (이하 “회사”라 함)에서 운영하는 웹사이트(이하 “사이트”라 함)에서 회원 가입 및 상품 주문 시 수집하는 개인정보의 처리 방법과 그 목적을 설명합니다.

    제 2 조 (수집하는 개인정보)
    회사는 다음과 같은 개인정보를 수집합니다:
    1.	회원가입 시:
    -	이메일 주소

    2.	상품 주문 시:
    -	이름
    -	휴대전화번호
    -	주소

    제 3 조 (개인정보의 이용 목적)
    회사는 수집한 개인정보를 다음의 목적을 위해 사용합니다:
    1.	회원가입 및 서비스 제공:
    -	회원가입 및 관리
    -	서비스 이용에 관한 공지사항 전달

    2.	상품 주문 처리:
    -	상품 주문 및 배송
    -	주문 관련 문의 대응

    제 4 조 (개인정보의 보유 및 이용 기간)
    회사는 개인정보를 수집 및 이용 목적이 달성된 후에는 관련 법령에 따라 개인정보를 안전하게 파기합니다. 회원가입 시 수집한 개인정보는 회원 탈퇴 시까지 보유하며, 회원 탈퇴 후에는 30일 간 보관 후 자동 파기됩니다. 상품 주문 시 수집한 개인정보는 주문 완료 후 5년간 보관 후 파기합니다.

    제 5 조 (개인정보의 제3자 제공)
    회사는 원칙적으로 수집된 개인정보를 외부에 제공하지 않습니다. 다만, 다음의 경우에는 개인정보를 제공할 수 있습니다:
    1.	고객님이 사전에 동의한 경우
    2.	법령의 규정에 의거하거나 수사기관의 요구가 있는 경우

    제 6 조 (개인정보의 안전성 확보 조치)
    회사는 개인정보의 안전성을 확보하기 위해 다음과 같은 조치를 취합니다:
    1.	개인정보를 안전하게 저장하고 처리하기 위한 기술적 조치
    2.	접근 권한 제한 및 관리

    제 7 조 (이용자의 권리와 행사 방법)
    이용자는 다음의 권리를 행사할 수 있습니다:
    1.	개인정보의 열람, 정정, 삭제 요구
    2.	개인정보 처리 정지 요구
    3.	권리 행사는 문의하기를 통해 가능합니다.

    제 8 조 (개인정보 처리방침의 변경)
    회사는 개인정보 처리방침을 변경할 수 있으며, 변경된 사항은 사이트를 통해 공지합니다. 이용자는 변경된 개인정보 처리방침을 확인할 책임이 있습니다.

    제 9 조 (문의처)
    개인정보 처리와 관련된 문의는 다음의 연락처로 하시기 바랍니다:
    -	이메일: [songwc3@gmail.com]

    시행일: [2024년 9월 10일]
  `;

  const termsOfServiceContent = `
    제 1 조 (목적)
    본 약관은 [우리동네 전통시장] (이하 “회사”라 함)에서 제공하는 웹사이트 서비스(이하 “서비스”라 함)의 이용에 관한 제반 사항을 규정합니다.

    제 2 조 (약관의 효력 및 변경)
    1.	회사는 본 약관을 서비스 초기 화면에 게시하여 고객이 알 수 있도록 합니다.
    2.	회사는 본 약관을 변경할 수 있으며, 변경된 약관은 서비스 초기 화면에 게시하여 고객에게 공지합니다.

    제 3 조 (회원 가입 및 계약의 체결)
    1.	서비스 이용자는 회사가 정한 절차에 따라 회원 가입을 신청하여야 하며, 회사는 신청자의 가입을 승인함으로써 계약이 체결됩니다.
    2.	회사는 다음의 사유가 있을 경우 회원 가입을 거부할 수 있습니다:
    -	신청자가 본 약관에 위배되는 경우
    -	허위 정보를 제공한 경우
    -	기타 회사의 정책에 적합하지 않은 경우

    제 4 조 (서비스의 제공)
    1.	회사는 사이트를 통해 다음의 서비스를 제공합니다:
    -	상품의 가격 정보를 게시
    -	사용자 문의 및 상담 서비스 제공
    2.	서비스의 내용 및 운영 방식은 회사의 정책에 따라 변경될 수 있으며, 고객에게 사전 공지 후 변경됩니다.

    제 5 조 (이용자의 의무)
    1.	이용자는 서비스 이용 시 다음의 사항을 준수해야 합니다:
    -	관련 법령 및 본 약관을 준수할 것
    -	타인의 권리를 침해하지 않을 것
    -	욕설이나 저급한 단어를 사용하지 않을 것
    2.	이용자는 본인의 계정 정보를 안전하게 관리해야 하며, 부정 사용에 대한 책임을 집니다.

    제 6 조 (서비스 이용 제한 및 정지)
    1.	회사는 다음의 사유가 발생할 경우 사전 통지 없이 서비스 이용을 제한하거나 중지할 수 있습니다:
    -	본 약관을 위반한 경우
    -	욕설 등 저급한 단어를 사용하는 경우
    -	기타 서비스 제공에 적합하지 않은 경우
    2.	서비스 이용이 제한되거나 중지된 경우, 회사는 사전 통지 없이 조치를 취할 수 있습니다.

    제 7 조 (지적 재산권)
    1.	회사가 제공하는 서비스 및 관련 콘텐츠에 대한 지적 재산권은 회사에 귀속됩니다.
    2.	이용자는 콘텐츠를 무단으로 복제, 배포, 전송, 출판, 전시 등의 행위를 할 수 없습니다.

    제 8 조 (면책 조항)
    1.	회사는 다음의 사유로 인해 발생한 손해에 대해 책임을 지지 않습니다:
    -	이용자의 과실로 인해 발생한 손해
    -	천재지변, 전쟁, 폭동 등의 불가항력적인 사유로 인한 손해
    -	서비스의 운영 중 발생하는 기술적 문제
    2.	회사는 서비스의 중단, 지연 등으로 인한 손해에 대해서도 책임을 지지 않습니다.

    제 9 조 (분쟁 해결)
    1.	본 약관에 관한 분쟁은 회사의 본사 소재지 법원을 제1심 법원으로 합니다.
    2.	회사와 고객 간의 분쟁은 우선적으로 협의하여 해결하도록 하며, 협의가 되지 않을 경우 법적 절차를 따릅니다.

    제 10 조 (기타)
    1.	본 약관에 명시되지 않은 사항은 관련 법령 및 회사의 정책에 따릅니다.
    2.	회사는 필요에 따라 본 약관 외에 별도의 이용 약관이나 정책을 정할 수 있으며, 이 경우 고객에게 별도로 안내합니다.

    시행일: [2024년 9월 10일]
  `;

  return (
    <>
      <Modal
        isOpen={showPrivacyModal}
        onClose={handlePrivacyModalClose}
        title="개인정보 처리방침"
        content={privacyPolicyContent}
        onCheckboxChange={(e) => handlePrivacyModalClose(e.target.checked)}
      />
      <Modal
        isOpen={showTermsModal}
        onClose={handleTermsModalClose}
        title="이용약관"
        content={termsOfServiceContent}
        onCheckboxChange={(e) => handleTermsModalClose(e.target.checked)}
      />
    </>
  );
}

const styles = {
  modal: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'fixed',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    backgroundColor: 'rgba(0, 0, 0, 0.6)', // Slightly darker background for better contrast
    zIndex: 9999,
  },
  modalContent: {
    backgroundColor: '#fff',
    borderRadius: '10px', // Increased border radius for a softer look
    padding: '30px', // Increased padding for more space
    maxWidth: '800px', // Increased width for better readability
    width: '90%',
    textAlign: 'left', // Align text to the left for readability
    position: 'relative',
    maxHeight: '90%', // Increased max height for better visibility
    overflowY: 'auto',
  },
  closeButton: {
    position: 'absolute',
    top: '15px',
    right: '15px',
    fontSize: '30px',
    cursor: 'pointer',
    color: '#333', // Darker color for better contrast
    transition: 'color 0.3s',
  },
  title: {
    fontSize: '24px', // Increased font size for the title
    marginBottom: '20px',
    color: '#333',
  },
  content: {
    marginBottom: '20px',
    lineHeight: '1.6', // Increased line height for better readability
    fontSize: '16px', // Increased font size for better readability
    color: '#555', // Slightly lighter color for better contrast
    whiteSpace: 'pre-line',
  },
  checkboxContainer: {
    marginTop: '20px',
    display: 'flex',
    alignItems: 'center',
  },
  checkbox: {
    marginRight: '10px',
  },
  checkboxLabel: {
    cursor: 'pointer',
    fontSize: '14px',
    color: '#333',
  },
};

export default PrivacyModal;
