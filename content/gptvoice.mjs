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
    fr: "Nécessite Node.js 22+, Claude Code et un abonnement ChatGPT. Déjà GPTImage ou le Codex CLI ? GPTVoice réutilise cette connexion.",
  },

  tagline: {
    en: "Text in, voice out. A voice studio for Claude Code, on your ChatGPT plan.",
    fr: "Du texte en entrée, une voix en sortie. Un studio de voix pour Claude Code, avec votre abonnement ChatGPT.",
  },
  summary: {
    en: "Ask Claude for a narration, a voice-over or a dialogue, and get an MP3 or WAV back. It drives OpenAI's realtime voice model with your ChatGPT sign-in, and checks that every word was read.",
    fr: "Demandez à Claude une narration, une voix off ou un dialogue, et recevez un MP3 ou un WAV. GPTVoice pilote le modèle vocal temps réel d'OpenAI avec votre connexion ChatGPT, et vérifie que chaque mot a été lu.",
  },

  // Feature bullets. Label switches automatically between "Planned" and "What it does".
  features: [
    { en: "10 voices (marin, cedar, coral, sage…). Every voice speaks every language: the text decides.", fr: "10 voix (marin, cedar, coral, sage…). Chaque voix parle toutes les langues : c'est le texte qui décide." },
    { en: "Direct the delivery in plain words: emotion, pace, accent, whispering.", fr: "Dirigez le jeu avec des mots simples : émotion, rythme, accent, chuchotement." },
    { en: "Long texts are split at sentences and joined into one file with natural pauses.", fr: "Les longs textes sont découpés aux phrases puis réunis en un seul fichier, avec des pauses naturelles." },
    { en: "Word-for-word reading: each passage is compared with your text and re-recorded if it drifts.", fr: "Lecture mot pour mot : chaque passage est comparé à votre texte et réenregistré s'il s'en écarte." },
    { en: "Dialogues with several voices in a single audio file.", fr: "Des dialogues à plusieurs voix dans un seul fichier audio." },
    { en: "Optional subtitles (.srt) for your video editor, and transcription of any audio file.", fr: "Sous-titres (.srt) en option pour votre logiciel de montage, et transcription de n'importe quel fichier audio." },
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
      title: { en: "Narration for “The Keeper”", fr: "Narration de « The Keeper »" },
      voice: { en: "cedar, calm storyteller", fr: "cedar, conteur posé" },
      lang: "en",
      src: "assets/audio/keeper-en.mp3",
      type: "audio/mpeg",
      transcript: "The storm came early that night. Up in the tower, the old keeper climbed toward the lamp. One light, and a boat finds its way home.",
    },
    {
      id: "dialogue-fr",
      title: { en: "Two-voice dialogue, in French", fr: "Dialogue à deux voix, en français" },
      voice: { en: "coral and ash, one file", fr: "coral et ash, un seul fichier" },
      lang: "fr",
      src: "assets/audio/dialogue-fr.mp3",
      type: "audio/mpeg",
      transcript: "Léa : Tu as entendu ? On peut faire parler nos films sans payer un centime de plus ! Hugo : Sans clé d'API ? Ça me paraît trop beau pour être vrai. Léa : Il suffit de se connecter avec son compte ChatGPT. Le reste se fait tout seul. Hugo : Bon… alors on enregistre la bande-annonce ce soir.",
    },
    {
      id: "trailer-en",
      title: { en: "Movie-trailer voice", fr: "Voix de bande-annonce" },
      voice: { en: "cedar, deep and dramatic", fr: "cedar, grave et dramatique" },
      lang: "en",
      src: "assets/audio/trailer-en.mp3",
      type: "audio/mpeg",
      transcript: "In a world where every story deserves a voice... one tool changes everything. No API key. No extra bill. Just your words, brought to life.",
    },
  ],
};
