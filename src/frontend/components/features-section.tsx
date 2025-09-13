import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card.js"
import { FileText, Users, GitBranch, Cloud, Shield, Edit } from "lucide-react"

const features = [
  {
    title: "Smart Organization",
    description: "Categorize and tag your files for instant access.",
    icon: FileText,
  },
  {
    title: "Built-in Editor",
    description: "Edit markdown, plain text, and more directly in the app.",
    icon: Edit,
  },
  {
    title: "Version Control",
    description: "Track changes and roll back anytime.",
    icon: GitBranch,
  },
  {
    title: "Collaboration",
    description: "Share files, assign roles, and edit together in real-time.",
    icon: Users,
  },
  {
    title: "Cloud Sync",
    description: "Your files are always up-to-date across devices.",
    icon: Cloud,
  },
  {
    title: "Secure & Private",
    description: "Enterprise-grade encryption keeps your files safe.",
    icon: Shield,
  },
]

export default function FeaturesSection() {
  return (
    <section id="features" className="py-20 sm:py-32 bg-muted/30">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl text-balance">
            Powerful Features
          </h2>
        </div>
        <div className="mx-auto mt-16 max-w-7xl">
          <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {features.map((feature) => (
              <Card key={feature.title} className="border-border bg-card hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-center space-x-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                      <feature.icon className="h-6 w-6 text-primary" />
                    </div>
                    <CardTitle className="text-card-foreground">{feature.title}</CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-muted-foreground">{feature.description}</CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
