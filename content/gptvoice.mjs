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
    en: "Text in, voice out. A voice studio for Claude Code, on your ChatGPT plan.",
    fr: "Du texte en entrée, une voix en sortie. Un studio de voix pour Claude Code, avec votre abonnement ChatGPT.",
  },
  summary: {
    en: "Ask Claude for a narration, a voice-over or a dialogue, and get an MP3 or WAV back. Direct it like a voice actor: emotion, speed, whisper or shout, laughs and pauses right in your text. Every passage is checked word for word.",
    fr: "Demandez à Claude une narration, une voix off ou un dialogue, et recevez un MP3 ou un WAV. Dirigez-le comme un comédien : émotion, vitesse, chuchoté ou crié, rires et pauses directement dans le texte. Chaque passage est vérifié mot pour mot.",
  },

  // Feature bullets. Label switches automatically between "Planned" and "What it does".
  // Every claim below was measured (gptvoice README: "Controls: real vs. best-effort" and "Quality").
  features: [
    { en: "10 voices, each with a short French and English sample, sorted by gender, register and best use. Every voice speaks every language.", fr: "10 voix, chacune avec un court extrait en français et en anglais, classées par genre, timbre et usage. Chaque voix parle toutes les langues." },
    { en: "Direct the performance: emotion (joy, sadness, anger, excitement…), intensity, whisper or shout, narration styles like trailer, documentary or meditation.", fr: "Dirigez le jeu : émotion (joie, tristesse, colère, enthousiasme…), intensité, chuchoté ou crié, styles de narration comme bande-annonce, documentaire ou méditation." },
    { en: "Exact controls: speed, a higher or lower voice, and silences to the millisecond.", fr: "Des réglages exacts : la vitesse, une voix plus aiguë ou plus grave, et des silences à la milliseconde près." },
    { en: "Cues inside your text, like [whispers], [laughs], [sighs] or [pause 1s], plus pronunciation hints for names. Cues are performed, never read aloud.", fr: "Des indications dans le texte, comme [chuchote], [rit], [soupire] ou [pause 1s], et des aides de prononciation pour les noms. Elles sont jouées, jamais lues." },
    { en: "Word-for-word reading, measured at 99.4% in English and 98.8% in French on deliberately tricky texts.", fr: "Une lecture mot pour mot, mesurée à 99,4 % en anglais et 98,8 % en français sur des textes volontairement difficiles." },
    { en: "Dialogues with several voices in one file, saved voice presets and favorites, and subtitles (.srt) for your video editor.", fr: "Des dialogues à plusieurs voix dans un seul fichier, des réglages et voix favorites enregistrés, et des sous-titres (.srt) pour votre logiciel de montage." },
  ],

  examplePrompt: {
    en: "Read this script as a calm storyteller, with a pause before the last line, and save it as keeper.mp3.",
    fr: "Lis ce texte comme un conteur posé, avec une pause avant la dernière phrase, et enregistre-le dans keeper.mp3.",
  },

  // Audio samples. src = path relative to the site root (e.g. "assets/audio/keeper-en.mp3"), or null.
  // While src is null, a "coming soon" placeholder is shown with the script.
  // `transcript` must be the EXACT text spoken in the file (it doubles as the accessible transcript).
  samples: [
    {
      id: "keeper-narration",
      title: { en: "Narration for “The Keeper”", fr: "Narration de « The Keeper »" },
      voice: { en: "cedar, calm storyteller", fr: "cedar, conteur posé" },
      lang: "en",
      src: "assets/audio/keeper-en.mp3",
      type: "audio/mpeg",
      transcript: "The storm came early that night. Up in the tower, the old keeper climbed toward the lamp. One light, and a boat finds its way home.",
    },
    {
      id: "emotions-en",
      title: { en: "One voice, four emotions", fr: "Une voix, quatre émotions" },
      voice: { en: "coral: happy, sad, angry, whispering", fr: "coral : joyeuse, triste, en colère, chuchotée" },
      lang: "en",
      src: "assets/audio/emotions-en.mp3",
      type: "audio/mpeg",
      transcript: "We won the match! We lost the match. Who lost the match?! Shh… nobody knows about the match.",
    },
    {
      id: "conte-fr",
      title: { en: "A French tale, with a whisper", fr: "Un conte, avec un chuchotement" },
      voice: { en: "marin, audiobook narration", fr: "marin, narration de livre audio" },
      lang: "fr",
      src: "assets/audio/conte-fr.mp3",
      type: "audio/mpeg",
      transcript: "Il était une fois, au bord de la mer, une vieille horloge qui ne donnait jamais la bonne heure. Un soir, quelqu'un frappa à la porte du clocher… C'était une enfant, une lanterne à la main !",
    },
    {
      id: "dialogue-fr",
      title: { en: "Two-voice dialogue, in French", fr: "Dialogue à deux voix, en français" },
      voice: { en: "coral and ash, laughs and sighs included", fr: "coral et ash, rires et soupirs compris" },
      lang: "fr",
      src: "assets/audio/dialogue-fr.mp3",
      type: "audio/mpeg",
      transcript: "Léa : (rit) Tu as entendu ? On peut faire parler nos films sans payer un centime de plus ! Hugo : Sans clé d’API ? (soupire) Ça me paraît trop beau pour être vrai. Léa : Il suffit de se connecter avec son compte ChatGPT. Le reste se fait tout seul. Hugo (chuchote) : Bon… alors on enregistre la bande-annonce ce soir.",
    },
    {
      id: "trailer-en",
      title: { en: "Movie-trailer voice", fr: "Voix de bande-annonce" },
      voice: { en: "cedar, trailer style", fr: "cedar, style bande-annonce" },
      lang: "en",
      src: "assets/audio/trailer-en.mp3",
      type: "audio/mpeg",
      transcript: "In a world where every story deserves a voice… one tool changes everything. No API key. No extra bill. Just your words… brought to life.",
    },
  ],
};
