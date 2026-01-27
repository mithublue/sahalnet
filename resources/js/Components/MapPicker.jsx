import { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Fix for default marker icon
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
    iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
    iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

export default function MapPicker({ latitude, longitude, onLocationChange }) {
    const mapRef = useRef(null);
    const mapInstanceRef = useRef(null);
    const markerRef = useRef(null);
    const [coords, setCoords] = useState({
        lat: parseFloat(latitude) || 23.8103, // Default to Dhaka, Bangladesh
        lng: parseFloat(longitude) || 90.4125,
    });

    useEffect(() => {
        if (!mapRef.current || mapInstanceRef.current) return;

        // Initialize map
        const map = L.map(mapRef.current).setView([coords.lat, coords.lng], 13);

        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '© OpenStreetMap contributors',
            maxZoom: 19,
        }).addTo(map);

        // Add marker
        const marker = L.marker([coords.lat, coords.lng], {
            draggable: true,
        }).addTo(map);

        // Update coordinates when marker is dragged
        marker.on('dragend', function (e) {
            const position = e.target.getLatLng();
            setCoords({ lat: position.lat, lng: position.lng });
            onLocationChange(position.lat, position.lng);
        });

        // Update marker position when map is clicked
        map.on('click', function (e) {
            const { lat, lng } = e.latlng;
            marker.setLatLng([lat, lng]);
            setCoords({ lat, lng });
            onLocationChange(lat, lng);
        });

        mapInstanceRef.current = map;
        markerRef.current = marker;

        return () => {
            map.remove();
            mapInstanceRef.current = null;
        };
    }, []);

    // Update marker when latitude/longitude props change
    useEffect(() => {
        if (markerRef.current && (latitude !== coords.lat || longitude !== coords.lng)) {
            const newCoords = {
                lat: parseFloat(latitude) || coords.lat,
                lng: parseFloat(longitude) || coords.lng,
            };
            markerRef.current.setLatLng([newCoords.lat, newCoords.lng]);
            mapInstanceRef.current?.setView([newCoords.lat, newCoords.lng], 13);
            setCoords(newCoords);
        }
    }, [latitude, longitude]);

    return (
        <div className="space-y-2">
            <div
                ref={mapRef}
                className="w-full h-96 rounded-lg border border-gray-300 dark:border-gray-700"
            />
            <div className="text-sm text-gray-600 dark:text-gray-400">
                <p>📍 Current Location: {typeof coords.lat === 'number' ? coords.lat.toFixed(6) : '0.000000'}, {typeof coords.lng === 'number' ? coords.lng.toFixed(6) : '0.000000'}</p>
                <p className="text-xs mt-1">Click on the map or drag the marker to set the location</p>
            </div>
        </div>
    );
}
