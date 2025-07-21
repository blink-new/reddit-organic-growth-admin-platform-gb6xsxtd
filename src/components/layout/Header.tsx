
import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";

interface HeaderProps {
  title: string;
  showAddBrand?: boolean;
}

export function Header({ title, showAddBrand = false }: HeaderProps) {
  return (
    <header className="bg-background border-b border-border/40">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between h-16">
        <h1 className="text-xl font-semibold text-foreground">{title}</h1>
        {showAddBrand && (
          <Button>
            <PlusCircle className="mr-2 h-4 w-4" />
            Add Brand
          </Button>
        )}
      </div>
    </header>
  );
}
