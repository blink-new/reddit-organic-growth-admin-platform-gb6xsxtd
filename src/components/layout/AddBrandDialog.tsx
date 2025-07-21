
import { useState } from 'react';
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from '@/hooks/use-toast';
import { blink } from '@/blink/client';

interface AddBrandDialogProps {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
}

export function AddBrandDialog({ isOpen, onOpenChange }: AddBrandDialogProps) {
  const [url, setUrl] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async () => {
    if (!url) {
      toast({ title: 'URL is required', variant: 'destructive' });
      return;
    }

    setIsLoading(true);
    try {
      const user = await blink.auth.me();
      if (!user) throw new Error('User not authenticated');

      // Call the deployed Blink edge function to generate strategy
      const functionUrl = `https://reddit-organic-growth-admin-platform-gb6xsxtd.functions.blink.new/generate-strategy`;
      
      try {
        const response = await fetch(functionUrl, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${blink.auth.getToken()}`
          },
          body: JSON.stringify({ url })
        });

        if (!response.ok) {
          throw new Error('Failed to generate strategy');
        }

        const strategyData = await response.json();
        
        // Create brand with generated strategy
        await blink.db.brands.create({
          id: `brand_${Date.now()}`,
          userId: user.id,
          name: strategyData.brandName || new URL(url).hostname,
          url: url,
          brandingGuide: JSON.stringify(strategyData.brandingGuide || {}),
          growthStrategy: JSON.stringify(strategyData.growthStrategy || {}),
          createdAt: new Date().toISOString()
        });

        toast({ title: 'Brand strategy generated successfully!' });
      } catch (error) {
        console.error('Error generating strategy:', error);
        // Fallback: create brand without strategy
        await blink.db.brands.create({
          id: `brand_${Date.now()}`,
          userId: user.id,
          name: new URL(url).hostname,
          url: url,
          brandingGuide: JSON.stringify({}),
          growthStrategy: JSON.stringify({}),
          createdAt: new Date().toISOString()
        });

        toast({ title: 'Brand added (strategy generation failed)', description: 'Brand was added but strategy could not be generated.' });
      }
      
      onOpenChange(false);
      setUrl('');
    } catch (error) {
      console.error('Failed to add brand:', error);
      toast({ title: 'Failed to add brand', description: error.message, variant: 'destructive' });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Add New Brand</DialogTitle>
          <DialogDescription>
            Enter the URL of the brand you want to grow on Reddit.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="url" className="text-right">
              Brand URL
            </Label>
            <Input 
              id="url" 
              placeholder="https://example.com" 
              className="col-span-3" 
              value={url}
              onChange={(e) => setUrl(e.target.value)}
            />
          </div>
        </div>
        <DialogFooter>
          <Button onClick={handleSubmit} disabled={isLoading}>
            {isLoading ? 'Adding...' : 'Generate Strategy'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
