const functions = require('firebase-functions');
const admin = require('firebase-admin');
admin.initializeApp();
const DB = admin.database();

exports.sendAnnouncementOnCreate = functions.database
  .ref('/rs_notifications/{pushId}')
  .onCreate(async (snapshot, context) => {
    const payload = snapshot.val();
    if(!payload) return null;
    const message = {
      notification: {
        title: payload.title || 'Announcement',
        body: payload.message || ''
      },
      data: {
        type: payload.type || 'announcement',
        id: payload.id || '',
        message: payload.message || ''
      }
    };
    const tokensSnap = await DB.ref('fcm_tokens').once('value');
    const tokensObj = tokensSnap.val() || {};
    const tokens = Object.keys(tokensObj);
    if(tokens.length === 0) return null;
    const chunkSize = 450;
    for(let i=0;i<tokens.length;i+=chunkSize){
      const chunk = tokens.slice(i, i+chunkSize);
      try {
        await admin.messaging().sendMulticast({ tokens: chunk, notification: message.notification, data: message.data });
      } catch(err){ console.error('send error', err); }
    }
    return null;
  });
    
