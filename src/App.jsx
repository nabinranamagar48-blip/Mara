import { useState, useEffect, useCallback, useRef } from "react";
import { dbLoad, dbSave, dbSubscribe, loadAdminPw, saveAdminPw } from "./firebase.js";
import { CATEGORY_COLORS, CATEGORIES, THEMES, DEFAULT_RECIPES, BLANK_FORM, getDailyTip, parseIngredient, simpleHash } from "./constants.js";

function Toast({ message, visible }) {
  return <div style={{position:"fixed",bottom:"24px",left:"50%",transform:`translateX(-50%) translateY(${visible?0:"12px"})`,background:"#333",color:"#fff",padding:"10px 20px",borderRadius:"8px",fontSize:"13px",opacity:visible?1:0,transition:"all 0.2s ease",pointerEvents:"none",zIndex:200,whiteSpace:"nowrap",boxShadow:"0 4px 20px rgba(0,0,0,0.4)"}}>{message}</div>;
}

function ThemeToggle({ isDark, onToggle }) {
  return <button onClick={onToggle} style={{background:"none",border:"none",cursor:"pointer",padding:"6px",color:isDark?"#888":"#555",fontSize:"18px",lineHeight:1}}>{isDark?"☀":"☾"}</button>;
}

function ImageLightbox({ src, name, onClose }) {
  useEffect(()=>{ const h=(e)=>{ if(e.key==="Escape") onClose(); }; window.addEventListener("keydown",h); return ()=>window.removeEventListener("keydown",h); },[onClose]);
  return (
    <div onClick={onClose} style={{position:"fixed",inset:0,background:"rgba(0,0,0,0.93)",zIndex:150,display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",padding:"20px"}}>
      <div onClick={e=>e.stopPropagation()} style={{maxWidth:"90vw",maxHeight:"80vh",display:"flex",flexDirection:"column",alignItems:"center",gap:"14px"}}>
        <img src={src} alt={name} style={{maxWidth:"100%",maxHeight:"70vh",borderRadius:"12px",objectFit:"contain"}}/>
        <div style={{color:"#fff",fontSize:"16px",fontWeight:"700"}}>{name}</div>
      </div>
      <button onClick={onClose} style={{position:"fixed",top:"20px",right:"20px",background:"rgba(255,255,255,0.12)",border:"none",borderRadius:"50%",width:"40px",height:"40px",color:"#fff",fontSize:"20px",cursor:"pointer"}}>✕</button>
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
              <div style={{position:"relative",width:"100%"}}>
                <img src={form.image} alt="preview" style={{width:"100%",maxHeight:"180px",objectFit:"cover",borderRadius:"10px",border:`1px solid ${t.border}`,display:"block"}}/>
                <button onClick={()=>sf("image","")} style={{position:"absolute",top:"8px",right:"8px",background:"rgba(0,0,0,0.6)",border:"none",borderRadius:"50%",width:"28px",height:"28px",color:"#fff",fontSize:"14px",cursor:"pointer"}}>✕</button>
              </div>
            ):(
              <label style={{display:"block",cursor:"pointer"}}>
                <div style={{background:t.surface2,border:`1.5px dashed ${t.border}`,borderRadius:"10px",padding:"20px",textAlign:"center",color:t.textMuted,fontSize:"13px"}}>📷 Tap to upload photo</div>
                <input type="file" accept="image/*" style={{display:"none"}} onChange={e=>{ const file=e.target.files[0]; if(!file) return; const reader=new FileReader(); reader.onload=ev=>sf("image",ev.target.result); reader.readAsDataURL(file); }}/>
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
    const unsub=dbSubscribe((list)=>{ const s=JSON.stringify(list); if(s!==lastRef.current){lastRef.current=s;setRecipes(list);showToast("↻ Menu updated");} });
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
      <div style={{position:"sticky",top:0,background:t.bg,zIndex:20,borderBottom:`1px solid ${t.border}`}}>
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
