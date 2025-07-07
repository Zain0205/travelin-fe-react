import Footer from "./Footer";
import Hero from "./Hero";
import Navbar from "./Navbar";
import TripList from "./TripList";

function LandingPage() {
  return (
    <>
      <Navbar mode="landing" />
      <Hero />
      <TripList />
      <Footer />
    </>
  )
}

export default LandingPage;
