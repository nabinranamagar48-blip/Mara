export const CATEGORY_COLORS = {
  "Mocktails":        "#6DBF8A",
  "Creamy Drinks":    "#E0A84A",
  "Hot Coffee":       "#C97B4B",
  "Cold Brew":        "#6AAED6",
  "Juices":           "#E07B6A",
  "Matcha":           "#7BC47F",
  "Teas & Infusions": "#A78BCA",
};
export const CATEGORIES = Object.keys(CATEGORY_COLORS);

export const THEMES = {
  dark: {
    bg:"#0F0F0F", surface:"#1A1A1A", surface2:"#242424",
    inputBg:"#1A1A1A", border:"#2A2A2A", borderLight:"#383838",
    textPrimary:"#FFFFFF", textBody:"#CCCCCC", textLabel:"#999999",
    textMuted:"#666666", textFaint:"#444444",
    accent:"#E0A84A", accentText:"#0F0F0F", pillText:"#888888",
    danger:"#E05A4A",
  },
  light: {
    bg:"#F7F7F7", surface:"#FFFFFF", surface2:"#F0F0F0",
    inputBg:"#EFEFEF", border:"#E0E0E0", borderLight:"#D0D0D0",
    textPrimary:"#111111", textBody:"#444444", textLabel:"#777777",
    textMuted:"#999999", textFaint:"#BBBBBB",
    accent:"#C07830", accentText:"#FFFFFF", pillText:"#888888",
    danger:"#C0392B",
  }
};

export const DAILY_TIPS = [
  { tag:"Espresso Technique", title:"Nail Your Extraction Time", body:"A well-pulled espresso should take 25–30 seconds from first drop to finish. If it runs faster, grind finer or tamp harder. If it stalls past 35 seconds, coarsen the grind slightly." },
  { tag:"Milk Science", title:"Steam at the Right Angle", body:"Position your steam wand just off-centre and tilt the pitcher at 15–20°. Stop steaming when the pitcher reaches 60–65°C — any hotter and the milk proteins denature and taste flat." },
  { tag:"Coffee Origins", title:"Ethiopia: Birthplace of Coffee", body:"Coffee was first discovered in the Kaffa region of Ethiopia around 850 AD. Ethiopian naturals from Yirgacheffe carry intense blueberry and jasmine notes due to high altitude." },
  { tag:"Brewing Chemistry", title:"Water Hardness Changes Everything", body:"Ideal brew water has 150 ppm TDS and a pH of 7. Too soft and it under-extracts; too hard and it over-extracts. A cheap TDS meter is one of the best investments behind the bar." },
  { tag:"Equipment & Tools", title:"Calibrate Your Grinder Weekly", body:"Burr grinders drift over time. Run a test shot every week and record your grind setting, dose, yield, and time. A log of 30 seconds per day catches drift before it ruins your espresso." },
  { tag:"Sensory Training", title:"Train Your Nose First", body:"Smell is responsible for roughly 80% of flavour perception. Inhale deeply from the dry grounds, then from the bloom, then from the cup to detect floral, fruity, and roasty notes." },
  { tag:"Latte Art", title:"Merge Point is Everything", body:"Begin pouring with the pitcher high to sink the foam, then lower it once the cup is half full. The merge point determines whether your rosette stays crisp or collapses." },
  { tag:"Water Quality", title:"Filter Your Ice Too", body:"Most baristas filter brew water but forget the ice machine. Unfiltered ice dilutes cold drinks with chlorine and off-flavours as it melts." },
  { tag:"Bean Roasting", title:"First Crack Signals Development", body:"Beans undergo first crack at around 196°C. Light roasts finish just after first crack; medium roasts develop 1–2 minutes beyond it. Pulling too early leaves grassy flavour." },
  { tag:"Café Operations", title:"FIFO Keeps Beans Fresh", body:"Always rotate stock First In, First Out. Espresso beans are best 7–21 days after roast. Mark bags with the roast date and place newer stock behind older." },
  { tag:"Espresso Technique", title:"Distribute Before You Tamp", body:"Uneven distribution creates channels where water finds the path of least resistance. Use a distribution tool or finger-spin before tamping at 15–20kg of pressure." },
  { tag:"Milk Science", title:"Whole Milk vs. Alternatives", body:"Whole milk produces the richest microfoam. Oat milk needs higher steam pressure; almond milk splits easily — steam it below 55°C and pour immediately." },
  { tag:"Coffee Origins", title:"Colombian Huila Flavour Profile", body:"Huila coffees have bright malic acidity, caramel sweetness, and a clean finish. Grown at 1,500–2,000m, they benefit from a medium-light roast to preserve complexity." },
  { tag:"Brewing Chemistry", title:"The Golden Ratio for Pour-Over", body:"Start at 1:16 — 20g coffee to 320ml water. Adjust toward 1:15 if it tastes weak or 1:17 if it tastes bitter. A scale is non-negotiable for consistency." },
  { tag:"Equipment & Tools", title:"Backflush Groupheads Daily", body:"Backflushing removes coffee oils from the shower screen. Do a water-only backflush daily and a detergent backflush weekly. Neglected groupheads add rancid aftertaste." },
  { tag:"Sensory Training", title:"Use a Flavour Wheel Actively", body:"Start at the centre of the SCA Wheel and work outward to specific descriptors. Doing this for 5 minutes daily builds vocabulary fast." },
  { tag:"Latte Art", title:"Temperature Affects Pour Control", body:"Milk above 68°C becomes too thin. Below 55°C the foam is too stiff. The sweet spot is 60–65°C — thick enough to hold a pattern but fluid enough to move." },
  { tag:"Water Quality", title:"Descale Every 200 Brew Cycles", body:"Limescale insulates heating elements. A hard-water machine needs descaling every 4–6 weeks. Use citric acid solution — never vinegar, which leaves residue." },
  { tag:"Bean Roasting", title:"Rest Your Beans After Roasting", body:"Espresso needs 7–10 days rest after roasting; filter needs 3–5. Brewing too early produces bubbly, sour shots because CO₂ interferes with water contact." },
  { tag:"Café Operations", title:"Dial In Every Morning", body:"Pull a test shot every morning and adjust until your yield hits 1:2 ratio in 28–30 seconds. Log it. Consistency starts with this daily ritual." },
  { tag:"Espresso Technique", title:"Yield Ratio Defines Strength", body:"A 1:2 ratio (18g in, 36g out) is standard espresso. Ristretto runs 1:1.5 for concentrated sweetness; lungo runs 1:3 for a lighter, more floral cup." },
  { tag:"Milk Science", title:"Purge the Steam Wand Always", body:"Before and after steaming, purge the wand with a 1-second burst. This clears condensed water that dilutes the drink and destabilises foam structure." },
  { tag:"Coffee Origins", title:"Kenya AA and Bright Acidity", body:"Kenyan AA coffees from Kiambu and Nyeri have distinctive blackcurrant and tomato acidity from phosphoric acid compounds in their volcanic red soil." },
  { tag:"Brewing Chemistry", title:"Bloom Unlocks Filter Coffee Flavour", body:"Wetting grounds with 2–3× their weight in hot water for 30–45 seconds lets CO₂ escape. Skipping the bloom creates uneven extraction and a hollow cup." },
  { tag:"Equipment & Tools", title:"Check Portafilter Basket Wear", body:"Espresso baskets develop enlarged micro-holes with use. Hold a used basket up to light — if holes look uneven or large, replace it. They cost under £10." },
  { tag:"Sensory Training", title:"Slurp Loudly When Cupping", body:"Professional cuppers slurp forcefully to aerate coffee across the entire palate. The turbulence spreads volatile aromatic compounds evenly." },
  { tag:"Latte Art", title:"Practice the Heart Shape First", body:"Pour to 60% full with pitcher high, lower to the surface, wiggle to create a white dot, then cut through it by flicking the pitcher upward." },
  { tag:"Water Quality", title:"Brew Temperature Precision Matters", body:"Brew between 92–96°C. Lighter roasts extract better at 94–96°C; darker roasts at 90–93°C. A 2°C shift noticeably changes extraction." },
  { tag:"Bean Roasting", title:"Maillard Reaction Creates Flavour", body:"The Maillard reaction begins at ~150°C, combining amino acids and sugars into hundreds of flavour compounds — caramel, chocolate, and nutty notes." },
  { tag:"Café Operations", title:"Weigh Every Shot During Rush", body:"Spot-check every 10th shot during peak hours. A 2g yield drift compounds into dozens of inconsistent drinks per shift without you noticing." },
  { tag:"Espresso Technique", title:"Puck Prep Reduces Channeling", body:"Three habits prevent channeling: level distribution, firm tamping, and a clean dry basket before dosing. Add a puck screen for further insurance." },
  { tag:"Milk Science", title:"Lactose Sweetness Peaks at 60°C", body:"Lactose becomes noticeably sweeter as it heats toward 60°C. Milk steamed past 70°C loses this sweetness and tastes flat or slightly cooked." },
  { tag:"Coffee Origins", title:"Sumatra Mandheling's Earthy Depth", body:"Indonesian Wet-Hulled processing produces lower acidity and earthy, cedar, dark chocolate notes. Sumatra Mandheling is the benchmark for full-bodied coffee." },
  { tag:"Brewing Chemistry", title:"Grind Size Controls Extraction Rate", body:"In espresso, a 1-notch grind change can shift extraction time by 5+ seconds. Always change one variable at a time and wait two shots before judging." },
  { tag:"Equipment & Tools", title:"Clean Group Gaskets Monthly", body:"Old hardened gaskets cause pressure leaks. Replace every 6–12 months. Signs of wear: resistance locking the portafilter, or drips from the group during extraction." },
  { tag:"Sensory Training", title:"Cleanse Your Palate Between Tastes", body:"Sparkling water clears the palate better than still water. Plain crackers help reset between very different coffees." },
  { tag:"Latte Art", title:"Milk Jug Size Matches Cup Size", body:"Use a 350ml jug for small cups and a 600ml jug for large cups. Overfilling prevents proper whirlpool formation; underfilling makes temperature control difficult." },
  { tag:"Water Quality", title:"Soft Water Needs Mineral Additions", body:"RO water extracts poorly and corrodes boilers. Add a remineralisation filter to reach 50–150 ppm TDS. Magnesium enhances sweetness; calcium adds body." },
  { tag:"Bean Roasting", title:"Colour Meters Remove Subjectivity", body:"Specialty roasters target 65–80 on the Agtron scale for light-to-medium roasts. Colour meters eliminate guesswork and allow exact roast replication." },
  { tag:"Café Operations", title:"Group Temperature Recovery Time", body:"After pulling a shot, the group head needs 20–30 seconds to return to brew temperature. Back-to-back shots without this pause cause temperature drift." },
  { tag:"Espresso Technique", title:"Pre-Infusion Improves Evenness", body:"Pre-infusion wets the puck at 2–4 bar for 3–8 seconds before full pressure. This softens dry clumps and reduces channeling risk." },
  { tag:"Milk Science", title:"Oat Milk Barista Blends Explained", body:"Barista oat milk contains emulsifiers that stabilise foam under steam heat. Standard supermarket oat milk lacks these and produces grainy, unstable foam." },
];

export const DEFAULT_RECIPES = [
  { id:"r1", name:"Passion Fruit Ginger", category:"Mocktails", image:"",
    ingredients:["30ml Passion fruit seeds","5ml Ginger juice","25ml Passion syrup","250ml Apple juice","— Crushed ice"],
    method:"Build in glass over crushed ice.", garnish:"Passion fruit · Apple · Mint" },
  { id:"r2", name:"Dirty Espresso", category:"Creamy Drinks", image:"",
    ingredients:["45ml Whipped cream (foam)","10ml Vanilla syrup (foam)","30ml Full fat milk","2shot Double espresso","3pc Ice cubes"],
    method:"Mix cream and syrup for foam. Add ice, milk, espresso. Top with 20ml foam.", garnish:"" },
  { id:"r3", name:"Arabic Coffee", category:"Hot Coffee", image:"",
    ingredients:["25g Arabic coffee","300ml Water","3g Cardamom","pinch Saffron","1tsp Rose water"],
    method:"Cook 5–6 min. Reduce heat after first boil.", garnish:"" },
  { id:"r4", name:"Ginger Lemonade", category:"Mocktails", image:"",
    ingredients:["50ml Wild mint","25ml Lemon juice","10pc Mint leaves","top Ginger ale","— Crushed ice"],
    method:"Combine over crushed ice. Top with ginger ale.", garnish:"Lemon · Mint" },
  { id:"r5", name:"Classic Matcha Latte", category:"Matcha", image:"",
    ingredients:["2tsp Ceremonial matcha powder","60ml Hot water (70°C)","180ml Oat milk","1tsp Simple syrup"],
    method:"Sift matcha into bowl. Whisk with hot water until frothy. Steam oat milk to 60°C. Pour over ice then top with milk.", garnish:"Matcha dusting" },
];

export const BLANK_FORM = { name:"", category:"Mocktails", ingredients:["","","","",""], method:"", garnish:"", image:"" };

export function getDailyTip() {
  const now = new Date();
  const day = Math.floor((now - new Date(now.getFullYear(),0,0)) / 86400000);
  return DAILY_TIPS[day % DAILY_TIPS.length];
}
export function parseIngredient(raw) {
  const s = raw.trim();
  const m = s.match(/^(\S+)\s+(.+)$/);
  if (m) return { measure:m[1], name:m[2].trim() };
  return { measure:"", name:s };
}
export function simpleHash(str) {
  let h = 0x811c9dc5;
  for (let i=0;i<str.length;i++) { h ^= str.charCodeAt(i); h = (h*0x01000193)>>>0; }
  return h.toString(16);
}
