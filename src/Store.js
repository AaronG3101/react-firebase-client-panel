import { createStore, combineReducers, compose } from "redux";
import firebase from "firebase";
import "firebase/firestore";
import { reactReduxFirebase, firebaseReducer } from "react-redux-firebase";
import { reduxFirestore, firestoreReducer } from "redux-firestore";
//Reducers
import NotifyReducer from "./reducers/NotifyReducer";
import SettingsReducer from "./reducers/SettingsReducer";

const firebaseConfig = {
  apiKey: "AIzaSyCKDUlL-Ov_tFGX7ATmf0dNhKshqCBnqg4",
  authDomain: "reactclientpanel-f8d95.firebaseapp.com",
  databaseURL: "https://reactclientpanel-f8d95.firebaseio.com",
  projectId: "reactclientpanel-f8d95",
  storageBucket: "reactclientpanel-f8d95.appspot.com",
  messagingSenderId: "759604668030"
};

// react-redux-firebase-config
const rrfConfig = {
  userProfile: "users",
  useFirestoreForProfile: true // Firestore for Profile instead of Realtime DB
};

// Init firebase instance
firebase.initializeApp(firebaseConfig);
// Init firestore
const firestore = firebase.firestore();
const settings = { timestampsInSnapshots: true };
firestore.settings(settings);

// Add reactReduxFirebase enhancer when making store creator
const createStoreWithFirebase = compose(
  reactReduxFirebase(firebase, rrfConfig),
  reduxFirestore(firebase)
)(createStore);

const rootReducer = combineReducers({
  firebase: firebaseReducer,
  firestore: firestoreReducer,
  notify: NotifyReducer,
  settings: SettingsReducer
});

//Check for settings in localStorage
if (localStorage.getItem("settings") == null) {
  //Default settings
  const defaultSettings = {
    disableBalanceOnAdd: true,
    disableBalanceOnEdit: false,
    allowRegistration: false
  };

  //Set to localStorage
  localStorage.setItem("settings", JSON.stringify(defaultSettings));
}

// Create initial state
const initialState = { settings: JSON.parse(localStorage.getItem("settings")) };

// Create store
const store = createStoreWithFirebase(
  rootReducer,
  initialState,
  compose(
    reactReduxFirebase(firebase),
    window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__()
  )
);

export default store;
