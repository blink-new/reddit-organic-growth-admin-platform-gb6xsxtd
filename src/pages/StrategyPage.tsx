import { useState, useEffect } from "react";
import { Header } from "@/components/layout/Header";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Progress } from "@/components/ui/progress";
import { ExternalLink, Users, MessageSquare, TrendingUp, Target, Crown, Star } from "lucide-react";
import { blink } from "@/blink/client";

interface Brand {
  id: string;
  name: string;
  url: string;
  growth_strategy?: string;
}

interface Community {
  name: string;
  members: number;
  relevanceScore: number;
  description: string;
  activity: string;
  url: string;
}

interface Post {
  title: string;
  subreddit: string;
  upvotes: number;
  comments: number;
  relevanceScore: number;
  url: string;
  author: string;
}

interface RedditUser {
  username: string;
  karma: number;
  relevanceScore: number;
  influence: string;
  activeSubreddits: string[];
  profileUrl: string;
}

export function StrategyPage() {
  const [brands, setBrands] = useState<Brand[]>([]);
  const [selectedBrand, setSelectedBrand] = useState<Brand | null>(null);
  const [loading, setLoading] = useState(true);

  // Mock data for demonstration - in real app this would come from Reddit analysis
  const mockCommunities: Community[] = [
    {
      name: "r/entrepreneur",
      members: 1200000,
      relevanceScore: 95,
      description: "A community for entrepreneurs to share ideas and experiences",
      activity: "Very High",
      url: "https://reddit.com/r/entrepreneur"
    },
    {
      name: "r/startups",
      members: 850000,
      relevanceScore: 92,
      description: "Discussion about startup companies and entrepreneurship",
      activity: "High",
      url: "https://reddit.com/r/startups"
    },
    {
      name: "r/smallbusiness",
      members: 650000,
      relevanceScore: 88,
      description: "Community for small business owners and aspiring entrepreneurs",
      activity: "High",
      url: "https://reddit.com/r/smallbusiness"
    },
    {
      name: "r/marketing",
      members: 420000,
      relevanceScore: 85,
      description: "Marketing strategies, tips, and industry discussions",
      activity: "Medium",
      url: "https://reddit.com/r/marketing"
    },
    {
      name: "r/business",
      members: 380000,
      relevanceScore: 82,
      description: "General business discussion and news",
      activity: "Medium",
      url: "https://reddit.com/r/business"
    }
  ];

  const mockPosts: Post[] = [
    {
      title: "What's the biggest mistake you made when starting your business?",
      subreddit: "r/entrepreneur",
      upvotes: 2400,
      comments: 856,
      relevanceScore: 94,
      url: "https://reddit.com/r/entrepreneur/post1",
      author: "u/businessguru"
    },
    {
      title: "How to validate your startup idea before investing time and money",
      subreddit: "r/startups",
      upvotes: 1800,
      comments: 432,
      relevanceScore: 91,
      url: "https://reddit.com/r/startups/post2",
      author: "u/startupexpert"
    },
    {
      title: "Marketing on a shoestring budget - what actually works?",
      subreddit: "r/smallbusiness",
      upvotes: 1200,
      comments: 298,
      relevanceScore: 89,
      url: "https://reddit.com/r/smallbusiness/post3",
      author: "u/frugalmarketer"
    }
  ];

  const mockUsers: RedditUser[] = [
    {
      username: "u/entrepreneurmind",
      karma: 45000,
      relevanceScore: 96,
      influence: "High",
      activeSubreddits: ["r/entrepreneur", "r/startups", "r/business"],
      profileUrl: "https://reddit.com/u/entrepreneurmind"
    },
    {
      username: "u/startupfounder",
      karma: 32000,
      relevanceScore: 93,
      influence: "High",
      activeSubreddits: ["r/startups", "r/entrepreneur"],
      profileUrl: "https://reddit.com/u/startupfounder"
    },
    {
      username: "u/marketingpro",
      karma: 28000,
      relevanceScore: 90,
      influence: "Medium",
      activeSubreddits: ["r/marketing", "r/smallbusiness"],
      profileUrl: "https://reddit.com/u/marketingpro"
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

  if (loading) {
    return (
      <div className="flex flex-col h-full">
        <Header title="Strategy" />
        <div className="flex-1 p-4 sm:p-6 lg:p-8 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-muted-foreground">Loading strategy data...</p>
          </div>
        </div>
      </div>
    );
  }

  if (brands.length === 0) {
    return (
      <div className="flex flex-col h-full">
        <Header title="Strategy" />
        <div className="flex-1 p-4 sm:p-6 lg:p-8">
          <div className="p-8 border-2 border-dashed border-muted rounded-lg text-center flex flex-col items-center justify-center h-64">
            <Target className="h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-xl font-semibold mb-2">No Strategy Found</h3>
            <p className="text-muted-foreground mb-4">Add a brand to generate a growth strategy.</p>
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
      <Header title="Reddit Growth Strategy" />
      <div className="flex-1 p-4 sm:p-6 lg:p-8 space-y-6">
        {/* Brand Selector */}
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

        {selectedBrand && (
          <Tabs defaultValue="communities" className="space-y-6">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="communities" className="flex items-center gap-2">
                <Users className="h-4 w-4" />
                Top Communities
              </TabsTrigger>
              <TabsTrigger value="posts" className="flex items-center gap-2">
                <MessageSquare className="h-4 w-4" />
                High-Impact Posts
              </TabsTrigger>
              <TabsTrigger value="users" className="flex items-center gap-2">
                <Star className="h-4 w-4" />
                Influential Users
              </TabsTrigger>
            </TabsList>

            <TabsContent value="communities" className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-semibold">Top Reddit Communities</h3>
                  <p className="text-sm text-muted-foreground">
                    Communities ranked by relevance to {selectedBrand.name}
                  </p>
                </div>
                <Badge variant="secondary">
                  {mockCommunities.length} communities analyzed
                </Badge>
              </div>

              <div className="grid gap-4">
                {mockCommunities.map((community, index) => (
                  <Card key={community.name} className="hover:shadow-md transition-shadow">
                    <CardHeader className="pb-3">
                      <div className="flex items-start justify-between">
                        <div className="flex items-center gap-3">
                          <div className="flex items-center justify-center w-8 h-8 rounded-full bg-primary/10 text-primary font-bold text-sm">
                            #{index + 1}
                          </div>
                          <div>
                            <CardTitle className="text-base">{community.name}</CardTitle>
                            <CardDescription className="flex items-center gap-4 mt-1">
                              <span className="flex items-center gap-1">
                                <Users className="h-3 w-3" />
                                {community.members.toLocaleString()} members
                              </span>
                              <Badge variant={community.activity === 'Very High' ? 'default' : community.activity === 'High' ? 'secondary' : 'outline'}>
                                {community.activity} Activity
                              </Badge>
                            </CardDescription>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-sm font-medium text-primary">
                            {community.relevanceScore}% match
                          </div>
                          <Progress value={community.relevanceScore} className="w-16 h-2 mt-1" />
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent className="pt-0">
                      <p className="text-sm text-muted-foreground mb-3">
                        {community.description}
                      </p>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <TrendingUp className="h-4 w-4 text-green-500" />
                          <span className="text-sm text-green-600 font-medium">
                            High engagement potential
                          </span>
                        </div>
                        <Button variant="outline" size="sm" asChild>
                          <a href={community.url} target="_blank" rel="noopener noreferrer">
                            <ExternalLink className="h-3 w-3 mr-1" />
                            Visit
                          </a>
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="posts" className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-semibold">High-Impact Posts</h3>
                  <p className="text-sm text-muted-foreground">
                    Posts with high engagement potential for {selectedBrand.name}
                  </p>
                </div>
                <Badge variant="secondary">
                  {mockPosts.length} posts identified
                </Badge>
              </div>

              <div className="grid gap-4">
                {mockPosts.map((post, index) => (
                  <Card key={post.url} className="hover:shadow-md transition-shadow">
                    <CardHeader className="pb-3">
                      <div className="flex items-start justify-between">
                        <div className="flex items-start gap-3">
                          <div className="flex items-center justify-center w-8 h-8 rounded-full bg-primary/10 text-primary font-bold text-sm">
                            #{index + 1}
                          </div>
                          <div className="flex-1">
                            <CardTitle className="text-base leading-tight">
                              {post.title}
                            </CardTitle>
                            <CardDescription className="flex items-center gap-4 mt-2">
                              <span className="font-medium">{post.subreddit}</span>
                              <span>by {post.author}</span>
                            </CardDescription>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-sm font-medium text-primary">
                            {post.relevanceScore}% match
                          </div>
                          <Progress value={post.relevanceScore} className="w-16 h-2 mt-1" />
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent className="pt-0">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4 text-sm text-muted-foreground">
                          <span className="flex items-center gap-1">
                            <TrendingUp className="h-3 w-3" />
                            {post.upvotes.toLocaleString()} upvotes
                          </span>
                          <span className="flex items-center gap-1">
                            <MessageSquare className="h-3 w-3" />
                            {post.comments.toLocaleString()} comments
                          </span>
                        </div>
                        <Button variant="outline" size="sm" asChild>
                          <a href={post.url} target="_blank" rel="noopener noreferrer">
                            <ExternalLink className="h-3 w-3 mr-1" />
                            View Post
                          </a>
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="users" className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-semibold">Influential Users</h3>
                  <p className="text-sm text-muted-foreground">
                    Key Reddit users to engage with for {selectedBrand.name}
                  </p>
                </div>
                <Badge variant="secondary">
                  {mockUsers.length} users identified
                </Badge>
              </div>

              <div className="grid gap-4">
                {mockUsers.map((user, index) => (
                  <Card key={user.username} className="hover:shadow-md transition-shadow">
                    <CardHeader className="pb-3">
                      <div className="flex items-start justify-between">
                        <div className="flex items-center gap-3">
                          <div className="flex items-center justify-center w-8 h-8 rounded-full bg-primary/10 text-primary font-bold text-sm">
                            #{index + 1}
                          </div>
                          <Avatar className="h-10 w-10">
                            <AvatarImage src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${user.username}`} />
                            <AvatarFallback>{user.username.slice(2, 4).toUpperCase()}</AvatarFallback>
                          </Avatar>
                          <div>
                            <CardTitle className="text-base">{user.username}</CardTitle>
                            <CardDescription className="flex items-center gap-4 mt-1">
                              <span>{user.karma.toLocaleString()} karma</span>
                              <Badge variant={user.influence === 'High' ? 'default' : 'secondary'}>
                                {user.influence} Influence
                              </Badge>
                            </CardDescription>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-sm font-medium text-primary">
                            {user.relevanceScore}% match
                          </div>
                          <Progress value={user.relevanceScore} className="w-16 h-2 mt-1" />
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent className="pt-0">
                      <div className="mb-3">
                        <p className="text-sm text-muted-foreground mb-2">Active in:</p>
                        <div className="flex flex-wrap gap-1">
                          {user.activeSubreddits.map((subreddit) => (
                            <Badge key={subreddit} variant="outline" className="text-xs">
                              {subreddit}
                            </Badge>
                          ))}
                        </div>
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Star className="h-4 w-4 text-yellow-500" />
                          <span className="text-sm text-yellow-600 font-medium">
                            High outreach potential
                          </span>
                        </div>
                        <Button variant="outline" size="sm" asChild>
                          <a href={user.profileUrl} target="_blank" rel="noopener noreferrer">
                            <ExternalLink className="h-3 w-3 mr-1" />
                            Profile
                          </a>
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>
          </Tabs>
        )}
      </div>
    </div>
  );
}