import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card.js"
import { Upload, Tag, Users, Smartphone } from "lucide-react"

const steps = [
  {
    step: "1",
    title: "Upload Files",
    description: "Drag and drop or import from cloud.",
    icon: Upload,
  },
  {
    step: "2",
    title: "Organize",
    description: "AI tags and categorizes instantly.",
    icon: Tag,
  },
  {
    step: "3",
    title: "Collaborate",
    description: "Invite your team and work together.",
    icon: Users,
  },
  {
    step: "4",
    title: "Access Anywhere",
    description: "Stay synced across devices.",
    icon: Smartphone,
  },
]

export default function HowItWorksSection() {
  return (
    <section id="how-it-works" className="py-20 sm:py-32">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl text-balance">How It Works</h2>
        </div>
        <div className="mx-auto mt-16 max-w-6xl">
          <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {steps.map((step) => (
              <Card key={step.step} className="border-border bg-card text-center relative">
                <CardHeader>
                  <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-primary text-primary-foreground text-2xl font-bold mb-4">
                    {step.step}
                  </div>
                  <div className="flex justify-center mb-4">
                    <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-secondary/10">
                      <step.icon className="h-6 w-6 text-secondary" />
                    </div>
                  </div>
                  <CardTitle className="text-card-foreground">{step.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-muted-foreground">{step.description}</CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
