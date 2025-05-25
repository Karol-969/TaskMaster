import { useState, useEffect } from 'react';
import { Link, useLocation } from 'wouter';
import { Button } from '@/components/ui/button';
import { ThemeToggle } from '@/components/ui/theme-toggle';
import { MobileMenu } from '@/components/ui/mobile-menu';
import { useAuth } from '@/providers/auth-provider';
import { useAuth as useAuthActions } from '@/lib/auth';
import { useToast } from '@/hooks/use-toast';

export function Header() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [location] = useLocation();
  const { isAuthenticated, user } = useAuth();
  const { logout } = useAuthActions();
  const { toast } = useToast();

  const navItems = [
    { label: 'Home', href: '/' },
    { label: 'Artists', href: '/artists' },
    { label: 'Services', href: '/services' },
    { label: 'Events', href: '/events' },
    { label: 'Contact', href: '/contact' },
  ];

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 10) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleLogout = async () => {
    try {
      await logout();
      toast({
        title: "Logged out successfully",
        variant: "default",
      });
    } catch (error) {
      toast({
        title: "Failed to logout",
        description: "Please try again",
        variant: "destructive",
      });
    }
  };

  return (
    <header className={`sticky top-0 z-50 w-full transition-all duration-200 ${
      isScrolled ? 'bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 shadow-sm' : 'bg-background'
    }`}>
      <div className="container mx-auto px-4 h-16">
        <div className="flex h-full items-center justify-between">
          <div className="flex items-center gap-2">
            <Link href="/" className="flex items-center space-x-2">
              <span className="text-2xl font-bold text-accent">Reart</span>
              <span className="text-xl font-medium">Events</span>
            </Link>
          </div>
          
          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`text-sm font-medium transition-colors hover:text-accent ${
                  location === item.href ? 'text-accent' : 'text-foreground'
                }`}
              >
                {item.label}
              </Link>
            ))}
          </nav>
          
          {/* Desktop Auth/Theme */}
          <div className="hidden md:flex items-center space-x-4">
            <ThemeToggle />
            
            {isAuthenticated ? (
              <div className="flex items-center space-x-4">
                <div className="text-sm flex gap-1.5">
                  <a href="/dashboard" className="text-sm font-medium hover:text-accent transition-colors cursor-pointer">
                    Dashboard
                  </a>
                  
                  {user?.role === 'admin' && (
                    <>
                      <span className="text-muted-foreground">|</span>
                      <a href="/admin" className="text-sm font-medium hover:text-accent transition-colors cursor-pointer">
                        Admin Panel
                      </a>
                    </>
                  )}
                </div>
                
                <Button variant="outline" size="sm" onClick={handleLogout}>
                  Sign out
                </Button>
              </div>
            ) : (
              <div className="flex items-center space-x-4">
                <Link href="/login">
                  <Button variant="outline" size="sm">Sign in</Button>
                </Link>
                <Link href="/register">
                  <Button size="sm">Register</Button>
                </Link>
              </div>
            )}
          </div>
          
          {/* Mobile Menu */}
          <div className="md:hidden flex items-center">
            <ThemeToggle className="mr-2" />
            <MobileMenu items={navItems} />
          </div>
        </div>
      </div>
    </header>
  );
}
