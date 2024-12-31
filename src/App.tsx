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
import './index.css';


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
import BankPage from './pages/my-assets/bank/BankPage';
import MutualFundPage from './pages/my-assets/mutualfund/MutualFundPage';
import ComingSoonPage from './pages/comingsoon/ComingSoonPage';
import CreateEvent from './pages/events/CreateEvent';
import AddEventTransaction from './pages/events/AddEventTransaction';
import Bingo from './components/Bingo/Bingo';
import StockPage from './pages/my-assets/stock/StockPage';
import LandPage from './pages/my-assets/Land/LandPage';
import NetWorthPage from './pages/my-assets/NetWorth/NetWorthPage';


setupIonicReact();

const App: React.FC = () => (
  <IonApp>
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>

        <IonReactRouter>
          <IonRouterOutlet>
            <Route exact path="/"><Redirect to="/login" /></Route>
            <Route exact path="/bingo" component={Bingo}></Route>
            <Route exact path="/login"><Login /></Route>

            <Route path='/dashboard' component={Dashboard}></Route>
            <Route path="/register" component={Registration}></Route>
            <Route path="/create-event" component={CreateEvent}></Route>
      
            <Route path= "/home/:id" component={HomeDashboard} />
            <Route path= "/home/:id/tasks" component={Tasks}/>

            <Route path="/event/:id" component={AddEventTransaction}/>
            
            <Route path= "/home/:id/assets/bank" component={BankPage}/>
            <Route path= "/home/:id/assets/mutualfund" component={MutualFundPage} />
            <Route path= "/home/:id/assets/stock" component={StockPage} />
            <Route path= "/home/:id/assets/land" component={StockPage} />
            <Route path= "/home/:id/assets/networth" component={LandPage} />



          </IonRouterOutlet>
        </IonReactRouter>
      </PersistGate>
    </Provider>

  </IonApp>
);

export default App;
