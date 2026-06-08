/**
 * Services Data - Dashboard Portal
 * 
 * Static data for media services displayed on the Services page.
 * Each service has a name, logo, category, and description.
 * 
 * @added 2026-02-07
 */
import {
    Video,
    Smartphone,
    BookOpen,
    Briefcase,
    Zap,
    Film,
    Camera,
    PlayCircle
} from 'lucide-react'

export const services = [
    {
        name: 'Professional Video Editing',
        logo: <Video className="h-6 w-6" />,
        category: 'Specialty',
        desc: 'High-quality video editing that transforms raw footage into polished, engaging content. From sports highlights to cinematic visuals.',
    },
    {
        name: 'Social Media Content',
        logo: <Smartphone className="h-6 w-6" />,
        category: 'Specialty',
        desc: 'Scroll-stopping reels, stories, and posts optimized for every platform. Quick turnarounds without compromising quality.',
    },
    {
        name: 'Brand Storytelling',
        logo: <BookOpen className="h-6 w-6" />,
        category: 'Specialty',
        desc: 'Compelling narratives that connect your brand with your audience. We craft stories that resonate and inspire action.',
    },
    {
        name: 'Corporate & Marketing Videos',
        logo: <Briefcase className="h-6 w-6" />,
        category: 'Specialty',
        desc: 'Professional corporate content, promotional videos, and marketing campaigns that elevate your business presence.',
    },
    {
        name: 'Motion Graphics & VFX',
        logo: <Zap className="h-6 w-6" />,
        category: 'Specialty',
        desc: 'Dynamic motion graphics and visual effects that add polish and impact to your content.',
    },
]
