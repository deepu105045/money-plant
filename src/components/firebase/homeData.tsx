
import { db } from './firebaseConfig';
import { collection, doc, setDoc,query, where, getDocs, getDoc  } from 'firebase/firestore';


export const buildHome = async (email: string, homeName: string, members: string[]) => {
    try {
        const familyRef = doc(collection(db, 'family'));
        await setDoc(familyRef, {
            familyId: familyRef.id,
            name: homeName,
            members: members,
            owner: email
        });
        console.log('Home data saved successfully.');
    } catch (error) {
        console.error('Error saving home data:', error);
        throw error;
    }
};

export const fetchUserHomes = async (userEmail: string) => {
    const q = query(collection(db, 'family'), where('members', 'array-contains', userEmail));
    const querySnapshot = await getDocs(q);
    const homes = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    return homes;
};


export const fetchMembersByHome = async (familyId: string) => {
    try {
        const familyDocRef = doc(db, 'family', familyId);
        const familyDoc = await getDoc(familyDocRef);

        if (!familyDoc.exists()) {
            console.log('No such document!');
            return null;
        }

        return familyDoc.data();
    } catch (error) {
        console.error('Error fetching document:', error);
        throw error; 
    }
};