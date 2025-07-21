
import { Header } from "@/components/layout/Header";

export function PlaygroundPage() {
  return (
    <div className="flex flex-col h-full">
      <Header title="Playground" />
      <div className="flex-1 p-4 sm:p-6 lg:p-8">
        <div className="p-8 border-2 border-dashed border-muted rounded-lg text-center flex flex-col items-center justify-center h-64">
            <h3 className="text-xl font-semibold mb-2">Welcome to the Playground</h3>
            <p className="text-muted-foreground mb-4">Generate content on demand.</p>
        </div>
      </div>
    </div>
  );
}
