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
import DashboardLayout from '../../../examples/LayoutContainers/DashboardLayout';
import Button from '@mui/material/Button';

// Data
import { getList, getOne } from "../../../api/marketApi";
import { getItemsByMarket, getItemsByMultiple, getAllItems, getItemListSearch, postCheckAdminPw } from "../../../api/adminApi";
import { getShopList, getShopOne } from "../../../api/shopApi";
import { getItemList, deleteItem } from "../../../api/itemApi";

function ItemManage () {
  const [currentPage, setCurrentPage] = useState(0); // 현재 페이지 상태
  const [groupSize] = useState(5); // 페이지 그룹 크기
  const [selectedCategory, setSelectedCategory] = useState(""); // 선택된 카테고리 상태
  const [sort, setSort] = useState("itemName,asc"); // 정렬 기준
  const [markets, setMarkets] = useState([]); // 시장 목록 상태(드롭다운 채우기)
  const [shops, setShops] = useState([]); // 상점 목록 상태(드롭다운 채우기)
  const [items, setItems] = useState([]);
  const [totalPages, setTotalPages] = useState(0); // 전체 페이지 수
  const [selectedMarketNo, setSelectedMarketNo] = useState('all'); // 선택된 시장 번호 상태
  const [selectedShopNo, setSelectedShopNo] = useState('all'); // 선택된 상점 번호 상태
  const [showModal, setShowModal] = useState(false);
  const [adminPw, setAdminPw] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [searchQuery, setSearchQuery] = useState(''); // 검색 쿼리 상태
  const [selectedItemNo, setSelectedItemNo] = useState(null); // 삭제할 상품 번호 상태
  const [selectedItemName, setSelectedItemName] = useState(null); // 삭제할 상품 이름 상태

  const navigate = useNavigate();

//  // 시장 이름을 캐싱할 객체
//  const marketNamesCache = {};
//
//  // 상점 이름을 캐싱할 객체
//  const shopNamesCache = {};
//
//  // 비동기 함수로 시장 이름을 조회
//  const fetchMarketName = async (marketNo) => {
//    if (marketNamesCache[marketNo]) {
//      return marketNamesCache[marketNo];
//    }
//
//    try {
//      const data = await getOne(marketNo);
//      console.log("fetchMarketName data : ", data);
//      marketNamesCache[marketNo] = data.marketName;
//      return data;
//    } catch (error) {
//      console.error("시장 정보 불러오기 오류:", error);
//      marketNamesCache[marketNo] = '정보 없음';
//      return '정보 없음';
//    }
//  };
//
//  // 비동기 함수로 상점 이름을 조회
//  const fetchShopName = async (shopNo) => {
//    if (shopNamesCache[shopNo]) {
//      return shopNamesCache[shopNo];
//    }
//
//    try {
//      const data = await getShopOne(shopNo);
//      console.log("fetchShopName data : ", data);
//      shopNamesCache[shopNo] = data.shopName;
//      return data;
//    } catch (error) {
//      console.error("상점 정보 불러오기 오류:", error);
//      shopNamesCache[shopNo] = '정보 없음';
//      return '정보 없음';
//    }
//  };
//
//  // 상품 목록 조회
//  const loadItems = async () => {
//      try {
//          const pageParam = {
//              page: currentPage,
//              size: 10
//          };
//
//          let data;
//
//          if (searchQuery) {
//              data = await getItemListSearch(pageParam, searchQuery);
//          }  else if (selectedMarketNo === 'all') {
//              data = await getAllItems(pageParam, selectedCategory, sort);
//          } else if (selectedShopNo === 'all') {
//              data = await getItemsByMarket(pageParam, selectedMarketNo, selectedCategory, sort);
//          } else if (selectedMarketNo) {
//              data = await getItemsByMultiple(pageParam, selectedMarketNo, selectedShopNo, selectedCategory, sort);
//          }
//
//          console.log("Fetched items data:", data);
//
//          // 각 상품의 소속 상점, 소속 시장 이름을 로드
//          const itemsWithShopAndMarketNames  = await Promise.all(data.content.map(async (item) => {
//              const shopData = await fetchShopName(item.shopNo);
//              const shopName = shopData.shopName;
//              const marketNo = shopData.marketNo; // 상점 데이터에서 marketNo를 추출
//              const marketData = await fetchMarketName(marketNo);
//              const marketName = marketData.marketName;
//
//          // shopData에 marketName과 marketData를 추가
//            const updatedShopData = {
//              ...shopData,
//              marketName,  // marketName 추가
//              marketData,  // marketData 추가
//            };
//
//            return {
//              ...item,
//              shopName,
//              marketName,
//              shopData: updatedShopData,  // 수정된 shopData를 사용
//              marketData,
//            };
//          }));
//
//          setItems(itemsWithShopAndMarketNames);
//          console.log('itemsWithShopAndMarketNames : ', itemsWithShopAndMarketNames);
//          setTotalPages(data.totalPages);
//
//      } catch (err) {
//          console.error("상품 목록 불러오기 오류: ", err);
//      }
//  };

  // 중복 시장 번호 제거를 이용한 조회 속도 개선 (기존 Promise.all()을 사용한 동시 API 호출은 유지)
  // 시장 이름을 캐싱할 객체
//  const marketNamesCache = {};
//
//  // 상점 이름을 캐싱할 객체
//  const shopNamesCache = {};
//
//  // 동시 상점 및 시장 정보 로딩 함수
//  const fetchShopAndMarketNamesConcurrently = async (items) => {
//    // 캐시되지 않은 상점 번호와 시장 번호 필터링
//    const uncachedShopNos = [
//      ...new Set(
//        items
//          .filter(item => !shopNamesCache[item.shopNo])
//          .map(item => item.shopNo)
//      )
//    ];
//
//    // 상점 정보 동시 API 호출 준비
//    const shopInfoPromises = uncachedShopNos.map(shopNo =>
//      getShopOne(shopNo)
//        .then(data => ({
//          shopNo,
//          shopName: data.shopName,
//          marketNo: data.marketNo
//        }))
//        .catch(() => ({
//          shopNo,
//          shopName: '정보 없음',
//          marketNo: null
//        }))
//    );
//
//    // 상점 정보 병렬 로드
//    const fetchedShopInfos = await Promise.all(shopInfoPromises);
//
//    // 상점 캐시 업데이트
//    fetchedShopInfos.forEach(shop => {
//      shopNamesCache[shop.shopNo] = shop.shopName;
//    });
//
//    // 캐시되지 않은 시장 번호 필터링
//    const uncachedMarketNos = [
//      ...new Set(
//        fetchedShopInfos
//          .filter(shop => shop.marketNo && !marketNamesCache[shop.marketNo])
//          .map(shop => shop.marketNo)
//      )
//    ];
//
//    // 시장 정보 동시 API 호출 준비
//    const marketInfoPromises = uncachedMarketNos.map(marketNo =>
//      getOne(marketNo)
//        .then(data => ({
//          marketNo,
//          marketName: data.marketName
//        }))
//        .catch(() => ({
//          marketNo,
//          marketName: '정보 없음'
//        }))
//    );
//
//    // 시장 정보 병렬 로드
//    const fetchedMarketInfos = await Promise.all(marketInfoPromises);
//
//    // 시장 캐시 업데이트
//    fetchedMarketInfos.forEach(market => {
//      marketNamesCache[market.marketNo] = market.marketName;
//    });
//
//    // 상품 목록에 상점 및 시장 이름 매핑
//    return items.map(item => {
//      const shopInfo = fetchedShopInfos.find(shop => shop.shopNo === item.shopNo) || {};
//      const marketInfo = fetchedMarketInfos.find(market => market.marketNo === shopInfo.marketNo) || {};
//
//      return {
//        ...item,
//        shopName: shopNamesCache[item.shopNo] || '정보 없음',
//        marketName: marketNamesCache[shopInfo.marketNo] || '정보 없음',
//        shopData: {
//          ...shopInfo,
//          marketName: marketNamesCache[shopInfo.marketNo] || '정보 없음'
//        },
//        marketData: marketInfo
//      };
//    });
//  };
//
//  // 상품 목록 조회
//  const loadItems = async () => {
//    try {
//      const pageParam = {
//        page: currentPage,
//        size: 10
//      };
//
//      let data;
//      if (searchQuery) {
//        data = await getItemListSearch(pageParam, searchQuery);
//      } else if (selectedMarketNo === 'all') {
//        data = await getAllItems(pageParam, selectedCategory, sort);
//      } else if (selectedShopNo === 'all') {
//        data = await getItemsByMarket(pageParam, selectedMarketNo, selectedCategory, sort);
//      } else if (selectedMarketNo) {
//        data = await getItemsByMultiple(pageParam, selectedMarketNo, selectedShopNo, selectedCategory, sort);
//      }
//
//      // 동시 상점 및 시장 정보 로딩
//      const itemsWithShopAndMarketNames = await fetchShopAndMarketNamesConcurrently(data.content);
//
//      setItems(itemsWithShopAndMarketNames);
//      setTotalPages(data.totalPages);
//    } catch (err) {
//      console.error("상품 목록 불러오기 오류: ", err);
//    }
//  };

  // 캐시 객체들
  const marketNamesCache = {};
  const shopNamesCache = {};

  // 동시 상점 및 시장 정보 로딩 함수
  const fetchShopAndMarketNamesConcurrently = async (items) => {
    // 캐시되지 않은 상점 번호 필터링
    const uncachedShopNos = [
      ...new Set(
        items
          .filter(item => !shopNamesCache[item.shopNo])
          .map(item => item.shopNo)
      )
    ];

    // 상점 정보 동시 API 호출
    const shopInfoPromises = uncachedShopNos.map(shopNo =>
      getShopOne(shopNo)
        .then(data => {
          shopNamesCache[shopNo] = data;
          return { shopNo, data };
        })
        .catch(() => {
          shopNamesCache[shopNo] = { shopName: '정보 없음', marketNo: null };
          return { shopNo, data: { shopName: '정보 없음', marketNo: null } };
        })
    );

    // 상점 정보 병렬 로드
    await Promise.all(shopInfoPromises);

    // 캐시되지 않은 시장 번호 필터링
    const uncachedMarketNos = [
      ...new Set(
        Object.values(shopNamesCache)
          .filter(shop => shop.marketNo && !marketNamesCache[shop.marketNo])
          .map(shop => shop.marketNo)
      )
    ];

    // 시장 정보 동시 API 호출
    const marketInfoPromises = uncachedMarketNos.map(marketNo =>
      getOne(marketNo)
        .then(data => {
          marketNamesCache[marketNo] = data;
          return { marketNo, data };
        })
        .catch(() => {
          marketNamesCache[marketNo] = { marketName: '정보 없음' };
          return { marketNo, data: { marketName: '정보 없음' } };
        })
    );

    // 시장 정보 병렬 로드
    await Promise.all(marketInfoPromises);

    // 상품 목록에 상점 및 시장 정보 매핑
    return items.map(item => {
      const shopData = shopNamesCache[item.shopNo];
      const marketData = marketNamesCache[shopData.marketNo] || { marketName: '정보 없음' };

      return {
        ...item,
        shopName: shopData.shopName,
        marketName: marketData.marketName,
        shopData: {
          ...shopData,
          marketName: marketData.marketName,
          marketData
        },
        marketData
      };
    });
  };

  // 상품 목록 조회
  const loadItems = async () => {
    try {
      const pageParam = {
        page: currentPage,
        size: 10
      };

      let data;
      if (searchQuery) {
        data = await getItemListSearch(pageParam, searchQuery);
      } else if (selectedMarketNo === 'all') {
        data = await getAllItems(pageParam, selectedCategory, sort);
      } else if (selectedShopNo === 'all') {
        data = await getItemsByMarket(pageParam, selectedMarketNo, selectedCategory, sort);
      } else if (selectedMarketNo) {
        data = await getItemsByMultiple(pageParam, selectedMarketNo, selectedShopNo, selectedCategory, sort);
      }

      // 동시 상점 및 시장 정보 로딩
      const itemsWithShopAndMarketNames = await fetchShopAndMarketNamesConcurrently(data.content);

      setItems(itemsWithShopAndMarketNames);
      setTotalPages(data.totalPages);
    } catch (err) {
      console.error("상품 목록 불러오기 오류: ", err);
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
    // 특정 시장에 해당하는 상점 목록 조회(드롭다운 채우기)
    const loadShopsByMarket = async () => {
      if (selectedMarketNo === 'all') return; // 전체 보기일 때는 상점 목록을 로드하지 않음
      try {
        const pageParam = { page: 0, size: 100 };
        const data = await getShopList(selectedMarketNo, pageParam); // size는 드롭다운에 출력될 상점 개수
        console.log("Shops data:", data);
        setShops(data.content);
      } catch (err) {
        console.error("상점 목록 불러오기 오류: ", err);
      }
    };

    // 시장이 선택된 경우에만 상점 목록 로드
    if (selectedMarketNo !== 'all') {
      loadShopsByMarket();
    }

  }, [selectedMarketNo]);

  useEffect(() => {
    loadItems(); // 페이지 변경, 카테고리 선택, 시장 선택, 상점 선택 또는 정렬 기준 변경 시 상점 로드
  }, [currentPage, selectedCategory, selectedMarketNo, selectedShopNo, sort]);

  // 검색 기능 추가
  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    setCurrentPage(0);
    loadItems();
  };

  // 카테고리 선택 시
  const handleCategoryClick = (category) => {
    setSelectedCategory(category);
    setCurrentPage(0);
    setSort('itemName,asc'); // 정렬 초기화
  };

  // 드롭다운으로 시장 변경 시
  const handleMarketChange = async (e) => {
    const newMarketNo = e.target.value;
    if (newMarketNo === selectedMarketNo) return; // 현재와 같은 시장 선택 시 무시
    setSelectedMarketNo(newMarketNo);
    setCurrentPage(0);
    setSort('itemName,asc'); // 정렬 초기화
    setSearchQuery(''); // 검색 쿼리 초기화
    setShops([]); // 상점 목록 초기화

    console.log("Market changed to:", newMarketNo);
  };

  // 드롭다운으로 상점 변경 시
  const handleShopChange = async (e) => {
    const newShopNo = e.target.value;
    if (newShopNo === selectedShopNo) return; // 현재와 같은 상품 선택 시 무시
    setSelectedShopNo(newShopNo);
    setCurrentPage(0);
    setSort('itemName,asc'); // 정렬 초기화
    setSearchQuery(''); // 검색 쿼리 초기화

    console.log("Shop changed to:", newShopNo);
  };

  // 전체 보기
  const handleViewAllItemsClick = () => {
    setSelectedCategory(''); // 카테고리 초기화
    setSort('itemName,asc'); // 정렬 초기화
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

  // 상품 상세보기
  const handleDetail = (item) => {
      console.log('Navigating to item detail with:', item);
      navigate('/item-detail-admin', { state: item });
  };

  // 소속 시장 상세 페이지로 이동
  const handleMarketDetail = (market) => {
    console.log('관리자 시장 상세페이지로 이동 :', market);
    navigate('/market-detail-admin', { state: market });
  };

  // 소속 상점 상세 페이지로 이동
  const handleShopDetail = (shop) => {
    console.log('관리자 상점 상세페이지로 이동 :', shop);
    navigate('/shop-detail-admin', { state: shop });
  };

  // 수정
  const handleModifyItem = (item) => {
      console.log('handleModify');
      navigate('/modify-item', {state: item});
  };

   // 삭제 처리 모달 열기
    const openDeleteModal = (item) => {
      setAdminPw('');
      setErrorMessage('');
      setSelectedItemNo(item.itemNo);
      setSelectedItemName(item.itemName);
      setShowModal(true);
    };

    // 삭제 처리
    const handleDeleteItem = async () => {
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
                if (window.confirm(selectedItemName + " 상품을 삭제하시겠습니까?")) {
                    await deleteItem(selectedItemNo);
                    setShowModal(false);
                    loadItems(); // 데이터 다시 불러오기
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
  <DashboardLayout>
    <div style={styles.container}>
      <button style={styles.button} onClick={() => navigate('/post-item-admin')}>상품 추가</button>
      <form onSubmit={handleSearchSubmit}>
        <input
          type="text"
          value={searchQuery}
          onChange={handleSearchChange}
          placeholder="검색어를 입력하세요"
        />
        <button type="submit">검색</button>
      </form>
      <div className="itemList-marketList">
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
      <div className="itemList-shopList">
        <select
            id="shopNo"
            onChange={handleShopChange}
            value={selectedShopNo}
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
          {shops.map(shop => (
            <option key={shop.shopNo} value={shop.shopNo}>
              {shop.shopName}
            </option>
          ))}
        </select>
      </div>

      <div className="itemList-category">
        <button style={styles.button} onClick={handleViewAllItemsClick}>전체 보기(이름순)</button>
        <button style={styles.button} onClick={() => handleSortClick("viewCount,desc")}>조회수순</button>
        <button style={styles.button} onClick={() => handleSortClick("countSales,desc")}>판매량순</button>
        <button style={styles.button} onClick={() => handleSortClick("totalSalesPrice,desc")}>매출액순</button>
        {['과일', '채소', '육류', '생선'].map(category => (
          <button
            key={category}
            style={styles.button}
            onClick={() => handleCategoryClick(category)}
          >
          {category}
          </button>
        ))}
      </div>
      <div className="itemList-contents" style={styles.itemListContents}>
        <h2>상품 관리</h2>
        {items.length === 0 ? (
          <p>선택한 카테고리에 해당하는 상품이 존재하지 않습니다</p>
        ) : (
          <div className="table-container" style={styles.tableContainer}>
            <table style={styles.table}>
              <thead>
                <tr>
                  <th style={styles.th}>상품 이름</th>
                  <th style={styles.th}>소속 시장</th>
                  <th style={styles.th}>소속 상점</th>
                  <th style={styles.th}>가격</th>
                  <th style={styles.th}>재고</th>
                  <th style={styles.th}>판매상태</th>
                  <th style={styles.th}>조회수</th>
                  <th style={styles.th}>좋아요 수</th>
                  <th style={styles.th}>총매출액</th>
                  <th style={styles.th}>수정</th>
                  <th style={styles.th}>삭제</th>
                </tr>
              </thead>
              <tbody>
                {items.map(item => (
                  <tr key={item.itemNo}>
                    <td style={styles.td}><Button onClick={() => handleDetail(item)} className="item-title">{item.itemName}</Button></td>
                    <td style={styles.td}><Button onClick={() => handleMarketDetail(item.marketData)} className="item-title">{item.marketName}</Button></td>
                    <td style={styles.td}><Button onClick={() => handleShopDetail(item.shopData)} className="item-title">{item.shopName}</Button></td>
                    <td style={styles.td}>{item.price}</td>
                    <td style={styles.td}>{item.stockNumber}</td>
                    <td style={styles.td}>{item.itemSellStatus}</td>
                    <td style={styles.td}>{item.viewCount}</td>
                    <td style={styles.td}>{item.likes}</td>
                    <td style={styles.td}>{item.totalSalesPrice}</td>
                    <td style={styles.td}>
                      <button onClick={() => handleModifyItem(item)}>수정</button>
                    </td>
                    <td style={styles.td}>
                      <button onClick={() => openDeleteModal(item)}>삭제</button>
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
            <h2>{selectedItemName} 삭제</h2>
            <p>관리자 비밀번호 확인</p>
            <input
              type="password"
              value={adminPw}
              onChange={(e) => setAdminPw(e.target.value)}
              placeholder="관리자 비밀번호 입력"
            />
            <button onClick={handleDeleteItem}>삭제</button>
            <button onClick={handleCancelDelete}>취소</button>
            {errorMessage && <p>{errorMessage}</p>}
          </div>
          </div>
        )}
    </div>
    </DashboardLayout>
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

export default ItemManage;
