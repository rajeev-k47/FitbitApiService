import { NextResponse } from 'next/server';
import { firestore, messaging } from '@/app/lib/firebaseAdmin';

export async function POST(request: Request) {
    try {
        const { uid ,toId, Message} = await request.json();

        if (!uid ) {
            return NextResponse.json({ error: 'UID is required' }, { status: 400 });
        }


        const fromUserDoc = await firestore.collection('users').doc(uid).get();
        const senderName = fromUserDoc.data()?.username;

        const userDoc = await firestore.collection('users').doc(toId).get();
        console.log(userDoc)
        if (!userDoc.exists) {
            return NextResponse.json({ error: 'User not found' },{ status: 404 });
        }

        const userData = userDoc.data();

        const fcmToken = userData?.fcmToken;

        if (!fcmToken) {
            return NextResponse.json({ error: 'Group owner FCM token not found' }, { status: 404 });
        }
        const message = {
            token: fcmToken,
            notification: {
                title: `New Message from ${senderName}`,
                body: `${Message}`,
            },
            data: {
                uId: uid,
            },
        };
        await messaging.send(message);

        return NextResponse.json({ message: 'Notification sent to user' });

    } catch (error) {
        console.error('Error sending notification:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
