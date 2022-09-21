// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDZGGX1lK1Vf8pwrd_2OAgQxbwdqLa0dyE",
  authDomain: "ierns9ufardmwoksfmwroi.firebaseapp.com",
  databaseURL: "https://ierns9ufardmwoksfmwroi-default-rtdb.firebaseio.com",
  projectId: "ierns9ufardmwoksfmwroi",
  storageBucket: "ierns9ufardmwoksfmwroi.appspot.com",
  messagingSenderId: "98809721108",
  appId: "1:98809721108:web:cba4bee321092bc7d61201",
  measurementId: "G-V6JS7D01MQ"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

const auth = getAuth(app);

export {auth}