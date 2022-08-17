const firebaseConfig = {
    apiKey: "AIzaSyBxYUjIunJSeThtQjybpyV4ZIRd2JtSyqo",
    authDomain: "ateps-97226.firebaseapp.com",
    databaseURL: "https://ateps-97226-default-rtdb.firebaseio.com",
    projectId: "ateps-97226",
    storageBucket: "ateps-97226.appspot.com",
    messagingSenderId: "925887173359",
    appId: "1:925887173359:web:254242726ee99589a2411a"
};

// Initialize Firebase
const app = firebase.apps.length ? firebase.app() : firebase.initializeApp(firebaseConfig);