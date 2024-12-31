import React, { useState, useEffect } from 'react';
import {
  IonPage,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonButtons,
  IonBackButton,
  IonFab,
  IonFabButton,
  IonIcon,
  IonLoading 
} from '@ionic/react';
import { add } from 'ionicons/icons';
import { getAssetByType, addAsset, deleteAsset, editAsset } from '../../../components/firebase/assetService';
import { useHistory, useParams } from 'react-router-dom';
import BankAccountList from './BankAccountList'; // Import the new component
import BankAccountForm from './BankAccountForm';
const BankPage: React.FC = () => {
  // const history = useHistory();
  const assetType = 'BANK';
  const { id: familyId } = useParams<{ id: string }>();
  const [bankAccounts, setBankAccounts] = useState<any[]>([]);
  const [total, setTotal] = useState<number>(0);
  const [isModalOpen, setIsModalOpen] = useState(false);
 
  const [loading, setLoading] = useState(false); // State to control the loading spinner

  useEffect(() => {
    const fetchBankAccounts = async () => {
      try {
        const { accounts, total } = await getAssetByType(familyId, assetType,'amount');
        setBankAccounts(accounts);
        setTotal(total);
      } catch (error) {
        console.error('Error fetching bank accounts:', error);
      }
    };
    fetchBankAccounts();
  }, [familyId]);

  const handleFormSubmit = async (newAccount: any) => {
    setLoading(true); 
    try {
      await addAsset(familyId, newAccount, assetType); 
      refreshBankAccounts();
    } catch (error) {
      console.error('Error saving bank account:', error);
    } finally {
      setLoading(false); 
    }
  };

  const refreshBankAccounts = async () => {
    const { accounts, total } = await getAssetByType(familyId, assetType,'amount');
    setBankAccounts(accounts);
    setTotal(total);
  };

  const handleDelete = async (accountId: string) => {
    setLoading(true); 
    try {
      await deleteAsset(familyId, accountId, assetType);
      refreshBankAccounts();
    } catch (error) {
      console.error('Error deleting bank account:', error);
    } finally {
      setLoading(false); 
    }
  };

  const handleEdit = async (account: any) => {
    setLoading(true); 
    try {
      await editAsset(familyId, account, assetType);
      refreshBankAccounts();
    } catch (error) {
      console.error('Error editing bank account:', error);
    } finally {
      setLoading(false); 
    }
  };

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonButtons slot="start">
            <IonBackButton defaultHref="/" />
          </IonButtons>
          <IonTitle>My Bank Details</IonTitle>
        </IonToolbar>
      </IonHeader>

      <IonContent>
        <BankAccountList
          bankAccounts={bankAccounts}
          total={total}
          onDelete={handleDelete}
          onEdit={handleEdit}
        />

        <IonFab slot="fixed" vertical="bottom" horizontal="center">
          <IonFabButton onClick={() => setIsModalOpen(true)}>
            <IonIcon icon={add}></IonIcon>
          </IonFabButton>
        </IonFab>

        <BankAccountForm
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onAddAccount={handleFormSubmit} // Pass the handleFormSubmit function
        />

        <IonLoading isOpen={loading} message={'Please wait...'} /> {/* Loader for async operations */}
      </IonContent>

    </IonPage>
  );
};

export default BankPage;
