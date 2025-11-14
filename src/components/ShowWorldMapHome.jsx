import React from 'react';
import WorldMap from "@/components/ui/world-map";

const ShowWorldMapHome = () => {
    return <WorldMap
    dots={[
        {
            start: {
                lat: 64.2008,
                lng: -149.4937,
            }, // Alaska (Fairbanks)
            end: {
                lat: 34.0522,
                lng: -118.2437,
            }, // Los Angeles
        },
        {
            start: {
                lat: 18.0,
                lng: 60.0,
            }, // Iran
            end: {
                lat: -44.0522,
                lng: 138.2437,
            }, // Australia
        },
        {
            start: { lat: 64.2008, lng: -149.4937 }, // Alaska (Fairbanks)
            end: { lat: -15.7975, lng: -47.8919 }, // Brazil (Brasília)
        },
        {
            start: { lat: -15.7975, lng: -47.8919 }, // Brazil (Brasília)
            end: { lat: 38.7223, lng: -9.1393 }, // Lisbon
        },
        {
            start: { lat: 51.5074, lng: -0.1278 }, // London
            end: { lat: 28.6139, lng: 77.209 }, // New Delhi
        },
        {
            start: { lat: 28.6139, lng: 77.209 }, // New Delhi
            end: { lat: 43.1332, lng: 131.9113 }, // Vladivostok
        },
        {
            start: { lat: 28.6139, lng: 77.209 }, // New Delhi
            end: { lat: -1.2921, lng: 36.8219 }, // Nairobi
        },
    ]}/>;
}


export default ShowWorldMapHome;