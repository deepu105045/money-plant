import { collection, getDocs, query,  addDoc,doc, deleteDoc,setDoc  } 
      from "firebase/firestore";
import { db } from "./firebaseConfig";



export const addAsset = async (familyId: string, taskObj: any, type: string) => {
  try {
    const ref = collection(db, `assets/${familyId}/${type}`);
    const docRef = await addDoc(ref, { ...taskObj, id: '' });
    const updatedTaskObj = { ...taskObj, id: docRef.id };
    await setDoc(docRef, updatedTaskObj, { merge: true });

    console.log(`${type} data saved successfully with ID:`, docRef.id);
  } catch (error) {
    console.error(`Error saving ${type} data:`, error);
    throw error;
  }
};

export const editAsset = async (familyId: string, taskObj: any, type: string) => {
  try {
    const docRef = doc(db, `assets/${familyId}/${type}/${taskObj.id}`);
    await setDoc(docRef, taskObj, { merge: true });

    console.log(`${type} data updated successfully with ID:`, taskObj.id);
  } catch (error) {
    console.error(`Error updating ${type} data:`, error);
    throw error;
  }
};

export const deleteAsset = async (familyId: string, assetId: string, type: string) => {
  try {
    const docRef = doc(db, `assets/${familyId}/${type}/${assetId}`);
    await deleteDoc(docRef);
    console.log(`${type} asset deleted successfully with ID:`, assetId);
  } catch (error) {
    console.error(`Error deleting ${type} asset:`, error);
    throw error;
  }
};




export const getAssetByType = async (familyId: string, type: string, field: string) => {
  try {
    const ref = collection(db, `assets/${familyId}/${type}`);
    const myQuery = query(ref);
    const querySnapshot = await getDocs(myQuery);

    let totalFieldValue = 0; // Initialize total for the given field
    const accounts = querySnapshot.docs.map(doc => {
      const accountData = doc.data();
      const fieldValue = parseFloat(accountData[field]) || 0; // Dynamically use the field parameter
      totalFieldValue += fieldValue;
      return {
        ...accountData,
        taskId: doc.id,
        total: totalFieldValue
      };
    });

    // Returning accounts and the total for the specified field
    return {
      accounts,
      total: totalFieldValue
    };
  } catch (error) {
    console.error(`Error fetching accounts for field "${field}":`, error);
    throw error;
  }
};



export const getTotalAssets = async (familyId: string, assetTypes: string[]) => {
  try {
    let grandTotal = 0;
    const allAssets = {};

    for (const type of assetTypes) {
      const { accounts, total } = await getAssetByType(familyId, type);
      allAssets[type] = {
        accounts,
        total
      };
      grandTotal += total;
    }

    return {
      assets: allAssets,
      grandTotal
    };
  } catch (error) {
    console.error('Error fetching total assets:', error);
    throw error;
  }
};




