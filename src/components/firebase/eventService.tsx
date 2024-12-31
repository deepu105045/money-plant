import { collection, getDocs, query,  addDoc,doc, deleteDoc,setDoc, where, getDoc  } 
      from "firebase/firestore";
import { db } from "./firebaseConfig";
import {capitalizeFirstLetter} from "../utils/CommonUtils"
const event_names = 'events'
const event_transactions = 'event_transactions'



export const addEventTransaction = async (transactionObj: any) => {
  try {
    // const capitalizedTransactionObj = capitalizeFirstLetter(transactionObj);

    const ref = collection(db, event_transactions);
    const docRef = await addDoc(ref, { ...transactionObj, id: '' }); 
    const updatedTransactionObj = { ...transactionObj, id: docRef.id }; 
    await setDoc(docRef, updatedTransactionObj, { merge: true });
    
    console.log(`Transaction saved successfully with ID:`, docRef.id);
  } catch (error) {
    console.error(`Error saving transaction:`, error);
    throw error;
  }
};


export const addEvent = async (taskObj: any) => {
    try {
      const ref = collection(db, event_names);
      const docRef = await addDoc(ref, { ...taskObj, id: '' });
      const updatedTaskObj = { ...taskObj, id: docRef.id };
      await setDoc(docRef, updatedTaskObj, { merge: true });
  
      console.log(`data saved successfully with ID:`, docRef.id);
    } catch (error) {
      console.error(`Error saving data:`, error);
      throw error;
    }
  };

  export const findEventsByEmail = async (userEmail: string) => {
    try {
      const q = query(collection(db, event_names), where('email', '==', userEmail));
      const querySnapshot = await getDocs(q);
      const events = querySnapshot.docs.map(doc => ({
        id: doc.id,            // Document ID
        ...doc.data()           // Document data (spread)
      }));
      return events;
    } catch (error) {
      console.error("Error fetching events: ", error);
      return [];  
    }
  };



  
  export const getEventTransactionData = async (eventId: string) => {
    try {
      // Reference to the event_transactions collection and filter by eventId
      const transactionsRef = collection(db, 'event_transactions');
      const q = query(transactionsRef, where('eventId', '==', eventId));
      const querySnapshot = await getDocs(q);
  
      const categoryMap: { [key: string]: number } = {};
  
      // Process each document in the result
      querySnapshot.forEach((doc) => {
        const data = doc.data();
  
        if (data.category && data.amount) {
          const category = data.category;
          const amount = parseFloat(data.amount); // Convert amount to a number
  
          // Accumulate amount based on category
          if (categoryMap[category]) {
            categoryMap[category] += amount;
          } else {
            categoryMap[category] = amount;
          }
        }
      });
  
      // Format the result into an array of objects
      const result = Object.keys(categoryMap).map((category) => ({
        category,
        totalAmount: categoryMap[category],
      }));
  
      // Calculate the sum of all totalAmount values
      const totalSum = result.reduce((acc, item) => acc + item.totalAmount, 0);
  
      // Add the total sum as the first element in the result array
      result.unshift({ category: 'Total', totalAmount: totalSum });
  
      return result;
    } catch (error) {
      console.error('Error fetching or processing data:', error);
      throw error;
    }
  };
  