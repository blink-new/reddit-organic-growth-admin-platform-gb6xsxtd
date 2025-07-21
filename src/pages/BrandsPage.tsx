
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Header } from "@/components/layout/Header";
import { AddBrandDialog } from "@/components/layout/AddBrandDialog";
import { blink } from '@/blink/client';
import { Button } from '@/components/ui/button';

interface Brand {
  id: string;
  name: string;
  url: string;
  createdAt: string;
  userId: string;
  brandingGuide?: string;
  growthStrategy?: string;
}

export function BrandsPage() {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [brands, setBrands] = useState<Brand[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchBrands = async () => {
      try {
        const user = await blink.auth.me();
        if (!user) return;

        const userBrands = await blink.db.brands.list({
          where: { userId: user.id },
          orderBy: { createdAt: 'desc' },
        });
        setBrands(userBrands as any);
      } catch (error) {
        console.error('Failed to fetch brands:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchBrands();
  }, [isDialogOpen]); // Refetch when dialog closes

  return (
    <div className="flex flex-col h-full">
      <Header 
        title="Brands"
        actions={<Button onClick={() => setIsDialogOpen(true)}>Add Brand</Button>}
      />
      <main className="flex-1 p-6">
        {isLoading ? (
          <p>Loading brands...</p>
        ) : brands.length > 0 ? (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {brands.map((brand) => (
              <Link to={`/brand/${brand.id}`} key={brand.id}>
                <div className="p-4 border rounded-lg hover:shadow-md transition-shadow">
                  <h3 className="font-semibold">{brand.name}</h3>
                  <a href={brand.url} target="_blank" rel="noopener noreferrer" className="text-sm text-blue-500">
                    {brand.url}
                  </a>
                  <p className="text-xs text-gray-500 mt-2">Added: {new Date(brand.createdAt).toLocaleDateString()}</p>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="text-center py-10 border-2 border-dashed rounded-lg">
            <h3 className="text-lg font-semibold">No Brands Yet</h3>
            <p className="text-sm text-gray-500">Add your first brand to get started.</p>
            <Button className="mt-4" onClick={() => setIsDialogOpen(true)}>Add Brand</Button>
          </div>
        )}
      </main>
      <AddBrandDialog isOpen={isDialogOpen} onOpenChange={setIsDialogOpen} />
    </div>
  );
}
