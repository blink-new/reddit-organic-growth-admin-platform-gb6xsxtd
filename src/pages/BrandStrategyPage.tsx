
import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { blink } from '@/blink/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';

interface Brand {
  id: string;
  name: string;
  url: string;
  branding_guide: any;
  growth_strategy: any;
}

export function BrandStrategyPage() {
  const { brandId } = useParams<{ brandId: string }>();
  const [brand, setBrand] = useState<Brand | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchBrand = async () => {
      if (!brandId) return;
      setIsLoading(true);
      try {
        const fetchedBrand = await blink.db.brands.get(brandId);
        // Parse JSON fields
        if (fetchedBrand) {
          const brand = {
            ...fetchedBrand,
            branding_guide: fetchedBrand.branding_guide ? JSON.parse(fetchedBrand.branding_guide as string) : null,
            growth_strategy: fetchedBrand.growth_strategy ? JSON.parse(fetchedBrand.growth_strategy as string) : null,
          };
          setBrand(brand as any);
        }
      } catch (error) {
        console.error('Failed to fetch brand:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchBrand();
  }, [brandId]);

  if (isLoading) {
    return <div className="p-6">Loading strategy...</div>;
  }

  if (!brand) {
    return <div className="p-6">Brand not found.</div>;
  }

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-3xl font-bold">Strategy for {brand.name}</h1>
      
      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Branding Guide</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {brand.branding_guide ? (
              <>
                <div><strong>Brand Name:</strong> {brand.branding_guide.brand_name}</div>
                <div><strong>Target Audience:</strong> {brand.branding_guide.target_audience}</div>
                <div><strong>Voice and Tone:</strong> {brand.branding_guide.voice_and_tone}</div>
                <div><strong>Key Messaging:</strong> {brand.branding_guide.key_messaging}</div>
              </>
            ) : (
              <p>No branding guide available. Generating...</p>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Design Recommendations</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {brand.growth_strategy?.design_recommendations ? (
              <>
                <div><strong>Icon:</strong> {brand.growth_strategy.design_recommendations.icon}</div>
                <div><strong>Header:</strong> {brand.growth_strategy.design_recommendations.header}</div>
                <div><strong>Bio:</strong> {brand.growth_strategy.design_recommendations.bio}</div>
              </>
            ) : (
              <p>No design recommendations available. Generating...</p>
            )}
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Growth Strategy</CardTitle>
        </CardHeader>
        <CardContent>
          {brand.growth_strategy ? (
            <Accordion type="single" collapsible className="w-full">
              <AccordionItem value="communities">
                <AccordionTrigger>Top 10 Communities</AccordionTrigger>
                <AccordionContent>
                  <ul className="list-disc pl-5 space-y-2">
                    {brand.growth_strategy.top_communities?.map((community: any, index: number) => (
                      <li key={index}>
                        <strong>{community.name}:</strong> {community.reason}
                      </li>
                    ))}
                  </ul>
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="posts">
                <AccordionTrigger>5 Initial Post Ideas</AccordionTrigger>
                <AccordionContent>
                <ul className="space-y-4">
                    {brand.growth_strategy.post_ideas?.map((post: any, index: number) => (
                      <li key={index} className="p-2 border-b">
                        <p className="font-semibold">{post.title}</p>
                        <p className="text-sm text-gray-600">{post.body}</p>
                      </li>
                    ))}
                  </ul>
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          ) : (
            <p>No growth strategy available. Generating...</p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
