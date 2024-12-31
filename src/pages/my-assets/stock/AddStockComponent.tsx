import React, { useState } from "react";
import { TextField, Button, Box } from "@mui/material";
import { IonHeader, IonToolbar, IonButtons, IonButton, IonIcon, IonTitle, IonContent, IonModal } from "@ionic/react";
import { arrowBack } from "ionicons/icons";

const AddStockComponent = ({ isOpen, onClose, onAddStock }) => {
  const [stockName, setStockName] = useState("");
  const [accountHolderName, setAccountHolderName] = useState("");
  const [currentValue, setCurrentValue] = useState("");

  const handleAddStock = () => {
    const stockData = {
      stockName,
      accountHolderName,
      currentValue: Number(currentValue),
    };
    onAddStock(stockData);
    resetFields();
  };

  const resetFields = () => {
    setStockName("");
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
          <IonTitle>Add Stock</IonTitle>
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
            label="Stock Name"
            variant="outlined"
            value={stockName}
            onChange={(e) => setStockName(e.target.value)}
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
            onClick={handleAddStock}
            sx={{ width: "200px" }}
          >
            ADD Stock
          </Button>
        </Box>
      </IonContent>
    </IonModal>
  );
};

export default AddStockComponent;
