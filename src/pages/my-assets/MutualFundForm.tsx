import React, { useState } from 'react';
import { Box, Button, TextField, Typography } from '@mui/material';
import { MF } from '../../components/utils/Constants'

interface MutualFundDetails {
    accountHolderName: string;
    date: string;
    invested: string;
    amount: string;
}

interface MutualFundFormProps {
    onSubmit: (details: MutualFundDetails) => void;
    title: string;  // Added title prop
}

const MutualFundForm: React.FC<MutualFundFormProps> = ({ onSubmit, title ,assetType}) => {  // Destructure title prop
    const [accountHolderName, setAccountHolderName] = useState('');
    const [date, setDate] = useState('');
    const [invested, setInvested] = useState('');
    const [amount, setAmount] = useState('');

    const handleSubmit = () => {

        if (accountHolderName && amount) {
            onSubmit({ accountHolderName, date, invested, amount, assetType });
        }
    };

    return (
        <Box component="form" noValidate autoComplete="off" sx={{ p: 2, display: 'flex', flexDirection: 'column', gap: 2 }}>
            <Typography variant="h6" component="h2" gutterBottom>
                {title}  {/* Use title prop here */}
            </Typography>
            <TextField
                label="Account Holder Name"
                value={accountHolderName}
                onChange={(e) => setAccountHolderName(e.target.value)}
                fullWidth
            />
            <TextField
                label="Date"
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                InputLabelProps={{
                    shrink: true,
                }}
                fullWidth
            />
            <TextField
                label="Total Amount Invested"
                type="number"
                value={invested}
                onChange={(e) => setInvested(e.target.value)}
                fullWidth
            />
            <TextField
                label="Current Value"
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                fullWidth
            />
            <Button variant="contained" color="primary" onClick={handleSubmit}>
                Save
            </Button>
        </Box>
    );
};

export default MutualFundForm;
