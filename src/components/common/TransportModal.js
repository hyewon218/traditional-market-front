import React, { useEffect, useRef, useState } from 'react';
import Modal from '@mui/material/Modal';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';

const TransportModal = ({ open, onClose, marketNo }) => {
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
        if (data.busLat && data.busLng) {
            locations.push({ latitude: data.busLat, longitude: data.busLng, type: '버스', info: data.busInfo });
        }
        if (data.subwayLat && data.subwayLng) {
            locations.push({ latitude: data.subwayLat, longitude: data.subwayLng, type: '지하철', info: data.subwayInfo });
        }

        // 시장의 주소를 추가
        if (locations.length > 0) {
            locations.push({ address: data.marketAddr, type: '시장' });
        } else {
            onClose(); // 모달 닫기
            alert('대중교통 정보가 없습니다.');
        }

        console.log('Locations:', locations); // 대중교통 정보 출력

        // 비동기적으로 모든 지오코딩을 수행
        const geocodePromises = locations.map(location => {
            return new Promise((resolve, reject) => {
                if (location.latitude && location.longitude) {
                    // 이미 좌표가 있는 경우
                    resolve({ lat: location.latitude, lng: location.longitude, type: location.type, info: location.info });
                } else if (location.address) {
                    // 주소를 좌표로 변환
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
                                resolve({ lat: y, lng: x, type: location.type, info: location.info, address: location.address });
                            } else {
                                reject('No results found');
                            }
                        }
                    });
                } else {
                    reject('No location information available');
                }
            });
        });

        Promise.all(geocodePromises).then(markers => {
            const map = new maps.Map(mapRef.current, {
                zoom: 15
            });

            const bounds = new maps.LatLngBounds();

            markers.forEach(markerData => {
                const marker = new maps.Marker({
                    position: new maps.LatLng(markerData.lat, markerData.lng),
                    map: map
                });

                const infoWindowContent = markerData.type === '버스' || markerData.type === '지하철'
                    ? `
                        <div style="padding:10px;min-width:200px;line-height:150%;">
                            <h4>${markerData.type} 정보</h4>
                            <p>${markerData.info}</p>
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

                bounds.extend(new maps.LatLng(markerData.lat, markerData.lng));
            });

            // 모든 마커의 위치를 기반으로 지도 중심 조정
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
                    대중교통 정보
                </Typography>
                <div id="map" ref={mapRef} style={{ width: '100%', height: '100%' }}></div>
            </Box>
        </Modal>
    );
};

export default TransportModal;
