import React, { useState } from 'react';
import { Box, Button, TextField, Typography } from '@mui/material';

interface MutualFundDetails {
    accountHolderName: string;
    date: string;
    totalInvested: string;
    currentValue: string;
}

interface MutualFundFormProps {
    onSubmit: (details: MutualFundDetails) => void;
}

const MutualFundForm: React.FC<MutualFundFormProps> = ({ onSubmit }) => {
    const [accountHolderName, setAccountHolderName] = useState('');
    const [date, setDate] = useState('');
    const [totalInvested, setTotalInvested] = useState('');
    const [currentValue, setCurrentValue] = useState('');

    const handleSubmit = () => {
        if (accountHolderName && date && totalInvested && currentValue) {
            onSubmit({ accountHolderName, date, totalInvested, currentValue });
        }
    };

    return (
        <Box component="form" noValidate autoComplete="off" sx={{ p: 2, display: 'flex', flexDirection: 'column', gap: 2 }}>
            <Typography variant="h6" component="h2" gutterBottom>
                Add Mutual Fund Details
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
                value={totalInvested}
                onChange={(e) => setTotalInvested(e.target.value)}
                fullWidth
            />
            <TextField
                label="Current Value"
                type="number"
                value={currentValue}
                onChange={(e) => setCurrentValue(e.target.value)}
                fullWidth
            />
            <Button variant="contained" color="primary" onClick={handleSubmit}>
                Save
            </Button>
        </Box>
    );
};

export default MutualFundForm;
