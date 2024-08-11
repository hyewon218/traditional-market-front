import React, { useEffect, useRef, useState } from 'react';
import Modal from '@mui/material/Modal';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';

const ParkingModal = ({ open, onClose, marketNo }) => {
    const mapRef = useRef(null);
    const [mapLoaded, setMapLoaded] = useState(false);
    const [naver, setNaver] = useState(null);
    const [marketData, setMarketData] = useState(null);

    useEffect(() => {
        if (!mapLoaded) {
            const loadNaverMaps = () => {
                const script = document.createElement('script');
                script.src = 'https://openapi.map.naver.com/openapi/v3/maps.js?ncpClientId=wbg83yihp2'; // 여기에 올바른 클라이언트 ID를 넣으세요
                script.async = true;
                script.onload = () => {
                    console.log('Naver Maps API script loaded successfully');
                    setNaver(window.naver);
                    setMapLoaded(true);
                };
                script.onerror = () => {
                    console.error('Failed to load Naver Maps API script');
                };
                document.head.appendChild(script);
            };

            loadNaverMaps();
        }
    }, [mapLoaded]);

    useEffect(() => {
        if (marketNo) {
            fetch(`/api/markets/${marketNo}`)
                .then(response => response.json())
                .then(data => {
                    setMarketData(data);
                    console.log('Market data fetched:', data);
                })
                .catch(error => console.error('Failed to fetch market data:', error));
        }
    }, [marketNo]);

    useEffect(() => {
        if (mapLoaded && naver && naver.maps && mapRef.current && marketData) {
            initializeMap(naver.maps, marketData);
        }
    }, [mapLoaded, naver, marketData]);

    const initializeMap = (maps, data) => {
        if (!mapRef.current) return;

        const locations = [];
        if (data.parkingInfo1) {
            locations.push({ address: data.parkingInfo1, type: '주차' });
        }
        if (data.parkingInfo2) {
            locations.push({ address: data.parkingInfo2, type: '주차' });
        }
        if (data.parkingInfo3) {
            locations.push({ address: data.parkingInfo3, type: '주차' });
        }

        // 시장의 주소를 추가
        if (locations.length > 0) {
            locations.push({ address: data.marketAddr, type: '시장' });
        } else {
            onClose(); // 모달 닫기
            alert('주차 정보 주소가 없습니다.');
        }

        console.log('Locations:', locations); // 주차 정보 출력

        // 비동기적으로 모든 지오코딩을 수행
        const geocodePromises = locations.map(location =>
            new Promise((resolve, reject) => {
                maps.Service.geocode({ address: location.address }, (status, response) => {
                    if (status !== maps.Service.Status.OK) {
                        console.error('Geocode error:', status);
                        reject(status);
                    } else {
                        const result = response.v2;
                        const items = result.addresses;
                        if (items.length > 0) {
                            const firstItem = items[0];
                            const x = parseFloat(firstItem.x);
                            const y = parseFloat(firstItem.y);
                            resolve({ lat: y, lng: x, type: location.type, address: location.address });
                        } else {
                            reject('No results found');
                        }
                    }
                });
            })
        );

        Promise.all(geocodePromises).then(markers => {
            const map = new maps.Map(mapRef.current, {
                zoom: 15
            });

            markers.forEach(markerData => {
                const marker = new maps.Marker({
                    position: new maps.LatLng(markerData.lat, markerData.lng),
                    map: map
                });

                const infoWindowContent = markerData.type === '주차'
                    ? `
                        <div style="padding:10px;min-width:200px;line-height:150%;">
                            <h4>주차장</h4>
                            <p>${markerData.address}</p>
                        </div>
                    `
                    : `
                        <div style="padding:10px;min-width:200px;line-height:150%;">
                            <h4>${data.marketName}</h4> <!-- 시장의 이름 표시 -->
                            <p>${markerData.address}</p>
                        </div>
                    `;

                const infoWindow = new maps.InfoWindow({
                    content: infoWindowContent
                });

                maps.Event.addListener(marker, 'click', () => {
                    if (infoWindow.getMap()) {
                        infoWindow.close();
                    } else {
                        infoWindow.open(map, marker);
                    }
                });

                maps.Event.addListener(map, 'click', () => {
                    infoWindow.close();
                });
            });

            // 모든 마커의 위치를 기반으로 지도 중심 조정
            const bounds = new maps.LatLngBounds();
            markers.forEach(location => bounds.extend(new maps.LatLng(location.lat, location.lng)));
            map.fitBounds(bounds);
        }).catch(error => {
            console.error('Error fetching marker locations:', error);
        });
    };

    return (
        <Modal
            open={open}
            onClose={onClose}
            sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}
        >
            <Box
                sx={{
                    width: 500,
                    height: 500,
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    padding: 2,
                    backgroundColor: 'white',
                    position: 'relative'
                }}
            >
                <Typography
                    variant="h5"
                    component="div"
                    sx={{ marginBottom: 2, color: 'black', fontWeight: 'bold' }}
                >
                    주차장 정보
                </Typography>
                <div id="map" ref={mapRef} style={{ width: '100%', height: '100%' }}></div>
            </Box>
        </Modal>
    );
};

export default ParkingModal;
