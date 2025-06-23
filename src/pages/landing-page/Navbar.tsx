import { useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Menu, Plane, BedDouble } from "lucide-react";
import { Link } from "react-router-dom";
import { Sheet, SheetContent, SheetDescription, SheetFooter, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";

export default function Navbar() {
  const headerRef = useRef<HTMLInputElement>(null);
  const [blur, setBlur] = useState(false)

  window.onscroll = () => {
    if (window.pageYOffset > headerRef.current!.offsetTop) {
      setBlur(true);
    } else {
      setBlur(false);
    }
  };

  return (
    <header ref={headerRef} className={`w-full z-40 fixed top-0 left-0 bg-transparent px-5 py-3 lg:px-20 ${blur ? "backdrop-blur-xs" : ""}`}>
      <div className="container relative mx-auto flex gap-4 flex-row lg:grid lg:grid-cols-3 items-center justify-between">
        <div className="gap-4 lg:flex hidden lg:flex-row justify-start items-center text-white">
          <Link to="/">
            <div className="flex gap-x-1">
              <Plane className="h-6 w-6" />
              <span>Find Flight</span>
            </div>
          </Link>
          <Link to="/">
            <div className="flex gap-x-1 hover:text-primary">
              <BedDouble className="h-6 w-6" />
              <span>Find Hotel</span>
            </div>
          </Link>
        </div>
        <div className="flex lg:justify-center">
          <p className="font-semibold text-xl text-white">Travelin</p>
        </div>
        <div className="justify-end w-full gap-4 hidden lg:flex">
          <Button
            className="bg-transparent border-none text-white"
            variant="outline"
          >
            Sign in
          </Button>
          <Button>Get started</Button>
        </div>
        <div className="lg:hidden">
          <Sheet>
            <SheetTrigger>
              <Menu className="text-white" />
            </SheetTrigger>
            <SheetContent side="left">
              <SheetHeader>
                <SheetTitle className="text-primary">Travelin</SheetTitle>
                <SheetDescription>Fined fligh and place to stay with travelin</SheetDescription>
              </SheetHeader>
              <div className="gap-4 flex flex-col">
                <Link
                  className="px-4 py-2 hover:bg-primary hover:text-white"
                  to="/"
                >
                  <div className="flex gap-x-3">
                    <Plane className="h-6 w-6" />
                    <span>Find Flight</span>
                  </div>
                </Link>
                <Link
                  className="px-4 py-2 hover:bg-primary hover:text-white"
                  to="/login"
                >
                  <div className="flex gap-x-3">
                    <BedDouble className="h-6 w-6" />
                    <span>Find Hotel</span>
                  </div>
                </Link>
              </div>
              <SheetFooter>
                <Button variant="outline">Sign in</Button>
                <Button>Get started</Button>
              </SheetFooter>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
