import firebase from 'firebase';
require('@firebase/firestore')

var firebaseConfig = {
  apiKey: "AIzaSyDSzmLoNPk9g4oa5WGhOJFemUxnqnEdPNw",
  authDomain: "barter-system-a72b8.firebaseapp.com",
  projectId: "barter-system-a72b8",
  storageBucket: "barter-system-a72b8.appspot.com",
  messagingSenderId: "29101680879",
  appId: "1:29101680879:web:a0aafd5eecc7c8118e531a"
};
// Initialize Firebase
firebase.initializeApp(firebaseConfig);

export default firebase.firestore();
