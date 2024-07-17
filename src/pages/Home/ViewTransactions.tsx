import React, { useState, useEffect } from 'react';
import { IonContent, IonList, IonItem, IonLabel, IonSpinner, IonIcon, IonButton, IonAlert } from '@ionic/react';
import { getTransactions, deleteTransaction } from '../../components/firebase/finance';
import { arrowUpCircleOutline, arrowDownCircleOutline, walletOutline, trash } from 'ionicons/icons';

// Define Transaction interface
interface Transaction {
    date: Date;
    amount: number;
    category: string;
    type: string;
    paidBy: string;
    familyId: string;
    transactionId: string;
}

// Define Props interface
interface Props {
    familyId: string;
    year: number;
    month: number;
}

const ViewTransactions: React.FC<Props> = ({ familyId, year, month }) => {
    const [transactions, setTransactions] = useState<Transaction[]>([]);
    const [loading, setLoading] = useState(true);
    const [showAlert, setShowAlert] = useState(false);
    const [transactionToDelete, setTransactionToDelete] = useState<Transaction | null>(null);

    useEffect(() => {
        const fetchTransactions = async () => {
            setLoading(true);
            try {
                const fetchedTransactions = await getTransactions(familyId, year, month);
                setTransactions(fetchedTransactions);
            } catch (error) {
                console.error('Error fetching transactions:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchTransactions();
    }, [familyId, month, year]);

    const formatDate = (date: Date) => {
        const day = date.getDate();
        const month = date.getMonth() + 1; // getMonth() returns month from 0 to 11
        const year = date.getFullYear();
        return `${day}/${month}/${year}`;
    };

    const getIcon = (type: string) => {
        switch (type.toLowerCase()) {
            case 'spending':
                return {
                    icon: arrowDownCircleOutline,
                    color: 'red'
                };
            case 'income':
                return {
                    icon: arrowUpCircleOutline,
                    color: 'green'
                };
            case 'investment':
                return {
                    icon: walletOutline,
                    color: 'blue'
                };
            default:
                return {
                    icon: walletOutline,
                    color: 'black'
                };
        }
    };

    const handleDelete = async (transaction: Transaction) => {
        try {
            await deleteTransaction(familyId, year, month, transaction.transactionId);
            setTransactions(transactions.filter(t => t.transactionId !== transaction.transactionId));
        } catch (error) {
            console.error('Error deleting transaction:', error);
        }
    };

    const onDelete = (transaction: Transaction) => {
        setTransactionToDelete(transaction);
        setShowAlert(true);
    };

    return (
        <IonContent>
            {loading ? (
                <IonSpinner />
            ) : (
                <IonList>
                    {transactions.map((transaction, index) => (
                        <IonItem key={index} className={`transaction-item ${transaction.type.toLowerCase()}`}>
                            <IonLabel className="transaction-category">
                                <strong>{transaction.category}</strong>
                                <p>{transaction.paidBy}</p>
                            </IonLabel>
                            <IonIcon
                                icon={getIcon(transaction.type).icon}
                                style={{ color: getIcon(transaction.type).color }}
                                className="transaction-icon"
                            />
                            <IonLabel className="transaction-details">
                                <p className="transaction-date">{formatDate(transaction.date)}</p>
                                <p className="transaction-amount">₹{transaction.amount}</p>
                            </IonLabel>
                            <IonButton fill="clear" slot="end" onClick={() => onDelete(transaction)}>
                                <IonIcon icon={trash} />
                            </IonButton>
                        </IonItem>
                    ))}
                </IonList>
            )}
            <IonAlert
                isOpen={showAlert}
                onDidDismiss={() => setShowAlert(false)}
                header={'Confirm Delete'}
                message={'Are you sure you want to delete this transaction?'}
                buttons={[
                    {
                        text: 'Cancel',
                        role: 'cancel',
                        handler: () => {
                            setShowAlert(false);
                            setTransactionToDelete(null);
                        }
                    },
                    {
                        text: 'Delete',
                        handler: () => {
                            if (transactionToDelete) {
                                handleDelete(transactionToDelete);
                                setTransactionToDelete(null);
                            }
                        }
                    }
                ]}
            />
        </IonContent>
    );
};

export default ViewTransactions;
