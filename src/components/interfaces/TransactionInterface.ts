interface Transaction {
    amount: number;
    category: string;
    date: Date;
    familyId: string;
    notes: string;
    paidBy: string;
    transactionId: string;
    type: string; // Can be "Income", "Expense", or "Investment"
}