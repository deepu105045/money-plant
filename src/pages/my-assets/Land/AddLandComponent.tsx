import React, { useState } from "react";
import { TextField, Button, Box } from "@mui/material";
import { IonHeader, IonToolbar, IonButtons, IonButton, IonIcon, IonTitle, IonContent, IonModal } from "@ionic/react";
import { arrowBack } from "ionicons/icons";

const AddLandComponent = ({ isOpen, onClose, onAddLand }) => {
  const [landAddress, setLandAddress] = useState("");
  const [ownerName, setOwnerName] = useState("");
  const [currentValue, setCurrentValue] = useState("");

  const handleAddLand = () => {
    const landData = {
      landAddress,
      ownerName,
      currentValue: Number(currentValue),
    };
    onAddLand(landData);
    resetFields();
  };

  const resetFields = () => {
    setLandAddress("");
    setOwnerName("");
    setCurrentValue("");
  };

  return (
    <IonModal isOpen={isOpen} onDidDismiss={onClose}>
      <IonHeader>
        <IonToolbar>
          <IonButtons slot="start">
            <IonButton onClick={onClose}>
              <IonIcon icon={arrowBack} />
            </IonButton>
          </IonButtons>
          <IonTitle>Add Land</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent>
        <Box
          display="flex"
          flexDirection="column"
          alignItems="center"
          gap={2}
          sx={{ marginTop: "20px", padding: "20px" }}
        >
          <TextField
            label="Land Address"
            variant="outlined"
            value={landAddress}
            onChange={(e) => setLandAddress(e.target.value)}
            fullWidth
            sx={{ maxWidth: "400px" }}
          />
          <TextField
            label="Owner Name"
            variant="outlined"
            value={ownerName}
            onChange={(e) => setOwnerName(e.target.value)}
            fullWidth
            sx={{ maxWidth: "400px" }}
          />
          <TextField
            label="Current Value"
            variant="outlined"
            type="number"
            value={currentValue}
            onChange={(e) => setCurrentValue(e.target.value)}
            fullWidth
            sx={{ maxWidth: "400px" }}
          />
          <Button
            variant="contained"
            color="primary"
            onClick={handleAddLand}
            sx={{ width: "200px" }}
          >
            ADD Land
          </Button>
        </Box>
      </IonContent>
    </IonModal>
  );
};

export default AddLandComponent;
