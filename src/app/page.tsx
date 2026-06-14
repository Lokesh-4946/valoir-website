import Nav from "@/components/Nav";
import Hero from "@/components/Hero";
import Manifesto from "@/components/Manifesto";
import ProductShowcase from "@/components/ProductShowcase";
import OpenSource from "@/components/OpenSource";
import ForDevelopers from "@/components/ForDevelopers";
import Roadmap from "@/components/Roadmap";
import FooterCTA from "@/components/FooterCTA";
import SmoothScroll from "@/components/SmoothScroll";
import ScrollProgress from "@/components/ScrollProgress";
import Cursor from "@/components/Cursor";

export default function Home() {
  return (
    <>
      <SmoothScroll />
      <ScrollProgress />
      <Cursor />
      <Nav />
      <main id="main" tabIndex={-1} className="outline-none">
        <Hero />
        <Manifesto />
        <ProductShowcase />
        <OpenSource />
        <ForDevelopers />
        <Roadmap />
      </main>
      <FooterCTA />
    </>
  );
}
