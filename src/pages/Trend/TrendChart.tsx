import React, { useEffect, useState } from 'react';
import CashflowChart from '../../components/charts/CashflowChart';
import { IonContent, IonPage } from '@ionic/react';
import { AppBar, Toolbar, IconButton, Typography, Box } from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { useParams, useHistory, Link } from 'react-router-dom';
import { getAllMonthlyDataByType } from '../../components/firebase/finance'

const TrendChart: React.FC = () => {

  const history = useHistory();
  const [data, setData] = useState<{ [key: string]: { [key: number]: number } } | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { id } = useParams<{ id: string }>();


  const handleBack = () => {
    history.goBack();
  };

  useEffect(() => {
    const fetchData = async () => {
        try {
            console.log("Get data for graph")
            setLoading(true);
            const fetchedData = await getAllMonthlyDataByType(id);
            setData(fetchedData);
            console.log(fetchData)
        } catch (err) {
            console.error("Failed to fetch data", err);
            setError("Failed to fetch data");
        } finally {
            setLoading(false);
        }
    };

    fetchData();
}, [id]);

if (loading) return <div>Loading...</div>;
if (error) return <div>{error}</div>;

  return (
    <>
      <IonPage>
        <IonContent>
          <AppBar position="static">
            <Toolbar>
              <IconButton edge="start" color="inherit" onClick={handleBack} aria-label="back">
                <ArrowBackIcon />
              </IconButton>
              <Typography variant="h6" component="div">
                Trends
              </Typography>
            </Toolbar>
          </AppBar>
          {/* <CashflowChart data={data} /> */}

        </IonContent>
      </IonPage>
    </>
  );
};


export default TrendChart;
