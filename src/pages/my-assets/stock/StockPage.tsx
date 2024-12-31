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
import AddStockComponent from "./AddStockComponent";
import StockList from "./StockList";
import { useParams } from "react-router-dom";
import { addAsset, deleteAsset, editAsset, getAssetByType  } from "../../../components/firebase/assetService";

const StockPage = () => {
  const assetType = "STOCK";
  const { id: familyId } = useParams<{ id: string }>();

  const [stocks, setStocks] = useState([]);
  const [total, setTotal] = useState<number>(0);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    refreshStocks();
  }, []);

  const refreshStocks = async () => {
    const { accounts, total } = await getAssetByType(familyId, assetType, "currentValue");
    setStocks(accounts);
    setTotal(total);
  };

  const handleStockAddition = async (stockData) => {
    await addAsset(familyId,stockData, assetType);
    refreshStocks();
    setShowModal(false);
  };

  const handleDelete = async (stockId: string) => {
    await deleteAsset(familyId,stockId, assetType);
    refreshStocks();
  };

  const handleEdit = async (stock) => {
    await editAsset(familyId,stock, assetType);
    refreshStocks();
  };

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonButtons slot="start">
            <IonBackButton defaultHref="/" />
          </IonButtons>
          <IonTitle>Stocks</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent>
        <StockList stocks={stocks} total={total} onDelete={handleDelete} onEdit={handleEdit} />
        <IonFab vertical="bottom" horizontal="end" slot="fixed">
          <IonFabButton color="secondary" onClick={() => setShowModal(true)}>
            <IonIcon icon={add} />
          </IonFabButton>
        </IonFab>
        <AddStockComponent
          isOpen={showModal}
          onClose={() => setShowModal(false)}
          onAddStock={handleStockAddition}
        />
      </IonContent>
    </IonPage>
  );
};

export default StockPage;
