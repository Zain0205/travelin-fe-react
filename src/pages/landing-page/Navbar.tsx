import { useRef, useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Menu, Plane, BedDouble, Heart, User, LogOut, Package } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { Sheet, SheetContent, SheetDescription, SheetFooter, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { useSelector, useDispatch } from "react-redux";
import type { RootState } from "@/redux/store";
import { logoutUser, checkAuthStatus } from "@/redux/slices/authSlice";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import Cookies from "js-cookie";

export default function Navbar({ mode }: any) {
  const headerRef = useRef<HTMLInputElement>(null);
  const [blur, setBlur] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate()
  
  const { user, isAuthenticated } = useSelector((state: RootState) => state.auth);
  const accessToken = Cookies.get("accessToken");
  console.log("Access Token:", accessToken);
  console.log("User:", user);
  console.log("Is Authenticated:", isAuthenticated);

  // Check auth status on component mount if token exists but user is not loaded
  useEffect(() => {
    if (accessToken && !user && !isAuthenticated) {
      dispatch(checkAuthStatus() as any);
    }
  }, [accessToken, user, isAuthenticated, dispatch]);

  window.onscroll = () => {
    if (window.pageYOffset > headerRef.current!.offsetTop) {
      setBlur(true);
    } else {
      setBlur(false);
    }
  };

  const handleLogout = () => {
    dispatch(logoutUser() as any);
    navigate("/")
  };

  const getUserInitials = (name: string) => {
    return name
      .split(' ')
      .map(word => word[0])
      .join('')
      .toUpperCase()
      .substring(0, 2);
  };

  return (
    <header
      ref={headerRef}
      className={`w-full z-40 fixed top-0 left-0 bg-transparent px-5 py-3 lg:px-20 ${blur ? "backdrop-blur-xs" : ""} ${mode == "landing" ? "text-white" : "border-b shadow-b"}`}
    >
      <div className="container relative mx-auto flex gap-4 flex-row lg:grid lg:grid-cols-3 items-center justify-between">
        <div className="gap-4 lg:flex hidden lg:flex-row justify-start items-center ">
          <Link to="/flight/listing">
            <div className="flex gap-x-1">
              <Plane className="h-6 w-6" />
              <span>Find Flight</span>
            </div>
          </Link>
          <Link to="/hotel/listing">
            <div className="flex gap-x-1 hover:text-primary">
              <BedDouble className="h-6 w-6" />
              <span>Find Hotel</span>
            </div>
          </Link>
          <Link to="/package/listing">
            <div className="flex gap-x-1 hover:text-primary">
              <Package className="h-6 w-6" />
              <span>Find Travel</span>
            </div>
          </Link>
        </div>
        
        <div className="flex lg:justify-center">
          <p className="font-semibold text-xl ">Travelin</p>
        </div>
        
        {/* Desktop Navigation */}
        <div className="justify-end w-full gap-4 hidden lg:flex">
          {(isAuthenticated || accessToken) ? (
            // Logged in state
            <div className="flex items-center">
              <Button
                variant="ghost"
                size="sm"
                className="p-2"
                title="Favourites"
              >
                <Heart className="h-5 w-5" />
              </Button>
              
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="flex items-center gap-2 p-2">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={user?.avatar} alt={user?.name} />
                      <AvatarFallback className="bg-primary text-white text-sm">
                        {user?.name ? getUserInitials(user.name) : 'U'}
                      </AvatarFallback>
                    </Avatar>
                    <span className="text-sm font-medium">{user?.name || 'Loading...'}</span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-48">
                  <DropdownMenuItem asChild>
                    <Link to={`/profile`} className="flex items-center gap-2">
                      <User className="h-4 w-4" />
                      Profile
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link to="/favourites" className="flex items-center gap-2">
                      <Heart className="h-4 w-4" />
                      Favourites
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem 
                    onClick={handleLogout}
                    className="flex items-center gap-2 text-red-600"
                  >
                    <LogOut className="h-4 w-4" />
                    Logout
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          ) : (
            // Not logged in state
            <>
              <Button
                className="bg-transparent border-none "
                variant="outline"
                asChild
              >
                <Link to="/login">Sign in</Link>
              </Button>
              <Button asChild>
                <Link to="/register">Get started</Link>
              </Button>
            </>
          )}
        </div>
        
        {/* Mobile Navigation */}
        <div className="lg:hidden">
          <Sheet>
            <SheetTrigger>
              <Menu className="" />
            </SheetTrigger>
            <SheetContent side="left">
              <SheetHeader>
                <SheetTitle className="text-primary">Travelin</SheetTitle>
                <SheetDescription>Find flight and place to stay with travelin</SheetDescription>
              </SheetHeader>
              
              <div className="gap-4 flex flex-col">
                <Link
                  className="px-4 py-2 hover:bg-primary hover:text-white"
                  to="/flight/listing"
                >
                  <div className="flex gap-x-3">
                    <Plane className="h-6 w-6" />
                    <span>Find Flight</span>
                  </div>
                </Link>
                <Link
                  className="px-4 py-2 hover:bg-primary hover:text-white"
                  to="/hotel/listing"
                >
                  <div className="flex gap-x-3">
                    <BedDouble className="h-6 w-6" />
                    <span>Find Hotel</span>
                  </div>
                </Link>
                <Link
                  className="px-4 py-2 hover:bg-primary hover:text-white"
                  to="/package/listing"
                >
                  <div className="flex gap-x-3">
                    <Package className="h-6 w-6" />
                    <span>Find Travel</span>
                  </div>
                </Link>
                
                {(isAuthenticated || accessToken) && (
                  <>
                    <Link
                      className="px-4 py-2 hover:bg-primary hover:text-white"
                      to="/profile"
                    >
                      <div className="flex gap-x-3">
                        <User className="h-6 w-6" />
                        <span>Profile</span>
                      </div>
                    </Link>
                    <Link
                      className="px-4 py-2 hover:bg-primary hover:text-white"
                      to="/favourites"
                    >
                      <div className="flex gap-x-3">
                        <Heart className="h-6 w-6" />
                        <span>Favourites</span>
                      </div>
                    </Link>
                  </>
                )}
              </div>
              
              <SheetFooter>
                {(isAuthenticated || accessToken) ? (
                  <div className="flex flex-col gap-2 w-full">
                    <div className="flex items-center gap-2 p-2">
                      <Avatar className="h-8 w-8">
                        <AvatarImage src={user?.avatar} alt={user?.name} />
                        <AvatarFallback className="bg-primary text-white text-sm">
                          {user?.name ? getUserInitials(user.name) : 'U'}
                        </AvatarFallback>
                      </Avatar>
                      <span className="text-sm font-medium">{user?.name || 'Loading...'}</span>
                    </div>
                    <Button 
                      variant="outline" 
                      onClick={handleLogout}
                      className="w-full"
                    >
                      <LogOut className="h-4 w-4 mr-2" />
                      Logout
                    </Button>
                  </div>
                ) : (
                  <>
                    <Button variant="outline" asChild>
                      <Link to="/login">Sign in</Link>
                    </Button>
                    <Button asChild>
                      <Link to="/register">Get started</Link>
                    </Button>
                  </>
                )}
              </SheetFooter>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}