import React, { useState, useEffect } from 'react';
import { IonPage, IonHeader, IonToolbar, IonButtons, IonBackButton, IonTitle, IonContent, IonGrid, IonRow, IonCol, IonButton, IonFab, IonFabButton, IonIcon } from '@ionic/react';
import { add } from 'ionicons/icons';
import TextField from '@mui/material/TextField';
import MenuItem from '@mui/material/MenuItem';
import Autocomplete from '@mui/material/Autocomplete';
import { useSelector } from 'react-redux';
import { selectUserInfo } from '../../state/userSlice';
import { useParams } from 'react-router-dom';
import { addEventTransaction, getEventTransactionData } from '../../components/firebase/eventService';
import { addCategoryToConfig, getAllCategories } from '../../components/firebase/configService';

const AddEventTransaction: React.FC = () => {
  const userInfo = useSelector(selectUserInfo);
  const [transactionType, setTransactionType] = useState<string>('spending');
  const [category, setCategory] = useState<string>('');
  const [amount, setAmount] = useState<number | string>('');
  const [transactionDate, setTransactionDate] = useState<string>(
    new Date().toISOString().split('T')[0]
  );
  const [aggregatedData, setAggregatedData] = useState<{ category: string; totalAmount: number }[]>([]);
  const [showForm, setShowForm] = useState<boolean>(false);  
  const [savedCategories, setSavedCategories] = useState<string[]>([]);
  
  const { id } = useParams<{ id: string }>();

  useEffect(() => {
    fetchAggregatedData();
    getAllCategories().then(cat => {
      setSavedCategories(cat);
      console.log(cat);
    });
  }, []);

  const fetchAggregatedData = async () => {
    if (id) {
      const data = await getEventTransactionData(id);
      setAggregatedData(data || []);
    }
  };

  const handleSave = async () => {
    const email = userInfo.email;
    const obj = { email, eventId: id, transactionType, category, amount, transactionDate };
    
    await addEventTransaction(obj);
    await fetchAggregatedData();  // Refresh data after adding a transaction
    await addCategoryToConfig('cashflow', category);
    setShowForm(false);  // Hide form after saving
  };

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonButtons slot="start">
            <IonBackButton defaultHref="/" />
          </IonButtons>
          <IonTitle>Add your expenses </IonTitle>
        </IonToolbar>
      </IonHeader>

      <IonContent>
        <IonGrid>
          {showForm ? (
            <IonRow>
              <IonCol size="12">
                <TextField
                  fullWidth
                  label="Transaction Date"
                  type="date"
                  value={transactionDate}
                  onChange={(e) => setTransactionDate(e.target.value)}
                  InputLabelProps={{ shrink: true }}
                />
              </IonCol>
              <IonCol size="12">
                <TextField
                  id="transaction-type"
                  select
                  label="Transaction Type"
                  value={transactionType}
                  variant="standard"
                  fullWidth
                  onChange={(e) => setTransactionType(e.target.value)}
                >
                  <MenuItem value="spending">Spending</MenuItem>
                </TextField>
              </IonCol>

              <IonCol size="12">
                <Autocomplete
                  options={savedCategories}
                  value={category}
                  onChange={(event, newValue) => setCategory(newValue || '')}
                  onInputChange={(event, newInputValue) => setCategory(newInputValue)}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label="Category"
                      variant="standard"
                      fullWidth
                    />
                  )}
                />
              </IonCol>

              <IonCol size="12">
                <TextField
                  id="amount"
                  label="Amount"
                  variant="standard"
                  type="number"
                  fullWidth
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                />
              </IonCol>

              <IonCol size="12">
                <IonButton expand="block" onClick={handleSave}>
                  Save
                </IonButton>
              </IonCol>
            </IonRow>
          ) : (
            <IonRow>
              <IonCol size="12">
                <h2>Expenses</h2>
                <table style={{ width: '100%', border: '1px solid black' }}>
                  <thead>
                    <tr>
                      <th style={{ border: '1px solid black', padding: '8px' }}>Category</th>
                      <th style={{ border: '1px solid black', padding: '8px' }}>Amount</th>
                    </tr>
                  </thead>
                  <tbody>
                    {aggregatedData.map((item, index) => (
                      <tr key={index}>
                        <td style={{ border: '1px solid black', padding: '8px' }}>{item.category}</td>
                        <td style={{ border: '1px solid black', padding: '8px' }}>{item.totalAmount}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </IonCol>
            </IonRow>
          )}
        </IonGrid>

        <IonFab vertical="bottom" horizontal="center" slot="fixed">
          <IonFabButton onClick={() => setShowForm((prev) => !prev)}>
            <IonIcon icon={add} />
          </IonFabButton>
        </IonFab>
      </IonContent>
    </IonPage>
  );
};

export default AddEventTransaction;
