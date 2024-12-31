import React, { useState, useEffect } from "react";
import {
  IonPage,
  IonHeader,
  IonTitle,
  IonToolbar,
  IonFab,
  IonFabButton,
  IonIcon,
  IonContent,
  IonButtons,
  IonBackButton,
} from "@ionic/react";
import { add } from "ionicons/icons";
import AddLandComponent from "./AddLandComponent";
import LandList from "./LandList";
import { useParams } from "react-router-dom";
import { addAsset, deleteAsset, editAsset, getAssetByType } from "../../../components/firebase/assetService";

const LandPage = () => {
  const assetType = "LAND";
  const { id: familyId } = useParams<{ id: string }>();

  const [lands, setLands] = useState([]);
  const [total, setTotal] = useState(0);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    refreshLands();
  }, []);

  const refreshLands = async () => {
    const { accounts, total } = await getAssetByType(familyId, assetType, "currentValue");
    setLands(accounts);
    setTotal(total);
  };

  const handleLandAddition = async (landData) => {
    await addAsset(familyId, landData, assetType);
    refreshLands();
    setShowModal(false);
  };

  const handleDelete = async (landId) => {
    await deleteAsset(familyId, landId, assetType);
    refreshLands();
  };

  const handleEdit = async (land) => {
    await editAsset(familyId, land, assetType);
    refreshLands();
  };

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonButtons slot="start">
            <IonBackButton defaultHref="/" />
          </IonButtons>
          <IonTitle>Lands</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent>
        <LandList lands={lands} total={total} onDelete={handleDelete} onEdit={handleEdit} />
        <IonFab vertical="bottom" horizontal="end" slot="fixed">
          <IonFabButton color="secondary" onClick={() => setShowModal(true)}>
            <IonIcon icon={add} />
          </IonFabButton>
        </IonFab>
        <AddLandComponent
          isOpen={showModal}
          onClose={() => setShowModal(false)}
          onAddLand={handleLandAddition}
        />
      </IonContent>
    </IonPage>
  );
};

export default LandPage;
