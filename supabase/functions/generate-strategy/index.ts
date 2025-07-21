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
    const { brand_id, url } = await req.json();

    if (!brand_id || !url) {
      return new Response(JSON.stringify({ error: "brand_id and url are required" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    // 1. Scrape the website
    const { markdown } = await blink.data.scrape(url);

    // 2. Generate Branding Guide
    const { object: branding_guide } = await blink.ai.generateObject({
      prompt: `Analyze the following website content and generate a branding guide. Extract the brand name, target audience, voice and tone, and key messaging.

Website content:
${markdown.substring(0, 8000)}`,
      schema: {
        type: "object",
        properties: {
          brand_name: { type: "string" },
          target_audience: { type: "string" },
          voice_and_tone: { type: "string" },
          key_messaging: { type: "string" },
        },
        required: ["brand_name", "target_audience", "voice_and_tone", "key_messaging"],
      },
    });

    // 3. Generate Growth Strategy
    const { object: growth_strategy } = await blink.ai.generateObject({
        prompt: `Based on the branding guide below, generate a Reddit growth strategy. Identify 10 relevant subreddits, suggest 5 initial post ideas, provide design recommendations for an icon and header, and write a sample bio/description.

Branding Guide:
${JSON.stringify(branding_guide, null, 2)}`,
        schema: {
            type: "object",
            properties: {
                top_communities: {
                    type: "array",
                    items: {
                        type: "object",
                        properties: {
                            name: { type: "string" },
                            reason: { type: "string" },
                        },
                    },
                },
                post_ideas: {
                    type: "array",
                    items: {
                        type: "object",
                        properties: {
                            title: { type: "string" },
                            body: { type: "string" },
                        },
                    },
                },
                design_recommendations: {
                    type: "object",
                    properties: {
                        icon: { type: "string" },
                        header: { type: "string" },
                        bio: { type: "string" },
                    },
                },
            },
        },
    });


    // 4. Store in Blink DB
    await blink.db.brands.update(brand_id, { 
      branding_guide: JSON.stringify(branding_guide), 
      growth_strategy: JSON.stringify(growth_strategy) 
    });

    return new Response(JSON.stringify({ success: true, branding_guide, growth_strategy }), {
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
