let DB = loadLocalDB();
let remoteRef = rdb.ref("rs_tokens/" + todayKey());
let warningTimers = {};
const loginBox = document.getElementById("login");
const panel = document.getElementById("panel");
const nowServingEl = document.getElementById("nowServing");
const queueEl = document.getElementById("queue");

function render(){
  let serving = (DB.tokens||[]).find(t=>t.status==="serving");
  nowServingEl.textContent = serving ? serving.ticket : "—";
  queueEl.innerHTML = '';
  (DB.tokens||[]).filter(t=>t.status=='open').forEach(t=> queueEl.innerHTML += `<div>${t.ticket} • ${t.name||'Guest'}</div>`);
}

remoteRef.on("value", snap=>{
  if(snap.val()){
    DB = snap.val();
    saveLocalDB(DB);
    render();
  }
});

document.getElementById("loginBtn").onclick = ()=>{
  if(document.getElementById("pass").value=="1234"){
    loginBox.style.display="none";
    panel.style.display="block";
    render();
  } else alert("Wrong password");
};

document.getElementById("nextBtn").onclick = ()=>{
  let pending = DB.tokens.filter(t=>t.status=="open").sort((a,b)=>a.ticket-b.ticket);
  if(!pending.length){ alert("No pending"); return; }
  let next = pending[0];
  DB.tokens.forEach(t=>{ if(t.ticket==next.ticket) t.status='serving'; else if(t.status=='serving') t.status='open'; });
  saveLocalDB(DB);
  remoteRef.set(DB);
  // send rs_voice_messages entry for that token
  const vref = rdb.ref("rs_voice_messages/" + todayKey() + "/" + next.ticket);
  vref.set({ token: next.ticket, message: 'Your token is called', tamilMessage: 'உங்கள் டோக்கன் அழைக்கப்படுகிறது', timestamp: Date.now() });
  setTimeout(()=> vref.remove(), 10000);
  render();
};

document.getElementById("callBtn").onclick = ()=>{
  let cur = DB.tokens.find(t=>t.status=="serving");
  if(!cur){ alert("No current"); return; }
  const vref = rdb.ref("rs_voice_messages/" + todayKey() + "/" + cur.ticket);
  vref.set({ token: cur.ticket, message: 'Called again', tamilMessage: 'மீண்டும் அழைக்கப்படுகிறது', timestamp: Date.now() });
  setTimeout(()=> vref.remove(), 10000);
};
