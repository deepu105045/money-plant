import { Redirect, Route } from 'react-router-dom';
import {
  IonApp,
  IonRouterOutlet,
  setupIonicReact
} from '@ionic/react';
import { IonReactRouter } from '@ionic/react-router';
import { Provider } from 'react-redux';


/* Core CSS required for Ionic components to work properly */
import '@ionic/react/css/core.css';

/* Basic CSS for apps built with Ionic */
import '@ionic/react/css/normalize.css';
import '@ionic/react/css/structure.css';
import '@ionic/react/css/typography.css';

/* Optional CSS utils that can be commented out */
import '@ionic/react/css/padding.css';
import '@ionic/react/css/float-elements.css';
import '@ionic/react/css/text-alignment.css';
import '@ionic/react/css/text-transformation.css';
import '@ionic/react/css/flex-utils.css';
import '@ionic/react/css/display.css';

/**
 * Ionic Dark Mode
 * -----------------------------------------------------
 * For more info, please see:
 * https://ionicframework.com/docs/theming/dark-mode
 */

/* import '@ionic/react/css/palettes/dark.always.css'; */
/* import '@ionic/react/css/palettes/dark.class.css'; */
import '@ionic/react/css/palettes/dark.system.css';

/* Theme variables */
import './theme/variables.css';
import Login from './pages/Login/Login';
import Dashboard from './pages/Dashboard/Dashboard';
import { store, persistor } from './state/store';
import Registration from './pages/Register/Registeration';
import { PersistGate } from 'redux-persist/integration/react';
import HomeDashboard from './pages/Home/Home-dashboard';
import Tasks from './pages/tasks/Task-dashboard';
import TrendChart from './pages/Trend/TrendChart';
import MyAssetsDashboard from './pages/my-assets/MyAssetsDashboard';


setupIonicReact();

const App: React.FC = () => (
  <IonApp>
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>

        <IonReactRouter>
          <IonRouterOutlet>
            <Route exact path="/"><Redirect to="/login" /></Route>
            <Route exact path="/login"><Login /></Route>

            <Route path='/dashboard' component={Dashboard}></Route>
            <Route path="/register" component={Registration}></Route>
            
            <Route path="/home/:id" component={HomeDashboard} />
            <Route path="/home/:id/trend" component={TrendChart} />

            <Route path= "/task" component={Tasks}/>
            <Route path= "/my-assets" component={MyAssetsDashboard}/>

          </IonRouterOutlet>
        </IonReactRouter>
      </PersistGate>
    </Provider>

  </IonApp>
);

export default App;
