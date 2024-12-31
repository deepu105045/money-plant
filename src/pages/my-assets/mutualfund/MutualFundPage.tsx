import React, { useState, useEffect } from "react";
import {
  IonContent,
  IonPage,
  IonHeader,
  IonTitle,
  IonToolbar,
  IonFab,
  IonFabButton,
  IonIcon,
  IonButtons,
  IonBackButton,
} from "@ionic/react";
import { add } from "ionicons/icons";
import AddFundComponent from "./AddFundComponent";
import { getAssetByType, addAsset, deleteAsset, editAsset } from "../../../components/firebase/assetService";
import MutualFundList from "./MutualFundList";
import { useParams } from "react-router-dom";
import LoadingSpinner from "../../../components/utils/LoadingSpinner";

const MutualFundPage = () => {
  const assetType = "MUTUAL_FUND";
  const { id: familyId } = useParams<{ id: string }>();

  const [mutualFunds, setMutualFunds] = useState([]);
  const [total, setTotal] = useState<number>(0);
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(false); // State to control the loading spinner for data fetching
  const [actionLoading, setActionLoading] = useState(false); // State to control the spinner for actions (add/edit)

  useEffect(() => {
    refreshMutualFunds();
  }, [familyId]);

  const refreshMutualFunds = async () => {
    setLoading(true); // Start loading before fetching data
    try {
      const { accounts, total } = await getAssetByType(familyId, assetType, "currentValue");
      setMutualFunds(accounts);
      setTotal(total);
    } catch (error) {
      console.error("Error fetching mutual funds:", error);
    } finally {
      setLoading(false); // Stop loading after fetching data
    }
  };

  const handleFundAddition = async (fundData) => {
    setActionLoading(true); // Start action spinner
    try {
      await addAsset(familyId, fundData, assetType);
      await refreshMutualFunds();
    } catch (error) {
      console.error("Error saving mutual fund:", error);
    } finally {
      setActionLoading(false); // Stop action spinner
      setShowModal(false);
    }
  };

  const handleDelete = async (accountId: string) => {
    setLoading(true); // Use general loading for delete actions
    setActionLoading(true); // Start action spinner

    try {
      await deleteAsset(familyId, accountId, assetType);
      refreshMutualFunds();
    } catch (error) {
      console.error("Error deleting mutual fund:", error);
    } finally {
      setLoading(false); // Stop general loading
            setActionLoading(false); // Stop action spinner

    }
  };

  const handleEdit = async (account: any) => {
    setActionLoading(true); // Start action spinner
    try {
      await editAsset(familyId, account, assetType);
      refreshMutualFunds();
    } catch (error) {
      console.error("Error editing mutual fund:", error);
    } finally {
      setActionLoading(false); // Stop action spinner
    }
  };

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonButtons slot="start">
            <IonBackButton defaultHref="/" />
          </IonButtons>
          <IonTitle>Mutual Funds</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent>
        {loading ? (
          <LoadingSpinner />
        ) : (
          <>
            <MutualFundList
              mutualFunds={mutualFunds}
              total={total}
              onDelete={handleDelete}
              onEdit={handleEdit}
            />
            <IonFab vertical="bottom" horizontal="end" slot="fixed">
              <IonFabButton color="secondary" onClick={() => setShowModal(true)}>
                <IonIcon icon={add} />
              </IonFabButton>
            </IonFab>
            <AddFundComponent
              isOpen={showModal}
              onClose={() => setShowModal(false)}
              onAddFund={handleFundAddition}
            />
          </>
        )}
        {/* Show action spinner for add/edit */}
        {actionLoading && <LoadingSpinner />}
      </IonContent>
    </IonPage>
  );
};

export default MutualFundPage;
