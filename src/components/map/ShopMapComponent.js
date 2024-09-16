import React, { useEffect } from 'react';
import {useMediaQuery} from "@mui/material";

const ShopMapComponent = ({ containerId, locations, title }) => {
    const isSmallScreen = useMediaQuery('(max-width:600px)');

    useEffect(() => {
        const initializeMap = (containerId, locations, title) => {
            if (!window.naver || !window.naver.maps) {
                console.error('Naver Maps API is not loaded');
                return;
            }

            // 지도 옵션 설정
            const mapOptions = {
                zoom: 7
            };

            // 지도 생성
            const map = new window.naver.maps.Map(containerId, mapOptions);
            const markers = [];

            // 위치 데이터 처리
            locations.forEach((location) => {
                const marker = new window.naver.maps.Marker({
                    position: new window.naver.maps.LatLng(location.latitude, location.longitude),
                    map: map
                });

                const infoWindowContent = `
                 <div style="padding: ${isSmallScreen ? '5px' : '10px'}; 
                                min-width: ${isSmallScreen ? '100px' : '200px'}; 
                                line-height: ${isSmallScreen ? '1.2' : '1.3'}; 
                                font-family: 'JalnanGothic';">
                    <h3 style="font-size:${isSmallScreen ? '0.7em' : '1.1em'};">${location.info}</h3>
                    <h3 style="font-size:${isSmallScreen ? '0.6em' : '1.1em'};">전화번호 : ${location.tel}</h3>
                  </div>
                `;

                const infoWindow = new window.naver.maps.InfoWindow({
                    content: infoWindowContent
                });

                window.naver.maps.Event.addListener(marker, 'click', () => {
                    if (infoWindow.getMap()) {
                        infoWindow.close();
                    } else {
                        infoWindow.open(map, marker);
                    }
                });

                // 마커 외 클릭 시 정보창 닫기
                window.naver.maps.Event.addListener(map, 'click', () => {
                    infoWindow.close();
                });

                // 자동으로 정보창 열기
                infoWindow.open(map, marker);

                markers.push(marker);

                if (markers.length === locations.length) {
                    const bounds = new window.naver.maps.LatLngBounds();
                    markers.forEach((marker) => {
                        bounds.extend(marker.getPosition());
                    });
                    map.fitBounds(bounds);
                }
            });
        };

        // 네이버 지도 API가 로드된 후 초기화
        if (window.naver && window.naver.maps && containerId && locations) {
            initializeMap(containerId, locations, title);
        } else {
            console.error('Naver Maps API is not available');
        }

    }, [containerId, locations, title]);

    return (
        <div
            id={containerId}
            style={{ width: '100%', height: isSmallScreen ? '150px':'270px', borderRadius: '13px'}}

        ></div>
    );
};

export default ShopMapComponent;
