import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';

admin.initializeApp({
    credential: admin.credential.cert(require('../key/admin.json'))
});

export const getFeed = functions.https.onRequest(async (req, res) => {
    const docs = await admin.firestore().collection('posts').get()
    res.send(docs.docs.map(doc => doc.data()))
})