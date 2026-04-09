const AXES = [
  {
    key: "jager",
    label: "Jager",
    question: "Hoe groot was de adrenalinekick tijdens het aankoopproces?",
    altQuestion: "Hoeveel plezier haalde u uit het jagen en bemachtigen van dit werk?"
  },
  {
    key: "estheet",
    label: "Estheet",
    question: "Hoezeer bepaalt pure visuele schoonheid de waarde van dit stuk?",
    altQuestion: "In welke mate koos u dit werk vooral omdat het visueel raakt?"
  },
  {
    key: "verwant",
    label: "Verwant",
    question: "In welke mate herkent u uzelf of uw emoties in dit werk?",
    altQuestion: "Hoe sterk voelt dit werk persoonlijk of emotioneel verbonden met u?"
  },
  {
    key: "bewaker",
    label: "Bewaker",
    question: "Hoe belangrijk is dit werk als historisch erfgoed of canoniek stuk?",
    altQuestion: "In welke mate ziet u uzelf als bewaker van dit werk voor de toekomst?"
  },
  {
    key: "avonturier",
    label: "Avonturier",
    question: "Hoeveel intellectueel plezier gaf het ontdekken/begrijpen?",
    altQuestion: "Hoe belangrijk was nieuwsgierigheid en inhoudelijke ontdekking bij dit werk?"
  },
  {
    key: "speculant",
    label: "Speculant",
    question: "In hoeverre speelde financiële waarde of marktpotentie een rol?",
    altQuestion: "In welke mate dacht u aan toekomstige waarde of verkoopkansen?"
  },
  {
    key: "architect",
    label: "Architect",
    question: "Hoezeer draagt dit stuk bij aan orde en rust in uw leefomgeving?",
    altQuestion: "Hoe sterk helpt dit werk om uw ruimte coherent en gebalanceerd te maken?"
  }
];

const CHAMBERS = [
  {
    key: "Hart",
    title: "Kamer van het Hart",
    prompt: "Wat zou u nooit verkopen? Wat spiegelt uw ziel?"
  },
  {
    key: "Rede",
    title: "Kamer van de Rede",
    prompt: "Wat is historisch cruciaal of een slimme investering?"
  },
  {
    key: "Jacht",
    title: "Kamer van de Jacht",
    prompt: "Waar was de kick van het verwerven groter dan het bezit?"
  }
];

const SUPPORTED_LOCALES = ["nl", "en", "fr"];
const LOCALE_STORAGE_KEY = "collector_dna_locale_v1";
const API_BASE_STORAGE_KEY = "collector_dna_api_base_v1";
const API_DISCOVERY_PORTS = [3000, 3001, 3002, 3003, 3004, 3010, 8080];

const AXIS_I18N = {
  jager: {
    en: {
      label: "Hunter",
      question: "How strong was the acquisition thrill for this piece?",
      altQuestion: "How much did the hunt itself motivate this purchase?"
    },
    fr: {
      label: "Chasseur",
      question: "À quel point le frisson d'acquisition a-t-il été fort pour cette oeuvre ?",
      altQuestion: "Dans quelle mesure la chasse elle-même a motivé cet achat ?"
    }
  },
  estheet: {
    en: {
      label: "Aesthete",
      question: "How much does pure visual beauty define this piece's value for you?",
      altQuestion: "To what extent did you choose this work mainly for its visual impact?"
    },
    fr: {
      label: "Esthète",
      question: "Dans quelle mesure la beauté visuelle pure définit-elle la valeur de cette oeuvre ?",
      altQuestion: "À quel point avez-vous choisi cette oeuvre surtout pour son impact visuel ?"
    }
  },
  verwant: {
    en: {
      label: "Kindred",
      question: "To what extent do you recognize yourself or your emotions in this work?",
      altQuestion: "How personally or emotionally connected does this work feel to you?"
    },
    fr: {
      label: "Affinité",
      question: "Dans quelle mesure vous reconnaissez-vous, vous ou vos émotions, dans cette oeuvre ?",
      altQuestion: "À quel point cette oeuvre vous semble-t-elle personnellement ou émotionnellement proche ?"
    }
  },
  bewaker: {
    en: {
      label: "Custodian",
      question: "How important is this piece as historical heritage or a canonical work?",
      altQuestion: "To what extent do you see yourself as a steward of this work for the future?"
    },
    fr: {
      label: "Gardien",
      question: "Quelle importance cette oeuvre a-t-elle comme patrimoine historique ou oeuvre canonique ?",
      altQuestion: "Dans quelle mesure vous voyez-vous comme gardien de cette oeuvre pour l'avenir ?"
    }
  },
  avonturier: {
    en: {
      label: "Explorer",
      question: "How much intellectual joy did discovery and understanding bring you?",
      altQuestion: "How important were curiosity and intellectual discovery in this piece?"
    },
    fr: {
      label: "Explorateur",
      question: "Quel plaisir intellectuel vous ont apporté la découverte et la compréhension ?",
      altQuestion: "Dans quelle mesure la curiosité et la découverte intellectuelle ont-elles compté ?"
    }
  },
  speculant: {
    en: {
      label: "Speculator",
      question: "How much did financial value or market potential play a role?",
      altQuestion: "To what extent did future value or resale potential influence you?"
    },
    fr: {
      label: "Spéculateur",
      question: "Dans quelle mesure la valeur financière ou le potentiel de marché ont-ils joué un rôle ?",
      altQuestion: "À quel point la valeur future ou la revente potentielle vous ont-elles influencé ?"
    }
  },
  architect: {
    en: {
      label: "Architect",
      question: "How much does this piece contribute to order and calm in your space?",
      altQuestion: "How strongly does this work help create a coherent and balanced environment?"
    },
    fr: {
      label: "Architecte",
      question: "Dans quelle mesure cette oeuvre apporte-t-elle ordre et calme à votre espace ?",
      altQuestion: "À quel point cette oeuvre aide-t-elle à créer un environnement cohérent et équilibré ?"
    }
  }
};

const CHAMBER_I18N = {
  Hart: {
    en: {
      key: "Heart",
      title: "Chamber of the Heart",
      prompt: "What would you never sell? What mirrors your soul?"
    },
    fr: {
      key: "Coeur",
      title: "Chambre du Coeur",
      prompt: "Que ne vendriez-vous jamais ? Qu'est-ce qui reflète votre âme ?"
    }
  },
  Rede: {
    en: {
      key: "Reason",
      title: "Chamber of Reason",
      prompt: "What is historically crucial or a smart investment?"
    },
    fr: {
      key: "Raison",
      title: "Chambre de la Raison",
      prompt: "Qu'est-ce qui est historiquement crucial ou un investissement avisé ?"
    }
  },
  Jacht: {
    en: {
      key: "Hunt",
      title: "Chamber of the Hunt",
      prompt: "Where was the thrill of acquiring greater than owning?"
    },
    fr: {
      key: "Chasse",
      title: "Chambre de la Chasse",
      prompt: "Où le frisson d'acquérir a-t-il été plus fort que la possession ?"
    }
  }
};

const UI_I18N = {
  nl: {
    languageLabel: "Taal",
    heroTitle: "Ontdek waarom je verzamelt, niet alleen wat je verzamelt",
    heroIntro:
      "Bouw eerst je artwork-bibliotheek, selecteer daarna 9, 12 of 15 topstukken via de <strong>Drie Kamers</strong>, scoor elk stuk op 7 DNA-assen en laat de engine jouw psychologische verzamelprofiel berekenen.",
    heroMeta: "7 assen · 10 archetypen · Shadow profiles",
    libraryTitle: "Data Entry Module · Artwork Bibliotheek",
    libraryIntro:
      "Integreert je data-entry module: voeg artworks toe (manueel of via scrape-link) en selecteer ze daarna per room-slot.",
    manualFormTitle: "Manuele invoer",
    pdfFormTitle: "PDF workflow",
    scrapeFormTitle: "Scrape vanaf 2DGalleries",
    artworkListTitle: "Beschikbare artworks",
    artworkSearchLabel: "Zoek in artworklijst",
    artworkSearchPlaceholder: "Zoek op titel, artiest of bron",
    inputTitle: "Input-Laag · De Drie Kamers",
    inputIntro:
      "Kies 9, 12 of 15 objecten. De app verdeelt die gelijkmatig over de 3 kamers. Elk object krijgt 7 scores op een schaal van 1 (laag) tot 5 (hoog).",
    resultsTitle: "Interpretatie-Laag · Jouw DNA-rapport",
    resultsIntro: "Radar chart, primair archetype, shadow analysis, DNA-mix en technische JSON-output.",
    radarCardTitle: "DNA-Vingerafdruk",
    diagramModeProfile: "Totaalprofiel",
    diagramModeContribution: "Lollipop bijdragen",
    contributionLegend:
      "Lollipop (laag naar hoog): elk punt = één kunstwerk. Q1-Q3 toont de middenzone; boven Q3 = sterkste bijdrage, onder Q1 = laagste bijdrage.",
    contributionAxisX: "Kunstwerken (gesorteerd laag -> hoog)",
    contributionAxisY: "Bijdrage-score",
    contributionSpotLabel: "Middenzone (Q1-Q3)",
    contributionInSpot: "Binnen Q1-Q3 (stabiele bijdrage)",
    contributionOutSpot: "Onder Q1 (laagste bijdrage)",
    contributionAboveBox: "Boven Q3 (sterkste bijdrage)",
    contributionOutlier: "Uitschieter",
    contributionTopAxes: "Sterkste assen",
    contributionStats:
      "Min {min} · Q1 {q1} · Mediaan {median} · Q3 {q3} · Max {max} · IQR {iqr}",
    contributionSummary:
      "Verdeling: {inside}/{total} werken in Q1-Q3, {below} onder Q1 (laagste bijdrage), {above} boven Q3 (sterkste bijdrage), uitschieters: {outliers}. Sterkste bijdrage: {top}.",
    archetypeCardTitle: "Primair Archetype",
    archetypeMatchLabel: "Match",
    profileDistributionLabel: "Profielverdeling",
    shadowCardTitle: "Shadow Analysis",
    shadowCardLabel: "Jouw actieve nee",
    profileCatalogTitle: "Alle profieltypes",
    representativeCardTitle: "Representativiteit van kunstwerken",
    representativeContributionTitle: "Bijdrage per kunstwerk (lollipop)",
    representativeContributionIntro:
      "Hoe hoger een werk scoort, hoe sterker het je profiel mee bepaalt. Boven Q3 = meest representatief; onder Q1 = minst representatief.",
    representativeMostLabel: "Meest representatief werk",
    representativeLeastLabel: "Minst representatief werk",
    representativeDistanceLabel: "Afstand tot DNA-profiel",
    representativeImpactLabel: "Impact op profielvorm",
    representativeContributionScoreLabel: "Bijdrage-score",
    representativeFallbackTitle: "Ongetiteld artwork",
    representativeNoData:
      "Nog geen representativiteitsdata beschikbaar. Vul eerst alle kamers en start daarna de analyse.",
    mixCardTitle: "DNA-Mix",
    jsonCardTitle: "JSON Data-structuur",
    manualSubmit: "Voeg artwork toe",
    pdfSubmit: "Voeg PDF-lijst toe",
    scrapeSubmit: "Scrape artworks",
    clearArtworkList: "Wis artworklijst",
    analyzeBtn: "Analyseer mijn DNA",
    demoBtn: "Laad voorbeeldprofiel",
    resetBtn: "Reset formulier",
    pdfImportAll: "Voeg voorgestelde PDF-lijst toe ({count})",
    pdfSuggestionsTitle: "Voorgestelde kunstwerken uit PDF",
    pdfProgressAnalyzing: "PDF-analyse bezig...",
    pdfProgressLongRunning: "Groot PDF-bestand, analyse loopt nog...",
    pdfProgressDone: "PDF-analyse voltooid.",
    pdfProgressFailed: "PDF-analyse onderbroken.",
    piecesLabel: "Aantal objecten voor analyse",
    pieces15: "15 (volledig profiel)",
    pieces12: "12",
    pieces9: "9",
    nextChamber: "Volgende kamer",
    prevChamber: "Vorige kamer",
    labels: {
      artworkName: "Artwork naam",
      artistName: "Artiest naam",
      pictureUrl: "Picture URL",
      pdfFile: "PDF bestand",
      selectedArtworkName: "Geselecteerde artworknaam",
      pictureUrlOptional: "Picture URL (optioneel)",
      profileUrl: "Profiel URL",
      objectName: "Objectnaam of ID",
      selectFromLibrary: "Selecteer uit bibliotheek",
      removeSelection: "Verwijder selectie",
      chooseForSlot: "Selecteer voor {chamber} · {slot}",
      activeTargetChip: "Actief doel-slot voor selectie",
      noArtist: "Onbekende artiest"
    },
    placeholders: {
      objectName: "Bijv. mattotti_nell_acqua"
    },
    status: {
      high_intensity_explorer: "Hoog-intensieve verkenner",
      anchor_curator: "Verankerende curator",
      market_hunter: "Marktgedreven jager",
      adaptive_collector: "Adaptieve verzamelaar",
      label: "Status: {value}."
    },
    topDrivers: "Top 3 drijfveren: {value}.",
    keyRejection: "Sterkste afwijzing: {value}.",
    distanceRef: "Euclidische afstand tot referentie",
    distanceHybrid: "Indicatieve afstand tot dubbelprofiel",
    runnerUp: "runner-up: {value}",
    margin: "marge: {value}",
    languageSaved: "Taal ingesteld op {value}.",
    autosaveActive: "Autosave actief."
  },
  en: {
    languageLabel: "Language",
    heroTitle: "Discover why you collect, not only what you collect",
    heroIntro:
      "First build your artwork library, then select 9, 12 or 15 key works through the <strong>Three Chambers</strong>, score each work on 7 DNA axes, and let the engine calculate your psychological collector profile.",
    heroMeta: "7 axes · 10 archetypes · Shadow profiles",
    libraryTitle: "Data Entry Module · Artwork Library",
    libraryIntro:
      "Integrates your data-entry module: add artworks (manual or scrape link) and then assign them per room slot.",
    manualFormTitle: "Manual entry",
    pdfFormTitle: "PDF workflow",
    scrapeFormTitle: "Scrape from 2DGalleries",
    artworkListTitle: "Available artworks",
    artworkSearchLabel: "Search in artwork list",
    artworkSearchPlaceholder: "Search by title, artist, or source",
    inputTitle: "Input Layer · The Three Chambers",
    inputIntro:
      "Choose 9, 12 or 15 objects. The app distributes them evenly across 3 chambers. Each object gets 7 scores on a 1 (low) to 5 (high) scale.",
    resultsTitle: "Interpretation Layer · Your DNA Report",
    resultsIntro: "Radar chart, primary archetype, shadow analysis, DNA mix, and technical JSON output.",
    radarCardTitle: "DNA Fingerprint",
    diagramModeProfile: "Overall profile",
    diagramModeContribution: "Lollipop contribution",
    contributionLegend:
      "Lollipop (low to high): each point = one artwork. Q1-Q3 is the middle zone; above Q3 = strongest contribution, below Q1 = lowest contribution.",
    contributionAxisX: "Artworks (sorted low -> high)",
    contributionAxisY: "Contribution score",
    contributionSpotLabel: "Middle zone (Q1-Q3)",
    contributionInSpot: "Inside Q1-Q3 (stable contribution)",
    contributionOutSpot: "Below Q1 (lowest contribution)",
    contributionAboveBox: "Above Q3 (strongest contribution)",
    contributionOutlier: "Outlier",
    contributionTopAxes: "Strongest axes",
    contributionStats:
      "Min {min} · Q1 {q1} · Median {median} · Q3 {q3} · Max {max} · IQR {iqr}",
    contributionSummary:
      "Distribution: {inside}/{total} works in Q1-Q3, {below} below Q1 (lowest contribution), {above} above Q3 (strongest contribution), outliers: {outliers}. Strongest contribution: {top}.",
    archetypeCardTitle: "Primary Archetype",
    archetypeMatchLabel: "Match",
    profileDistributionLabel: "Profile distribution",
    shadowCardTitle: "Shadow Analysis",
    shadowCardLabel: "Your active no",
    profileCatalogTitle: "All profile types",
    representativeCardTitle: "Artwork representativeness",
    representativeContributionTitle: "Contribution per artwork (lollipop)",
    representativeContributionIntro:
      "The higher a work scores, the more it shapes your profile. Above Q3 = most representative; below Q1 = least representative.",
    representativeMostLabel: "Most representative piece",
    representativeLeastLabel: "Least representative piece",
    representativeDistanceLabel: "Distance to DNA profile",
    representativeImpactLabel: "Impact on profile shape",
    representativeContributionScoreLabel: "Contribution score",
    representativeFallbackTitle: "Untitled artwork",
    representativeNoData:
      "No representativeness data yet. Complete all chambers first and then run the analysis.",
    mixCardTitle: "DNA Mix",
    jsonCardTitle: "JSON Data Structure",
    manualSubmit: "Add artwork",
    pdfSubmit: "Add PDF list",
    scrapeSubmit: "Scrape artworks",
    clearArtworkList: "Clear artwork list",
    analyzeBtn: "Analyze my DNA",
    demoBtn: "Load demo profile",
    resetBtn: "Reset form",
    pdfImportAll: "Add suggested PDF list ({count})",
    pdfSuggestionsTitle: "Suggested artworks from PDF",
    pdfProgressAnalyzing: "PDF analysis in progress...",
    pdfProgressLongRunning: "Large PDF, analysis still running...",
    pdfProgressDone: "PDF analysis completed.",
    pdfProgressFailed: "PDF analysis interrupted.",
    piecesLabel: "Number of objects for analysis",
    pieces15: "15 (full profile)",
    pieces12: "12",
    pieces9: "9",
    nextChamber: "Next chamber",
    prevChamber: "Previous chamber",
    labels: {
      artworkName: "Artwork name",
      artistName: "Artist name",
      pictureUrl: "Picture URL",
      pdfFile: "PDF file",
      selectedArtworkName: "Selected artwork name",
      pictureUrlOptional: "Picture URL (optional)",
      profileUrl: "Profile URL",
      objectName: "Object name or ID",
      selectFromLibrary: "Select from library",
      removeSelection: "Remove selection",
      chooseForSlot: "Select for {chamber} · {slot}",
      activeTargetChip: "Active target slot for selection",
      noArtist: "Unknown artist"
    },
    placeholders: {
      objectName: "e.g. mattotti_nell_acqua"
    },
    status: {
      high_intensity_explorer: "High-Intensity Explorer",
      anchor_curator: "Anchor Curator",
      market_hunter: "Market-Driven Hunter",
      adaptive_collector: "Adaptive Collector",
      label: "Status: {value}."
    },
    topDrivers: "Top 3 drivers: {value}.",
    keyRejection: "Key rejection: {value}.",
    distanceRef: "Euclidean distance to reference",
    distanceHybrid: "Indicative distance to dual profile",
    runnerUp: "runner-up: {value}",
    margin: "margin: {value}",
    languageSaved: "Language set to {value}.",
    autosaveActive: "Autosave active."
  },
  fr: {
    languageLabel: "Langue",
    heroTitle: "Découvrez pourquoi vous collectionnez, pas seulement ce que vous collectionnez",
    heroIntro:
      "Commencez par construire votre bibliothèque d'oeuvres, puis sélectionnez 9, 12 ou 15 pièces clés via les <strong>Trois Chambres</strong>, notez chaque oeuvre sur 7 axes ADN et laissez le moteur calculer votre profil psychologique de collectionneur.",
    heroMeta: "7 axes · 10 archétypes · Profils d'ombre",
    libraryTitle: "Module Data Entry · Bibliothèque d'oeuvres",
    libraryIntro:
      "Intègre votre module d'encodage: ajoutez des oeuvres (manuel ou lien de scrape), puis assignez-les par emplacement de salle.",
    manualFormTitle: "Encodage manuel",
    pdfFormTitle: "Workflow PDF",
    scrapeFormTitle: "Scrape depuis 2DGalleries",
    artworkListTitle: "Oeuvres disponibles",
    artworkSearchLabel: "Rechercher dans la liste",
    artworkSearchPlaceholder: "Rechercher par titre, artiste ou source",
    inputTitle: "Couche d'Entrée · Les Trois Chambres",
    inputIntro:
      "Choisissez 9, 12 ou 15 objets. L'application les répartit équitablement sur 3 chambres. Chaque objet reçoit 7 scores sur une échelle de 1 (faible) à 5 (élevé).",
    resultsTitle: "Couche d'Interprétation · Votre Rapport ADN",
    resultsIntro: "Radar chart, archétype principal, analyse d'ombre, mix ADN et sortie JSON technique.",
    radarCardTitle: "Empreinte ADN",
    diagramModeProfile: "Profil global",
    diagramModeContribution: "Contribution lollipop",
    contributionLegend:
      "Lollipop (faible à élevé) : chaque point = une oeuvre. Q1-Q3 est la zone centrale ; au-dessus de Q3 = contribution la plus forte, sous Q1 = contribution la plus faible.",
    contributionAxisX: "Oeuvres (triées faible -> élevé)",
    contributionAxisY: "Score de contribution",
    contributionSpotLabel: "Zone médiane (Q1-Q3)",
    contributionInSpot: "Dans Q1-Q3 (contribution stable)",
    contributionOutSpot: "Sous Q1 (contribution la plus faible)",
    contributionAboveBox: "Au-dessus de Q3 (contribution la plus forte)",
    contributionOutlier: "Valeur aberrante",
    contributionTopAxes: "Axes dominants",
    contributionStats:
      "Min {min} · Q1 {q1} · Médiane {median} · Q3 {q3} · Max {max} · IQR {iqr}",
    contributionSummary:
      "Distribution : {inside}/{total} oeuvres dans Q1-Q3, {below} sous Q1 (contribution la plus faible), {above} au-dessus de Q3 (contribution la plus forte), valeurs aberrantes : {outliers}. Contribution la plus forte : {top}.",
    archetypeCardTitle: "Archétype Principal",
    archetypeMatchLabel: "Correspondance",
    profileDistributionLabel: "Répartition des profils",
    shadowCardTitle: "Analyse d'Ombre",
    shadowCardLabel: "Votre non actif",
    profileCatalogTitle: "Tous les types de profils",
    representativeCardTitle: "Représentativité des oeuvres",
    representativeContributionTitle: "Contribution par oeuvre (lollipop)",
    representativeContributionIntro:
      "Plus une oeuvre score haut, plus elle façonne votre profil. Au-dessus de Q3 = plus représentative ; sous Q1 = moins représentative.",
    representativeMostLabel: "Oeuvre la plus représentative",
    representativeLeastLabel: "Oeuvre la moins représentative",
    representativeDistanceLabel: "Distance au profil ADN",
    representativeImpactLabel: "Impact sur la forme du profil",
    representativeContributionScoreLabel: "Score de contribution",
    representativeFallbackTitle: "Oeuvre sans titre",
    representativeNoData:
      "Pas encore de données de représentativité. Complétez d'abord toutes les chambres puis lancez l'analyse.",
    mixCardTitle: "Mix ADN",
    jsonCardTitle: "Structure JSON",
    manualSubmit: "Ajouter l'oeuvre",
    pdfSubmit: "Ajouter la liste PDF",
    scrapeSubmit: "Scraper les oeuvres",
    clearArtworkList: "Vider la liste",
    analyzeBtn: "Analyser mon ADN",
    demoBtn: "Charger un profil démo",
    resetBtn: "Réinitialiser le formulaire",
    pdfImportAll: "Ajouter la liste PDF suggérée ({count})",
    pdfSuggestionsTitle: "Oeuvres suggérées depuis le PDF",
    pdfProgressAnalyzing: "Analyse du PDF en cours...",
    pdfProgressLongRunning: "PDF volumineux, analyse toujours en cours...",
    pdfProgressDone: "Analyse du PDF terminée.",
    pdfProgressFailed: "Analyse du PDF interrompue.",
    piecesLabel: "Nombre d'objets pour l'analyse",
    pieces15: "15 (profil complet)",
    pieces12: "12",
    pieces9: "9",
    nextChamber: "Chambre suivante",
    prevChamber: "Chambre précédente",
    labels: {
      artworkName: "Nom de l'oeuvre",
      artistName: "Nom de l'artiste",
      pictureUrl: "URL image",
      pdfFile: "Fichier PDF",
      selectedArtworkName: "Nom de l'oeuvre sélectionnée",
      pictureUrlOptional: "URL image (optionnel)",
      profileUrl: "URL du profil",
      objectName: "Nom d'objet ou ID",
      selectFromLibrary: "Sélectionner depuis la bibliothèque",
      removeSelection: "Retirer la sélection",
      chooseForSlot: "Sélectionner pour {chamber} · {slot}",
      activeTargetChip: "Emplacement cible actif",
      noArtist: "Artiste inconnu"
    },
    placeholders: {
      objectName: "ex. mattotti_nell_acqua"
    },
    status: {
      high_intensity_explorer: "Explorateur Haute Intensité",
      anchor_curator: "Curateur d'Ancrage",
      market_hunter: "Chasseur Orienté Marché",
      adaptive_collector: "Collectionneur Adaptatif",
      label: "Statut : {value}."
    },
    topDrivers: "Top 3 moteurs : {value}.",
    keyRejection: "Rejet clé : {value}.",
    distanceRef: "Distance euclidienne à la référence",
    distanceHybrid: "Distance indicative au profil double",
    runnerUp: "deuxième: {value}",
    margin: "écart: {value}",
    languageSaved: "Langue définie sur {value}.",
    autosaveActive: "Autosave actif."
  }
};

function getCurrentLocalePack() {
  return UI_I18N[state.locale] || UI_I18N.nl;
}

function formatTemplate(template, vars = {}) {
  return String(template || "").replace(/\{(\w+)\}/g, (_full, key) =>
    Object.prototype.hasOwnProperty.call(vars, key) ? String(vars[key]) : ""
  );
}

function tr(path, vars) {
  const pack = getCurrentLocalePack();
  const value = path.split(".").reduce((acc, key) => (acc && acc[key] != null ? acc[key] : null), pack);
  if (typeof value === "string") {
    return formatTemplate(value, vars);
  }

  const fallback = path
    .split(".")
    .reduce((acc, key) => (acc && acc[key] != null ? acc[key] : null), UI_I18N.nl);
  if (typeof fallback === "string") {
    return formatTemplate(fallback, vars);
  }

  return "";
}

function t3(nl, en, fr, vars) {
  const template = state.locale === "en" ? en : state.locale === "fr" ? fr : nl;
  return formatTemplate(template, vars);
}

const ARCHETYPES = [
  {
    name: "Verlichte Jager",
    motto: "Ik jaag op de lijn die de wereld verklaart.",
    description:
      "U verzamelt als intellectuele ontdekkingsreiziger. De jacht, esthetiek en denkkracht versterken elkaar en maken elk object een toegangspoort tot dieper begrip.",
    scores: {
      jager: 5,
      estheet: 5,
      verwant: 4,
      bewaker: 2,
      avonturier: 5,
      speculant: 2,
      architect: 1
    }
  },
  {
    name: "Spirituele Bewoner",
    motto: "Mijn collectie is een thuis voor betekenis.",
    description:
      "U verzamelt voor resonantie en verankering. Objecten worden dragers van emotie, ritueel en persoonlijke geborgenheid.",
    scores: {
      jager: 2,
      estheet: 3,
      verwant: 5,
      bewaker: 3,
      avonturier: 2,
      speculant: 1,
      architect: 5
    }
  },
  {
    name: "Analytische Archivaris",
    motto: "Bewaren is begrijpen.",
    description:
      "U bouwt een kennis-ecosysteem. Context, herkomst en structuur wegen zwaar, en uw verzameling wordt een levend geheugen.",
    scores: {
      jager: 2,
      estheet: 2,
      verwant: 2,
      bewaker: 5,
      avonturier: 4,
      speculant: 2,
      architect: 3
    }
  },
  {
    name: "Koele Strategist",
    motto: "Ik zie patronen voordat de markt ze ziet.",
    description:
      "U beslist met afstand en timing. U combineert competitieve jacht met berekende keuzes rond schaarste, waarde en positie.",
    scores: {
      jager: 5,
      estheet: 3,
      verwant: 1,
      bewaker: 4,
      avonturier: 2,
      speculant: 5,
      architect: 3
    }
  },
  {
    name: "Pure Estheet",
    motto: "Vorm eerst, al het andere volgt.",
    description:
      "Uw beslissingen vertrekken bij visuele impact. U zoekt verfijning, ritme en compositie met minimale ruis van markt of prestige.",
    scores: {
      jager: 2,
      estheet: 5,
      verwant: 2,
      bewaker: 1,
      avonturier: 2,
      speculant: 1,
      architect: 2
    }
  },
  {
    name: "Territorium-Bouwer",
    motto: "Mijn muren zijn een strategisch landschap.",
    description:
      "U verzamelt om ruimte te claimen. Elk object dient zowel impact als ordening en helpt een coherent territorium te markeren.",
    scores: {
      jager: 5,
      estheet: 3,
      verwant: 2,
      bewaker: 3,
      avonturier: 1,
      speculant: 3,
      architect: 5
    }
  },
  {
    name: "Nieuwsgierige Pelgrim",
    motto: "Ik verzamel om mezelf te ontmoeten.",
    description:
      "U beweegt op innerlijke herkenning en intellectuele groei. De collectie is een routekaart van uw persoonlijke evolutie.",
    scores: {
      jager: 1,
      estheet: 3,
      verwant: 5,
      bewaker: 2,
      avonturier: 5,
      speculant: 1,
      architect: 2
    }
  },
  {
    name: "Conceptuele Minimalist",
    motto: "Minder objecten, scherpere ideeën.",
    description:
      "U zoekt hoge conceptuele densiteit per stuk. Visuele helderheid en intellectuele spanning gaan boven bezit als volume.",
    scores: {
      jager: 2,
      estheet: 5,
      verwant: 3,
      bewaker: 2,
      avonturier: 5,
      speculant: 1,
      architect: 1
    }
  },
  {
    name: "Recreatieve Omnivoor",
    motto: "Breed kijken houdt mijn verzameling levend.",
    description:
      "U combineert meerdere motieven zonder rigiditeit. U schakelt soepel tussen esthetiek, ontdekking en plezier in variatie.",
    scores: {
      jager: 3,
      estheet: 4,
      verwant: 3,
      bewaker: 2,
      avonturier: 4,
      speculant: 2,
      architect: 2
    }
  },
  {
    name: "Onvrijwillige Curator",
    motto: "Ik draag zorg voor wat groter is dan mijzelf.",
    description:
      "U verzamelt vanuit plichtsbesef en behoud. Erfgoed en ordening domineren, terwijl jacht en markt op de achtergrond blijven.",
    scores: {
      jager: 1,
      estheet: 2,
      verwant: 3,
      bewaker: 5,
      avonturier: 1,
      speculant: 1,
      architect: 5
    }
  }
];

const ARCHETYPE_I18N = {
  "Verlichte Jager": {
    en: {
      name: "Enlightened Hunter",
      motto: "I hunt for the line that explains the world.",
      description:
        "You collect as an intellectual explorer. Hunt, aesthetics, and thinking reinforce each other and make each object a gateway to deeper understanding."
    },
    fr: {
      name: "Chasseur Éclairé",
      motto: "Je poursuis la ligne qui explique le monde.",
      description:
        "Vous collectionnez comme un explorateur intellectuel. La chasse, l'esthétique et la pensée se renforcent, faisant de chaque oeuvre une porte vers une compréhension plus profonde."
    }
  },
  "Spirituele Bewoner": {
    en: {
      name: "Spiritual Dweller",
      motto: "My collection is a home for meaning.",
      description:
        "You collect for resonance and grounding. Objects become carriers of emotion, ritual, and personal shelter."
    },
    fr: {
      name: "Habitant Spirituel",
      motto: "Ma collection est un foyer de sens.",
      description:
        "Vous collectionnez pour la résonance et l'ancrage. Les oeuvres deviennent des vecteurs d'émotion, de rituel et de refuge personnel."
    }
  },
  "Analytische Archivaris": {
    en: {
      name: "Analytical Archivist",
      motto: "To preserve is to understand.",
      description:
        "You build a knowledge ecosystem. Context, provenance, and structure carry serious weight, and your collection becomes a living memory."
    },
    fr: {
      name: "Archiviste Analytique",
      motto: "Conserver, c'est comprendre.",
      description:
        "Vous construisez un écosystème de connaissance. Le contexte, la provenance et la structure pèsent lourd, et votre collection devient une mémoire vivante."
    }
  },
  "Koele Strategist": {
    en: {
      name: "Cool Strategist",
      motto: "I see patterns before the market does.",
      description:
        "You decide with distance and timing. You combine competitive hunting with calculated choices around scarcity, value, and position."
    },
    fr: {
      name: "Stratège Lucide",
      motto: "Je vois les motifs avant le marché.",
      description:
        "Vous décidez avec recul et timing. Vous combinez une chasse compétitive et des choix calculés autour de la rareté, de la valeur et du positionnement."
    }
  },
  "Pure Estheet": {
    en: {
      name: "Pure Aesthete",
      motto: "Form first, everything else follows.",
      description:
        "Your decisions start from visual impact. You seek refinement, rhythm, and composition with minimal noise from market or prestige."
    },
    fr: {
      name: "Esthète Pur",
      motto: "La forme d'abord, le reste suit.",
      description:
        "Vos décisions partent de l'impact visuel. Vous recherchez raffinement, rythme et composition, avec un minimum de bruit lié au marché ou au prestige."
    }
  },
  "Territorium-Bouwer": {
    en: {
      name: "Territory Builder",
      motto: "My walls are a strategic landscape.",
      description:
        "You collect to claim space. Each object serves both impact and order, helping mark a coherent territory."
    },
    fr: {
      name: "Bâtisseur de Territoire",
      motto: "Mes murs forment un paysage stratégique.",
      description:
        "Vous collectionnez pour affirmer un territoire. Chaque oeuvre sert l'impact et l'ordre, et contribue à une cohérence spatiale."
    }
  },
  "Nieuwsgierige Pelgrim": {
    en: {
      name: "Curious Pilgrim",
      motto: "I collect to meet myself.",
      description:
        "You move through inner recognition and intellectual growth. The collection becomes a map of your personal evolution."
    },
    fr: {
      name: "Pèlerin Curieux",
      motto: "Je collectionne pour me rencontrer.",
      description:
        "Vous avancez par reconnaissance intérieure et croissance intellectuelle. La collection devient la carte de votre évolution personnelle."
    }
  },
  "Conceptuele Minimalist": {
    en: {
      name: "Conceptual Minimalist",
      motto: "Fewer objects, sharper ideas.",
      description:
        "You seek high conceptual density per piece. Visual clarity and intellectual tension matter more than volume of possession."
    },
    fr: {
      name: "Minimaliste Conceptuel",
      motto: "Moins d'objets, des idées plus nettes.",
      description:
        "Vous recherchez une forte densité conceptuelle par oeuvre. La clarté visuelle et la tension intellectuelle priment sur l'accumulation."
    }
  },
  "Recreatieve Omnivoor": {
    en: {
      name: "Recreational Omnivore",
      motto: "Looking broadly keeps my collection alive.",
      description:
        "You combine multiple motives without rigidity. You switch smoothly between aesthetics, discovery, and the pleasure of variation."
    },
    fr: {
      name: "Omnivore Récréatif",
      motto: "Voir large maintient ma collection vivante.",
      description:
        "Vous combinez plusieurs motivations sans rigidité. Vous passez souplement de l'esthétique à la découverte et au plaisir de la variété."
    }
  },
  "Onvrijwillige Curator": {
    en: {
      name: "Reluctant Curator",
      motto: "I care for what is larger than myself.",
      description:
        "You collect from duty and preservation. Heritage and order dominate, while hunt and market stay in the background."
    },
    fr: {
      name: "Curateur Malgré Lui",
      motto: "Je prends soin de ce qui me dépasse.",
      description:
        "Vous collectionnez par devoir et préservation. L'héritage et l'ordre dominent, tandis que la chasse et le marché restent en arrière-plan."
    }
  }
};

const SHADOW_TRIGGER_THRESHOLD = 2.1;

const SHADOW_RULES = [
  {
    id: "lage_architect",
    check: (avg) => avg.architect <= SHADOW_TRIGGER_THRESHOLD,
    title: "De Vrijbuiter",
    text: "U verzamelt voor vrijheid, niet voor orde. Uw muren blijven een experimenteel veld in plaats van een fort."
  },
  {
    id: "lage_speculant",
    check: (avg) => avg.speculant <= SHADOW_TRIGGER_THRESHOLD,
    title: "De Purist",
    text: "Geld speelt nauwelijks mee in de kern van uw keuzes. Passie stuurt, markt volgt op afstand."
  },
  {
    id: "lage_jager_lage_speculant",
    check: (avg) => avg.jager <= SHADOW_TRIGGER_THRESHOLD && avg.speculant <= SHADOW_TRIGGER_THRESHOLD,
    title: "De Onbaatzuchtige",
    text: "U staat buiten de commerciële arena. Noch jacht, noch rendement vormt de drijvende motor."
  },
  {
    id: "lage_architect_lage_bewaker",
    check: (avg) => avg.architect <= SHADOW_TRIGGER_THRESHOLD && avg.bewaker <= SHADOW_TRIGGER_THRESHOLD,
    title: "De Nomade",
    text: "Worteling en erfgoed zijn geen primaire behoefte. Uw collectie blijft bewust beweeglijk en open."
  },
  {
    id: "lage_speculant_lage_avonturier",
    check: (avg) => avg.speculant <= SHADOW_TRIGGER_THRESHOLD && avg.avonturier <= SHADOW_TRIGGER_THRESHOLD,
    title: "De Anti-Hype Verzamelaar",
    text: "U bent immuun voor marktlawaai en intellectuele modegolven. U volgt een eigen, stabiele lijn."
  }
];

const SHADOW_I18N = {
  lage_architect: {
    en: {
      title: "The Free Spirit",
      text: "You collect for freedom, not for order. Your walls stay an experimental field rather than a fortress."
    },
    fr: {
      title: "L'Esprit Libre",
      text: "Vous collectionnez pour la liberté, pas pour l'ordre. Vos murs restent un terrain d'expérimentation plutôt qu'une forteresse."
    }
  },
  lage_speculant: {
    en: {
      title: "The Purist",
      text: "Money barely sits at the core of your choices. Passion leads; the market follows at a distance."
    },
    fr: {
      title: "Le Puriste",
      text: "L'argent pèse très peu au coeur de vos choix. La passion guide, le marché suit de loin."
    }
  },
  lage_jager_lage_speculant: {
    en: {
      title: "The Unselfish Collector",
      text: "You stand outside the commercial arena. Neither hunting nor returns is the driving motor."
    },
    fr: {
      title: "Le Désintéressé",
      text: "Vous vous tenez hors de l'arène commerciale. Ni la chasse ni le rendement ne sont votre moteur."
    }
  },
  lage_architect_lage_bewaker: {
    en: {
      title: "The Nomad",
      text: "Rooting and heritage are not primary needs. Your collection deliberately stays fluid and open."
    },
    fr: {
      title: "Le Nomade",
      text: "L'ancrage et l'héritage ne sont pas des besoins centraux. Votre collection reste volontairement mobile et ouverte."
    }
  },
  lage_speculant_lage_avonturier: {
    en: {
      title: "The Anti-Hype Collector",
      text: "You are immune to market noise and intellectual trend waves. You follow your own stable line."
    },
    fr: {
      title: "Le Collectionneur Anti-Hype",
      text: "Vous êtes immunisé contre le bruit du marché et les modes intellectuelles. Vous suivez votre propre ligne stable."
    }
  }
};

const OMNIVORE_NAME = "Recreatieve Omnivoor";
const OMNIVORE_DISTANCE_PENALTY = 0.4;
const HYBRID_MARGIN_THRESHOLD = 0.06;

const PLACEHOLDER_IMAGE =
  "data:image/svg+xml;charset=UTF-8," +
  encodeURIComponent(
    "<svg xmlns='http://www.w3.org/2000/svg' width='132' height='92' viewBox='0 0 132 92'><rect width='132' height='92' fill='#f7eddc'/><rect x='8' y='8' width='116' height='76' rx='8' fill='#fff7ec' stroke='#dcb98a'/><circle cx='44' cy='41' r='13' fill='#ffd19d'/><path d='M22 68 L48 49 L66 61 L82 46 L110 68 Z' fill='#9dcab3'/><text x='66' y='84' text-anchor='middle' font-size='10' fill='#725538' font-family='Trebuchet MS'>No image</text></svg>"
  );

const LOCAL_API_BASE_URL = "http://127.0.0.1:3000";

function normalizeApiBase(value) {
  const raw = String(value || "").trim();
  if (!raw) {
    return "";
  }

  try {
    const parsed = new URL(raw);
    if (!/^https?:$/i.test(parsed.protocol)) {
      return "";
    }

    const cleanPath = parsed.pathname === "/" ? "" : parsed.pathname.replace(/\/+$/, "");
    return `${parsed.protocol}//${parsed.host}${cleanPath}`;
  } catch (_error) {
    return "";
  }
}

function getApiBaseFromQuery() {
  try {
    const params = new URLSearchParams(window.location.search || "");
    const raw = params.get("api") || params.get("apiBase") || params.get("api_url") || "";
    return normalizeApiBase(raw);
  } catch (_error) {
    return "";
  }
}

function getApiBaseFromHash() {
  const hash = String(window.location.hash || "");
  if (!hash) {
    return "";
  }

  const match = /(?:^#|[&#])api=([^&]+)/.exec(hash);
  if (!match) {
    return "";
  }

  try {
    return normalizeApiBase(decodeURIComponent(match[1]));
  } catch (_error) {
    return normalizeApiBase(match[1]);
  }
}

function getApiBaseFromStorage() {
  try {
    return normalizeApiBase(localStorage.getItem(API_BASE_STORAGE_KEY));
  } catch (_error) {
    return "";
  }
}

function persistApiBase(base) {
  const normalized = normalizeApiBase(base);
  if (!normalized) {
    return;
  }

  try {
    localStorage.setItem(API_BASE_STORAGE_KEY, normalized);
  } catch (_error) {
    // ignore storage errors
  }
}

function getInitialApiBase() {
  const fromUrl = getApiBaseFromQuery() || getApiBaseFromHash();
  if (fromUrl) {
    persistApiBase(fromUrl);
    return fromUrl;
  }

  const fromStorage = getApiBaseFromStorage();
  if (fromStorage) {
    return fromStorage;
  }

  if (window.location.protocol === "file:") {
    return LOCAL_API_BASE_URL;
  }

  const host = String(window.location.hostname || "").toLowerCase();
  const port = String(window.location.port || "");
  const isLocal = host === "127.0.0.1" || host === "localhost";

  if (isLocal && port === "3000") {
    return "";
  }

  return LOCAL_API_BASE_URL;
}

let API_BASE_URL = getInitialApiBase();

function getApiBaseUrl() {
  return API_BASE_URL;
}

function getSameOriginApiBase() {
  if (!/^https?:$/i.test(String(window.location.protocol || ""))) {
    return "";
  }
  return normalizeApiBase(window.location.origin || "");
}

function setApiBaseUrl(nextBase, options = {}) {
  const normalized = normalizeApiBase(nextBase);
  if (!normalized) {
    return false;
  }

  API_BASE_URL = normalized;
  if (!options.skipPersist) {
    persistApiBase(normalized);
  }
  return true;
}

function buildApiUrl(endpointPath) {
  return `${getApiBaseUrl()}${endpointPath}`;
}

function getApiDiscoveryCandidates() {
  const candidates = [];
  const pushUnique = (value) => {
    const normalized = normalizeApiBase(value);
    if (!normalized) {
      return;
    }
    if (!candidates.includes(normalized)) {
      candidates.push(normalized);
    }
  };

  pushUnique(getApiBaseUrl());
  pushUnique(getApiBaseFromQuery());
  pushUnique(getApiBaseFromHash());
  pushUnique(getApiBaseFromStorage());

  const sameOrigin = getSameOriginApiBase();
  if (sameOrigin) {
    pushUnique(sameOrigin);
  }

  API_DISCOVERY_PORTS.forEach((port) => {
    pushUnique(`http://127.0.0.1:${port}`);
    pushUnique(`http://localhost:${port}`);
  });

  return candidates;
}

async function probeApiBase(base) {
  const healthUrl = `${base}/api/health`;
  try {
    const response = await fetch(healthUrl, {
      method: "GET",
      cache: "no-store"
    });
    if (!response.ok) {
      return false;
    }

    const payload = await response.json().catch(() => null);
    return Boolean(payload && payload.ok === true && payload.service === "data-entry-browser-module");
  } catch (_error) {
    return false;
  }
}

async function probeApiEndpoint(base, endpointPath) {
  const endpointUrl = `${base}${endpointPath}`;
  try {
    const response = await fetch(endpointUrl, {
      method: "POST",
      headers: {
        "content-type": "application/json"
      },
      body: "{}",
      cache: "no-store"
    });
    return response.status !== 404;
  } catch (_error) {
    return false;
  }
}

async function recoverApiBaseFromDiscovery(requiredEndpointPath = "") {
  const candidates = getApiDiscoveryCandidates();
  const previous = getApiBaseUrl();
  for (const candidate of candidates) {
    const ok = await probeApiBase(candidate);
    if (ok) {
      if (requiredEndpointPath) {
        const endpointExists = await probeApiEndpoint(candidate, requiredEndpointPath);
        if (!endpointExists) {
          continue;
        }
      }

      setApiBaseUrl(candidate);
      if (candidate !== previous && elements.saveState) {
        setSaveStatus(
          t3(
            "Backend automatisch gevonden op {url}.",
            "Backend auto-detected on {url}.",
            "Backend détecté automatiquement sur {url}.",
            { url: candidate }
          )
        );
      }
      return true;
    }
  }
  return false;
}
const STORAGE_KEY = "collector_dna_entries_v1";
const AUTOSAVE_DELAY_MS = 220;
const SLOT_OPTIONS = [3, 4, 5];
const DEFAULT_SLOTS_PER_CHAMBER = 5;

function getInitialLocale() {
  try {
    const saved = normalizeText(localStorage.getItem(LOCALE_STORAGE_KEY)).toLowerCase();
    if (SUPPORTED_LOCALES.includes(saved)) {
      return saved;
    }
  } catch (_error) {
    // ignore storage errors
  }

  return SUPPORTED_LOCALES.includes("nl") ? "nl" : SUPPORTED_LOCALES[0];
}

function createAxisQuestionVariantMap() {
  return AXES.reduce((acc, axis) => {
    acc[axis.key] = "primary";
    return acc;
  }, {});
}

const state = {
  locale: getInitialLocale(),
  entries: createInitialEntries(),
  artworks: [],
  artworkLibraryQuery: "",
  pdfSuggestions: [],
  pdfSourceLabel: "PDF",
  axisQuestionVariant: createAxisQuestionVariantMap(),
  slotsPerChamber: DEFAULT_SLOTS_PER_CHAMBER,
  pickerTargetEntryId: null,
  activeChamber: CHAMBERS[0].key,
  lastReport: null,
  reportDiagramMode: "profile"
};

let saveTimer = null;
let eventsBound = false;
let pdfProgressTimer = null;
let pdfProgressCurrentValue = 0;
let pdfProgressIsActive = false;
let contributionScatterModel = null;

const elements = {
  languageSelect: document.getElementById("languageSelect"),
  manualArtworkForm: document.getElementById("manualArtworkForm"),
  pdfArtworkForm: document.getElementById("pdfArtworkForm"),
  pdfExtractStatus: document.getElementById("pdfExtractStatus"),
  pdfProgressWrap: document.getElementById("pdfProgressWrap"),
  pdfProgressLabel: document.getElementById("pdfProgressLabel"),
  pdfProgressValue: document.getElementById("pdfProgressValue"),
  pdfProgressBar: document.getElementById("pdfProgressBar"),
  pdfSuggestionsTitle: document.getElementById("pdfSuggestionsTitle"),
  pdfSuggestionsList: document.getElementById("pdfSuggestionsList"),
  pdfImportAllBtn: document.getElementById("pdfImportAllBtn"),
  scrapeArtworkForm: document.getElementById("scrapeArtworkForm"),
  scrapeArtworkStatus: document.getElementById("scrapeArtworkStatus"),
  artworkList: document.getElementById("artworkList"),
  artworkSearchInput: document.getElementById("artworkSearchInput"),
  artworkListMeta: document.getElementById("artworkListMeta"),
  artworkEmptyState: document.getElementById("artworkEmptyState"),
  clearArtworkListBtn: document.getElementById("clearArtworkListBtn"),
  pickerTargetInfo: document.getElementById("pickerTargetInfo"),
  chambersContainer: document.getElementById("chambersContainer"),
  chamberTabs: document.getElementById("chamberTabs"),
  entryHint: document.getElementById("entryHint"),
  piecesCountSelect: document.getElementById("piecesCountSelect"),
  prevChamberBtn: document.getElementById("prevChamberBtn"),
  nextChamberBtn: document.getElementById("nextChamberBtn"),
  saveState: document.getElementById("saveState"),
  completionBadge: document.getElementById("completionBadge"),
  validationMessage: document.getElementById("validationMessage"),
  analyzeBtn: document.getElementById("analyzeBtn"),
  demoBtn: document.getElementById("demoBtn"),
  resetBtn: document.getElementById("resetBtn"),
  resultsPanel: document.getElementById("resultsPanel"),
  diagramModeProfileBtn: document.getElementById("diagramModeProfileBtn"),
  diagramModeContributionBtn: document.getElementById("diagramModeContributionBtn"),
  radarChart: document.getElementById("radarChart"),
  contributionChart: document.getElementById("contributionChart"),
  contributionChartLegend: document.getElementById("contributionChartLegend"),
  contributionChartSummary: document.getElementById("contributionChartSummary"),
  contributionPointTooltip: document.getElementById("contributionPointTooltip"),
  archetypeName: document.getElementById("archetypeName"),
  archetypeMotto: document.getElementById("archetypeMotto"),
  archetypeDescription: document.getElementById("archetypeDescription"),
  archetypeDistance: document.getElementById("archetypeDistance"),
  profileDistributionLabel: document.getElementById("profileDistributionLabel"),
  profileDistributionList: document.getElementById("profileDistributionList"),
  shadowList: document.getElementById("shadowList"),
  profileCatalogTitle: document.getElementById("profileCatalogTitle"),
  profileCatalogList: document.getElementById("profileCatalogList"),
  representativeCardTitle: document.getElementById("representativeCardTitle"),
  representativeContributionTitle: document.getElementById("representativeContributionTitle"),
  representativeContributionIntro: document.getElementById("representativeContributionIntro"),
  representativeList: document.getElementById("representativeList"),
  topDrivers: document.getElementById("topDrivers"),
  keyRejection: document.getElementById("keyRejection"),
  statusLine: document.getElementById("statusLine"),
  mixBars: document.getElementById("mixBars"),
  jsonOutput: document.getElementById("jsonOutput")
};

initialize();

function initialize() {
  loadDraft();
  attachEvents();
  if (elements.languageSelect instanceof HTMLSelectElement) {
    elements.languageSelect.value = state.locale;
  }
  if (elements.artworkSearchInput instanceof HTMLInputElement) {
    elements.artworkSearchInput.value = state.artworkLibraryQuery;
  }
  applyLocaleToStaticUi();
  syncPiecesSelect();
  renderForm();
  updateCompletion();
  syncChamberUi();
  renderArtworkLibrary();
  clearPdfSuggestionCache();

  if (!elements.saveState.textContent) {
    setSaveStatus(tr("autosaveActive"));
  }
}

function createInitialEntries() {
  const entries = [];

  CHAMBERS.forEach((chamber) => {
    for (let slot = 1; slot <= 5; slot += 1) {
      entries.push({
        id: `${chamber.key.toLowerCase()}_${slot}`,
        chamber: chamber.key,
        slot,
        objectName: "",
        selectedArtworkId: null,
        scores: AXES.reduce((acc, axis) => {
          acc[axis.key] = 3;
          return acc;
        }, {})
      });
    }
  });

  return entries;
}

function renderForm() {
  const html = CHAMBERS.map((chamber) => {
    const chamberEntries = state.entries.filter(
      (entry) => entry.chamber === chamber.key && entry.slot <= state.slotsPerChamber
    );
    const isActive = state.activeChamber === chamber.key;

    return `
      <section class="chamber reveal" data-chamber="${chamber.key}" ${isActive ? "" : "hidden"}>
        <h3 class="chamber-title">${getChamberTitle(chamber.key)}</h3>
        <p class="chamber-sub">${getChamberPrompt(chamber.key)}</p>
        <div class="chamber-grid">
          ${chamberEntries.map((entry) => renderEntryCard(entry)).join("")}
        </div>
      </section>
    `;
  }).join("");

  elements.chambersContainer.innerHTML = html;
}

function getAxisByKey(axisKey) {
  return AXES.find((axis) => axis.key === axisKey) || null;
}

function getAxisLocaleData(axisKey) {
  const axis = getAxisByKey(axisKey);
  if (!axis) {
    return null;
  }

  const localeData = AXIS_I18N[axis.key] && AXIS_I18N[axis.key][state.locale];
  return {
    label: (localeData && localeData.label) || axis.label,
    question: (localeData && localeData.question) || axis.question,
    altQuestion: (localeData && localeData.altQuestion) || axis.altQuestion
  };
}

function getAxisLabel(axisKey) {
  const data = getAxisLocaleData(axisKey);
  return data ? data.label : axisKey;
}

function getAxisQuestionText(axisKey) {
  const data = getAxisLocaleData(axisKey);
  if (!data) {
    return "";
  }

  const variant = state.axisQuestionVariant[axisKey] === "alt" ? "alt" : "primary";
  if (variant === "alt" && normalizeText(data.altQuestion)) {
    return data.altQuestion;
  }

  return data.question;
}

function getChamberLocaleData(chamberKey) {
  const chamber = CHAMBERS.find((item) => item.key === chamberKey);
  if (!chamber) {
    return null;
  }

  const localeData = CHAMBER_I18N[chamber.key] && CHAMBER_I18N[chamber.key][state.locale];
  return {
    key: (localeData && localeData.key) || chamber.key,
    title: (localeData && localeData.title) || chamber.title,
    prompt: (localeData && localeData.prompt) || chamber.prompt
  };
}

function getChamberKeyLabel(chamberKey) {
  const data = getChamberLocaleData(chamberKey);
  return data ? data.key : chamberKey;
}

function getChamberTitle(chamberKey) {
  const data = getChamberLocaleData(chamberKey);
  return data ? data.title : chamberKey;
}

function getChamberPrompt(chamberKey) {
  const data = getChamberLocaleData(chamberKey);
  return data ? data.prompt : "";
}

function getLocaleDisplayName(locale) {
  if (locale === "en") {
    return "English";
  }
  if (locale === "fr") {
    return "Français";
  }
  return "Nederlands";
}

function getLocalizedArchetypeName(name) {
  if (!name) {
    return "";
  }

  const localeData = ARCHETYPE_I18N[name] && ARCHETYPE_I18N[name][state.locale];
  return (localeData && localeData.name) || name;
}

function getLocalizedArchetypeMatch(match) {
  if (!match || match.confidence === "hybrid") {
    return match;
  }

  const localeData = ARCHETYPE_I18N[match.name] && ARCHETYPE_I18N[match.name][state.locale];
  if (!localeData) {
    return match;
  }

  return {
    ...match,
    name: localeData.name || match.name,
    motto: localeData.motto || match.motto,
    description: localeData.description || match.description
  };
}

function getLocalizedShadowRule(rule) {
  const localeData = SHADOW_I18N[rule.id] && SHADOW_I18N[rule.id][state.locale];
  return {
    title: (localeData && localeData.title) || rule.title,
    text: (localeData && localeData.text) || rule.text
  };
}

function getIntlLocale() {
  if (state.locale === "en") {
    return "en-GB";
  }
  if (state.locale === "fr") {
    return "fr-BE";
  }
  return "nl-BE";
}

function getLocalizedSourceLabel(source) {
  const rawSource = normalizeText(source);
  const normalized = rawSource.toLowerCase();
  if (!normalized) {
    return t3("Onbekend", "Unknown", "Inconnu");
  }

  if (normalized === "manual" || normalized === "manueel" || normalized === "manuel") {
    return t3("Manueel", "Manual", "Manuel");
  }
  if (normalized === "scrape") {
    return t3("Scrape", "Scrape", "Scrape");
  }
  if (normalized === "unknown" || normalized === "onbekend" || normalized === "inconnu") {
    return t3("Onbekend", "Unknown", "Inconnu");
  }

  return rawSource;
}

function getLocalizedArtworkTitle(title) {
  const normalized = normalizeText(title).toLowerCase();
  if (!normalized || normalized === "untitled artwork" || normalized === "ongetiteld artwork" || normalized === "oeuvre sans titre") {
    return t3("Ongetiteld artwork", "Untitled artwork", "Oeuvre sans titre");
  }
  return normalizeText(title);
}

function getLocalizedArtistDisplayName(name) {
  const normalized = normalizeText(name).toLowerCase();
  if (
    !normalized ||
    normalized === "unknown artist" ||
    normalized === "onbekende artiest" ||
    normalized === "artiste inconnu" ||
    normalized === "unknown" ||
    normalized === "onbekend" ||
    normalized === "inconnu"
  ) {
    return tr("labels.noArtist");
  }
  return normalizeText(name);
}

function getApiEndpointNotFoundMessage(endpointPath) {
  const attempted = buildApiUrl(endpointPath);
  return t3(
    "API-endpoint {path} niet gevonden (request: {attempted}). Waarschijnlijk draait er een andere of oudere backend op deze poort. Start de backend in `data entry and profile module` via start.command.",
    "API endpoint {path} not found (request: {attempted}). This usually means another or older backend is running on that port. Start the backend in `data entry and profile module` via start.command.",
    "Point d'API {path} introuvable (requête : {attempted}). Cela indique souvent qu'un autre backend, ou une version plus ancienne, tourne sur ce port. Lancez le backend de `data entry and profile module` via start.command.",
    { path: endpointPath, attempted }
  );
}

function applyLocaleToStaticUi() {
  document.documentElement.lang = state.locale;
  document.title = t3(
    "Collector DNA · The Narrative Engine",
    "Collector DNA · The Narrative Engine",
    "Collector DNA · Le Moteur Narratif"
  );

  const heroTitle = document.getElementById("heroTitle");
  const heroIntro = document.getElementById("heroIntro");
  const heroMetaInfo = document.getElementById("heroMetaInfo");
  const libraryTitle = document.getElementById("libraryTitle");
  const libraryIntro = document.getElementById("libraryIntro");
  const manualFormTitle = document.getElementById("manualFormTitle");
  const pdfFormTitle = document.getElementById("pdfFormTitle");
  const scrapeFormTitle = document.getElementById("scrapeFormTitle");
  const artworkListTitle = document.getElementById("artworkListTitle");
  const inputTitle = document.getElementById("inputTitle");
  const inputIntro = document.getElementById("inputIntro");
  const resultsTitle = document.getElementById("resultsTitle");
  const resultsIntro = document.getElementById("resultsIntro");
  const radarCardTitle = document.getElementById("radarCardTitle");
  const archetypeCardTitle = document.getElementById("archetypeCardTitle");
  const archetypeMatchLabel = document.getElementById("archetypeMatchLabel");
  const shadowCardTitle = document.getElementById("shadowCardTitle");
  const shadowCardLabel = document.getElementById("shadowCardLabel");
  const mixCardTitle = document.getElementById("mixCardTitle");
  const jsonCardTitle = document.getElementById("jsonCardTitle");
  const languageSelectLabel = document.getElementById("languageSelectLabel");
  const eyebrow = document.querySelector(".eyebrow");

  if (heroTitle) {
    heroTitle.textContent = tr("heroTitle");
  }
  if (heroIntro) {
    heroIntro.innerHTML = tr("heroIntro");
  }
  if (heroMetaInfo) {
    heroMetaInfo.textContent = tr("heroMeta");
  }
  if (libraryTitle) {
    libraryTitle.textContent = tr("libraryTitle");
  }
  if (libraryIntro) {
    libraryIntro.textContent = tr("libraryIntro");
  }
  if (manualFormTitle) {
    manualFormTitle.textContent = tr("manualFormTitle");
  }
  if (pdfFormTitle) {
    pdfFormTitle.textContent = tr("pdfFormTitle");
  }
  if (scrapeFormTitle) {
    scrapeFormTitle.textContent = tr("scrapeFormTitle");
  }
  if (artworkListTitle) {
    artworkListTitle.textContent = tr("artworkListTitle");
  }
  if (inputTitle) {
    inputTitle.textContent = tr("inputTitle");
  }
  if (inputIntro) {
    inputIntro.textContent = tr("inputIntro");
  }
  if (resultsTitle) {
    resultsTitle.textContent = tr("resultsTitle");
  }
  if (resultsIntro) {
    resultsIntro.textContent = tr("resultsIntro");
  }
  if (radarCardTitle) {
    radarCardTitle.textContent = tr("radarCardTitle");
  }
  if (elements.diagramModeProfileBtn) {
    elements.diagramModeProfileBtn.textContent = tr("diagramModeProfile");
  }
  if (elements.diagramModeContributionBtn) {
    elements.diagramModeContributionBtn.textContent = tr("diagramModeContribution");
  }
  if (elements.contributionChartLegend) {
    elements.contributionChartLegend.textContent = tr("contributionLegend");
  }
  if (elements.contributionChartSummary && !elements.contributionChartSummary.textContent) {
    elements.contributionChartSummary.textContent = "";
  }
  if (archetypeCardTitle) {
    archetypeCardTitle.textContent = tr("archetypeCardTitle");
  }
  if (archetypeMatchLabel) {
    archetypeMatchLabel.textContent = tr("archetypeMatchLabel");
  }
  if (elements.profileDistributionLabel) {
    elements.profileDistributionLabel.textContent = tr("profileDistributionLabel");
  }
  if (shadowCardTitle) {
    shadowCardTitle.textContent = tr("shadowCardTitle");
  }
  if (shadowCardLabel) {
    shadowCardLabel.textContent = tr("shadowCardLabel");
  }
  if (elements.profileCatalogTitle) {
    elements.profileCatalogTitle.textContent = tr("profileCatalogTitle");
  }
  if (elements.representativeCardTitle) {
    elements.representativeCardTitle.textContent = tr("representativeCardTitle");
  }
  if (elements.representativeContributionTitle) {
    elements.representativeContributionTitle.textContent = tr("representativeContributionTitle");
  }
  if (elements.representativeContributionIntro) {
    elements.representativeContributionIntro.textContent = tr("representativeContributionIntro");
  }
  if (mixCardTitle) {
    mixCardTitle.textContent = tr("mixCardTitle");
  }
  if (jsonCardTitle) {
    jsonCardTitle.textContent = tr("jsonCardTitle");
  }
  if (languageSelectLabel) {
    languageSelectLabel.textContent = tr("languageLabel");
  }
  if (eyebrow) {
    eyebrow.textContent = t3(
      "Collector DNA · The Narrative Engine",
      "Collector DNA · The Narrative Engine",
      "Collector DNA · Le Moteur Narratif"
    );
  }
  if (elements.languageSelect instanceof HTMLSelectElement) {
    elements.languageSelect.setAttribute(
      "aria-label",
      t3("Kies taal", "Choose language", "Choisir la langue")
    );
  }

  const manualNameLabel = document.querySelector("label[for='manualArtworkTitle']");
  const manualArtistLabel = document.querySelector("label[for='manualArtistName']");
  const manualUrlLabel = document.querySelector("label[for='manualImageUrl']");
  const pdfFileLabel = document.querySelector("label[for='pdfArtworkFile']");
  const pdfImageLabel = document.querySelector("label[for='pdfImageUrl']");
  const scrapeUrlLabel = document.querySelector("label[for='scrapeProfileUrl']");
  const piecesLabel = document.querySelector("label[for='piecesCountSelect']");
  const artworkSearchLabel = document.querySelector("label[for='artworkSearchInput']");

  if (manualNameLabel) manualNameLabel.textContent = tr("labels.artworkName");
  if (manualArtistLabel) manualArtistLabel.textContent = tr("labels.artistName");
  if (manualUrlLabel) manualUrlLabel.textContent = tr("labels.pictureUrl");
  if (pdfFileLabel) pdfFileLabel.textContent = tr("labels.pdfFile");
  if (pdfImageLabel) pdfImageLabel.textContent = tr("labels.pictureUrlOptional");
  if (scrapeUrlLabel) scrapeUrlLabel.textContent = tr("labels.profileUrl");
  if (piecesLabel) piecesLabel.textContent = tr("piecesLabel");
  if (artworkSearchLabel) artworkSearchLabel.textContent = tr("artworkSearchLabel");
  if (elements.artworkSearchInput instanceof HTMLInputElement) {
    elements.artworkSearchInput.placeholder = tr("artworkSearchPlaceholder");
    elements.artworkSearchInput.setAttribute("aria-label", tr("artworkSearchLabel"));
  }

  if (elements.pdfSuggestionsTitle) {
    elements.pdfSuggestionsTitle.textContent = tr("pdfSuggestionsTitle");
  }

  const manualSubmitBtn = document.getElementById("manualSubmitBtn");
  const pdfSubmitBtn = document.getElementById("pdfSubmitBtn");
  const scrapeSubmitBtn = document.getElementById("scrapeSubmitBtn");
  const clearArtworkListBtn = document.getElementById("clearArtworkListBtn");
  if (manualSubmitBtn) manualSubmitBtn.textContent = tr("manualSubmit");
  if (pdfSubmitBtn) pdfSubmitBtn.textContent = tr("pdfSubmit");
  if (scrapeSubmitBtn) scrapeSubmitBtn.textContent = tr("scrapeSubmit");
  if (clearArtworkListBtn) clearArtworkListBtn.textContent = tr("clearArtworkList");
  if (elements.analyzeBtn) elements.analyzeBtn.textContent = tr("analyzeBtn");
  if (elements.demoBtn) elements.demoBtn.textContent = tr("demoBtn");
  if (elements.resetBtn) elements.resetBtn.textContent = tr("resetBtn");
  if (elements.nextChamberBtn) elements.nextChamberBtn.textContent = tr("nextChamber");
  if (elements.prevChamberBtn) elements.prevChamberBtn.textContent = tr("prevChamber");

  const option15 = elements.piecesCountSelect.querySelector("option[value='15']");
  const option12 = elements.piecesCountSelect.querySelector("option[value='12']");
  const option9 = elements.piecesCountSelect.querySelector("option[value='9']");
  if (option15) option15.textContent = tr("pieces15");
  if (option12) option12.textContent = tr("pieces12");
  if (option9) option9.textContent = tr("pieces9");
  if (elements.piecesCountSelect instanceof HTMLSelectElement) {
    elements.piecesCountSelect.setAttribute(
      "aria-label",
      t3("Kies aantal objecten", "Choose number of objects", "Choisir le nombre d'objets")
    );
  }

  const pdfHint = document.getElementById("pdfHintText");
  if (pdfHint) {
    pdfHint.textContent = t3(
      "Upload een PDF; de app stelt een lijst kunstwerken voor. Pas titel/artist aan of verwijder foutieve items, en voeg daarna de lijst toe.",
      "Upload a PDF; the app proposes an artwork list. Edit title/artist or remove incorrect items, then add the list.",
      "Importez un PDF ; l'application propose une liste d'oeuvres. Modifiez titre/artiste ou supprimez les éléments incorrects, puis ajoutez la liste."
    );
  }

  const emptyState = document.getElementById("artworkEmptyState");
  if (emptyState) {
    emptyState.textContent = t3(
      "Nog geen artworks beschikbaar. Voeg eerst items toe in deze module.",
      "No artworks available yet. Add items first in this module.",
      "Aucune oeuvre disponible pour l'instant. Ajoutez d'abord des éléments dans ce module."
    );
  }

  if (elements.chamberTabs instanceof HTMLElement) {
    elements.chamberTabs.setAttribute(
      "aria-label",
      t3("Kies een kamer", "Choose a chamber", "Choisir une chambre")
    );
  }

  if (elements.radarChart instanceof HTMLCanvasElement) {
    elements.radarChart.setAttribute(
      "aria-label",
      t3("Radar chart van de 7 DNA-assen", "Radar chart of the 7 DNA axes", "Graphique radar des 7 axes ADN")
    );
  }
  if (elements.contributionChart instanceof HTMLCanvasElement) {
    elements.contributionChart.setAttribute(
      "aria-label",
      t3(
        "Lollipopdiagram met bijdragen per kunstwerk",
        "Lollipop chart with contributions per artwork",
        "Diagramme lollipop avec contributions par oeuvre"
      )
    );
  }

  renderPdfSuggestions();
  updatePdfImportAllButton();
  applyReportDiagramModeUi();
  if (elements.pdfProgressWrap instanceof HTMLElement && !elements.pdfProgressWrap.classList.contains("hidden")) {
    if (pdfProgressIsActive) {
      setPdfProgressLabel(tr("pdfProgressAnalyzing"));
    } else if (pdfProgressCurrentValue >= 100) {
      setPdfProgressLabel(tr("pdfProgressDone"));
    } else {
      setPdfProgressLabel(tr("pdfProgressFailed"));
    }
  }
}

function setLocale(locale, options = {}) {
  const normalized = normalizeText(locale).toLowerCase();
  if (!SUPPORTED_LOCALES.includes(normalized)) {
    return;
  }

  state.locale = normalized;
  if (elements.languageSelect instanceof HTMLSelectElement && elements.languageSelect.value !== normalized) {
    elements.languageSelect.value = normalized;
  }

  try {
    localStorage.setItem(LOCALE_STORAGE_KEY, normalized);
  } catch (_error) {
    // ignore
  }

  applyLocaleToStaticUi();
  refreshEntryUi();
  if (!elements.resultsPanel.hidden) {
    const refreshedReport = buildReport(getActiveEntries());
    renderReport(refreshedReport);
  }
  if (!options.silent) {
    setSaveStatus(tr("languageSaved", { value: getLocaleDisplayName(normalized) }));
  }
}

function toggleAxisQuestionVariant(axisKey) {
  const axis = getAxisByKey(axisKey);
  if (!axis) {
    return;
  }

  const current = state.axisQuestionVariant[axis.key] === "alt" ? "alt" : "primary";
  state.axisQuestionVariant[axis.key] = current === "alt" ? "primary" : "alt";

  refreshEntryUi();
  setSaveStatus(
    state.axisQuestionVariant[axis.key] === "alt"
      ? t3(
          "Alternatieve vraag geactiveerd voor {axis}.",
          "Alternative wording enabled for {axis}.",
          "Formulation alternative activée pour {axis}.",
          { axis: getAxisLabel(axis.key) }
        )
      : t3(
          "Standaardvraag geactiveerd voor {axis}.",
          "Default wording enabled for {axis}.",
          "Formulation standard activée pour {axis}.",
          { axis: getAxisLabel(axis.key) }
        )
  );
  scheduleSave();
}

function renderEntryCard(entry) {
  const selectedArtwork = getArtworkById(entry.selectedArtworkId);
  const isActivePickerTarget = state.pickerTargetEntryId === entry.id;
  const linkedCount = entry.selectedArtworkId ? getLinkedEntriesByArtworkId(entry.selectedArtworkId).length : 0;

  const sliderRows = AXES.map((axis) => {
    const questionText = getAxisQuestionText(axis.key);
    const isAltVariant = state.axisQuestionVariant[axis.key] === "alt";

    return `
      <div class="slider-row">
        <div class="slider-meta">
          <span class="axis-question">${escapeHtml(questionText)}</span>
          <div class="slider-tools">
            <button
              type="button"
              class="question-toggle"
              data-action="toggle-axis-question"
              data-axis="${axis.key}"
            >
              ${
                isAltVariant
                  ? t3("Standaard vraag", "Default wording", "Formulation standard")
                  : t3("Andere formulering", "Alternative wording", "Autre formulation")
              }
            </button>
            <span class="slider-value" id="value-${entry.id}-${axis.key}">${entry.scores[axis.key]}</span>
          </div>
        </div>
        <input
          type="range"
          min="1"
          max="5"
          step="1"
          value="${entry.scores[axis.key]}"
          data-entry-id="${entry.id}"
          data-axis="${axis.key}"
          aria-label="${escapeHtml(questionText)}"
        />
      </div>
    `;
  }).join("");

  return `
    <article class="object-card" data-entry-id="${entry.id}">
      <h4>${t3("Object", "Object", "Objet")} ${entry.slot}</h4>
      ${isActivePickerTarget ? `<p class="object-target-chip">${tr("labels.activeTargetChip")}</p>` : ""}
      ${
        selectedArtwork
          ? `
        <div class="object-artwork-preview">
          <img src="${escapeHtml(toSafeImageUrl(selectedArtwork.imageUrl))}" alt="${escapeHtml(selectedArtwork.artworkTitle)}" />
          <div>
            <strong>${escapeHtml(getLocalizedArtworkTitle(selectedArtwork.artworkTitle))}</strong>
            <span>${escapeHtml(getLocalizedArtistDisplayName(selectedArtwork.artistName))}</span>
          </div>
        </div>
      `
          : ""
      }
      <div class="object-actions">
        <button
          type="button"
          class="btn btn-ghost btn-small"
          data-action="pick-artwork"
          data-entry-id="${entry.id}"
        >
          ${tr("labels.selectFromLibrary")}
        </button>
        ${
          selectedArtwork
            ? `
          <button
            type="button"
            class="btn btn-ghost btn-small"
            data-action="clear-artwork"
            data-entry-id="${entry.id}"
          >
            ${tr("labels.removeSelection")}
          </button>
        `
            : ""
        }
      </div>
      ${
        linkedCount > 1
          ? `<p class="linked-score-note">${t3(
              "Gekoppelde scoring actief voor {count} slots met hetzelfde artwork.",
              "Linked scoring active for {count} slots with the same artwork.",
              "Notation liée active pour {count} emplacements avec la même oeuvre.",
              { count: linkedCount }
            )}</p>`
          : ""
      }
      ${sliderRows}
    </article>
  `;
}

function renderChamberTabs() {
  elements.chamberTabs.innerHTML = CHAMBERS.map((chamber, index) => {
    const count = countNamedInChamber(chamber.key);
    const active = chamber.key === state.activeChamber;

    return `
      <button
        type="button"
        role="tab"
        class="chamber-tab ${active ? "is-active" : ""}"
        aria-selected="${active}"
        data-chamber-tab="${chamber.key}"
      >
        ${index + 1}. ${getChamberKeyLabel(chamber.key)} (${count}/${state.slotsPerChamber})
      </button>
    `;
  }).join("");
}

function attachEvents() {
  if (eventsBound) {
    return;
  }

  eventsBound = true;

  if (elements.languageSelect instanceof HTMLSelectElement) {
    elements.languageSelect.addEventListener("change", () => {
      setLocale(elements.languageSelect.value);
    });
  }

  if (elements.artworkSearchInput instanceof HTMLInputElement) {
    elements.artworkSearchInput.addEventListener("input", () => {
      state.artworkLibraryQuery = elements.artworkSearchInput.value || "";
      renderArtworkLibrary();
    });
  }

  elements.chambersContainer.addEventListener("input", (event) => {
    const target = event.target;

    if (!(target instanceof HTMLInputElement)) {
      return;
    }

    const entryId = target.dataset.entryId;
    const entry = state.entries.find((item) => item.id === entryId);

    if (!entry) {
      return;
    }

    if (target.type === "range") {
      const axis = target.dataset.axis;
      const value = clampScore(Number(target.value));
      const linkedEntries =
        entry.selectedArtworkId != null ? getLinkedEntriesByArtworkId(entry.selectedArtworkId) : [entry];

      linkedEntries.forEach((linkedEntry) => {
        linkedEntry.scores[axis] = value;
        updateEntryAxisUi(linkedEntry.id, axis, value);
      });

      if (linkedEntries.length > 1) {
        setSaveStatus(
          t3(
            'Score "{axis}" gesynchroniseerd over {count} slots met hetzelfde artwork.',
            'Score "{axis}" synchronized across {count} slots with the same artwork.',
            'Score "{axis}" synchronisé sur {count} emplacements avec la même oeuvre.',
            { axis: getAxisLabel(axis), count: linkedEntries.length }
          )
        );
      }

      scheduleSave();
    }
  });

  elements.chambersContainer.addEventListener("click", (event) => {
    const target = event.target;
    if (!(target instanceof HTMLElement)) {
      return;
    }

    const button = target.closest("button[data-action]");
    if (!(button instanceof HTMLButtonElement)) {
      return;
    }

    const action = button.dataset.action;
    if (action === "toggle-axis-question") {
      const axisKey = button.dataset.axis;
      if (axisKey) {
        toggleAxisQuestionVariant(axisKey);
      }
      return;
    }

    const entryId = button.dataset.entryId;
    if (!entryId) {
      return;
    }

    if (action === "pick-artwork") {
      activatePickerTarget(entryId);
      return;
    }

    if (action === "clear-artwork") {
      clearArtworkSelectionFromEntry(entryId);
    }
  });

  elements.chamberTabs.addEventListener("click", (event) => {
    const target = event.target;
    if (!(target instanceof HTMLElement)) {
      return;
    }

    const button = target.closest("button[data-chamber-tab]");
    if (!(button instanceof HTMLButtonElement)) {
      return;
    }

    const chamberKey = button.dataset.chamberTab;
    if (!chamberKey || !CHAMBERS.some((chamber) => chamber.key === chamberKey)) {
      return;
    }

    state.activeChamber = chamberKey;
    syncChamberUi();
    scheduleSave();
  });

  elements.piecesCountSelect.addEventListener("change", () => {
    const selectedTotal = Number(elements.piecesCountSelect.value);
    const selectedSlots = selectedTotal / CHAMBERS.length;

    if (!SLOT_OPTIONS.includes(selectedSlots)) {
      return;
    }

    state.slotsPerChamber = selectedSlots;
    state.lastReport = null;

    renderForm();
    updateCompletion();
    syncChamberUi();
    renderArtworkLibrary();

    elements.validationMessage.textContent = "";
    elements.resultsPanel.hidden = true;
    scheduleSave(
      t3(
        "Aantal objecten ingesteld op {count}.",
        "Number of objects set to {count}.",
        "Nombre d'objets défini sur {count}.",
        { count: selectedTotal }
      )
    );
  });

  elements.prevChamberBtn.addEventListener("click", () => {
    stepChamber(-1);
  });

  elements.nextChamberBtn.addEventListener("click", () => {
    stepChamber(1);
  });

  if (elements.diagramModeProfileBtn instanceof HTMLButtonElement) {
    elements.diagramModeProfileBtn.addEventListener("click", () => {
      setReportDiagramMode("profile", { persist: true });
    });
  }

  if (elements.diagramModeContributionBtn instanceof HTMLButtonElement) {
    elements.diagramModeContributionBtn.addEventListener("click", () => {
      setReportDiagramMode("contribution", { persist: true });
    });
  }

  elements.analyzeBtn.addEventListener("click", () => {
    runAnalysisWorkflow({ autoTriggered: false });
  });

  elements.demoBtn.addEventListener("click", () => {
    applyDemoData();
    renderForm();
    updateCompletion();
    syncChamberUi();
    renderArtworkLibrary();
    elements.validationMessage.textContent = t3(
      "Voorbeeldprofiel geladen. Klik op Analyseer mijn DNA.",
      "Demo profile loaded. Click Analyze my DNA.",
      "Profil démo chargé. Cliquez sur Analyser mon ADN."
    );
    scheduleSave(t3("Voorbeeldprofiel opgeslagen.", "Demo profile saved.", "Profil démo enregistré."));
  });

  elements.resetBtn.addEventListener("click", () => {
    state.entries = createInitialEntries();
    state.artworkLibraryQuery = "";
    if (elements.artworkSearchInput instanceof HTMLInputElement) {
      elements.artworkSearchInput.value = "";
    }
    state.activeChamber = CHAMBERS[0].key;
    state.pickerTargetEntryId = null;
    state.lastReport = null;

    renderForm();
    updateCompletion();
    syncChamberUi();
    renderArtworkLibrary();

    elements.validationMessage.textContent = "";
    elements.resultsPanel.hidden = true;
    clearPdfExtractStatus();
    clearPdfSuggestionCache();

    scheduleSave(
      t3(
        "Formulier gereset en opgeslagen.",
        "Form reset and saved.",
        "Formulaire réinitialisé et enregistré."
      )
    );
  });

  elements.manualArtworkForm.addEventListener("submit", (event) => {
    event.preventDefault();

    if (!elements.manualArtworkForm.reportValidity()) {
      return;
    }

    const data = new FormData(elements.manualArtworkForm);
    const artwork = {
      artworkTitle: data.get("artworkTitle"),
      artistName: data.get("artistName"),
      imageUrl: data.get("imageUrl"),
      source: "Manual"
    };

    addArtworks([artwork]);
    elements.manualArtworkForm.reset();
    setSaveStatus(
      t3(
        "Artwork toegevoegd aan bibliotheek.",
        "Artwork added to library.",
        "Oeuvre ajoutée à la bibliothèque."
      )
    );
    scheduleSave();
  });

  elements.pdfArtworkForm.addEventListener("submit", (event) => {
    event.preventDefault();
    importPdfSuggestionsToLibrary();
  });

  const pdfFileInput = elements.pdfArtworkForm.querySelector("input[name='pdfFile']");

  if (pdfFileInput instanceof HTMLInputElement) {
    pdfFileInput.addEventListener("change", async () => {
      const file = pdfFileInput.files && pdfFileInput.files[0] ? pdfFileInput.files[0] : null;
      if (!file) {
        clearPdfExtractStatus();
        clearPdfSuggestionCache();
        return;
      }

      setPdfExtractStatus("warn", t3("PDF-analyse bezig...", "Analyzing PDF...", "Analyse du PDF en cours..."));
      startPdfProgress();
      state.pdfSourceLabel = getPdfSourceLabel(file);

      try {
        const suggestions = await requestPdfSuggestionsWithBackendProgress(file);
        state.pdfSuggestions = suggestions.suggestionsList;
        renderPdfSuggestions();
        updatePdfImportAllButton();
        completePdfProgress();

        if (state.pdfSuggestions.length > 0) {
          setPdfExtractStatus(
            "ok",
            t3(
              "{count} suggesties gevonden. Pas titel/artist aan, verwijder foutieve items en voeg daarna toe.",
              "{count} suggestions found. Edit title/artist, remove incorrect items, then add them.",
              "{count} suggestions trouvées. Modifiez titre/artiste, supprimez les éléments incorrects, puis ajoutez.",
              { count: state.pdfSuggestions.length }
            )
          );
        } else {
          setPdfExtractStatus(
            "warn",
            t3(
              "PDF gelezen, maar er werden geen duidelijke suggesties gevonden. Je kan manueel toevoegen.",
              "PDF read, but no clear suggestions were found. You can add entries manually.",
              "PDF lu, mais aucune suggestion claire n'a été trouvée. Vous pouvez ajouter des entrées manuellement."
            )
          );
        }
      } catch (error) {
        const message = toFriendlyNetworkErrorMessage(
          error,
          t3(
            "Netwerkfout bij PDF-upload. Controleer of de backend draait en herlaad de app.",
            "Network error during PDF upload. Check that the backend is running and reload the app.",
            "Erreur réseau lors de l'upload PDF. Vérifiez que le backend fonctionne et rechargez l'application."
          )
        );
        clearPdfSuggestionCache();
        failPdfProgress();
        setPdfExtractStatus("error", message);
      }
    });
  }

  if (elements.pdfSuggestionsList instanceof HTMLElement) {
    elements.pdfSuggestionsList.addEventListener("input", (event) => {
      const target = event.target;
      if (!(target instanceof HTMLInputElement)) {
        return;
      }

      const field = target.dataset.field;
      if (field !== "pdf-suggestion-title" && field !== "pdf-suggestion-artist") {
        return;
      }

      const index = Number(target.dataset.index);
      if (!Number.isInteger(index) || index < 0 || index >= state.pdfSuggestions.length) {
        return;
      }

      if (field === "pdf-suggestion-title") {
        state.pdfSuggestions[index].artworkTitle = target.value;
      } else {
        state.pdfSuggestions[index].artistName = target.value;
      }
    });

    elements.pdfSuggestionsList.addEventListener("click", (event) => {
      const target = event.target;
      if (!(target instanceof HTMLElement)) {
        return;
      }

      const button = target.closest("button[data-action='remove-pdf-suggestion']");
      if (!(button instanceof HTMLButtonElement)) {
        return;
      }

      const index = Number(button.dataset.index);
      if (!Number.isInteger(index) || index < 0 || index >= state.pdfSuggestions.length) {
        return;
      }

      state.pdfSuggestions.splice(index, 1);
      renderPdfSuggestions();
      updatePdfImportAllButton();

      if (state.pdfSuggestions.length === 0) {
        setPdfExtractStatus(
          "warn",
          t3(
            "Alle voorgestelde items verwijderd. Upload eventueel een nieuwe PDF of voeg manueel toe.",
            "All suggested items removed. Upload another PDF or add entries manually.",
            "Tous les éléments suggérés ont été supprimés. Importez un autre PDF ou ajoutez manuellement."
          )
        );
      } else {
        setPdfExtractStatus(
          "ok",
          t3(
            "{count} voorgestelde items over.",
            "{count} suggested items remaining.",
            "{count} éléments suggérés restants.",
            { count: state.pdfSuggestions.length }
          )
        );
      }
    });
  }

  if (elements.pdfImportAllBtn instanceof HTMLButtonElement) {
    elements.pdfImportAllBtn.addEventListener("click", () => {
      importPdfSuggestionsToLibrary();
    });
  }

  elements.scrapeArtworkForm.addEventListener("submit", async (event) => {
    event.preventDefault();

    if (!elements.scrapeArtworkForm.reportValidity()) {
      return;
    }

    const submitButton = elements.scrapeArtworkForm.querySelector("button[type='submit']");
    const data = new FormData(elements.scrapeArtworkForm);
    const profileUrl = normalizeText(data.get("profileUrl"));

    if (submitButton instanceof HTMLButtonElement) {
      submitButton.disabled = true;
    }

    setScrapeArtworkStatus("warn", t3("Scrape bezig...", "Scraping in progress...", "Scraping en cours..."));

    try {
      const payload = await requestScrapePayload(profileUrl);

      const scraped = (payload.entries || []).map((entry) => ({
        artworkTitle: entry.artworkTitle,
        artistName: entry.artistName,
        imageUrl: entry.imageUrl,
        artworkUrl: entry.artworkUrl,
        source: "Scrape"
      }));

      addArtworks(scraped);

      if (payload.expectedCount == null) {
        setScrapeArtworkStatus(
          "warn",
          t3(
            "{count} artworks gescrapet.",
            "{count} artworks scraped.",
            "{count} oeuvres scrapées.",
            { count: payload.foundCount }
          )
        );
      } else if (payload.meetsExpectedCount) {
        setScrapeArtworkStatus(
          "ok",
          t3(
            "Scrape klaar: {found} artworks gevonden, gelijk aan expected count ({expected}).",
            "Scrape complete: {found} artworks found, matching expected count ({expected}).",
            "Scrape terminé : {found} oeuvres trouvées, conforme au nombre attendu ({expected}).",
            { found: payload.foundCount, expected: payload.expectedCount }
          )
        );
      } else {
        setScrapeArtworkStatus(
          "warn",
          t3(
            "Scrape klaar: {found} gevonden vs {expected} verwacht.",
            "Scrape complete: {found} found vs {expected} expected.",
            "Scrape terminé : {found} trouvées vs {expected} attendues.",
            { found: payload.foundCount, expected: payload.expectedCount }
          )
        );
      }

      scheduleSave(t3("Scrape-resultaten opgeslagen.", "Scrape results saved.", "Résultats du scrape enregistrés."));
    } catch (error) {
      const fallbackMessage = t3(
        "Kan scrape API niet bereiken. Start server.py/server.js in `data entry and profile module` en open via http://127.0.0.1:3000.",
        "Cannot reach scrape API. Start server.py/server.js in `data entry and profile module` and open via http://127.0.0.1:3000.",
        "Impossible d'atteindre l'API de scrape. Lancez server.py/server.js dans `data entry and profile module` puis ouvrez via http://127.0.0.1:3000."
      );
      const userMessage = toFriendlyNetworkErrorMessage(error, fallbackMessage);
      setScrapeArtworkStatus("error", userMessage);
    } finally {
      if (submitButton instanceof HTMLButtonElement) {
        submitButton.disabled = false;
      }
    }
  });

  elements.clearArtworkListBtn.addEventListener("click", () => {
    state.artworks = [];
    state.artworkLibraryQuery = "";
    if (elements.artworkSearchInput instanceof HTMLInputElement) {
      elements.artworkSearchInput.value = "";
    }
    state.entries = state.entries.map((entry) => ({ ...entry, selectedArtworkId: null }));
    state.pickerTargetEntryId = null;
    clearScrapeArtworkStatus();
    clearPdfExtractStatus();
    clearPdfSuggestionCache();

    renderForm();
    updateCompletion();
    syncChamberUi();
    renderArtworkLibrary();

    setSaveStatus(
      t3("Artworklijst gewist.", "Artwork list cleared.", "Liste des oeuvres vidée.")
    );
    scheduleSave();
  });

  elements.artworkList.addEventListener("click", (event) => {
    const target = event.target;
    if (!(target instanceof HTMLElement)) {
      return;
    }

    const button = target.closest("button[data-action='assign-artwork']");
    if (!(button instanceof HTMLButtonElement)) {
      return;
    }

    const artworkId = button.dataset.artworkId;
    if (!artworkId) {
      return;
    }

    assignArtworkToTarget(artworkId);
  });

  if (elements.contributionChart instanceof HTMLCanvasElement) {
    elements.contributionChart.addEventListener("mousemove", (event) => {
      handleContributionChartPointerMove(event);
    });
    elements.contributionChart.addEventListener("mouseleave", () => {
      handleContributionChartPointerLeave();
    });
  }

  window.addEventListener("resize", () => {
    if (!elements.resultsPanel.hidden && state.lastReport) {
      drawActiveReportDiagram(state.lastReport);
    }
  });
}

function stepChamber(direction) {
  const index = CHAMBERS.findIndex((chamber) => chamber.key === state.activeChamber);
  const next = index + direction;

  if (next < 0 || next >= CHAMBERS.length) {
    return;
  }

  state.activeChamber = CHAMBERS[next].key;
  syncChamberUi();
  scheduleSave();
}

function findNextIncompleteChamber(startChamberKey) {
  const startIndex = CHAMBERS.findIndex((chamber) => chamber.key === startChamberKey);
  if (startIndex < 0) {
    return null;
  }

  for (let offset = 1; offset < CHAMBERS.length; offset += 1) {
    const candidate = CHAMBERS[(startIndex + offset) % CHAMBERS.length];
    if (countNamedInChamber(candidate.key) < state.slotsPerChamber) {
      return candidate.key;
    }
  }

  return null;
}

function syncChamberUi() {
  if (state.pickerTargetEntryId && !getExplicitPickerTargetEntry()) {
    state.pickerTargetEntryId = null;
  }

  const index = CHAMBERS.findIndex((chamber) => chamber.key === state.activeChamber);
  const chamber = CHAMBERS[index];

  renderChamberTabs();

  const sections = elements.chambersContainer.querySelectorAll(".chamber");
  sections.forEach((section) => {
    const visible = section.getAttribute("data-chamber") === state.activeChamber;
    section.hidden = !visible;
  });

  const explicitTarget = getExplicitPickerTargetEntry();
  let stepHint = t3(
    "Stap: kies een slot, selecteer een artwork en score daarna de 7 vragen.",
    "Step: choose a slot, select an artwork, then score the 7 questions.",
    "Étape : choisissez un emplacement, sélectionnez une oeuvre, puis répondez aux 7 questions."
  );
  if (explicitTarget) {
    stepHint = explicitTarget.selectedArtworkId
      ? t3(
          "Stap: artwork staat klaar voor object {slot}. Vul nu de 7 vragen in.",
          "Step: artwork is ready for object {slot}. Now answer the 7 questions.",
          "Étape : l'oeuvre est prête pour l'objet {slot}. Répondez maintenant aux 7 questions.",
          { slot: explicitTarget.slot }
        )
      : t3(
          "Stap: selecteer eerst een artwork voor object {slot} in de bibliotheeklijst.",
          "Step: first select an artwork for object {slot} in the artwork list.",
          "Étape : sélectionnez d'abord une oeuvre pour l'objet {slot} dans la liste d'oeuvres.",
          { slot: explicitTarget.slot }
        );
  }

  const chamberTitle = getChamberTitle(chamber.key);
  const chamberPrompt = getChamberPrompt(chamber.key);
  const chamberCountText = t3(
    "Kamer {index} van {total}",
    "Chamber {index} of {total}",
    "Chambre {index} sur {total}",
    { index: index + 1, total: CHAMBERS.length }
  );
  const totalText = t3("{count} objecten totaal", "{count} total objects", "{count} objets au total", {
    count: getTotalPieces()
  });
  elements.entryHint.textContent = `${chamberCountText} · ${chamberTitle} · ${chamberPrompt} · ${totalText} · ${stepHint}`;

  elements.prevChamberBtn.disabled = index === 0;
  elements.nextChamberBtn.disabled = index === CHAMBERS.length - 1;
}

function countNamedInChamber(chamberKey) {
  return state.entries.filter(
    (entry) => entry.chamber === chamberKey && hasSelectedArtwork(entry)
  ).length;
}

function updateCompletion() {
  const named = getActiveEntries().filter((entry) => hasSelectedArtwork(entry)).length;
  elements.completionBadge.textContent = t3(
    "{named} / {total} artworks geselecteerd",
    "{named} / {total} artworks selected",
    "{named} / {total} oeuvres sélectionnées",
    { named, total: getTotalPieces() }
  );
  renderChamberTabs();
}

function getMissingByChamber() {
  return CHAMBERS.map((chamber) => {
    const count = state.entries.filter(
      (entry) =>
        entry.chamber === chamber.key &&
        entry.slot <= state.slotsPerChamber &&
        !hasSelectedArtwork(entry)
    ).length;

    return {
      chamber: chamber.key,
      count
    };
  }).filter((item) => item.count > 0);
}

function runAnalysisWorkflow(options = {}) {
  const missing = getMissingByChamber();

  if (missing.length > 0) {
    const totalMissing = missing.reduce((sum, item) => sum + item.count, 0);
    const detail = missing.map((item) => `${getChamberKeyLabel(item.chamber)} (${item.count})`).join(", ");

    elements.validationMessage.textContent = t3(
      "Nog {count} artworks te selecteren: {detail}.",
      "{count} artworks still to select: {detail}.",
      "Encore {count} oeuvres à sélectionner : {detail}.",
      { count: totalMissing, detail }
    );

    state.activeChamber = missing[0].chamber;
    syncChamberUi();
    elements.resultsPanel.hidden = true;
    return false;
  }

  elements.validationMessage.textContent = options.autoTriggered
    ? t3(
        "Alle kamers ingevuld. DNA-analyse gestart.",
        "All chambers completed. DNA analysis started.",
        "Toutes les chambres sont complètes. Analyse ADN lancée."
      )
    : "";

  const reportEntries = getActiveEntries();
  const reportFromActiveSet = buildReport(reportEntries);
  renderReport(reportFromActiveSet);
  return true;
}

function buildReport(entries) {
  const averages = AXES.reduce((acc, axis) => {
    const total = entries.reduce((sum, entry) => sum + entry.scores[axis.key], 0);
    acc[axis.key] = round2(total / entries.length);
    return acc;
  }, {});

  const match = findClosestArchetype(averages);
  const profileDistribution = calculateProfileDistribution(averages);
  const mix = calculateMix(averages);
  const shadow = computeShadow(averages);
  const status = deriveStatus(averages);
  const artworkContributions = calculateArtworkContributions(entries, averages);
  const representative = deriveRepresentativeArtworks(artworkContributions);

  return {
    averages,
    match,
    profileDistribution,
    mix,
    shadow,
    status,
    artworkContributions,
    representative,
    topDrivers: mix.slice(0, 3),
    keyRejection: mix[mix.length - 1],
    jsonPayload: buildJsonPayload(entries)
  };
}

function buildJsonPayload(entries) {
  const seen = new Map();

  return entries.map((entry, index) => {
    const selectedArtwork = getArtworkById(entry.selectedArtworkId);
    const idSeed = selectedArtwork
      ? selectedArtwork.artworkTitle
      : entry.objectName || `${entry.chamber}_object_${entry.slot}`;
    const baseId = slugify(idSeed) || `object_${index + 1}`;
    const nextCount = (seen.get(baseId) || 0) + 1;
    seen.set(baseId, nextCount);

    const objectId = nextCount === 1 ? baseId : `${baseId}_${nextCount}`;

    return {
      object_id: objectId,
      kamer: entry.chamber,
      selected_artwork: selectedArtwork
        ? {
            artwork_title: selectedArtwork.artworkTitle,
            artist_name: selectedArtwork.artistName,
            image_url: selectedArtwork.imageUrl
          }
        : null,
      scores: { ...entry.scores }
    };
  });
}

function calculateArchetypeDistance(averages, archetype) {
  return calculateEuclideanDistance(averages, archetype.scores);
}

function calculateEuclideanDistance(vectorA, vectorB) {
  return Math.sqrt(
    AXES.reduce((sum, axis) => {
      const a = Number(vectorA?.[axis.key]) || 0;
      const b = Number(vectorB?.[axis.key]) || 0;
      const delta = a - b;
      return sum + delta * delta;
    }, 0)
  );
}

function averageEntriesScores(entries) {
  if (!Array.isArray(entries) || entries.length === 0) {
    return AXES.reduce((acc, axis) => {
      acc[axis.key] = 0;
      return acc;
    }, {});
  }

  return AXES.reduce((acc, axis) => {
    const total = entries.reduce((sum, entry) => sum + (Number(entry?.scores?.[axis.key]) || 0), 0);
    acc[axis.key] = total / entries.length;
    return acc;
  }, {});
}

function calculateArtworkContributions(entries, averages) {
  if (!Array.isArray(entries) || entries.length === 0) {
    return [];
  }

  const totalVolume = entries.reduce(
    (sum, entry) =>
      sum +
      AXES.reduce((axisSum, axis) => axisSum + (Number(entry?.scores?.[axis.key]) || 0), 0),
    0
  );

  const raw = entries.map((entry, index) => {
    const entryScores = normalizeScores(entry.scores);
    const selectedArtwork = getArtworkById(entry.selectedArtworkId);
    const titleSeed = selectedArtwork ? selectedArtwork.artworkTitle : normalizeText(entry.objectName);
    const artistSeed = selectedArtwork ? selectedArtwork.artistName : "";
    const imageUrl = selectedArtwork ? selectedArtwork.imageUrl : "";
    const source = selectedArtwork ? selectedArtwork.source : "";

    const volume = AXES.reduce((sum, axis) => sum + entryScores[axis.key], 0);
    const otherEntries = entries.filter((_item, otherIndex) => otherIndex !== index);
    const withoutAverage = averageEntriesScores(otherEntries);
    const impactDistance =
      otherEntries.length > 0
        ? calculateEuclideanDistance(averages, withoutAverage)
        : calculateEuclideanDistance(averages, entryScores);
    const distanceToProfile = calculateEuclideanDistance(entryScores, averages);
    const axisContribution = AXES.reduce((acc, axis) => {
      acc[axis.key] = round3(entryScores[axis.key] / entries.length);
      return acc;
    }, {});

    return {
      entryId: entry.id,
      chamber: entry.chamber,
      slot: entry.slot,
      artworkTitle: titleSeed,
      artistName: artistSeed,
      imageUrl,
      source,
      scores: { ...entryScores },
      volume,
      distanceToProfile,
      impactDistance,
      axisContribution
    };
  });

  const totalImpactDistance = raw.reduce((sum, item) => sum + item.impactDistance, 0);
  const fallbackShare = round1(100 / raw.length);

  const enriched = raw.map((item) => ({
    ...item,
    volumeShare: totalVolume > 0 ? round1((item.volume / totalVolume) * 100) : fallbackShare,
    impactShare:
      totalImpactDistance > 0 ? round1((item.impactDistance / totalImpactDistance) * 100) : fallbackShare,
    distanceToProfile: round3(item.distanceToProfile),
    impactDistance: round3(item.impactDistance)
  }));

  const summedImpact = enriched.reduce((sum, item) => sum + item.impactShare, 0);
  const correction = round1(100 - summedImpact);
  if (Math.abs(correction) >= 0.1 && enriched.length > 0) {
    enriched[0].impactShare = round1(enriched[0].impactShare + correction);
  }

  const summedVolume = enriched.reduce((sum, item) => sum + item.volumeShare, 0);
  const volumeCorrection = round1(100 - summedVolume);
  if (Math.abs(volumeCorrection) >= 0.1 && enriched.length > 0) {
    enriched[0].volumeShare = round1(enriched[0].volumeShare + volumeCorrection);
  }

  const maxDistance = enriched.reduce(
    (maxValue, item) => Math.max(maxValue, Number(item.distanceToProfile) || 0),
    0
  );
  enriched.forEach((item) => {
    const normalizedDistance = maxDistance > 0 ? (Number(item.distanceToProfile) || 0) / maxDistance : 0;
    const coherenceFactor = Math.max(0, 1 - normalizedDistance);
    item.profileContributionScore = round2((Number(item.impactShare) || 0) * coherenceFactor);
  });

  return enriched.sort(
    (a, b) => b.volumeShare - a.volumeShare || b.impactShare - a.impactShare || a.distanceToProfile - b.distanceToProfile
  );
}

function deriveRepresentativeArtworks(artworkContributions) {
  if (!Array.isArray(artworkContributions) || artworkContributions.length === 0) {
    return {
      most: null,
      least: null
    };
  }

  const rankedMost = [...artworkContributions].sort(
    (a, b) =>
      (Number(b.profileContributionScore) || 0) - (Number(a.profileContributionScore) || 0) ||
      (Number(b.impactShare) || 0) - (Number(a.impactShare) || 0) ||
      (Number(a.distanceToProfile) || 0) - (Number(b.distanceToProfile) || 0)
  );
  const rankedLeast = [...artworkContributions].sort(
    (a, b) =>
      (Number(a.profileContributionScore) || 0) - (Number(b.profileContributionScore) || 0) ||
      (Number(a.impactShare) || 0) - (Number(b.impactShare) || 0) ||
      (Number(b.distanceToProfile) || 0) - (Number(a.distanceToProfile) || 0)
  );

  return {
    most: rankedMost[0] || null,
    least: rankedLeast[0] || null
  };
}

function rankArchetypes(averages) {
  return ARCHETYPES.map((archetype) => {
    const rawDistance = calculateArchetypeDistance(averages, archetype);
    const bias = archetype.name === OMNIVORE_NAME ? OMNIVORE_DISTANCE_PENALTY : 0;

    return {
      ...archetype,
      distance: round3(rawDistance),
      adjustedDistance: round3(rawDistance + bias)
    };
  }).sort((a, b) => {
    if (a.adjustedDistance !== b.adjustedDistance) {
      return a.adjustedDistance - b.adjustedDistance;
    }
    return a.distance - b.distance;
  });
}

function calculateProfileDistribution(averages) {
  const ranked = rankArchetypes(averages);
  if (ranked.length === 0) {
    return [];
  }

  const minDistance = ranked.reduce(
    (minValue, item) => Math.min(minValue, Number(item.adjustedDistance)),
    Number.POSITIVE_INFINITY
  );
  const temperature = 0.75;
  const rawWeights = ranked.map((item) => {
    const shifted = Number(item.adjustedDistance) - minDistance;
    return Math.exp(-shifted / temperature);
  });
  const totalWeight = rawWeights.reduce((sum, value) => sum + value, 0);
  if (!Number.isFinite(totalWeight) || totalWeight <= 0) {
    const equal = round1(100 / ranked.length);
    return ranked.map((item) => ({ ...item, percentage: equal }));
  }

  const withPercentages = ranked.map((item, index) => ({
    ...item,
    percentage: round1((rawWeights[index] / totalWeight) * 100)
  }));

  const summed = withPercentages.reduce((sum, item) => sum + item.percentage, 0);
  const correction = round1(100 - summed);
  if (Math.abs(correction) >= 0.1 && withPercentages.length > 0) {
    withPercentages[0].percentage = round1(withPercentages[0].percentage + correction);
  }

  return withPercentages;
}

function buildHybridArchetype(primary, secondary, marginToNext) {
  const primaryName = getLocalizedArchetypeName(primary.name);
  const secondaryName = getLocalizedArchetypeName(secondary.name);

  return {
    name: t3(
      "Hybride profiel: {primary} × {secondary}",
      "Hybrid profile: {primary} × {secondary}",
      "Profil hybride : {primary} × {secondary}",
      { primary: primaryName, secondary: secondaryName }
    ),
    motto: t3(
      "Uw verzamel-DNA balanceert tussen twee archetypen.",
      "Your collector DNA balances between two archetypes.",
      "Votre ADN de collectionneur s'équilibre entre deux archétypes."
    ),
    description: t3(
      "Uw scorepatroon ligt heel dicht bij zowel {primary} als {secondary}. Dit resultaat wordt bewust als gemengd profiel getoond in plaats van een containerlabel.",
      "Your score pattern sits very close to both {primary} and {secondary}. This result is intentionally shown as a mixed profile instead of a container label.",
      "Votre profil de scores est très proche de {primary} et de {secondary}. Ce résultat est volontairement présenté comme un profil mixte plutôt qu'un label fourre-tout.",
      { primary: primaryName, secondary: secondaryName }
    ),
    distance: round3((primary.distance + secondary.distance) / 2),
    adjustedDistance: primary.adjustedDistance,
    runnerUp: secondary.name,
    marginToNext: round3(marginToNext),
    confidence: "hybrid"
  };
}

function findClosestArchetype(averages) {
  const ranked = rankArchetypes(averages);
  if (ranked.length === 0) {
    return {
      name: t3("Onbekend profiel", "Unknown profile", "Profil inconnu"),
      motto: "-",
      description: t3("Geen archetype data beschikbaar.", "No archetype data available.", "Aucune donnée d'archétype disponible."),
      distance: 0,
      adjustedDistance: 0,
      runnerUp: "",
      marginToNext: 0,
      confidence: "low"
    };
  }

  const primary = ranked[0];
  const secondary = ranked[1] || null;

  if (!secondary) {
    return {
      ...primary,
      runnerUp: "",
      marginToNext: Number.POSITIVE_INFINITY,
      confidence: "high"
    };
  }

  const margin = secondary.adjustedDistance - primary.adjustedDistance;
  const isTightRace = margin <= HYBRID_MARGIN_THRESHOLD;

  if (isTightRace) {
    return buildHybridArchetype(primary, secondary, margin);
  }

  return {
    ...primary,
    runnerUp: secondary.name,
    marginToNext: round3(margin),
    confidence: margin <= HYBRID_MARGIN_THRESHOLD * 1.6 ? "medium" : "high"
  };
}

function calculateMix(averages) {
  const total = AXES.reduce((sum, axis) => sum + averages[axis.key], 0);

  return AXES.map((axis) => {
    const share = total === 0 ? 0 : (averages[axis.key] / total) * 100;
    return {
      key: axis.key,
      label: getAxisLabel(axis.key),
      value: averages[axis.key],
      share: round1(share)
    };
  }).sort((a, b) => b.share - a.share);
}

function computeShadow(averages) {
  const hits = SHADOW_RULES.filter((rule) => rule.check(averages));

  if (hits.length === 0) {
    return [
      {
        title: t3(
          "Geen dominante schaduwtrigger",
          "No dominant shadow trigger",
          "Aucun déclencheur d'ombre dominant"
        ),
        text: t3(
          "Er is geen as op of onder {threshold}. Uw profiel toont eerder een evenwichtige mix dan een uitgesproken actieve nee.",
          "No axis is at or below {threshold}. Your profile shows a balanced mix rather than a pronounced active no.",
          "Aucun axe n'est à ou sous {threshold}. Votre profil montre un mélange équilibré plutôt qu'un non actif marqué.",
          { threshold: SHADOW_TRIGGER_THRESHOLD.toFixed(1) }
        )
      }
    ];
  }

  return hits.map((hit) => getLocalizedShadowRule(hit));
}

function deriveStatus(averages) {
  const values = AXES.map((axis) => averages[axis.key]);
  const spread = Math.max(...values) - Math.min(...values);

  if (spread >= 2.1 && averages.avonturier >= 4 && averages.estheet >= 4) {
    return "high_intensity_explorer";
  }

  if (averages.architect >= 4 && averages.bewaker >= 4) {
    return "anchor_curator";
  }

  if (averages.speculant >= 4 && averages.jager >= 4) {
    return "market_hunter";
  }

  return "adaptive_collector";
}

function renderReport(report) {
  state.lastReport = report;
  elements.resultsPanel.hidden = false;

  const localizedMatch = getLocalizedArchetypeMatch(report.match);
  elements.archetypeName.textContent = localizedMatch.name;
  elements.archetypeMotto.textContent = localizedMatch.motto;
  elements.archetypeDescription.textContent = localizedMatch.description;
  const distanceLabel =
    report.match.confidence === "hybrid"
      ? tr("distanceHybrid")
      : tr("distanceRef");
  const meta = [];
  if (report.match.runnerUp) {
    meta.push(tr("runnerUp", { value: getLocalizedArchetypeName(report.match.runnerUp) }));
  }
  if (Number.isFinite(report.match.marginToNext)) {
    meta.push(tr("margin", { value: round3(report.match.marginToNext) }));
  }
  elements.archetypeDistance.textContent = `${distanceLabel}: ${report.match.distance}${
    meta.length ? ` · ${meta.join(" · ")}` : ""
  }`;

  if (elements.profileDistributionList instanceof HTMLElement) {
    elements.profileDistributionList.innerHTML = (report.profileDistribution || [])
      .map(
        (item) =>
          `<li><strong>${escapeHtml(getLocalizedArchetypeName(item.name))}:</strong> ${item.percentage}%</li>`
      )
      .join("");
  }

  if (elements.profileCatalogList instanceof HTMLElement) {
    const distributionMap = new Map(
      (report.profileDistribution || []).map((item) => [item.name, Number(item.percentage) || 0])
    );
    const catalogItems = ARCHETYPES.map((archetype) => {
      const localized = getLocalizedArchetypeMatch(archetype) || archetype;
      return {
        name: localized.name || archetype.name,
        motto: localized.motto || archetype.motto,
        description: localized.description || archetype.description,
        percentage: round1(distributionMap.get(archetype.name) || 0)
      };
    }).sort((a, b) => b.percentage - a.percentage);

    elements.profileCatalogList.innerHTML = catalogItems
      .map(
        (item) => `
          <article class="profile-catalog-item">
            <p class="profile-catalog-head">
              <strong>${escapeHtml(item.name)}</strong>
              <span class="profile-catalog-pct">${item.percentage}%</span>
            </p>
            <p class="profile-catalog-motto">${escapeHtml(item.motto)}</p>
            <p class="profile-catalog-text">${escapeHtml(item.description)}</p>
          </article>
        `
      )
      .join("");
  }

  elements.shadowList.innerHTML = report.shadow
    .map((entry) => `<li><strong>${entry.title}:</strong> ${entry.text}</li>`)
    .join("");

  elements.topDrivers.textContent =
    tr("topDrivers", {
      value: report.topDrivers.map((driver) => `${driver.label} (${driver.share}%)`).join(", ")
    });

  elements.keyRejection.textContent =
    tr("keyRejection", { value: `${report.keyRejection.label} (${report.keyRejection.share}%)` });

  elements.statusLine.textContent = tr("status.label", { value: tr(`status.${report.status}`) });

  elements.mixBars.innerHTML = report.mix
    .map(
      (item) => `
        <div class="mix-row">
          <span>${item.label}</span>
          <div class="mix-track"><div class="mix-fill" style="width:${item.share}%"></div></div>
          <span>${item.share}%</span>
        </div>
      `
    )
    .join("");

  elements.jsonOutput.textContent = JSON.stringify(report.jsonPayload, null, 2);

  renderRepresentativeSummary(report);
  drawActiveReportDiagram(report);
  elements.resultsPanel.scrollIntoView({ behavior: "smooth", block: "start" });
}

function applyReportDiagramModeUi() {
  if (elements.radarChart instanceof HTMLCanvasElement) {
    elements.radarChart.hidden = false;
  }

  if (elements.contributionChart instanceof HTMLCanvasElement) {
    elements.contributionChart.hidden = false;
  }

  if (elements.contributionChartLegend instanceof HTMLElement) {
    elements.contributionChartLegend.hidden = false;
  }

  if (elements.contributionChartSummary instanceof HTMLElement) {
    elements.contributionChartSummary.hidden = false;
  }
}

function setReportDiagramMode(mode, options = {}) {
  const nextMode = "profile";
  const modeChanged = state.reportDiagramMode !== nextMode;
  state.reportDiagramMode = nextMode;

  applyReportDiagramModeUi();

  if (!elements.resultsPanel.hidden && state.lastReport) {
    drawActiveReportDiagram(state.lastReport);
  }

  if (modeChanged && options.persist) {
    scheduleSave();
  }
}

function drawActiveReportDiagram(report) {
  applyReportDiagramModeUi();
  drawRadarChart(elements.radarChart, report.averages);
  drawContributionChart(elements.contributionChart, report);
}

function getStrongestAxesText(scores, limit = 2) {
  const normalizedScores = normalizeScores(scores);
  const ranked = AXES.map((axis) => ({
    axis: axis.key,
    value: Number(normalizedScores[axis.key]) || 0
  })).sort((a, b) => b.value - a.value);

  return ranked
    .slice(0, Math.max(1, limit))
    .map((item) => `${getAxisLabel(item.axis)} (${item.value})`)
    .join(", ");
}

function quantile(numbers, q) {
  const values = (Array.isArray(numbers) ? numbers : [])
    .map((value) => Number(value))
    .filter((value) => Number.isFinite(value))
    .sort((a, b) => a - b);
  if (values.length === 0) {
    return 0;
  }
  if (values.length === 1) {
    return values[0];
  }

  const clampedQ = Math.max(0, Math.min(1, Number(q)));
  const position = (values.length - 1) * clampedQ;
  const lower = Math.floor(position);
  const upper = Math.ceil(position);
  if (lower === upper) {
    return values[lower];
  }
  const weight = position - lower;
  return values[lower] * (1 - weight) + values[upper] * weight;
}

function computeBoxplotStats(values) {
  const list = (Array.isArray(values) ? values : [])
    .map((value) => Number(value))
    .filter((value) => Number.isFinite(value))
    .sort((a, b) => a - b);

  if (list.length === 0) {
    return {
      min: 0,
      q1: 0,
      median: 0,
      q3: 0,
      max: 0,
      iqr: 0,
      lowerFence: 0,
      upperFence: 0,
      whiskerMin: 0,
      whiskerMax: 0,
      outlierValues: []
    };
  }

  const min = list[0];
  const max = list[list.length - 1];
  const q1 = quantile(list, 0.25);
  const median = quantile(list, 0.5);
  const q3 = quantile(list, 0.75);
  const iqr = q3 - q1;
  const lowerFence = q1 - 1.5 * iqr;
  const upperFence = q3 + 1.5 * iqr;

  const inWhiskers = list.filter((value) => value >= lowerFence && value <= upperFence);
  const whiskerMin = inWhiskers.length > 0 ? inWhiskers[0] : min;
  const whiskerMax = inWhiskers.length > 0 ? inWhiskers[inWhiskers.length - 1] : max;
  const outlierValues = list.filter((value) => value < lowerFence || value > upperFence);

  return {
    min,
    q1,
    median,
    q3,
    max,
    iqr,
    lowerFence,
    upperFence,
    whiskerMin,
    whiskerMax,
    outlierValues
  };
}

function getNiceTickStep(range, targetTicks = 6) {
  const safeRange = Math.max(1e-6, Number(range) || 0);
  const roughStep = safeRange / Math.max(2, targetTicks);
  const exponent = Math.floor(Math.log10(roughStep));
  const base = Math.pow(10, exponent);
  const normalized = roughStep / base;
  let niceMultiplier = 1;
  if (normalized <= 1) {
    niceMultiplier = 1;
  } else if (normalized <= 2) {
    niceMultiplier = 2;
  } else if (normalized <= 5) {
    niceMultiplier = 5;
  } else {
    niceMultiplier = 10;
  }
  return niceMultiplier * base;
}

function drawContributionChart(canvas, report) {
  const ctx = canvas.getContext("2d");
  if (!ctx) {
    return;
  }

  hideContributionChartTooltip();

  const rawItems = Array.isArray(report?.artworkContributions) ? report.artworkContributions : [];
  const items = [...rawItems].sort((a, b) => {
    const aScore = Number(a.profileContributionScore) || 0;
    const bScore = Number(b.profileContributionScore) || 0;
    if (aScore !== bScore) {
      return aScore - bScore;
    }
    return String(a.entryId || "").localeCompare(String(b.entryId || ""));
  });
  const values = items.map((item) => Number(item.profileContributionScore) || 0);
  const stats = computeBoxplotStats(values);
  const ratio = window.devicePixelRatio || 1;
  const rect = canvas.getBoundingClientRect();
  const width = Math.max(320, rect.width || 520);
  const chartHeight = Math.max(280, Math.round(width * 0.54));
  const margin = {
    top: 20,
    right: 20,
    bottom: 56,
    left: 68
  };
  const chartArea = {
    x: margin.left,
    y: margin.top,
    width: Math.max(120, width - margin.left - margin.right),
    height: Math.max(120, chartHeight - margin.top - margin.bottom)
  };

  canvas.width = width * ratio;
  canvas.height = chartHeight * ratio;
  ctx.setTransform(ratio, 0, 0, ratio, 0, 0);
  ctx.clearRect(0, 0, width, chartHeight);
  contributionScatterModel = null;

  if (items.length === 0) {
    ctx.fillStyle = "#5d5048";
    ctx.font = "14px IBM Plex Sans, Segoe UI, sans-serif";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText(tr("representativeNoData"), width / 2, chartHeight / 2);
    if (elements.contributionChartSummary instanceof HTMLElement) {
      elements.contributionChartSummary.textContent = tr("representativeNoData");
    }
    canvas.style.cursor = "default";
    return;
  }

  let scaleMin = stats.min;
  let scaleMax = stats.max;
  if (scaleMin === scaleMax) {
    scaleMin -= 1;
    scaleMax += 1;
  }
  const padding = Math.max(0.6, (scaleMax - scaleMin) * 0.18);
  scaleMin -= padding;
  scaleMax += padding;

  const mapY = (value) => {
    const normalized = (Number(value) - scaleMin) / Math.max(1e-6, scaleMax - scaleMin);
    return chartArea.y + chartArea.height - Math.max(0, Math.min(1, normalized)) * chartArea.height;
  };

  const slotWidth = chartArea.width / Math.max(1, items.length);
  const mapX = (index) => chartArea.x + slotWidth * (index + 0.5);
  const baselineY = mapY(stats.median);
  const yQ1 = mapY(stats.q1);
  const yMedian = mapY(stats.median);
  const yQ3 = mapY(stats.q3);
  const yTop = chartArea.y;
  const yBottom = chartArea.y + chartArea.height;

  ctx.strokeStyle = "#d9c8ae";
  ctx.lineWidth = 1;
  ctx.fillStyle = "#5f5247";
  ctx.font = "11px IBM Plex Sans, Segoe UI, sans-serif";

  const yRange = scaleMax - scaleMin;
  const step = getNiceTickStep(yRange, 6);
  const startTick = Math.ceil(scaleMin / step) * step;
  for (let value = startTick; value <= scaleMax + step * 0.5; value += step) {
    const y = mapY(value);
    ctx.beginPath();
    ctx.moveTo(chartArea.x, y);
    ctx.lineTo(chartArea.x + chartArea.width, y);
    ctx.stroke();
    ctx.textAlign = "right";
    ctx.textBaseline = "middle";
    ctx.fillText(`${round2(value)}`, chartArea.x - 8, y);
  }

  ctx.fillStyle = "#f7d9c844";
  ctx.fillRect(chartArea.x, yQ1, chartArea.width, yBottom - yQ1);
  ctx.fillStyle = "#0f6f6420";
  ctx.fillRect(chartArea.x, yQ3, chartArea.width, yQ1 - yQ3);
  ctx.fillStyle = "#d8efcf44";
  ctx.fillRect(chartArea.x, yTop, chartArea.width, yQ3 - yTop);

  const quartileLines = [
    { y: yQ1, label: "Q1", color: "#886d4d" },
    { y: yMedian, label: t3("Mediaan", "Median", "Médiane"), color: "#234a45" },
    { y: yQ3, label: "Q3", color: "#5a7a56" }
  ];
  quartileLines.forEach((line) => {
    ctx.beginPath();
    ctx.moveTo(chartArea.x, line.y);
    ctx.lineTo(chartArea.x + chartArea.width, line.y);
    ctx.strokeStyle = line.color;
    ctx.lineWidth = 1.6;
    ctx.setLineDash([5, 4]);
    ctx.stroke();
    ctx.setLineDash([]);
  });

  ctx.strokeStyle = "#8e7b61";
  ctx.lineWidth = 1.2;
  ctx.beginPath();
  ctx.moveTo(chartArea.x, chartArea.y + chartArea.height);
  ctx.lineTo(chartArea.x + chartArea.width, chartArea.y + chartArea.height);
  ctx.moveTo(chartArea.x, chartArea.y);
  ctx.lineTo(chartArea.x, chartArea.y + chartArea.height);
  ctx.stroke();

  ctx.fillStyle = "#5b4d43";
  ctx.font = "12px IBM Plex Sans, Segoe UI, sans-serif";
  ctx.save();
  ctx.translate(chartArea.x - 54, chartArea.y + chartArea.height / 2);
  ctx.rotate(-Math.PI / 2);
  ctx.textAlign = "center";
  ctx.textBaseline = "top";
  ctx.fillText(tr("contributionAxisY"), 0, 0);
  ctx.restore();

  ctx.strokeStyle = "#7f786f";
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.moveTo(chartArea.x, baselineY);
  ctx.lineTo(chartArea.x + chartArea.width, baselineY);
  ctx.stroke();

  const points = items.map((item, index) => {
    const score = Number(item.profileContributionScore) || 0;
    const x = mapX(index);
    const y = mapY(score);
    const inBox = score >= stats.q1 && score <= stats.q3;
    const belowBox = score < stats.q1;
    const aboveBox = score > stats.q3;
    const outlier = score < stats.lowerFence || score > stats.upperFence;
    const radius = outlier ? 7.2 : 5.8;
    const fill = belowBox ? "#b05a37" : aboveBox ? "#2f7748" : "#0d6d63";

    ctx.beginPath();
    ctx.moveTo(x, baselineY);
    ctx.lineTo(x, y);
    ctx.strokeStyle = "#7d756c";
    ctx.lineWidth = 2;
    ctx.stroke();

    ctx.beginPath();
    ctx.arc(x, y, radius, 0, Math.PI * 2);
    ctx.fillStyle = fill;
    ctx.fill();
    ctx.strokeStyle = "#fff7ed";
    ctx.lineWidth = 1.6;
    ctx.stroke();
    if (outlier) {
      ctx.beginPath();
      ctx.arc(x, y, radius + 3, 0, Math.PI * 2);
      ctx.strokeStyle = "#3f342d";
      ctx.lineWidth = 1;
      ctx.stroke();
    }

    ctx.beginPath();
    ctx.moveTo(x, yBottom);
    ctx.lineTo(x, yBottom + 5);
    ctx.strokeStyle = "#8e7b61";
    ctx.lineWidth = 1;
    ctx.stroke();

    ctx.fillStyle = "#5f5247";
    ctx.font = "10px IBM Plex Sans, Segoe UI, sans-serif";
    ctx.textAlign = "center";
    ctx.textBaseline = "top";
    ctx.fillText(String(index + 1), x, yBottom + 8);

    return {
      x,
      y,
      radius,
      item,
      order: index + 1,
      score,
      inBox,
      belowBox,
      aboveBox,
      outlier
    };
  });

  contributionScatterModel = {
    points,
    chartArea,
    stats,
    sorted: true
  };

  const insideCount = points.filter((point) => point.inBox).length;
  const belowCount = points.filter((point) => point.belowBox).length;
  const aboveCount = points.filter((point) => point.aboveBox).length;
  const outlierCount = points.filter((point) => point.outlier).length;
  const total = points.length;
  const topImpact = [...items].sort(
    (a, b) => (Number(b.profileContributionScore) || 0) - (Number(a.profileContributionScore) || 0)
  )[0];
  const topTitle = topImpact
    ? getLocalizedArtworkTitle(topImpact.artworkTitle || tr("representativeFallbackTitle"))
    : tr("representativeFallbackTitle");

  const statsText = tr("contributionStats", {
    min: round2(stats.min),
    q1: round2(stats.q1),
    median: round2(stats.median),
    q3: round2(stats.q3),
    max: round2(stats.max),
    iqr: round2(stats.iqr)
  });
  if (elements.contributionChartSummary instanceof HTMLElement) {
    elements.contributionChartSummary.textContent = `${statsText} · ${tr("contributionSummary", {
      inside: insideCount,
      total,
      below: belowCount,
      above: aboveCount,
      outliers: outlierCount,
      top: topTitle,
    })}`;
  }

  ctx.fillStyle = "#5b4d43";
  ctx.font = "12px IBM Plex Sans, Segoe UI, sans-serif";
  ctx.textAlign = "center";
  ctx.textBaseline = "top";
  ctx.fillText(tr("contributionAxisX"), chartArea.x + chartArea.width / 2, yBottom + 30);
}

function findContributionPointAtPosition(x, y) {
  if (!contributionScatterModel || !Array.isArray(contributionScatterModel.points)) {
    return null;
  }

  let nearest = null;
  let nearestDistanceSquared = Number.POSITIVE_INFINITY;
  contributionScatterModel.points.forEach((point) => {
    const dx = x - point.x;
    const dy = y - point.y;
    const distanceSquared = dx * dx + dy * dy;
    const hitRadius = Math.max(10, point.radius + 5);
    if (distanceSquared <= hitRadius * hitRadius && distanceSquared < nearestDistanceSquared) {
      nearest = point;
      nearestDistanceSquared = distanceSquared;
    }
  });

  return nearest;
}

function hideContributionChartTooltip() {
  if (elements.contributionPointTooltip instanceof HTMLElement) {
    elements.contributionPointTooltip.hidden = true;
    elements.contributionPointTooltip.innerHTML = "";
  }

  if (elements.contributionChart instanceof HTMLCanvasElement) {
    elements.contributionChart.style.cursor = "default";
  }
}

function positionContributionTooltip(clientX, clientY) {
  if (!(elements.contributionPointTooltip instanceof HTMLElement)) {
    return;
  }

  const tooltip = elements.contributionPointTooltip;
  const viewportPadding = 12;
  const rect = tooltip.getBoundingClientRect();
  const candidateLeft = clientX + 14;
  const candidateTop = clientY + 14;
  const maxLeft = window.innerWidth - rect.width - viewportPadding;
  const maxTop = window.innerHeight - rect.height - viewportPadding;
  const left = Math.max(viewportPadding, Math.min(maxLeft, candidateLeft));
  const top = Math.max(viewportPadding, Math.min(maxTop, candidateTop));

  tooltip.style.left = `${left}px`;
  tooltip.style.top = `${top}px`;
}

function showContributionChartTooltip(point, clientX, clientY) {
  if (!(elements.contributionPointTooltip instanceof HTMLElement)) {
    return;
  }

  const item = point.item;
  const title = getLocalizedArtworkTitle(item.artworkTitle || tr("representativeFallbackTitle"));
  const artist = normalizeText(item.artistName)
    ? getLocalizedArtistDisplayName(item.artistName)
    : tr("labels.noArtist");
  const chamberMeta = t3(
    "{chamber} · object {slot}",
    "{chamber} · object {slot}",
    "{chamber} · objet {slot}",
    { chamber: getChamberKeyLabel(item.chamber), slot: item.slot }
  );
  const statusLabel = point.inBox
    ? tr("contributionInSpot")
    : point.belowBox
      ? tr("contributionOutSpot")
      : tr("contributionAboveBox");
  const strongestAxes = getStrongestAxesText(item.scores, 2);
  const outlierLabel = point.outlier ? ` · ${tr("contributionOutlier")}` : "";
  const totalPoints = contributionScatterModel && Array.isArray(contributionScatterModel.points)
    ? contributionScatterModel.points.length
    : 0;

  elements.contributionPointTooltip.innerHTML = `
    <img src="${escapeHtml(toSafeImageUrl(item.imageUrl))}" alt="${escapeHtml(title)}" />
    <p class="tooltip-title">${escapeHtml(title)}</p>
    <p class="tooltip-artist">${escapeHtml(artist)}</p>
    <p class="tooltip-meta">${escapeHtml(chamberMeta)}</p>
    <p class="tooltip-meta">${escapeHtml(t3("Rang", "Rank", "Rang"))}: ${point.order || "-"}${
      totalPoints > 0 ? ` / ${totalPoints}` : ""
    }</p>
    <p class="tooltip-meta">${escapeHtml(tr("contributionAxisY"))}: ${round2(
      Number(item.profileContributionScore) || 0
    )}</p>
    <p class="tooltip-meta">${escapeHtml(t3("Impact-aandeel", "Impact share", "Part d'impact"))}: ${round1(
      Number(item.impactShare) || 0
    )}% · ${escapeHtml(t3("Afstand", "Distance", "Distance"))}: ${round2(Number(item.distanceToProfile) || 0)}</p>
    <p class="tooltip-meta">${escapeHtml(tr("contributionTopAxes"))}: ${escapeHtml(strongestAxes)}</p>
    <p class="tooltip-meta">${escapeHtml(`${statusLabel}${outlierLabel}`)}</p>
  `;
  elements.contributionPointTooltip.hidden = false;
  positionContributionTooltip(clientX, clientY);
}

function handleContributionChartPointerMove(event) {
  const canvas = elements.contributionChart;
  if (!(canvas instanceof HTMLCanvasElement)) {
    return;
  }
  if (!contributionScatterModel) {
    hideContributionChartTooltip();
    return;
  }

  const rect = canvas.getBoundingClientRect();
  const x = event.clientX - rect.left;
  const y = event.clientY - rect.top;
  const point = findContributionPointAtPosition(x, y);
  if (!point) {
    hideContributionChartTooltip();
    return;
  }

  canvas.style.cursor = "pointer";
  showContributionChartTooltip(point, event.clientX, event.clientY);
}

function handleContributionChartPointerLeave() {
  hideContributionChartTooltip();
}

function renderRepresentativeSummary(report) {
  if (!(elements.representativeList instanceof HTMLElement)) {
    return;
  }

  const representative = report?.representative || {};
  const entries = [
    { role: "most", label: tr("representativeMostLabel"), item: representative.most },
    { role: "least", label: tr("representativeLeastLabel"), item: representative.least }
  ].filter((entry) => entry.item);

  if (entries.length === 0) {
    elements.representativeList.innerHTML = `<p class="muted">${escapeHtml(tr("representativeNoData"))}</p>`;
    return;
  }

  elements.representativeList.innerHTML = entries
    .map((entry) => {
      const item = entry.item;
      const title = getLocalizedArtworkTitle(item.artworkTitle || tr("representativeFallbackTitle"));
      const artist = normalizeText(item.artistName)
        ? getLocalizedArtistDisplayName(item.artistName)
        : tr("labels.noArtist");
      const chamberLabel = getChamberKeyLabel(item.chamber);
      const chamberMeta = t3(
        "{chamber} · object {slot}",
        "{chamber} · object {slot}",
        "{chamber} · objet {slot}",
        { chamber: chamberLabel, slot: item.slot }
      );

      return `
        <article class="representative-item representative-item-${entry.role}">
          <img src="${escapeHtml(toSafeImageUrl(item.imageUrl))}" alt="${escapeHtml(title)}" />
          <div>
            <h4>${escapeHtml(entry.label)}</h4>
            <p class="rep-title">${escapeHtml(title)}</p>
            <p class="rep-artist">${escapeHtml(artist)}</p>
            <p class="rep-meta">${escapeHtml(chamberMeta)} · ${escapeHtml(
              tr("representativeDistanceLabel")
            )}: ${item.distanceToProfile}</p>
            <p class="rep-impact">${escapeHtml(tr("representativeImpactLabel"))}: ${item.impactShare}%</p>
            <p class="rep-impact">${escapeHtml(tr("representativeContributionScoreLabel"))}: ${round2(
              Number(item.profileContributionScore) || 0
            )}</p>
          </div>
        </article>
      `;
    })
    .join("");
}

function drawRadarChart(canvas, averages) {
  const ctx = canvas.getContext("2d");
  if (!ctx) {
    return;
  }

  const ratio = window.devicePixelRatio || 1;
  const rect = canvas.getBoundingClientRect();
  const width = rect.width || 520;
  const height = width;

  canvas.width = width * ratio;
  canvas.height = height * ratio;
  ctx.setTransform(ratio, 0, 0, ratio, 0, 0);

  ctx.clearRect(0, 0, width, height);

  const cx = width / 2;
  const cy = height / 2;
  const radius = width * 0.34;
  const levels = 5;

  for (let level = 1; level <= levels; level += 1) {
    const r = (radius / levels) * level;
    drawPolygon(ctx, cx, cy, r, AXES.length, {
      stroke: "#dbcab0",
      fill: level % 2 === 0 ? "#f8eee080" : "#fff7ea70"
    });
  }

  AXES.forEach((axis, index) => {
    const angle = (Math.PI * 2 * index) / AXES.length - Math.PI / 2;
    const x = cx + Math.cos(angle) * radius;
    const y = cy + Math.sin(angle) * radius;

    ctx.beginPath();
    ctx.moveTo(cx, cy);
    ctx.lineTo(x, y);
    ctx.strokeStyle = "#d5c4aa";
    ctx.lineWidth = 1;
    ctx.stroke();

    const lx = cx + Math.cos(angle) * (radius + 20);
    const ly = cy + Math.sin(angle) * (radius + 20);

    ctx.fillStyle = "#3e403f";
    ctx.font = "12px IBM Plex Sans, Segoe UI, sans-serif";
    ctx.textAlign = lx < cx - 4 ? "right" : lx > cx + 4 ? "left" : "center";
    ctx.textBaseline = "middle";
    ctx.fillText(getAxisLabel(axis.key), lx, ly);
  });

  const points = AXES.map((axis, index) => {
    const value = averages[axis.key];
    const normalized = value / 5;
    const angle = (Math.PI * 2 * index) / AXES.length - Math.PI / 2;

    return {
      x: cx + Math.cos(angle) * radius * normalized,
      y: cy + Math.sin(angle) * radius * normalized
    };
  });

  ctx.beginPath();
  points.forEach((point, idx) => {
    if (idx === 0) {
      ctx.moveTo(point.x, point.y);
    } else {
      ctx.lineTo(point.x, point.y);
    }
  });
  ctx.closePath();
  ctx.fillStyle = "#0d6d6342";
  ctx.strokeStyle = "#0d6d63";
  ctx.lineWidth = 2;
  ctx.fill();
  ctx.stroke();

  points.forEach((point) => {
    ctx.beginPath();
    ctx.arc(point.x, point.y, 3.4, 0, Math.PI * 2);
    ctx.fillStyle = "#b3392f";
    ctx.fill();
  });
}

function drawPolygon(ctx, cx, cy, radius, sides, colors) {
  ctx.beginPath();
  for (let i = 0; i < sides; i += 1) {
    const angle = (Math.PI * 2 * i) / sides - Math.PI / 2;
    const x = cx + Math.cos(angle) * radius;
    const y = cy + Math.sin(angle) * radius;

    if (i === 0) {
      ctx.moveTo(x, y);
    } else {
      ctx.lineTo(x, y);
    }
  }
  ctx.closePath();
  ctx.fillStyle = colors.fill;
  ctx.strokeStyle = colors.stroke;
  ctx.lineWidth = 1;
  ctx.fill();
  ctx.stroke();
}

function applyDemoData() {
  const demoScores = [
    { jager: 5, estheet: 5, verwant: 4, bewaker: 2, avonturier: 5, speculant: 2, architect: 1 },
    { jager: 4, estheet: 5, verwant: 5, bewaker: 3, avonturier: 5, speculant: 2, architect: 1 },
    { jager: 5, estheet: 4, verwant: 4, bewaker: 2, avonturier: 5, speculant: 1, architect: 1 },
    { jager: 4, estheet: 5, verwant: 4, bewaker: 2, avonturier: 4, speculant: 2, architect: 2 },
    { jager: 5, estheet: 5, verwant: 3, bewaker: 2, avonturier: 5, speculant: 1, architect: 1 }
  ];

  state.entries = state.entries.map((entry, index) => {
    const sample = demoScores[index % demoScores.length];
    return {
      ...entry,
      objectName: `${entry.chamber.toLowerCase()}_${t3("stuk", "piece", "piece")}_${entry.slot}`,
      selectedArtworkId: `demo_${entry.id}`,
      scores: { ...sample }
    };
  });
}

function scheduleSave(customMessage) {
  if (saveTimer) {
    clearTimeout(saveTimer);
  }

  saveTimer = setTimeout(() => {
    saveDraft(customMessage);
  }, AUTOSAVE_DELAY_MS);
}

function saveDraft(customMessage) {
  try {
    const payload = {
      entries: state.entries,
      artworks: state.artworks,
      axisQuestionVariant: state.axisQuestionVariant,
      slotsPerChamber: state.slotsPerChamber,
      pickerTargetEntryId: state.pickerTargetEntryId,
      activeChamber: state.activeChamber,
      reportDiagramMode: state.reportDiagramMode,
      savedAt: Date.now()
    };

    localStorage.setItem(STORAGE_KEY, JSON.stringify(payload));

    if (customMessage) {
      setSaveStatus(customMessage);
    } else {
      setSaveStatus(
        t3(
          "Draft opgeslagen om {time}.",
          "Draft saved at {time}.",
          "Brouillon enregistré à {time}.",
          { time: formatTime(payload.savedAt) }
        )
      );
    }
  } catch (_error) {
    setSaveStatus(
      t3(
        "Autosave niet beschikbaar in deze browsermodus.",
        "Autosave is not available in this browser mode.",
        "L'autosave n'est pas disponible dans ce mode navigateur."
      )
    );
  }
}

function loadDraft() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      return;
    }

    const parsed = JSON.parse(raw);

    if (!isValidDraft(parsed)) {
      return;
    }

    state.entries = parsed.entries.map((entry) => ({
      id: String(entry.id),
      chamber: entry.chamber,
      slot: Number(entry.slot),
      objectName: String(entry.objectName || ""),
      selectedArtworkId: typeof entry.selectedArtworkId === "string" ? entry.selectedArtworkId : null,
      scores: normalizeScores(entry.scores)
    }));

    state.artworks = [];
    if (Array.isArray(parsed.artworks)) {
      parsed.artworks
        .map((artwork) => normalizeArtworkEntry(artwork))
        .filter((artwork) => artwork)
        .forEach((artwork) => {
          artwork.id = artwork.id || createArtworkId(`${artwork.artworkTitle}_${artwork.artistName}`);
          if (state.artworks.some((item) => item.id === artwork.id)) {
            artwork.id = createArtworkId(`${artwork.artworkTitle}_${artwork.artistName}`);
          }
          state.artworks.push(artwork);
        });
    }

    state.activeChamber = CHAMBERS.some((chamber) => chamber.key === parsed.activeChamber)
      ? parsed.activeChamber
      : CHAMBERS[0].key;

    state.pickerTargetEntryId =
      typeof parsed.pickerTargetEntryId === "string" ? parsed.pickerTargetEntryId : null;

    state.reportDiagramMode = parsed.reportDiagramMode === "contribution" ? "contribution" : "profile";

    state.axisQuestionVariant = createAxisQuestionVariantMap();
    if (parsed.axisQuestionVariant && typeof parsed.axisQuestionVariant === "object") {
      AXES.forEach((axis) => {
        const rawVariant = parsed.axisQuestionVariant[axis.key];
        state.axisQuestionVariant[axis.key] = rawVariant === "alt" ? "alt" : "primary";
      });
    }

    const savedSlots = Number(parsed.slotsPerChamber);
    state.slotsPerChamber = SLOT_OPTIONS.includes(savedSlots)
      ? savedSlots
      : DEFAULT_SLOTS_PER_CHAMBER;

    const savedAt = Number(parsed.savedAt);
    if (Number.isFinite(savedAt) && savedAt > 0) {
      setSaveStatus(
        t3(
          "Draft hersteld ({dateTime}).",
          "Draft restored ({dateTime}).",
          "Brouillon restauré ({dateTime}).",
          { dateTime: formatDateTime(savedAt) }
        )
      );
    } else {
      setSaveStatus(t3("Draft hersteld.", "Draft restored.", "Brouillon restauré."));
    }
  } catch (_error) {
    setSaveStatus(
      t3(
        "Draft kon niet worden ingelezen.",
        "Could not load draft.",
        "Impossible de charger le brouillon."
      )
    );
  }
}

function isValidDraft(parsed) {
  if (!parsed || !Array.isArray(parsed.entries) || parsed.entries.length !== 15) {
    return false;
  }

  return parsed.entries.every((entry) => {
    if (!entry || typeof entry !== "object") {
      return false;
    }

    if (!CHAMBERS.some((chamber) => chamber.key === entry.chamber)) {
      return false;
    }

    if (typeof entry.id !== "string" || typeof entry.slot !== "number") {
      return false;
    }

    const selectedArtworkIdType = typeof entry.selectedArtworkId;
    if (!(selectedArtworkIdType === "string" || entry.selectedArtworkId == null)) {
      return false;
    }

    return AXES.every((axis) => Number.isFinite(Number(entry.scores?.[axis.key])));
  });
}

function getActiveEntries() {
  return state.entries.filter((entry) => entry.slot <= state.slotsPerChamber);
}

function getTotalPieces() {
  return state.slotsPerChamber * CHAMBERS.length;
}

function hasSelectedArtwork(entry) {
  return Boolean(entry && isActiveSlot(entry) && normalizeText(entry.selectedArtworkId));
}

function syncPiecesSelect() {
  const total = String(getTotalPieces());
  if (elements.piecesCountSelect.value !== total) {
    elements.piecesCountSelect.value = total;
  }
}

function normalizeText(value) {
  return String(value || "").replace(/\s+/g, " ").trim();
}

function toSafeImageUrl(url) {
  const normalized = normalizeText(url);
  if (!normalized) {
    return PLACEHOLDER_IMAGE;
  }

  if (normalized.startsWith("/api/")) {
    return buildApiUrl(normalized);
  }

  if (/^https?:\/\//i.test(normalized) || /^data:image\//i.test(normalized)) {
    return normalized;
  }

  return PLACEHOLDER_IMAGE;
}

function normalizeArtworkEntry(rawArtwork) {
  if (!rawArtwork || typeof rawArtwork !== "object") {
    return null;
  }

  return {
    id: normalizeText(rawArtwork.id),
    artworkTitle: normalizeText(rawArtwork.artworkTitle) || "Untitled artwork",
    artistName: normalizeText(rawArtwork.artistName) || "Unknown artist",
    artworkUrl: normalizeText(rawArtwork.artworkUrl),
    imageUrl: normalizeText(rawArtwork.imageUrl),
    source: normalizeText(rawArtwork.source) || "Unknown"
  };
}

function artworkSignature(artwork) {
  return normalizeText(
    artwork.artworkUrl ||
      `${artwork.artworkTitle}|${artwork.artistName}|${artwork.imageUrl}|${artwork.source}`
  );
}

function createArtworkId(seed) {
  const base = slugify(seed) || "artwork";
  let candidate = base;
  let index = 2;

  while (state.artworks.some((artwork) => artwork.id === candidate)) {
    candidate = `${base}_${index}`;
    index += 1;
  }

  return candidate;
}

function addArtworks(rawEntries) {
  const known = new Set(state.artworks.map(artworkSignature));
  let added = 0;

  rawEntries.forEach((rawEntry) => {
    const artwork = normalizeArtworkEntry(rawEntry);
    if (!artwork) {
      return;
    }

    const signature = artworkSignature(artwork);
    if (!signature || known.has(signature)) {
      return;
    }

    known.add(signature);
    artwork.id = artwork.id || createArtworkId(`${artwork.artworkTitle}_${artwork.artistName}`);
    if (state.artworks.some((item) => item.id === artwork.id)) {
      artwork.id = createArtworkId(`${artwork.artworkTitle}_${artwork.artistName}`);
    }

    state.artworks.push(artwork);
    added += 1;
  });

  renderArtworkLibrary();

  if (added === 0) {
    setSaveStatus(
      t3(
        "Geen nieuwe artworks toegevoegd (mogelijk duplicaten).",
        "No new artworks added (possible duplicates).",
        "Aucune nouvelle oeuvre ajoutée (doublons possibles)."
      )
    );
  }

  return added;
}

function setScrapeArtworkStatus(type, message) {
  elements.scrapeArtworkStatus.className = `scrape-status ${type}`;
  elements.scrapeArtworkStatus.textContent = message;
  elements.scrapeArtworkStatus.classList.remove("hidden");
}

function clearScrapeArtworkStatus() {
  elements.scrapeArtworkStatus.className = "scrape-status hidden";
  elements.scrapeArtworkStatus.textContent = "";
}

function setPdfExtractStatus(type, message) {
  elements.pdfExtractStatus.className = `scrape-status ${type}`;
  elements.pdfExtractStatus.textContent = message;
  elements.pdfExtractStatus.classList.remove("hidden");
}

function clearPdfExtractStatus() {
  elements.pdfExtractStatus.className = "scrape-status hidden";
  elements.pdfExtractStatus.textContent = "";
}

function setPdfProgressVisible(visible) {
  if (elements.pdfProgressWrap instanceof HTMLElement) {
    elements.pdfProgressWrap.classList.toggle("hidden", !visible);
  }
}

function setPdfProgressActive(active) {
  if (elements.pdfProgressWrap instanceof HTMLElement) {
    elements.pdfProgressWrap.classList.toggle("is-active", active);
  }
}

function setPdfProgressLabel(label) {
  if (elements.pdfProgressLabel instanceof HTMLElement) {
    elements.pdfProgressLabel.textContent = label;
  }
}

function setPdfProgressValue(value) {
  const nextValue = Math.max(0, Math.min(100, Math.round(value)));
  pdfProgressCurrentValue = nextValue;

  if (elements.pdfProgressValue instanceof HTMLElement) {
    elements.pdfProgressValue.textContent = `${nextValue}%`;
  }

  if (elements.pdfProgressBar instanceof HTMLElement) {
    elements.pdfProgressBar.style.width = `${nextValue}%`;
  }
}

function stopPdfProgressTimer() {
  if (pdfProgressTimer) {
    clearInterval(pdfProgressTimer);
    pdfProgressTimer = null;
  }
}

function startPdfProgress() {
  stopPdfProgressTimer();
  pdfProgressIsActive = true;
  setPdfProgressVisible(true);
  setPdfProgressActive(true);
  setPdfProgressLabel(tr("pdfProgressAnalyzing"));
  setPdfProgressValue(0);

  const startedAt = Date.now();
  pdfProgressTimer = setInterval(() => {
    if (!pdfProgressIsActive) {
      return;
    }

    const elapsedMs = Date.now() - startedAt;
    let target = 0;
    if (elapsedMs <= 12000) {
      target = 88 * (1 - Math.exp(-elapsedMs / 6500));
    } else {
      const slowElapsed = elapsedMs - 12000;
      target = 88 + 11 * (1 - Math.exp(-slowElapsed / 45000));
    }

    if (elapsedMs >= 25000) {
      setPdfProgressLabel(tr("pdfProgressLongRunning"));
    } else {
      setPdfProgressLabel(tr("pdfProgressAnalyzing"));
    }

    const roundedTarget = Math.min(99, Math.max(0, Math.round(target)));
    if (roundedTarget > pdfProgressCurrentValue) {
      setPdfProgressValue(roundedTarget);
    }
  }, 220);
}

function completePdfProgress() {
  pdfProgressIsActive = false;
  stopPdfProgressTimer();
  setPdfProgressActive(false);
  setPdfProgressValue(100);
  setPdfProgressLabel(tr("pdfProgressDone"));
}

function failPdfProgress() {
  pdfProgressIsActive = false;
  stopPdfProgressTimer();
  setPdfProgressVisible(true);
  setPdfProgressActive(false);
  setPdfProgressLabel(tr("pdfProgressFailed"));
}

function resetPdfProgress() {
  pdfProgressIsActive = false;
  stopPdfProgressTimer();
  setPdfProgressActive(false);
  setPdfProgressValue(0);
  setPdfProgressLabel(tr("pdfProgressAnalyzing"));
  setPdfProgressVisible(false);
}

function applyBackendPdfProgress(progress, message) {
  const numericProgress = Number(progress);
  if (Number.isFinite(numericProgress)) {
    const bounded = Math.max(0, Math.min(100, Math.round(numericProgress)));
    if (bounded >= pdfProgressCurrentValue || bounded === 100) {
      setPdfProgressValue(bounded);
    }
  }

  const normalizedMessage = normalizeText(message);
  if (normalizedMessage) {
    setPdfProgressLabel(normalizedMessage);
  }
}

function renderPdfSuggestions() {
  if (!(elements.pdfSuggestionsList instanceof HTMLElement)) {
    return;
  }

  elements.pdfSuggestionsList.innerHTML = "";

  const hasSuggestions = state.pdfSuggestions.length > 0;
  if (elements.pdfSuggestionsTitle instanceof HTMLElement) {
    elements.pdfSuggestionsTitle.classList.toggle("hidden", !hasSuggestions);
  }
  elements.pdfSuggestionsList.classList.toggle("hidden", !hasSuggestions);

  if (!hasSuggestions) {
    return;
  }

  state.pdfSuggestions.forEach((item, index) => {
    const title = normalizeText(item.artworkTitle);
    const artist = normalizeText(item.artistName);
    const safeImageUrl = toSafeImageUrl(item.imageUrl);
    const titlePlaceholder = t3("Ongetiteld artwork", "Untitled artwork", "Oeuvre sans titre");
    const artistPlaceholder = tr("labels.noArtist");

    const row = document.createElement("li");
    row.className = "pdf-suggestion-item";
    row.innerHTML = `
      <img
        class="pdf-suggestion-thumb"
        src="${escapeHtml(safeImageUrl)}"
        alt="${escapeHtml(title || titlePlaceholder)}"
        loading="lazy"
        decoding="async"
      />
      <div class="pdf-suggestion-edit">
        <label class="pdf-suggestion-field">
          <span>${t3("Titel", "Title", "Titre")}</span>
          <input
            type="text"
            data-field="pdf-suggestion-title"
            data-index="${index}"
            value="${escapeHtml(title)}"
            placeholder="${escapeHtml(titlePlaceholder)}"
          />
        </label>
        <label class="pdf-suggestion-field">
          <span>${t3("Artiest", "Artist", "Artiste")}</span>
          <input
            type="text"
            data-field="pdf-suggestion-artist"
            data-index="${index}"
            value="${escapeHtml(artist)}"
            placeholder="${escapeHtml(artistPlaceholder)}"
          />
        </label>
      </div>
      <button
        type="button"
        class="btn btn-ghost btn-small pdf-suggestion-remove"
        data-action="remove-pdf-suggestion"
        data-index="${index}"
      >
        ${t3("Verwijder", "Remove", "Supprimer")}
      </button>
    `;
    elements.pdfSuggestionsList.appendChild(row);
  });
}

function getPdfSourceLabel(file) {
  return file && typeof file.name === "string" ? `PDF (${file.name})` : "PDF";
}

function importPdfSuggestionsToLibrary() {
  if (state.pdfSuggestions.length === 0) {
    setPdfExtractStatus(
      "warn",
      t3(
        "Geen PDF-suggesties beschikbaar om toe te voegen.",
        "No PDF suggestions available to add.",
        "Aucune suggestion PDF disponible à ajouter."
      )
    );
    return;
  }

  const data = new FormData(elements.pdfArtworkForm);
  const file = data.get("pdfFile");
  const sourceLabelFromFile = file && typeof file.name === "string" ? getPdfSourceLabel(file) : "";
  const sourceLabel = sourceLabelFromFile || state.pdfSourceLabel || "PDF";
  const fallbackImageUrl = normalizeText(data.get("imageUrl"));

  const suggestions = state.pdfSuggestions.map((item) => ({
    artworkTitle: item.artworkTitle,
    artistName: item.artistName,
    imageUrl: normalizeText(item.imageUrl) || fallbackImageUrl,
    source: sourceLabel
  }));

  const added = addArtworks(suggestions);
  if (added > 0) {
    setPdfExtractStatus(
      "ok",
      t3(
        "{count} PDF-suggestie(s) toegevoegd aan de bibliotheek.",
        "{count} PDF suggestion(s) added to the library.",
        "{count} suggestion(s) PDF ajoutée(s) à la bibliothèque.",
        { count: added }
      )
    );
    setSaveStatus(
      t3(
        "{count} PDF-suggestie(s) toegevoegd.",
        "{count} PDF suggestion(s) added.",
        "{count} suggestion(s) PDF ajoutée(s).",
        { count: added }
      )
    );
    elements.pdfArtworkForm.reset();
    clearPdfSuggestionCache();
    scheduleSave();
  } else {
    setPdfExtractStatus(
      "warn",
      t3(
        "Alle PDF-suggesties stonden al in de bibliotheek.",
        "All PDF suggestions were already in the library.",
        "Toutes les suggestions PDF étaient déjà dans la bibliothèque."
      )
    );
  }
}

function updatePdfImportAllButton() {
  if (!(elements.pdfImportAllBtn instanceof HTMLButtonElement)) {
    return;
  }

  const count = state.pdfSuggestions.length;
  if (count > 0) {
    elements.pdfImportAllBtn.hidden = false;
    elements.pdfImportAllBtn.textContent = tr("pdfImportAll", { count });
  } else {
    elements.pdfImportAllBtn.hidden = true;
  }
}

function clearPdfSuggestionCache() {
  state.pdfSuggestions = [];
  state.pdfSourceLabel = "PDF";
  resetPdfProgress();
  renderPdfSuggestions();
  updatePdfImportAllButton();
}

async function parseApiJson(response) {
  try {
    return await response.json();
  } catch (_error) {
    return null;
  }
}

function isRecoverableFetchError(error) {
  if (!(error instanceof Error)) {
    return false;
  }

  const message = normalizeText(error.message).toLowerCase();
  if (!message) {
    return error.name === "TypeError";
  }

  return (
    message.includes("failed to fetch") ||
    message.includes("fetch failed") ||
    message.includes("networkerror") ||
    message.includes("network request failed") ||
    message.includes("load failed") ||
    error.name === "TypeError"
  );
}

function toFriendlyNetworkErrorMessage(error, fallbackMessage) {
  if (isRecoverableFetchError(error)) {
    return fallbackMessage;
  }

  if (error instanceof Error) {
    const rawMessage = normalizeText(error.message);
    if (rawMessage) {
      return rawMessage;
    }
  }

  return fallbackMessage;
}

async function requestScrapePayload(profileUrl, attempt = 0) {
  const endpointPath = "/api/scrape";
  let response;
  try {
    response = await fetch(buildApiUrl(endpointPath), {
      method: "POST",
      headers: {
        "content-type": "application/json"
      },
      body: JSON.stringify({
        url: profileUrl
      })
    });
  } catch (error) {
    if (attempt === 0 && isRecoverableFetchError(error)) {
      const recovered = await recoverApiBaseFromDiscovery(endpointPath);
      if (recovered) {
        return requestScrapePayload(profileUrl, attempt + 1);
      }
    }
    throw error;
  }

  const payload = await parseApiJson(response);
  if (!response.ok || !payload || !payload.ok) {
    if (response.status === 404 && attempt === 0) {
      const recovered = await recoverApiBaseFromDiscovery(endpointPath);
      if (recovered) {
        return requestScrapePayload(profileUrl, attempt + 1);
      }
      throw new Error(getApiEndpointNotFoundMessage(endpointPath));
    }

    if (response.status === 404) {
      throw new Error(getApiEndpointNotFoundMessage(endpointPath));
    }

    const backendMessage = payload && typeof payload.error === "string" ? payload.error : "";
    throw new Error(
      backendMessage || t3("Scrape request mislukt.", "Scrape request failed.", "La requête de scrape a échoué.")
    );
  }

  return payload;
}

function normalizePdfSuggestionPayload(payload) {
  const primary = {
    artworkTitle: normalizeText(payload?.suggestions?.artworkTitle),
    artistName: normalizeText(payload?.suggestions?.artistName),
    imageUrl: normalizeText(payload?.suggestions?.imageUrl)
  };

  const suggestionsList = Array.isArray(payload?.suggestionsList)
    ? payload.suggestionsList
        .map((item) => ({
          artworkTitle: normalizeText(item?.artworkTitle),
          artistName: normalizeText(item?.artistName),
          imageUrl: normalizeText(item?.imageUrl)
        }))
        .filter((item) => item.artworkTitle || item.artistName)
    : [];

  if (suggestionsList.length === 0 && (primary.artworkTitle || primary.artistName)) {
    suggestionsList.push(primary);
  }

  return {
    artworkTitle: primary.artworkTitle,
    artistName: primary.artistName,
    imageUrl: primary.imageUrl,
    suggestionsList
  };
}

function createStreamUnavailableError(message) {
  const error = new Error(message);
  error.streamUnavailable = true;
  return error;
}

async function requestPdfSuggestionsViaStream(file, attempt = 0) {
  const formData = new FormData();
  formData.append("pdfFile", file, file.name || "upload.pdf");

  const endpointPath = "/api/pdf-extract-stream";
  let response;
  try {
    response = await fetch(buildApiUrl(endpointPath), {
      method: "POST",
      body: formData
    });
  } catch (error) {
    if (attempt === 0 && isRecoverableFetchError(error)) {
      const recovered = await recoverApiBaseFromDiscovery(endpointPath);
      if (recovered) {
        return requestPdfSuggestionsViaStream(file, attempt + 1);
      }
    }
    throw error;
  }

  if (response.status === 404) {
    if (attempt === 0) {
      const recovered = await recoverApiBaseFromDiscovery(endpointPath);
      if (recovered) {
        return requestPdfSuggestionsViaStream(file, attempt + 1);
      }
    }

    throw createStreamUnavailableError(getApiEndpointNotFoundMessage(endpointPath));
  }

  if (!response.ok || !response.body) {
    const payload = await parseApiJson(response);
    const backendMessage = payload && typeof payload.error === "string" ? payload.error : "";
    throw new Error(
      backendMessage ||
        t3(
          "Kon progress-stream voor PDF niet starten.",
          "Could not start PDF progress stream.",
          "Impossible de démarrer le flux de progression PDF."
        )
    );
  }

  stopPdfProgressTimer();
  setPdfProgressVisible(true);
  setPdfProgressActive(true);

  const reader = response.body.getReader();
  const decoder = new TextDecoder("utf-8");
  let buffer = "";
  let finalPayload = null;

  const consumeEventLine = (rawLine) => {
    const line = normalizeText(rawLine);
    if (!line) {
      return;
    }

    let event = null;
    try {
      event = JSON.parse(line);
    } catch (_error) {
      return;
    }

    if (!event || typeof event !== "object") {
      return;
    }

    if (event.type === "progress") {
      applyBackendPdfProgress(event.progress, event.message);
      return;
    }

    if (event.type === "result") {
      finalPayload = event.payload || null;
      return;
    }

    if (event.type === "error") {
      throw new Error(
        normalizeText(event.error) ||
          t3("PDF extractie mislukt.", "PDF extraction failed.", "L'extraction PDF a échoué.")
      );
    }
  };

  while (true) {
    const { value, done } = await reader.read();
    if (done) {
      break;
    }

    buffer += decoder.decode(value, { stream: true });
    const lines = buffer.split("\n");
    buffer = lines.pop() || "";

    for (const rawLine of lines) {
      consumeEventLine(rawLine);
    }
  }

  buffer += decoder.decode();
  if (buffer) {
    const trailingLines = buffer.split("\n");
    for (const rawLine of trailingLines) {
      consumeEventLine(rawLine);
    }
  }

  if (!finalPayload || !finalPayload.ok) {
    throw new Error(
      t3(
        "Geen geldig eindresultaat ontvangen van PDF progress-stream.",
        "No valid final result received from PDF progress stream.",
        "Aucun résultat final valide reçu depuis le flux de progression PDF."
      )
    );
  }

  return normalizePdfSuggestionPayload(finalPayload);
}

async function requestPdfSuggestionsClassic(file, attempt = 0) {
  const formData = new FormData();
  formData.append("pdfFile", file, file.name || "upload.pdf");

  const endpointPath = "/api/pdf-extract";
  let response;
  try {
    response = await fetch(buildApiUrl(endpointPath), {
      method: "POST",
      body: formData
    });
  } catch (error) {
    if (attempt === 0 && isRecoverableFetchError(error)) {
      const recovered = await recoverApiBaseFromDiscovery(endpointPath);
      if (recovered) {
        return requestPdfSuggestionsClassic(file, attempt + 1);
      }
    }
    throw error;
  }

  const payload = await parseApiJson(response);
  if (!response.ok || !payload || !payload.ok) {
    if (response.status === 404 && attempt === 0) {
      const recovered = await recoverApiBaseFromDiscovery(endpointPath);
      if (recovered) {
        return requestPdfSuggestionsClassic(file, attempt + 1);
      }
      throw new Error(getApiEndpointNotFoundMessage(endpointPath));
    }

    if (response.status === 404) {
      throw new Error(getApiEndpointNotFoundMessage(endpointPath));
    }

    const backendMessage = payload && typeof payload.error === "string" ? payload.error : "";
    const fallbackMessage =
      t3(
        "Kan PDF-extractie API niet bereiken. Start server.py/server.js in `data entry and profile module` en open via http://127.0.0.1:3000.",
        "Cannot reach the PDF extraction API. Start server.py/server.js in `data entry and profile module` and open via http://127.0.0.1:3000.",
        "Impossible d'atteindre l'API d'extraction PDF. Lancez server.py/server.js dans `data entry and profile module` puis ouvrez via http://127.0.0.1:3000."
      );
    throw new Error(backendMessage || fallbackMessage);
  }

  return normalizePdfSuggestionPayload(payload);
}

async function requestPdfSuggestionsWithBackendProgress(file) {
  try {
    return await requestPdfSuggestionsViaStream(file);
  } catch (error) {
    if (error && error.streamUnavailable) {
      // Fallback to classic endpoint when backend stream is not available.
      return requestPdfSuggestionsClassic(file);
    }
    throw error;
  }
}

function getEntryById(entryId) {
  return state.entries.find((entry) => entry.id === entryId);
}

function getLinkedEntriesByArtworkId(artworkId) {
  if (!artworkId) {
    return [];
  }

  return state.entries.filter((entry) => isActiveSlot(entry) && entry.selectedArtworkId === artworkId);
}

function getAnyLinkedEntryByArtworkId(artworkId, excludeEntryId) {
  if (!artworkId) {
    return null;
  }

  return (
    state.entries.find(
      (entry) =>
        entry.id !== excludeEntryId &&
        isActiveSlot(entry) &&
        entry.selectedArtworkId === artworkId &&
        entry.scores
    ) || null
  );
}

function updateEntryAxisUi(entryId, axis, value) {
  const valueTag = document.getElementById(`value-${entryId}-${axis}`);
  if (valueTag) {
    valueTag.textContent = String(value);
  }

  const slider = elements.chambersContainer.querySelector(
    `input[type="range"][data-entry-id="${entryId}"][data-axis="${axis}"]`
  );
  if (slider instanceof HTMLInputElement) {
    slider.value = String(value);
  }
}

function getArtworkById(artworkId) {
  if (!artworkId) {
    return null;
  }

  return state.artworks.find((artwork) => artwork.id === artworkId) || null;
}

function isActiveSlot(entry) {
  return Boolean(entry && entry.slot <= state.slotsPerChamber);
}

function getExplicitPickerTargetEntry() {
  const entry = getEntryById(state.pickerTargetEntryId);
  if (!isActiveSlot(entry)) {
    return null;
  }

  return entry;
}

function getFallbackPickerTargetEntry() {
  const activeEntries = getActiveEntries();
  if (activeEntries.length === 0) {
    return null;
  }

  const activeChamberEntries = activeEntries.filter((entry) => entry.chamber === state.activeChamber);
  const firstEmptyActiveChamber = activeChamberEntries.find((entry) => !hasSelectedArtwork(entry));
  if (firstEmptyActiveChamber) {
    return firstEmptyActiveChamber;
  }

  const firstEmptyAny = activeEntries.find((entry) => !hasSelectedArtwork(entry));
  if (firstEmptyAny) {
    return firstEmptyAny;
  }

  return activeChamberEntries[0] || activeEntries[0];
}

function renderPickerTargetInfo() {
  const target = getExplicitPickerTargetEntry();

  if (target) {
    elements.pickerTargetInfo.textContent =
      target.selectedArtworkId
        ? t3(
            "Actief doel-slot: {chamber} · Object {slot}. Artwork geselecteerd. Nu automatisch terug naar de vragen voor scoring.",
            "Active target slot: {chamber} · Object {slot}. Artwork selected. Returning to the questions for scoring.",
            "Emplacement cible actif : {chamber} · Objet {slot}. Oeuvre sélectionnée. Retour vers les questions de scoring.",
            { chamber: getChamberKeyLabel(target.chamber), slot: target.slot }
          )
        : t3(
            "Actief doel-slot: {chamber} · Object {slot}. Klik op een artwork om het direct toe te wijzen.",
            "Active target slot: {chamber} · Object {slot}. Click an artwork to assign it directly.",
            "Emplacement cible actif : {chamber} · Objet {slot}. Cliquez sur une oeuvre pour l'assigner directement.",
            { chamber: getChamberKeyLabel(target.chamber), slot: target.slot }
          );
    elements.pickerTargetInfo.classList.add("active");
  } else {
    elements.pickerTargetInfo.textContent = t3(
      "Geen actief doel-slot gekozen. Klik eerst op “Selecteer uit bibliotheek” bij een room-slot.",
      "No active target slot selected. First click “Select from library” on a room slot.",
      "Aucun emplacement cible actif. Cliquez d'abord sur « Sélectionner depuis la bibliothèque » dans un slot."
    );
    elements.pickerTargetInfo.classList.remove("active");
  }
}

function renderArtworkLibrary() {
  renderPickerTargetInfo();

  const activeTarget = getExplicitPickerTargetEntry();
  const fallbackTarget = getFallbackPickerTargetEntry();
  const assignTarget = activeTarget || fallbackTarget;
  const assignLabel = assignTarget
    ? tr("labels.chooseForSlot", { chamber: getChamberKeyLabel(assignTarget.chamber), slot: assignTarget.slot })
    : t3("Selecteer voor slot", "Select for slot", "Sélectionner pour ce slot");

  const query = normalizeText(state.artworkLibraryQuery).toLowerCase();
  const filteredArtworks = query
    ? state.artworks.filter((artwork) => {
        const haystack = normalizeText(
          `${artwork.artworkTitle} ${artwork.artistName} ${artwork.source} ${getLocalizedArtworkTitle(
            artwork.artworkTitle
          )} ${getLocalizedArtistDisplayName(artwork.artistName)} ${getLocalizedSourceLabel(artwork.source)}`
        ).toLowerCase();
        return haystack.includes(query);
      })
    : state.artworks;

  if (elements.artworkSearchInput instanceof HTMLInputElement && elements.artworkSearchInput.value !== state.artworkLibraryQuery) {
    elements.artworkSearchInput.value = state.artworkLibraryQuery;
  }

  elements.artworkListMeta.textContent = query
    ? t3(
        "{shown} van {total} artworks in bibliotheek",
        "{shown} of {total} artworks in library",
        "{shown} sur {total} oeuvres dans la bibliothèque",
        { shown: filteredArtworks.length, total: state.artworks.length }
      )
    : t3(
        "{count} artworks in bibliotheek",
        "{count} artworks in library",
        "{count} oeuvres dans la bibliothèque",
        { count: state.artworks.length }
      );
  elements.artworkList.innerHTML = "";
  elements.artworkEmptyState.classList.toggle("hidden", filteredArtworks.length > 0);
  if (elements.artworkEmptyState instanceof HTMLElement) {
    elements.artworkEmptyState.textContent = query
      ? t3(
          "Geen artworks gevonden voor deze zoekterm.",
          "No artworks found for this search term.",
          "Aucune oeuvre trouvée pour ce terme de recherche."
        )
      : t3(
          "Nog geen artworks beschikbaar. Voeg eerst items toe in deze module.",
          "No artworks available yet. Add items first in this module.",
          "Aucune oeuvre disponible pour l'instant. Ajoutez d'abord des éléments dans ce module."
        );
  }

  filteredArtworks.forEach((artwork) => {
    const card = document.createElement("article");
    card.className = "artwork-item";

    card.innerHTML = `
      <img class="artwork-thumb" src="${escapeHtml(toSafeImageUrl(artwork.imageUrl))}" alt="${escapeHtml(artwork.artworkTitle)}" />
      <div>
        <p class="artwork-title">${escapeHtml(getLocalizedArtworkTitle(artwork.artworkTitle))}</p>
        <p class="artwork-artist">${escapeHtml(getLocalizedArtistDisplayName(artwork.artistName))}</p>
        <p class="artwork-source">${escapeHtml(getLocalizedSourceLabel(artwork.source))}</p>
      </div>
      <div>
        <button
          type="button"
          class="btn btn-ghost btn-small"
          data-action="assign-artwork"
          data-artwork-id="${escapeHtml(artwork.id)}"
        >
          ${assignLabel}
        </button>
      </div>
    `;

    elements.artworkList.appendChild(card);
  });
}

function refreshEntryUi() {
  renderForm();
  updateCompletion();
  syncChamberUi();
  renderArtworkLibrary();
}

function guideToEntryQuestionnaire(entryId) {
  const run = () => {
    const card = elements.chambersContainer.querySelector(`.object-card[data-entry-id="${entryId}"]`);
    if (!(card instanceof HTMLElement)) {
      return;
    }

    card.classList.add("guided-focus");
    card.scrollIntoView({ behavior: "smooth", block: "center" });

    const firstSlider = card.querySelector("input[type='range']");
    if (firstSlider instanceof HTMLInputElement) {
      window.setTimeout(() => {
        firstSlider.focus({ preventScroll: true });
      }, 220);
    }

    window.setTimeout(() => {
      card.classList.remove("guided-focus");
    }, 1800);
  };

  if (typeof window.requestAnimationFrame === "function") {
    window.requestAnimationFrame(() => window.requestAnimationFrame(run));
  } else {
    window.setTimeout(run, 0);
  }
}

function guideToEntrySelection(entryId) {
  const run = () => {
    const card = elements.chambersContainer.querySelector(`.object-card[data-entry-id="${entryId}"]`);
    if (!(card instanceof HTMLElement)) {
      return;
    }

    card.classList.add("guided-focus");
    card.scrollIntoView({ behavior: "smooth", block: "center" });
    window.setTimeout(() => {
      card.classList.remove("guided-focus");
    }, 1500);
  };

  if (typeof window.requestAnimationFrame === "function") {
    window.requestAnimationFrame(() => window.requestAnimationFrame(run));
  } else {
    window.setTimeout(run, 0);
  }
}

function activatePickerTarget(entryId) {
  const entry = getEntryById(entryId);
  if (!isActiveSlot(entry)) {
    return;
  }

  state.pickerTargetEntryId = entryId;
  refreshEntryUi();
  setSaveStatus(
    t3(
      "Doel-slot actief: {chamber} · object {slot}.",
      "Target slot active: {chamber} · object {slot}.",
      "Emplacement cible actif : {chamber} · objet {slot}.",
      { chamber: getChamberKeyLabel(entry.chamber), slot: entry.slot }
    )
  );
  scheduleSave();

  const libraryPanel = document.getElementById("libraryPanel");
  if (libraryPanel) {
    libraryPanel.scrollIntoView({ behavior: "smooth", block: "start" });
  }
}

function clearArtworkSelectionFromEntry(entryId) {
  const entry = getEntryById(entryId);
  if (!entry) {
    return;
  }

  const selectedArtwork = getArtworkById(entry.selectedArtworkId);
  if (
    selectedArtwork &&
    normalizeText(entry.objectName).toLowerCase() === normalizeText(selectedArtwork.artworkTitle).toLowerCase()
  ) {
    entry.objectName = "";
  }

  entry.selectedArtworkId = null;
  refreshEntryUi();
  scheduleSave(
    t3("Artwork selectie verwijderd.", "Artwork selection removed.", "Sélection d'oeuvre supprimée.")
  );
}

function assignArtworkToTarget(artworkId, forcedEntryId = "") {
  const artwork = getArtworkById(artworkId);
  if (!artwork) {
    return;
  }

  const forcedTarget = forcedEntryId ? getEntryById(forcedEntryId) : null;
  const targetEntry = forcedTarget || getExplicitPickerTargetEntry() || getFallbackPickerTargetEntry();
  if (!isActiveSlot(targetEntry)) {
    return;
  }

  const chamberEntriesBefore = getActiveEntries().filter((entry) => entry.chamber === targetEntry.chamber);
  const wasChamberComplete = chamberEntriesBefore.length > 0 && chamberEntriesBefore.every((entry) => hasSelectedArtwork(entry));

  const linkedSourceEntry = getAnyLinkedEntryByArtworkId(artwork.id, targetEntry.id);

  targetEntry.selectedArtworkId = artwork.id;
  targetEntry.objectName = artwork.artworkTitle;
  if (linkedSourceEntry) {
    targetEntry.scores = normalizeScores(linkedSourceEntry.scores);
  }

  const chamberEntriesAfter = getActiveEntries().filter((entry) => entry.chamber === targetEntry.chamber);
  const chamberNowComplete = chamberEntriesAfter.length > 0 && chamberEntriesAfter.every((entry) => hasSelectedArtwork(entry));

  let autoMovedToChamber = "";
  const shouldAutoAdvance = !wasChamberComplete && chamberNowComplete;

  if (shouldAutoAdvance) {
    const nextIncompleteChamber = findNextIncompleteChamber(targetEntry.chamber);
    if (nextIncompleteChamber) {
      autoMovedToChamber = nextIncompleteChamber;
      state.activeChamber = nextIncompleteChamber;
      const nextTargetEntry = getActiveEntries().find(
        (entry) => entry.chamber === nextIncompleteChamber && !hasSelectedArtwork(entry)
      );
      state.pickerTargetEntryId = nextTargetEntry ? nextTargetEntry.id : null;
    } else {
      state.activeChamber = targetEntry.chamber;
      state.pickerTargetEntryId = targetEntry.id;
    }
  } else {
    state.pickerTargetEntryId = targetEntry.id;
    state.activeChamber = targetEntry.chamber;
  }

  refreshEntryUi();
  if (!autoMovedToChamber) {
    guideToEntryQuestionnaire(targetEntry.id);
  }
  const linkedCount = getLinkedEntriesByArtworkId(artwork.id).length;

  if (autoMovedToChamber) {
    elements.validationMessage.textContent = t3(
      "Kamer {from} is volledig. We gaan automatisch naar {to}.",
      "Chamber {from} is complete. Moving automatically to {to}.",
      "La chambre {from} est complète. Passage automatique vers {to}.",
      { from: getChamberKeyLabel(targetEntry.chamber), to: getChamberKeyLabel(autoMovedToChamber) }
    );
    const inputPanel = document.getElementById("inputPanel");
    if (inputPanel) {
      inputPanel.scrollIntoView({ behavior: "smooth", block: "start" });
    }
    if (state.pickerTargetEntryId) {
      guideToEntrySelection(state.pickerTargetEntryId);
    }
  } else {
    elements.validationMessage.textContent = t3(
      'Artwork "{title}" toegewezen aan {chamber} object {slot}. De vragenlijst staat nu klaar voor scoring.{linked}',
      'Artwork "{title}" assigned to {chamber} object {slot}. The questionnaire is now ready for scoring.{linked}',
      'Oeuvre "{title}" assignée à {chamber} objet {slot}. Le questionnaire est maintenant prêt pour le scoring.{linked}',
      {
        title: artwork.artworkTitle,
        chamber: getChamberKeyLabel(targetEntry.chamber),
        slot: targetEntry.slot,
        linked:
          linkedCount > 1
            ? t3(
                " Scoring is gekoppeld over {count} slots.",
                " Scoring is linked across {count} slots.",
                " Le scoring est lié sur {count} emplacements.",
                { count: linkedCount }
              )
            : ""
      }
    );
  }

  if (shouldAutoAdvance && !autoMovedToChamber) {
    runAnalysisWorkflow({ autoTriggered: true });
  }

  scheduleSave(
    t3("Artwork toewijzing opgeslagen.", "Artwork assignment saved.", "Assignation d'oeuvre enregistrée.")
  );
}

function normalizeScores(rawScores) {
  return AXES.reduce((acc, axis) => {
    const value = Number(rawScores?.[axis.key]);
    acc[axis.key] = clampScore(value);
    return acc;
  }, {});
}

function clampScore(value) {
  if (!Number.isFinite(value)) {
    return 3;
  }

  return Math.max(1, Math.min(5, Math.round(value)));
}

function setSaveStatus(message) {
  elements.saveState.textContent = message;
}

function formatTime(timestamp) {
  return new Intl.DateTimeFormat(getIntlLocale(), {
    hour: "2-digit",
    minute: "2-digit"
  }).format(new Date(timestamp));
}

function formatDateTime(timestamp) {
  return new Intl.DateTimeFormat(getIntlLocale(), {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit"
  }).format(new Date(timestamp));
}

function round1(value) {
  return Math.round(value * 10) / 10;
}

function round2(value) {
  return Math.round(value * 100) / 100;
}

function round3(value) {
  return Math.round(value * 1000) / 1000;
}

function slugify(input) {
  return String(input || "")
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "_")
    .replace(/^_+|_+$/g, "");
}

function escapeHtml(value) {
  return String(value || "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/\"/g, "&quot;")
    .replace(/'/g, "&#039;");
}
