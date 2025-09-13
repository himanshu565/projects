import { Button } from "./ui/button.js"

export default function Header() {
  return (
    <header className="border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <h1 className="text-2xl font-bold text-primary">TBD</h1>
            </div>
          </div>

          <nav className="hidden md:block">
            <div className="ml-10 flex items-baseline space-x-8">
              <a
                href="#features"
                className="text-foreground hover:text-primary px-3 py-2 text-sm font-medium transition-colors"
              >
                Features
              </a>
              <a
                href="#how-it-works"
                className="text-foreground hover:text-primary px-3 py-2 text-sm font-medium transition-colors"
              >
                How It Works
              </a>
              <a
                href="#pricing"
                className="text-foreground hover:text-primary px-3 py-2 text-sm font-medium transition-colors"
              >
                Pricing
              </a>
              <a
                href="#contact"
                className="text-foreground hover:text-primary px-3 py-2 text-sm font-medium transition-colors"
              >
                Contact
              </a>
            </div>
          </nav>

          <div className="flex items-center space-x-4">
            <Button variant="ghost" className="text-foreground hover:text-primary">
              Sign In
            </Button>
            <Button className="bg-primary text-primary-foreground hover:bg-primary/90">Get Started</Button>
          </div>
        </div>
      </div>
    </header>
  )
}
