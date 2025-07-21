import { useState, useEffect } from "react";
import { Header } from "@/components/layout/Header";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Copy, Send, MessageCircle, Users, Crown, CheckCircle, Clock, AlertCircle } from "lucide-react";
import { blink } from "@/blink/client";
import { useToast } from "@/hooks/use-toast";

interface Brand {
  id: string;
  name: string;
  url: string;
  growth_strategy?: string;
}

interface OutreachMessage {
  id: string;
  recipient: string;
  subject: string;
  message: string;
  type: 'dm' | 'comment';
  status: 'draft' | 'sent' | 'replied';
  platform: string;
  sentAt?: string;
}

interface CommunityPost {
  id: string;
  title: string;
  content: string;
  subreddit: string;
  status: 'draft' | 'scheduled' | 'posted';
  scheduledFor?: string;
  engagement?: {
    upvotes: number;
    comments: number;
  };
}

export function OutreachPage() {
  const [brands, setBrands] = useState<Brand[]>([]);
  const [selectedBrand, setSelectedBrand] = useState<Brand | null>(null);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  // Mock outreach data
  const mockOutreachMessages: OutreachMessage[] = [
    {
      id: '1',
      recipient: 'u/entrepreneurmind',
      subject: 'Collaboration Opportunity',
      message: `Hi there! I've been following your insightful posts in r/entrepreneur and really appreciate your perspective on startup growth strategies.\n\nI'm building a community focused on sustainable business practices and would love to have experienced entrepreneurs like yourself share their knowledge. Would you be interested in joining our discussions?\n\nBest regards!`,
      type: 'dm',
      status: 'draft',
      platform: 'Reddit'
    },
    {
      id: '2',
      recipient: 'u/startupfounder',
      subject: 'Community Invitation',
      message: `Hello! Your recent post about startup validation really resonated with me. I'm launching a community where founders can share real experiences and learn from each other.\n\nWould you be interested in being one of our founding members? I think your insights would be incredibly valuable.\n\nLooking forward to hearing from you!`,
      type: 'dm',
      status: 'sent',
      platform: 'Reddit',
      sentAt: '2024-01-20T10:30:00Z'
    },
    {
      id: '3',
      recipient: 'r/entrepreneur post',
      subject: 'Comment on "Biggest startup mistakes"',
      message: `Great question! One mistake I see often is not validating the market early enough. We've created a community specifically for discussing these kinds of challenges - would love to have more experienced entrepreneurs share their stories there.`,
      type: 'comment',
      status: 'draft',
      platform: 'Reddit'
    }
  ];

  const mockCommunityPosts: CommunityPost[] = [
    {
      id: '1',
      title: 'The Hidden Costs of Scaling Too Fast: Lessons from 50+ Startups',
      content: `After analyzing data from over 50 startups, we've identified the most common (and expensive) mistakes founders make when scaling...\n\n🔍 Key findings:\n• 73% underestimated infrastructure costs\n• 68% hired too quickly without proper onboarding\n• 45% expanded to new markets prematurely\n\nWhat's been your biggest scaling challenge? Share your experience below! 👇`,
      subreddit: 'r/entrepreneur',
      status: 'draft'
    },
    {
      id: '2',
      title: 'Free Resource: Startup Validation Framework (Used by 100+ Companies)',
      content: `I've been helping startups validate their ideas for the past 5 years, and I've compiled the most effective framework into a free resource.\n\n📋 What's included:\n• 30-day validation roadmap\n• Customer interview templates\n• Market sizing calculator\n• Competitor analysis framework\n\nComment below if you'd like access - happy to share! 🚀`,
      subreddit: 'r/startups',
      status: 'scheduled',
      scheduledFor: '2024-01-22T14:00:00Z'
    },
    {
      id: '3',
      title: 'How We Grew from 0 to 10K Users in 6 Months (Complete Breakdown)',
      content: `Sharing our complete growth playbook that took us from idea to 10K users:\n\n📈 Growth tactics that worked:\n• Content marketing (40% of traffic)\n• Community building (30% of users)\n• Product hunt launch (20% spike)\n• Referral program (10% ongoing)\n\nAMA about our journey! What would you like to know? 💬`,
      subreddit: 'r/entrepreneur',
      status: 'posted',
      engagement: {
        upvotes: 847,
        comments: 156
      }
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

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      toast({
        title: "Copied to clipboard",
        description: "Message copied successfully!",
      });
    } catch (error) {
      toast({
        title: "Failed to copy",
        description: "Please copy the text manually.",
        variant: "destructive",
      });
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'draft':
        return <Clock className="h-4 w-4 text-yellow-500" />;
      case 'sent':
      case 'posted':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'scheduled':
        return <AlertCircle className="h-4 w-4 text-blue-500" />;
      default:
        return <Clock className="h-4 w-4 text-gray-500" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'draft':
        return 'secondary';
      case 'sent':
      case 'posted':
        return 'default';
      case 'scheduled':
        return 'outline';
      default:
        return 'secondary';
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col h-full">
        <Header title="Outreach" />
        <div className="flex-1 p-4 sm:p-6 lg:p-8 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-muted-foreground">Loading outreach campaigns...</p>
          </div>
        </div>
      </div>
    );
  }

  if (brands.length === 0) {
    return (
      <div className="flex flex-col h-full">
        <Header title="Outreach" />
        <div className="flex-1 p-4 sm:p-6 lg:p-8">
          <div className="p-8 border-2 border-dashed border-muted rounded-lg text-center flex flex-col items-center justify-center h-64">
            <Send className="h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-xl font-semibold mb-2">No Outreach Campaigns</h3>
            <p className="text-muted-foreground mb-4">Add a brand to generate outreach campaigns.</p>
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
      <Header title="Outreach & Community Building" />
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
          <Tabs defaultValue="messages" className="space-y-6">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="messages" className="flex items-center gap-2">
                <MessageCircle className="h-4 w-4" />
                Direct Messages
              </TabsTrigger>
              <TabsTrigger value="posts" className="flex items-center gap-2">
                <Users className="h-4 w-4" />
                Community Posts
              </TabsTrigger>
            </TabsList>

            <TabsContent value="messages" className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-semibold">Outreach Messages</h3>
                  <p className="text-sm text-muted-foreground">
                    Personalized messages for key Reddit users
                  </p>
                </div>
                <div className="flex gap-2">
                  <Badge variant="secondary">
                    {mockOutreachMessages.filter(m => m.status === 'draft').length} drafts
                  </Badge>
                  <Badge variant="default">
                    {mockOutreachMessages.filter(m => m.status === 'sent').length} sent
                  </Badge>
                </div>
              </div>

              <div className="grid gap-4">
                {mockOutreachMessages.map((message) => (
                  <Card key={message.id} className="hover:shadow-md transition-shadow">
                    <CardHeader className="pb-3">
                      <div className="flex items-start justify-between">
                        <div className="flex items-center gap-3">
                          <Avatar className="h-8 w-8">
                            <AvatarImage src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${message.recipient}`} />
                            <AvatarFallback>{message.recipient.slice(2, 4).toUpperCase()}</AvatarFallback>
                          </Avatar>
                          <div>
                            <CardTitle className="text-base">{message.recipient}</CardTitle>
                            <CardDescription className="flex items-center gap-2 mt-1">
                              <Badge variant="outline" className="text-xs">
                                {message.type === 'dm' ? 'Direct Message' : 'Comment'}
                              </Badge>
                              <span className="text-xs">{message.platform}</span>
                            </CardDescription>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          {getStatusIcon(message.status)}
                          <Badge variant={getStatusColor(message.status) as any}>
                            {message.status}
                          </Badge>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent className="pt-0 space-y-4">
                      <div>
                        <h4 className="font-medium text-sm mb-2">{message.subject}</h4>
                        <Textarea
                          value={message.message}
                          readOnly
                          className="min-h-[120px] resize-none"
                        />
                      </div>
                      <div className="flex items-center justify-between">
                        {message.sentAt && (
                          <span className="text-xs text-muted-foreground">
                            Sent {new Date(message.sentAt).toLocaleDateString()}
                          </span>
                        )}
                        <div className="flex gap-2 ml-auto">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => copyToClipboard(message.message)}
                          >
                            <Copy className="h-3 w-3 mr-1" />
                            Copy
                          </Button>
                          {message.status === 'draft' && (
                            <Button size="sm">
                              <Send className="h-3 w-3 mr-1" />
                              Send
                            </Button>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="posts" className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-semibold">Community Building Posts</h3>
                  <p className="text-sm text-muted-foreground">
                    Strategic posts to build community presence
                  </p>
                </div>
                <div className="flex gap-2">
                  <Badge variant="secondary">
                    {mockCommunityPosts.filter(p => p.status === 'draft').length} drafts
                  </Badge>
                  <Badge variant="outline">
                    {mockCommunityPosts.filter(p => p.status === 'scheduled').length} scheduled
                  </Badge>
                  <Badge variant="default">
                    {mockCommunityPosts.filter(p => p.status === 'posted').length} posted
                  </Badge>
                </div>
              </div>

              <div className="grid gap-4">
                {mockCommunityPosts.map((post) => (
                  <Card key={post.id} className="hover:shadow-md transition-shadow">
                    <CardHeader className="pb-3">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <CardTitle className="text-base leading-tight">
                            {post.title}
                          </CardTitle>
                          <CardDescription className="flex items-center gap-4 mt-2">
                            <span className="font-medium">{post.subreddit}</span>
                            {post.scheduledFor && (
                              <span className="text-xs">
                                Scheduled for {new Date(post.scheduledFor).toLocaleDateString()}
                              </span>
                            )}
                          </CardDescription>
                        </div>
                        <div className="flex items-center gap-2">
                          {getStatusIcon(post.status)}
                          <Badge variant={getStatusColor(post.status) as any}>
                            {post.status}
                          </Badge>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent className="pt-0 space-y-4">
                      <Textarea
                        value={post.content}
                        readOnly
                        className="min-h-[120px] resize-none"
                      />
                      
                      {post.engagement && (
                        <div className="flex items-center gap-4 text-sm text-muted-foreground">
                          <span className="flex items-center gap-1">
                            ↑ {post.engagement.upvotes.toLocaleString()} upvotes
                          </span>
                          <span className="flex items-center gap-1">
                            <MessageCircle className="h-3 w-3" />
                            {post.engagement.comments.toLocaleString()} comments
                          </span>
                        </div>
                      )}

                      <div className="flex items-center justify-between">
                        <div className="flex gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => copyToClipboard(post.content)}
                          >
                            <Copy className="h-3 w-3 mr-1" />
                            Copy
                          </Button>
                          {post.status === 'draft' && (
                            <Button size="sm" variant="secondary">
                              Schedule
                            </Button>
                          )}
                        </div>
                        {post.status === 'posted' && (
                          <Button variant="outline" size="sm">
                            View Post
                          </Button>
                        )}
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