// src/components/BankDetailsForm.tsx
import React, { useState } from 'react';
import { TextField, FormControl, FormLabel, RadioGroup, FormControlLabel, Radio, Button } from '@mui/material';
import { BANK } from '../../components/utils/Constants';

interface BankDetailsFormProps {
    onSubmit: (data: any) => void;
}

const BankDetailsForm: React.FC<BankDetailsFormProps> = ({ onSubmit }) => {
    // Get today's date in YYYY-MM-DD format
    const today = new Date().toISOString().split('T')[0];

    const [accountHolderName, setAccountHolderName] = useState('');
    const [bankName, setBankName] = useState('');
    const [accountNumber, setAccountNumber] = useState('');
    const [accountType, setAccountType] = useState<string | null>(null);
    const [amount, setAmount] = useState('');
    const [date, setDate] = useState<string | null>(today); // Default to today's date

    const handleSave = () => {

        const formData = {
            accountHolderName,
            bankName,
            accountNumber,
            accountType,
            amount,
            date,
            assetType:BANK
        };
        onSubmit(formData); // Call the parent-provided onSubmit function
    };

    return (
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
                    row // Displays the radio buttons in a single line
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
            <TextField
                fullWidth
                label="As of"
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                InputLabelProps={{ shrink: true }}
                margin="normal"
                variant="outlined"
            />
            <Button variant="contained" color="primary" onClick={handleSave} style={{ marginTop: '20px' }}>
                Save
            </Button>
        </form>
    );
};

export default BankDetailsForm;
