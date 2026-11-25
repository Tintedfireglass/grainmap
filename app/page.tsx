import { Compass } from "lucide-react"
import MapContainer from "@/components/map-container"

export default function Home() {
  return (
    <main className="min-h-screen bg-amber-50">
      <div className="container mx-auto px-4 py-8">
        <header className="mb-8 text-center">
          <div className="flex items-center justify-center mb-2">
            <Compass className="h-8 w-8 text-amber-800 mr-2" />
            <h1 className="text-4xl font-bold text-amber-900 font-serif">Origins of Domesticated Foodgrains</h1>
          </div>
          <p className="text-amber-800 max-w-2xl mx-auto italic">
            Explore the ancient birthplaces of the grains that sustain humanity. Click on markers to discover their
            stories.
          </p>
        </header>

        <MapContainer />

        <footer className="mt-8 text-center text-amber-700 text-sm">
          
        </footer>
      </div>
    </main>
  )
}
