import React, { useState, useEffect, useRef } from 'react';

const CoordinatePopup = ({ onClose }) => {
    const [coordinates, setCoordinates] = useState({ lat: null, lng: null });
    const markerRef = useRef(null);
    const infoWindowRef = useRef(null);
    const mapRef = useRef(null);
    const [mapLoaded, setMapLoaded] = useState(false);
    const [naver, setNaver] = useState(null);

    useEffect(() => {
        const loadNaverMaps = () => {
            const script = document.createElement('script');
            script.src = 'https://openapi.map.naver.com/openapi/v3/maps.js?ncpClientId=wbg83yihp2&submodules=geocoder';
            script.async = true;
            script.onload = () => {
                setNaver(window.naver);
                setMapLoaded(true);
            };
            script.onerror = () => {
                console.error('Failed to load Naver Maps API');
            };
            document.head.appendChild(script);
        };

        loadNaverMaps();
    }, []);

    useEffect(() => {
        if (mapLoaded && naver && naver.maps) {
            const mapOptions = {
                center: new naver.maps.LatLng(37.5665, 126.9780),
                zoom: 15
            };

            const map = new naver.maps.Map('map', mapOptions);
            mapRef.current = map;

            const marker = new naver.maps.Marker({
                map: map,
                position: new naver.maps.LatLng(37.5665, 126.9780),
                draggable: true,
                visible: false
            });
            markerRef.current = marker;

            const infoWin = new naver.maps.InfoWindow({
                content: '',
                backgroundColor: '#ffffff',
                borderColor: '#000000',
                borderWidth: 1,
                anchorSize: new naver.maps.Size(10, 10),
                anchorSkew: true,
                anchorColor: '#000000',
                pixelOffset: new naver.maps.Point(10, -10)
            });
            infoWindowRef.current = infoWin;

            naver.maps.Event.addListener(map, 'click', (e) => {
                const latlng = e.latlng;
                const lat = latlng.lat();
                const lng = latlng.lng();

                marker.setPosition(latlng);
                marker.setVisible(true);

                infoWin.setContent(`
                    <div style="padding:10px;width:200px;">
                        위도: ${lat}<br>경도: ${lng}
                    </div>
                `);
                infoWin.open(map, marker);

                setCoordinates({ lat, lng });

                localStorage.setItem('coordinates', JSON.stringify({ lat, lng }));
            });

            const defaultLatLng = new naver.maps.LatLng(37.5665, 126.9780);
            marker.setPosition(defaultLatLng);
            marker.setVisible(true);

            infoWin.setContent(`
                <div style="padding:10px;width:200px;">
                    위도: 37.5665<br>경도: 126.9780
                </div>
            `);
            infoWin.open(map, marker);

            setCoordinates({ lat: 37.5665, lng: 126.9780 });
        }
    }, [mapLoaded, naver]);

    const handleSearch = () => {
        const address = document.getElementById('search-input').value;
        if (naver && naver.maps) {
            naver.maps.Service.geocode({ address }, (status, response) => {
                if (status === naver.maps.Service.Status.OK) {
                    const { y, x } = response.result.items[0].point;
                    if (mapRef.current) {
                        mapRef.current.setCenter(new naver.maps.LatLng(y, x));
                    }

                    if (markerRef.current) {
                        markerRef.current.setPosition(new naver.maps.LatLng(y, x));
                        markerRef.current.setVisible(true);
                    }

                    if (infoWindowRef.current) {
                        infoWindowRef.current.setContent(`
                            <div style="padding:10px;width:200px;">
                                ${response.result.items[0].address}<br>위도: ${y}<br>경도: ${x}
                            </div>
                        `);
                        infoWindowRef.current.open(mapRef.current, markerRef.current);
                    }

                    setCoordinates({ lat: y, lng: x });

                    localStorage.setItem('coordinates', JSON.stringify({ lat: y, lng: x }));
                } else {
                    alert('검색 결과가 없습니다.');
                }
            });
        }
    };

    const handleKeyDown = (event) => {
        if (event.key === 'Enter') {
            handleSearch();
        }
    };

    const handleFillField = (type) => {
        if (coordinates.lat !== null && coordinates.lng !== null) {
            const coords = { lat: coordinates.lat, lng: coordinates.lng };
            if (window.opener) {
                window.opener.postMessage({ type: `UPDATE_${type.toUpperCase()}_COORDS`, coords }, window.location.origin);
            }
        } else {
            alert('좌표를 먼저 선택하거나 검색하세요.');
        }
    };

    return (
        <div>
            <div id="search">
                <input
                    type="text"
                    id="search-input"
                    placeholder="행정구역만 검색가능합니다"
                    style={{ width: '300px', height: '30px', padding: '10px' }}
                    onKeyDown={handleKeyDown}
                />
                <button onClick={handleSearch}>검색</button>
            </div>
            <div id="map" style={{ width: '500px', height: '400px' }}></div>
            <div id="buttons">
                <button onClick={() => handleFillField('bus')}>버스 필드 채우기</button>
                <button onClick={() => handleFillField('subway')}>지하철 필드 채우기</button>
                <button onClick={() => handleFillField('shop')}>상점 필드 채우기</button>
            </div>
            <button onClick={onClose}>닫기</button>
        </div>
    );
};

export default CoordinatePopup;

