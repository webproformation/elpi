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
    // --- CAS 1 : SALON (SCÉNARIO COMPLEXE & PSYCHOLOGIQUE) ---
    if (gameType === 'salon') {
      systemPrompt = `Tu es un expert en psychogériatrie et formateur EHPAD.
      Génère un scénario de simulation de dialogue difficile et réaliste.
      
      CONTEXTE :
      - Le patient (Mme Durand) souffre de troubles cognitifs (début Alzheimer ou anxiété sévère).
      - Elle ne doit PAS être juste "méchante". Elle doit être confuse, anxieuse, ou délirante.
      - Le soignant doit trouver la bonne posture (validation, diversion, empathie).
      
      RÈGLES DU JSON :
      - Génère une conversation en 3 ou 4 étapes minimum.
      - Les choix ne doivent pas être caricaturaux (pas de "Je te frappe" vs "Je t'aime"). Fais des nuances subtiles.
      - "type": "empathic" (bonne réponse), "authoritarian" (mauvaise), "avoidant" (mitigé).
      
      Structure JSON stricte :
      [
        {
          "id": 1,
          "speaker": "Mme Durand",
          "emotion": "sad", 
          "text": "Je veux rentrer chez moi... Ma mère m'attend pour le dîner (délire : sa mère est décédée).",
          "choices": [
            { "text": "Mais Madame, votre mère est morte depuis 20 ans ! (Confrontation)", "type": "authoritarian", "impact": {"communication": -20}, "next": 2 },
            { "text": "C'est vrai ? Elle cuisinait quoi de bon votre maman ? (Diversion/Empathie)", "type": "empathic", "impact": {"communication": +15}, "next": 3 }
          ]
        },
        ... (suite logique des réactions)
      ]`;
      
      // On demande une situation aléatoire à chaque fois
      const situations = [
        "Mme Durand cherche un objet imaginaire qu'on lui a 'volé'.",
        "Mme Durand refuse sa toilette car elle pense qu'elle l'a déjà faite.",
        "Mme Durand pleure car elle ne reconnait pas sa chambre.",
        "Mme Durand veut aller prendre son bus pour le travail (elle est retraitée)."
      ];
      userPrompt = `Génère un scénario unique basé sur cette situation : ${situations[Math.floor(Math.random() * situations.length)]}`;
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