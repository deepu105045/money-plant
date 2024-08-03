// src/components/RealEstateForm.tsx
import React, { useState } from 'react';
import { TextField, FormControl, FormLabel, RadioGroup, FormControlLabel, Radio, Button } from '@mui/material';

interface RealEstateFormProps {
    onSubmit: (data: any) => void;
}

const RealEstateForm: React.FC<RealEstateFormProps> = ({ onSubmit }) => {
    const today = new Date().toISOString().split('T')[0];

    const [propertyType, setPropertyType] = useState<string | null>(null);
    const [address, setAddress] = useState('');
    const [worth, setWorth] = useState('');
    const [date, setDate] = useState<string | null>(today);

    const handleSave = () => {
        const formData = {
            propertyType,
            address,
            worth,
            date,
        };
        console.log('Saved:', formData);
        onSubmit(formData); // Call the parent-provided onSubmit function
    };

    return (
        <form noValidate autoComplete="off">
            <FormControl component="fieldset" margin="normal">
                <FormLabel component="legend">Property Type</FormLabel>
                <RadioGroup
                    row
                    value={propertyType}
                    onChange={(e) => setPropertyType(e.target.value)}
                >
                    <FormControlLabel value="house" control={<Radio />} label="House" />
                    <FormControlLabel value="land" control={<Radio />} label="Land" />
                </RadioGroup>
            </FormControl>
            <TextField
                fullWidth
                label="Address"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                margin="normal"
                variant="outlined"
            />
            <TextField
                fullWidth
                label="Worth"
                type="number"
                value={worth}
                onChange={(e) => setWorth(e.target.value)}
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

export default RealEstateForm;
