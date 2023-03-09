import { initializeApp } from "firebase/app";
import {
  getAuth,
  signInWithRedirect,
  signInAnonymously,
  onAuthStateChanged,
  GoogleAuthProvider,
  signOut,
} from "firebase/auth";
import {
  getFirestore,
  collection,
  addDoc,
  getDocs,
  onSnapshot,
  query,
  orderBy,
} from "firebase/firestore";
import { html, render } from "lit-html";

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyDWGB2zlJ6yvwDbNgICkWfRZZ2GiF3G6c0",
    authDomain: "cookie-run-prototype.firebaseapp.com",
    projectId: "cookie-run-prototype",
    storageBucket: "cookie-run-prototype.appspot.com",
    messagingSenderId: "213018018250",
    appId: "1:213018018250:web:c6a0309beb8841ae354f33"
  };

let messages = [];

// Initialize Firebase
const app = initializeApp(firebaseConfig);
// Initialize Auth
const auth = getAuth(app);

// Initialize Firestore
const db = getFirestore(app);
const messagesRef = collection(db, "messages");

// Setup Google authentication
const provider = new GoogleAuthProvider();

// This function is called if the Sign In button is clicked
function signInUser() {
  signInWithRedirect(auth, provider);
}

function signInAnon() {
  signInAnonymously(auth)
    .then(() => {
      // Signed in..
    })
    .catch((error) => {
      console.error(`Error ${error.code}: ${error.message}.`);
    });
}

// This function is called if the Sign Out button is clicked
function signOutUser() {
  signOut(auth)
    .then(() => {
      console.info("Sign out was successful");
    })
    .catch((error) => {
      console.error(`Error ${error.code}: ${error.message}.`);
    });
}

// This function returns a template with the sign in view - what the user sees when they're signed out
function signInView() {
  return html`<button class="sign-in" @click=${signInUser}>
      Sign in with Google
    </button>
    <button class="sign-in" @click=${signInAnon}>Anonymous Sign in</button>`;
}

// This function returns a template with normal app view - what the user sees when they're signed in
function view() {
  let user = auth.currentUser;
  return html`
    <div id="top-bar">
      <span>Boba Run High Score</span>
      <span
        >Signed in as
        ${user.isAnonymous ? "anon" : auth.currentUser.displayName}</span
      >
      <button @click=${signOutUser}>Sign Out</button>
    </div>
    <div id="scores-container">
      ${scores.map(
        (highScore) => html`<div
          class="score ${highScore.uid == user.uid ? "right" : "left"}">
          <div class="score-content">${highScore.content}</div>
          <div class="score-info">${highScore.displayName}</div>
        </div>`
      )}
    </div>
  `;
}

// This is an observer which runs whenever the authentication state is changed
onAuthStateChanged(auth, (user) => {
  if (user) {
    console.log("AUTH STATE CHANGED");
    const uid = user.uid;
    console.log(user);
    // If there is an authenticated user, we render the normal view
    render(view(), document.body);
    getAllMessages();
  } else {
    // Otherwise, we render the sign in view
    render(signInView(), document.body);
  }
});

/*
async function sendMessage(message) {
  console.log("Sending a message!");
  const user = auth.currentUser;
  // Add some data to the users collection
  try {
    const docRef = await addDoc(collection(db, "messages"), {
      displayName: user.isAnonymous ? "anon" : user.displayName,
      uid: user.uid,
      time: Date.now(),
      content: message,
    });
    console.log("Document written with ID: ", docRef.id);
  } catch (e) {
    console.error("Error adding document: ", e);
  }
}

//window.sendMessage = sendMessage

async function getAllMessages() {
  messages = [];

  const querySnapshot = await getDocs(
    query(messagesRef, orderBy("time", "desc"))
  );
  querySnapshot.forEach((doc) => {
    let msgData = doc.data();
    messages.push(msgData);
  });
  render(view(), document.body);
}

onSnapshot(
  collection(db, "messages"),
  (snapshot) => {
    console.log("snap", snapshot);
    getAllMessages();
  },
  (error) => {
    console.error(error);
  }
);

function type(e) {
  if (e.key == "Enter") {
    sendMessage(e.target.value);
    e.target.value = "";
  }
}
*/

// string of who you are logged in as
// let playerId;
// 