"use client"
import { foodgrainData } from "@/data/foodgrains"
import type { Foodgrain } from "@/types/foodgrain"

interface TimelineProps {
  onSelectYear: (year: number) => void
  selectedYear: number | null
}

export default function Timeline({ onSelectYear, selectedYear }: TimelineProps) {
  // Sort foodgrains by year (descending for BCE, so -10000 comes before -3000)
  // For BCE years, more negative means earlier in time
  const sortedGrains = [...foodgrainData].sort((a, b) => (a.yearNumber || 0) - (b.yearNumber || 0))

  // Group grains by year for proper display
  const grainsByYear = sortedGrains.reduce(
    (acc, grain) => {
      const year = grain.yearNumber || 0
      if (!acc[year]) {
        acc[year] = []
      }
      acc[year].push(grain)
      return acc
    },
    {} as Record<number, Foodgrain[]>,
  )

  // Get earliest and latest years
  const earliestYear = sortedGrains[0]?.yearNumber || -10000
  const latestYear = sortedGrains[sortedGrains.length - 1]?.yearNumber || -3000

  // Calculate position on timeline - for BCE years, we need to invert the logic
  // Larger negative numbers (earlier dates) should be on the left
  const getPosition = (year: number) => {
    const range = latestYear - earliestYear
    // The formula below will place -10000 at 0% and -3000 at 100%
    // We need to invert this calculation
    const position = 100 - ((year - earliestYear) / range) * 100
    return `${position}%`
  }

  return (
    <div className="w-full bg-amber-50 border-t-2 border-amber-900 p-4 relative">
      <h3 className="text-amber-900 font-serif text-lg mb-2 text-center">Timeline of Domestication</h3>

      {/* Timeline bar */}
      <div className="h-1 bg-amber-300 w-full relative mb-8">
        {/* Year markers - using Object.entries to handle years with multiple grains */}
        {Object.entries(grainsByYear).map(([yearStr, grains]) => {
          const year = Number.parseInt(yearStr)
          return (
            <div
              key={yearStr}
              className={`absolute transform -translate-x-1/2 cursor-pointer group`}
              style={{ left: getPosition(year) }}
              onClick={() => onSelectYear(year)}
            >
              <div
                className={`w-3 h-3 rounded-full ${selectedYear === year ? "bg-amber-900" : "bg-amber-600"} 
                         hover:bg-amber-900 hover:scale-125 transition-all duration-300`}
              ></div>
              <div
                className="hidden group-hover:block absolute bottom-full mb-1 bg-amber-100 border border-amber-300 
                          rounded px-2 py-1 text-xs text-amber-900 whitespace-nowrap transform -translate-x-1/2 z-10"
              >
                {grains.length === 1 ? (
                  `${grains[0].name}: ${grains[0].year}`
                ) : (
                  <>
                    {grains.map((g, i) => (
                      <span key={g.name}>
                        {g.name}
                        {i < grains.length - 1 ? ", " : ""}
                      </span>
                    ))}
                    : {grains[0].year}
                  </>
                )}
              </div>
            </div>
          )
        })}

        {/* Year labels */}
        <div className="absolute left-0 -bottom-6 text-xs text-amber-800">
          {Math.abs(earliestYear).toLocaleString()} BCE
        </div>
        <div className="absolute right-0 -bottom-6 text-xs text-amber-800">
          {Math.abs(latestYear).toLocaleString()} BCE
        </div>
      </div>

      {/* Selected grain info */}
      {selectedYear && (
        <div className="text-center text-sm text-amber-800 italic">
          {sortedGrains
            .filter((g) => g.yearNumber === selectedYear)
            .map((grain, index, array) => (
              <span key={grain.name}>
                {grain.name}
                {index < array.length - 1 && " and "}
              </span>
            ))}{" "}
          {sortedGrains.filter((g) => g.yearNumber === selectedYear).length > 1 ? "were" : "was"} domesticated around{" "}
          {sortedGrains.find((g) => g.yearNumber === selectedYear)?.year}
        </div>
      )}
    </div>
  )
}
