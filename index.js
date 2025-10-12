const simbadOTypes = {
    "V*": "Загальна змінна зоря",
    "EB*": "Подвійна затемнювана зоря",
    "SB*": "Спектроскопічна бінарна зоря (радіально-швидкісна змінність)",
    "PulsV*": "Пульсуюча змінна зоря",
    "RotV*": "Обертова змінна зоря",
    "RRLyr": "Змінна зоря типу RR Ліри",
    "DCEP": "Цефеїда (Цефеїд)",
    "DCEPS": "Мала амплітуда цефеїди",
    "RV": "Змінна зоря типу RV Тау",
    "Mira": "Змінна зоря типу Mira",
    "DSCT": "Дельта Щита змінна зоря",
    "BCEP": "Змінні зорі типу Цефеїда",
    "GDOR": "Змінна зоря типу Дракона",
    "SX*": "Змінна зоря типу SX Фенікса",
    "BY*": "Змінна зоря типу BY Дракона",
    "RS*": "Змінна зоря типу RS CVn",
    "ACV": "Змінна зоря типу а² CVn",
    "CV*": "Катаклізмічна змінна зоря",
    "LP*": "Довгоперіодична змінна зоря"
};

const variabilityBibcodes = [
    "2021ApJ...919..131H", "2019ApJS..241...12S", "2022ApJS..258...16P", "2023A&A...674A..15L",
    "2023ApJS..268....4F", "2025ApJ...984...49Q", "2018A&A...618A..30H", "2023A&A...674A..13E",
    "2016AJ....151...68K", "2016MNRAS.456.2260A", "2020ApJS..249...18C", "2018MNRAS.477.3145J",
    "2019MNRAS.486.1907J", "2023MNRAS.519.5271C", "2009yCat....1.2025S", "2025ApJ...980..217L",
    "2022AJ....164..135H"
];

const generalKeywords = {
    "Variability": "Змінність",
    "Variable star": "Змінна зоря",
    "Light curve": "Крива блиску",
    "Periodic variable stars": "Періодичні змінні зорі",
    "Period determination": "Визначення періоду",
    "Solar-like oscillations": "Коливання, подібні до сонячних",
    "Oscillating red giants": "Коливаючі червоні гіганти",
    "Rotation period": "Період обертання",
    "Evolved massive stars": "Еволюціоновані масивні зорі",
    "Stellar flares": "Зоряні спалахи",
    "Flare stars": "Спалахові зорі",
    "Optical flares": "Оптичні спалахи",
    "Flaring M dwarfs": "Спалахові М-карлики",
    "Flare activity": "Спалахова активність",
    "Superflare": "Суперспалах",
    "Outbursts / superoutbursts": "Спалахи / суперспалахи"
};

const detailedKeywords = {
    "RR Lyrae": ["RR Lyrae", "RR Lyr", "RR Lyr star", "RR Lyrae variable"],
    "Cepheids": ["Cepheid", "Classical Cepheid", "Cepheid variable", "DCEP", "Type II Cepheid", "W Virginis", "W Vir", "Type II Cepheid variable"],
    "RV Tauri": ["RV Tauri", "RV Tau", "RV Tauri star"],
    "Mira variables": ["Mira Variable", "MIRA", "Mira star", "Mira-type variable"],
    "Delta Scuti": ["Delta Scuti", "DSCT", "Delta Scuti variable", "Delta Sct"],
    "SX Phoenicis": ["SX Phoenicis", "SX Phe", "SX Phoenicis variable", "SX Phe star"],
    "Beta Cephei": ["Beta Cephei", "Beta Cep", "BCEP", "Beta Cephei variable", "Beta Cep star"],
    "Gamma Doradus": ["Gamma Doradus", "Gamma Dor", "GDOR", "Gamma Doradus variable"],
    "Eclipsing binaries": ["Eclipsing Binary", "Eclipsing Binaries", "Algol", "EA", "EA-type", "Beta Lyrae", "EB", "EB-type", "W Ursae Majoris", "EW", "EW-type"],
    "Cataclysmic variables": ["Cataclysmic Variable", "Cataclysmic Variable star", "CV", "Classical Nova", "Nova", "Novae", "Dwarf Nova", "DN", "DN-type"],
    "T Tauri and flare stars": ["T Tauri", "T Tauri star", "T Tau", "TTS", "Flare Star", "UV Ceti", "UV Cet"],
    "Rotation and pulsation": ["Rotating variable", "Pulsating variable", "Pulsating star", "Non-radial pulsator"],
    "OB-type pulsators": ["OB pulsator", "OB pulsators", "O-type pulsator", "B-type pulsator", "O pulsator", "B pulsator", "B-type variable", "O-type variable", "O variable", "B variable", "Slowly Pulsating B Star", "Slowly Pulsating B Stars", "SPB", "SPBs", "pulsating OB star", "pulsating O star", "pulsating B star", "non-radial pulsating B star", "nonradial pulsator", "radial pulsator", "massive star pulsator", "intermediate-mass pulsator", "early-type pulsator", "early-type variable", "Be star", "Be stars", "classical Be star", "classical Be stars"],
    "Wolf-Rayet variables": ["WR variability", "variable WR stars", "WR pulsations", "Wolf-Rayet spin", "WR spin", "colliding-wind binaries", "CWB", "X-ray WR", "optical WR variability", "massive star variability"],
    "Evolved stars": ["AGB star"],
    "Variable transiting exoplanets": ["variable exoplanet", "transiting exoplanet", "transiting planet", "planetary transit", "eclipsing exoplanet", "transit timing variations", "TTVs", "TOI", "CTOI", "transit duration variations", "TDVs", "phase curve variability", "star-planet interaction", "exoplanetary variability", "hot Jupiter variability", "superflare on exoplanet host"]
};


function getSurroundingWords(text, keyword, contextLength = 5) {
    const words = text.split(/\s+/);
    const keywordIndex = words.findIndex(word => word.toLowerCase().includes(keyword.toLowerCase()));

    if (keywordIndex === -1) {
        return null;
    }

    const start = Math.max(0, keywordIndex - contextLength);
    const end = Math.min(words.length, keywordIndex + contextLength + 1);
    return words.slice(start, end).join(" ");
}

async function checkStarsVariability(starIds) {
    const adql_query = `
SELECT
    ident.id,
    basic.otype,
    alltypes.otypes as other_types,
    ref.doi,
    ref.bibcode,
    ref."year",
    ref.Journal,
    ref.page,
    ref.Title,
    array_agg(keywords.keyword) as keywords,
    ref.Abstract
FROM ident
JOIN basic ON basic.oid = ident.oidref
JOIN has_ref ON has_ref.oidref = ident.oidref
JOIN ref ON ref.oidbib = has_ref.oidbibref
JOIN keywords ON keywords.oidbibref = ref.oidbib
JOIN alltypes ON alltypes.oidref = ident.oidref
WHERE ident.id IN (${starIds.map(id => `'${id}'`).join(',')})
GROUP BY ident.id, basic.otype, alltypes.otypes, ref.doi, ref.bibcode, ref."year", ref.Journal, ref.page, ref.Title, ref.Abstract
ORDER BY id
    `;

    const params = new URLSearchParams({
        REQUEST: 'doQuery',
        LANG: 'ADQL',
        FORMAT: 'json',
        QUERY: adql_query
    });

    let response;
    try {
        // https://simbad.u-strasbg.fr/Pages/guide/sim-url.htx
        response = await fetch('https://simbad.cds.unistra.fr/simbad/sim-tap/sync', {
            method: 'POST',
            body: params
        });

        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(`HTTP error! status: ${response.status}: ${errorText}`);
        }
    } catch (error) {
        throw new Error(`Failed to fetch data from SIMBAD: ${error.message}`);
    }

    const data = await response.json();

    if (!data || !Array.isArray(data.data)) {
        throw new Error(`Unexpected data format from SIMBAD: ${JSON.stringify(data)}`);
    }

    const results = {};
    starIds.forEach(id => {
        results[id] = [];
    });

    const rows = data.data.map(row => {
        const obj = {};
        data.metadata.forEach((meta, i) => {
            obj[meta.name] = row[i];
        });
        return obj;
    });

    const aggregatedData = {};
    for (const row of rows) {
        const starId = row.id;
        if (!aggregatedData[starId]) {
            aggregatedData[starId] = {
                id: starId,
                otype: row.otype,
                other_types: row.other_types,
                references: []
            };
        }
        aggregatedData[starId].references.push({
            doi: row.doi,
            bibcode: row.bibcode,
            year: row.year,
            Journal: row.Journal,
            page: row.page,
            Title: row.Title,
            keywords: row.keywords,
            Abstract: row.Abstract
        });
    }

    for (const starId in aggregatedData) {
        if (results[starId]) { // Check if the star was actually requested
            const star = aggregatedData[starId];
            const matches = [];

        const otypeKey = Object.keys(simbadOTypes).find(key => key.toLowerCase() === star.otype.toLowerCase());
        if (otypeKey) {
            matches.push({
                source: "otype",
                match_text: star.otype,
                description: simbadOTypes[otypeKey],
                priority: 1
            });
        }

        const otherTypes = star.other_types.split('|');
        for (const otype of otherTypes) {
            const otherOtypeKey = Object.keys(simbadOTypes).find(key => key.toLowerCase() === otype.toLowerCase());
            if (otherOtypeKey) {
                const match = {
                    source: "other_types",
                    match_text: otype,
                    description: simbadOTypes[otherOtypeKey],
                    priority: 2
                };
                if (!matches.some(m => m.match_text.toLowerCase() === otype.toLowerCase())) {
                    matches.push(match);
                }
            }
        }

        for (const ref of star.references) {
            // 2. Bibcode check
            if (variabilityBibcodes.includes(ref.bibcode)) {
                matches.push({
                    source: "bibcode",
                    match_text: ref.bibcode,
                    title: ref.Title,
                    priority: 3
                });
            }

            // 3. Keyword check
            const allKeywords = [
                ...Object.keys(generalKeywords),
                ...Object.values(detailedKeywords).flat()
            ];

            const checkAndAddKeywordMatch = (text, source, priority) => {
                if (!text) return;
                for (const keyword of allKeywords) {
                    if (text.toLowerCase().includes(keyword.toLowerCase())) {
                        const surrounding = getSurroundingWords(text, keyword);
                        matches.push({
                            source: source,
                            match_text: keyword,
                            context: surrounding,
                            bibcode: ref.bibcode,
                            title: ref.Title,
                            priority: priority
                        });
                    }
                }
            };

            checkAndAddKeywordMatch(ref.Title, "title", 4);
            checkAndAddKeywordMatch(ref.keywords, "keywords", 5);
            checkAndAddKeywordMatch(ref.Abstract, "abstract", 6);
        }
        results[starId].push(...matches);
        }
    }

    for (const starId in results) {
        // remove duplicates and sort
        const uniqueMatches = Array.from(new Set(results[starId].map(m => JSON.stringify(m)))).map(s => JSON.parse(s));
        results[starId] = uniqueMatches.sort((a, b) => a.priority - b.priority);
    }


    return results;
}

export { checkStarsVariability, simbadOTypes, variabilityBibcodes, generalKeywords, detailedKeywords, getSurroundingWords };