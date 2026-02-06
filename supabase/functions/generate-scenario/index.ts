// supabase/functions/generate-scenario/index.ts
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const OPENAI_API_KEY = Deno.env.get('OPENAI_API_KEY');

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const { gameType } = await req.json();

    let systemPrompt = "";
    let userPrompt = "";

    if (gameType === 'kitchen') {
      systemPrompt = `Tu es un formateur expert pour aides-soignants. Génère des scénarios au format JSON uniquement.
      Structure :
      {
        "tasks": [
          {"id": 1, "name": "Tâche", "priority": "high/medium/low"},
          ... (4 tâches)
        ],
        "notifications": ["Notif 1", "Notif 2"]
      }`;
      userPrompt = "Génère 4 tâches matinales réalistes et 2 imprévus pour une aide-soignante.";
    }

    const completion = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: 'gpt-3.5-turbo',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userPrompt },
        ],
        temperature: 0.7,
      }),
    });

    const data = await completion.json();
    const scenario = JSON.parse(data.choices[0].message.content);

    return new Response(JSON.stringify(scenario), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});