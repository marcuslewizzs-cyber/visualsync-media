import { Hero } from '@/components/landing/Hero';
import { VideosOfTheWeek } from '@/components/landing/VideosOfTheWeek';
import { Services } from '@/components/landing/Services';
import { Portfolio } from '@/components/landing/Portfolio';

export default function Home() {
  return (
    <main>
      <Hero />
      <VideosOfTheWeek />
      <Services />
      <Portfolio />
    </main>
  );
}
