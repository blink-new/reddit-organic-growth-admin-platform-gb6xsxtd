
import { Header } from "@/components/layout/Header";

export function TrendsPage() {
  return (
    <div className="flex flex-col h-full">
      <Header title="Trends" />
      <div className="flex-1 p-4 sm:p-6 lg:p-8">
        <div className="p-8 border-2 border-dashed border-muted rounded-lg text-center flex flex-col items-center justify-center h-64">
            <h3 className="text-xl font-semibold mb-2">No Trends Found</h3>
            <p className="text-muted-foreground mb-4">Connect to data sources to view trends.</p>
        </div>
      </div>
    </div>
  );
}
