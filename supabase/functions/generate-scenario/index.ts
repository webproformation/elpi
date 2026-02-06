// supabase/functions/generate-scenario/index.ts
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const OPENAI_API_KEY = Deno.env.get('OPENAI_API_KEY');

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Gestion CORS
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const { gameType } = await req.json();

    let systemPrompt = "";
    let userPrompt = "";

    // CONFIGURATION DES PROMPTS
    if (gameType === 'salon') {
      systemPrompt = `Tu es un expert en psychogériatrie.
      Génère un scénario de dialogue difficile avec un patient (Mme Durand).
      RÈGLES CRITIQUES JSON :
      1. Renvoie UNIQUEMENT un tableau JSON valide [ ... ].
      2. NE METS JAMAIS de signe "+" devant les nombres positifs (Interdit : "+10", Obligatoire : "10").
      3. Structure : [{ "id": 1, "text": "...", "choices": [{ "impact": {"communication": 10} }] }]`;
      
      const situations = [
        "Mme Durand cherche son chat imaginaire.",
        "Mme Durand refuse sa toilette.",
        "Mme Durand veut aller travailler (alors qu'elle est retraitée).",
        "Mme Durand pense qu'on lui a volé ses bijoux."
      ];
      userPrompt = `Situation : ${situations[Math.floor(Math.random() * situations.length)]}`;
    } else {
      // Par défaut (Cuisine)
      systemPrompt = `Tu es expert HACCP. Génère un JSON strict sans signe "+" devant les nombres.`;
      userPrompt = "Scénario cuisine hygiène.";
    }

    // APPEL OPENAI
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
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

    const data = await response.json();
    
    // GESTION ERREUR OPENAI
    if (data.error) {
      console.error("Erreur OpenAI:", data.error);
      throw new Error(`OpenAI: ${data.error.message}`);
    }

    // --- NETTOYAGE ET VALIDATION (LE CŒUR DU CORRECTIF) ---
    let content = data.choices[0].message.content;

    // 1. On nettoie les balises Markdown éventuelles
    content = content.replace(/```json/g, '').replace(/```/g, '').trim();

    // 2. On supprime les signes "+" devant les chiffres (La cause de votre bug)
    // Ex: "communication": +10  ===> "communication": 10
    content = content.replace(/:\s*\+(\d+)/g, ': $1');

    // 3. On vérifie que c'est valide AVANT d'envoyer
    try {
      const parsed = JSON.parse(content); // Test si ça plante ici (côté serveur)
      
      // Si on arrive là, c'est que le JSON est propre. On le renvoie.
      return new Response(JSON.stringify(parsed), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    } catch (e) {
      console.error("JSON invalide reçu de l'IA :", content);
      throw new Error("L'IA a généré un format invalide impossible à nettoyer.");
    }

  } catch (error: any) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});