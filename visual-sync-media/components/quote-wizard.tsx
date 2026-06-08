"use client"

import * as React from "react"
import { ArrowLeft, Sparkles } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { useAuth } from "@/hooks/use-auth"
import { useMutation } from "convex/react"
import { api } from "@/convex/_generated/api"

interface QuoteWizardData {
    step: number
    service?: "talking-head" | "music-videos" | "podcasts" | "social-media"
    projectHeadline?: string
    coreRequirements?: string
    rawAssetsLink?: string
    targetPlatforms?: string[]
    stylePreset?: "cinematic" | "corporate" | "social" | "documentary" | "viral" | "minimal"
}

const STEPS = [
    { number: 1, title: "SERVICE", description: "Choose your production" },
    { number: 2, title: "REQUIREMENTS", description: "Define scope" },
    { number: 3, title: "VISUAL STYLE", description: "Set aesthetic" },
    { number: 4, title: "REVIEW", description: "Confirm details" },
]

const SERVICES = [
    {
        id: "talking-head",
        title: "TALKING HEAD",
        subtitle: "CORPORATE",
        description: "Our bread & butter. Corporate, interviews, testimonials.",
        icon: "🎥",
    },
    {
        id: "music-videos",
        title: "MUSIC VIDEOS",
        subtitle: "CREATIVE",
        description: "High-energy visuals for artists.",
        icon: "🎵",
    },
    {
        id: "podcasts",
        title: "PODCASTS",
        subtitle: "AUDIO/VISUAL",
        description: "Audio + video polish for creators.",
        icon: "🎙️",
    },
    {
        id: "social-media",
        title: "SOCIAL MEDIA",
        subtitle: "MARKETING",
        description: "Reels, TikTok & Shorts that stop the scroll.",
        icon: "📱",
    },
]

const PLATFORMS = ["YOUTUBE", "TIKTOK", "INSTAGRAM", "ADS", "WEBSITE"]

const STYLE_PRESETS = [
    "CINEMATIC",
    "CORPORATE",
    "SOCIAL",
    "DOCUMENTARY",
    "VIRAL",
    "MINIMAL",
]

export function QuoteWizard() {
    const router = useRouter()
    const { user } = useAuth()
    const createOrderMutation = useMutation(api.orders.createOrder)
    const [data, setData] = React.useState<QuoteWizardData>({ step: 1 })
    const [isSubmitting, setIsSubmitting] = React.useState(false)

    const updateData = (updates: Partial<QuoteWizardData>) => {
        setData((prev) => ({ ...prev, ...updates }))
    }

    const goToNextStep = () => {
        if (data.step < 4) {
            updateData({ step: data.step + 1 })
            window.scrollTo(0, 0)
        }
    }

    const goToPreviousStep = () => {
        if (data.step > 1) {
            updateData({ step: data.step - 1 })
            window.scrollTo(0, 0)
        }
    }

    const handleSubmit = async () => {
        if (!user) return

        setIsSubmitting(true)
        try {
            await createOrderMutation({
                title: data.projectHeadline || "Untitled Project",
                service: data.service || "talking-head",
                requirements: data.coreRequirements || "",
                rawAssetsLink: data.rawAssetsLink,
                targetPlatforms: data.targetPlatforms || [],
                stylePreset: data.stylePreset || "corporate",
            })

            // Redirect to orders page
            router.push("/client/orders")
        } catch (error) {
            console.error("Error creating order:", error)
        } finally {
            setIsSubmitting(false)
        }
    }

    return (
        <div className="w-full min-h-screen bg-background">
            {/* Header */}
            <div className="border-b bg-background sticky top-0 z-10 -m-6 p-6 mb-0">
                <div className="flex items-center gap-4">
                    <Link href="/client/orders" className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition">
                        <ArrowLeft className="h-5 w-5" />
                    </Link>
                    <div className="flex-1">
                        <h1 className="text-2xl font-bold text-primary">QUOTE</h1>
                        <p className="text-xs text-muted-foreground">WIZARD</p>
                        <p className="text-xs font-semibold text-foreground">PRECISION PROJECT SCOPING</p>
                    </div>
                </div>
            </div>

            {/* Progress Steps */}
            <div className="border-b bg-muted/30 border-border -mx-6 px-6">
                <div className="flex items-center justify-between py-6">
                    {STEPS.map((step) => (
                        <div
                            key={step.number}
                            className="flex flex-col items-center gap-2 flex-1"
                        >
                            <div
                                className={`flex items-center justify-center h-8 w-8 rounded-full font-bold transition-all ${
                                    data.step >= step.number
                                        ? "bg-primary text-primary-foreground"
                                        : "bg-muted text-muted-foreground"
                                }`}
                            >
                                {step.number}
                            </div>
                            <div className="hidden md:flex flex-col items-center text-center">
                                <p className="text-xs font-bold text-muted-foreground uppercase">
                                    {step.title}
                                </p>
                                <p className="text-xs text-muted-foreground/60">
                                    {step.description}
                                </p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Form Content */}
            <div className="py-10 -mx-6 px-6">
                <Card className="border-0 bg-transparent shadow-none">
                    <CardHeader>
                        <div className="flex items-start gap-4">
                            <div className="bg-primary w-1 h-12 rounded" />
                            <div>
                                <CardTitle className="text-2xl">
                                    STEP {data.step}: {STEPS[data.step - 1].title}
                                </CardTitle>
                                <CardDescription className="text-lg">
                                    {STEPS[data.step - 1].description}
                                </CardDescription>
                            </div>
                        </div>
                    </CardHeader>
                    <CardContent className="space-y-8">
                        {/* Step 1: Service Selection */}
                        {data.step === 1 && (
                            <div className="space-y-4">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    {SERVICES.map((service) => (
                                        <button
                                            key={service.id}
                                            onClick={() =>
                                                updateData({
                                                    service: service.id as QuoteWizardData["service"],
                                                })
                                            }
                                            className={`p-6 rounded-lg border-2 transition-all text-left ${
                                                data.service === service.id
                                                    ? "border-primary bg-primary/5"
                                                    : "border-border hover:border-primary/50"
                                            }`}
                                        >
                                            <div className="text-3xl mb-2">{service.icon}</div>
                                            <div className="font-bold text-primary">
                                                {service.title}
                                            </div>
                                            <div className="text-xs text-muted-foreground font-semibold mb-2">
                                                {service.subtitle}
                                            </div>
                                            <p className="text-sm text-muted-foreground">
                                                {service.description}
                                            </p>
                                        </button>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Step 2: Define Scope */}
                        {data.step === 2 && (
                            <div className="space-y-6">
                                <div className="space-y-2">
                                    <Label htmlFor="headline" className="text-sm font-bold">
                                        PROJECT HEADLINE*
                                    </Label>
                                    <Input
                                        id="headline"
                                        placeholder="e.g. Q1 Product Launch Trailer"
                                        value={data.projectHeadline || ""}
                                        onChange={(e) =>
                                            updateData({ projectHeadline: e.target.value })
                                        }
                                        className="border-gray-200"
                                    />
                                </div>

                                <div className="space-y-2">
                                    <div className="flex items-center justify-between">
                                        <Label htmlFor="requirements" className="text-sm font-bold">
                                            CORE REQUIREMENTS*
                                        </Label>
                                        <button className="text-xs text-primary hover:text-primary/80 font-semibold">
                                            ✨ POLISH WITH AI
                                        </button>
                                    </div>
                                    <Textarea
                                        id="requirements"
                                        placeholder="Be detailed: specific goals, references, tone..."
                                        value={data.coreRequirements || ""}
                                        onChange={(e) =>
                                            updateData({ coreRequirements: e.target.value })
                                        }
                                        className="min-h-32 border-gray-200"
                                    />
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="assets" className="text-sm font-bold">
                                        RAW ASSETS LINK (DRIVE/DROPBOX)
                                    </Label>
                                    <Input
                                        id="assets"
                                        placeholder="Paste your link here"
                                        value={data.rawAssetsLink || ""}
                                        onChange={(e) =>
                                            updateData({ rawAssetsLink: e.target.value })
                                        }
                                        className="border-gray-200"
                                    />
                                </div>
                            </div>
                        )}

                        {/* Step 3: Visual Identity */}
                        {data.step === 3 && (
                            <div className="space-y-8">
                                <div className="space-y-4">
                                    <Label className="text-sm font-bold">TARGET PLATFORM</Label>
                                    <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
                                        {PLATFORMS.map((platform) => (
                                            <button
                                                key={platform}
                                                onClick={() => {
                                                    const current = data.targetPlatforms || []
                                                    const updated = current.includes(platform)
                                                        ? current.filter((p) => p !== platform)
                                                        : [...current, platform]
                                                    updateData({ targetPlatforms: updated })
                                                }}
                                                className={`py-2 px-3 rounded border-2 text-sm font-semibold transition-all ${
                                                    data.targetPlatforms?.includes(platform)
                                                        ? "border-primary bg-primary/10 text-primary"
                                                        : "border-border text-muted-foreground hover:border-primary/30"
                                                }`}
                                            >
                                                {platform}
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                <div className="space-y-4">
                                    <Label className="text-sm font-bold">STYLE PRESET</Label>
                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                        {STYLE_PRESETS.map((preset) => (
                                            <button
                                                key={preset}
                                                onClick={() =>
                                                    updateData({
                                                        stylePreset: preset.toLowerCase() as QuoteWizardData["stylePreset"],
                                                    })
                                                }
                                                className={`py-3 px-4 rounded border-2 font-semibold transition-all ${
                                                    data.stylePreset ===
                                                    preset.toLowerCase()
                                                        ? "border-primary bg-primary/10 text-primary"
                                                        : "border-border text-muted-foreground hover:border-primary/30"
                                                }`}
                                            >
                                                {preset}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Step 4: Review */}
                        {data.step === 4 && (
                            <div className="space-y-6">
                                <div className="bg-primary/5 border border-primary/20 rounded-lg p-6">
                                    <h3 className="font-bold text-primary mb-4">ORDER SUMMARY</h3>
                                    <div className="space-y-3 text-sm">
                                        <div>
                                            <span className="font-semibold text-muted-foreground">Service:</span>
                                            <span className="ml-2 text-foreground">
                                                {data.service?.toUpperCase().replace("-", " ")}
                                            </span>
                                        </div>
                                        <div>
                                            <span className="font-semibold text-muted-foreground">
                                                Project:
                                            </span>
                                            <span className="ml-2 text-foreground">
                                                {data.projectHeadline}
                                            </span>
                                        </div>
                                        <div>
                                            <span className="font-semibold text-muted-foreground">
                                                Platforms:
                                            </span>
                                            <div className="ml-2 flex flex-wrap gap-1 mt-1">
                                                {data.targetPlatforms?.map((p) => (
                                                    <Badge key={p}>{p}</Badge>
                                                ))}
                                            </div>
                                        </div>
                                        <div>
                                            <span className="font-semibold text-muted-foreground">Style:</span>
                                            <span className="ml-2 text-foreground">
                                                {data.stylePreset?.toUpperCase()}
                                            </span>
                                        </div>
                                    </div>
                                </div>

                                <div className="bg-gray-50 rounded-lg p-6">
                                    <h3 className="font-bold text-muted-foreground mb-2">
                                        What happens next?
                                    </h3>
                                    <ul className="text-sm text-muted-foreground space-y-2 list-disc list-inside">
                                        <li>Our team reviews your order and raw assets</li>
                                        <li>
                                            You'll receive a detailed quote within 24 hours
                                        </li>
                                        <li>
                                            Discuss timeline, budget, and revisions with our
                                            team
                                        </li>
                                    </ul>
                                </div>
                            </div>
                        )}

                        {/* Navigation Buttons */}
                        <div className="flex items-center justify-between pt-6 border-t">
                            <Button
                                variant="outline"
                                onClick={goToPreviousStep}
                                disabled={data.step === 1}
                            >
                                PREVIOUS
                            </Button>

                            {data.step === 4 ? (
                                <Button
                                    className="bg-primary hover:bg-primary/90 text-primary-foreground"
                                    onClick={handleSubmit}
                                    disabled={isSubmitting}
                                >
                                    {isSubmitting ? "SUBMITTING..." : "SUBMIT ORDER"}
                                </Button>
                            ) : (
                                <Button
                                    className="bg-primary hover:bg-primary/90 text-primary-foreground"
                                    onClick={goToNextStep}
                                    disabled={
                                        (data.step === 1 && !data.service) ||
                                        (data.step === 2 &&
                                            (!data.projectHeadline ||
                                                !data.coreRequirements)) ||
                                        (data.step === 3 &&
                                            (!data.targetPlatforms?.length ||
                                                !data.stylePreset))
                                    }
                                >
                                    NEXT STAGE
                                </Button>
                            )}
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}
