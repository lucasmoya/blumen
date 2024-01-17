// Firebase DB configuration
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-analytics.js";
import { getDatabase, ref, set, onValue } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-database.js";

const firebaseConfig = {
    apiKey: "AIzaSyCxeqV7i2DI_90DdEdyxT1HqqbFxt9fNPs",
    authDomain: "blumen-db.firebaseapp.com",
    projectId: "blumen-db",
    storageBucket: "blumen-db.appspot.com",
    messagingSenderId: "73002964402",
    appId: "1:73002964402:web:57b5204f002e86528900ab",
    measurementId: "G-KMBYJ4L28K"
};

const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const database = getDatabase(app);
const db = getDatabase();
const rulesRef = ref(db, ".info/connected");

onValue(rulesRef, (snapshot) => {
    if (snapshot.val() === true) {
        console.log("Conectado a Firebase");
    } else {
        console.log("No hay conexión a Firebase");
        console.log("Snapshot:", snapshot.val());
    }
});
console.log("Conexión a Firebase:", app.name);
