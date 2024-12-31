import React, { useEffect, useState } from 'react';
import { IonPage, IonHeader, IonToolbar, IonTitle, IonContent, IonCard, IonCardHeader, IonCardTitle, IonCardContent, IonSpinner, IonBackButton, IonButtons } from '@ionic/react';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { Pie } from 'react-chartjs-2';
import { getAssetByType } from "../../../components/firebase/assetService";
import { useParams } from 'react-router';
import LoadingSpinner from '../../../components/utils/LoadingSpinner';

// Register Chart.js elements
ChartJS.register(ArcElement, Tooltip, Legend);

const NetWorthPage: React.FC = () => {
  const { id: familyId } = useParams<{ id: string }>();
  const [netWorthData, setNetWorthData] = useState({
    shares: 0,
    bank: 0,
    mutualFunds: 0,
    realEstate: 0,
    ppf: 0,
    nps: 0,
  });
  const [totalNetWorth, setTotalNetWorth] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAssetData = async () => {
      try {
        const stockData = await getAssetByType(familyId, "STOCK", "currentValue");
        const bankData = await getAssetByType(familyId, "BANK", "amount");
        const mutualFundData = await getAssetByType(familyId, "MUTUAL_FUND", "currentValue");
        const realEstateData = await getAssetByType(familyId, "REAL_ESTATE", "currentValue");
        const ppfData = await getAssetByType(familyId, "PPF", "currentValue");
        const npsData = await getAssetByType(familyId, "NPS", "currentValue");

        const updatedNetWorthData = {
          shares: stockData?.total || 0,
          bank: bankData?.total || 0,
          mutualFunds: mutualFundData?.total || 0,
          realEstate: realEstateData?.total || 0,
          ppf: ppfData?.total || 0,
          nps: npsData?.total || 0,
        };

        setNetWorthData(updatedNetWorthData);

        // Calculate total net worth dynamically
        const total = Object.values(updatedNetWorthData).reduce((acc, value) => acc + value, 0);
        setTotalNetWorth(total);
      } catch (error) {
        console.error("Error fetching asset data:", error);
      } finally {
        setLoading(false); // Stop the loader after fetching data
      }
    };

    fetchAssetData();
  }, [familyId]);

  // Prepare data for the chart
  const chartData = {
    labels: Object.keys(netWorthData),
    datasets: [
      {
        data: Object.values(netWorthData),
        backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56', '#4CAF50', '#FF9800', '#9C27B0'],
        hoverBackgroundColor: ['#FF6384', '#36A2EB', '#FFCE56', '#4CAF50', '#FF9800', '#9C27B0'],
      },
    ],
  };

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonButtons slot="start">
            <IonBackButton defaultHref="/" />
          </IonButtons>
          <IonTitle>My net Worth</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent>
        {loading ? (      
          <LoadingSpinner/>
        ) : (
          <>
            <IonCard>
              <IonCardHeader>
                <IonCardTitle>Total Net Worth</IonCardTitle>
              </IonCardHeader>
              <IonCardContent>
                <h2 style={{ fontWeight: 'bold', color: '#4CAF50' }}>
                  ₹{totalNetWorth.toLocaleString()}
                </h2>
              </IonCardContent>
            </IonCard>
            <IonCard>
              <IonCardHeader>
                <IonCardTitle>Asset Distribution</IonCardTitle>
              </IonCardHeader>
              <IonCardContent>
                <Pie data={chartData} />
              </IonCardContent>
            </IonCard>
          </>
        )}
      </IonContent>
    </IonPage>
  );
};

export default NetWorthPage;
