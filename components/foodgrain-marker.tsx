"use client"

import { useState, useEffect } from "react"
import { Marker, Popup } from "react-leaflet"
import L from "leaflet"
import type { Foodgrain } from "@/types/foodgrain"

// Create a custom icon for the marker with a more beautiful design
const createCustomIcon = (name: string) => {
  // First letter of grain name as a fallback
  const letter = name.charAt(0).toUpperCase()

  // Create an HTML element to render the icon
  const element = document.createElement("div")
  element.className = "custom-marker-icon"
  element.innerHTML = `
    <div style="
      width: 40px;
      height: 40px;
      border-radius: 50%;
      background: radial-gradient(circle, #f3e8c7 0%, #e6b17f 100%);
      border: 2px solid #713f12;
      box-shadow: 0 0 5px rgba(0,0,0,0.3);
      display: flex;
      justify-content: center;
      align-items: center;
      font-family: 'Times New Roman', serif;
      font-size: 16px;
      font-weight: bold;
      color: #713f12;
      transform-origin: center;
    ">${letter}</div>
  `

  return L.divIcon({
    html: element.innerHTML,
    className: "custom-div-icon",
    iconSize: [40, 40],
    iconAnchor: [20, 20],
  })
}

interface FoodgrainMarkerProps {
  foodgrain: Foodgrain
  animated?: boolean
}

export default function FoodgrainMarker({ foodgrain, animated = false }: FoodgrainMarkerProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [opacity, setOpacity] = useState(animated ? 0 : 1)
  const icon = createCustomIcon(foodgrain.name)

  useEffect(() => {
    if (animated) {
      // Fade in the marker
      const timer = setTimeout(() => {
        setOpacity(1)
      }, 100)
      return () => clearTimeout(timer)
    }
  }, [animated])

  return (
    <Marker
      position={[foodgrain.latitude, foodgrain.longitude]}
      icon={icon}
      opacity={opacity}
      eventHandlers={{
        click: () => {
          setIsOpen(true)
        },
      }}
    >
      <Popup className="foodgrain-popup" onClose={() => setIsOpen(false)}>
        <div className="p-2">
          <h3 className="text-lg font-bold text-amber-900 font-serif border-b border-amber-300 pb-1 mb-2">
            {foodgrain.name}
          </h3>
          <div className="text-sm text-amber-800">
            <p className="mb-2">{foodgrain.description}</p>
            {foodgrain.year && <p className="italic text-xs">First domesticated: circa {foodgrain.year}</p>}
            {foodgrain.region && <p className="italic text-xs">Region: {foodgrain.region}</p>}
          </div>
        </div>
      </Popup>
    </Marker>
  )
}
