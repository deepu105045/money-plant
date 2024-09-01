import { collection, getDocs, query,  addDoc } 
      from "firebase/firestore";
import { db } from "./firebaseConfig";



export const addAsset = async (familyId: string,  taskObj: any,type: string) => {
  try {
    const ref = collection(db, `assets/${familyId}/${type}`);
    const docRef = await addDoc(ref, taskObj);
    console.log(`${type} data saved successfully with ID:`, docRef.id);
  } catch (error) {
    console.error(`Error saving ${type} data:`, error);
    throw error;
  }
};




export const getAssetByType = async (familyId: string , type: string) => {
  try {
    const ref = collection(db, `assets/${familyId}/${type}`);
    const myQuery = query(ref);
    const querySnapshot = await getDocs(myQuery);
    let totalAmount = 0;
    const accounts = querySnapshot.docs.map(doc => {
      const accountData = doc.data();
      const amount = parseFloat(accountData.amount) || 0; 
      totalAmount += amount;
      return {
        ...accountData,
        taskId: doc.id,
              total: totalAmount

      };
    });
    // Adding the total amount to the result
    return {
      accounts,
      total: totalAmount
    };
  } catch (error) {
    console.error('Error fetching  accounts:', error);
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




