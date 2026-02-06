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
    const { gameType } = await req.json();

    let systemPrompt = "";
    let userPrompt = "";

    if (gameType === 'salon') {
      // --- PROMPT RENFORCÉ POUR LE SALON ---
      systemPrompt = `Tu es un expert en formation EHPAD.
      Génère un scénario de dialogue interactif (Jeu de rôle).
      
      RÈGLES STRICTES POUR LE JSON :
      1. Renvoie UNIQUEMENT un tableau d'objets [].
      2. PAS de signe "+" devant les nombres (Ex: met "10", pas "+10").
      3. CHAQUE étape doit avoir une liste de "choices" avec AU MOINS 2 choix.
      4. Les clés OBLIGATOIRES dans "choices" sont : 
         - "text" (Ce qui est écrit sur le bouton)
         - "next" (L'ID de l'étape suivante)
         - "type" ("empathic", "authoritarian", "avoidant")
         - "impact" (Objet stats, ex: {"communication": 10})

      Structure Modèle :
      [
        {
          "id": 1,
          "speaker": "Mme Durand",
          "emotion": "angry",
          "text": "Je veux rentrer chez moi !",
          "choices": [
            { "text": "Je comprends votre angoisse (Empathie)", "next": 2, "type": "empathic", "impact": {"communication": 10} },
            { "text": "Ce n'est pas possible (Autorité)", "next": 3, "type": "authoritarian", "impact": {"communication": -10} }
          ]
        },
        { "id": 2, "speaker": "Mme Durand", "emotion": "calm", "text": "Merci...", "choices": [], "end": true },
        { "id": 3, "speaker": "Mme Durand", "emotion": "sad", "text": "Vous êtes méchant...", "choices": [], "end": true }
      ]`;
      
      const situations = [
        "Mme Durand refuse sa toilette car elle a froid.",
        "Mme Durand cherche son chat qui n'existe pas.",
        "Mme Durand accuse le personnel de vol.",
        "Mme Durand pleure car sa fille ne vient pas."
      ];
      userPrompt = `Génère un scénario complet sur ce thème : ${situations[Math.floor(Math.random() * situations.length)]}`;
    } else {
      // Prompt Cuisine
      systemPrompt = `Tu es expert HACCP. Génère un JSON strict pour la cuisine.`;
      userPrompt = "Scénario cuisine hygiène.";
    }

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
    if (data.error) throw new Error(data.error.message);

    // --- NETTOYAGE ---
    let content = data.choices[0].message.content;
    content = content.replace(/```json/g, '').replace(/```/g, '').trim();
    content = content.replace(/:\s*\+(\d+)/g, ': $1'); // Retire les "+"

    return new Response(content, {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error: any) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});