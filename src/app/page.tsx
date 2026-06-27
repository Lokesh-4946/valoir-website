import Nav from "@/components/Nav";
import Hero from "@/components/Hero";
import Manifesto from "@/components/Manifesto";
import ProductShowcase from "@/components/ProductShowcase";
import WhyRizz from "@/components/WhyRizz";
import Roadmap from "@/components/Roadmap";
import ValoirOffering from "@/components/ValoirOffering";
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
        <WhyRizz />
        <Roadmap />
        <ValoirOffering />
      </main>
    </>
  );
}
