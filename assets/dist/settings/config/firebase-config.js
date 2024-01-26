// firebase-config.js

import { isValidFirebaseConfig } from './firebase-check.js';

const firebaseConfig = {
  apiKey: "AIzaSyD8qbRp5Ue5VLU21rNi5E6co9p4gFJc6z4",
  authDomain: "xavayapage.firebaseapp.com",
  databaseURL: "https://xavayapage-default-rtdb.firebaseio.com",
  projectId: "xavayapage",
  storageBucket: "xavayapage.appspot.com",
  messagingSenderId: "816112500632",
  appId: "1:816112500632:web:333327ade306fdda14f5ed",
  measurementId: "G-LT6K4LVDB7"
};

export { firebaseConfig };

isValidFirebaseConfig(firebaseConfig);