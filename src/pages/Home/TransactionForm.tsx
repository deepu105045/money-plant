import React, { useState, useEffect } from 'react';
import {
    AppBar, Toolbar, Typography, Box, IconButton, Button, TextField,
    Container, Grid, Radio, RadioGroup, FormControl, FormControlLabel, FormLabel
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';

interface FinanceFormProps {
    type: string;
    onCancel: () => void;
    onConfirm: (formData: any) => void;
    paidByOptions: string[];
    currentUser: string;
}

const TransactionForm: React.FC<FinanceFormProps> = ({ type, onCancel, onConfirm, paidByOptions, currentUser }) => {
    const [date, setDate] = useState('');
    const [amount, setAmount] = useState(''); // Change to string
    const [category, setCategory] = useState('');
    const [notes, setNotes] = useState('');
    const [paidBy, setPaidBy] = useState(currentUser);

    useEffect(() => {
        const today = new Date().toISOString().split('T')[0]; // Get current date in YYYY-MM-DD format
        setDate(today);
    }, []);

    const handleSubmit = () => {
        const formData = {
            date: new Date(date),
            amount: parseInt(amount), // Convert to number
            category,
            notes,
            paidBy,
            type
        };
        onConfirm(formData);
    };

    return (
        <Container disableGutters maxWidth="sm">
            <AppBar position="static" color="primary">
                <Toolbar>
                    <Typography variant="h6" component="div">
                        {type.charAt(0).toUpperCase() + type.slice(1)}
                    </Typography>
                    <Box sx={{ flexGrow: 1 }} />
                    <IconButton edge="end" color="inherit" onClick={onCancel} aria-label="close">
                        <CloseIcon />
                    </IconButton>
                </Toolbar>
            </AppBar>
            <Box mt={3} p={2} boxShadow={3} borderRadius={2} bgcolor="background.paper">
                <Grid container spacing={2}>
                    <Grid item xs={12}>
                        <TextField
                            fullWidth
                            label="Date"
                            type="date"
                            value={date}
                            onChange={(e) => setDate(e.target.value)}
                            InputLabelProps={{ shrink: true }}
                        />
                    </Grid>
                    <Grid item xs={12}>
                        <TextField
                            fullWidth
                            label="Category"
                            value={category}
                            onChange={(e) => setCategory(e.target.value)}
                        />
                    </Grid>
                    <Grid item xs={12}>
                        <TextField
                            fullWidth
                            label="Amount"
                            type="number"
                            value={amount}
                            onChange={(e) => setAmount(e.target.value)} // Keep as string
                        />
                    </Grid>
                    <Grid item xs={12}>
                        <TextField
                            fullWidth
                            label="Notes"
                            multiline
                            rows={2}
                            value={notes}
                            onChange={(e) => setNotes(e.target.value)}
                        />
                    </Grid>
                    <Grid item xs={12}>
                        <FormControl component="fieldset">
                            <FormLabel component="legend">Paid By</FormLabel>
                            <RadioGroup
                                value={paidBy}
                                onChange={(e) => setPaidBy((e.target as HTMLInputElement).value)}
                            >
                                {paidByOptions.map(option => (
                                    <FormControlLabel key={option} value={option} control={<Radio />} label={option} />
                                ))}
                            </RadioGroup>
                        </FormControl>
                    </Grid>
                    <Grid item xs={12} sx={{ mt: 2 }}> {/* Add margin-top */}
                        <Button
                            fullWidth
                            variant="contained"
                            color="primary"
                            onClick={handleSubmit}
                        >
                            Save
                        </Button>
                    </Grid>
                </Grid>
            </Box>
        </Container>
    );
};

export default TransactionForm;
