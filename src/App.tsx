import { useEffect } from 'react'
import { initSmoothScroll } from './lib/smoothScroll'
import Hero from './components/Hero'
import FlythroughSection from './components/FlythroughSection'
import SpecsSection from './components/SpecsSection'
import ApartmentSelector from './components/ApartmentSelector'
import GallerySection from './components/GallerySection'
import LocationSection from './components/LocationSection'
import DeveloperSection from './components/DeveloperSection'
import LeadForm from './components/LeadForm'
import Footer from './components/Footer'

export default function App() {
  useEffect(() => initSmoothScroll(), [])

  return (
    <div className="bg-bg text-sand">
      <a href="#content" className="skip-link">
        דילוג לתוכן
      </a>
      <Hero />
      <main id="content" tabIndex={-1}>
        <FlythroughSection />
        <SpecsSection />
        <ApartmentSelector />
        <GallerySection />
        <LocationSection />
        <DeveloperSection />
        <LeadForm />
      </main>
      <Footer />
    </div>
  )
}
