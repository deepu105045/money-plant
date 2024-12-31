import React, { useState } from "react";
import { TextField, Button, Box } from "@mui/material";
import { IonHeader, IonToolbar, IonButtons, IonButton, IonIcon, IonTitle, IonContent, IonModal } from "@ionic/react";
import { arrowBack } from "ionicons/icons";

const AddFundComponent = ({ isOpen, onClose, onAddFund }) => {
  const [fundName, setFundName] = useState("");
  const [accountHolderName, setAccountHolderName] = useState("");
  const [currentValue, setCurrentValue] = useState("");

  const handleAddFund = () => {
    const fundData = {
      fundName,
      accountHolderName,
      currentValue: Number(currentValue),
    };

    onAddFund(fundData);
    resetFields();
  };

  const resetFields = () => {
    setFundName("");
    setAccountHolderName("");
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
          <IonTitle>Add Fund</IonTitle>
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
            label="Fund Name"
            variant="outlined"
            value={fundName}
            onChange={(e) => setFundName(e.target.value)}
            fullWidth
            sx={{ maxWidth: "400px" }}
          />
          <TextField
            label="Account Holder Name"
            variant="outlined"
            value={accountHolderName}
            onChange={(e) => setAccountHolderName(e.target.value)}
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
            onClick={handleAddFund}
            sx={{ width: "200px" }}
          >
            ADD Fund
          </Button>
        </Box>
      </IonContent>
    </IonModal>
  );
};

export default AddFundComponent;
