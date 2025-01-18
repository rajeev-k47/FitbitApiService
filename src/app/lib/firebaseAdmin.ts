import * as admin from 'firebase-admin';

import serviceAccount from '../../../service-account-file.json'; // path to the Firebase service account JSON file

if (!admin.apps.length) {
    admin.initializeApp({
        credential: admin.credential.cert(serviceAccount as admin.ServiceAccount)
    });
}

export const firestore = admin.firestore();
export const auth = admin.auth();
export const messaging = admin.messaging()
