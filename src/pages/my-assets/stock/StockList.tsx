import React, { useState, useRef, useEffect } from 'react';
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
  IonInput,
  IonGrid,
  IonRow,
  IonCol
} from '@ionic/react';

interface StockListProps {
  stocks: any[];
  total: number;
  onDelete: (stockId: string) => void;
  onEdit: (stock: any) => Promise<void>;
}

const StockList: React.FC<StockListProps> = ({ stocks, total, onDelete, onEdit }) => {
  const [isAlertOpen, setIsAlertOpen] = useState(false);
  const [stockToDelete, setStockToDelete] = useState<string | null>(null);
  const [expandedAccordion, setExpandedAccordion] = useState<string | null>(null);
  const stockValueRef = useRef<HTMLIonInputElement>(null);
  const [isEditing, setIsEditing] = useState<string | null>(null);
  const [editingStock, setEditingStock] = useState<any>(null);

  useEffect(() => {
    if (isEditing && stockValueRef.current) {
      stockValueRef.current.setFocus();
    }
  }, [isEditing]);

  const handleDeleteClick = (stockId: string) => {
    setStockToDelete(stockId);
    setIsAlertOpen(true);
  };

  const confirmDelete = () => {
    if (stockToDelete) {
      onDelete(stockToDelete);
      setStockToDelete(null);
    }
    setIsAlertOpen(false);
  };

/*************  ✨ Codeium Command ⭐  *************/
/**
 * Saves the edits made to the currently editing stock.
 * 
/******  2c27f7bd-39f6-4eb3-9164-727edcc8c42b  *******/
  const handleSaveEdit = async () => {
    if (editingStock && stockValueRef.current) {
      const inputElement = await stockValueRef.current.getInputElement();
      const updatedValue = inputElement.value;

      const updatedStock = { ...editingStock, currentValue: updatedValue };
      await onEdit(updatedStock);
      setIsEditing(null);
    }
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

      {stocks.map((stock, index) => (
        <IonCard key={stock.id || index}>
          <IonCardContent>
            <IonAccordionGroup value={expandedAccordion} onIonChange={(e) => setExpandedAccordion(e.detail.value)}>
              <IonAccordion value={stock.stockName}>
                <IonItem slot="header" lines="none">
                  <IonLabel>{stock.stockName}</IonLabel>
                  <IonLabel>₹{stock.currentValue}</IonLabel>
                </IonItem>
                <div slot="content">
                  <IonGrid>
                    <IonRow>
                      <IonCol>
                        <IonLabel><strong>Account Holder:</strong> {stock.accountHolderName}</IonLabel>
                      </IonCol>
                    </IonRow>
                  </IonGrid>
                  <IonItem lines="none">
                    <IonButton
                      onClick={() => setEditingStock(stock)}
                    >
                      Edit
                    </IonButton>
                    <IonButton color="danger" onClick={() => handleDeleteClick(stock.id)}>
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
        message="Are you sure you want to delete this stock?"
        buttons={[
          { text: 'Cancel', role: 'cancel' },
          { text: 'Delete', handler: confirmDelete }
        ]}
      />
    </>
  );
};

export default StockList;
