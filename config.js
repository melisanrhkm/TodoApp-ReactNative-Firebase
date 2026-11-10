
import firebase from 'firebase/compat/app';
import 'firebase/compat/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyDJZxzDIaDLQYVBBvhLGQN1BpllP8g3GOo",
  authDomain: "todosapp-bcc3c.firebaseapp.com",
  projectId: "todosapp-bcc3c",
  storageBucket: "todosapp-bcc3c.firebasestorage.app",
  messagingSenderId: "671760883376",
  appId: "1:671760883376:web:1c993ce9497e982443e575"
};

if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
}

export { firebase };
