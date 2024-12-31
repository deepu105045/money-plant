import React, { useState, useEffect, useCallback, useRef } from 'react';
import {
    AppBar, Toolbar, Typography, Box, IconButton, Button, TextField,
    Container, Grid, Radio, RadioGroup, FormControl, FormControlLabel, FormLabel,
    Chip
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { getCategoriesByFamilyId, addCategoryToConfig, getPopularCategories } from '../../components/firebase/configService';
import { IonList, IonItem, IonLabel } from '@ionic/react';
import { INCOME, SPENDING, INVESTMENT } from '../../components/utils/Constants';

interface FinanceFormProps {
    type: string;
    onCancel: () => void;
    onConfirm: (formData: any) => void;
    paidByOptions: string[];
    currentUser: string;
}

const TransactionForm: React.FC<FinanceFormProps> = ({ type, onCancel, onConfirm, paidByOptions, currentUser }) => {
    const [date, setDate] = useState('');
    const [amount, setAmount] = useState('');
    const [paidBy, setPaidBy] = useState(currentUser);
    const [category, setCategory] = useState('');
    const [savedCategories, setSavedCategories] = useState<string[]>([]);
    const [categorySelected, setCategorySelected] = useState(false);
    const familyId = "cashflow";
    const [popularCategories, setPopularCategories] = useState<string[]>([]);
    const [loading, setLoading] = useState(true);

    const debounceTimeout = useRef<NodeJS.Timeout | null>(null); // Reference for debounce timer

    useEffect(() => {
        const today = new Date().toISOString().split('T')[0];
        setDate(today);

        const fetchCategories = async () => {
            setLoading(true);
            let categories = [];
            switch (type) {
                case INCOME:
                    categories = await getPopularCategories('popular-income');
                    break;
                case SPENDING:
                    categories = await getPopularCategories('popular-spending');
                    break;
                case INVESTMENT:
                    categories = await getPopularCategories('popular-investment');
                    break;
            }
            setPopularCategories(categories);
            setLoading(false);
        };

        fetchCategories();
    }, [type]);

    // Custom debounce function
    const debounce = (func: (...args: any[]) => void, delay: number) => {
        return (...args: any[]) => {
            if (debounceTimeout.current) {
                clearTimeout(debounceTimeout.current); // Clear previous timer
            }
            debounceTimeout.current = setTimeout(() => {
                func(...args); // Call the function after delay
            }, delay);
        };
    };

    // Debounced function to handle category fetching
    const handleCategoryFetching = async (searchTerm: string) => {
        if (searchTerm.length >= 2) {  // Only fetch if 2 or more characters
            try {
                const fetchedCategories = await getCategoriesByFamilyId(familyId, searchTerm);
                setSavedCategories(fetchedCategories);
                setCategorySelected(true);
            } catch (error) {
                console.error("Error fetching categories:", error);
            }
        } else {
            setSavedCategories([]);
            setCategorySelected(false);
        }
    };

    // Debounced handler
    const debouncedCategoryFetch = useCallback(debounce(handleCategoryFetching, 300), []);

    const handleCategoryInput = (event: React.ChangeEvent<HTMLInputElement>) => {
        const searchTerm = event.target.value;
        setCategory(searchTerm);  // Update the input value immediately
        debouncedCategoryFetch(searchTerm);  // Trigger debounced fetch
    };

    const handleSubmit = async () => {
        const formData = {
            date: new Date(date),
            amount: parseInt(amount),
            category,
            paidBy,
            type
        };
        onConfirm(formData);

        if (savedCategories.length === 0) {
            await addCategoryToConfig('cashflow', category);
        }
    };

    const handleCategorySelection = (selectedCategory: string) => {
        setCategory(selectedCategory);
        setCategorySelected(false);
    };

    if (loading) return <div>Loading...</div>;

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
                            onChange={handleCategoryInput}  // Use the debounced input handler
                        />
                        {categorySelected && (
                            <IonList>
                                {savedCategories.map((cat) => (
                                    <IonItem key={cat} button onClick={() => handleCategorySelection(cat)}>
                                        <IonLabel>{cat}</IonLabel>
                                    </IonItem>
                                ))}
                            </IonList>
                        )}
                    </Grid>
                    <Grid item xs={12}>
                        <TextField
                            fullWidth
                            label="Amount"
                            type="number"
                            value={amount}
                            onChange={(e) => setAmount(e.target.value)}
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
                    <Grid item xs={12} sx={{ mt: 2 }}>
                        <Button
                            fullWidth
                            variant="contained"
                            color="primary"
                            onClick={handleSubmit}
                        >
                            Save
                        </Button>
                    </Grid>
                    <Grid item xs={12}>
                        <Typography variant="h6" component="div" sx={{ mt: 2 }}>
                            Popular Categories
                        </Typography>
                        {popularCategories.map((category, index) => (
                            <Chip key={index} label={category} onClick={() => setCategory(category)} variant="outlined" />
                        ))}
                    </Grid>
                </Grid>
            </Box>
        </Container>
    );
};

export default TransactionForm;
