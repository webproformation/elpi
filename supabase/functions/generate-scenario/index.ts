// supabase/functions/generate-scenario/index.ts
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const OPENAI_API_KEY = Deno.env.get('OPENAI_API_KEY');

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: corsHeaders });

  try {
    if (!OPENAI_API_KEY) throw new Error("Clé OpenAI manquante");

    const { gameType } = await req.json();
    let systemPrompt = "";
    let userPrompt = "";

    // --- CAS 1 : SALON (NOUVEAU) ---
    if (gameType === 'salon') {
      systemPrompt = `Tu es un scénariste de jeu de rôle médical "Serious Game".
      Tu dois générer un dialogue JSON interactif entre un soignant et un patient (Mme Durand).
      
      Règles strictes :
      1. Le JSON doit être un tableau d'objets (étapes).
      2. Chaque étape a un ID, un locuteur, une émotion (angry, sad, happy, neutral), un texte, et des choix.
      3. Les choix doivent avoir un "next" qui pointe vers l'ID de l'étape suivante.
      4. Prévois une fin (end: true) après 3 ou 4 échanges.
      
      Structure attendue :
      [
        {
          "id": 1,
          "speaker": "Mme Durand",
          "emotion": "angry",
          "text": "Je veux partir !",
          "choices": [
            { "text": "Réponse autoritaire", "type": "authoritarian", "impact": {"communication": -10}, "next": 2 },
            { "text": "Réponse empathique", "type": "empathic", "impact": {"communication": +20}, "next": 3 }
          ]
        },
        ... (suite logique)
      ]`;
      userPrompt = "Génère un scénario court où Mme Durand est confuse et cherche son chat (qui n'est pas là). Le soignant doit gérer la situation.";
    } 
    // --- CAS 2 : CUISINE REPAS ---
    else if (gameType === 'kitchen-meal') {
       systemPrompt = `Tu es expert HACCP. Génère un JSON strict : { "tasks": [{"id":1, "name":"...", "priority":"high"}...], "notifications": ["..."] }`;
       userPrompt = "Génère un scénario de service de repas avec risques hygiène.";
    }

    // Appel OpenAI
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${OPENAI_API_KEY}` },
      body: JSON.stringify({
        model: 'gpt-3.5-turbo',
        messages: [{ role: 'system', content: systemPrompt }, { role: 'user', content: userPrompt }],
        temperature: 0.7,
      }),
    });

    const data = await response.json();
    if (data.error) throw new Error(data.error.message);
    
    // Parsing sécurisé
    let content = data.choices[0].message.content;
    // Nettoyage au cas où l'IA ajoute du texte autour du JSON
    const jsonStart = content.indexOf('[');
    const jsonStartObj = content.indexOf('{');
    const start = (jsonStart !== -1 && (jsonStart < jsonStartObj || jsonStartObj === -1)) ? jsonStart : jsonStartObj;
    if (start !== -1) content = content.substring(start);
    const lastBracket = content.lastIndexOf(']');
    const lastBrace = content.lastIndexOf('}');
    const end = (lastBracket > lastBrace) ? lastBracket : lastBrace;
    if (end !== -1) content = content.substring(0, end + 1);

    return new Response(content, { headers: { ...corsHeaders, 'Content-Type': 'application/json' } });

  } catch (error: any) {
    return new Response(JSON.stringify({ error: error.message }), { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
  }
});