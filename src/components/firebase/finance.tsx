    import { collection, query, orderBy, getDocs, DocumentSnapshot, addDoc, doc, updateDoc, DocumentData, DocumentReference, deleteDoc, FirestoreError, onSnapshot, where } from 'firebase/firestore';
    import { db } from './firebaseConfig'; // Assuming you have a firebaseConfig file

    export const getTransactions = async (familyId: string, year: number, month: number): Promise<any[]> => {
       console.log(month)
        try {
            const transactionsRef = collection(db, `cashflowNew/${familyId}/transactions`);
            
            // Start and end date for the given month
            const startDate = new Date(year, month - 1, 1); // month is 0-based in JavaScript Date
            const endDate = new Date(year, month, 0); // Last day of the previous month as end of range
    
            const q = query(
                transactionsRef,
                where('date', '>=', startDate),
                where('date', '<', new Date(year, month, 1)), // Exclusive of the first day of the next month
                orderBy('date', 'desc')
            );
    
            const querySnapshot = await getDocs(q);
            const transactions: any[] = [];
            querySnapshot.forEach((doc: DocumentSnapshot) => {
                const data = doc.data();
                if (data && data.date && data.date.seconds) {
                    data.date = new Date(data.date.seconds * 1000 + data.date.nanoseconds / 1000000);
                }
                if (data) {
                    transactions.push(data);
                }
            });
            return transactions;
        } catch (error: any) {
            console.error('Error getting transactions:', error.message || error);
            throw new Error('Error getting transactions');
        }
    };

    export const addTransactions = async (familyId: string, year: number, month: number, data: any): Promise<void> => {
        try {
            // Path: cashflowNew/{familyId}/transactions
            const transactionsRef = collection(db, `cashflowNew/${familyId}/transactions`);
            const docRef = await addDoc(transactionsRef, data);
            const transactionId = docRef.id;
    
            // Update the document with its own ID
            await updateDoc(doc(db, `cashflowNew/${familyId}/transactions/${transactionId}`), {
                transactionId: transactionId,
                familyId: familyId
            });
    
            console.log('Transaction added successfully.');
        } catch (error: any) {
            console.error('Error adding transaction:', error.message || error);
            throw new Error('Error adding transaction');
        }
    };

    export const calculateSumsByType = (
        familyId: string,
        year: number,
        month: number,
        callback: (sumsByType: Record<string, number>) => void
    ) => {
        const transactionsRef = collection(db, 'cashflowNew', familyId, 'transactions');
        
        // Define the start and end dates for the given month
        const startDate = new Date(year, month - 1, 1);
        const endDate = new Date(year, month, 1); // Start of the next month
    
        const q = query(
            transactionsRef,
            where('date', '>=', startDate),
            where('date', '<', endDate)
        );
    
        return onSnapshot(q, (querySnapshot) => {
            const sumsByType: Record<string, number> = querySnapshot.docs.reduce((acc: Record<string, number>, doc) => {
                const data = doc.data();
                const type = data.type;
                const amount = data.amount;
    
                if (typeof type === 'string' && typeof amount === 'number') {
                    if (!acc[type]) {
                        acc[type] = 0;
                    }
    
                    acc[type] += amount;
                }
    
                return acc;
            }, {});
    
            callback(sumsByType);
        }, (error: FirestoreError) => {
            console.error("Error calculating sums by type:", error);
        });
    };


    export const groupTransactionByTypeAndCategory = (
        familyId: string,
        year: number,
        month: number,
        callback: (groupedData: Record<string, Record<string, number>>) => void
    ) => {
        const transactionsRef = collection(db, 'cashflowNew', familyId, 'transactions');
    
        // Define the start and end dates for the given month
        const startDate = new Date(year, month - 1, 1);
        const endDate = new Date(year, month, 1); // Start of the next month
    
        const q = query(
            transactionsRef,
            where('date', '>=', startDate),
            where('date', '<', endDate)
        );
    
        return onSnapshot(q, (querySnapshot) => {
            const transactions = querySnapshot.docs.map(doc => doc.data());
    
            // Process the transactions to group by type and category and sum amounts
            const result = transactions.reduce((acc, transaction) => {
                const { type, category, amount } = transaction;
    
                if (!acc[type]) {
                    acc[type] = {};
                }
    
                if (!acc[type][category]) {
                    acc[type][category] = 0;
                }
    
                acc[type][category] += amount;
    
                return acc;
            }, {} as Record<string, Record<string, number>>);
    
            // Sort the grouped data by amount in descending order
            const sortedResult = Object.keys(result).reduce((acc, type) => {
                acc[type] = Object.entries(result[type])
                    .sort((a, b) => b[1] - a[1]) // Sort by amount in descending order
                    .reduce((obj, [category, amount]) => {
                        obj[category] = amount;
                        return obj;
                    }, {} as Record<string, number>);
                return acc;
            }, {} as Record<string, Record<string, number>>);
    
            callback(sortedResult);
        }, (error: FirestoreError) => {
            console.error("Error grouping transactions by type and category:", error);
        });
    };
    
    export const deleteTransaction = async (familyId: string, year: number, month: number, transactionId: string): Promise<void> => {
        try {
            // The collection path is updated to 'cashflowNew'
            const transactionRef = doc(db, `cashflowNew/${familyId}/transactions`, transactionId);
            await deleteDoc(transactionRef);
            console.log('Transaction deleted successfully.');
        } catch (error: any) {
            console.error('Error deleting transaction:', error.message || error);
            throw new Error('Error deleting transaction');
        }
    };


  
    export const migrateData = async (familyId:string) => {
        try {
            const startYear = 2021;
            const currentYear = new Date().getFullYear();
    
            for (let year = startYear; year <= currentYear; year++) {
                for (let month = 1; month <= 12; month++) {
                    const oldTransactionsRef = collection(db, `cashflow/${familyId}/${year}/${month}/transactions`);
                    const q = query(oldTransactionsRef);
                    const querySnapshot = await getDocs(q);
    
                    for (const doc of querySnapshot.docs) {
                        const data = doc.data();
                        
                        // Move data to new structure
                        const newTransactionsRef = collection(db, `cashflowNew/${familyId}/transactions`);
                        await addDoc(newTransactionsRef, data);
    
                        // Optionally, delete the old document
                        // await deleteDoc(doc.ref);
                    }
                }
            }
    
            console.log('Data migration completed successfully.');
        } catch (error) {
            console.error('Error during data migration:', error);
        }
    };