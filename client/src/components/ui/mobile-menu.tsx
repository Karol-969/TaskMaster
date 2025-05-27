import { useState } from 'react';
import { Link } from 'wouter';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { MenuIcon } from 'lucide-react';
import { ThemeToggle } from '@/components/ui/theme-toggle';

interface MobileMenuProps {
  items: { label: string; href: string }[];
}

export function MobileMenu({ items }: MobileMenuProps) {
  const [open, setOpen] = useState(false);

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
        </div>
      </SheetContent>
    </Sheet>
  );
}
