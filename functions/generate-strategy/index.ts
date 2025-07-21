import { serve } from "https://deno.land/std@0.177.0/http/server.ts";
import { createClient } from "npm:@blinkdotnew/sdk";

const blink = createClient({
  projectId: Deno.env.get("BLINK_PROJECT_ID") || "gb6xsxtd",
  authRequired: false,
});

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", {
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
      },
    });
  }

  try {
    // Extract JWT from Authorization header
    const authHeader = req.headers.get("authorization");
    if (authHeader && authHeader.startsWith("Bearer ")) {
      const jwt = authHeader.split(" ")[1];
      blink.auth.setToken(jwt);
    }
    
    const { url } = await req.json();

    if (!url) {
      return new Response(JSON.stringify({ error: "url is required" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    // 1. Scrape the website
    const { markdown, metadata } = await blink.data.scrape(url);
    
    // Extract brand name from URL or metadata
    const brandName = metadata?.title || new URL(url).hostname.replace('www.', '');

    // 2. Generate simple branding guide using text generation
    const { text: brandingText } = await blink.ai.generateText({
      prompt: `Analyze this website and create a branding guide. Extract:
1. Brand name
2. Target audience 
3. Voice and tone
4. Key messaging

Website: ${url}
Title: ${metadata?.title || 'N/A'}
Content: ${markdown.substring(0, 3000)}

Format as JSON with keys: brand_name, target_audience, voice_and_tone, key_messaging`,
      maxTokens: 500
    });

    // 3. Generate growth strategy
    const { text: strategyText } = await blink.ai.generateText({
      prompt: `Based on this brand, suggest a Reddit growth strategy:

Brand: ${brandName}
Website: ${url}

Provide:
1. 5 relevant subreddits
2. 3 post ideas
3. Community bio suggestion

Format as JSON with keys: top_communities (array), post_ideas (array), bio`,
      maxTokens: 800
    });

    // Parse the generated text into objects (with fallbacks)
    let brandingGuide;
    let growthStrategy;
    
    try {
      brandingGuide = JSON.parse(brandingText);
    } catch {
      brandingGuide = {
        brand_name: brandName,
        target_audience: "General consumers",
        voice_and_tone: "Professional and approachable",
        key_messaging: "Quality and innovation"
      };
    }

    try {
      growthStrategy = JSON.parse(strategyText);
    } catch {
      growthStrategy = {
        top_communities: [
          { name: "r/technology", reason: "Tech-focused audience" },
          { name: "r/startups", reason: "Business community" }
        ],
        post_ideas: [
          { title: "Introducing our brand", body: "Share your story" },
          { title: "AMA about our industry", body: "Engage with community" }
        ],
        bio: `Official ${brandName} community - Join us for updates and discussions!`
      };
    }

    return new Response(JSON.stringify({ 
      success: true, 
      brandName,
      brandingGuide, 
      growthStrategy 
    }), {
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
      },
    });
  } catch (error) {
    console.error(error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
      },
    });
  }
});