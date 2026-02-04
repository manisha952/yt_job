import FeaturedJob from "@/page/FeaturedJob";
import HeroSection from "@/page/HeroSection";
import Navbar from "@/page/Navbar";
import Image from "next/image";
import Footer from "@/page/Footer"
import Category from "@/page/Category";



export default function Home() {
  return (
   <div>
    {/*<Navbar />*/}
    <HeroSection />
    <Category />
    <FeaturedJob />
    {/*<Footer/>*/}
    </div>

  );
}
