import firebase from 'firebase/compat/app';
import 'firebase/compat/firestore'
import 'firebase/compat/auth'

let firebaseConfig = {
    apiKey: "AIzaSyDuVGQM9BEg-Edo8Suzxkw6MjgxD7Eclm0",
    authDomain: "document-editor-e9aa3.firebaseapp.com",
    projectId: "document-editor-e9aa3",
    storageBucket: "document-editor-e9aa3.appspot.com",
    messagingSenderId: "1047768577454",
    appId: "1:1047768577454:web:1ab07dd28bd4e2acc8043f"
};


const app = !firebase.apps.length
    ? firebase.initializeApp(firebaseConfig)
    : firebase.app()

export const auth = app.auth()

export const db = app.firestore()

// if (location.hostname === 'localhost') {
//     db.useEmulator('localhost', 8080)
//     auth.useEmulator("http://localhost:9099");
// }
