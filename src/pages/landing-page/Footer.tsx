import { Facebook, Twitter, Youtube, Instagram } from "lucide-react";
import mail from '../../assets/images/mail.png'
import { Button } from "@/components/ui/button";

function Footer() {
  return (
    <footer className="bg-primary dark:bg-black dark:text-white text-sm pb-14 pt-14 md:pt-40 lg:pt-64 font-montserrat text-black relative">
      <div className="hidden lg:w-[78%] md:w-[70%] left-1/2 -translate-x-1/2 md:flex items-center absolute justify-between bg-emerald-200 dark:bg-neutral-900 px-8 z-20 rounded-2xl -top-24">
        <div>
          <h1 className="lg:text-5xl md:text-xl font-semibold">Let's Get Started</h1>
          <p className="lg:text-lg w-2/3">Get Inspired Receive travel discounts, tips, and behind the scenes stories</p>
          <Button className="mt-4 w-2/3">Get Started</Button>
        </div>
        <img src={mail} alt="Mail" className="w-1/2 lg:w-auto" />
      </div>
      <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-8">
        <div className="space-y-4">
          <h2 className="text-2xl font-bold">Travelin</h2>
          <div className="flex gap-4">
            <Facebook />
            <Twitter />
            <Youtube />
            <Instagram />
          </div>
        </div>

        <div>
          <h3 className="font-semibold mb-2">Our Destinations</h3>
          <ul className="space-y-1">
            <li>Canada</li>
            <li>Alaska</li>
            <li>France</li>
            <li>Iceland</li>
          </ul>
        </div>

        <div>
          <h3 className="font-semibold mb-2">Our Activities</h3>
          <ul className="space-y-1">
            <li>Northern Lights</li>
            <li>Cruising & Sailing</li>
            <li>Multi-activities</li>
            <li>Kayaking</li>
          </ul>
        </div>

        <div>
          <h3 className="font-semibold mb-2">Travel Blogs</h3>
          <ul className="space-y-1">
            <li>Bali Travel Guide</li>
            <li>Sri Lanka Travel Guide</li>
            <li>Peru Travel Guide</li>
            <li>Bali Travel Guide</li>
          </ul>
        </div>

        <div>
          <h3 className="font-semibold mb-2">About Us</h3>
          <ul className="space-y-1">
            <li>Our Story</li>
            <li>Work with us</li>
          </ul>
        </div>

        <div>
          <h3 className="font-semibold mb-2">Contact Us</h3>
          <ul className="space-y-1">
            <li>Our Story</li>
            <li>Work with us</li>
          </ul>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
