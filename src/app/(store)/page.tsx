import { Hero } from "@/components/sections/hero";
import { About } from "@/components/sections/about";
import { FeaturedProduct } from "@/components/sections/featured-product";
import { WhyChooseUs } from "@/components/sections/why-choose-us";
import { ProductShowcase } from "@/components/sections/product-showcase";
import { Reviews } from "@/components/sections/reviews";
import { Recipes } from "@/components/sections/recipes";
import { Faq } from "@/components/sections/faq";
import { Contact } from "@/components/sections/contact";
import { WaveDivider } from "@/components/effects/wave-divider";

export default function HomePage() {
  return (
    <>
      <Hero />
      <About />
      <WaveDivider className="opacity-70" />
      <FeaturedProduct />
      <WhyChooseUs />
      <ProductShowcase />
      <WaveDivider flip className="opacity-70" />
      <Reviews />
      <Recipes />
      <Faq />
      <Contact />
    </>
  );
}
