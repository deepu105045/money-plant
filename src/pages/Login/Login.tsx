import React, { useState } from 'react';
import { IonContent, IonPage, IonGrid, IonRow, IonCol } from '@ionic/react';
import { Typography, TextField, Button, Divider, Link, Box } from '@mui/material';
import GoogleButton from '../../assets/google.png';
import Header from '../../components/header/Header';
import { useHistory } from 'react-router-dom';
import { signInWithGoogle, signInWithEmailPassword } from '../../components/firebase/auth';
import { useDispatch } from 'react-redux';
import { setUserInfo } from '../../state/userSlice';

const Login: React.FC = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null); // State for error message
  const history = useHistory(); // Use useHistory hook
  const dispatch = useDispatch();

  const handleLogin = async (provider: 'google' | 'email' = 'email') => {
    setError(null); // Reset error message

    let user;
    if (provider === 'google') {
      user = await signInWithGoogle();
    } else {
      user = await signInWithEmailPassword(username, password);
    }

    if (user) {
      console.log('Login Component :: Logged in:', user.displayName);
      const userInfo = { username: user.displayName, email: user.email };
      dispatch(setUserInfo(userInfo));
      history.push('/dashboard');
    } else {
      console.log('Login failed');
      setError('Login failed. Please check your credentials and try again.');
    }
  };

  return (
    <IonPage>
      <IonContent className="ion-padding">
        <Header />
        <IonGrid>
          <IonRow className="ion-justify-content-center">
            <IonCol size="12" size-md="6" size-lg="4">
              <Box textAlign="center" mt={2} mb={2}>
                <Typography variant="h5" gutterBottom>Sign in</Typography>
              </Box>
            </IonCol>
          </IonRow>
          <IonRow className="ion-justify-content-center">
            <IonCol size="12" size-md="6" size-lg="4">
              <Box textAlign="center" mt={2} mb={2}>
                <Typography variant="body2" color="textSecondary">
                  Don't have an account? <Link href="/register">Create an Account</Link>
                </Typography>
              </Box>
            </IonCol>
          </IonRow>
          {error && (
            <IonRow className="ion-justify-content-center">
              <IonCol size="12" size-md="6" size-lg="4">
                <Typography color="error" variant="body2" textAlign="center">
                  {error}
                </Typography>
              </IonCol>
            </IonRow>
          )}
          <IonRow className="ion-justify-content-center">
            <IonCol size="12" size-md="6" size-lg="4">
              <Divider style={{ margin: '20px 0' }} />
              <Button
                fullWidth
                onClick={() => handleLogin('google')}
              >
                <img src={GoogleButton} alt="Google Icon" />
              </Button>
              <Divider style={{ margin: '20px 0' }}>
                <Typography variant="body2" color="textSecondary">OR</Typography>
              </Divider>
            </IonCol>
          </IonRow>
          <IonRow className="ion-justify-content-center">
            <IonCol size="12" size-md="6" size-lg="4">
              <TextField
                variant="outlined"
                margin="normal"
                required
                fullWidth
                id="email"
                label="Email Address"
                name="email"
                autoComplete="email"
                autoFocus
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
            </IonCol>
          </IonRow>
          <IonRow className="ion-justify-content-center">
            <IonCol size="12" size-md="6" size-lg="4">
              <TextField
                variant="outlined"
                margin="normal"
                required
                fullWidth
                name="password"
                label="Password"
                type="password"
                id="password"
                autoComplete="current-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </IonCol>
          </IonRow>
          <IonRow className="ion-justify-content-center">
            <IonCol size="12" size-md="6" size-lg="4">
              <Button
                type="submit"
                fullWidth
                variant="contained"
                color="primary"
                onClick={() => handleLogin('email')}
              >
                Login
              </Button>
            </IonCol>
          </IonRow>
        </IonGrid>
      </IonContent>
    </IonPage>
  );
};

export default Login;
