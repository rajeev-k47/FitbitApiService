import { NextResponse } from 'next/server';
import { firestore, messaging } from '@/app/lib/firebaseAdmin';

export async function POST(request: Request) {
    try {
        const { uid, groupId } = await request.json();

        if (!uid || !groupId) {
            return NextResponse.json({ error: 'UID and Group ID are required' }, { status: 400 });
        }
        const groupDoc = await firestore.collection('users').doc(groupId).get();
        console.log(groupDoc)

        if (!groupDoc.exists) {
            return NextResponse.json({ error: 'Group not found' }, { status: 404 });
        }
        const userDoc = await firestore.collection('users').doc(uid).get();
        console.log(userDoc)
        if (!userDoc.exists) {
            return NextResponse.json({ error: 'User not found' },{ status: 404 });
        }

        const groupData = groupDoc.data();

        const fcmToken = groupData?.fcmToken;

        if (!fcmToken) {
            return NextResponse.json({ error: 'Group owner FCM token not found' }, { status: 404 });
        }
        const message = {
            token: fcmToken,
            notification: {
                title: 'New Joining Request',
                body: `You have a new joining request pending from  ${userDoc.get("username")}.`,
            },
            data: {
                uId: uid,
            },
        };
        await messaging.send(message);

        return NextResponse.json({ message: 'Notification sent to group owner' });

    } catch (error) {
        console.error('Error sending notification:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
