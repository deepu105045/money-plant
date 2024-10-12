import React, { useState, useEffect } from 'react';
import { AppBar, Toolbar, Typography, Button, IconButton, Box, Divider } from '@mui/material';
import { useSelector, useDispatch } from 'react-redux';
import { useHistory } from 'react-router-dom';
import { logOutOutline } from 'ionicons/icons';
import { selectUserInfo, setUserInfo } from '../../state/userSlice';
import { fetchUserHomes } from '../../components/firebase/homeData';
import { signOutUser } from '../../components/firebase/auth';
import tasksImg from '../../assets/tasks.jpg';
import homeImg from '../../assets/homes/home1.png';
import asset from '../../assets/asset3.png';
import { IonCard, IonLabel, IonCardContent, IonCardHeader, IonCardTitle, IonCol, IonContent, IonGrid, IonIcon, IonImg, IonPage, IonRow } from '@ionic/react';
import { useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';
import { homeOutline, businessOutline, listOutline, cashOutline, documentTextOutline, storefrontOutline } from 'ionicons/icons';

// interface HomeCardProps {
//   home: { id: string; name: string };
//   onClick: () => void;
// }

// const cardStyles = {
//   minWidth: 100,
//   padding: 2,
//   margin: 2,
//   textAlign: 'center',
//   background: 'rgba(255, 255, 255, 0.9)',
//   border: 'none',
//   boxShadow: 'none',
// };

// const mediaStyles = {
//   height: 70,
//   objectFit: 'contain',
// };

// const HomeCard: React.FC<HomeCardProps> = ({ home, onClick }) => {
//   const theme = useTheme();
//   const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

//   return (
//     <IonCard onClick={onClick} style={cardStyles}>
//       <IonImg src={homeImg} alt="Home" style={mediaStyles} />
//       <IonCardContent>
//         <IonCardTitle
//           style={{
//             lineHeight: 1.2,
//             whiteSpace: 'nowrap',
//             overflow: 'hidden',
//             textOverflow: 'ellipsis',
//             fontSize: isMobile ? '1rem' : '1.25rem',
//           }}
//         >
//           Expense Tracker
//         </IonCardTitle>
//       </IonCardContent>
//     </IonCard>
//   );
// };

// const TaskCard: React.FC<{ onClick: () => void }> = ({ onClick }) => (
//   <IonCard onClick={onClick} style={cardStyles}>
//     <IonImg src={tasksImg} alt="Task Manager" style={mediaStyles} />
//     <IonCardHeader>
//       <IonCardTitle>Task</IonCardTitle>
//     </IonCardHeader>
//   </IonCard>
// );

// const MyAssetsCard: React.FC<{ onClick: () => void }> = ({ onClick }) => (
//   <IonCard onClick={onClick} style={cardStyles}>
//     <IonImg src={asset} alt="My assets" style={mediaStyles} />
//     <IonCardHeader>
//       <IonCardTitle>Assets</IonCardTitle>
//     </IonCardHeader>
//   </IonCard>
// );

const Dashboard: React.FC = () => {
  const userInfo = useSelector(selectUserInfo);
  const dispatch = useDispatch();
  const history = useHistory();
  const [loading, setLoading] = useState(true);
  const [homes, setHomes] = useState<any[]>([]);

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

  const handleLogout = async () => {
    dispatch(setUserInfo({ username: 'Guest', email: '' }));
    await signOutUser();
    history.push('/login');
  };

  const navigateTo = (path: string) => {
    history.push(path);
  };

  if (loading) {
    return <IonContent>Loading...</IonContent>;
  }

  return (
    <IonPage>
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
      <IonContent>


        <IonCard>
          <IonCardHeader>
            <IonCardTitle>Home Expenses</IonCardTitle>
          </IonCardHeader>
          <IonCardContent>

            {
              homes.map((home,index)=>(
                <div>Deepu</div>
              ))
            }
            <div style={{ display: 'flex', justifyContent: 'space-around' }}>
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <div style={{ backgroundColor: '#FFCDD2', borderRadius: '50%', padding: '10px' }}>
                  <IonIcon icon={homeOutline} style={{ fontSize: '40px', color: '#D32F2F' }} />
                </div>
                <IonLabel style={{ fontWeight: 'bold', color: '#D32F2F' }}>Prayag</IonLabel>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <div style={{ backgroundColor: '#C5E1A5', borderRadius: '50%', padding: '10px' }}>
                  <IonIcon icon={businessOutline} style={{ fontSize: '40px', color: '#388E3C' }} />
                </div>
                <IonLabel style={{ fontWeight: 'bold', color: '#388E3C' }}>Radhas</IonLabel>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <div style={{ backgroundColor: '#BBDEFB', borderRadius: '50%', padding: '10px' }}>
                  <IonIcon icon={cashOutline} style={{ fontSize: '40px', color: '#1976D2' }} />
                </div>
                <IonLabel style={{ fontWeight: 'bold', color: '#1976D2' }}>Other</IonLabel>
              </div>
            </div>
          </IonCardContent>
        </IonCard>

        <IonCard>
          <IonCardHeader>
            <IonCardTitle>Personal Expenses</IonCardTitle>
          </IonCardHeader>
          <IonCardContent>
            <div style={{ display: 'flex', justifyContent: 'space-around' }}>
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <div style={{ backgroundColor: '#FFCDD2', borderRadius: '50%', padding: '10px' }}>
                  <IonIcon icon={homeOutline} style={{ fontSize: '40px', color: '#D32F2F' }} />
                </div>
                <IonLabel style={{ fontWeight: 'bold', color: '#D32F2F' }}>I owe</IonLabel>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <div style={{ backgroundColor: '#C5E1A5', borderRadius: '50%', padding: '10px' }}>
                  <IonIcon icon={businessOutline} style={{ fontSize: '40px', color: '#388E3C' }} />
                </div>
                <IonLabel style={{ fontWeight: 'bold', color: '#388E3C' }}>I owes</IonLabel>
              </div>
              
            </div>
          </IonCardContent>
        </IonCard>

        <IonCard>
          <IonCardHeader>
            <IonCardTitle>Others</IonCardTitle>
          </IonCardHeader>
          <IonCardContent>
            <div style={{ display: 'flex', justifyContent: 'space-around' }}>
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <div style={{ backgroundColor: '#FFE082', borderRadius: '50%', padding: '10px' }}>
                  <IonIcon icon={listOutline} style={{ fontSize: '40px', color: '#FBC02D' }} />
                </div>
                <IonLabel style={{ fontWeight: 'bold', color: '#FBC02D' }}>Tasks</IonLabel>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <div style={{ backgroundColor: '#FFCCBC', borderRadius: '50%', padding: '10px' }}>
                  <IonIcon icon={storefrontOutline} style={{ fontSize: '40px', color: '#E64A19' }} />
                </div>
                <IonLabel style={{ fontWeight: 'bold', color: '#E64A19' }}>Assets</IonLabel>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <div style={{ backgroundColor: '#D1C4E9', borderRadius: '50%', padding: '10px' }}>
                  <IonIcon icon={documentTextOutline} style={{ fontSize: '40px', color: '#673AB7' }} />
                </div>
                <IonLabel style={{ fontWeight: 'bold', color: '#673AB7' }}>Warranty</IonLabel>
              </div>
            </div>
          </IonCardContent>
        </IonCard>



        {/* <IonGrid>
          {homes.map((home, index) => (
            <React.Fragment key={home.id}>
              <IonRow>
                <IonCol size="12">
                  <Typography variant="h5" component="div" sx={{ margin: 2, textAlign: 'center' }}>
                    {home.name}
                  </Typography>
                </IonCol>

                <IonCol size="12">
                  <HomeCard home={home} onClick={() => navigateTo(`/home/${home.familyid}`)} />
                </IonCol>
              </IonRow>



              <IonRow>
                <IonCol size="6">
                  <TaskCard onClick={() => navigateTo(`/home/${home.familyid}/tasks`)} />
                </IonCol>
                <IonCol size="6">
                  <MyAssetsCard onClick={() => navigateTo(`/home/${home.familyid}/my-assets`)} />
                </IonCol>
              </IonRow>

              <IonRow>
                <IonCol size="12">
                  <Divider sx={{ margin: 2 }} />
                </IonCol>
              </IonRow>
            </React.Fragment>
          ))}
        </IonGrid>

         */}
      </IonContent>
    </IonPage>
  );
};

export default Dashboard;
