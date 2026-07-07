import { SmoothScroll } from "@/components/providers/smooth-scroll";
import { CursorGlow } from "@/components/effects/cursor-glow";
import { SplashScreen } from "@/components/effects/splash-screen";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { CartDrawer } from "@/components/layout/cart-drawer";

export default function StoreLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <SplashScreen />
      <CursorGlow />
      <SmoothScroll>
        <Navbar />
        <main>{children}</main>
        <Footer />
        <CartDrawer />
      </SmoothScroll>
    </>
  );
}
