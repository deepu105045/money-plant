import React, { useState, useEffect } from 'react';
import {
    IonContent, IonHeader, IonPage, IonLabel, IonAccordion, IonAccordionGroup,
    IonItem, IonButton, IonSpinner, IonGrid, IonRow, IonCol, IonCard, IonCardHeader, IonCardTitle, IonCardContent
} from '@ionic/react';
import { useHistory, useParams } from 'react-router-dom';
import { AppBar, Toolbar, IconButton, Typography } from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import AddIcon from '@mui/icons-material/Add';
import MutualFundForm from './MutualFundForm';
import BankDetailsForm from './BankDetailsForm';
import RealEstateForm from './RealEstateForm';
import { getTotalAssets, addAsset, getAssetByType } from '../../components/firebase/assetService';
import { BANK, MF, STOCKS, REAL_ESTATE } from '../../components/utils/Constants';

const ASSET_TYPES = [
    { key: 'bank', label: 'BANK', form: BankDetailsForm, assetType: BANK },
    { key: 'mutualFund', label: 'Mutual Fund', form: MutualFundForm, assetType: MF },
    { key: 'stocks', label: 'Stocks', form: MutualFundForm, assetType: STOCKS },
    { key: 'real-estate', label: 'Real Estate', form: RealEstateForm, assetType: REAL_ESTATE },
];

const MyAssetsDashboard: React.FC = () => {
    const history = useHistory();
    const { id: familyId } = useParams<{ id: string }>();
    const [selectedForm, setSelectedForm] = useState<string | null>(null);
    const [expandedAccordion, setExpandedAccordion] = useState<string | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [assetData, setAssetData] = useState<{ [key: string]: { accounts: any[], total: number } }>({});
    const [grandTotal, setGrandTotal] = useState<number>(0);
    const [message, setMessage] = useState<string>('');

    useEffect(() => {
        const fetchAllAssets = async () => {
            setLoading(true);
            setMessage("Wait, we're getting data from the server... have some patience!");
            try {
                const result = await getTotalAssets(familyId, ASSET_TYPES.map(type => type.assetType));
                setAssetData(result.assets);
                setGrandTotal(result.grandTotal);
            } catch (error) {
                console.error('Error fetching all assets:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchAllAssets();
    }, [familyId]);

    const handleBack = () => history.goBack();

    const handleOpenForm = (formType: string) => setSelectedForm(formType);

    const handleCloseForm = () => setSelectedForm(null);

    const handleNewRecord = async (data: any) => {
        setLoading(true);
        setMessage("Hang tight, updating your assets...");
        try {
            await addAsset(familyId, data, data.assetType);
            const { accounts, total } = await getAssetByType(familyId, data.assetType);
            setAssetData(prevState => ({ ...prevState, [data.assetType.toLowerCase()]: { accounts, total } }));
            setGrandTotal(Object.values(assetData).reduce((acc, cur) => acc + cur.total, 0));
        } catch (error) {
            console.error('Error adding new record:', error);
        } finally {
            setLoading(false);
        }
        handleCloseForm();
    };

    return (
        <IonPage>
            <IonHeader>
                <AppBar position="static">
                    <Toolbar>
                        <IconButton edge="start" color="inherit" onClick={handleBack} aria-label="back">
                            <ArrowBackIcon />
                        </IconButton>
                        <Typography variant="h6" component="div" style={{ flexGrow: 1 }}>
                            My Assets
                        </Typography>
                        {selectedForm && (
                            <IonButton color="inherit" onClick={handleCloseForm} aria-label="close">
                                Close Form
                            </IonButton>
                        )}
                    </Toolbar>
                </AppBar>
            </IonHeader>
            <IonContent className="ion-padding" style={{ display: 'flex', flexDirection: 'column', height: '100vh' }}>
                {/* Funky Card for Grand Total */}
                <IonCard style={{ background: 'linear-gradient(45deg, #ff6f00, #ff8f00)', color: '#fff', borderRadius: '15px', marginBottom: '20px' }}>
                    <IonCardHeader>
                        <IonCardTitle style={{ textAlign: 'center', fontSize: '2rem' }}>Grand Total</IonCardTitle>
                    </IonCardHeader>
                    <IonCardContent style={{ textAlign: 'center', fontSize: '1.5rem', fontWeight: 'bold' }}>
                        ₹ {grandTotal.toLocaleString('en-IN')}
                    </IonCardContent>
                </IonCard>

                {!selectedForm ? (
                    <IonAccordionGroup value={expandedAccordion} onIonChange={(e) => setExpandedAccordion(e.detail.value)}>
                        {ASSET_TYPES.map(({ key, label, assetType }) => (
                            <IonAccordion key={assetType} value={assetType}>
                                <IonItem slot="header" color="light">
                                    <IonLabel>{label}</IonLabel>
                                    <IconButton color="inherit" onClick={() => handleOpenForm(label)}>
                                        <AddIcon />
                                    </IconButton>
                                </IonItem>
                                <div className="ion-padding" slot="content">
                                    {loading ? (
                                        <>
                                            <IonSpinner name="crescent" />
                                            <div style={{ textAlign: 'center', marginTop: '10px', fontStyle: 'italic', fontSize: '1.2rem' }}>
                                                {message}
                                            </div>
                                        </>
                                    ) : (
                                        <div>
                                            <IonGrid style={{ border: '1px solid #000', padding: '10px' }}>
                                                <IonRow style={{ backgroundColor: '#f0f0f0' }}>
                                                    <IonCol style={{ fontWeight: 'bold', fontSize: '1.2rem' }}>Total</IonCol>
                                                    <IonCol style={{ fontWeight: 'bold', fontSize: '1.2rem', textAlign: 'left' }}>
                                                        {assetData[assetType]?.total || 0}
                                                    </IonCol>
                                                </IonRow>
                                            </IonGrid>

                                            {assetData[assetType]?.accounts.map((account, index) => (
                                                <IonGrid key={index} style={{ border: '1px solid #000' }}>
                                                    <IonRow>
                                                        <IonCol>{account.accountHolderName}</IonCol>
                                                        <IonCol>{account.amount}</IonCol>
                                                    </IonRow>
                                                </IonGrid>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            </IonAccordion>
                        ))}
                    </IonAccordionGroup>
                ) : (
                    <>
                        {ASSET_TYPES.map(({ label, form: FormComponent, assetType }) => (
                            selectedForm === label && <FormComponent key={label} title={`Add ${label}`} assetType={assetType} onSubmit={handleNewRecord} />
                        ))}
                    </>
                )}
            </IonContent>
        </IonPage>
    );
};

export default MyAssetsDashboard;
