"use client"

import dynamic from "next/dynamic"
import { Suspense, useState } from "react"
import Timeline from "./timeline"

// Dynamically import the map component with no SSR
const FoodgrainMap = dynamic(() => import("@/components/foodgrain-map"), {
  ssr: false,
  loading: () => (
    <div className="h-[600px] bg-amber-100 flex items-center justify-center">
      <p className="text-amber-800">Loading map...</p>
    </div>
  ),
})

export default function MapContainer() {
  const [selectedYear, setSelectedYear] = useState<number | null>(null)

  return (
    <div className="border-8 border-amber-900 rounded-lg overflow-hidden shadow-xl">
      <div className="border-4 border-amber-700 rounded-sm">
        <Suspense
          fallback={<div className="h-[600px] bg-amber-100 flex items-center justify-center">Loading map...</div>}
        >
          <FoodgrainMap selectedYear={selectedYear} />
        </Suspense>
        <Timeline onSelectYear={setSelectedYear} selectedYear={selectedYear} />
      </div>
    </div>
  )
}
