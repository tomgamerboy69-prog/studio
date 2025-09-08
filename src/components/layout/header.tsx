
import { Logo } from '@/components/icons';
import { SidebarTrigger } from '@/components/ui/sidebar';

export function Header() {
  return (
    <header className="sticky top-0 z-10 flex h-16 items-center gap-4 border-b bg-background px-4 md:px-6">
      <div className="md:hidden">
        <SidebarTrigger />
      </div>
      <div className="flex items-center gap-3">
        <Logo />
        <h1 className="text-2xl font-bold text-foreground font-headline">
          Smart Grocer
        </h1>
      </div>
    </header>
  );
}
