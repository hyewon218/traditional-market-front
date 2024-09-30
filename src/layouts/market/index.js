import * as React from 'react';
import {useEffect, useState, useCallback} from 'react';
import {useNavigate} from 'react-router';

// @mui material components
import Grid from '@mui/material/Grid';
import Card from '@mui/material/Card';
import SearchIcon from '@mui/icons-material/Search';
import IconButton from '@mui/material/IconButton';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import Badge from "@mui/material/Badge";
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';

// Material Dashboard 2 React components
import MDBox from '../../components/MD/MDBox';
import MDTypography from '../../components/MD/MDTypography';

// Material Dashboard 2 React example components
import DashboardLayout from '../../examples/LayoutContainers/DashboardLayout';
import Button from '@mui/material/Button';
import {getList, getListCategory, getListSearch} from "../../api/marketApi";
import MDButton from "../../components/MD/MDButton";
import MDInput from "../../components/MD/MDInput";
import useCustomCart from "../../hooks/useCustomCart";
import useCustomLogin from "../../hooks/useCustomLogin";
import {NotificationImportant} from "@mui/icons-material";
import {getNotificationCount} from "../../api/notificationApi";
import {useMediaQuery, useTheme} from "@mui/material";

function Market() {
    const {isAuthorization, isAdmin} = useCustomLogin();
    const {cartItems, refreshCart} = useCustomCart();

    const [page, setPage] = useState(0);
    const [markets, setMarkets] = useState([]);
    const [totalPage, setTotalPage] = useState(0);

    /*시장 검색*/
    const [isSearchActive, setIsSearchActive] = useState(false);
    const [filteredMarkets, setFilteredMarkets] = useState([]);
    const [searchTotalPage, setSearchTotalPage] = useState(0);
    const [search, setSearch] = useState('');
    /*시장 카테고리*/
    const [selectedCategory, setSelectedCategory] = useState('');
    const [categoryMarkets, setCategoryMarkets] = useState([]);
    const [categoryTotalPage, setCategoryTotalPage] = useState(0);
    /*알람 아이콘에 알람 수 추가*/
    const [notificationCount, setNotificationCount] = useState(0);

    const navigate = useNavigate();

    const theme = useTheme();
    const isSmallScreen = useMediaQuery(theme.breakpoints.down('sm'));
    const isMediumScreen = useMediaQuery(theme.breakpoints.between('sm', 'md'));

    useEffect(() => {
        if (isAuthorization) {
            refreshCart();
            fetchNotifications();
        }
    }, []);

    useEffect(() => {
        if (isSearchActive) {
            fetchSearchMarkets(page);
        }
        else if (selectedCategory) {
            fetchCategoryMarkets(page);
        } else {
            fetchMarkets(page);
        }
    }, [selectedCategory, isSearchActive, page]);

//    const fetchMarkets = (pageNum = 0) => {
//        const pageParam = {page: pageNum, size: 8};
//        getList(pageParam).then(data => {
//            setMarkets(data.content);
//            setTotalPage(data.totalPages);
//            resetFilters();
//        }).catch(error => console.error("시장 목록 조회에 실패했습니다.", error));
//    };

    const fetchMarkets = (pageNum = 0) => {
        const pageParam = { page: pageNum, size: 100 };
        getList(pageParam).then(data => {
            if (pageNum === 0) {
                setMarkets(data.content); // 페이지 번호가 0일 때만 초기화
            } else {
                setMarkets(prevMarkets => [...prevMarkets, ...data.content]); // 기존 목록에 새 목록 추가
            }
            setTotalPage(data.totalPages);
        }).catch(error => console.error("시장 목록 조회에 실패했습니다.", error));
    };

//    const fetchSearchMarkets = (pageNum) => {
//        const pageParam = {page: pageNum, size: 8};
//        getListSearch(pageParam, search).then(data => {
//            setFilteredMarkets(data.content);
//            setSearchTotalPage(data.totalPages);
//            setIsSearchActive(true);
//        }).catch(error => console.error("시장 검색 조회에 실패했습니다.", error));
//    };

    const fetchSearchMarkets = (pageNum = 0) => {
        const pageParam = { page: pageNum, size: 100 };
        getListSearch(pageParam, search).then(data => {
            console.log('API Response:', data);
            if (pageNum === 0) {
                setFilteredMarkets(data.content); // 페이지 번호가 0일 때만 초기화
            } else {
                setFilteredMarkets(prevFilteredMarkets => [...prevFilteredMarkets, ...data.content]); // 기존 목록에 새 목록 추가
            }
            setSearchTotalPage(data.totalPages);
            setIsSearchActive(true);
        }).catch(error => console.error("시장 검색 조회에 실패했습니다.", error));
    };

//    const fetchCategoryMarkets = (pageNum = 0) => {
//        const pageParam = {page: pageNum, size: 8};
//        getListCategory(pageParam, selectedCategory).then(data => {
//            setCategoryMarkets(data.content);
//            setCategoryTotalPage(data.totalPages);
//        }).catch(error => console.error("시장 카테고리 조회에 실패했습니다.", error));
//    };

    const fetchCategoryMarkets = (pageNum = 0) => {
        const pageParam = { page: pageNum, size: 100 };
        getListCategory(pageParam, selectedCategory).then(data => {
            if (pageNum === 0) {
                setCategoryMarkets(data.content); // 페이지 번호가 0일 때만 초기화
            } else {
                setCategoryMarkets(prevCategoryMarkets => [...prevCategoryMarkets, ...data.content]); // 기존 목록에 새 목록 추가
            }
            setCategoryTotalPage(data.totalPages);
        }).catch(error => {
        console.error("시장 카테고리 조회에 실패했습니다.", error);
        });
    };

    const fetchNotifications = () => {
        getNotificationCount().then(data => {
            setNotificationCount(data);
        }).catch(error => console.error("알람 수 조회에 실패했습니다.", error));
    };

    const resetFilters = () => {
        setFilteredMarkets([]);
        setCategoryMarkets([]);
        setIsSearchActive(false);
        setSelectedCategory('');
    };

    const handleSearch = (event) => {
        setSearch(event.target.value);
    };

//    const handleSearchSubmit = () => {
//        setPage(0);
//        fetchSearchMarkets(0);
//    };

    const handleSearchSubmit = () => {
        setPage(0);
        setFilteredMarkets([]); // Reset filtered markets
        fetchSearchMarkets(0);
    };

    const handleDetail = (market) => {
        console.log('handleDetail');
        navigate('/market-detail', {state: market});
    };

//    const handleCategorySelect = (category) => {
//        if (category === "전체") {
//            fetchMarkets(0);
//        } else {
//            setSelectedCategory(category);
//            setIsSearchActive(false);
//            setPage(0);
//        }
//    };

    const handleCategorySelect = (category) => {
        setPage(0); // 페이지 번호 초기화
        if (category === "전체") {
            setSelectedCategory('');
//            fetchMarkets(); // 전체 목록 로드
        } else {
            setSelectedCategory(category);
            setIsSearchActive(false); // 검색 비활성화
//            fetchCategoryMarkets(); // 선택한 카테고리의 시장 로드
            setPage(0);
        }
    };

    const handleCartIcon = () => {
        navigate('/cart');
    };

    const handleNotificationIcon = () => {
        navigate('/alarms');
    };

    const handleAddMarket = () => {
        navigate('/post-market');
    };

    // 페이징때 사용
//    const changePage = (pageNum) => {
//        setPage(pageNum);
//        if (isSearchActive) {
//            fetchSearchMarkets(pageNum);
//        } else if (selectedCategory) {
//            fetchCategoryMarkets(pageNum);
//        } else {
//            fetchMarkets(pageNum);
//        }
//    };

//    const renderMarkets = isSearchActive ? filteredMarkets : (selectedCategory
//        ? categoryMarkets : markets);
//    const currentTotalPage = isSearchActive ? searchTotalPage
//        : (selectedCategory ? categoryTotalPage : totalPage);

    // 가장 위로 스크롤
    const scrollToTop = () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const renderMarkets = isSearchActive ? filteredMarkets : (selectedCategory ? categoryMarkets : markets);
    const currentTotalPage = isSearchActive ? searchTotalPage : (selectedCategory ? categoryTotalPage : totalPage);

    // 스크롤 로직 초기화
    const observer = React.useRef();

    const lastMarketElementRef = useCallback(node => {
        if (observer.current) observer.current.disconnect();
        observer.current = new IntersectionObserver(entries => {
            if (entries[0].isIntersecting) {
                console.log('IntersectionObserver triggered'); // Log trigger
                if (page < currentTotalPage - 1) {
                    setPage(prevPage => prevPage + 1);
                }
            }
        }, { threshold: 1.0 });
        if (node) observer.current.observe(node);
    }, [page, currentTotalPage]);

    return (
        <DashboardLayout>
            {/* 광고 구역 */}
            <MDBox
                sx={{
                    width: '70%',
                    height: { xs: '3rem', sm: '8rem' }, // sm 이하 1.5cm, sm 이상 2cm
                    margin: '0 auto',
                    backgroundColor: '#f5f5f5', // 배경색 예시
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    borderRadius: '8px',
                    boxShadow: 1,
                    position: 'relative', // 상대 위치로 설정
                    zIndex: 10, // 광고가 다른 콘텐츠 위에 표시되도록 함
                    marginBottom: '1rem', // 광고 구역과 그 아래 콘텐츠 사이의 여백
                    mt: {xs:-3, sm:1, md:1, lg:1},
                }}
            >
                <a href="https://www.example.com" target="_blank" rel="noopener noreferrer">
                    <img
                        src="https://via.placeholder.com/728x90.png?text=Ad+Banner" // 광고 배너 이미지 URL
                        alt="Advertisement"
                        style={{
                            width: '100%',
                            height: '100%',
                            objectFit: 'cover', // 이미지가 광고 영역에 맞게 조절되도록 설정
                            borderRadius: '8px',
                        }}
                    />
                </a>
            </MDBox>

            {/* 시장 검색 */}
            <MDBox pb={2}
                   sx={{ display: 'flex', justifyContent: 'center', flexDirection: isSmallScreen ? 'column' : 'row' }}>
                <Card sx={{
                    width: isSmallScreen ? '75%' : isMediumScreen ? '70%' : '50%',
                    display: 'flex',
                    flexDirection: isSmallScreen ? 'column' : 'row',
                    justifyContent: 'center',
                    alignItems: 'center',
                    position: 'relative'
                }}>
                    <MDInput
                        label="시장을 검색해 보세요!"
                        value={search}
                        onChange={handleSearch}
                        onKeyDown={(event) => {
                            if (event.key === 'Enter') {
                                handleSearchSubmit();
                            }
                        }}
                        sx={{
                            width: isSmallScreen ? '80%' : '93%',
                            height: isSmallScreen ? '50px' :'60px',
                            padding: isSmallScreen ? '3px' :'8px',
                            borderRadius: isSmallScreen ? '10px' :'8px',
                            marginRight: isSmallScreen ? '43px' : '50px',
                        }}
                        InputLabelProps={{
                            sx: {
                                display: 'flex', // flex 사용
                                alignItems: 'center', // 세로 가운데 정렬
                                height: '50%', // 높이를 전체로 설정
                                padding: '0', // 패딩 제거
                            }
                        }}
                    />
                    <IconButton onClick={handleSearchSubmit}
                                sx={{ position: 'absolute', right: '8px' }}>
                        <SearchIcon />
                    </IconButton>
                </Card>

                {/* 알람 아이콘 */}
                {isAuthorization && (
                    <IconButton onClick={handleNotificationIcon}
                                sx={{ position: 'absolute', right: isSmallScreen ? '50px' : '160px', marginTop: '0' }}>
                        <Badge badgeContent={notificationCount} color="primary">
                            <NotificationImportant />
                        </Badge>
                    </IconButton>
                )}

                {/* 장바구니 아이콘 + 장바구니에 담긴 상품 갯수 */}
                {isAuthorization && (
                    <IconButton onClick={handleCartIcon}
                                sx={{ position: 'absolute', right: isSmallScreen ? '10px' : '100px', marginTop: '0' }}>
                        <Badge badgeContent={cartItems.length} color="primary">
                            <ShoppingCartIcon/>
                        </Badge>
                    </IconButton>
                )}
            </MDBox>

            {/* 카테고리 */}
            <Grid container spacing={isSmallScreen ? 0.8 : 1} justifyContent="center">
                {["전체", "서울", "인천", "경기도", "강원", "충청도", "경상도", "전라도",
                    "제주도"].map(
                    (category, index) => (
                        <Grid item xs={3} sm={4} md={2} lg={index < 3 ? 1.0 : 1.15} key={category}>
                            <MDBox>
                                <MDButton
                                    onClick={() => handleCategorySelect(category)}
                                    variant="gradient"
                                    size="large"
                                    sx={{
                                        backgroundColor: '#50bcdf',
                                        color: '#ffffff',
                                        fontSize: isSmallScreen ? '0.9rem' :'1.1rem',
                                        fontFamily: 'JalnanGothic',
                                        width: '100%',
                                        padding: isSmallScreen ? '2px 4px' : '4px 8px',
                                        lineHeight: 2,  // 줄 간격을 줄여 높이를 감소시킴
                                        minHeight: 'auto' // 기본적으로 적용되는 높이를 없앰
                                    }}
                                >
                                    {category}
                                </MDButton>
                            </MDBox>
                        </Grid>
                    ))}
            </Grid>

            {/* 시장 목록 조회 */}
            <Grid container pt={3} pb={15}>
                {renderMarkets.length > 0 ? (
                    renderMarkets.map((market, index) => (
                        <Grid item xs={12} sm={6} md={6} lg={3} key={index}>
                            <MDBox pb={2}  key={market.id} ref={index === renderMarkets.length - 1 ? lastMarketElementRef : null}>
                                <Card sx={{
                                    width: '90%',
                                    maxWidth: '350px',
                                    mx: 'auto',
                                }}>
                                    <MDBox pt={2} pb={2} px={3}>
                                        <Grid container>
                                            <Grid item xs={8}>
                                                <MDTypography fontWeight="bold"
                                                              variant="body2">
                                                    {market.marketName}
                                                </MDTypography>
                                            </Grid>
                                            {/*<Grid item xs={4}>
                                                <MDTypography
                                                    sx={{
                                                        fontSize: isSmallScreen
                                                            ? '0.5rem' : '1rem'
                                                    }}
                                                    variant="body2"
                                                              textAlign="right">
                                                    {market.marketDetail}
                                                </MDTypography>
                                            </Grid>*/}
                                        </Grid>
                                        <Grid container>
                                            <Grid item xs={9} >
                                                <MDTypography
                                                    sx={{
                                                        fontSize: '0.75rem',  // Adjust font size
                                                    }}
                                                    variant="body2">{market.marketAddr}</MDTypography>
                                            </Grid>
                                            <Grid item xs={3}
                                                  sx={{textAlign: 'right'}}>
                                                <Button
                                                    onClick={() => handleDetail(
                                                        market)}
                                                    sx={{
                                                        padding: '0px 8px',
                                                        mr: '-10px',
                                                        mt: '-16px',
                                                        fontFamily: 'JalnanGothic',
                                                    }}
                                                >상세보기</Button>
                                            </Grid>
                                        </Grid>
                                        <div className="w-full justify-center flex flex-col m-auto items-center">
                                            {market.imageList.map((imgUrl, i) => (
                                                <img
                                                    alt="product"
                                                    key={i}
                                                    width={270}
                                                    src={imgUrl.imageUrl}
                                                    onClick={() => handleDetail(market)}
                                                    style={{ cursor: 'pointer' }}
                                                />
                                            ))}
                                        </div>
                                    </MDBox>
                                </Card>
                            </MDBox>
                        </Grid>
                    ))

                ) : (
                    <Grid item xs={12}>
                        <MDTypography
                            variant="body2"
                            textAlign="center"
                            sx={{fontSize: isSmallScreen ? '1.0rem':'1.28rem', pt: 2}}
                        >
                            {isSearchActive
                                ? '검색한 시장이 존재하지 않습니다.'
                                : selectedCategory
                                    ? '선택한 지역의 시장이 존재하지 않습니다.'
                                    : (isAdmin
                                        ? <Button onClick={handleAddMarket}
                                            variant="contained"
                                            color="error">
                                            시장 추가
                                        </Button>
                                        : '시장을 로딩 중입니다...')}
                        </MDTypography>
                    </Grid>
                )}
            </Grid>

            {/* 위쪽 화살표 아이콘 */}
            <IconButton
                onClick={scrollToTop}
                sx={{
                    position: 'fixed',
                    bottom: '20px',
                    right: '20px',
                    backgroundColor: '#50bcdf',
                    color: '#ffffff',
                    zIndex: 2000, // 다른 요소들보다 위에 위치
                    '&:hover': {
                        backgroundColor: '#33a3d0',
                    },
                    '@media (max-width: 600px)': { // 모바일에 대한 스타일링
                        bottom: '70px',  // 모바일에서의 위치 조정
                        right: '15px',   // 모바일에서의 위치 조정
                    }
                }}
            >
                <KeyboardArrowUpIcon />
            </IconButton>

            {/* Pagination */}
            {/* 무한스크롤 사용으로 페이징 버튼 제거 */}
            {/*{currentTotalPage > 0 && (
                <MDPagination size={"small"}>
                    <MDPagination item onClick={() => changePage(page - 1)}
                                  disabled={page === 0}>
                        <KeyboardArrowLeftIcon/>
                    </MDPagination>
                    {[...Array(
                        isSearchActive ? searchTotalPage : (selectedCategory
                            ? categoryTotalPage : totalPage)).keys()].map(
                        (i) => (
                            <MDPagination item onClick={() => changePage(i)}
                                          key={i}>
                                {i + 1}
                            </MDPagination>
                        ))}
                    <MDPagination item onClick={() => changePage(page + 1)}
                                  disabled={page === (isSearchActive
                                          ? searchTotalPage : (selectedCategory
                                              ? categoryTotalPage : totalPage))
                                      - 1}>
                        <KeyboardArrowRightIcon/>
                    </MDPagination>
                </MDPagination>
            )}*/}
        </DashboardLayout>
    );
}

export default Market;