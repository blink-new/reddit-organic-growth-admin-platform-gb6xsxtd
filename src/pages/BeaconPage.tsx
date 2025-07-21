import { useState, useEffect } from "react";
import { Header } from "@/components/layout/Header";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Progress } from "@/components/ui/progress";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { 
  Radar, 
  Crown, 
  Clock, 
  TrendingUp, 
  MessageSquare, 
  Users, 
  ExternalLink,
  Play,
  Pause,
  RefreshCw,
  Target,
  Zap
} from "lucide-react";
import { blink } from "@/blink/client";

interface Brand {
  id: string;
  name: string;
  url: string;
  growth_strategy?: string;
}

interface Opportunity {
  id: string;
  type: 'post' | 'comment' | 'user';
  title: string;
  subreddit: string;
  author: string;
  content: string;
  relevanceScore: number;
  engagement: {
    upvotes: number;
    comments: number;
  };
  timeAgo: string;
  url: string;
  suggestedAction: string;
  priority: 'high' | 'medium' | 'low';
}

interface ScanStats {
  postsScanned: number;
  opportunitiesFound: number;
  lastScanTime: string;
  isActive: boolean;
  nextScanIn: number;
}

export function BeaconPage() {
  const [brands, setBrands] = useState<Brand[]>([]);
  const [selectedBrand, setSelectedBrand] = useState<Brand | null>(null);
  const [loading, setLoading] = useState(true);
  const [beaconActive, setBeaconActive] = useState(false);
  const [scanProgress, setScanProgress] = useState(0);

  // Mock beacon data
  const mockStats: ScanStats = {
    postsScanned: 2847,
    opportunitiesFound: 23,
    lastScanTime: '2 minutes ago',
    isActive: beaconActive,
    nextScanIn: 8
  };

  const mockOpportunities: Opportunity[] = [
    {
      id: '1',
      type: 'post',
      title: 'Looking for advice on scaling my SaaS startup',
      subreddit: 'r/entrepreneur',
      author: 'u/techfounder',
      content: 'I\'ve built a SaaS product that\'s gaining traction but I\'m struggling with scaling the team and infrastructure. Any advice from experienced founders?',
      relevanceScore: 94,
      engagement: { upvotes: 47, comments: 23 },
      timeAgo: '12 minutes ago',
      url: 'https://reddit.com/r/entrepreneur/post1',
      suggestedAction: 'Share your scaling framework and invite to community',
      priority: 'high'
    },
    {
      id: '2',
      type: 'post',
      title: 'What tools do you use for customer validation?',
      subreddit: 'r/startups',
      author: 'u/validationseeker',
      content: 'I\'m in the early stages of my startup and want to make sure I\'m validating my idea properly. What tools and methods have worked best for you?',
      relevanceScore: 91,
      engagement: { upvotes: 34, comments: 18 },
      timeAgo: '25 minutes ago',
      url: 'https://reddit.com/r/startups/post2',
      suggestedAction: 'Share validation templates and offer free consultation',
      priority: 'high'
    },
    {
      id: '3',
      type: 'comment',
      title: 'Comment on "Best marketing strategies for B2B"',
      subreddit: 'r/marketing',
      author: 'u/marketingstruggle',
      content: 'I\'ve tried content marketing but not seeing much ROI. What other B2B marketing strategies should I consider?',
      relevanceScore: 87,
      engagement: { upvotes: 12, comments: 8 },
      timeAgo: '1 hour ago',
      url: 'https://reddit.com/r/marketing/comment1',
      suggestedAction: 'Provide detailed B2B marketing guide and community invite',
      priority: 'medium'
    },
    {
      id: '4',
      type: 'post',
      title: 'Failed startup - what I learned',
      subreddit: 'r/entrepreneur',
      author: 'u/learnedthehardway',
      content: 'My startup failed after 2 years. Here are the key lessons I learned that I wish I knew earlier...',
      relevanceScore: 83,
      engagement: { upvotes: 156, comments: 67 },
      timeAgo: '2 hours ago',
      url: 'https://reddit.com/r/entrepreneur/post3',
      suggestedAction: 'Engage with supportive comment and share failure recovery resources',
      priority: 'medium'
    },
    {
      id: '5',
      type: 'user',
      title: 'Active user seeking mentorship',
      subreddit: 'r/startups',
      author: 'u/aspiringfounder',
      content: 'Looking for experienced entrepreneurs who can provide guidance on my journey...',
      relevanceScore: 79,
      engagement: { upvotes: 8, comments: 4 },
      timeAgo: '3 hours ago',
      url: 'https://reddit.com/u/aspiringfounder',
      suggestedAction: 'Direct message offering mentorship and community access',
      priority: 'low'
    }
  ];

  useEffect(() => {
    const fetchBrands = async () => {
      try {
        const brandsData = await blink.db.brands.list({
          orderBy: { created_at: 'desc' }
        });
        setBrands(brandsData);
        if (brandsData.length > 0) {
          setSelectedBrand(brandsData[0]);
        }
      } catch (error) {
        console.error('Error fetching brands:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchBrands();
  }, []);

  // Simulate scanning progress
  useEffect(() => {
    if (beaconActive) {
      const interval = setInterval(() => {
        setScanProgress((prev) => {
          if (prev >= 100) {
            return 0; // Reset progress
          }
          return prev + 2;
        });
      }, 100);

      return () => clearInterval(interval);
    } else {
      setScanProgress(0);
    }
  }, [beaconActive]);

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high':
        return 'destructive';
      case 'medium':
        return 'default';
      case 'low':
        return 'secondary';
      default:
        return 'secondary';
    }
  };

  const getPriorityIcon = (priority: string) => {
    switch (priority) {
      case 'high':
        return <Zap className="h-3 w-3" />;
      case 'medium':
        return <Target className="h-3 w-3" />;
      case 'low':
        return <Clock className="h-3 w-3" />;
      default:
        return <Clock className="h-3 w-3" />;
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col h-full">
        <Header title="Beacon" />
        <div className="flex-1 p-4 sm:p-6 lg:p-8 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-muted-foreground">Loading Beacon...</p>
          </div>
        </div>
      </div>
    );
  }

  if (brands.length === 0) {
    return (
      <div className="flex flex-col h-full">
        <Header title="Beacon" />
        <div className="flex-1 p-4 sm:p-6 lg:p-8">
          <div className="p-8 border-2 border-dashed border-muted rounded-lg text-center flex flex-col items-center justify-center h-64">
            <Radar className="h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-xl font-semibold mb-2">Beacon Needs a Brand</h3>
            <p className="text-muted-foreground mb-4">Add a brand to start scanning Reddit for opportunities.</p>
            <Button onClick={() => window.location.href = '/brands'}>
              Add Your First Brand
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full">
      <Header title="Beacon - Reddit Opportunity Scanner" />
      <div className="flex-1 p-4 sm:p-6 lg:p-8 space-y-6">
        {/* Brand Selector & Controls */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <Crown className="h-5 w-5 text-primary" />
              <span className="font-medium">Brand:</span>
            </div>
            <div className="flex gap-2">
              {brands.map((brand) => (
                <Button
                  key={brand.id}
                  variant={selectedBrand?.id === brand.id ? "default" : "outline"}
                  size="sm"
                  onClick={() => setSelectedBrand(brand)}
                >
                  {brand.name}
                </Button>
              ))}
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium">Beacon Status:</span>
              <Switch
                checked={beaconActive}
                onCheckedChange={setBeaconActive}
              />
              <Badge variant={beaconActive ? "default" : "secondary"}>
                {beaconActive ? "Active" : "Inactive"}
              </Badge>
            </div>
          </div>
        </div>

        {/* Stats Dashboard */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Posts Scanned</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{mockStats.postsScanned.toLocaleString()}</div>
              <p className="text-xs text-muted-foreground">Last 24 hours</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Opportunities Found</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-primary">{mockStats.opportunitiesFound}</div>
              <p className="text-xs text-muted-foreground">Ready for engagement</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Last Scan</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{mockStats.lastScanTime}</div>
              <p className="text-xs text-muted-foreground">Auto-refresh every 10 min</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Next Scan</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{mockStats.nextScanIn} min</div>
              {beaconActive && (
                <div className="mt-2">
                  <Progress value={scanProgress} className="h-2" />
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Scanning Status */}
        {beaconActive && (
          <Card className="border-primary/20 bg-primary/5">
            <CardHeader className="pb-3">
              <div className="flex items-center gap-2">
                <div className="animate-pulse">
                  <Radar className="h-5 w-5 text-primary" />
                </div>
                <CardTitle className="text-base">Beacon is actively scanning Reddit</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <p className="text-sm text-muted-foreground">
                  Monitoring {selectedBrand?.name} related discussions across 50+ subreddits
                </p>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm">
                    <RefreshCw className="h-3 w-3 mr-1" />
                    Force Scan
                  </Button>
                  <Button variant="outline" size="sm" onClick={() => setBeaconActive(false)}>
                    <Pause className="h-3 w-3 mr-1" />
                    Pause
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Opportunities List */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold">Recent Opportunities</h3>
              <p className="text-sm text-muted-foreground">
                AI-detected engagement opportunities for {selectedBrand?.name}
              </p>
            </div>
            <div className="flex gap-2">
              <Badge variant="destructive" className="flex items-center gap-1">
                {getPriorityIcon('high')}
                {mockOpportunities.filter(o => o.priority === 'high').length} High
              </Badge>
              <Badge variant="default" className="flex items-center gap-1">
                {getPriorityIcon('medium')}
                {mockOpportunities.filter(o => o.priority === 'medium').length} Medium
              </Badge>
              <Badge variant="secondary" className="flex items-center gap-1">
                {getPriorityIcon('low')}
                {mockOpportunities.filter(o => o.priority === 'low').length} Low
              </Badge>
            </div>
          </div>

          <div className="grid gap-4">
            {mockOpportunities.map((opportunity) => (
              <Card key={opportunity.id} className="hover:shadow-md transition-shadow">
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-3">
                      <Avatar className="h-8 w-8">
                        <AvatarImage src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${opportunity.author}`} />
                        <AvatarFallback>{opportunity.author.slice(2, 4).toUpperCase()}</AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <CardTitle className="text-base leading-tight">
                          {opportunity.title}
                        </CardTitle>
                        <CardDescription className="flex items-center gap-4 mt-1">
                          <span className="font-medium">{opportunity.subreddit}</span>
                          <span>by {opportunity.author}</span>
                          <span className="text-xs">{opportunity.timeAgo}</span>
                        </CardDescription>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant={getPriorityColor(opportunity.priority) as any} className="flex items-center gap-1">
                        {getPriorityIcon(opportunity.priority)}
                        {opportunity.priority}
                      </Badge>
                      <div className="text-right">
                        <div className="text-sm font-medium text-primary">
                          {opportunity.relevanceScore}% match
                        </div>
                        <Progress value={opportunity.relevanceScore} className="w-16 h-2 mt-1" />
                      </div>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="pt-0 space-y-4">
                  <p className="text-sm text-muted-foreground">
                    {opportunity.content}
                  </p>
                  
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                    <h4 className="text-sm font-medium text-blue-900 mb-1">Suggested Action:</h4>
                    <p className="text-sm text-blue-700">{opportunity.suggestedAction}</p>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <TrendingUp className="h-3 w-3" />
                        {opportunity.engagement.upvotes} upvotes
                      </span>
                      <span className="flex items-center gap-1">
                        <MessageSquare className="h-3 w-3" />
                        {opportunity.engagement.comments} comments
                      </span>
                      <Badge variant="outline" className="text-xs">
                        {opportunity.type}
                      </Badge>
                    </div>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm" asChild>
                        <a href={opportunity.url} target="_blank" rel="noopener noreferrer">
                          <ExternalLink className="h-3 w-3 mr-1" />
                          View
                        </a>
                      </Button>
                      <Button size="sm">
                        <MessageSquare className="h-3 w-3 mr-1" />
                        Engage
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {!beaconActive && (
          <Card className="border-dashed">
            <CardContent className="pt-6">
              <div className="text-center">
                <Radar className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">Beacon is Inactive</h3>
                <p className="text-muted-foreground mb-4">
                  Activate Beacon to start scanning Reddit for new engagement opportunities
                </p>
                <Button onClick={() => setBeaconActive(true)}>
                  <Play className="h-4 w-4 mr-2" />
                  Start Beacon
                </Button>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}