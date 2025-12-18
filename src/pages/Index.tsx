import { Link } from 'react-router-dom';
import { Map, Video, FileText, BarChart3, Shield, Zap, ArrowRight, CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';

const features = [
  {
    icon: Video,
    title: 'Record & Upload',
    description: 'Capture road footage with GPS tracking or upload existing videos for analysis.',
  },
  {
    icon: Zap,
    title: 'AI Detection',
    description: 'YOLO-powered detection identifies potholes, cracks, and road damage instantly.',
  },
  {
    icon: Map,
    title: 'GPS Mapping',
    description: 'Every detection is geotagged for precise location tracking and routing.',
  },
  {
    icon: BarChart3,
    title: 'Severity Analysis',
    description: 'Automated severity scoring prioritizes repairs based on damage assessment.',
  },
  {
    icon: FileText,
    title: 'Reports',
    description: 'Generate comprehensive PDF reports with maps, images, and recommendations.',
  },
  {
    icon: Shield,
    title: 'Admin Dashboard',
    description: 'City-wide heatmaps, user management, and work order assignment.',
  },
];

const benefits = [
  '98% detection accuracy',
  '10x faster inspections',
  'Real-time GPS tracking',
  'Automated severity scoring',
  'PDF/JSON report export',
  'Multi-user organization support',
];

export default function Index() {
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border">
        <div className="container mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary">
              <Map className="h-5 w-5 text-primary-foreground" />
            </div>
            <span className="text-lg font-semibold">RoadInspector</span>
          </div>
          <div className="flex items-center gap-3">
            <Button variant="ghost" asChild>
              <Link to="/login">Sign In</Link>
            </Button>
            <Button asChild>
              <Link to="/signup">Get Started</Link>
            </Button>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="py-20 lg:py-32">
        <div className="container mx-auto px-6 text-center">
          <div className="inline-flex items-center gap-2 rounded-full bg-accent/10 px-4 py-2 text-sm font-medium text-accent mb-8">
            <Zap className="h-4 w-4" />
            AI-Powered Road Analysis
          </div>
          
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight max-w-4xl mx-auto leading-tight">
            Detect Road Damage with{' '}
            <span className="text-accent">Precision AI</span>
          </h1>
          
          <p className="mt-6 text-lg text-muted-foreground max-w-2xl mx-auto">
            Empower your municipal inspectors with YOLO-based detection, GPS tracking, 
            and automated severity assessment. Turn hours of manual inspection into minutes.
          </p>
          
          <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Button size="xl" asChild>
              <Link to="/signup">
                Start Inspecting
                <ArrowRight className="h-5 w-5 ml-2" />
              </Link>
            </Button>
            <Button size="xl" variant="outline" asChild>
              <Link to="/login">View Demo</Link>
            </Button>
          </div>

          {/* Stats */}
          <div className="mt-16 grid grid-cols-3 gap-8 max-w-lg mx-auto">
            {[
              { value: '98%', label: 'Detection Accuracy' },
              { value: '10x', label: 'Faster Analysis' },
              { value: '50+', label: 'Cities Using' },
            ].map((stat) => (
              <div key={stat.label} className="text-center">
                <p className="text-3xl font-bold text-accent">{stat.value}</p>
                <p className="text-sm text-muted-foreground mt-1">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold">Complete Inspection Platform</h2>
            <p className="mt-4 text-muted-foreground max-w-xl mx-auto">
              Everything you need to detect, document, and manage road infrastructure issues.
            </p>
          </div>

          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {features.map((feature) => (
              <div
                key={feature.title}
                className="rounded-xl border border-border bg-card p-6 hover:shadow-lg transition-shadow"
              >
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-accent/10 text-accent mb-4">
                  <feature.icon className="h-6 w-6" />
                </div>
                <h3 className="text-lg font-semibold">{feature.title}</h3>
                <p className="mt-2 text-muted-foreground">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits */}
      <section className="py-20">
        <div className="container mx-auto px-6">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold">Why RoadInspector?</h2>
              <p className="mt-4 text-muted-foreground">
                Built for municipal teams who need accurate, efficient, and actionable road condition data.
              </p>
              
              <div className="mt-8 grid gap-4">
                {benefits.map((benefit) => (
                  <div key={benefit} className="flex items-center gap-3">
                    <CheckCircle className="h-5 w-5 text-success shrink-0" />
                    <span>{benefit}</span>
                  </div>
                ))}
              </div>

              <Button className="mt-8" size="lg" asChild>
                <Link to="/signup">
                  Get Started Free
                  <ArrowRight className="h-4 w-4 ml-2" />
                </Link>
              </Button>
            </div>

            <div className="rounded-2xl border border-border bg-gradient-card p-8">
              <div className="aspect-video rounded-xl bg-muted flex items-center justify-center">
                <Video className="h-16 w-16 text-muted-foreground" />
              </div>
              <p className="text-center text-sm text-muted-foreground mt-4">
                Interactive demo coming soon
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-gradient-hero">
        <div className="container mx-auto px-6 text-center">
          <h2 className="text-3xl font-bold text-primary-foreground">
            Ready to modernize your road inspections?
          </h2>
          <p className="mt-4 text-primary-foreground/80 max-w-xl mx-auto">
            Join municipalities across the country using AI to maintain safer roads.
          </p>
          <Button size="xl" variant="accent" className="mt-8" asChild>
            <Link to="/signup">
              Start Your Free Trial
              <ArrowRight className="h-5 w-5 ml-2" />
            </Link>
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border py-12">
        <div className="container mx-auto px-6">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <Map className="h-5 w-5 text-accent" />
              <span className="font-semibold">RoadInspector</span>
            </div>
            <p className="text-sm text-muted-foreground">
              © 2024 RoadInspector. Municipal Infrastructure Solutions.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
