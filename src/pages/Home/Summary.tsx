import React, { useState, useEffect } from 'react';
import {
    Box,
    Typography,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableRow,
    Collapse,
    Paper
} from '@mui/material';
import { calculateSumsByType, groupTransactionByTypeAndCategory } from '../../components/firebase/finance';

interface SummaryProps {
    id: string;
    year: number;
    month: number;
    triggerFetch: boolean;
}

interface GroupedData {
    [key: string]: {
        [category: string]: number;
    };
}

const Summary: React.FC<SummaryProps> = ({ id, year, month, triggerFetch }) => {
    const [balance, setBalance] = useState(0);
    const [spending, setSpending] = useState(0);
    const [income, setIncome] = useState(0);
    const [investment, setInvestment] = useState(0);
    const [groupedData, setGroupedData] = useState<GroupedData>({});
    const [open, setOpen] = useState<Record<string, boolean>>({
        Balance: false,
        Income: false,
        Investment: false,
        Spending: true  // Set Spending to true to expand by default
    });

    useEffect(() => {
        const unsubscribeSummary = calculateSumsByType(id, year, month, (summary) => {
            if (summary) {
                setSpending(summary.Spending || 0);
                setIncome(summary.Income || 0);
                setInvestment(summary.Investment || 0);
                const calculatedBalance = (summary.Income || 0) - ((summary.Spending || 0) + (summary.Investment || 0));
                setBalance(calculatedBalance);
            }
        });

        const unsubscribeGroupedData = groupTransactionByTypeAndCategory(id, year, month, (groupedData) => {
            setGroupedData(groupedData);
        });

        return () => {
            unsubscribeSummary();
            unsubscribeGroupedData();
        };
    }, [id, year, month, triggerFetch]);

    const handleToggle = (type: string) => {
        setOpen(prev => ({ ...prev, [type]: !prev[type] }));
    };

    return (
        <TableContainer component={Paper} sx={{ maxWidth: 400, margin: 'auto', mt: 1 }}>
            <Table>
                <TableBody>
                    {['Balance', 'Income', 'Investment', 'Spending'].map(type => (
                        <React.Fragment key={type}>
                            <TableRow onClick={() => handleToggle(type)}>
                                <TableCell component="th" scope="row">
                                    <Typography sx={{ fontWeight: 'bold' }}>{type}</Typography>
                                </TableCell>
                                <TableCell align="right">
                                    ${type === 'Income' ? income : type === 'Investment' ? investment : type === 'Spending' ? spending : balance}
                                </TableCell>
                            </TableRow>
                            {type !== 'Balance' && (
                                <TableRow>
                                    <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={2}>
                                        <Collapse in={open[type]} timeout="auto" unmountOnExit>
                                            <Box margin={1}>
                                                <Table size="small" aria-label={`${type} details`}>
                                                    <TableBody>
                                                        {groupedData[type] && Object.entries(groupedData[type]).map(([category, amount]) => (
                                                            <TableRow key={category}>
                                                                <TableCell component="th" scope="row">{category}</TableCell>
                                                                <TableCell align="right">${amount}</TableCell>
                                                            </TableRow>
                                                        ))}
                                                    </TableBody>
                                                </Table>
                                            </Box>
                                        </Collapse>
                                    </TableCell>
                                </TableRow>
                            )}
                        </React.Fragment>
                    ))}
                </TableBody>
            </Table>
        </TableContainer>
    );
};

export default Summary;
