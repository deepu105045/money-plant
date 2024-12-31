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

interface MutualFundListProps {
  mutualFunds: any[];
  total: number;
  onDelete: (accountId: string) => void;
  onEdit: (account: any) => Promise<void>;
}

const MutualFundList: React.FC<MutualFundListProps> = ({ mutualFunds, total, onDelete, onEdit }) => {
  const [isAlertOpen, setIsAlertOpen] = useState(false);
  const [accountToDelete, setAccountToDelete] = useState<string | null>(null);
  const [expandedAccordion, setExpandedAccordion] = useState<string | null>(null);
  const fundValueRef = useRef<HTMLIonInputElement>(null); // Ref for capturing input element
  const [isEditing, setIsEditing] = useState<string | null>(null);
  const [editingAccount, setEditingAccount] = useState<any>(null);

  useEffect(() => {
    if (isEditing && fundValueRef.current) {
      fundValueRef.current.setFocus();
    }
  }, [isEditing]);

  const handleDeleteClick = (accountId: string) => {
    setAccountToDelete(accountId);
    setIsAlertOpen(true);
  };

  const confirmDelete = () => {
    if (accountToDelete) {
      onDelete(accountToDelete);
      setAccountToDelete(null);
    }
    setIsAlertOpen(false);
  };

  const handleSaveEdit = async () => {
    if (editingAccount && fundValueRef.current) {
      const inputElement = await fundValueRef.current.getInputElement();
      const updatedAmount = inputElement.value;

      const updatedAccount = { ...editingAccount, currentValue: updatedAmount };
      console.log(updatedAccount);

      await onEdit(updatedAccount);
      setIsEditing(null); 
    }
  };

  return (
    <>
      <IonCard>
        <IonCardContent style={{ backgroundColor: 'light' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <IonCardTitle><strong>Total</strong></IonCardTitle>
            <IonCardTitle>₹{total.toLocaleString()}</IonCardTitle>
          </div>
        </IonCardContent>
      </IonCard>

      {mutualFunds.map((account, index) => (
        <IonCard key={account.id || index} >
          <IonCardContent>
            <IonAccordionGroup value={expandedAccordion} onIonChange={(e) => setExpandedAccordion(e.detail.value)}>
              <IonAccordion value={account.fundName}>
                <IonItem
                  slot="header"
                  lines="none"
                  style={{ display: 'flex', justifyContent: 'space-between' }}
                >
                  <IonLabel>{account.fundName}</IonLabel>
                  {isEditing === account.id ? (
                    <IonInput
                      ref={fundValueRef} // Attach ref here
                      value={account.currentValue} // Use current amount as default
                    />
                  ) : (
                    <IonLabel>₹{account.currentValue}</IonLabel>
                  )}
                </IonItem>

                <div slot="content">
                  <IonGrid>
                    <IonRow>
                      <IonCol size="6">
                        <IonLabel><strong>Account Holder Name:</strong></IonLabel>
                      </IonCol>
                      <IonCol size="6">
                        <IonLabel>{account.accountHolderName}</IonLabel>
                      </IonCol>
                    </IonRow>
                    <IonRow>
                      <IonCol size="6">
                        <IonLabel><strong>Fund Name:</strong></IonLabel>
                      </IonCol>
                      <IonCol size="6">
                        <IonLabel>{account.fundName}</IonLabel>
                      </IonCol>
                    </IonRow>
                   
                    <IonRow>
                      <IonCol size="6">
                        <IonLabel><strong>Current Value:</strong></IonLabel>
                      </IonCol>
                      <IonCol size="6">
                        {isEditing === account.id ? (
                          <IonInput
                            ref={fundValueRef} // Attach ref here
                            value={account.currentValue} // Use current amount as default
                            style={{
                              padding: '5px',
                              borderRadius: '5px',
                              border: '1px solid #007aff',
                              backgroundColor: '#f0f0f0',
                              cursor: 'text'
                            }}
                          />
                        ) : (
                          `₹${account.currentValue}`
                        )}
                      </IonCol>
                    </IonRow>
                  </IonGrid>

                  <IonItem lines="none" style={{ justifyContent: 'space-between', marginTop: '10px' }}>
                    {isEditing === account.id ? (
                      <>
                        <IonButton size="small" onClick={handleSaveEdit}>
                          Save
                        </IonButton>
                        <IonButton size="small" color="danger" onClick={() => setIsEditing(null)}>
                          Cancel
                        </IonButton>
                      </>
                    ) : (
                      <>
                        <IonButton
                          size="small"
                          onClick={() => {
                            setIsEditing(account.id);
                            setEditingAccount(account);  // Set the current account in state
                          }}
                        >
                          Edit Account
                        </IonButton>
                        <IonButton color="danger" size="small" onClick={() => handleDeleteClick(account.id)}>
                          Delete
                        </IonButton>
                      </>
                    )}
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
        message="Are you sure you want to delete this bank account?"
        buttons={[
          {
            text: 'Cancel',
            role: 'cancel',
            handler: () => setIsAlertOpen(false)
          },
          {
            text: 'Delete',
            handler: confirmDelete
          }
        ]}
      />
    </>
  );
};

export default MutualFundList;