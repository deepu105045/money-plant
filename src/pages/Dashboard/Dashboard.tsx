import React, { useState, useEffect } from 'react';
import { AppBar, Toolbar, Typography, Button, IconButton, Box } from '@mui/material';
import { useSelector, useDispatch } from 'react-redux';
import { useHistory } from 'react-router-dom';
import { businessOutline, logOutOutline, trendingUpOutline, walletOutline } from 'ionicons/icons';
import { selectUserInfo, setUserInfo } from '../../state/userSlice';
import { fetchUserHomes } from '../../components/firebase/homeData';
import { signOutUser } from '../../components/firebase/auth';
import { IonCard, IonLabel, IonCardContent, IonCardHeader, IonCardTitle, IonIcon, IonPage, IonContent, IonLoading } from '@ionic/react';
import { homeOutline, cashOutline, documentTextOutline, storefrontOutline } from 'ionicons/icons';

const Dashboard: React.FC = () => {
  const userInfo = useSelector(selectUserInfo);
  const dispatch = useDispatch();
  const history = useHistory();
  const [loading, setLoading] = useState(true);
  const [homes, setHomes] = useState<any[]>([]);
  const [loadingMessageIndex, setLoadingMessageIndex] = useState(0);

  const funnyMessages = [
    "Hey beauiful, Hold tight, we're polishing your awesome data!",
    "Fetching your awesome data... almost there!",
    "Getting things ready for you...",
    "Just a moment, making everything perfect...",
  ];

  useEffect(() => {
    const loadHomes = async () => {
      if (userInfo?.email) {
        const userHomes = await fetchUserHomes(userInfo.email);
        setHomes(userHomes);
        setLoading(false);
      }
    };

    loadHomes();
  }, [userInfo?.email]);

  // Cycle through funny messages every 2 seconds while loading
  useEffect(() => {
    if (loading) {
      const intervalId = setInterval(() => {
        setLoadingMessageIndex(prev => (prev + 1) % funnyMessages.length);
      }, 2000);
      return () => clearInterval(intervalId);
    }
  }, [loading]);

  const handleLogout = async () => {
    dispatch(setUserInfo({ username: 'Guest', email: '' }));
    await signOutUser();
    history.push('/login');
  };

  const navigateTo = (path: string) => {
    history.push(path);
  };

  const styles = {
    container: {
      display: 'flex',
      justifyContent: 'space-around',
      flexWrap: 'wrap',
    },
    assetItem: {
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      margin: '10px',
      flex: '1 0 21%',
      maxWidth: '120px',
    },
    iconContainer: (borderRadius: string) => ({
      borderRadius: borderRadius,
      padding: '10px',
    }),
    card: {
      border: '2px solid #673AB7', // Card border
      margin: '10px', // Margin around cards
      background: 'none', // Remove background color
    },
  };

  // Only define assets after homes are loaded
  const assets = homes.length > 0
    ? [
        { label: 'Bank', icon: cashOutline, path: `/home/${homes[0].familyid}/assets/bank` },
        { label: 'Mutual Fund', icon: storefrontOutline, path: `/home/${homes[0].familyid}/assets/mutualfund` },
        { label: 'Stock', icon: storefrontOutline, path: `/home/${homes[0].familyid}/assets/stock` },
        { label: 'Land', icon: businessOutline, path: `/home/${homes[0].familyid}/assets/land` },
        { label: 'PF', icon: cashOutline, path: `/home/${homes[0].familyid}/assets/pf` },
        { label: 'PPF', icon: walletOutline, path: `/home/${homes[0].familyid}/assets/ppf` },
        { label: 'NPS', icon: trendingUpOutline, path: `/home/${homes[0].familyid}/assets/nps` },
        { label: 'GOLD', icon: storefrontOutline, path: `/home/${homes[0].familyid}/assets/gold` },
        { label: 'Others', icon: storefrontOutline, path: `/home/${homes[0].familyid}/assets/others` },
      ]
    : [];

  const commonBorderRadius = '25%';

  return (
    <IonPage>
      <IonContent>
        <AppBar position="static">
          <Toolbar>
            <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
              <div>Hi, {userInfo?.username}</div>
            </Typography>
            <Box sx={{ display: { xs: 'none', md: 'flex' } }}>
              <Button color="inherit">Register</Button>
              <Button color="inherit">Login</Button>
            </Box>
            <IconButton color="inherit" onClick={handleLogout}>
              <IonIcon icon={logOutOutline} />
            </IconButton>
          </Toolbar>
        </AppBar>

        {/* Loading Spinner with Animated Messages */}
        <IonLoading
          isOpen={loading}
          message={funnyMessages[loadingMessageIndex]}  // Cycle through funny messages
          spinner="dots"  // Add some style to the spinner (dots, bubbles, etc.)
          cssClass="custom-loader"  // Custom class for animations
          duration={5000}
        />

        {!loading && homes.length > 0 && (
          <>
            <IonCard style={styles.card}>
              <IonCardHeader>
                <IonCardTitle>Home Expenses</IonCardTitle>
              </IonCardHeader>
              <IonCardContent>
                <div style={{ display: 'flex', justifyContent: 'space-around' }}>
                  {homes.map((home, index) => (
                    <div key={index} onClick={() => navigateTo(`/home/${home.familyid}`)}>
                      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                        <div style={{ ...styles.iconContainer(commonBorderRadius) }}>
                          <IonIcon icon={homeOutline} style={{ fontSize: '40px', color: '#D32F2F' }} />
                        </div>
                        <IonLabel style={{ fontWeight: 'bold' }}>{home.name}</IonLabel>
                      </div>
                    </div>
                  ))}
                </div>
              </IonCardContent>
            </IonCard>

            <IonCard style={styles.card}>
              <IonCardHeader>
                <IonCardTitle>Assets</IonCardTitle>
              </IonCardHeader>
              <IonCardContent>
                <div style={styles.container}>
                  {assets.map((asset, index) => (
                    <div key={index} style={styles.assetItem} onClick={() => navigateTo(asset.path)}>
                      <div style={{ ...styles.iconContainer(commonBorderRadius) }}>
                        <IonIcon icon={asset.icon} style={{ fontSize: '40px' }} />
                      </div>
                      <IonLabel style={{ fontWeight: 'bold' }}>{asset.label}</IonLabel>
                    </div>
                  ))}
                </div>
              </IonCardContent>
            </IonCard>

            <IonCard style={styles.card}>
              <IonCardHeader>
                <IonCardTitle>Others</IonCardTitle>
              </IonCardHeader>
              <IonCardContent>
                <div style={{ display: 'flex', justifyContent: 'space-around' }}>
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                    <div style={{ ...styles.iconContainer(commonBorderRadius) }}>
                      <IonIcon icon={documentTextOutline} style={{ fontSize: '40px', color: '#673AB7' }} />
                    </div>
                    <IonLabel style={{ fontWeight: 'bold' }}>Tasks</IonLabel>
                  </div>

                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                    <div style={{ ...styles.iconContainer(commonBorderRadius) }}>
                      <IonIcon icon={storefrontOutline} style={{ fontSize: '40px' }} />
                    </div>
                    <IonLabel style={{ fontWeight: 'bold' }}>Warranty Cards</IonLabel>
                  </div>
                </div>
              </IonCardContent>
            </IonCard>
          </>
        )}
      </IonContent>
    </IonPage>
  );
};

export default Dashboard;
