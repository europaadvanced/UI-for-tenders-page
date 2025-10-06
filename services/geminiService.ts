import { GoogleGenAI, Type } from "@google/genai";
import { Tender, Category, FundingType } from '../types';

const tenderSchema = {
    type: Type.OBJECT,
    properties: {
        id: { type: Type.INTEGER },
        title: { type: Type.STRING },
        summary: { type: Type.STRING },
        institution: { type: Type.STRING },
        fundingMin: { type: Type.INTEGER },
        fundingMax: { type: Type.INTEGER },
        deadline: { type: Type.STRING },
        fundingType: { type: Type.STRING },
        eligibleEntities: { type: Type.ARRAY, items: { type: Type.STRING } },
        category: { type: Type.STRING },
        fullDescription: { type: Type.STRING },
        conclusionPoints: { type: Type.ARRAY, items: { type: Type.STRING } },
    },
    required: [
        "id", "title", "summary", "institution", "fundingMin", "fundingMax", 
        "deadline", "fundingType", "eligibleEntities", "category", 
        "fullDescription", "conclusionPoints"
    ],
};


export const fetchTenders = async (): Promise<Tender[]> => {
  // In a browser environment, process.env.API_KEY is often not available.
  // We check for its presence. If it's missing, we immediately fall back to static data.
  // This ensures the application is functional for demonstration purposes.
  if (typeof process === 'undefined' || typeof process.env === 'undefined' || !process.env.API_KEY) {
    console.log("API_KEY not found. Falling back to static tender data.");
    return getStaticTenderData();
  }
  
  try {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

    const prompt = `
      You are a helpful assistant that generates structured JSON data.
      Generate a JSON array of 25 realistic public tenders for funding available in the Republic of Slovenia.
      The funding types must be one of: 'Nepovratna sredstva', 'Subvencija', 'So-investicija', 'Vračljiva pomoč', 'Subvencioniran kredit'.
      The eligible entities should include 'MSP', 'Startupi', 'Velika podjetja', 'Raziskovalne institucije', and 'Občine'.
      The categories must be one of: 'Tehnologija in inovacije', 'Zeleni prehod', 'Kmetijstvo', 'Turizem', 'Digitalizacija', 'Socialno podjetništvo'.
      The funding amounts and deadlines should be varied and realistic. The deadline format must be "YYYY-MM-DD".
      The fullDescription should be detailed Markdown text in Slovenian. All text should be in Slovenian.
      Each object in the array must follow the provided schema.
      Ensure the entire response is only the valid JSON array.
    `;

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: tenderSchema,
        },
      },
    });

    const jsonText = response.text.trim();
    if (!jsonText) {
        console.warn("Gemini API returned an empty response. Falling back to static data.");
        return getStaticTenderData();
    }
    const tenders = JSON.parse(jsonText);
    return tenders as Tender[];
  } catch (error) {
    console.error("Error fetching tenders from Gemini API, falling back to static data:", error);
    // Fallback to static data in case of API error or missing API key
    return getStaticTenderData();
  }
};


// Static data to be used if the API call fails or API key is not provided.
const getStaticTenderData = (): Tender[] => ([
    {
      "id": 1,
      "title": "Spodbude za digitalno preobrazbo MSP (P4D 2024)",
      "summary": "Namen javnega poziva je spodbuditi rast in razvoj malih in srednje velikih podjetij (MSP) s sofinanciranjem uvedbe digitalne preobrazbe v njihovo poslovanje.",
      "institution": "Slovenski podjetniški sklad",
      "fundingMin": 10000,
      "fundingMax": 100000,
      "deadline": "2024-10-31",
      "fundingType": "Nepovratna sredstva",
      "eligibleEntities": ["MSP", "Startupi"],
      "category": "Digitalizacija",
      "fullDescription": "### Cilj Javnega Poziva\nNamen javnega poziva je spodbuditi rast in razvoj malih in srednje velikih podjetij (MSP) s sofinanciranjem uvedbe digitalne preobrazbe v njihovo poslovanje.\n\n### Predmet Sofinanciranja\nSofinanciranje je namenjeno kritju upravičenih stroškov, ki nastanejo pri projektih digitalne preobrazbe. Upravičeni stroški vključujejo:\n* Stroške nakupa nove strojne in programske opreme.\n* Stroške zunanjih izvajalcev za svetovanje in implementacijo.\n* Stroške usposabljanja zaposlenih.\n\n### Pogoji za Prijavo\nPrijavitelji morajo izpolnjevati naslednje pogoje:\n* Sedež podjetja mora biti v Republiki Sloveniji.\n* Podjetje mora biti registrirano kot MSP.\n* Prijavitelj ne sme imeti neporavnanih davčnih obveznosti.",
      "conclusionPoints": ["Sofinanciranje do 60% upravičenih stroškov.", "Poudarek na digitalizaciji prodaje in marketinga.", "Obvezno usposabljanje zaposlenih."]
    },
    {
      "id": 2,
      "title": "Naložbe v kmetijska gospodarstva za zeleni prehod",
      "summary": "Javni razpis je namenjen podpori kmetijskim gospodarstvom pri prehodu na bolj trajnostne in okolju prijazne prakse. Sofinancirajo se naložbe v obnovljive vire energije.",
      "institution": "Agencija RS za kmetijske trge in razvoj podeželja",
      "fundingMin": 5000,
      "fundingMax": 50000,
      "deadline": "2025-01-15",
      "fundingType": "Subvencija",
      "eligibleEntities": ["MSP", "Kmetijska gospodarstva"],
      "category": "Zeleni prehod",
      "fullDescription": "### Namen razpisa\nCilj razpisa je pospešiti prehod kmetijskega sektorja v smeri trajnostnega razvoja in zmanjšanja vplivov na okolje. \n\n### Upravičeni stroški\n* Nakup in postavitev sončnih elektrarn.\n* Sistemi za zbiranje in ponovno uporabo deževnice.\n* Naložbe v opremo za zmanjšanje porabe gnojil.\n\n### Višina podpore\nDo 50% vrednosti upravičenih stroškov naložbe, z možnostjo povečanja za mlade kmete.",
      "conclusionPoints": ["Podpora za sončne elektrarne in varčevanje z vodo.", "Osredotočenost na zmanjšanje okoljskega odtisa.", "Posebne ugodnosti za mlade kmete."]
    },
    {
      "id": 3,
      "title": "Inovativni turizem 2024",
      "summary": "Podpora razvoju in trženju inovativnih turističnih produktov, ki prispevajo k večji prepoznavnosti Slovenije kot zelene, aktivne in zdrave destinacije.",
      "institution": "SPIRIT Slovenija",
      "fundingMin": 20000,
      "fundingMax": 150000,
      "deadline": "2024-11-30",
      "fundingType": "So-investicija",
      "eligibleEntities": ["MSP", "Startupi", "Turistična društva"],
      "category": "Turizem",
      "fullDescription": "### Predmet razpisa\nSofinanciranje projektov, ki uvajajo inovativne rešitve v turistično ponudbo Slovenije. Poudarek je na digitalizaciji, trajnosti in edinstvenih doživetjih.\n\n### Upravičeni stroški\n* Razvoj novih digitalnih orodij za turiste (aplikacije, spletne platforme).\n* Vlaganja v okolju prijazno infrastrukturo.\n* Stroški promocije na tujih trgih.\n\n### Ciljne skupine\nPrijavitelji, ki delujejo na področju gostinstva, hotelirstva, turističnih agencij.",
      "conclusionPoints": ["Poudarek na digitalnih in trajnostnih rešitvah.", "Sofinanciranje do 70% upravičenih stroškov.", "Priložnost za mednarodno promocijo."]
    },
    {
      "id": 4,
      "title": "Spodbude za socialno podjetništvo",
      "summary": "Razpis je namenjen krepitvi socialnega podjetništva in ustvarjanju novih delovnih mest za ranljive skupine prebivalstva.",
      "institution": "Ministrstvo za delo, družino, socialne zadeve in enake možnosti",
      "fundingMin": 5000,
      "fundingMax": 30000,
      "deadline": "2025-03-01",
      "fundingType": "Nepovratna sredstva",
      "eligibleEntities": ["Socialna podjetja", "Zadruge", "Zavodi"],
      "category": "Socialno podjetništvo",
      "fullDescription": "### Namen javnega razpisa\nCilj je zmanjševanje socialne izključenosti in spodbujanje zaposlovanja oseb iz ranljivih ciljnih skupin.\n\n### Prioritetna področja\n* Krožno gospodarstvo in ponovna uporaba.\n* Storitve socialnega varstva.\n* Lokalna pridelava in predelava hrane.\n\n### Pogoji\nPrijavitelj mora imeti status socialnega podjetja ali pa ga pridobiti v okviru projekta.",
      "conclusionPoints": ["Finančna podpora za zagon in razvoj.", "Ustvarjanje delovnih mest za ranljive skupine.", "Poudarek na projektih z močnim družbenim vplivom."]
    },
    {
      "id": 5,
      "title": "SI-SK Sklad tveganega kapitala",
      "summary": "Naložbe tveganega kapitala v inovativna, hitro rastoča tehnološka podjetja v zgodnjih fazah razvoja.",
      "institution": "Slovenski podjetniški sklad & SID banka",
      "fundingMin": 100000,
      "fundingMax": 1000000,
      "deadline": "2025-12-31",
      "fundingType": "So-investicija",
      "eligibleEntities": ["Startupi", "MSP"],
      "category": "Tehnologija in inovacije",
      "fullDescription": "### Naložbena politika\nSklad vlaga v podjetja z globalnim potencialom rasti, močno ekipo ter inovativno tehnologijo ali poslovnim modelom. Osredotoča se na področja, kot so umetna inteligenca, SaaS, kibernetska varnost in biotehnologija.\n\n### Postopek prijave\nPostopek je odprt preko celega leta. Podjetja se lahko prijavijo preko spletnega obrazca.\n\n### Kaj ponujamo\nPoleg finančne naložbe sklad nudi tudi aktivno podporo pri strateškem razvoju.",
      "conclusionPoints": ["Naložbe od 100k do 1M EUR.", "Za tehnološka podjetja v zgodnji fazi.", "Poleg denarja tudi pametna podpora (smart money)."]
    },
    {
      "id": 6,
      "title": "Vavčer za kibernetsko varnost",
      "summary": "Sofinanciranje stroškov za izvedbo sistemskega varnostnega pregleda, ki ga izvede zunanji strokovnjak za kibernetsko varnost.",
      "institution": "Slovenski podjetniški sklad",
      "fundingMin": 1000,
      "fundingMax": 9999,
      "deadline": "2024-12-01",
      "fundingType": "Subvencioniran kredit",
      "eligibleEntities": ["MSP"],
      "category": "Digitalizacija",
      "fullDescription": "### Predmet vavčerja\nVavčer krije do 60% upravičenih stroškov varnostnega pregleda informacijskega sistema podjetja. Cilj je dvig ravni kibernetske varnosti v MSP-jih.",
      "conclusionPoints": ["Hitra in enostavna pridobitev sredstev.", "Povečanje odpornosti na kibernetske napade.", "Sofinanciranje do 60% stroškov."]
    },
    {
      "id": 7,
      "title": "Podpora za investicije v predelavo in trženje kmetijskih pridelkov",
      "summary": "Namen razpisa je podpora investicijam v predelavo in trženje kmetijskih pridelkov, s ciljem povečanja dodane vrednosti in konkurenčnosti.",
      "institution": "Ministrstvo za kmetijstvo, gozdarstvo in prehrano",
      "fundingMin": 50000,
      "fundingMax": 500000,
      "deadline": "2025-04-30",
      "fundingType": "Nepovratna sredstva",
      "eligibleEntities": ["MSP", "Kmetijska gospodarstva", "Zadruge"],
      "category": "Kmetijstvo",
      "fullDescription": "### Cilji razpisa\n* Povečanje dodane vrednosti kmetijskih pridelkov.\n* Uvajanje novih tehnologij in postopkov.\n* Spodbujanje kratkih dobavnih verig.",
      "conclusionPoints": ["Visoka stopnja sofinanciranja.", "Za predelovalce kmetijskih pridelkov.", "Poudarek na inovacijah in kakovosti."]
    },
    {
      "id": 8,
      "title": "Raziskovalno-razvojni projekti (RRI)",
      "summary": "Sofinanciranje izvajanja RRI projektov podjetij, ki so usmerjeni v razvoj novih ali izboljšanih izdelkov, procesov ali storitev.",
      "institution": "Javna agencija SPIRIT Slovenija",
      "fundingMin": 100000,
      "fundingMax": 2000000,
      "deadline": "2025-02-28",
      "fundingType": "So-investicija",
      "eligibleEntities": ["MSP", "Velika podjetja", "Raziskovalne institucije"],
      "category": "Tehnologija in inovacije",
      "fullDescription": "### Faze RRI\nProjekt mora vključevati vsaj eno od naslednjih faz:\n* Industrijska raziskava\n* Eksperimentalni razvoj\n* Študija izvedljivosti",
      "conclusionPoints": ["Za tehnološko napredne projekte.", "Možnost sodelovanja z raziskovalnimi institucijami.", "Sofinanciranje od 25% do 70%."]
    }
]);