"use client"

import { useEffect, useState } from "react"
import { MapContainer, TileLayer, ZoomControl, AttributionControl } from "react-leaflet"
import "leaflet/dist/leaflet.css"
import L from "leaflet"
import FoodgrainMarker from "./foodgrain-marker"
import { foodgrainData } from "@/data/foodgrains"

// Fix for Leaflet icons in Next.js
const fixLeafletIcon = () => {
  // @ts-ignore
  delete L.Icon.Default.prototype._getIconUrl

  L.Icon.Default.mergeOptions({
    iconRetinaUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png",
    iconUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png",
    shadowUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png",
  })
}

export default function FoodgrainMap({ selectedYear }: { selectedYear?: number | null }) {
  const [mapReady, setMapReady] = useState(false)
  const [visibleMarkers, setVisibleMarkers] = useState<number[]>([])

  // Filter foodgrains based on selected year
  const filteredGrains = selectedYear
    ? foodgrainData.filter((grain) => (grain.yearNumber || 0) >= selectedYear)
    : foodgrainData

  useEffect(() => {
    // Fix Leaflet icon issues
    fixLeafletIcon()
    setMapReady(true)

    // Force a resize event to ensure the map renders correctly
    window.dispatchEvent(new Event("resize"))

    // Animated introduction of markers
    const timer = setTimeout(() => {
      const markers: number[] = []

      // Sort grains by year for sequential appearance
      const sortedGrains = [...foodgrainData].sort((a, b) => (a.yearNumber || 0) - (b.yearNumber || 0))

      sortedGrains.forEach((_, index) => {
        setTimeout(() => {
          markers.push(index)
          setVisibleMarkers([...markers])
        }, index * 300) // 300ms delay between each marker
      })
    }, 500) // Start after 500ms

    return () => clearTimeout(timer)
  }, [])

  return (
    <div className="w-full h-[600px] relative map-container">
      {/* Decorative frame corners */}
      <div className="absolute top-0 left-0 w-12 h-12 border-t-4 border-l-4 border-amber-900 z-20"></div>
      <div className="absolute top-0 right-0 w-12 h-12 border-t-4 border-r-4 border-amber-900 z-20"></div>
      <div className="absolute bottom-0 left-0 w-12 h-12 border-b-4 border-l-4 border-amber-900 z-20"></div>
      <div className="absolute bottom-0 right-0 w-12 h-12 border-b-4 border-r-4 border-amber-900 z-20"></div>

      {/* Compass rose */}
      <div className="absolute bottom-16 left-6 w-24 h-24 z-20 compass-rose opacity-80">
        <img
          src="/compass-rose.png"
          alt="Compass rose"
          className="w-full h-full"
          onError={(e) => {
            e.currentTarget.style.display = "none"
          }}
        />
      </div>

      <MapContainer
        center={[30, 0]}
        zoom={2}
        style={{ height: "100%", width: "100%" }}
        zoomControl={false}
        className="bg-amber-50 z-10"
        attributionControl={false}
        whenReady={() => {
          console.log("Map is ready")
          // Force a resize event after map is ready
          window.dispatchEvent(new Event("resize"))
        }}
      >
        {/* Using CartoDB Voyager map tiles for a beautiful, detailed map */}
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>, &copy; <a href="https://carto.com/attributions">CARTO</a>'
          url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
        />

        <ZoomControl position="bottomright" />
        <AttributionControl position="bottomleft" prefix={false} />

        {/* Foodgrain markers with animation */}
        {mapReady &&
          filteredGrains.map(
            (grain, index) =>
              visibleMarkers.includes(index) && <FoodgrainMarker key={index} foodgrain={grain} animated={true} />,
          )}

        {/* Decorative title */}
        <div className="absolute top-4 right-4 z-[1000] bg-amber-50 bg-opacity-70 px-3 py-1 rounded border border-amber-900">
          <h2 className="text-amber-900 font-serif text-lg italic">Foodgrains of the Ancient World</h2>
        </div>
      </MapContainer>
    </div>
  )
}
