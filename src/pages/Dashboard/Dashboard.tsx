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
import { IonCard, IonCardContent, IonCardHeader, IonCardTitle, IonCol, IonContent, IonGrid, IonIcon, IonImg, IonPage, IonRow } from '@ionic/react';
import { useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';

interface HomeCardProps {
  home: { id: string; name: string };
  onClick: () => void;
}

const cardStyles = {
  minWidth: 100,
  padding: 2,
  margin: 2,
  textAlign: 'center',
  background: 'rgba(255, 255, 255, 0.9)',
  border: 'none',
  boxShadow: 'none',
};

const mediaStyles = {
  height: 100,
  objectFit: 'contain',
};

const HomeCard: React.FC<HomeCardProps> = ({ home, onClick }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  return (
    <IonCard onClick={onClick} style={cardStyles}>
      {/* <IonCardHeader>
        <IonCardTitle style={{ lineHeight: 1.2 }}>{home.name}</IonCardTitle>
      </IonCardHeader> */}
      <IonImg src={homeImg} alt="Home" style={mediaStyles} />
      <IonCardContent>
        <IonCardTitle
          style={{
            lineHeight: 1.2,
            whiteSpace: 'nowrap',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            fontSize: isMobile ? '1rem' : '1.25rem',
          }}
        >
          Expense Tracker
        </IonCardTitle>
      </IonCardContent>
    </IonCard>
  );
};

const TaskCard: React.FC<{ onClick: () => void }> = ({ onClick }) => (
  <IonCard onClick={onClick} style={cardStyles}>
    <IonImg src={tasksImg} alt="Task Manager" style={mediaStyles} />
    <IonCardHeader>
      <IonCardTitle>Task</IonCardTitle>
    </IonCardHeader>
  </IonCard>
);

const MyAssetsCard: React.FC<{ onClick: () => void }> = ({ onClick }) => (
  <IonCard onClick={onClick} style={cardStyles}>
    <IonImg src={asset} alt="My assets" style={mediaStyles} />
    <IonCardHeader>
      <IonCardTitle>Our Assets</IonCardTitle>
    </IonCardHeader>
  </IonCard>
);

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
        <IonGrid>
          {homes.map((home) => (
            <IonRow key={home.id}>
              <IonCol size="12">
                <Typography variant="h5" component="div" sx={{ margin: 2, textAlign: 'center' }}>
                  {home.name}
                </Typography>
              </IonCol>

              <IonCol size="12">
                <HomeCard home={home} onClick={() => navigateTo(`/home/${home.familyid}`)} />
              </IonCol>
              <IonCol size="6">
                <TaskCard onClick={() => navigateTo(`/home/${home.familyid}/tasks`)} />
              </IonCol>
              <IonCol size="6">
                <MyAssetsCard onClick={() => navigateTo(`/home/${home.familyid}/my-assets`)} />
              </IonCol>
            </IonRow>
          ))}
          <Divider sx={{ margin: 2 }} />
        </IonGrid>
      </IonContent>
    </IonPage>
  );
};

export default Dashboard;
