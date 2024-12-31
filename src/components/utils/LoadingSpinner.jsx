import React from "react";
import { IonSpinner } from "@ionic/react";

const LoadingSpinner = () => (
  <div
    style={{
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      height: "100%",
    }}
  >
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
            <IonSpinner name="crescent" />
            <p style={{ marginLeft: '10px', fontSize: '16px' }}>Fetching data... Please wait.</p>
          </div>
  </div>
);

export default LoadingSpinner;
