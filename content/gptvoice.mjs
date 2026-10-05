// GPTVoice: every piece of GPTVoice content on the site lives in this file.
// See UPGRADE.md for how to fill it in. After editing, run:  node build.mjs
//
// All strings are PLAIN TEXT (the build escapes them). Each user-facing string
// has an `en` and an `fr` version. Never put a claim here that has not been
// verified on a real run.

export const gptvoice = {
  // "development" -> badge "In development", features shown as "Planned", no install block.
  // "preview"     -> badge "Preview", features shown as "What it does", install shown if set.
  // "released"    -> badge "Available", same as preview.
  status: "preview",

  // Public GitHub URL once the repo exists, e.g. "https://github.com/Connected-Mate/gptvoice".
  repo: null,

  // Shell commands shown in the copyable install block (one string per line). null = hidden.
  install: ["git clone https://github.com/Connected-Mate/gptvoice.git", "cd gptvoice", "./install.sh"],
  // Short note under the install block (requirements). null = hidden.
  installNote: {
    en: "Needs Node.js 22+, Claude Code and a ChatGPT plan. Already set up GPTImage or the Codex CLI? GPTVoice reuses that sign-in.",
    fr: "Nécessite Node.js 22+, Claude Code et un abonnement ChatGPT. Déjà GPTImage ou le Codex CLI ? GPTVoice réutilise cette connexion.",
  },

  // Copy-paste install prompt for coding agents (verbatim from gptvoice AGENT-INSTALL.md, commit bd865d6).
  // Shown only once `repo` is set (the clone URL must work).
  agentPrompt: {
    en: "Install GPTVoice for me (text-to-speech MCP server, https://github.com/Connected-Mate/gptvoice). Follow these steps exactly, show me each command's result, and stop to ask me if anything fails.\n\n1. Check that Node.js 22 or newer is installed (`node -v`). If it is missing or older, stop and tell me to install it from https://nodejs.org.\n2. Clone the project into my home folder (skip the clone if ~/gptvoice already exists, and run `git -C ~/gptvoice pull` instead):\n   git clone https://github.com/Connected-Mate/gptvoice.git ~/gptvoice\n3. Install and register the MCP server for the agent you are (pick the one that matches you):\n   - Claude Code:  cd ~/gptvoice && ./install.sh --agent claude --no-login --yes\n   - Codex:        cd ~/gptvoice && ./install.sh --agent codex --no-login --yes\n   - Cursor:       cd ~/gptvoice && ./install.sh --agent cursor --no-login --yes\n   - Any other agent: cd ~/gptvoice && ./install.sh --agent none --no-login --yes, then add an MCP server named \"gptvoice\" to your own configuration with command `node` and argument `~/gptvoice/src/server.js` (stdio, use the absolute path).\n4. Sign-in. Run `cd ~/gptvoice && node src/login.js --check`.\n   - If it succeeds, I am already signed in (GPTVoice reuses a GPTImage or Codex CLI sign-in): continue.\n   - If it fails, run `cd ~/gptvoice && npm run login` and tell me: \"Your browser is opening: please sign in with your ChatGPT account, then come back.\" Wait for the command to finish. NEVER ask me for my password and never type it yourself.\n5. Verify: run `cd ~/gptvoice && npm run status`, then `cd ~/gptvoice && npm run selftest`. It must print \"Signed in\" and create a short test clip with its word accuracy. Give me the path to the clip so I can listen to it.\n6. Tell me to restart you (the agent) so the new \"gptvoice\" tool loads. After the restart, call the `voice_auth_status` tool once to confirm the connection.\n7. Finally, tell me plainly: \"GPTVoice uses your ChatGPT sign-in, not an API key, but voice usage may be billed to your personal OpenAI API organization. Check https://platform.openai.com/usage after your first voices.\"\n\nRules: do not use sudo, do not change any other MCP server or setting, do not commit or publish anything, and never print or share the contents of ~/.gptvoice/auth.json or ~/.codex/auth.json.",
    fr: "Installe GPTVoice pour moi (serveur MCP de synthèse vocale, https://github.com/Connected-Mate/gptvoice). Suis exactement ces étapes, montre-moi le résultat de chaque commande, et arrête-toi pour me demander si quelque chose échoue.\n\n1. Vérifie que Node.js 22 ou plus récent est installé (`node -v`). S'il manque ou s'il est trop ancien, arrête-toi et dis-moi de l'installer depuis https://nodejs.org.\n2. Clone le projet dans mon dossier personnel (si ~/gptvoice existe déjà, ne clone pas et lance plutôt `git -C ~/gptvoice pull`) :\n   git clone https://github.com/Connected-Mate/gptvoice.git ~/gptvoice\n3. Installe et enregistre le serveur MCP pour l'agent que tu es (choisis la ligne qui te correspond) :\n   - Claude Code : cd ~/gptvoice && ./install.sh --agent claude --no-login --yes\n   - Codex :       cd ~/gptvoice && ./install.sh --agent codex --no-login --yes\n   - Cursor :      cd ~/gptvoice && ./install.sh --agent cursor --no-login --yes\n   - Autre agent : cd ~/gptvoice && ./install.sh --agent none --no-login --yes, puis ajoute dans ta propre configuration un serveur MCP nommé \"gptvoice\" avec la commande `node` et l'argument `~/gptvoice/src/server.js` (stdio, chemin absolu).\n4. Connexion. Lance `cd ~/gptvoice && node src/login.js --check`.\n   - Si ça réussit, je suis déjà connecté (GPTVoice réutilise une connexion GPTImage ou Codex CLI) : continue.\n   - Sinon, lance `cd ~/gptvoice && npm run login` et dis-moi : « Ton navigateur s'ouvre : connecte-toi avec ton compte ChatGPT, puis reviens. » Attends la fin de la commande. Ne me demande JAMAIS mon mot de passe et ne le tape jamais toi-même.\n5. Vérifie : lance `cd ~/gptvoice && npm run status`, puis `cd ~/gptvoice && npm run selftest`. Il doit afficher « Signed in » et créer un court extrait audio avec sa précision mot à mot. Donne-moi le chemin de l'extrait pour que je l'écoute.\n6. Dis-moi de te redémarrer (toi, l'agent) pour charger le nouvel outil « gptvoice ». Après le redémarrage, appelle une fois l'outil `voice_auth_status` pour confirmer la connexion.\n7. Enfin, dis-moi clairement : « GPTVoice utilise ta connexion ChatGPT, pas une clé d'API, mais l'usage de la voix peut être facturé sur ton organisation OpenAI API personnelle. Vérifie https://platform.openai.com/usage après tes premières voix. »\n\nRègles : pas de sudo, ne modifie aucun autre serveur MCP ni réglage, ne commit et ne publie rien, et n'affiche ni ne partage jamais le contenu de ~/.gptvoice/auth.json ou ~/.codex/auth.json.",
  },

  tagline: {
    en: "Text in, voice out. A voice studio for Claude Code, with your ChatGPT sign-in.",
    fr: "Du texte en entrée, une voix en sortie. Un studio de voix pour Claude Code, avec votre connexion ChatGPT.",
  },
  summary: {
    en: "Ask your agent for a narration, a voice-over or a dialogue, and get an MP3 or WAV back. Direct it like a voice actor: emotion, speed, whisper or shout, laughs and pauses right in your text. Every passage is checked word for word.",
    fr: "Demandez à votre agent une narration, une voix off ou un dialogue, et recevez un MP3 ou un WAV. Dirigez-le comme un comédien : émotion, vitesse, chuchoté ou crié, rires et pauses directement dans le texte. Chaque passage est vérifié mot pour mot.",
  },

  // Cost caveat shown in the card. Source: gptvoice agent, 05/10/2026: calls are routed to the user's
  // personal OpenAI API organization (fake OpenAI-Organization header -> "No such organization").
  billingNote: {
    en: "Cost: unlike GPTImage, voice calls go to the personal OpenAI API organization linked to your account. They may be charged to its API credits or card (roughly $0.03–0.08 per minute of audio) and are not proven to be included in your ChatGPT plan. Check platform.openai.com/usage after your first try.",
    fr: "Coût : contrairement à GPTImage, les appels de voix passent par l’organisation API OpenAI personnelle liée à votre compte. Ils peuvent être prélevés sur ses crédits API ou sa carte (environ 0,03 à 0,08 $ par minute d’audio) et rien ne prouve qu’ils soient inclus dans votre abonnement ChatGPT. Vérifiez platform.openai.com/usage après votre premier essai.",
  },

  // Feature bullets. Label switches automatically between "Planned" and "What it does".
  // Every claim below was measured (gptvoice README: "Controls: real vs. best-effort" and "Quality").
  features: [
    { en: "10 voices, sorted by gender and character. Every voice speaks every language: the text decides.", fr: "10 voix, classées par genre et par caractère. Chaque voix parle toutes les langues : c’est le texte qui décide." },
    { en: "Word-for-word reading: each passage is compared with your text and re-recorded if it drifts.", fr: "Lecture mot pour mot : chaque passage est comparé à votre texte et réenregistré s’il s’en écarte." },
    { en: "Made for video: one clip per shot, fitted to its length, and an inspector that lets your agent see each clip (sentence timings, pauses, pace, pitch, waveform picture).", fr: "Pensé pour la vidéo : un clip par plan, ajusté à sa durée, et un inspecteur qui permet à votre agent de voir chaque clip (minutage des phrases, pauses, débit, hauteur, image de la forme d’onde)." },
    { en: "Smooth, natural joins: whole sentences per take, soft crossfades and room tone instead of dead silence. Measured: no clicks or hard cuts between takes.", fr: "Des raccords doux et naturels : des phrases entières par prise, des fondus et un léger fond d’ambiance au lieu d’un silence numérique. Mesuré : aucun clic ni coupure entre les prises." },
    { en: "Dialogues with several voices in a single audio file.", fr: "Des dialogues à plusieurs voix dans un seul fichier audio." },
    { en: "Save your favorite voices and your own presets (voice + settings) to reuse them.", fr: "Enregistrez vos voix favorites et vos propres réglages (voix + paramètres) pour les réutiliser." },
    { en: "Subtitles (.srt) for your video editor, and transcription of any audio file.", fr: "Des sous-titres (.srt) pour votre logiciel de montage, et la transcription de n’importe quel fichier audio." },
  ],

  // Direction controls, grouped by how reliably they work (measured A/B tests in the gptvoice repo).
  controls: [
    {
      level: { en: "Exact", fr: "Exact" },
      note: { en: "Applied to the audio itself, every time.", fr: "Appliqué au son lui-même, à chaque fois." },
      items: [
        { en: "Speed, from 0.25× to 1.5×", fr: "Vitesse, de 0,25× à 1,5×" },
        { en: "Pitch shift, ±12 semitones", fr: "Hauteur, ±12 demi-tons" },
        { en: "Silences to the millisecond: [pause 1s]", fr: "Silences à la milliseconde : [pause 1s]" },
      ],
    },
    {
      level: { en: "Strong", fr: "Fiable" },
      note: { en: "Clearly audible on almost every take.", fr: "Nettement audible sur presque chaque prise." },
      items: [
        { en: "Whisper or shout", fr: "Chuchoté ou crié" },
        { en: "Emotion and intensity", fr: "Émotion et intensité" },
        { en: "Narration styles: trailer, documentary, audiobook, ad, meditation…", fr: "Styles de narration : bande-annonce, documentaire, livre audio, pub, méditation…" },
        { en: "Cues in your text: [whispers] [excited] [laughs] [sighs]", fr: "Indications dans le texte : [whispers] [excited] [laughs] [sighs]" },
      ],
    },
    {
      level: { en: "Best effort", fr: "Au mieux" },
      note: { en: "Works often, not always.", fr: "Marche souvent, pas toujours." },
      items: [
        { en: "Accent", fr: "Accent" },
        { en: "Character voice (“an old sea captain”)", fr: "Voix de personnage (« un vieux capitaine »)" },
      ],
    },
  ],

  // Measured on the gptvoice benchmark (data/bench-accuracy.json, gpt-realtime-1.5, first take, 28 takes per language).
  measured: [
    { value: { en: "99.4%", fr: "99,4 %" }, label: { en: "of words read exactly in English, on deliberately hard texts", fr: "des mots lus exactement en anglais, sur des textes volontairement difficiles" } },
    { value: { en: "98.8%", fr: "98,8 %" }, label: { en: "of words read exactly in French, same test", fr: "des mots lus exactement en français, même test" } },
    { value: { en: "0 / 32", fr: "0 / 32" }, label: { en: "texts trying to hijack the voice were obeyed. They were read aloud, never followed.", fr: "textes cherchant à détourner la voix ont été suivis. Ils ont été lus, jamais exécutés." } },
  ],

  // The MCP tools Claude Code gets.
  mcpTools: ["generate_speech", "generate_dialogue", "generate_clips", "inspect_audio", "transcribe_audio", "list_voices", "favorite_voice", "save_voice_preset", "list_voice_presets", "delete_voice_preset", "voice_auth_status"],

  examplePrompt: {
    en: "Read this script as a calm storyteller, with a pause before the last line, and save it as keeper.mp3.",
    fr: "Lis ce texte comme un conteur posé, avec une pause avant la dernière phrase, et enregistre-le dans keeper.mp3.",
  },

  // Demo clips. src = path relative to the site root, or null (then a "coming soon" placeholder is shown).
  // `transcript` must be the EXACT text spoken in the file (it doubles as the accessible transcript).
  // Sounds that are performed, not spoken, go in parentheses. `hidden: true` keeps an entry out of the page.
  samples: [
    {
      id: "trailer-en",
      title: { en: "Movie trailer", fr: "Bande-annonce" },
      voice: { en: "cedar · trailer style", fr: "cedar · style bande-annonce" },
      lang: "en",
      src: "assets/audio/demo/en-trailer-cedar.mp3",
      type: "audio/mpeg",
      transcript: "In a world where every story deserves a voice… one tool changes everything. No API key. No studio. Just your words… brought to life.",
    },
    {
      id: "emotions-en",
      title: { en: "One line, four emotions", fr: "Une phrase, quatre émotions" },
      voice: { en: "coral · happy, sad, angry, whispering", fr: "coral · joie, tristesse, colère, chuchotement" },
      lang: "en",
      src: "assets/audio/demo/en-emotions-coral.mp3",
      type: "audio/mpeg",
      transcript: "We won the match! We lost the match. Who lost the match?! Shh… nobody knows about the match.",
    },
    {
      id: "meditation-en",
      title: { en: "Guided meditation", fr: "Méditation guidée" },
      voice: { en: "sage · meditation style", fr: "sage · style méditation" },
      lang: "en",
      src: "assets/audio/demo/en-meditation-sage.mp3",
      type: "audio/mpeg",
      transcript: "Breathe in slowly. And let it go. Feel your shoulders soften, one breath at a time.",
    },
    {
      id: "conte-fr",
      title: { en: "A French fairy tale", fr: "Un conte" },
      voice: { en: "marin · audiobook narration", fr: "marin · narration de livre audio" },
      lang: "fr",
      src: "assets/audio/demo/fr-conte-marin.mp3",
      type: "audio/mpeg",
      transcript: "Il était une fois, au bord de la mer, une vieille horloge qui ne donnait jamais la bonne heure. Un soir, quelqu’un frappa à la porte du clocher… C’était une enfant, une lanterne à la main !",
    },
    {
      id: "phare-fr",
      title: { en: "A 45-second French story", fr: "Une histoire de 45 secondes" },
      voice: { en: "marin · audiobook narration, three paragraphs", fr: "marin · narration de livre audio, trois paragraphes" },
      lang: "fr",
      src: "assets/audio/demo/fr-narration-long-marin.mp3",
      type: "audio/mpeg",
      transcript: "Chaque soir, depuis trente-sept ans, la gardienne du phare montait les cent douze marches de la tour. Elle nettoyait la lentille, vérifiait la mèche, puis allumait la lampe. Personne en ville ne connaissait son nom, mais tout le monde connaissait sa lumière. Cette nuit-là, la tempête arriva plus tôt que prévu. Le vent hurlait contre les vitres, et la pluie frappait la porte comme une main impatiente. Elle hésita un instant, puis elle reprit sa montée, marche après marche. Tout en haut, la radio grésilla. « Vous m’entendez ? » demanda une voix lointaine. Elle prit le micro, respira profondément, et répondit simplement : « Je suis là. Suivez la lumière. »",
    },
    {
      id: "pub-fr",
      title: { en: "A French radio ad", fr: "Une pub radio" },
      voice: { en: "coral · ad style", fr: "coral · style pub" },
      lang: "fr",
      src: "assets/audio/demo/fr-pub-coral.mp3",
      type: "audio/mpeg",
      transcript: "Nouveau ! La voix de vos vidéos, en un clic, avec votre compte ChatGPT. Essayez GPTVoice dès aujourd’hui !",
    },
    {
      id: "dialogue-fr",
      title: { en: "Two-voice dialogue, in French", fr: "Dialogue à deux voix" },
      voice: { en: "coral and ash · one file", fr: "coral et ash · un seul fichier" },
      lang: "fr",
      src: "assets/audio/demo/fr-dialogue.mp3",
      type: "audio/mpeg",
      transcript: "Léa : (rit) Tu as entendu ? On peut faire parler nos films en quelques minutes ! Hugo : Sans clé d’API ? (soupire) Ça me paraît trop beau pour être vrai. Léa : Il suffit de se connecter avec son compte ChatGPT. Le reste se fait tout seul. Hugo (chuchote) : Bon… alors on enregistre la bande-annonce ce soir.",
    },
  ],

  // Voice gallery. Each voice reads `voiceLine` (with its own name) in English and French.
  // Gender follows OpenAI's presentation and the measured pitch; "deep" is measured; other tags are editorial.
  // Source: gptvoice src/voices.js + data/voice-metrics.json (all 20 clips verified word for word).
  voiceLine: {
    en: "Hello, I’m {Name}. I can narrate your stories, voice your videos, and bring your characters to life.",
    fr: "Bonjour, je suis {Name}. Je peux raconter vos histoires, doubler vos vidéos et donner vie à vos personnages.",
  },
  voices: [
    { id: "marin", gender: "female", recommended: true, tags: { en: ["natural", "polished", "warm"], fr: ["naturelle", "soignée", "chaleureuse"] }, bestFor: { en: "narration, audiobook, podcast", fr: "narration, livre audio, podcast" } },
    { id: "cedar", gender: "male", recommended: true, tags: { en: ["natural", "warm", "confident"], fr: ["naturelle", "chaleureuse", "assurée"] }, bestFor: { en: "narration, podcast, ad", fr: "narration, podcast, pub" } },
    { id: "coral", gender: "female", tags: { en: ["warm", "friendly", "lively"], fr: ["chaleureuse", "amicale", "vive"] }, bestFor: { en: "ad, kids, social video", fr: "pub, enfants, vidéo réseaux sociaux" } },
    { id: "sage", gender: "female", tags: { en: ["gentle", "soft", "thoughtful"], fr: ["douce", "feutrée", "réfléchie"] }, bestFor: { en: "meditation, intimate, e-learning", fr: "méditation, confidence, e-learning" } },
    { id: "shimmer", gender: "female", tags: { en: ["bright", "airy", "youthful"], fr: ["lumineuse", "aérienne", "jeune"] }, bestFor: { en: "ad, social video, character", fr: "pub, vidéo réseaux sociaux, personnage" } },
    { id: "ash", gender: "male", tags: { en: ["deep", "direct", "grounded"], fr: ["grave", "directe", "posée"] }, bestFor: { en: "documentary, corporate, trailer", fr: "documentaire, entreprise, bande-annonce" } },
    { id: "echo", gender: "male", tags: { en: ["deep", "calm", "resonant"], fr: ["grave", "calme", "résonante"] }, bestFor: { en: "meditation, documentary, announcement", fr: "méditation, documentaire, annonce" } },
    { id: "verse", gender: "male", tags: { en: ["versatile", "smooth", "storyteller"], fr: ["polyvalente", "fluide", "conteuse"] }, bestFor: { en: "audiobook, trailer, character", fr: "livre audio, bande-annonce, personnage" } },
    { id: "ballad", gender: "male", tags: { en: ["expressive", "gentle", "melodic"], fr: ["expressive", "douce", "mélodieuse"] }, bestFor: { en: "audiobook, poetry, character", fr: "livre audio, poésie, personnage" } },
    { id: "alloy", gender: "neutral", tags: { en: ["balanced", "clear", "versatile"], fr: ["équilibrée", "claire", "polyvalente"] }, bestFor: { en: "e-learning, assistant, explainer", fr: "e-learning, assistant, vidéo explicative" } },
  ],
};
