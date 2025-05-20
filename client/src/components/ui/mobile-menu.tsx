import { useState } from 'react';
import { Link } from 'wouter';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { MenuIcon, X } from 'lucide-react';
import { ThemeToggle } from '@/components/ui/theme-toggle';
import { useAuth } from '@/providers/auth-provider';
import { useAuth as useAuthActions } from '@/lib/auth';
import { useToast } from '@/hooks/use-toast';

interface MobileMenuProps {
  items: { label: string; href: string }[];
}

export function MobileMenu({ items }: MobileMenuProps) {
  const [open, setOpen] = useState(false);
  const { isAuthenticated, user } = useAuth();
  const { logout } = useAuthActions();
  const { toast } = useToast();

  const handleLogout = async () => {
    try {
      await logout();
      setOpen(false);
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
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" className="md:hidden">
          <MenuIcon className="h-6 w-6" />
          <span className="sr-only">Toggle menu</span>
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="w-[300px] sm:w-[400px]">
        <div className="flex flex-col h-full">
          <div className="flex items-center justify-between py-4 border-b">
            <span className="text-lg font-semibold">Menu</span>
            <ThemeToggle />
          </div>
          
          <nav className="flex flex-col py-6 space-y-4">
            {items.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setOpen(false)}
                className="px-2 py-1 hover:bg-accent hover:text-accent-foreground rounded-md transition-colors"
              >
                {item.label}
              </Link>
            ))}
          </nav>
          
          <div className="mt-auto border-t py-4 flex flex-col gap-2">
            {isAuthenticated ? (
              <>
                <div className="text-sm text-muted-foreground mb-2">
                  Signed in as <span className="font-medium text-foreground">{user?.username}</span>
                </div>
                
                <Link 
                  href="/dashboard" 
                  onClick={() => setOpen(false)}
                  className="px-2 py-1 hover:bg-accent hover:text-accent-foreground rounded-md transition-colors"
                >
                  Dashboard
                </Link>
                
                {user?.role === 'admin' && (
                  <Link 
                    href="/admin" 
                    onClick={() => setOpen(false)}
                    className="px-2 py-1 hover:bg-accent hover:text-accent-foreground rounded-md transition-colors"
                  >
                    Admin Panel
                  </Link>
                )}
                
                <Button 
                  variant="outline" 
                  onClick={handleLogout}
                  className="mt-2"
                >
                  Sign out
                </Button>
              </>
            ) : (
              <div className="flex flex-col space-y-2">
                <Link href="/login" onClick={() => setOpen(false)}>
                  <Button variant="outline" className="w-full">Sign in</Button>
                </Link>
                <Link href="/register" onClick={() => setOpen(false)}>
                  <Button className="w-full">Create account</Button>
                </Link>
              </div>
            )}
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
