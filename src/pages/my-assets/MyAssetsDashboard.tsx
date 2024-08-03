import React, { useState } from 'react';
import { IonContent, IonHeader, IonPage, IonLabel, IonAccordion, IonAccordionGroup, IonItem, IonButton } from '@ionic/react';
import { useHistory } from 'react-router-dom';
import { AppBar, Toolbar, IconButton, Typography } from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import AddIcon from '@mui/icons-material/Add';
import MutualFundForm from './MutualFundForm';
import BankDetailsForm from './BankDetailsForm';
import RealEstateForm from './RealEstateForm';

const MyAssetsDashboard: React.FC = () => {
    const history = useHistory();
    const [selectedForm, setSelectedForm] = useState<string | null>(null);

    const handleBack = () => {
        history.goBack();
    };

    const handleOpenForm = (formType: string) => {
        setSelectedForm(formType);
    };

    const handleCloseForm = () => {
        setSelectedForm(null);
    };

    const handleNewRecord = (data: any) => {
        console.log('Form Data Submitted:', data);
        handleCloseForm(); // Close the form after submission
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
                        {selectedForm !== null && (
                            <IonButton color="inherit" onClick={handleCloseForm} aria-label="close">
                                Close Form
                            </IonButton>
                        )}
                    </Toolbar>
                </AppBar>
            </IonHeader>
            <IonContent className="ion-padding" style={{ display: 'flex', flexDirection: 'column', height: '100vh' }}>
                {selectedForm === null ? (
                    <IonAccordionGroup>
                        <IonAccordion value="bank">
                            <IonItem slot="header" color="light">
                                <IonLabel>BANK</IonLabel>
                                <IconButton color="inherit" onClick={() => handleOpenForm('BANK')}>
                                    <AddIcon />
                                </IconButton>
                            </IonItem>
                            <div className="ion-padding" slot="content">
                                {/* Bank details content or form goes here */}
                            </div>
                        </IonAccordion>
                        <IonAccordion value="mutualFund">
                            <IonItem slot="header" color="light">
                                <IonLabel>Mutual Fund</IonLabel>
                                <IconButton color="inherit" onClick={() => handleOpenForm('Mutual Fund')}>
                                    <AddIcon />
                                </IconButton>
                            </IonItem>
                            <div className="ion-padding" slot="content">
                                {/* Mutual Fund details content or form goes here */}
                            </div>
                        </IonAccordion>
                        <IonAccordion value="stocks">
                            <IonItem slot="header" color="light">
                                <IonLabel>Stocks</IonLabel>
                                <IconButton color="inherit" onClick={() => handleOpenForm('Mutual Fund')}>
                                    <AddIcon />
                                </IconButton>
                            </IonItem>
                            <div className="ion-padding" slot="content">
                                {/* Mutual Fund details content or form goes here */}
                            </div>
                        </IonAccordion>
                        <IonAccordion value="realEstate">
                            <IonItem slot="header" color="light">
                                <IonLabel>Real Estate</IonLabel>
                                <IconButton color="inherit" onClick={() => handleOpenForm('Real Estate')}>
                                    <AddIcon />
                                </IconButton>
                            </IonItem>
                            <div className="ion-padding" slot="content">
                            </div>
                        </IonAccordion>
                        <IonAccordion value="ppf">
                            <IonItem slot="header" color="light">
                                <IonLabel>PPF</IonLabel>
                                <IconButton color="inherit" onClick={() => handleOpenForm('PPF')}>
                                    <AddIcon />
                                </IconButton>
                            </IonItem>
                            <div className="ion-padding" slot="content">
                            </div>
                        </IonAccordion>
                        <IonAccordion value="nps">
                            <IonItem slot="header" color="light">
                                <IonLabel>NPS</IonLabel>
                                <IconButton color="inherit" onClick={() => handleOpenForm('NPS')}>
                                    <AddIcon />
                                </IconButton>
                            </IonItem>
                            <div className="ion-padding" slot="content">
                            </div>
                        </IonAccordion>
                        <IonAccordion value="iOwed">
                            <IonItem slot="header" color="light">
                                <IonLabel>I Owed</IonLabel>
                                <IconButton color="inherit" onClick={() => handleOpenForm('I Owed')}>
                                    <AddIcon />
                                </IconButton>
                            </IonItem>
                            <div className="ion-padding" slot="content">
                            </div>
                        </IonAccordion>
                        <IonAccordion value="insurance">
                            <IonItem slot="header" color="light">
                                <IonLabel>Insurance</IonLabel>
                                <IconButton color="inherit" onClick={() => handleOpenForm('Insurance')}>
                                    <AddIcon />
                                </IconButton>
                            </IonItem>
                            <div className="ion-padding" slot="content">
                            </div>
                        </IonAccordion>
                    </IonAccordionGroup>
                ) : (
                    <>
                        {selectedForm === 'BANK' && <BankDetailsForm onSubmit={handleNewRecord} />}
                        {selectedForm === 'Mutual Fund' && <MutualFundForm onSubmit={handleNewRecord} />}
                        {selectedForm === 'Real Estate' && <RealEstateForm onSubmit={handleNewRecord} />}
                    </>
                )}
            </IonContent>
        </IonPage>
    );
};

export default MyAssetsDashboard;
