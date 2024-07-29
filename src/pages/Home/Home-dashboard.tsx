import React, { useState, useEffect } from 'react';
import {
    IonContent, IonHeader, IonIcon, IonLabel, IonList, IonPage, IonRouterOutlet,
    IonTitle, IonToolbar, IonModal, IonButton, IonFooter, IonGrid, IonRow, IonCol
} from '@ionic/react';
import { walletOutline, cardOutline, cashOutline, listOutline } from 'ionicons/icons';
import { useParams, useHistory, Link } from 'react-router-dom';
import { AppBar, Toolbar, IconButton, Typography, Box } from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import CloseIcon from '@mui/icons-material/Close';
import TransactionForm from './TransactionForm';
import Summary from './Summary';
import ViewTransactions from './ViewTransactions';
import { fetchMembersByHome } from '../../components/firebase/homeData';
import { useSelector } from 'react-redux';
import { selectUserInfo } from '../../state/userSlice';
import { addTransactions } from '../../components/firebase/finance';
import './HomeDashboard.css'; // Import the custom CSS file
import MonthYearLabel from './MonthYearLabel';

const HomeDashboard: React.FC = () => {
    const userInfo = useSelector(selectUserInfo);
    const { id } = useParams<{ id: string }>();
    const history = useHistory();
    const [showSpendingModal, setShowSpendingModal] = useState(false);
    const [showIncomeModal, setShowIncomeModal] = useState(false);
    const [showInvestmentModal, setShowInvestmentModal] = useState(false);
    const [showViewModal, setShowViewModal] = useState(false);
    const [paidByOptions, setPaidByOptions] = useState<string[]>([]);
    const [year, setYear] = useState<number>(new Date().getFullYear()); // Initial year state
    const [month, setMonth] = useState<number>(new Date().getMonth() + 1); // Initial month state
    const [triggerFetch, setTriggerFetch] = useState(false);

    useEffect(() => {
        const fetchPaidByOptions = async () => {
            try {
                const familyData = await fetchMembersByHome(id);
                if (familyData) {
                    setPaidByOptions(familyData.members || []);
                }
            } catch (error) {
                console.error('Error fetching family data:', error);
            }
        };

        fetchPaidByOptions();
    }, [id]);

    const handleBack = () => {
        history.goBack();
    };

    const handleConfirm = async (formData: any) => {
        const date = new Date(formData.date);
        const month = date.getMonth() + 1;
        const year = date.getFullYear();
        setShowSpendingModal(false);
        setShowIncomeModal(false);
        setShowInvestmentModal(false);
        await addTransactions(id, year, month, formData);
        setTriggerFetch(prev => !prev); // Toggle the triggerFetch state
    };

    const navigateTo = (path: string) => {
        history.push(path);
      };

    return (
        <IonPage>
            <AppBar position="static">
                <Toolbar>
                    <IconButton edge="start" color="inherit" onClick={handleBack} aria-label="back">
                        <ArrowBackIcon />
                    </IconButton>
                    <Typography variant="h6" component="div">
                        Finance
                    </Typography>
                    <Box sx={{ flexGrow: 1 }} />
                    {/* <Typography variant="h6" component="div" onClick={() => navigateTo(`/home/${id}/trend`)}>
                        Go to Trends
                    </Typography> */}
                </Toolbar>
            </AppBar>

            <IonContent>
                <Box p={2}>
                    <MonthYearLabel year={year} month={month} setYear={setYear} setMonth={setMonth} />
                    <Summary id={id} year={year} month={month} triggerFetch={triggerFetch} />
                </Box>

                <IonModal isOpen={showSpendingModal} onDidDismiss={() => setShowSpendingModal(false)}>
                    <TransactionForm
                        type="Spending"
                        onCancel={() => setShowSpendingModal(false)}
                        onConfirm={handleConfirm}
                        paidByOptions={paidByOptions}
                        currentUser={userInfo?.email || ''}
                    />
                </IonModal>
                <IonModal isOpen={showIncomeModal} onDidDismiss={() => setShowIncomeModal(false)}>
                    <TransactionForm
                        type="Income"
                        onCancel={() => setShowIncomeModal(false)}
                        onConfirm={handleConfirm}
                        paidByOptions={paidByOptions}
                        currentUser={userInfo?.email || ''}
                    />
                </IonModal>
                <IonModal isOpen={showInvestmentModal} onDidDismiss={() => setShowInvestmentModal(false)}>
                    <TransactionForm
                        type="Investment"
                        onCancel={() => setShowInvestmentModal(false)}
                        onConfirm={handleConfirm}
                        paidByOptions={paidByOptions}
                        currentUser={userInfo?.email || ''}
                    />
                </IonModal>
                <IonModal isOpen={showViewModal} onDidDismiss={() => setShowViewModal(false)}>
                    <AppBar position="static">
                        <Toolbar>
                            <IconButton edge="start" color="inherit" onClick={() => setShowViewModal(false)} aria-label="back">
                                <ArrowBackIcon />
                            </IconButton>
                            <Typography variant="h6" component="div">
                                Transactions
                            </Typography>
                            <Box sx={{ flexGrow: 1 }} />
                            <IconButton edge="end" color="inherit" onClick={() => setShowViewModal(false)} aria-label="close">
                                <CloseIcon />
                            </IconButton>
                        </Toolbar>
                    </AppBar>
                    <IonContent>
                        <ViewTransactions familyId={id} year={year} month={month} />
                        <IonButton onClick={() => setShowViewModal(false)}>Close</IonButton>
                    </IonContent>
                </IonModal>
            </IonContent>

            <IonFooter>
                <IonToolbar>
                    <div className="footer-buttons">
                        <IonButton fill="clear" onClick={() => setShowSpendingModal(true)} className="icon-button">
                            <div className="icon-label-container">
                                <IonIcon icon={walletOutline} />
                                <IonLabel>Spending</IonLabel>
                            </div>
                        </IonButton>
                        <IonButton fill="clear" onClick={() => setShowIncomeModal(true)} className="icon-button">
                            <div className="icon-label-container">
                                <IonIcon icon={cashOutline} />
                                <IonLabel>Income</IonLabel>
                            </div>
                        </IonButton>
                        <IonButton fill="clear" onClick={() => setShowInvestmentModal(true)} className="icon-button">
                            <div className="icon-label-container">
                                <IonIcon icon={cardOutline} />
                                <IonLabel>Investment</IonLabel>
                            </div>
                        </IonButton>
                        <IonButton fill="clear" onClick={() => setShowViewModal(true)} className="icon-button">
                            <div className="icon-label-container">
                                <IonIcon icon={listOutline} />
                                <IonLabel>View</IonLabel>
                            </div>
                        </IonButton>
                    </div>
                </IonToolbar>
            </IonFooter>
        </IonPage>
    );
};

export default HomeDashboard;
