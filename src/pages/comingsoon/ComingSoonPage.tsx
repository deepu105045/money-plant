import React from 'react';
import {
  IonPage,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonIcon,
  IonText,
  IonGrid,
  IonRow,
  IonCol,
  IonButtons,
  IonBackButton
} from '@ionic/react';
import { build, alarm, time } from 'ionicons/icons';

const ComingSoonPage: React.FC = () => {
  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonButtons slot="start">
            <IonBackButton defaultHref="/" />
          </IonButtons>
          <IonTitle>Coming Soon!</IonTitle>
        </IonToolbar>
      </IonHeader>

      <IonContent className="ion-padding">
        <IonGrid>
          <IonRow>
            <IonCol className="ion-text-center">
              <IonIcon icon={build} size="large" />
              <IonText>
                <h1>🔧 We're Building Something Awesome!</h1>
              </IonText>
            </IonCol>
          </IonRow>
          <IonRow>
            <IonCol className="ion-text-center">
              <IonIcon icon={alarm} size="large" />
              <IonText>
                <h2>⏳ Patience is a Virtue!</h2>
              </IonText>
            </IonCol>
          </IonRow>
          <IonRow>
            <IonCol className="ion-text-center">
              <IonIcon icon={time} size="large" />
              <IonText>
                <h3>🚧 Check back in a bit...</h3>
                <p>We're brewing some magic behind the scenes!</p>
              </IonText>
            </IonCol>
          </IonRow>
        </IonGrid>

        <IonText className="ion-text-center" style={{ marginTop: '20px' }}>
          <p>Thank you for your patience! You rock! 🌟</p>
        </IonText>
      </IonContent>
    </IonPage>
  );
};

export default ComingSoonPage;
