import React from "react";
import {
  IonCard,
  IonCardContent,
  IonAccordionGroup,
  IonAccordion,
  IonItem,
  IonLabel,
  IonButton,
  IonCardTitle,
  IonAlert,
  IonGrid,
  IonRow,
  IonCol
} from "@ionic/react";

const LandList = ({ lands, total, onDelete, onEdit }) => {
  const [isAlertOpen, setIsAlertOpen] = useState(false);
  const [landToDelete, setLandToDelete] = useState(null);

  const handleDeleteClick = (landId) => {
    setLandToDelete(landId);
    setIsAlertOpen(true);
  };

  const confirmDelete = () => {
    if (landToDelete) {
      onDelete(landToDelete);
      setLandToDelete(null);
    }
    setIsAlertOpen(false);
  };

  return (
    <>
      <IonCard>
        <IonCardContent>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <IonCardTitle><strong>Total</strong></IonCardTitle>
            <IonCardTitle>₹{total.toLocaleString()}</IonCardTitle>
          </div>
        </IonCardContent>
      </IonCard>

      {lands.map((land, index) => (
        <IonCard key={land.id || index}>
          <IonCardContent>
            <IonAccordionGroup>
              <IonAccordion value={land.landAddress}>
                <IonItem slot="header" lines="none">
                  <IonLabel>{land.landAddress}</IonLabel>
                  <IonLabel>₹{land.currentValue}</IonLabel>
                </IonItem>
                <div slot="content">
                  <IonGrid>
                    <IonRow>
                      <IonCol>
                        <IonLabel><strong>Owner Name:</strong> {land.ownerName}</IonLabel>
                      </IonCol>
                    </IonRow>
                  </IonGrid>
                  <IonItem lines="none">
                    <IonButton onClick={() => onEdit(land)}>
                      Edit
                    </IonButton>
                    <IonButton color="danger" onClick={() => handleDeleteClick(land.id)}>
                      Delete
                    </IonButton>
                  </IonItem>
                </div>
              </IonAccordion>
            </IonAccordionGroup>
          </IonCardContent>
        </IonCard>
      ))}

      <IonAlert
        isOpen={isAlertOpen}
        onDidDismiss={() => setIsAlertOpen(false)}
        header="Confirm Delete"
        message="Are you sure you want to delete this land?"
        buttons={[
          { text: 'Cancel', role: 'cancel' },
          { text: 'Delete', handler: confirmDelete }
        ]}
      />
    </>
  );
};

export default LandList;
