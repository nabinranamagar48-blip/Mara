import { useState, useEffect, useCallback, useRef } from "react";
import { dbLoad, dbSave, dbSubscribe, loadAdminPw, saveAdminPw } from "./firebase.js";

const CATEGORY_COLORS = {
  "Mocktails":        "#6DBF8A",
  "Creamy Drinks":    "#E0A84A",
  "Hot Coffee":       "#C97B4B",
  "Cold Brew":        "#6AAED6",
  "Juices":           "#E07B6A",
  "Matcha":           "#7BC47F",
  "Teas & Infusions": "#A78BCA",
};
const CATEGORIES = Object.keys(CATEGORY_COLORS);

const THEMES = {
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

const DAILY_TIPS = [
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

function getDailyTip() {
  const now = new Date();
  const day = Math.floor((now - new Date(now.getFullYear(),0,0)) / 86400000);
  return DAILY_TIPS[day % DAILY_TIPS.length];
}
function parseIngredient(raw) {
  const s = raw.trim();
  const m = s.match(/^(\S+)\s+(.+)$/);
  if (m) return { measure:m[1], name:m[2].trim() };
  return { measure:"", name:s };
}
function simpleHash(str) {
  let h = 0x811c9dc5;
  for (let i=0;i<str.length;i++) { h ^= str.charCodeAt(i); h = (h*0x01000193)>>>0; }
  return h.toString(16);
}

const DEFAULT_RECIPES = [
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
const BLANK_FORM = { name:"", category:"Mocktails", ingredients:["","","","",""], method:"", garnish:"", image:"" };
function Toast({ message, visible }) {
  return (
    <div style={{ position:"fixed",bottom:"24px",left:"50%",transform:`translateX(-50%) translateY(${visible?0:"12px"})`,background:"#333",color:"#fff",padding:"10px 20px",borderRadius:"8px",fontSize:"13px",opacity:visible?1:0,transition:"all 0.2s ease",pointerEvents:"none",zIndex:200,whiteSpace:"nowrap",boxShadow:"0 4px 20px rgba(0,0,0,0.4)" }}>{message}</div>
  );
}

function ThemeToggle({ isDark, onToggle }) {
  return <button onClick={onToggle} style={{background:"none",border:"none",cursor:"pointer",padding:"6px",color:isDark?"#888":"#555",fontSize:"18px",lineHeight:1,display:"flex",alignItems:"center",justifyContent:"center"}}>{isDark?"☀":"☾"}</button>;
}

function ImageLightbox({ src, name, onClose }) {
  useEffect(()=>{
    const h=(e)=>{ if(e.key==="Escape") onClose(); };
    window.addEventListener("keydown",h);
    return ()=>window.removeEventListener("keydown",h);
  },[onClose]);
  return (
    <div onClick={onClose} style={{position:"fixed",inset:0,background:"rgba(0,0,0,0.93)",zIndex:150,display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",padding:"20px"}}>
      <div onClick={e=>e.stopPropagation()} style={{position:"relative",maxWidth:"90vw",maxHeight:"80vh",display:"flex",flexDirection:"column",alignItems:"center",gap:"14px"}}>
        <img src={src} alt={name} style={{maxWidth:"100%",maxHeight:"70vh",borderRadius:"12px",objectFit:"contain",boxShadow:"0 8px 40px rgba(0,0,0,0.6)"}}/>
        <div style={{color:"#fff",fontSize:"16px",fontWeight:"700"}}>{name}</div>
      </div>
      <button onClick={onClose} style={{position:"fixed",top:"20px",right:"20px",background:"rgba(255,255,255,0.12)",border:"none",borderRadius:"50%",width:"40px",height:"40px",color:"#fff",fontSize:"20px",cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center"}}>✕</button>
    </div>
  );
}

function DailyCard({ t }) {
  const tip = getDailyTip();
  return (
    <div style={{margin:"0 16px",background:t.surface,borderRadius:"12px",border:`1px solid ${t.border}`}}>
      <div style={{padding:"14px 16px"}}>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:"10px"}}>
          <div style={{display:"flex",alignItems:"center",gap:"8px"}}>
            <span style={{fontSize:"11px",color:"#E0A84A",fontWeight:"700",letterSpacing:"1px",textTransform:"uppercase"}}>✦ Daily Tip</span>
            <span style={{fontSize:"11px",color:t.textMuted,background:t.surface2,padding:"2px 8px",borderRadius:"4px"}}>{tip.tag}</span>
          </div>
          <span style={{fontSize:"11px",color:t.textFaint}}>{new Date().toLocaleDateString("en-US",{month:"short",day:"numeric"})}</span>
        </div>
        <div style={{fontSize:"15px",fontWeight:"700",color:t.textPrimary,marginBottom:"6px",lineHeight:1.35}}>{tip.title}</div>
        <p style={{color:t.textBody,fontSize:"13px",lineHeight:"1.65",margin:0}}>{tip.body}</p>
      </div>
    </div>
  );
}

function AdminModal({ mode, onClose, onLogin, onSetPassword, onChangePassword, onLogout, t }) {
  const [pw,setPw]=useState(""); const [newPw,setNewPw]=useState(""); const [confirm,setConfirm]=useState(""); const [error,setError]=useState("");
  const inp={width:"100%",background:t.surface2,border:`1px solid ${t.border}`,borderRadius:"8px",padding:"11px 13px",color:t.textPrimary,fontSize:"14px",fontFamily:"inherit",outline:"none",boxSizing:"border-box"};
  const lbl={fontSize:"11px",fontWeight:"600",letterSpacing:"1px",textTransform:"uppercase",color:t.textLabel,display:"block",marginBottom:"7px"};
  const btn=(bg,col)=>({background:bg,border:"none",borderRadius:"8px",padding:"13px",color:col,fontSize:"14px",fontWeight:"700",cursor:"pointer",fontFamily:"inherit",width:"100%"});
  const handleSetup=()=>{ if(newPw.length<4){setError("Min 4 characters.");return;} if(newPw!==confirm){setError("Passwords don't match.");return;} onSetPassword(newPw); };
  const handleLogin=()=>{ if(!onLogin(pw)){setError("Incorrect password.");setPw("");} };
  const handleChange=()=>{ if(newPw.length<4){setError("Min 4 characters.");return;} if(newPw!==confirm){setError("Passwords don't match.");return;} if(!onLogin(pw,true)){setError("Current password incorrect.");return;} onChangePassword(newPw); };
  return (
    <div style={{position:"fixed",inset:0,background:"rgba(0,0,0,0.75)",zIndex:100,display:"flex",alignItems:"center",justifyContent:"center",padding:"20px"}} onClick={onClose}>
      <div onClick={e=>e.stopPropagation()} style={{background:t.surface,borderRadius:"16px",width:"100%",maxWidth:"360px",padding:"28px 24px",border:`1px solid ${t.border}`}}>
        {mode==="setup"&&<>
          <div style={{fontSize:"18px",fontWeight:"700",color:t.textPrimary,marginBottom:"6px"}}>Set Admin Password</div>
          <p style={{fontSize:"13px",color:t.textMuted,marginBottom:"20px",lineHeight:1.5}}>Create a password to restrict editing to admins only.</p>
          <div style={{display:"flex",flexDirection:"column",gap:"14px"}}>
            <div><label style={lbl}>New Password</label><input style={inp} type="password" value={newPw} onChange={e=>{setNewPw(e.target.value);setError("");}} placeholder="Min. 4 characters"/></div>
            <div><label style={lbl}>Confirm Password</label><input style={inp} type="password" value={confirm} onChange={e=>{setConfirm(e.target.value);setError("");}} placeholder="Repeat password"/></div>
            {error&&<p style={{color:t.danger,fontSize:"12px",margin:0}}>{error}</p>}
            <button onClick={handleSetup} style={btn(t.accent,t.accentText)}>Set Password & Unlock</button>
            <button onClick={onClose} style={btn(t.surface2,t.textMuted)}>Cancel</button>
          </div>
        </>}
        {mode==="login"&&<>
          <div style={{fontSize:"18px",fontWeight:"700",color:t.textPrimary,marginBottom:"6px"}}>Admin Login</div>
          <p style={{fontSize:"13px",color:t.textMuted,marginBottom:"20px",lineHeight:1.5}}>Enter the admin password to edit recipes.</p>
          <div style={{display:"flex",flexDirection:"column",gap:"14px"}}>
            <div><label style={lbl}>Password</label><input style={inp} type="password" value={pw} autoFocus onChange={e=>{setPw(e.target.value);setError("");}} onKeyDown={e=>e.key==="Enter"&&handleLogin()} placeholder="Enter admin password"/></div>
            {error&&<p style={{color:t.danger,fontSize:"12px",margin:0}}>{error}</p>}
            <button onClick={handleLogin} style={btn(t.accent,t.accentText)}>Unlock</button>
            <button onClick={onClose} style={btn(t.surface2,t.textMuted)}>Cancel</button>
          </div>
        </>}
        {mode==="panel"&&<>
          <div style={{fontSize:"18px",fontWeight:"700",color:t.textPrimary,marginBottom:"6px"}}>Admin Panel</div>
          <p style={{fontSize:"13px",color:t.textMuted,marginBottom:"20px",lineHeight:1.5}}>Change your password or log out.</p>
          <div style={{display:"flex",flexDirection:"column",gap:"14px"}}>
            <div><label style={lbl}>Current Password</label><input style={inp} type="password" value={pw} onChange={e=>{setPw(e.target.value);setError("");}} placeholder="Current password"/></div>
            <div><label style={lbl}>New Password</label><input style={inp} type="password" value={newPw} onChange={e=>{setNewPw(e.target.value);setError("");}} placeholder="New password"/></div>
            <div><label style={lbl}>Confirm New Password</label><input style={inp} type="password" value={confirm} onChange={e=>{setConfirm(e.target.value);setError("");}} placeholder="Repeat new password"/></div>
            {error&&<p style={{color:t.danger,fontSize:"12px",margin:0}}>{error}</p>}
            <button onClick={handleChange} style={btn(t.accent,t.accentText)}>Change Password</button>
            <button onClick={onLogout} style={btn(t.danger+"22",t.danger)}>Log Out</button>
            <button onClick={onClose} style={btn(t.surface2,t.textMuted)}>Close</button>
          </div>
        </>}
      </div>
    </div>
  );
}

function RecipeModal({ initial, onSave, onClose, t }) {
  const [form,setForm]=useState(initial||BLANK_FORM);
  const sf=(k,v)=>setForm(f=>({...f,[k]:v}));
  const si=(i,v)=>setForm(f=>{const a=[...f.ingredients];a[i]=v;return{...f,ingredients:a};});
  const ai=()=>setForm(f=>({...f,ingredients:[...f.ingredients,""]}));
  const ri=(i)=>setForm(f=>({...f,ingredients:f.ingredients.filter((_,x)=>x!==i)}));
  const valid=form.name.trim()&&form.method.trim()&&form.ingredients.some(i=>i.trim());
  const inp={width:"100%",background:t.surface2,border:`1px solid ${t.border}`,borderRadius:"8px",padding:"11px 13px",color:t.textPrimary,fontSize:"14px",fontFamily:"inherit",outline:"none",boxSizing:"border-box"};
  const lbl={fontSize:"11px",fontWeight:"600",letterSpacing:"1px",textTransform:"uppercase",color:t.textLabel,display:"block",marginBottom:"7px"};
  return (
    <div style={{position:"fixed",inset:0,background:"rgba(0,0,0,0.75)",zIndex:50,display:"flex",alignItems:"flex-end",justifyContent:"center"}} onClick={onClose}>
      <div onClick={e=>e.stopPropagation()} style={{background:t.surface,borderRadius:"16px 16px 0 0",width:"100%",maxWidth:"480px",maxHeight:"88vh",overflowY:"auto",padding:"24px 20px 44px",border:`1px solid ${t.border}`,borderBottom:"none"}}>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:"22px"}}>
          <span style={{fontSize:"18px",fontWeight:"700",color:t.textPrimary}}>{initial?"Edit Recipe":"New Recipe"}</span>
          <button onClick={onClose} style={{background:"none",border:"none",color:t.textMuted,fontSize:"22px",cursor:"pointer",padding:0,lineHeight:1}}>✕</button>
        </div>
        <div style={{display:"flex",flexDirection:"column",gap:"16px"}}>
          <div><label style={lbl}>Drink Name</label><input style={inp} value={form.name} onChange={e=>sf("name",e.target.value)} placeholder="e.g. Rose Latte"/></div>
          <div><label style={lbl}>Category</label><select style={{...inp,cursor:"pointer"}} value={form.category} onChange={e=>sf("category",e.target.value)}>{CATEGORIES.map(c=><option key={c} value={c}>{c}</option>)}</select></div>
          <div>
            <label style={lbl}>Ingredients <span style={{opacity:0.5,fontWeight:400,fontSize:"11px",textTransform:"none",letterSpacing:0,marginLeft:"6px"}}>(amount + name)</span></label>
            <div style={{display:"flex",flexDirection:"column",gap:"7px"}}>
              {form.ingredients.map((ing,i)=>(
                <div key={i} style={{display:"flex",gap:"7px"}}>
                  <input style={{...inp,flex:1}} value={ing} onChange={e=>si(i,e.target.value)} placeholder="e.g. 30ml Oat milk"/>
                  {form.ingredients.length>1&&<button onClick={()=>ri(i)} style={{background:t.surface2,border:`1px solid ${t.border}`,borderRadius:"8px",color:t.textMuted,cursor:"pointer",padding:"0 12px",fontSize:"16px"}}>−</button>}
                </div>
              ))}
              <button onClick={ai} style={{background:"transparent",border:`1.5px dashed ${t.border}`,borderRadius:"8px",color:t.textMuted,padding:"9px",fontSize:"13px",cursor:"pointer",fontFamily:"inherit"}}>+ Add ingredient</button>
            </div>
          </div>
          <div><label style={lbl}>Method</label><textarea style={{...inp,resize:"vertical",minHeight:"80px",lineHeight:"1.6"}} value={form.method} onChange={e=>sf("method",e.target.value)} placeholder="Describe steps…"/></div>
          <div><label style={lbl}>Garnish <span style={{opacity:0.5,fontWeight:400,fontSize:"11px",textTransform:"none",letterSpacing:0}}>(optional)</span></label><input style={inp} value={form.garnish} onChange={e=>sf("garnish",e.target.value)} placeholder="e.g. Matcha dusting"/></div>
          <div>
            <label style={lbl}>Drink Photo <span style={{opacity:0.5,fontWeight:400,fontSize:"11px",textTransform:"none",letterSpacing:0}}>(optional)</span></label>
            {form.image?(
              <div style={{position:"relative",display:"inline-block",width:"100%"}}>
                <img src={form.image} alt="preview" style={{width:"100%",maxHeight:"180px",objectFit:"cover",borderRadius:"10px",border:`1px solid ${t.border}`,display:"block"}}/>
                <button onClick={()=>sf("image","")} style={{position:"absolute",top:"8px",right:"8px",background:"rgba(0,0,0,0.6)",border:"none",borderRadius:"50%",width:"28px",height:"28px",color:"#fff",fontSize:"14px",cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center"}}>✕</button>
              </div>
            ):(
              <label style={{display:"block",cursor:"pointer"}}>
                <div style={{background:t.surface2,border:`1.5px dashed ${t.border}`,borderRadius:"10px",padding:"20px",textAlign:"center",color:t.textMuted,fontSize:"13px"}}>📷 Tap to upload photo</div>
                <input type="file" accept="image/*" style={{display:"none"}} onChange={e=>{
                  const file=e.target.files[0]; if(!file) return;
                  const reader=new FileReader();
                  reader.onload=ev=>{
  const img=new Image();
  img.onload=()=>{
    const MAX=600;
    let w=img.width, h=img.height;
    if(w>h){ if(w>MAX){h=Math.round(h*MAX/w);w=MAX;} }
    else { if(h>MAX){w=Math.round(w*MAX/h);h=MAX;} }
    const canvas=document.createElement("canvas");
    canvas.width=w; canvas.height=h;
    canvas.getContext("2d").drawImage(img,0,0,w,h);
    sf("image",canvas.toDataURL("image/jpeg",0.7));
  };
  img.src=ev.target.result;
};
reader.readAsDataURL(file);
                }}/>
              </label>
            )}
          </div>
          <button disabled={!valid} onClick={()=>valid&&onSave(form)} style={{background:valid?t.accent:t.surface2,border:"none",borderRadius:"10px",padding:"15px",color:valid?t.accentText:t.textFaint,fontSize:"14px",fontWeight:"700",cursor:valid?"pointer":"not-allowed",fontFamily:"inherit"}}>{initial?"Save Changes":"Add Recipe"}</button>
        </div>
      </div>
    </div>
  );
}
export default function MARAApp() {
  const [isDark,setIsDark]=useState(true);
  const t=THEMES[isDark?"dark":"light"];
  const [recipes,setRecipes]=useState([]);
  const [searchQuery,setSearchQuery]=useState("");
  const [activeCategory,setActiveCategory]=useState("All");
  const [expanded,setExpanded]=useState(null);
  const [showModal,setShowModal]=useState(false);
  const [editingRecipe,setEditingRecipe]=useState(null);
  const [lightbox,setLightbox]=useState(null);
  const [syncing,setSyncing]=useState(true);
  const [toast,setToast]=useState({message:"",visible:false});
  const [isAdmin,setIsAdmin]=useState(false);
  const [adminPwHash,setAdminPwHash]=useState(null);
  const [adminModal,setAdminModal]=useState(null);
  const lastRef=useRef(null);
  const toastTimer=useRef(null);

  const showToast=(msg)=>{ clearTimeout(toastTimer.current); setToast({message:msg,visible:true}); toastTimer.current=setTimeout(()=>setToast(s=>({...s,visible:false})),2200); };

  useEffect(()=>{
    (async()=>{
      const [stored,pw]=await Promise.all([dbLoad(),loadAdminPw()]);
      if(stored){setRecipes(stored);lastRef.current=JSON.stringify(stored);}
      else{setRecipes(DEFAULT_RECIPES);await dbSave(DEFAULT_RECIPES);lastRef.current=JSON.stringify(DEFAULT_RECIPES);}
      setAdminPwHash(pw);
      setSyncing(false);
    })();
    const unsub=dbSubscribe((list)=>{
      const s=JSON.stringify(list);
      if(s!==lastRef.current){lastRef.current=s;setRecipes(list);showToast("↻ Menu updated");}
    });
    return ()=>unsub();
  },[]);

  const persist=useCallback(async(nr)=>{ setRecipes(nr);lastRef.current=JSON.stringify(nr);await dbSave(nr); },[]);
  const handleAdd=async(form)=>{ await persist([...recipes,{...form,id:"r"+Date.now(),ingredients:form.ingredients.filter(i=>i.trim())}]); setShowModal(false);showToast("Recipe added"); };
  const handleEdit=async(form)=>{ await persist(recipes.map(r=>r.id===editingRecipe.id?{...form,id:r.id,ingredients:form.ingredients.filter(i=>i.trim())}:r)); setEditingRecipe(null);showToast("Recipe saved"); };
  const handleDelete=async(id)=>{ await persist(recipes.filter(r=>r.id!==id)); if(expanded===id)setExpanded(null);showToast("Removed"); };

  const handleLockClick=()=>{ if(isAdmin)setAdminModal("panel"); else if(!adminPwHash)setAdminModal("setup"); else setAdminModal("login"); };
  const handleSetPassword=async(pw)=>{ const h=simpleHash(pw);await saveAdminPw(h);setAdminPwHash(h);setIsAdmin(true);setAdminModal(null);showToast("Admin password set"); };
  const handleLogin=(pw,silent=false)=>{ if(simpleHash(pw)===adminPwHash){if(!silent){setIsAdmin(true);setAdminModal(null);showToast("Logged in as admin");}return true;}return false; };
  const handleChangePassword=async(newPw)=>{ const h=simpleHash(newPw);await saveAdminPw(h);setAdminPwHash(h);setAdminModal(null);showToast("Password changed"); };
  const handleLogout=()=>{ setIsAdmin(false);setAdminModal(null);showToast("Logged out"); };

  const categories=["All",...new Set(recipes.map(r=>r.category))];
  const filtered=recipes.filter(r=>r.name.toLowerCase().includes(searchQuery.toLowerCase())&&(activeCategory==="All"||r.category===activeCategory));

  return (
    <div style={{minHeight:"100vh",background:t.bg,fontFamily:"-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif",paddingBottom:"90px",color:t.textPrimary,transition:"background 0.2s,color 0.2s"}}>
      <div style={{position:"sticky",top:0,background:t.bg,zIndex:20,borderBottom:`1px solid ${t.border}`,transition:"background 0.2s,border-color 0.2s"}}>
        <div style={{padding:"16px 20px 0"}}>
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:"14px"}}>
            <div style={{display:"flex",alignItems:"center",gap:"10px"}}>
              <div style={{width:"34px",height:"34px",borderRadius:"50%",background:t.surface2,border:`1px solid ${t.border}`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:"16px"}}>☕</div>
              <div>
                <div style={{fontSize:"20px",fontWeight:"800",color:t.textPrimary,letterSpacing:"-0.5px",lineHeight:1}}>MARA</div>
                <div style={{fontSize:"10px",color:t.textMuted,letterSpacing:"1px",marginTop:"2px"}}>Barista Recipe Reference</div>
              </div>
            </div>
            <div style={{display:"flex",alignItems:"center",gap:"4px"}}>
              <div style={{width:"7px",height:"7px",borderRadius:"50%",background:syncing?"#444":"#5DBF7A",boxShadow:syncing?"none":"0 0 6px #5DBF7A",transition:"background 0.3s",marginRight:"6px"}}/>
              <button onClick={handleLockClick} style={{background:isAdmin?t.accent+"22":"none",border:isAdmin?`1px solid ${t.accent}44`:"none",borderRadius:"8px",padding:"5px 8px",cursor:"pointer",fontSize:"16px",lineHeight:1,color:isAdmin?t.accent:t.textFaint,display:"flex",alignItems:"center",gap:"5px"}}>
                {isAdmin?"🔓":"🔒"}{isAdmin&&<span style={{fontSize:"11px",fontWeight:"600"}}>Admin</span>}
              </button>
              <ThemeToggle isDark={isDark} onToggle={()=>setIsDark(d=>!d)}/>
            </div>
          </div>
          <div style={{position:"relative",marginBottom:"12px"}}>
            <span style={{position:"absolute",left:"13px",top:"50%",transform:"translateY(-50%)",color:t.textFaint,fontSize:"14px",pointerEvents:"none"}}>⌕</span>
            <input type="text" placeholder="Search drinks or ingredients…" value={searchQuery} onChange={e=>setSearchQuery(e.target.value)} style={{width:"100%",background:t.inputBg,border:`1px solid ${t.border}`,borderRadius:"10px",padding:"11px 14px 11px 36px",color:t.textPrimary,fontSize:"14px",fontFamily:"inherit",outline:"none",boxSizing:"border-box"}}/>
          </div>
          <div style={{display:"flex",gap:"6px",overflowX:"auto",paddingBottom:"14px"}}>
            {categories.map(cat=>{const active=activeCategory===cat;const col=CATEGORY_COLORS[cat];return <button key={cat} onClick={()=>setActiveCategory(cat)} style={{padding:"6px 14px",borderRadius:"20px",whiteSpace:"nowrap",cursor:"pointer",fontFamily:"inherit",fontSize:"12px",fontWeight:active?"700":"400",border:"none",background:active?(col||t.accent):t.surface2,color:active?"#fff":t.pillText}}>{cat}</button>;})}
          </div>
        </div>
      </div>

      <div style={{padding:"14px 0 6px"}}><DailyCard t={t}/></div>

      {adminPwHash&&!isAdmin&&(
        <div style={{margin:"4px 16px 2px",padding:"8px 12px",background:t.surface2,borderRadius:"8px",border:`1px solid ${t.border}`}}>
          <span style={{fontSize:"12px",color:t.textMuted}}>🔒 View only — <button onClick={handleLockClick} style={{background:"none",border:"none",color:t.accent,fontSize:"12px",cursor:"pointer",padding:0,fontFamily:"inherit"}}>admin login to edit</button></span>
        </div>
      )}

      <div style={{padding:"8px 20px 10px",display:"flex",justifyContent:"space-between",alignItems:"center"}}>
        <span style={{fontSize:"12px",color:t.textMuted,fontWeight:"600"}}>{filtered.length} {filtered.length===1?"recipe":"recipes"}</span>
        <span style={{fontSize:"11px",color:t.textFaint}}>shared · synced</span>
      </div>

      <div style={{padding:"0 16px",display:"flex",flexDirection:"column",gap:"8px"}}>
        {filtered.length>0?filtered.map(recipe=>{
          const ac=CATEGORY_COLORS[recipe.category]||t.accent;
          const isOpen=expanded===recipe.id;
          return (
            <div key={recipe.id} style={{background:t.surface,borderRadius:"12px",border:`1px solid ${isOpen?t.borderLight:t.border}`,overflow:"hidden",transition:"border-color 0.15s"}}>
              <div onClick={()=>setExpanded(isOpen?null:recipe.id)} style={{display:"flex",alignItems:"center",padding:"12px 16px",cursor:"pointer",gap:"12px"}}>
                {recipe.image?(
                  <div onClick={e=>{e.stopPropagation();setLightbox({src:recipe.image,name:recipe.name});}} style={{width:"52px",height:"52px",borderRadius:"10px",overflow:"hidden",flexShrink:0,border:`1px solid ${t.border}`,cursor:"zoom-in"}}>
                    <img src={recipe.image} alt={recipe.name} style={{width:"100%",height:"100%",objectFit:"cover",display:"block"}}/>
                  </div>
                ):(
                  <div style={{width:"52px",height:"52px",borderRadius:"10px",background:ac+"22",border:`1px solid ${ac}44`,flexShrink:0,display:"flex",alignItems:"center",justifyContent:"center"}}>
                    <div style={{width:"10px",height:"10px",borderRadius:"50%",background:ac}}/>
                  </div>
                )}
                <div style={{flex:1,minWidth:0}}>
                  <div style={{fontSize:"16px",fontWeight:"700",color:t.textPrimary,lineHeight:1.25,marginBottom:"3px"}}>{recipe.name}</div>
                  <div style={{fontSize:"11px",color:t.textMuted}}>{recipe.category}</div>
                </div>
                <div style={{display:"flex",alignItems:"center",gap:"2px",flexShrink:0}}>
                  {isAdmin&&<><button onClick={e=>{e.stopPropagation();setEditingRecipe(recipe);}} style={{background:"none",border:"none",color:t.textFaint,fontSize:"15px",cursor:"pointer",padding:"6px",lineHeight:1}}>✎</button><button onClick={e=>{e.stopPropagation();handleDelete(recipe.id);}} style={{background:"none",border:"none",color:t.textFaint,fontSize:"15px",cursor:"pointer",padding:"6px",lineHeight:1}}>⌫</button></>}
                  <span style={{color:t.textFaint,fontSize:"16px",transform:isOpen?"rotate(90deg)":"rotate(0deg)",transition:"transform 0.2s",display:"inline-block",marginLeft:"4px"}}>›</span>
                </div>
              </div>
              {isOpen&&(
                <div style={{borderTop:`1px solid ${t.border}`}}>
                  <div style={{padding:"14px 16px 10px"}}>
                    <div style={{fontSize:"10px",fontWeight:"700",letterSpacing:"1.5px",textTransform:"uppercase",color:t.textMuted,marginBottom:"10px"}}>Ingredients</div>
                    {recipe.ingredients.map((item,i)=>{const{measure,name}=parseIngredient(item);return <div key={i} style={{display:"grid",gridTemplateColumns:"64px 1fr",gap:"10px",alignItems:"center",padding:"7px 0",borderBottom:i<recipe.ingredients.length-1?`1px solid ${t.border}`:"none"}}><span style={{fontSize:"13px",fontWeight:"700",color:ac,textAlign:"right"}}>{measure||"—"}</span><span style={{fontSize:"14px",color:t.textBody}}>{name}</span></div>;})}
                  </div>
                  <div style={{height:"1px",background:t.border,margin:"0 16px"}}/>
                  <div style={{padding:"12px 16px"}}>
                    <div style={{fontSize:"10px",fontWeight:"700",letterSpacing:"1.5px",textTransform:"uppercase",color:t.textMuted,marginBottom:"8px"}}>Method</div>
                    <p style={{color:t.textBody,fontSize:"14px",lineHeight:"1.65",margin:0}}>{recipe.method}</p>
                  </div>
                  {recipe.garnish&&<><div style={{height:"1px",background:t.border,margin:"0 16px"}}/><div style={{padding:"12px 16px 14px"}}><div style={{fontSize:"10px",fontWeight:"700",letterSpacing:"1.5px",textTransform:"uppercase",color:t.textMuted,marginBottom:"6px"}}>Garnish</div><p style={{color:t.textBody,fontSize:"14px",margin:0}}>{recipe.garnish}</p></div></>}
                </div>
              )}
            </div>
          );
        }):(
          <div style={{textAlign:"center",color:t.textMuted,fontSize:"14px",marginTop:"60px"}}>No recipes found.<br/><span style={{fontSize:"12px",color:t.textFaint}}>Try a different search or category.</span></div>
        )}
      </div>

      {isAdmin&&<button onClick={()=>setShowModal(true)} style={{position:"fixed",bottom:"28px",right:"20px",background:t.accent,border:"none",borderRadius:"50%",width:"54px",height:"54px",fontSize:"26px",color:t.accentText,cursor:"pointer",boxShadow:"0 4px 24px rgba(0,0,0,0.4)",display:"flex",alignItems:"center",justifyContent:"center",zIndex:30}} onMouseEnter={e=>e.currentTarget.style.transform="scale(1.08)"} onMouseLeave={e=>e.currentTarget.style.transform="scale(1)"}>+</button>}

      {showModal&&<RecipeModal onSave={handleAdd} onClose={()=>setShowModal(false)} t={t}/>}
      {editingRecipe&&<RecipeModal initial={editingRecipe} onSave={handleEdit} onClose={()=>setEditingRecipe(null)} t={t}/>}
      {adminModal&&<AdminModal mode={adminModal} onClose={()=>setAdminModal(null)} onLogin={handleLogin} onSetPassword={handleSetPassword} onChangePassword={handleChangePassword} onLogout={handleLogout} t={t}/>}
      {lightbox&&<ImageLightbox src={lightbox.src} name={lightbox.name} onClose={()=>setLightbox(null)}/>}
      <Toast message={toast.message} visible={toast.visible}/>
      <style>{`*{box-sizing:border-box;}input::placeholder,textarea::placeholder{color:${t.textFaint};opacity:1;}::-webkit-scrollbar{display:none;}select option{background:#1A1A1A;color:#fff;}`}</style>
    </div>
  );
}
