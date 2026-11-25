export interface Foodgrain {
  name: string
  latitude: number
  longitude: number
  icon: string // Name of the Lucide icon to use
  description: string
  year?: string // Optional year of domestication
  region?: string // Optional region name
  yearNumber?: number // Year as a number for timeline sorting
}
