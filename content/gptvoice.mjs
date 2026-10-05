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
      transcript: "Breathe in slowly and let it go. Feel your shoulders soften one breath at a time.",
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
      id: "pub-fr",
      title: { en: "A French radio ad", fr: "Une pub radio" },
      voice: { en: "coral · ad style", fr: "coral · style pub" },
      lang: "fr",
      src: "assets/audio/demo/fr-pub-coral.mp3",
      type: "audio/mpeg",
      transcript: "Nouveau ! La voix de vos vidéos, en un clic, avec votre abonnement ChatGPT. Essayez GPTVoice dès aujourd’hui !",
    },
    {
      id: "dialogue-fr",
      title: { en: "Two-voice dialogue, in French", fr: "Dialogue à deux voix" },
      voice: { en: "coral and ash · one file", fr: "coral et ash · un seul fichier" },
      lang: "fr",
      src: "assets/audio/demo/fr-dialogue.mp3",
      type: "audio/mpeg",
      transcript: "Léa : Tu as entendu ? On peut faire parler nos films sans payer un centime de plus ! Hugo : Sans clé d’API ? Ça me paraît trop beau pour être vrai. Léa : Il suffit de se connecter avec son compte ChatGPT. Le reste se fait tout seul. Hugo : Bon… alors on enregistre la bande-annonce ce soir.",
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
