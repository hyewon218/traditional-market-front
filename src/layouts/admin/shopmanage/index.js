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

import * as React from 'react';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import Button from '@mui/material/Button';

// Data
import { getList, getOne } from "../../../api/marketApi";
import { getAllShop, getAllShopByMarketAndCategory, postCheckAdminPw, getShopListSearch } from "../../../api/adminApi";
import { deleteShop } from "../../../api/shopApi";

function ShopManage () {
  const [currentPage, setCurrentPage] = useState(0); // 현재 페이지 상태
  const [groupSize] = useState(5); // 페이지 그룹 크기
  const [selectedCategory, setSelectedCategory] = useState(""); // 선택된 카테고리 상태
  const [sort, setSort] = useState("shopName,asc"); // 정렬 기준
  const [markets, setMarkets] = useState([]); // 시장 목록 상태
  const [shops, setShops] = useState([]); // 상점 목록 상태
  const [totalPages, setTotalPages] = useState(0); // 전체 페이지 수
  const [selectedMarketNo, setSelectedMarketNo] = useState('all'); // 선택된 시장 번호 상태
  const [showModal, setShowModal] = useState(false); // 비밀번호 확인 모달 표시 상태
  const [adminPw, setAdminPw] = useState(''); // 관리자 비밀번호 상태
  const [errorMessage, setErrorMessage] = useState(''); // 오류 메시지 상태
  const [searchQuery, setSearchQuery] = useState(''); // 검색 쿼리 상태
  const [selectedShopNo, setSelectedShopNo] = useState(null); // 삭제할 상점 번호 상태
  const [selectedShopName, setSelectedShopName] = useState(null); // 삭제할 상점 이름 상태

  const navigate = useNavigate();

  const categoryTranslations = {
    AGRI: '농산물',
    MARINE: '수산물',
    LIVESTOCK: '축산물',
    FRUITS: '과일',
    PROCESSED: '가공식품',
    RICE: '쌀',
    RESTAURANT: '식당',
    SIDEDISH: '반찬',
    STUFF: '잡화',
    ETC: '기타'
  };

  // 시장 이름을 캐싱할 객체
  const marketNamesCache = {};

  // 비동기 함수로 시장 이름을 로드
  const fetchMarketName = async (marketNo) => {
    if (marketNamesCache[marketNo]) {
      return marketNamesCache[marketNo];
    }

    try {
      const data = await getOne(marketNo);
      marketNamesCache[marketNo] = data.marketName;
      return data;
    } catch (error) {
      console.error("시장 정보 불러오기 오류:", error);
      marketNamesCache[marketNo] = '정보 없음';
      return '정보 없음';
    }
  };

  // 상점 목록 조회
  const loadShops = async () => {
      console.log("Loading shops with marketNo:", selectedMarketNo, "and sort:", sort);
      try {
          const pageParam = {
              page: currentPage,
              size: 3
          };

          let data;
          if (searchQuery) {
              data = await getShopListSearch(pageParam, searchQuery);
          }else if (selectedMarketNo === 'all') {
              data = await getAllShop({ pageParam, category: selectedCategory, sort });
          } else if (selectedMarketNo) {
              data = await getAllShopByMarketAndCategory(pageParam, selectedCategory, selectedMarketNo, sort);
          }

          console.log("Fetched shops data:", data);

          // 각 상점의 소속 시장 이름을 로드
          const shopsWithMarketNames = await Promise.all(data.content.map(async (shop) => {
              const marketData = await fetchMarketName(shop.marketNo);
              const marketName = marketData.marketName;

              return {
                  ...shop,
                  marketName,
                  marketData,
              };
          }));

          setShops(shopsWithMarketNames);
          setTotalPages(data.totalPages);
      } catch (err) {
          console.error("상점 목록 불러오기 오류: ", err);
      }
  };

  useEffect(() => {
    // 시장 목록 조회(드롭다운 채우기)
    const loadMarkets = async () => {
      try {
        const data = await getList({ page: 0, size: 100 }); // size는 드롭다운에 출력될 시장 개수
        console.log("Markets data:", data);
        setMarkets(data.content);
      } catch (err) {
        console.error("시장 목록 불러오기 오류: ", err);
      }
    };

    loadMarkets(); // 시장 목록은 초기 렌더링 시에만 로드
  }, []);

  useEffect(() => {
    loadShops(); // 페이지 변경, 카테고리 선택, 시장 선택 또는 정렬 기준 변경 시 상점 로드
  }, [currentPage, selectedCategory, selectedMarketNo, sort]);

  // 검색 기능 추가
  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    setCurrentPage(0);
    loadShops();
  };

  // 카테고리 선택 시
  const handleCategoryClick = (category) => {
    setSelectedCategory(category);
    setCurrentPage(0);
    setSort('shopName,asc'); // 정렬 초기화
  };

  // 드롭다운으로 시장 변경 시
  const handleMarketChange = async (e) => {
    const newMarketNo = e.target.value;
    if (newMarketNo === selectedMarketNo) return; // 현재와 같은 시장 선택 시 무시
    setSelectedMarketNo(newMarketNo);
    setCurrentPage(0);
    setSort('shopName,asc'); // 정렬 초기화
    setSearchQuery(''); // 검색 쿼리 초기화

    console.log("Market changed to:", newMarketNo);
  };

  // 전체 보기
  const handleViewAllShopsClick = () => {
    setSelectedCategory(''); // 카테고리 초기화
    setSort('shopName,asc'); // 정렬 초기화
    setCurrentPage(0); // 페이지를 첫 페이지로 설정
    setSearchQuery(''); // 검색 쿼리 초기화

    // URL에서 카테고리 파라미터를 제거
    const newUrl = new URL(window.location.href);
    newUrl.searchParams.delete('category');
    navigate(newUrl.pathname + newUrl.search); // URL을 새로고침
  };

  // 조회수순 보기
  const handleSortClick = (newSort) => {
    setSort(newSort);
    setCurrentPage(0); // 정렬 기준 변경 시 페이지를 첫 페이지로 설정
  };

  // 상점 상세보기
  const handleDetail = (shop) => {
      console.log('Navigating to shop detail with:', shop);
      navigate('/shop-detail-admin', { state: shop });
  };

  // 소속 시장 상세 페이지로 이동
  const handleMarketDetail = (market) => {
    console.log('관리자 시장 상세페이지로 이동 :', market);
    navigate('/market-detail-admin', { state: market });
  };

  // 수정
  const handleModifyShop = (shop) => {
      console.log('handleModify');
      navigate('/modify-shop', {state: shop});
  };

  // 삭제 처리 모달 열기
  const openDeleteModal = (shop) => {
    setAdminPw('');
    setErrorMessage('');
    setSelectedShopNo(shop.shopNo);
    setSelectedShopName(shop.shopName);
    setShowModal(true);
  };

  // 삭제 처리
  const handleDeleteShop = async () => {
      if (adminPw.trim() === "") {
          setErrorMessage("비밀번호를 입력하세요.");
          return;
      }

      try {
          // 비밀번호 확인
          const formData = new FormData();
          formData.append('password', adminPw);
          const verifyResponse = await postCheckAdminPw(formData);

          if (verifyResponse) {
              if (window.confirm(selectedShopName + " 상점을 삭제하시겠습니까?")) {
                  await deleteShop(selectedShopNo);
                  loadShops(); // 데이터 다시 불러오기
                  setShowModal(false);
              }
          } else {
              setErrorMessage("비밀번호가 일치하지 않습니다.");
          }
      } catch (error) {
          console.error('삭제 실패:', error);
          setErrorMessage("삭제에 실패했습니다.");
      }
  };

  const handleCancelDelete = () => {
    setAdminPw('');
    setShowModal(false);
  };

  const handlePageClick = (page) => {
    setCurrentPage(page);
  };

  // 페이징
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

  return (
    <div style={styles.container}>
      <button style={styles.button} onClick={() => navigate('/post-shop-admin')}>상점 추가</button>
      <form onSubmit={handleSearchSubmit}>
        <input
          type="text"
          value={searchQuery}
          onChange={handleSearchChange}
          placeholder="검색어를 입력하세요"
        />
        <button type="submit">검색</button>
      </form>
      <div className="shopList-marketList">
        <select
            id="marketNo"
            onChange={handleMarketChange}
            value={selectedMarketNo}
            sx={{ minHeight: 56 }}
            MenuProps={{
                PaperProps: {
                    style: {
                        maxHeight: 100, // 메뉴 최대 높이 설정
                    },
                },
            }}
        >
          <option value="all">전체보기</option>
          {markets.map(market => (
            <option key={market.marketNo} value={market.marketNo}>
              {market.marketName}
            </option>
          ))}
        </select>
      </div>
      <div className="shopList-category">
        <button style={styles.button} onClick={handleViewAllShopsClick}>전체 보기(이름순)</button>
        <button style={styles.button} onClick={() => handleSortClick("viewCount,desc")}>조회수순</button>
        {['AGRI', 'MARINE', 'LIVESTOCK', 'FRUITS', 'PROCESSED', 'RICE', 'RESTAURANT', 'SIDEDISH', 'STUFF', 'ETC'].map(category => (
          <button
            key={category}
            style={styles.button}
            onClick={() => handleCategoryClick(category)}
          >
            {categoryTranslations[category] || category}
          </button>
        ))}
      </div>
      <div className="shopList-contents" style={styles.shopListContents}>
        <h2>상점 관리</h2>
        {shops.length === 0 ? (
          <p>선택한 카테고리에 해당하는 상점이 존재하지 않습니다</p>
        ) : (
          <div className="table-container" style={styles.tableContainer}>
            <table style={styles.table}>
              <thead>
                <tr>
                  <th style={styles.th}>상점 이름</th>
                  <th style={styles.th}>소속 시장</th>
                  <th style={styles.th}>전화번호</th>
                  <th style={styles.th}>분류</th>
                  <th style={styles.th}>조회수</th>
                  <th style={styles.th}>좋아요 수</th>
                  <th style={styles.th}>수정</th>
                  <th style={styles.th}>삭제</th>
                </tr>
              </thead>
              <tbody>
                {shops.map(shop => (
                  <tr key={shop.shopNo}>
                    <td style={styles.td}><Button onClick={() => handleDetail(shop)} className="shop-title">{shop.shopName}</Button></td>
                    <td style={styles.td}><Button onClick={() => handleMarketDetail(shop.marketData)} className="shop-title">{shop.marketName}</Button></td>
                    <td style={styles.td}>{shop.tel}</td>
                    <td style={styles.td}>{categoryTranslations[shop.category] || shop.category}</td>
                    <td style={styles.td}>{shop.viewCount}</td>
                    <td style={styles.td}>{shop.likes}</td>
                    <td style={styles.td}>
                      <button onClick={() => handleModifyShop(shop)}>수정</button>
                    </td>
                    <td style={styles.td}>
                      <button onClick={() => openDeleteModal(shop)}>삭제</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
        <div style={styles.pagination}>
          {renderPagination()}
        </div>
      </div>
      {/* 비밀번호 모달 */}
      {showModal && (
        <div style={styles.modal}>
           <div style={styles.modalContent}>
          <h2>{selectedShopName} 삭제</h2>
          <p>관리자 비밀번호 확인</p>
          <input
            type="password"
            value={adminPw}
            onChange={(e) => setAdminPw(e.target.value)}
            placeholder="관리자 비밀번호 입력"
          />
          <button onClick={handleDeleteShop}>삭제</button>
          <button onClick={handleCancelDelete}>취소</button>
          {errorMessage && <p>{errorMessage}</p>}
        </div>
        </div>
      )}
    </div>
  );
};

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

export default ShopManage;
