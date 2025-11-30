import { db, dbRef, dbSet, dbPush, dbOnValue } from './firebase.js';

const OWNER_PW = 'admin123';
const addAnnounceBtn = document.getElementById('add-announce');
const announceEditor = document.getElementById('announce-editor');
const unlockBtn = document.getElementById('unlock-btn');
const saveAllBtn = document.getElementById('save-all');

let unlocked = false;
let data = { announcements: [] };

function uid(prefix='id'){ return prefix + '_' + Math.random().toString(36).slice(2,9); }
function escapeHtml(s){ return s ? String(s).replaceAll('&','&amp;').replaceAll('<','&lt;').replaceAll('>','&gt;') : ''; }

function render() {
  announceEditor.innerHTML = '';
  (data.announcements||[]).forEach(a=>{
    const div = document.createElement('div');
    div.className = 'ann-card';
    div.dataset.id = a.id;
    div.innerHTML = `<input class="ann-title" value="${escapeHtml(a.title)}" ${unlocked? '': 'disabled'} /><br/>
      <textarea class="ann-content" ${unlocked? '': 'disabled'}>${escapeHtml(a.content)}</textarea><br/>
      <button class="del-ann" ${unlocked? '': 'disabled'}>Delete</button>
      <button class="send-ann" ${unlocked? '': 'disabled'}>Send Now</button>
      <hr/>`;
    announceEditor.appendChild(div);
  });
}

addAnnounceBtn.addEventListener('click', ()=>{
  const ann = { id: uid('ann'), title: 'New Announcement', content: '', createdAt: Date.now() };
  data.announcements.push(ann);
  render();
});

announceEditor.addEventListener('click', async (e)=>{
  if(e.target.classList.contains('del-ann')){
    const card = e.target.closest('.ann-card'); const id = card.dataset.id;
    data.announcements = data.announcements.filter(x=>x.id!==id); render();
    await saveToDb();
  }
  if(e.target.classList.contains('send-ann')){
    const card = e.target.closest('.ann-card'); const id = card.dataset.id;
    const ann = data.announcements.find(x=>x.id===id);
    if(!ann) return;
    // write to notification node for cloud function to broadcast
    const notifRef = dbRef(db, 'rs_notifications/' + Date.now());
    await dbSet(notifRef, { type:'announcement', id: ann.id, title: ann.title, message: ann.content, createdAt: Date.now() });
    alert('Announcement queued for broadcast');
  }
});

unlockBtn.addEventListener('click', ()=>{
  const pass = document.getElementById('owner-pass').value;
  if(pass === OWNER_PW){
    unlocked = true;
    addAnnounceBtn.disabled = false;
    saveAllBtn.disabled = false;
    unlockBtn.disabled = true;
    render();
    alert('Unlocked');
  } else alert('Wrong password');
});

async function saveToDb(){
  const rootRef = dbRef(db, 'ration_shop/default');
  try{ await dbSet(rootRef, { announcements: data.announcements }); alert('Saved'); }catch(e){ console.error(e); alert('Save failed'); }
}

saveAllBtn.addEventListener('click', async ()=>{ await saveToDb(); });

(async function init(){
  // load existing
  try{
    const rootRef = dbRef(db, 'ration_shop/default');
    dbOnValue(rootRef, snap=>{
      const val = snap.val();
      if(val && val.announcements) data.announcements = val.announcements;
      render();
    });
  }catch(e){ console.warn(e); render(); }
})();
