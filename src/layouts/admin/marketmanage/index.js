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
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import DashboardLayout from '../../../examples/LayoutContainers/DashboardLayout';

import Button from '@mui/material/Button';

// 페이지 및 요소 스타일
const styles = {
  container: {
    padding: '20px',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  button: {
    margin: '5px',
    padding: '10px 20px',
    fontSize: '16px',
  },
  table: {
    width: '100%',
    borderCollapse: 'collapse',
    margin: '20px 0',
  },
  th: {
    borderBottom: '2px solid #ddd',
    padding: '10px',
    textAlign: 'left',
  },
  td: {
    borderBottom: '1px solid #ddd',
    padding: '10px',
  },
  active: {
    backgroundColor: 'blue',
    color: 'white',
  },
  pagination: {
    display: 'flex',
    justifyContent: 'center',
    marginTop: '20px',
  },
  modal: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'fixed',
    top: '0',
    left: '0',
    width: '100%',
    height: '100%',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalContent: {
    backgroundColor: 'white',
    padding: '20px',
    borderRadius: '8px',
    textAlign: 'center',
    width: '300px',
  },
  errorMessage: {
    color: 'red',
    marginTop: '10px',
  },
};

function MarketManage() {
  const [currentPage, setCurrentPage] = useState(0);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [sortBy, setSortBy] = useState("marketName,asc");
  const [markets, setMarkets] = useState([]);
  const [totalPages, setTotalPages] = useState(0);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [marketToDelete, setMarketToDelete] = useState(null);
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [selectedMarketName, setSelectedMarketName] = useState("");

  const navigate = useNavigate();

  const categories = ["서울", "인천", "경기도", "강원", "충청도", "경상도", "전라도", "제주도"];

  useEffect(() => {
    loadMarketList(currentPage, searchQuery, selectedCategory);
  }, [currentPage, searchQuery, selectedCategory, sortBy]);

  const loadMarketList = async (page, keyword, category) => {
    try {
      let url;
      const params = new URLSearchParams();

      if (keyword) {
        url = "/api/markets/search";
        params.append("keyword", keyword);
      } else if (category) {
        url = "/api/markets/category";
        params.append("category", category);
      } else {
        url = "/api/markets";
      }

      params.append("page", page);
      params.append("size", 10);
      params.append("sort", sortBy);

      const response = await axios.get(`${url}?${params.toString()}`);
      setMarkets(response.data.content);
      setTotalPages(response.data.totalPages);
    } catch (error) {
      console.error("시장 목록을 가져오는 데 실패했습니다.", error);
    }
  };

  const deleteMarket = async (marketNo) => {
    try {
      if (password.trim() === "") {
        setErrorMessage("비밀번호를 입력하세요.");
        return;
      }

      console.log("입력된 비밀번호:", password); // 비밀번호를 콘솔에 로그로 찍음

      // FormData 객체를 생성
      const formData = new FormData();
      formData.append('password', password);

      // FormData를 사용하여 POST 요청
      const verifyResponse = await axios.post('/api/members/myinfo/check', formData);
      console.log("verifyResponse :", verifyResponse);
      if (verifyResponse.data) {
        console.log("verifyResponse.data :", verifyResponse.data);
        if (window.confirm("정말 이 시장을 삭제하시겠습니까?")) {
          const response = await axios.delete(`/api/markets/${marketNo}`);
          alert(response.data.message);
          handleCloseModal();
          loadMarketList(currentPage, searchQuery, selectedCategory);
        }
      } else {
        setErrorMessage("비밀번호가 일치하지 않습니다.");
      }
    } catch (error) {
      console.error('삭제 실패:', error);
      setErrorMessage("삭제에 실패했습니다.");
    }
  };

  const handleCloseModal = () => {
    setShowPasswordModal(false);
    setPassword('');
    setErrorMessage('');
  };

  const handleDeleteWithPassword = (market) => {
    setPassword('');
    setMarketToDelete(market.marketNo);
    setSelectedMarketName(market.marketName);
    setShowPasswordModal(true);
  };

  const handleSearch = () => {
    setCurrentPage(0);
    setSearchQuery(document.getElementById('searchInput').value);
  };

  const handleSearchKeyDown = (e) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  const handleCategoryClick = (category) => {
    setSelectedCategory(category);
    setSearchQuery('');
    setCurrentPage(0);
    setSortBy('marketName,asc');
  };

  const handleViewCountClick = () => {
    setSortBy('viewCount,desc');
    setCurrentPage(0);
  };

  const handleTotalSalesPriceClick = () => {
      setSortBy('totalSalesPrice,desc');
      setCurrentPage(0);
    };

  const handlePageClick = (page) => {
    setCurrentPage(page);
  };

  const renderPagination = () => {
    const pagination = [];
    const groupSize = 5;
    const currentGroup = Math.floor(currentPage / groupSize);
    const startPage = currentGroup * groupSize;
    const endPage = Math.min(startPage + groupSize - 1, totalPages - 1);

    pagination.push(
      <button
        key="first-group"
        style={styles.button}
        onClick={() => handlePageClick(0)}
      >
        처음
      </button>
    );

    pagination.push(
      <button
        key="prev"
        style={styles.button}
        disabled={currentPage === 0}
        onClick={() => handlePageClick(Math.max(currentPage - 1, 0))}
      >
        이전
      </button>
    );

    for (let i = startPage; i <= endPage; i++) {
      pagination.push(
        <button
          key={i}
          style={{ ...styles.button, ...(i === currentPage ? styles.active : {}) }}
          onClick={() => handlePageClick(i)}
        >
          {i + 1}
        </button>
      );
    }

    pagination.push(
      <button
        key="next"
        style={styles.button}
        disabled={currentPage >= totalPages - 1}
        onClick={() => handlePageClick(Math.min(currentPage + 1, totalPages - 1))}
      >
        다음
      </button>
    );

    pagination.push(
      <button
        key="last-group"
        style={styles.button}
        onClick={() => handlePageClick(totalPages - 1)}
      >
        끝
      </button>
    );

    return pagination;
  };

  const handleDetail = (market) => {
    console.log('handleDetail');
    navigate('/market-detail-admin', { state: market });
  };

  const handleModifyMarket = (market) => {
    console.log('handleModify');
    navigate('/modify-market', { state: market });
  };

  return (
   <DashboardLayout>
    <div style={styles.container}>
      <button style={styles.button} onClick={() => navigate('/post-market')}>시장 추가</button>
      <div>
        <input type="text" id="searchInput" placeholder="시장 이름 검색" onKeyDown={handleSearchKeyDown} />
        <button style={styles.button} onClick={handleSearch}>검색</button>
      </div>
      <div>
        <button style={styles.button} onClick={() => handleCategoryClick('')}>전체보기</button>
        <button style={styles.button} onClick={handleViewCountClick}>조회수순</button>
        <button style={styles.button} onClick={handleTotalSalesPriceClick}>매출액순</button>
        {categories.map(category => (
          <button
            key={category}
            style={styles.button}
            onClick={() => handleCategoryClick(category)}
          >
            {category}
          </button>
        ))}
      </div>
      <div>
        <h2>시장 관리</h2>
        {markets.length === 0 ? (
          <p>시장이 존재하지 않습니다</p>
        ) : (
          <table style={styles.table}>
            <thead>
              <tr>
                <th style={styles.th}>시장 이름</th>
                <th style={styles.th}>시장 주소</th>
                <th style={styles.th}>조회수</th>
                <th style={styles.th}>좋아요 수</th>
                <th style={styles.th}>총매출액</th>
                <th style={styles.th}>도시명</th>
                <th style={styles.th}>수정</th>
                <th style={styles.th}>삭제</th>
              </tr>
            </thead>
            <tbody>
              {markets.map(market => (
                <tr key={market.marketNo}>
                  <td style={styles.td}><Button onClick={() => handleDetail(market)} className="market-title">{market.marketName}</Button></td>
                  <td style={styles.td}>{market.marketAddr}</td>
                  <td style={styles.td}>{market.viewCount}</td>
                  <td style={styles.td}>{market.likes}</td>
                  <td style={styles.td}>{market.totalSalesPrice}</td>
                  <td style={styles.td}>{market.category}</td>
                  <td style={styles.td}><button style={styles.button} onClick={() => handleModifyMarket(market)}>수정</button></td>
                  <td style={styles.td}><button style={styles.button} onClick={() => handleDeleteWithPassword(market)}>삭제</button></td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
        <div style={styles.pagination}>
          {renderPagination()}
        </div>
      </div>
      {showPasswordModal && (
        <div style={styles.modal}>
          <div style={styles.modalContent}>
            <h2>{selectedMarketName} 삭제</h2>
            <form onSubmit={(e) => {
              e.preventDefault();
              deleteMarket(marketToDelete);
            }}>
              <label htmlFor="adminPw">관리자 비밀번호 입력</label>
              <input
                type="password"
                id="adminPw"
                name="adminPw"
                value={password}
                placeholder="비밀번호를 입력하세요"
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <br />
              <button type="submit">확인</button>
              <button type="button" onClick={handleCloseModal}>취소</button>
            </form>
            {errorMessage && <div style={styles.errorMessage}>{errorMessage}</div>}
          </div>
        </div>
      )}
    </div>
    </DashboardLayout>
  );
}

export default MarketManage;
