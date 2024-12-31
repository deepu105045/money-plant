import React, { useState } from 'react';
import { IonPage, IonHeader, IonToolbar, IonButtons, IonBackButton, IonTitle, IonContent, IonGrid, IonRow, IonCol, IonItem, IonLabel, IonInput, IonButton } from '@ionic/react';
import { useHistory } from 'react-router-dom';
import TextField from '@mui/material/TextField';
import { addEvent } from '../../components/firebase/eventService'
import { useSelector, useDispatch } from 'react-redux';
import { selectUserInfo, setUserInfo } from '../../state/userSlice';

const CreateEvent: React.FC = () => {
  const userInfo = useSelector(selectUserInfo);
  const [eventName, setEventName] = useState<string>('');
  const history = useHistory();

  const handleSave = () => {

    const  email = userInfo.email
     let obj = {eventName,email}
    addEvent(obj)
    history.goBack();
  };

  const handleInputChange = (e: CustomEvent) => {
    const inputValue = (e.target as HTMLInputElement).value;
    setEventName(inputValue);
  };

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonButtons slot="start">
            <IonBackButton defaultHref="/" />
          </IonButtons>
          <IonTitle>ADD an event</IonTitle>
        </IonToolbar>
      </IonHeader>

      <IonContent>
        <IonGrid>
          <IonRow>
            <IonCol size="12">
              <IonItem>        
                <TextField id="standard-basic" label="Event Name" variant="standard"
                 onChange={(e) => handleInputChange(e)} />
              </IonItem>
            </IonCol>
          </IonRow>

          <IonRow>
            <IonCol size="12">

            </IonCol>
          </IonRow>

          <IonRow>
            <IonCol size="12">
              <IonButton expand="block" onClick={handleSave}>
                Save Event
              </IonButton>
            </IonCol>
          </IonRow>
        </IonGrid>
      </IonContent>
    </IonPage>
  );
};

export default CreateEvent;
