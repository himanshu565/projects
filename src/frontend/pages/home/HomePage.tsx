import  Header  from "../../components/header.js"
import  HeroSection from "../../components/hero-section.js"
import  FeaturesSection  from "../../components/features-section.js"
import HowItWorksSection  from "../../components/HowItWorksSection.js"
import  Footer  from "../../components/footer.js"

export default function HomePage() {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main>
        <HeroSection />
        <FeaturesSection />
        <HowItWorksSection />
      </main>
      <Footer />
    </div>
  )
}
