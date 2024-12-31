import { collection, query, orderBy, getDocs, DocumentSnapshot, addDoc, doc, updateDoc, DocumentData, DocumentReference, deleteDoc, FirestoreError, onSnapshot, arrayUnion, getDoc } from 'firebase/firestore';
import { db } from './firebaseConfig'; // Assuming you have a firebaseConfig file


export const addCategoryToConfig = async (familyId: string, category: string): Promise<void> => {
    try {
      const configDocRef = doc(db, 'config', familyId);
      await updateDoc(configDocRef, {
        categories: arrayUnion(category)
      });
      console.log(`Category "${category}" added successfully.`);
    } catch (error) {
      console.error('Error adding category to config:', error);
      throw error;
    }
  };

  export const getAllCategories = async (): Promise<string[]> => {
    try {
      const configDocRef = doc(db, 'config', 'cashflow');
      const docSnapshot = await getDoc(configDocRef);
      
      if (docSnapshot.exists()) {
        const data = docSnapshot.data();
        return data?.categories || []; // Return categories if available, or an empty array if not
      } else {
        console.log('No document found at /config/cashflow');
        return [];
      }
    } catch (error) {
      console.error('Error fetching categories:', error);
      throw error;
    }
  };


// export const getCategoriesByFamilyId = (familyId: string, searchString: string, callback: (categories: string[]) => void) => {
//   try {
//     // Reference to the specific document in the 'config' collection
//     const configDocRef = doc(db, 'config', familyId);
    
//     // Subscribe to the document snapshot
//     const unsubscribe = onSnapshot(configDocRef, (docSnapshot) => {
//       // Check if the document exists and has a 'categories' field
//       if (docSnapshot.exists()) {
//         const data = docSnapshot.data();
//         const categories: string[] = data?.categories || [];
        
//         // Convert search string to lowercase for case-insensitive matching
//         const lowercasedSearchString = searchString.toLowerCase();
        
//         // Filter categories based on the searchString
//         const filteredCategories = categories.filter(category => 
//           category.toLowerCase().includes(lowercasedSearchString)
//         );
        
//         // Invoke the callback with the filtered categories
//         callback(filteredCategories);
//       } else {
//         console.log(`No document found for familyId: ${familyId}`);
//         callback([]); // Return an empty array if no document is found
//       }
//     });

//     // Return the unsubscribe function to stop listening when needed
//     return unsubscribe;
//   } catch (error) {
//     console.error('Error fetching categories:', error);
//     throw error;
//   }
// };



export const getCategoriesByFamilyId = async (familyId: string, searchString: string): Promise<string[]> => {
  try {
    const configDocRef = doc(db, 'config', familyId);    
    const docSnapshot = await getDoc(configDocRef);    
    if (docSnapshot.exists()) {
      const data = docSnapshot.data();
      const categories: string[] = data?.categories || [];      
      const lowercasedSearchString = searchString.toLowerCase();      
      return categories.filter(category => 
        category.toLowerCase().includes(lowercasedSearchString)
      );
    } else {
      console.log(`No document found for familyId: ${familyId}`);
      return []; // Return an empty array if no document is found
    }
  } catch (error) {
    console.error('Error fetching categories:', error);
    throw error; // Optionally rethrow the error if needed
  }
};



export const getPopularCategories = async (type: 'popular-income' | 'popular-spending' | 'popular-investment') => {
  try {
      // Reference to the 'cashflow' document in the 'config' collection
      const docRef = doc(db, "config", "cashflow");
      
      // Fetch the document snapshot
      const docSnap = await getDoc(docRef);

      // Check if the document exists and retrieve the appropriate field based on the type
      if (docSnap.exists()) {
          const data = docSnap.data();
          return data[type] || []; // Return the array of categories or an empty array if the field is undefined
      } else {
          console.log("No such document!");
          return [];
      }
  } catch (error) {
      console.error("Error fetching data: ", error);
      return [];
  }
};