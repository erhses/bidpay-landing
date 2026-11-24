import Download from '@/components/Download';
import Faq from '@/components/Faq';
import Features from '@/components/Features';
import Footer from '@/components/Footer';
import Header from '@/components/Header';
import Hero from '@/components/Hero';
import Notice from '@/components/Notice';
import Screens from '@/components/Screens';
import ScrollEffects from '@/components/ScrollEffects';
import Split from '@/components/Split';

export default function Page() {
  return (
    <>
      <Notice />
      <div className="page">
        <Header />
        <main id="top">
          <Hero />
          <Split />
          <Features />
          <Screens />
          <Faq />
          <Download />
        </main>
        <Footer />
      </div>
      <ScrollEffects />
    </>
  );
}
