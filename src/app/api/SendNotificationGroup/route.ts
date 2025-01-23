import { NextResponse } from 'next/server';
import { firestore, messaging } from '@/app/lib/firebaseAdmin';

export async function POST(request: Request) {
    try {
        const { groupId ,senderId, Message} = await request.json();

        if (!groupId || !senderId) {
            return NextResponse.json({ error: 'Group ID is required' }, { status: 400 });
        }
        const userDoc = await firestore.collection('users').doc(senderId).get();
        const username = userDoc.data()?.username;

        const groupDoc = await firestore.collection('users').doc(groupId).get();
        console.log(groupDoc)
        if (!groupDoc.exists) {
            return NextResponse.json({ error: 'User not found' },{ status: 404 });
        }


        const groupData = groupDoc.data();
        const users = groupData?.users as string[];

        if (!users || users.length === 0) {
            return NextResponse.json({ error: 'No users found in the group' }, { status: 404 });
        }
        for (const userId of users) {
            if(userId === senderId) continue;
            const userDoc = await firestore.collection('users').doc(userId).get();
            if (userDoc.exists) {
                const userData = userDoc.data();
                const fcmToken = userData?.fcmToken;
                if (fcmToken) {
                    const message = {
                        token: fcmToken,
                        notification: {
                            title: `New Message ${groupData?.groupData?.organizationName}`,
                            body: `${username} : ${Message}`,
                        },
                        data: {
                            uId: userId,
                        },
                    };
                    await messaging.send(message);
                }
            }
        }



        return NextResponse.json({ message: 'Notification sent to user' });

    } catch (error) {
        console.error('Error sending notification:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
