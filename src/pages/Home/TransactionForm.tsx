import React, { useState, useEffect } from 'react';
import {
    AppBar, Toolbar, Typography, Box, IconButton, Button, TextField,
    Container, Grid, Radio, RadioGroup, FormControl, FormControlLabel, FormLabel,
    Chip
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { getCategoriesByFamilyId, addCategoryToConfig, getPopularCategories } from '../../components/firebase/configService';
import { IonList, IonItem, IonLabel } from '@ionic/react';
import { INCOME, SPENDING, INVESTMENT } from '../../components/utils/Constants';
import { debounce } from 'lodash'; // You can install lodash for debouncing

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

    useEffect(() => {
        const today = new Date().toISOString().split('T')[0]; // Get current date in YYYY-MM-DD format
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

    const handleCategoryFetching = async (searchTerm: string) => {
        try {
          const fetchedCategories = await getCategoriesByFamilyId(familyId, searchTerm);
          setSavedCategories(fetchedCategories);
          setCategory(searchTerm);
          setCategorySelected(true);
        } catch (error) {
          console.error("Error fetching categories:", error);
        }
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
            console.log("Add new category: " + category);
            await addCategoryToConfig(familyId, category);
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
                            onChange={(event) => handleCategoryFetching(event.target.value)}
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
