import React, { useState } from 'react';
import {
    IonModal,
    IonHeader,
    IonToolbar,
    IonTitle,
    IonButtons,
    IonButton,
    IonIcon,
    IonContent,
} from '@ionic/react';
import { arrowBack } from 'ionicons/icons';
import { TextField, FormControl, FormLabel, RadioGroup, FormControlLabel, Radio, Button } from '@mui/material';

interface AddBankAccountFormProps {
    isOpen: boolean;
    onClose: () => void;
    onAddAccount: (account: any) => Promise<void>;
}

const BankAccountForm: React.FC<AddBankAccountFormProps> = ({ isOpen, onClose, onAddAccount }) => {
    const [accountHolderName, setAccountHolderName] = useState('');
    const [bankName, setBankName] = useState('');
    const [accountNumber, setAccountNumber] = useState('');
    const [accountType, setAccountType] = useState('');
    const [amount, setAmount] = useState('');

    const handleFormSubmit = async () => 
        {
            const newAccount = {
                accountHolderName,
                bankName,
                accountNumber,
                accountType,
                amount,
                assetType: 'BANK',
            };
            console.log('Add Bank account form', newAccount);
            await onAddAccount(newAccount); // Pass newAccount to the parent component
        
            // Reset form fields
            setAccountHolderName('');
            setBankName('');
            setAccountNumber('');
            setAccountType('');
            setAmount('');
        };
        

    return (
        <IonModal isOpen={isOpen} onDidDismiss={onClose}>
            <IonHeader>
                <IonToolbar>
                    <IonButtons slot="start">
                        <IonButton onClick={onClose}>
                            <IonIcon icon={arrowBack} />
                        </IonButton>
                    </IonButtons>
                    <IonTitle>Add Bank Account</IonTitle>
                </IonToolbar>
            </IonHeader>

            <IonContent>
                <div style={{ padding: '16px' }}>
                    <form noValidate autoComplete="off">
                        <TextField
                            fullWidth
                            label="Account Holder Name"
                            value={accountHolderName}
                            onChange={(e) => setAccountHolderName(e.target.value)}
                            margin="normal"
                            variant="outlined"
                        />
                        <TextField
                            fullWidth
                            label="Bank Name"
                            value={bankName}
                            onChange={(e) => setBankName(e.target.value)}
                            margin="normal"
                            variant="outlined"
                        />
                        <TextField
                            fullWidth
                            label="Account Number"
                            value={accountNumber}
                            onChange={(e) => setAccountNumber(e.target.value)}
                            margin="normal"
                            variant="outlined"
                        />
                        <FormControl component="fieldset" margin="normal">
                            <FormLabel component="legend">Type of Account</FormLabel>
                            <RadioGroup
                                row
                                value={accountType}
                                onChange={(e) => setAccountType(e.target.value)}
                            >
                                <FormControlLabel value="savings" control={<Radio />} label="Savings" />
                                <FormControlLabel value="current" control={<Radio />} label="Current" />
                                <FormControlLabel value="fd" control={<Radio />} label="FD" />
                            </RadioGroup>
                        </FormControl>
                        <TextField
                            fullWidth
                            label="Amount"
                            type="number"
                            value={amount}
                            onChange={(e) => setAmount(e.target.value)}
                            margin="normal"
                            variant="outlined"
                        />

                        <Button
                            variant="contained"
                            color="primary"
                            onClick={handleFormSubmit}
                            style={{ marginTop: '20px' }}
                        >
                            ADD account
                        </Button>
                    </form>
                </div>
            </IonContent>
        </IonModal>
    );
};

export default BankAccountForm;
