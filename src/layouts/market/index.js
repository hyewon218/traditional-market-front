import * as React from 'react';
import {useEffect, useState} from 'react';
import {useNavigate} from 'react-router';

// @mui material components
import Grid from '@mui/material/Grid';
import Card from '@mui/material/Card';
import KeyboardArrowLeftIcon from '@mui/icons-material/KeyboardArrowLeft';
import KeyboardArrowRightIcon from '@mui/icons-material/KeyboardArrowRight';
import SearchIcon from '@mui/icons-material/Search';
import IconButton from '@mui/material/IconButton';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import Badge from "@mui/material/Badge";

// Material Dashboard 2 React components
import MDBox from '../../components/MD/MDBox';
import MDTypography from '../../components/MD/MDTypography';
import MDPagination from '../../components/MD/MDPagination';

// Material Dashboard 2 React example components
import DashboardLayout from '../../examples/LayoutContainers/DashboardLayout';
import Button from '@mui/material/Button';
import {getList, getListCategory, getListSearch} from "../../api/marketApi";
import MDButton from "../../components/MD/MDButton";
import MDInput from "../../components/MD/MDInput";
import useCustomCart from "../../hooks/useCustomCart";
import useCustomLogin from "../../hooks/useCustomLogin";

function Market() {
    const {isAuthorization} = useCustomLogin()
    const {cartItems, refreshCart} = useCustomCart(); // Use the custom cart hook

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

    const navigate = useNavigate();

    useEffect(() => {
        if (isAuthorization) {
            refreshCart();
        }
    }, []);

    useEffect(() => {
        if (isSearchActive) {
            return;
        }

        if (selectedCategory) {
            fetchCategoryMarkets(0);
        } else {
            fetchMarkets();
        }
    }, [selectedCategory, isSearchActive]);

    const fetchMarkets = (pageNum = 0) => {
        const pageParam = {page: pageNum, size: 8};
        getList(pageParam).then(data => {
            setMarkets(data.content);
            setTotalPage(data.totalPages);
            resetFilters();
        }).catch(error => console.error("시장 목록 조회에 실패했습니다.", error));
    };

    const fetchSearchMarkets = (pageNum) => {
        const pageParam = {page: pageNum, size: 8};
        getListSearch(pageParam, search).then(data => {
            setFilteredMarkets(data.content);
            setSearchTotalPage(data.totalPages);
            setIsSearchActive(true);
        }).catch(error => console.error("시장 검색 조회에 실패했습니다.", error));
    };

    const fetchCategoryMarkets = (pageNum = 0) => {
        const pageParam = {page: pageNum, size: 8};
        getListCategory(pageParam, selectedCategory).then(data => {
            setCategoryMarkets(data.content);
            setCategoryTotalPage(data.totalPages);
        }).catch(error => console.error("시장 카테고리 조회에 실패했습니다.", error));
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

    const handleSearchSubmit = () => {
        setPage(0);
        fetchSearchMarkets(0);
    };

    const handleDetail = (market) => {
        console.log('handleDetail');
        navigate('/market-detail', {state: market});
    };

    const handleCategorySelect = (category) => {
        if (category === "전체") {
            fetchMarkets(0);
        } else {
            setSelectedCategory(category);
            setIsSearchActive(false);
            setPage(0);
        }
    };

    const handleCartIcon = () => {
        navigate('/cart');
    };

    const changePage = (pageNum) => {
        setPage(pageNum);
        if (isSearchActive) {
            fetchSearchMarkets(pageNum);
        } else if (selectedCategory) {
            fetchCategoryMarkets(pageNum);
        } else {
            fetchMarkets(pageNum);
        }
    };

    const renderMarkets = isSearchActive ? filteredMarkets : (selectedCategory
        ? categoryMarkets : markets);
    const currentTotalPage = isSearchActive ? searchTotalPage
        : (selectedCategory ? categoryTotalPage : totalPage);

    return (
        <DashboardLayout>
            {/* 시장 검색 */}
            <MDBox pt={2} pb={5}
                   sx={{display: 'flex', justifyContent: 'center'}}>
                <Card sx={{
                    width: '50%',
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center'
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
                            width: '93%',
                            height: '60px',
                            padding: '10px',
                            borderRadius: '8px',
                            marginRight: '50px',
                            marginLeft: '0px',
                        }}
                    />
                    <IconButton onClick={handleSearchSubmit}
                                sx={{position: 'absolute', right: '15px'}}>
                        <SearchIcon/>
                    </IconButton>
                </Card>
                {/* 장바구니 아이콘 + 장바구니에 담긴 상품 갯수*/}
                <IconButton onClick={handleCartIcon}
                            sx={{position: 'absolute', right: '65px'}}>
                    <Badge badgeContent={cartItems.length} color="primary">
                        <ShoppingCartIcon/>
                    </Badge>
                </IconButton>
            </MDBox>

            {/* 카테고리 */}
            <Grid container spacing={1} justifyContent="center">
                {["전체", "서울", "인천", "경기도", "강원도", "충청도", "경상도", "전라도",
                    "제주도"].map(
                    (category, index) => (
                        <Grid item xs={index < 3 ? 1.0 : 1.15} key={category}>
                            <MDBox>
                                <MDButton
                                    onClick={() => handleCategorySelect(
                                        category)}
                                    variant="gradient"
                                    size="large"
                                    sx={{
                                        backgroundColor: '#50bcdf',
                                        color: '#ffffff',
                                        fontSize: '1.0rem',
                                        fontFamily: 'JalnanGothic'
                                    }}
                                >
                                    {category}
                                </MDButton>
                            </MDBox>
                        </Grid>
                    ))}
            </Grid>

            {/* 시장 목록 조회 */}
            <Grid container pt={2} pb={3}>
                {renderMarkets.length > 0 ? (
                    renderMarkets.map((market, index) => (
                        <Grid item xs={12} sm={6} md={4} lg={3} key={index}>
                            <MDBox pt={2} pb={2} key={market.id}>
                                <Card sx={{
                                    width: '90%',
                                    maxWidth: '350px',
                                    mx: 'auto',
                                    //ml: '-30px'
                                }}>
                                    <MDBox pt={2} pb={2} px={2}>
                                        <Grid container>
                                            <Grid item xs={6}>
                                                <MDTypography fontWeight="bold"
                                                              variant="body2">
                                                    {market.marketName}
                                                </MDTypography>
                                            </Grid>
                                            <Grid item xs={6}>
                                                <MDTypography variant="body2"
                                                              textAlign="right">
                                                    {market.marketDetail}
                                                </MDTypography>
                                            </Grid>
                                        </Grid>
                                        <Grid container >
                                            <Grid item xs={9} pt={1.1}>
                                                <MDTypography
                                                    sx={{
                                                        fontSize: '0.75rem',  // Adjust font size
                                                        //padding: '10px 8px',   // Adjust padding (top-bottom left-right)
                                                    }}
                                                    variant="body2">{market.marketAddr}</MDTypography>
                                            </Grid>
                                            <Grid item xs={3}
                                                  sx={{textAlign: 'right'}}>
                                                <Button
                                                    onClick={() => handleDetail(
                                                        market)}
                                                    sx={{
                                                        padding: '4px 8px', // Adjust these values as needed
                                                        mr: '-10px'
                                                    }}
                                                >Detail</Button>
                                            </Grid>
                                        </Grid>
                                        <div
                                            className="w-full justify-center flex flex-col m-auto items-center">
                                            {market.imageList.map(
                                                (imgUrl, i) => (
                                                    <img alt="product" key={i}
                                                         width={270}
                                                         src={imgUrl.imageUrl}/>
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
                            sx={{fontSize: '1.28rem', pt: 2}}
                        >
                            {isSearchActive
                                ? '검색한 시장이 존재하지 않습니다.'
                                : selectedCategory
                                    ? '선택한 지역의 시장이 존재하지 않습니다.'
                                    : '시장을 로딩 중입니다...'}
                        </MDTypography>
                    </Grid>
                )}
            </Grid>


            {/* Pagination */}
            {currentTotalPage > 0 && (
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
            )}
        </DashboardLayout>
    );
}

export default Market;