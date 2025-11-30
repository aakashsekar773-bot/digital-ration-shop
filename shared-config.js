const firebaseConfig = {
  apiKey: "AIzaSyDd-tU2V_wV2lwaX3_AkdDZZf3c-rA54VE",
  authDomain: "new-idea-1f401.firebaseapp.com",
  databaseURL: "https://new-idea-1f401-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "new-idea-1f401",
  storageBucket: "new-idea-1f401.firebasestorage.app",
  messagingSenderId: "34069771276",
  appId: "1:34069771276:web:7af73f0e682f5d8b806a29",
  measurementId: "G-C7RR1MWT9V"
};
firebase.initializeApp(firebaseConfig);
const rdb = firebase.database();

function todayKey() {
  let d = new Date();
  return d.getFullYear() + '-' + (d.getMonth()+1) + '-' + d.getDate();
}

function localKey(){
  return 'rs_tokens_'+todayKey();
}

function loadLocalDB(){
  try {
    const raw = localStorage.getItem(localKey());
    if(raw) {
      const parsed = JSON.parse(raw);
      if (typeof parsed.lastTicket !== 'number') parsed.lastTicket = 0;
      if (!Array.isArray(parsed.tokens)) parsed.tokens = [];
      return parsed;
    }
  } catch(e){}
  return { lastTicket: 0, tokens: [] };
}

function saveLocalDB(db){
  try {
    if (typeof db.lastTicket !== 'number') db.lastTicket = 0;
    if (!Array.isArray(db.tokens)) db.tokens = [];
    localStorage.setItem(localKey(), JSON.stringify(db));
  } catch(e){}
}

function playDing(){ try { document.getElementById("ding")?.play(); }catch(e){} }
function playCallingSound(){ try { const callingSound = document.getElementById("callingSound"); if(callingSound){ callingSound.currentTime=0; callingSound.play().catch(()=>{});} }catch(e){} }
function speakToken(number){ if("speechSynthesis" in window){ let msg = new SpeechSynthesisUtterance("Token number " + number + ". Please come to the counter."); window.speechSynthesis.cancel(); window.speechSynthesis.speak(msg); } }
