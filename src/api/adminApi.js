import axios from "axios"
import {API_SERVER_HOST} from "./marketApi"
const prefixApi = `${API_SERVER_HOST}/api`

export const getCountMembers = async () => { // 총 회원 수
    const res = await axios.get(`${prefixApi}/members/admin/count`)
    return res.data
}

export const getCountMarkets = async () => { // 총 시장 수
    const res = await axios.get(`${prefixApi}/admin/markets/count`)
    return res.data
}

export const getCountShops = async () => { // 총 상점 수
    const res = await axios.get(`${prefixApi}/admin/shops/count`)
    return res.data
}

export const getCountShopsByMarket = async (mno) => { // 시장 별 상점 수
    const res = await axios.get(`${prefixApi}/admin/${mno}/shops/count`)
    return res.data
}

export const postCheckAdminPw = async (formData) => { // 삭제 시 비밀번호 확인
    const res = await axios.post(`${prefixApi}/members/myinfo/check`, formData)
    return res.data
}

export const getAllShopByMarketAndCategory = async (pageParam, category, mno, sort) => {
    const { page, size } = pageParam;

    // URL을 조건에 따라 다르게 설정합니다
    const url = category
        ? `${prefixApi}/${mno}/shops/category`
        : `${prefixApi}/${mno}/shops`;

    // 파라미터 설정
    const params = { page, size };
    if (category) {
        params.category = category;
    }
    if (sort) {
        params.sort = sort;
    }

    try {
        const res = await axios.get(url, { params });
        return res.data;
    } catch (error) {
        console.error("상점 목록 조회 오류:", error);
        throw error;
    }
};


export const getAllShop = async ({ pageParam, category, sort }) => {
    const { page, size } = pageParam;

    // URL을 조건에 따라 다르게 설정합니다
    const url = category
        ? `${prefixApi}/shops/category`
        : `${prefixApi}/shops`;

    const params = { page, size };
    if (category) {
        params.category = category;
    }
    if (sort) {
        params.sort = sort;
    }

    try {
        const res = await axios.get(url, { params });
        return res.data;
    } catch (error) {
        console.error("상점 목록 조회 오류:", error);
        throw error;
    }
};

export const getItemsByMultiple = async (pageParam, mno, sno, itemCategory, sort) => { // 특정 시장에 해당하는 상품 목록 조회
    const {page, size} = pageParam

    // URL을 조건에 따라 다르게 설정합니다
    let url = `${prefixApi}/market/${mno}/items`;

    const params = { page, size };
    if (itemCategory && mno) {
        params.sort = sort;
        params.itemCategory = itemCategory;
        url = `${prefixApi}/${mno}/items/category/paging`;
    }
    else if (itemCategory) {
        params.sort = sort;
        params.itemCategory = itemCategory;
        url = `${prefixApi}/items/category`;
    }
    else if (mno && sno) {
        params.sort = sort;
        url = `${prefixApi}/${sno}/items`;
    }

    try {
        const res = await axios.get(url, { params });
        return res.data;
    } catch (error) {
        console.error("상품 목록 조회 오류:", error);
        throw error;
    }
}

// shopNo가 all일 경우
export const getItemsByMarket = async (pageParam, mno, itemCategory, sort) => { // 특정 시장에 해당하는 상품 목록 조회
    const {page, size} = pageParam

    // URL을 조건에 따라 다르게 설정합니다
    let url = `${prefixApi}/market/${mno}/items`;
    console.log("mno : ", mno);
    console.log("itemCategory : ", itemCategory);

    const params = { page, size };
    if (itemCategory && mno) {
        params.sort = sort;
        params.itemCategory = itemCategory;
        url = `${prefixApi}/${mno}/items/category/paging`;
    }
    else if (itemCategory) {
        params.sort = sort;
        params.itemCategory = itemCategory;
        url = `${prefixApi}/items/category`;
    }

    try {
        const res = await axios.get(url, { params });
        return res.data;
    } catch (error) {
        console.error("상품 목록 조회 오류:", error);
        throw error;
    }
}

export const getAllItems = async (pageParam, itemCategory, sort) => { // 전체 상품 조회(카테고리 유무에 따라 url 변경)
    const {page, size} = pageParam

    // URL을 조건에 따라 다르게 설정합니다
    const url = itemCategory
        ? `${prefixApi}/items/category`
        : `${prefixApi}/items`;

    const params = { page, size };
    if (itemCategory) {
        params.itemCategory = itemCategory;
    }
    if (sort) {
        params.sort = sort;
    }

    try {
        const res = await axios.get(url, { params });
        return res.data;
    } catch (error) {
        console.error("상품 목록 조회 오류:", error);
        throw error;
    }
}

export const getTodayVisitor = async () => { // 오늘의 방문자 수
    const res = await axios.get(`${prefixApi}/visitors/today`)
    return res.data
}

export const getTotalVisitor = async () => { // 총 방문자 수
    const res = await axios.get(`${prefixApi}/visitors/total`)
    return res.data
}

export const getShopListSearch = async (pageParam, searchQuery) => {
    const {page, size} = pageParam
    const res = await axios.get(`${prefixApi}/shops/search`, {
        params:
            {page: page, size: size, keyword: searchQuery} // Include the search query parameter
    })
    return res.data
}

export const getItemListSearch = async (pageParam, searchQuery) => {
    const {page, size} = pageParam
    const res = await axios.get(`${prefixApi}/items/search`, {
        params:
            {page: page, size: size, keyword: searchQuery} // Include the search query parameter
    })
    return res.data
}

// 회원 상세 조회
export const getMemberOne = async (memberNo) => {
    const res = await axios.get(`${prefixApi}/myinfo/${memberNo}`)
    return res.data
}

// 회원 권한 수정
export const putMemberRole = async (memberNo, formData) => {
    const header = {headers: {"Content-Type": "application/json"}}
    const res = await axios.put(`${prefixApi}/members/admin/u/${memberNo}`, formData, header)
    return res.data
};

// 회원 삭제
export const deleteMember = async (memberNo) => {
    const res = await axios.delete(`${prefixApi}/members/admin/r/${memberNo}`)
    return res.data;
};

export const getRole = async (role, pageParam) => {
    const {page, size} = pageParam

    // URL을 조건에 따라 다르게 설정
        const url = role
            ? `${prefixApi}/members/admin/role`
            : `${prefixApi}/members`;

        const params = { page, size };

        if (role) {
            params.role = role;
        }

        try {
            const res = await axios.get(url, { params });
            return res.data;
        } catch (error) {
            console.error("회원 목록 조회 오류:", error);
            throw error;
        }

    const res = await axios.get(`${prefixApi}/members/admin/role`, {
        params:
            {page: page, size: size}
    })
    return res.data
}

// 회원 검색
export const getMemberListSearch = async (pageParam, searchQuery) => {
    const {page, size} = pageParam
    const res = await axios.get(`${prefixApi}/members/search`, {
        params:
            {page: page, size: size, keyword: searchQuery} // Include the search query parameter
    })
    return res.data
}

// 전체 문의사항 목록 조회(관리자)
export const getAllInquiries = async (pageParam) => {
    const {page, size, sort} = pageParam
    const res = await axios.get(`${prefixApi}/inquiries`, {
        params:
            {page: page, size: size, sort: sort}
    });
    return res.data
}

// 문의사항 전체 삭제
export const deleteAllInquiry = async () => {
    const res = await axios.delete(`${prefixApi}/inquiries`)
    return res.data
}


// 권한 admin인지 확인
export const getIsAdmin = async () => {
    const res = await axios.get(`${prefixApi}/members/check-admin`)
    return res.data
}
