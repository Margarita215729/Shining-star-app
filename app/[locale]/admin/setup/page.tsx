"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { motion } from "framer-motion"
import {
  CheckCircle,
  Copy,
  ExternalLink,
  AlertTriangle,
  Database,
  CreditCard,
  Mail,
  Shield,
  Globe,
  MapPin,
  Settings,
  ArrowRight,
  ArrowLeft,
  Check,
  Loader2,
} from "lucide-react"

interface EnvVariable {
  key: string
  name: string
  description: string
  example: string
  required: boolean
  category: "site" | "database" | "payment" | "email" | "auth" | "location"
  icon: React.ComponentType<{ className?: string }>
  setupInstructions: string[]
  isConfigured?: boolean
}

export default function SetupWizardPage() {
  const [currentStep, setCurrentStep] = useState(0)
  const [copiedKey, setCopiedKey] = useState<string | null>(null)
  const [envStatus, setEnvStatus] = useState<Record<string, boolean>>({})
  const [isVerifying, setIsVerifying] = useState(false)
  const [verificationResults, setVerificationResults] = useState<Record<string, boolean>>({})

  const envVariables: EnvVariable[] = [
    {
      key: "NEXT_PUBLIC_SITE_URL",
      name: "Site URL",
      description: "The public URL where your application will be deployed",
      example: "https://shiningstarphilly.com",
      required: true,
      category: "site",
      icon: Globe,
      setupInstructions: [
        "Use your custom domain if you have one",
        "For development, use http://localhost:3000",
        "For Vercel deployment, use your .vercel.app URL initially",
      ],
    },
    {
      key: "MONGODB_URI",
      name: "MongoDB Connection String",
      description: "Database connection string for storing application data",
      example: "mongodb+srv://username:password@cluster.mongodb.net/shining-star",
      required: true,
      category: "database",
      icon: Database,
      setupInstructions: [
        "Create a MongoDB Atlas account at mongodb.com",
        "Create a new cluster and database",
        "Get the connection string from the 'Connect' button",
        "Replace <password> with your actual database password",
      ],
    },
    {
      key: "STRIPE_SECRET_KEY",
      name: "Stripe Secret Key",
      description: "Secret key for processing payments through Stripe",
      example: "sk_test_51234567890abcdef...",
      required: true,
      category: "payment",
      icon: CreditCard,
      setupInstructions: [
        "Create a Stripe account at stripe.com",
        "Go to Developers > API keys in your Stripe dashboard",
        "Copy the 'Secret key' (starts with sk_test_ for testing)",
        "Use live keys (sk_live_) for production",
      ],
    },
    {
      key: "STRIPE_WEBHOOK_SECRET",
      name: "Stripe Webhook Secret",
      description: "Secret for verifying Stripe webhook events",
      example: "whsec_1234567890abcdef...",
      required: true,
      category: "payment",
      icon: CreditCard,
      setupInstructions: [
        "In Stripe dashboard, go to Developers > Webhooks",
        "Create a new webhook endpoint",
        "Set endpoint URL to: https://yourdomain.com/api/webhooks/stripe",
        "Select events: payment_intent.succeeded, payment_intent.payment_failed",
        "Copy the 'Signing secret' from the webhook details",
      ],
    },
    {
      key: "NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY",
      name: "Stripe Publishable Key",
      description: "Public key for Stripe client-side integration",
      example: "pk_test_51234567890abcdef...",
      required: true,
      category: "payment",
      icon: CreditCard,
      setupInstructions: [
        "In Stripe dashboard, go to Developers > API keys",
        "Copy the 'Publishable key' (starts with pk_test_ for testing)",
        "This key is safe to expose in client-side code",
        "Use live keys (pk_live_) for production",
      ],
    },
    {
      key: "AUTH_SECRET",
      name: "Authentication Secret",
      description: "Secret key for NextAuth.js session encryption",
      example: "your-super-secret-auth-key-here",
      required: true,
      category: "auth",
      icon: Shield,
      setupInstructions: [
        "Generate a random 32+ character string",
        "You can use: openssl rand -base64 32",
        "Or use an online generator for a secure random string",
        "Keep this secret and never share it publicly",
      ],
    },
    {
      key: "RESEND_API_KEY",
      name: "Resend API Key",
      description: "API key for sending transactional emails",
      example: "re_1234567890abcdef...",
      required: true,
      category: "email",
      icon: Mail,
      setupInstructions: [
        "Create a Resend account at resend.com",
        "Go to API Keys in your dashboard",
        "Create a new API key with send permissions",
        "Copy the generated API key (starts with re_)",
      ],
    },
    {
      key: "EMAIL_SERVER_HOST",
      name: "Email Server Host",
      description: "SMTP server hostname for sending emails",
      example: "smtp.resend.com",
      required: true,
      category: "email",
      icon: Mail,
      setupInstructions: [
        "Use smtp.resend.com for Resend",
        "Check your email provider's SMTP settings",
        "Ensure the hostname is correct for your provider",
      ],
    },
    {
      key: "EMAIL_SERVER_PORT",
      name: "Email Server Port",
      description: "SMTP server port (usually 587 for TLS)",
      example: "587",
      required: true,
      category: "email",
      icon: Mail,
      setupInstructions: [
        "Use 587 for TLS (recommended)",
        "Use 465 for SSL",
        "Check your email provider's documentation",
      ],
    },
    {
      key: "EMAIL_SERVER_USER",
      name: "Email Server Username",
      description: "SMTP authentication username",
      example: "resend",
      required: true,
      category: "email",
      icon: Mail,
      setupInstructions: [
        "Use 'resend' for Resend SMTP",
        "Check your email provider's SMTP credentials",
        "This may be your email address for some providers",
      ],
    },
    {
      key: "EMAIL_SERVER_PASSWORD",
      name: "Email Server Password",
      description: "SMTP authentication password",
      example: "re_1234567890abcdef...",
      required: true,
      category: "email",
      icon: Mail,
      setupInstructions: [
        "Use your Resend API key for Resend SMTP",
        "Use your email password for other providers",
        "Consider using app-specific passwords for Gmail",
      ],
    },
    {
      key: "EMAIL_FROM",
      name: "From Email Address",
      description: "Email address used as sender for all emails",
      example: "noreply@yourdomain.com",
      required: true,
      category: "email",
      icon: Mail,
      setupInstructions: [
        "Use a verified domain in Resend",
        "Format: noreply@yourdomain.com",
        "Ensure the domain is properly configured",
      ],
    },
    {
      key: "SERVICE_RADIUS_MILES",
      name: "Service Radius",
      description: "Maximum distance in miles for service delivery",
      example: "10",
      required: true,
      category: "location",
      icon: MapPin,
      setupInstructions: [
        "Set the maximum distance you provide services",
        "Use whole numbers (e.g., 10, 15, 25)",
        "Consider travel time and operational costs",
        "This affects booking availability checks",
      ],
    },
    {
      key: "NEXT_PUBLIC_SERVICE_CENTER_LAT",
      name: "Service Center Latitude",
      description: "Latitude coordinate of your main service center",
      example: "39.9526",
      required: true,
      category: "location",
      icon: MapPin,
      setupInstructions: [
        "Get coordinates from Google Maps",
        "Right-click your location and select coordinates",
        "Use the latitude value (first number)",
        "Philadelphia coordinates: 39.9526, -75.1652",
      ],
    },
    {
      key: "NEXT_PUBLIC_SERVICE_CENTER_LON",
      name: "Service Center Longitude",
      description: "Longitude coordinate of your main service center",
      example: "-75.1652",
      required: true,
      category: "location",
      icon: MapPin,
      setupInstructions: [
        "Get coordinates from Google Maps",
        "Right-click your location and select coordinates",
        "Use the longitude value (second number)",
        "Philadelphia coordinates: 39.9526, -75.1652",
      ],
    },
  ]

  const steps = [
    {
      title: "Welcome",
      description: "Setup your Shining Star application",
    },
    {
      title: "Site Configuration",
      description: "Basic site and language settings",
    },
    {
      title: "Database Setup",
      description: "Configure your MongoDB database",
    },
    {
      title: "Payment Processing",
      description: "Setup Stripe for payments",
    },
    {
      title: "Email Service",
      description: "Configure email notifications",
    },
    {
      title: "Authentication",
      description: "Setup secure authentication",
    },
    {
      title: "Location Settings",
      description: "Configure service area",
    },
    {
      title: "Deployment",
      description: "Deploy to Vercel",
    },
  ]

  const getStepVariables = (step: number) => {
    switch (step) {
      case 1:
        return envVariables.filter((v) => v.category === "site")
      case 2:
        return envVariables.filter((v) => v.category === "database")
      case 3:
        return envVariables.filter((v) => v.category === "payment")
      case 4:
        return envVariables.filter((v) => v.category === "email")
      case 5:
        return envVariables.filter((v) => v.category === "auth")
      case 6:
        return envVariables.filter((v) => v.category === "location")
      default:
        return []
    }
  }

  const verifyEnvironmentVariables = async () => {
    setIsVerifying(true)
    try {
      const response = await fetch("/api/admin/verify-env", {
        method: "POST",
      })
      const data = await response.json()
      setVerificationResults(data.verified || {})
    } catch (error) {
      console.error("Environment verification failed:", error)
    } finally {
      setIsVerifying(false)
    }
  }

  const copyToClipboard = async (text: string, key: string) => {
    try {
      await navigator.clipboard.writeText(text)
      setCopiedKey(key)
      setTimeout(() => setCopiedKey(null), 2000)
    } catch (err) {
      console.error("Failed to copy:", err)
    }
  }

  const checkEnvStatus = () => {
    const status: Record<string, boolean> = {}
    envVariables.forEach((env) => {
      status[env.key] = verificationResults[env.key] || false
    })
    setEnvStatus(status)
  }

  useEffect(() => {
    verifyEnvironmentVariables()
  }, [])

  useEffect(() => {
    checkEnvStatus()
  }, [verificationResults])

  const EnvVariableCard = ({ variable }: { variable: EnvVariable }) => {
    const isConfigured = envStatus[variable.key]
    const Icon = variable.icon

    return (
      <Card className={`transition-all ${isConfigured ? "border-green-200 bg-green-50/50" : ""}`}>
        <CardHeader>
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-3">
              <div
                className={`w-10 h-10 rounded-2xl flex items-center justify-center ${
                  isConfigured ? "bg-green-100" : "bg-primary/10"
                }`}
              >
                <Icon className={`h-5 w-5 ${isConfigured ? "text-green-600" : "text-primary"}`} />
              </div>
              <div>
                <CardTitle className="text-lg flex items-center gap-2">
                  {variable.name}
                  {variable.required && (
                    <Badge variant="destructive" className="text-xs">
                      Required
                    </Badge>
                  )}
                  {isConfigured && <CheckCircle className="h-4 w-4 text-green-600" />}
                </CardTitle>
                <CardDescription>{variable.description}</CardDescription>
              </div>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label className="text-sm font-medium">Environment Variable</Label>
            <div className="flex items-center gap-2 mt-1">
              <Input value={variable.key} readOnly className="font-mono text-sm bg-muted" />
              <Button variant="outline" size="sm" onClick={() => copyToClipboard(variable.key, variable.key)}>
                {copiedKey === variable.key ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
              </Button>
            </div>
          </div>

          <div>
            <Label className="text-sm font-medium">Example Value</Label>
            <div className="flex items-center gap-2 mt-1">
              <Input value={variable.example} readOnly className="font-mono text-sm bg-muted" />
              <Button
                variant="outline"
                size="sm"
                onClick={() => copyToClipboard(variable.example, `${variable.key}-example`)}
              >
                {copiedKey === `${variable.key}-example` ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
              </Button>
            </div>
          </div>

          <div>
            <Label className="text-sm font-medium">Setup Instructions</Label>
            <ul className="mt-2 space-y-1">
              {variable.setupInstructions.map((instruction, index) => (
                <li key={index} className="text-sm text-muted-foreground flex items-start gap-2">
                  <span className="text-primary font-medium">{index + 1}.</span>
                  {instruction}
                </li>
              ))}
            </ul>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="flex flex-col min-h-screen">
      {/* Header */}
      <section className="py-12 bg-gradient-to-br from-primary/5 to-secondary/5 border-b">
        <div className="container max-w-4xl">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center">
                <Settings className="h-6 w-6 text-primary" />
              </div>
              <div>
                <h1 className="text-3xl font-heading font-bold">Setup Wizard</h1>
                <p className="text-muted-foreground">Configure your Shining Star application</p>
              </div>
              <div className="ml-auto">
                <Button onClick={verifyEnvironmentVariables} disabled={isVerifying} variant="outline" size="sm">
                  {isVerifying ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Verifying...
                    </>
                  ) : (
                    <>
                      <CheckCircle className="h-4 w-4 mr-2" />
                      Verify All
                    </>
                  )}
                </Button>
              </div>
            </div>

            {/* Progress Steps */}
            <div className="flex items-center gap-2 overflow-x-auto pb-4">
              {steps.map((step, index) => (
                <div key={index} className="flex items-center flex-shrink-0">
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium transition-colors ${
                      currentStep === index
                        ? "bg-primary text-primary-foreground"
                        : currentStep > index
                          ? "bg-green-500 text-white"
                          : "bg-muted text-muted-foreground"
                    }`}
                  >
                    {currentStep > index ? <Check className="h-4 w-4" /> : index + 1}
                  </div>
                  {index < steps.length - 1 && (
                    <div
                      className={`w-8 h-1 mx-1 transition-colors ${currentStep > index ? "bg-green-500" : "bg-muted"}`}
                    />
                  )}
                </div>
              ))}
            </div>

            <div className="mt-4">
              <h2 className="text-xl font-semibold">{steps[currentStep].title}</h2>
              <p className="text-muted-foreground">{steps[currentStep].description}</p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Content */}
      <section className="flex-1 py-12">
        <div className="container max-w-4xl">
          <motion.div
            key={currentStep}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.4 }}
          >
            {currentStep === 0 && (
              <Card>
                <CardContent className="p-12 text-center">
                  <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-6">
                    <Settings className="h-8 w-8 text-primary" />
                  </div>
                  <h2 className="text-2xl font-heading font-bold mb-4">Welcome to Shining Star Setup</h2>
                  <p className="text-muted-foreground mb-8 max-w-2xl mx-auto">
                    This wizard will guide you through configuring all the necessary environment variables for your
                    cleaning service application. We'll help you set up database connections, payment processing, email
                    services, and more.
                  </p>

                  <Alert className="mb-8 text-left">
                    <AlertTriangle className="h-4 w-4" />
                    <AlertDescription>
                      <strong>Before you start:</strong> Make sure you have accounts set up for MongoDB Atlas, Stripe,
                      and Resend. You'll need API keys from these services.
                    </AlertDescription>
                  </Alert>

                  <div className="grid md:grid-cols-3 gap-4 mb-8">
                    <div className="text-center">
                      <Database className="h-8 w-8 text-primary mx-auto mb-2" />
                      <h3 className="font-semibold">Database</h3>
                      <p className="text-sm text-muted-foreground">MongoDB Atlas</p>
                    </div>
                    <div className="text-center">
                      <CreditCard className="h-8 w-8 text-primary mx-auto mb-2" />
                      <h3 className="font-semibold">Payments</h3>
                      <p className="text-sm text-muted-foreground">Stripe</p>
                    </div>
                    <div className="text-center">
                      <Mail className="h-8 w-8 text-primary mx-auto mb-2" />
                      <h3 className="font-semibold">Email</h3>
                      <p className="text-sm text-muted-foreground">Resend</p>
                    </div>
                  </div>

                  <Button onClick={() => setCurrentStep(1)} size="lg">
                    Start Setup
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </CardContent>
              </Card>
            )}

            {currentStep >= 1 && currentStep <= 6 && (
              <div className="space-y-6">
                {getStepVariables(currentStep).map((variable) => (
                  <EnvVariableCard key={variable.key} variable={variable} />
                ))}
              </div>
            )}

            {currentStep === 7 && (
              <Card>
                <CardContent className="p-12">
                  <div className="text-center mb-8">
                    <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-6">
                      <ExternalLink className="h-8 w-8 text-primary" />
                    </div>
                    <h2 className="text-2xl font-heading font-bold mb-4">Deploy to Vercel</h2>
                    <p className="text-muted-foreground mb-8">
                      Now that you have all your environment variables ready, it's time to deploy your application to
                      Vercel.
                    </p>
                  </div>

                  <div className="space-y-6">
                    <Card className="bg-muted/50">
                      <CardHeader>
                        <CardTitle className="text-lg">Step 1: Create Vercel Project</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <ol className="space-y-2 text-sm">
                          <li>
                            1. Go to{" "}
                            <a
                              href="https://vercel.com"
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-primary hover:underline"
                            >
                              vercel.com
                            </a>{" "}
                            and sign in
                          </li>
                          <li>2. Click "New Project" and import your GitHub repository</li>
                          <li>3. Vercel will automatically detect it's a Next.js project</li>
                        </ol>
                      </CardContent>
                    </Card>

                    <Card className="bg-muted/50">
                      <CardHeader>
                        <CardTitle className="text-lg">Step 2: Add Environment Variables</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <ol className="space-y-2 text-sm mb-4">
                          <li>1. In your Vercel project settings, go to "Environment Variables"</li>
                          <li>2. Add each variable from the previous steps</li>
                          <li>3. Make sure to set the correct environment (Production, Preview, Development)</li>
                        </ol>

                        <div className="bg-background p-4 rounded-2xl border">
                          <Label className="text-sm font-medium">All Environment Variables</Label>
                          <Textarea
                            value={envVariables.map((v) => `${v.key}=${v.example}`).join("\n")}
                            readOnly
                            rows={10}
                            className="mt-2 font-mono text-xs"
                          />
                          <Button
                            variant="outline"
                            size="sm"
                            className="mt-2 bg-transparent"
                            onClick={() =>
                              copyToClipboard(envVariables.map((v) => `${v.key}=${v.example}`).join("\n"), "all-env")
                            }
                          >
                            {copiedKey === "all-env" ? (
                              <>
                                <Check className="mr-2 h-4 w-4" />
                                Copied!
                              </>
                            ) : (
                              <>
                                <Copy className="mr-2 h-4 w-4" />
                                Copy All Variables
                              </>
                            )}
                          </Button>
                        </div>
                      </CardContent>
                    </Card>

                    <Card className="bg-muted/50">
                      <CardHeader>
                        <CardTitle className="text-lg">Step 3: Deploy</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <ol className="space-y-2 text-sm">
                          <li>1. Click "Deploy" in Vercel</li>
                          <li>2. Wait for the build to complete</li>
                          <li>3. Your application will be live at your Vercel URL</li>
                          <li>4. Test all functionality to ensure everything works</li>
                        </ol>
                      </CardContent>
                    </Card>

                    <Alert>
                      <CheckCircle className="h-4 w-4" />
                      <AlertDescription>
                        <strong>Congratulations!</strong> Your Shining Star cleaning service application is now ready
                        for production use.
                      </AlertDescription>
                    </Alert>
                  </div>
                </CardContent>
              </Card>
            )}
          </motion.div>

          {/* Navigation */}
          <div className="flex justify-between mt-8">
            <Button
              variant="outline"
              onClick={() => setCurrentStep(Math.max(0, currentStep - 1))}
              disabled={currentStep === 0}
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Previous
            </Button>

            <Button
              onClick={() => setCurrentStep(Math.min(steps.length - 1, currentStep + 1))}
              disabled={currentStep === steps.length - 1}
            >
              Next
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
        </div>
      </section>
    </div>
  )
}
