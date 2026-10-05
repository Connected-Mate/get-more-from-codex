// Site copy (EN + FR). Strings here are trusted and may contain inline HTML
// (<code>, <strong>, <a>). GPTVoice content lives in ./gptvoice.mjs.

// Public URL of the published site, with trailing slash. Used for canonical,
// hreflang, social cards and the sitemap. Update it if the site moves to a custom domain.
export const SITE_URL = "https://connected-mate.github.io/get-more-from-codex/";

export const GPTIMAGE_REPO = "https://github.com/Connected-Mate/gptimage";

export const t = {
  en: {
    htmlLang: "en",
    ogLocale: "en_US",
    title: "Get more from Codex — from your OpenAI subscription",
    description: "Two free, open-source tools that let Claude Code make images and voices with your ChatGPT sign-in. No API key, no extra subscription.",
    skip: "Skip to content",
    navLabel: "Sections",
    nav: { how: "How it works", tools: "Tools", film: "Short film", faq: "FAQ" },
    langLabel: "Language",
    langNames: { en: "English", fr: "Français" },

    hero: {
      eyebrow: "For Claude Code users with a ChatGPT plan",
      h1: "Get more from Codex",
      sub: "from your OpenAI subscription",
      lead: "The “Sign in with ChatGPT” you use for Codex can do more than code. Two free, open-source tools let Claude Code use it to make images and voices. Turn both into visuals, narration, ads and short films.",
      ctaPrimary: "Install GPTImage",
      ctaSecondary: "See a short film being made",
      facts: ["No API key", "No extra subscription", "Runs on your computer", "Open source (MIT)"],
      alt: "Two pixel-art robots: a painter in a purple beret finishing a landscape on an easel, and a singer with headphones and a microphone. A film clapperboard sits between them.",
    },

    notice: {
      title: "Grey area.",
      body: "These tools reuse the Codex “Sign in with ChatGPT” login. That is not an official OpenAI API. Keep it personal: heavy use can hit your plan’s limits or, at worst, get your account restricted.",
      link: "Read the full notice",
    },

    how: {
      kicker: "How it works",
      h2: "Sign in once. Then just ask.",
      steps: [
        { h: "Install", p: "Copy four lines into your terminal. The tool is added to Claude Code for every project on your computer." },
        { h: "Sign in with ChatGPT", p: "Your browser opens on the official ChatGPT login. You type your password there, never in the tool." },
        { h: "Ask Claude", p: "In plain words, in any project. Claude picks the tool, makes the file and saves it next to your work." },
      ],
      example: "Make a watercolor red fox in the snow and save it as fox.png.",
      exampleLabel: "You type",
    },

    tools: {
      kicker: "Two tools",
      h2: "One for pictures, one for voices",
      intro: "Each is a small MCP server: a plug-in that gives Claude Code a new skill. Both use the same ChatGPT sign-in.",
      badge: { available: "Available", development: "In development", preview: "Preview", released: "Available" },
      featuresLabel: { planned: "Planned", live: "What it does" },
      examplePromptLabel: "Example request",
      installLabel: "Install",
      copy: "Copy",
      copied: "Copied",
      copyFailed: "Select the text and press Ctrl+C (⌘C on Mac)",
      codeLabel: "Install commands",
      repoLink: "Source code on GitHub",
      notYet: "Not released yet. The install command will appear here once GPTVoice works end to end.",
      samplesLabel: "Listen",
      sampleSoon: "Audio sample coming soon. This is the script it will read:",
      transcript: "Transcript",
      audioError: "This sample could not load. The transcript is below.",
    },

    gptimage: {
      tagline: "Images and edits from GPT Image 2, straight from Claude Code.",
      summary: "Logos, illustrations, mockups, banners, textures, storyboards. The pictures and the storyboard on this page were made with it.",
      features: [
        "Works from your reference images: style samples, brand assets, sketches. It keeps them in a <code>references/</code> folder so each new image gets better.",
        "Never overwrites a file. Each new version is saved next to the last one.",
        "Three tools for Claude: <code>generate_image</code>, <code>list_references</code>, <code>image_auth_status</code>.",
        "Also works as a one-line command in the terminal.",
      ],
      example: "Generate a watercolor red fox in snow and save it to fox.png using the gptimage tool.",
      install: ["git clone https://github.com/Connected-Mate/gptimage.git", "cd gptimage", "npm install", "./install.sh"],
      installNote: "Needs Node.js 20 or newer, Claude Code and a paid ChatGPT plan (Plus, Pro…). The script is for macOS and Linux. Restart Claude Code afterwards.",
      alt: "The GPTImage mascot: a pixel-art robot painter with a purple beret, a rainbow brush and a framed landscape.",
    },

    voiceAlt: "The GPTVoice mascot: a pixel-art robot with headphones, a teal scarf and a vintage microphone.",

    film: {
      kicker: "Images + voice",
      h2: "A short film, from one idea",
      intro: "Here is the workflow for a 30-second film called <em>The Keeper</em>. The three frames below are real: each was made with GPTImage from a single request.",
      steps: [
        { h: "Write", p: "Ask Claude for a short script cut into scenes, one line of narration per scene." },
        { h: "Paint", p: "GPTImage draws one frame per scene. Reuse the first frame as a reference to keep the same look." },
        { h: "Voice", p: "GPTVoice reads the narration, with subtitles to time your shots." },
        { h: "Assemble", p: "Ask Claude to join frames and audio into a video with <code>ffmpeg</code> (free, installed separately)." },
      ],
      frames: [
        { n: "Scene 1", line: "The storm came early that night.", alt: "Painted storyboard frame: a lighthouse on black rocks at dusk, storm clouds, a small fishing boat far out on heavy seas." },
        { n: "Scene 2", line: "Up in the tower, the old keeper climbed toward the lamp.", alt: "Painted storyboard frame: an old bearded keeper in a yellow oilskin climbs a spiral iron staircase holding a lantern." },
        { n: "Scene 3", line: "One light, and a boat finds its way home.", alt: "Painted storyboard frame: the lighthouse beam cuts through the rain and lights the boat heading for the harbor." },
      ],
      framesCaption: "Storyboard for The Keeper, made with GPTImage.",
      alsoH: "The same recipe works for",
      also: ["a product ad with a voice-over", "an explainer video for your app", "a podcast intro", "social posts with captions read aloud", "a bedtime story with pictures"],
    },

    faq: {
      h2: "Questions",
      items: [
        { q: "Is it really free?", a: "The tools are free and open source. What they do counts against the ChatGPT plan you already pay for, within its limits. There is no per-image bill and no extra subscription." },
        { q: "Do I need an API key?", a: "No. You sign in once with your ChatGPT account, in your own browser. The tool never sees your password." },
        { q: "Which ChatGPT plan do I need?", a: "An active paid plan, such as Plus or Pro. How much you can make depends on your plan’s limits." },
        { q: "Does it work outside Claude Code?", a: "It is built and tested for Claude Code. GPTImage is a standard MCP server, so other MCP apps may work, but they are not tested. It also has a terminal command." },
        { q: "Where is my sign-in stored?", a: "On your computer only, in <code>~/.gptimage/auth.json</code> (or your existing Codex CLI sign-in). It is sent only to OpenAI. Run <code>npm run logout</code> to remove it." },
        { q: "I get a “429” error. What now?", a: "You reached your plan’s limit for now. Wait a bit and try again, and avoid making large batches in one go." },
        { q: "Can I use it for my business?", a: "We advise against it. This is meant for personal use on your own computer. For commercial or high-volume work, use the official OpenAI API." },
        { q: "Where does voice usage count?", a: "GPTVoice uses OpenAI’s realtime voice model, which accepts your ChatGPT sign-in (OpenAI’s paid speech API refuses it). OpenAI does not document where that usage is counted. After your first voices, check <code>platform.openai.com/usage</code>: if anything shows up there, stop." },
      ],
    },

    grey: {
      kicker: "Please read",
      h2: "This is a grey area, and we say so",
      items: [
        "<strong>Unofficial.</strong> “Sign in with ChatGPT” is meant for Codex. These tools reuse that login to reach OpenAI’s image and voice models. It works and is widely done, but it is not an officially supported API.",
        "<strong>Personal use.</strong> Keep it personal and local.",
        "<strong>Rate limits.</strong> Heavy use can trigger your plan’s limits (error 429). Wait and retry.",
        "<strong>Account risk.</strong> In the worst case, OpenAI could restrict your account. By using these tools, you accept that risk.",
        "<strong>Not affiliated.</strong> No link with OpenAI or Anthropic. Follow OpenAI’s terms of use.",
      ],
    },

    footer: {
      made: "Made by Connected-Mate. Open source under the MIT license.",
      legal: "Not affiliated with OpenAI or Anthropic. ChatGPT, Codex and GPT Image are trademarks of OpenAI; Claude and Claude Code are trademarks of Anthropic.",
      gptimage: "GPTImage on GitHub",
      gptvoice: "GPTVoice on GitHub",
      top: "Back to top",
    },

    notFound: { title: "Page not found", h1: "Nothing here", p: "This page does not exist, or it moved.", back: "Go to the home page" },
  },

  fr: {
    htmlLang: "fr",
    ogLocale: "fr_FR",
    title: "Tirez plus de Codex — avec votre abonnement OpenAI",
    description: "Deux outils gratuits et open source qui permettent à Claude Code de créer des images et des voix avec votre connexion ChatGPT. Pas de clé API, pas d’abonnement en plus.",
    skip: "Aller au contenu",
    navLabel: "Sections",
    nav: { how: "Comment ça marche", tools: "Outils", film: "Court film", faq: "FAQ" },
    langLabel: "Langue",
    langNames: { en: "English", fr: "Français" },

    hero: {
      eyebrow: "Pour Claude Code, avec un abonnement ChatGPT",
      h1: "Tirez plus de Codex",
      sub: "avec votre abonnement OpenAI",
      lead: "La connexion « Se connecter avec ChatGPT » que vous utilisez pour Codex sait faire plus que du code. Deux outils gratuits et open source permettent à Claude Code de s’en servir pour créer des images et des voix. De quoi faire des visuels, des narrations, des pubs et des courts films.",
      ctaPrimary: "Installer GPTImage",
      ctaSecondary: "Voir un court film se fabriquer",
      facts: ["Pas de clé API", "Pas d’abonnement en plus", "Tourne sur votre ordinateur", "Open source (MIT)"],
      alt: "Deux robots en pixel art : un peintre en béret violet qui termine un paysage sur un chevalet, et un chanteur avec un casque et un micro. Un clap de cinéma est posé entre eux.",
    },

    notice: {
      title: "Zone grise.",
      body: "Ces outils réutilisent la connexion « Se connecter avec ChatGPT » de Codex. Ce n’est pas une API officielle d’OpenAI. Restez sur un usage personnel : un usage intensif peut atteindre les limites de votre abonnement, voire, au pire, faire restreindre votre compte.",
      link: "Lire l’avis complet",
    },

    how: {
      kicker: "Comment ça marche",
      h2: "Connectez-vous une fois. Ensuite, demandez.",
      steps: [
        { h: "Installez", p: "Copiez quatre lignes dans votre terminal. L’outil est ajouté à Claude Code pour tous les projets de votre ordinateur." },
        { h: "Connectez-vous avec ChatGPT", p: "Votre navigateur s’ouvre sur la page de connexion officielle de ChatGPT. Vous y tapez votre mot de passe, jamais dans l’outil." },
        { h: "Demandez à Claude", p: "Avec vos mots, dans n’importe quel projet. Claude choisit l’outil, crée le fichier et l’enregistre à côté de votre travail." },
      ],
      example: "Crée un renard roux à l’aquarelle dans la neige et enregistre-le dans renard.png.",
      exampleLabel: "Vous tapez",
    },

    tools: {
      kicker: "Deux outils",
      h2: "Un pour les images, un pour les voix",
      intro: "Chacun est un petit serveur MCP : un module qui donne une nouvelle compétence à Claude Code. Les deux utilisent la même connexion ChatGPT.",
      badge: { available: "Disponible", development: "En développement", preview: "Avant-première", released: "Disponible" },
      featuresLabel: { planned: "Prévu", live: "Ce qu’il fait" },
      examplePromptLabel: "Exemple de demande",
      installLabel: "Installation",
      copy: "Copier",
      copied: "Copié",
      copyFailed: "Sélectionnez le texte puis Ctrl+C (⌘C sur Mac)",
      codeLabel: "Commandes d’installation",
      repoLink: "Code source sur GitHub",
      notYet: "Pas encore publié. La commande d’installation apparaîtra ici dès que GPTVoice fonctionnera de bout en bout.",
      samplesLabel: "Écouter",
      sampleSoon: "Extrait audio bientôt disponible. Voici le texte qu’il lira :",
      transcript: "Transcription",
      audioError: "Cet extrait n’a pas pu se charger. La transcription est juste en dessous.",
    },

    gptimage: {
      tagline: "Des images et des retouches par GPT Image 2, directement depuis Claude Code.",
      summary: "Logos, illustrations, maquettes, bannières, textures, storyboards. Les illustrations et le storyboard de cette page ont été faits avec.",
      features: [
        "Part de vos images de référence : styles, éléments de marque, croquis. Il les range dans un dossier <code>references/</code> pour que chaque nouvelle image soit meilleure.",
        "N’écrase jamais un fichier. Chaque nouvelle version est enregistrée à côté de la précédente.",
        "Trois outils pour Claude : <code>generate_image</code>, <code>list_references</code>, <code>image_auth_status</code>.",
        "Marche aussi en une seule commande dans le terminal.",
      ],
      example: "Génère un renard roux à l’aquarelle dans la neige et enregistre-le dans renard.png avec l’outil gptimage.",
      install: ["git clone https://github.com/Connected-Mate/gptimage.git", "cd gptimage", "npm install", "./install.sh"],
      installNote: "Demande Node.js 20 ou plus récent, Claude Code et un abonnement ChatGPT payant (Plus, Pro…). Le script est prévu pour macOS et Linux. Redémarrez Claude Code ensuite.",
      alt: "La mascotte de GPTImage : un robot peintre en pixel art, avec un béret violet, un pinceau arc-en-ciel et un paysage encadré.",
    },

    voiceAlt: "La mascotte de GPTVoice : un robot en pixel art avec un casque, une écharpe turquoise et un micro rétro.",

    film: {
      kicker: "Images + voix",
      h2: "Un court film, à partir d’une idée",
      intro: "Voici la méthode pour un film de 30 secondes appelé <em>The Keeper</em> (le gardien de phare). Les trois images ci-dessous sont réelles : chacune a été faite avec GPTImage, en une seule demande.",
      steps: [
        { h: "Écrire", p: "Demandez à Claude un court scénario découpé en scènes, avec une phrase de narration par scène." },
        { h: "Peindre", p: "GPTImage dessine une image par scène. Réutilisez la première comme référence pour garder le même style." },
        { h: "Faire parler", p: "GPTVoice lit la narration, avec des sous-titres pour caler vos plans." },
        { h: "Assembler", p: "Demandez à Claude de réunir images et son en vidéo avec <code>ffmpeg</code> (gratuit, à installer à part)." },
      ],
      frames: [
        { n: "Scène 1", line: "Cette nuit-là, la tempête arriva tôt.", alt: "Image de storyboard peinte : un phare sur des rochers noirs au crépuscule, des nuages d’orage, un petit bateau de pêche au loin sur une mer forte." },
        { n: "Scène 2", line: "Dans la tour, le vieux gardien monta vers la lampe.", alt: "Image de storyboard peinte : un vieux gardien barbu en ciré jaune monte un escalier en colimaçon, une lanterne à la main." },
        { n: "Scène 3", line: "Une lumière, et un bateau retrouve le port.", alt: "Image de storyboard peinte : le faisceau du phare traverse la pluie et éclaire le bateau qui rentre au port." },
      ],
      framesCaption: "Storyboard de The Keeper, fait avec GPTImage.",
      alsoH: "La même recette marche pour",
      also: ["une pub produit avec voix off", "une vidéo qui explique votre appli", "un générique de podcast", "des posts réseaux sociaux lus à voix haute", "une histoire du soir illustrée"],
    },

    faq: {
      h2: "Questions",
      items: [
        { q: "C’est vraiment gratuit ?", a: "Les outils sont gratuits et open source. Ce qu’ils produisent est décompté de l’abonnement ChatGPT que vous payez déjà, dans ses limites. Pas de facture à l’image, pas d’abonnement en plus." },
        { q: "Faut-il une clé API ?", a: "Non. Vous vous connectez une fois avec votre compte ChatGPT, dans votre propre navigateur. L’outil ne voit jamais votre mot de passe." },
        { q: "Quel abonnement ChatGPT faut-il ?", a: "Un abonnement payant actif, comme Plus ou Pro. Ce que vous pouvez produire dépend des limites de votre formule." },
        { q: "Ça marche en dehors de Claude Code ?", a: "C’est conçu et testé pour Claude Code. GPTImage est un serveur MCP standard : d’autres applis MCP peuvent marcher, mais elles ne sont pas testées. Il existe aussi une commande de terminal." },
        { q: "Où est stockée ma connexion ?", a: "Uniquement sur votre ordinateur, dans <code>~/.gptimage/auth.json</code> (ou votre connexion Codex CLI existante). Elle n’est envoyée qu’à OpenAI. Lancez <code>npm run logout</code> pour la supprimer." },
        { q: "J’ai une erreur « 429 ». Que faire ?", a: "Vous avez atteint la limite de votre abonnement pour le moment. Patientez un peu, réessayez, et évitez les grosses séries d’un coup." },
        { q: "Puis-je l’utiliser pour mon entreprise ?", a: "Nous le déconseillons. C’est prévu pour un usage personnel, sur votre ordinateur. Pour un usage commercial ou à gros volume, utilisez l’API officielle d’OpenAI." },
        { q: "Où est décompté l’usage des voix ?", a: "GPTVoice utilise le modèle vocal temps réel d’OpenAI, qui accepte votre connexion ChatGPT (l’API vocale payante d’OpenAI la refuse). OpenAI ne documente pas où cet usage est décompté. Après vos premières voix, jetez un œil à <code>platform.openai.com/usage</code> : si quelque chose y apparaît, arrêtez." },
      ],
    },

    grey: {
      kicker: "À lire",
      h2: "C’est une zone grise, et nous le disons",
      items: [
        "<strong>Non officiel.</strong> « Se connecter avec ChatGPT » est prévu pour Codex. Ces outils réutilisent cette connexion pour atteindre les modèles d’image et de voix d’OpenAI. Ça marche et c’est très répandu, mais ce n’est pas une API officiellement prise en charge.",
        "<strong>Usage personnel.</strong> Gardez-le personnel et sur votre machine.",
        "<strong>Limites.</strong> Un usage intensif peut déclencher les limites de votre abonnement (erreur 429). Patientez et réessayez.",
        "<strong>Risque pour le compte.</strong> Au pire, OpenAI pourrait restreindre votre compte. En utilisant ces outils, vous acceptez ce risque.",
        "<strong>Aucun lien officiel.</strong> Ni avec OpenAI, ni avec Anthropic. Respectez les conditions d’utilisation d’OpenAI.",
      ],
    },

    footer: {
      made: "Réalisé par Connected-Mate. Open source sous licence MIT.",
      legal: "Aucun lien avec OpenAI ou Anthropic. ChatGPT, Codex et GPT Image sont des marques d’OpenAI ; Claude et Claude Code sont des marques d’Anthropic.",
      gptimage: "GPTImage sur GitHub",
      gptvoice: "GPTVoice sur GitHub",
      top: "Retour en haut",
    },

    notFound: { title: "Page introuvable", h1: "Rien ici", p: "Cette page n’existe pas, ou elle a changé d’adresse.", back: "Aller à l’accueil" },
  },
};
