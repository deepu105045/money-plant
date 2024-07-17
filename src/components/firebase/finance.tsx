    import { collection, query, orderBy, getDocs, DocumentSnapshot, addDoc, doc, updateDoc, DocumentData, DocumentReference, deleteDoc, FirestoreError, onSnapshot } from 'firebase/firestore';
    import { db } from './firebaseConfig'; // Assuming you have a firebaseConfig file

    export const getTransactions = async (familyId: string, year: number, month: number): Promise<any[]> => {
        try {
            const transactionsRef = collection(db, `cashflow/${familyId}/${year}/${month}/transactions`);
            const q = query(transactionsRef, orderBy('date', 'desc')); // Ordering by 'date' in descending order
            const querySnapshot = await getDocs(q);
            const transactions: any[] = [];
            querySnapshot.forEach((doc: DocumentSnapshot) => {
                const data = doc.data();
                if (data.date && data.date.seconds) {
                    data.date = new Date(data.date.seconds * 1000 + data.date.nanoseconds / 1000000);
                }
                transactions.push(data);

            });
            return transactions;
        } catch (error: any) {
            console.error('Error getting transactions:', error.message || error);
            throw new Error('Error getting transactions');
        }
    };


    export const addTransactions = async (familyId: string, year: number, month: number, data: any): Promise<void> => {
        try {
            const transactionsRef = collection(db, `cashflow/${familyId}/${year}/${month}/transactions`);
            const docRef = await addDoc(transactionsRef, data);
            const transactionId = docRef.id;
            
            // Update the document with its own ID
            await updateDoc(doc(db, `cashflow/${familyId}/${year}/${month}/transactions/${transactionId}`), {
                transactionId: transactionId,
                familyId: familyId
            });
            
            console.log('Transaction added successfully.');
        } catch (error: any) {
            console.error('Error adding transaction:', error.message || error);
            throw new Error('Error adding transaction');
        }
    };

    export const calculateSumsByType = (familyId: string, year: number, month: number, callback: (sumsByType: Record<string, number>) => void) => {
        const transactionsRef = collection(db, 'cashflow', familyId, `${year}`, `${month}`, 'transactions');
        const q = query(transactionsRef);

        return onSnapshot(q, (querySnapshot) => {
            const sumsByType = querySnapshot.docs.reduce((acc, doc) => {
                const data = doc.data();
                const type = data.type;
                const amount = data.amount;

                if (!acc[type]) {
                    acc[type] = 0;
                }

                acc[type] += amount;
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
        const transactionsRef = collection(db, `cashflow/${familyId}/${year}/${month}/transactions`);
        const q = query(transactionsRef);

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

            callback(result);
        }, (error: FirestoreError) => {
            console.error("Error grouping transactions by type and category:", error);
        });
    };

    export const deleteTransaction = async (familyId: string, year: number, month: number, transactionId: string): Promise<void> => {
        try {
            const transactionRef = doc(db, `cashflow/${familyId}/${year}/${month}/transactions/${transactionId}`);
            await deleteDoc(transactionRef);
            console.log('Transaction deleted successfully.');
        } catch (error: any) {
            console.error('Error deleting transaction:', error.message || error);
            throw new Error('Error deleting transaction');
        }
    };


