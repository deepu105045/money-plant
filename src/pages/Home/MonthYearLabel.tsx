import React, { useState, useEffect } from 'react';
import { IonButton, IonIcon, IonLabel, IonRow, IonCol } from '@ionic/react';
import { arrowBackOutline, arrowForwardOutline } from 'ionicons/icons';

interface MonthYearLabelProps {
    year: number;
    month: number;
    setYear: React.Dispatch<React.SetStateAction<number>>;
    setMonth: React.Dispatch<React.SetStateAction<number>>;
}

const MonthYearLabel: React.FC<MonthYearLabelProps> = ({ year, month, setYear, setMonth }) => {
    useEffect(() => {
        const currentDate = new Date();
        setMonth(currentDate.getMonth() + 1); // Adjusting month to start from 1 (January)
        setYear(currentDate.getFullYear());
        console.log('Component Mounted:', { month: currentDate.getMonth() + 1, year: currentDate.getFullYear() });
    }, [setMonth, setYear]);

    const handlePreviousMonth = () => {
        setMonth(prevMonth => {
            if (prevMonth === 1) {
                setYear(year - 1);
                return 12;
            } else {
                return prevMonth - 1;
            }
        });
    };

    const handleNextMonth = () => {
        setMonth(prevMonth => {
            if (prevMonth === 12) {
                setYear(year + 1);
                return 1;
            } else {
                return prevMonth + 1;
            }
        });
    };

    const getMonthName = (month: number) => {
        const monthNames = [
            'January', 'February', 'March', 'April', 'May', 'June',
            'July', 'August', 'September', 'October', 'November', 'December'
        ];
        return monthNames[month - 1]; // Adjusting index to match month number
    };

    return (
        <IonRow className="ion-align-items-center ion-justify-content-center">
            <IonCol size="auto">
                <IonButton fill="clear" onClick={handlePreviousMonth}>
                    <IonIcon icon={arrowBackOutline} />
                </IonButton>
            </IonCol>
            <IonCol size="auto">
                <IonLabel>{getMonthName(month)} {year}</IonLabel>
            </IonCol>
            <IonCol size="auto">
                <IonButton fill="clear" onClick={handleNextMonth}>
                    <IonIcon icon={arrowForwardOutline} />
                </IonButton>
            </IonCol>
        </IonRow>
    );
};

export default MonthYearLabel;
