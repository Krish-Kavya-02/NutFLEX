
import { Link, useLocation } from "react-router-dom";
import { useState } from "react";
import { Menu, X, Film, Tv, Bookmark, Home } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";

const Navbar = () => {
  const [open, setOpen] = useState(false);
  const location = useLocation();
  const currentPath = location.pathname;

  const links = [
    { to: "/", label: "Home", icon: <Home className="h-5 w-5 mr-2" /> },
    { to: "/movies", label: "Movies", icon: <Film className="h-5 w-5 mr-2" /> },
    { to: "/tv", label: "TV Shows", icon: <Tv className="h-5 w-5 mr-2" /> },
    { to: "/bookmarks", label: "Bookmarks", icon: <Bookmark className="h-5 w-5 mr-2" /> },
  ];

  const isActive = (path: string) => {
    if (path === "/" && currentPath === "/") return true;
    if (path !== "/" && currentPath.startsWith(path)) return true;
    return false;
  };

  return (
    <nav className="sticky top-0 z-50 bg-background/95 backdrop-blur-sm border-b">
      <div className="container flex h-16 items-center justify-between">
        <Link to="/" className="flex items-center space-x-2">
          <Film className="h-6 w-6 text-primary" />
          <span className="text-xl font-bold">NutFLEX</span>
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center space-x-1">
          {links.map((link) => (
            <Button
              key={link.to}
              variant={isActive(link.to) ? "secondary" : "ghost"}
              asChild
            >
              <Link to={link.to}>{link.label}</Link>
            </Button>
          ))}
        </div>

        {/* Mobile Navigation */}
        <Sheet open={open} onOpenChange={setOpen}>
          <SheetTrigger asChild className="md:hidden">
            <Button variant="ghost" size="icon">
              <Menu className="h-5 w-5" />
              <span className="sr-only">Toggle menu</span>
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="w-[250px] sm:w-[300px]">
            <nav className="flex flex-col gap-4 mt-8">
              {links.map((link) => (
                <Button
                  key={link.to}
                  variant={isActive(link.to) ? "secondary" : "ghost"}
                  className="justify-start"
                  asChild
                  onClick={() => setOpen(false)}
                >
                  <Link to={link.to}>
                    {link.icon}
                    {link.label}
                  </Link>
                </Button>
              ))}
            </nav>
          </SheetContent>
        </Sheet>
      </div>
    </nav>
  );
};

export default Navbar;
