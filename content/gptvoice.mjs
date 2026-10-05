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
  status: "development",

  // Public GitHub URL once the repo exists, e.g. "https://github.com/Connected-Mate/gptvoice".
  repo: null,

  // Shell commands shown in the copyable install block (one string per line). null = hidden.
  install: null,
  // Short note under the install block (requirements). null = hidden.
  installNote: null,

  tagline: {
    en: "Text in, voice out. A voice studio for Claude Code, on your ChatGPT plan.",
    fr: "Du texte en entrée, une voix en sortie. Un studio de voix pour Claude Code, avec votre abonnement ChatGPT.",
  },
  summary: {
    en: "GPTVoice is being built right now. The goal: ask Claude for a narration, a voice-over or a dialogue, and get an audio file back. Nothing below is promised until it works on a real run.",
    fr: "GPTVoice est en cours de construction. L'objectif : demander à Claude une narration, une voix off ou un dialogue, et recevoir un fichier audio. Rien ci-dessous n'est promis tant que ça ne marche pas pour de vrai.",
  },

  // Feature bullets. Label switches automatically between "Planned" and "What it does".
  features: [
    { en: "A catalog of voices you can browse by gender and timbre, each with a short sample.", fr: "Un catalogue de voix à parcourir par genre et par timbre, chacune avec un court extrait." },
    { en: "Direct the delivery: emotion, intensity, speed, pitch, accent, whisper or shout.", fr: "Dirigez le jeu : émotion, intensité, vitesse, hauteur, accent, chuchoté ou crié." },
    { en: "Stage cues inside your text, like [whispers], [laughs] or [pause 1s].", fr: "Des indications de jeu dans le texte, comme [chuchote], [rit] ou [pause 1s]." },
    { en: "Word-for-word reading, checked by transcribing the result.", fr: "Une lecture mot pour mot, vérifiée en retranscrivant le résultat." },
    { en: "Dialogues with several voices in a single audio file.", fr: "Des dialogues à plusieurs voix dans un seul fichier audio." },
    { en: "Save your favorite voice settings as presets.", fr: "Enregistrez vos réglages de voix préférés." },
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
      voice: { en: "Calm storyteller", fr: "Conteur posé" },
      lang: "en",
      src: null,
      type: "audio/mpeg",
      transcript: "The storm came early that night. Up in the tower, the old keeper climbed toward the lamp. One light, and a boat finds its way home.",
    },
    {
      id: "dialogue-fr",
      title: { en: "Two-voice dialogue, in French", fr: "Dialogue à deux voix, en français" },
      voice: { en: "Two voices, one file", fr: "Deux voix, un seul fichier" },
      lang: "fr",
      src: null,
      type: "audio/mpeg",
      transcript: "— Tu entends ça ? — [chuchote] Oui… c'est la mer qui monte. — Alors on allume le phare. Maintenant.",
    },
  ],
};
