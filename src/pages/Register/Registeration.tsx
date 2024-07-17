import * as React from 'react';
import {
    IonPage, IonHeader, IonToolbar, IonTitle, IonContent,
    IonIcon, IonGrid, IonRow, IonCol, IonButton
} from '@ionic/react';
import { addCircleOutline } from 'ionicons/icons';
import Stepper from '@mui/material/Stepper';
import Step from '@mui/material/Step';
import StepLabel from '@mui/material/StepLabel';
import { Typography, TextField, Box, Button, Alert } from '@mui/material';
import { createUser } from '../../components/firebase/auth';
import { buildHome, fetchUserHomes } from '../../components/firebase/homeData';
import { useHistory } from 'react-router-dom';
import CheckIcon from '@mui/icons-material/Check';

const steps = ['User', 'Home', 'Finish!!'];

const Registration: React.FC = () => {
    const [activeStep, setActiveStep] = React.useState(0);
    const [username, setUsername] = React.useState('');
    const [email, setEmail] = React.useState('');
    const [password, setPassword] = React.useState('');
    const [homeName, setHomeName] = React.useState('');
    const [members, setMembers] = React.useState(['']);
    const [userCreationError, setUserCreationError] = React.useState<string | null>(null);
    const [homeCreationError, setHomeCreationError] = React.useState<string | null>(null);
    const [homes, setHomes] = React.useState<any[]>([]);
    const [homesExists, setHomeExists] = React.useState(false)

    const history = useHistory();

    const handleNext = () => {
        setActiveStep((prevActiveStep) => prevActiveStep + 1);
    };

    const handleAddUserToHome = () => {
        setMembers([...members, '']);
    };

    const handleMemberEmailChange = (index: number, email: string) => {
        const newMembers = [...members];
        newMembers[index] = email;
        setMembers(newMembers);
    };

    const createUserHandler = async (username: string, email: string, password: string) => {
        setUserCreationError(null);
        try {
            await createUser(email, password, username);
            const userHomes = await fetchUserHomes(email);
            setHomes(userHomes);
            if (userHomes.length > 0) {
                setHomeExists(true)

            } else {
                handleNext(); // Proceed to home creation if no homes exist
            }
        } catch (error) {
            console.error('Error creating user:', error);
            setUserCreationError('Failed to create user. Please try again.');
        }
    };

    const buildHomeHandler = async () => {
        setHomeCreationError(null);
        try {
            let allMembers = [...members, email];
            await buildHome(email, homeName, allMembers);
            handleNext();
            setTimeout(() => {
                history.push('/login');
            }, 2000); // Adjust the delay as needed
        } catch (error) {
            console.error('Error building home:', error);
            setHomeCreationError('Failed to build home. Please try again.');
        }
    };

    const loginHandler = async () => {
        history.push('/login');

    }

    const renderStepContent = (step: number) => {
        switch (step) {
            case 0:
                return (
                    <>
                        {userCreationError && (
                            <Alert severity="error">{userCreationError}</Alert>
                        )}

                        {
                            !homesExists && <IonGrid>
                                <IonRow className="ion-justify-content-center">
                                    <IonCol size="12" size-md="6" size-lg="4">
                                        <TextField
                                            variant="outlined"
                                            margin="normal"
                                            required
                                            fullWidth
                                            id="username"
                                            label="Username"
                                            name="username"
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
                                            id="email"
                                            label="Email Address"
                                            name="email"
                                            autoComplete="email"
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
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
                                            onClick={() => createUserHandler(username, email, password)}
                                            disabled={!username || !email || !password}
                                        >
                                            Create user
                                        </Button>
                                    </IonCol>
                                </IonRow>
                            </IonGrid>

                        }


                        {
                            homesExists &&
                            <IonGrid>
                                <IonRow>
                                    <IonCol>
                                        <Alert icon={<CheckIcon fontSize="inherit" />} severity="success">
                                            User, {email} has been creatd, and user is already part of home "{homes[0].name}"
                                        </Alert>
                                    </IonCol>
                                </IonRow>
                                <IonRow className="ion-justify-content-center">
                                    <IonCol size="12" size-md="6" size-lg="4">
                                        <Button
                                            type="submit"
                                            fullWidth
                                            variant="contained"
                                            color="primary"
                                            onClick={loginHandler}
                                        >
                                            Login
                                        </Button>
                                    </IonCol>
                                </IonRow>
                            </IonGrid>

                        }
                    </>
                );
            case 1:
                return (
                    <>
                        {homeCreationError && (
                            <Alert severity="error">{homeCreationError}</Alert>
                        )}
                        <IonGrid>
                            <IonRow className="ion-justify-content-center">
                                <IonCol size="12" size-md="6" size-lg="4">
                                    <TextField
                                        variant="outlined"
                                        margin="normal"
                                        required
                                        fullWidth
                                        id="home-name"
                                        label="Home Name"
                                        name="home-name"
                                        value={homeName}
                                        onChange={(e) => setHomeName(e.target.value)}
                                    />
                                </IonCol>
                            </IonRow>
                            {members.map((member, index) => (
                                <IonRow key={index} className="ion-justify-content-center">
                                    <IonCol size="12" size-md="6" size-lg="4">
                                        <TextField
                                            variant="outlined"
                                            margin="normal"
                                            required
                                            fullWidth
                                            id={`member-${index}`}
                                            label={`Member ${index + 1} Email`}
                                            name={`member-${index}`}
                                            value={member}
                                            onChange={(e) => handleMemberEmailChange(index, e.target.value)}
                                        />
                                    </IonCol>
                                </IonRow>
                            ))}
                            <IonRow className="ion-justify-content-center">
                                <IonCol size="12" size-md="6" size-lg="4">
                                    <IonButton fill="clear" onClick={handleAddUserToHome}>
                                        <IonIcon slot="start" icon={addCircleOutline} />
                                        Add more members
                                    </IonButton>
                                </IonCol>
                            </IonRow>
                            <IonRow className="ion-justify-content-center">
                                <IonCol size="12" size-md="6" size-lg="4">
                                    <IonButton onClick={buildHomeHandler} expand="block">
                                        Build Home
                                    </IonButton>
                                </IonCol>
                            </IonRow>
                        </IonGrid>
                    </>
                );
            case 2:
                return (
                    <Typography>Account has been created successfully. Redirecting to login...</Typography>
                );
            default:
                return 'Unknown step';
        }
    };

    return (
        <IonPage>
            <IonHeader>
                <IonToolbar>
                    <IonTitle>Registration</IonTitle>
                </IonToolbar>
            </IonHeader>
            <IonContent>
                <Box sx={{ width: '100%' }}>
                    <Stepper activeStep={activeStep}>
                        {steps.map((label, index) => (
                            <Step key={label}>
                                <StepLabel>{label}</StepLabel>
                            </Step>
                        ))}
                    </Stepper>
                    {activeStep === steps.length ? (
                        <React.Fragment>
                            <Typography sx={{ mt: 2, mb: 1 }}>
                                All steps completed - you're finished
                            </Typography>
                        </React.Fragment>
                    ) : (
                        <React.Fragment>
                            {renderStepContent(activeStep)}
                        </React.Fragment>
                    )}
                </Box>
            </IonContent>
        </IonPage>
    );
};

export default Registration;
