import { initializeApp } from "firebase/app";

import {
  getFirestore,
  collection,
  getDocs,
  addDoc,
  doc,
  onSnapshot,
  updateDoc,
  query,
  where,
  deleteDoc,
  serverTimestamp,
} from "firebase/firestore";

import {
  getAuth,
  createUserWithEmailAndPassword,
  signOut,
  signInWithEmailAndPassword,
} from "firebase/auth";

const env = require("./env.js");

const firebaseConfig = {
  apiKey: env.APIKEY,
  authDomain: env.AUTH_DOMAIN,
  projectId: env.PROJECT_ID,
  storageBucket: env.STORAGE_BUCKET,
  messagingSenderId: env.MESSAGING_SENDER_ID,
  appId: env.APP_ID,
};

// init firebase
const app = initializeApp(firebaseConfig);

// init firestore
const db = getFirestore(app);

// collection ref

const colRef = collection(db, "street-quotes");

// get docs
// getDocs(colRef).then((snapshot) => {
//   const quotes = [];
//   snapshot.docs.forEach((doc) => {
//     quotes.push({ ...doc.data(), id: doc.id });
//   });
//   console.log(quotes);
// });

// realtime collection data

// onSnapshot(colRef, (snapshot) => {
//   const quotes = [];
//   snapshot.docs.forEach((doc) => {
//     quotes.push({ ...doc.data(), id: doc.id });
//   });
//   console.log(quotes);
// });

// hide or show forms

const addBreadcrumb = document.querySelector(".add");
const deleteBreadcrumb = document.querySelector(".delete");
const updateBreadcrumb = document.querySelector(".update");
const deleteQuote = document.querySelector(".delete-quote");
const addQuote = document.querySelector(".add-quote");
const addForm = document.querySelector(".add-quote");
const deleteForm = document.querySelector(".delete-quote");
const updateForm = document.querySelector(".update-quote");

addBreadcrumb.addEventListener("click", (event) => {
  addBreadcrumb.classList.toggle("active");
  if (addBreadcrumb.classList.contains("active")) {
    deleteQuote.classList.add("hide");
    updateForm.classList.add("hide");
    updateBreadcrumb.classList.remove("active");
    addQuote.classList.remove("hide");
    deleteBreadcrumb.classList.remove("active");
  }
});

deleteBreadcrumb.addEventListener("click", (event) => {
  deleteBreadcrumb.classList.toggle("active");
  if (deleteBreadcrumb.classList.contains("active")) {
    deleteQuote.classList.remove("hide");
    addQuote.classList.add("hide");
    updateForm.classList.add("hide");
    updateBreadcrumb.classList.remove("active");
    addBreadcrumb.classList.remove("active");
  }
});

updateBreadcrumb.addEventListener("click", (event) => {
  updateBreadcrumb.classList.toggle("active");
  if (updateBreadcrumb.classList.contains("active")) {
    deleteQuote.classList.add("hide");
    addQuote.classList.add("hide");
    updateForm.classList.remove("hide");
    updateBreadcrumb.classList.add("active");
    addBreadcrumb.classList.remove("active");
    deleteBreadcrumb.classList.remove("active");
  }
});

addForm.addEventListener("submit", (event) => {
  event.preventDefault();
  const formData = new FormData(event.target);
  const formDataObj = Object.fromEntries(formData.entries());
  formDataObj.createdAt = serverTimestamp();
  addDoc(colRef, formDataObj).then(() => {
    addForm.reset();
  });
});

deleteForm.addEventListener("submit", (event) => {
  event.preventDefault();
  const formData = new FormData(event.target);
  const formDataObj = Object.fromEntries(formData.entries());
  const docRef = doc(db, "street-quotes", formDataObj.id);
  deleteDoc(docRef).then(() => {
    deleteForm.reset();
    console, log("item deleted");
  });
});

// create new  quote with get docs

// const quoteWrapper = document.querySelector(".quotes");
// getDocs(colRef).then((snapshot) => {
//   const quotes = [];
//   snapshot.docs.forEach((doc) => {
//     quotes.push({ ...doc.data(), id: doc.id });
//   });
//   quotes.forEach((obj) => {
//     const newQuote = `
//     <div class="quote">
//     <h1 class="quote-heading">${obj.Quote}</h1>
//     <p class="quote-meaning">${obj.Meaning}</p>
//   </div>
//     `;
//     quoteWrapper.innerHTML += newQuote;
//   });
// });

const quoteWrapper = document.querySelector(".quotes");
onSnapshot(colRef, (snapshot) => {
  const quotes = [];
  snapshot.docs.forEach((doc) => {
    quotes.push({ ...doc.data(), id: doc.id });
  });
  quotes.forEach((obj) => {
    const newQuote = `
    <div class="quote">
    <h1 class="quote-heading">${obj.Quote}</h1>
    <p class="quote-meaning">${obj.Meaning}</p>
  </div>
    `;
    quoteWrapper.innerHTML += newQuote;
  });
});

//  working with queries : queries allow you filter data fetched based on a certain condition

// const getQuery = query(
//   colRef,
//   where("Quote", "==", "No be today yansh dey back")
// );

// console.log(getQuery);

updateForm.addEventListener("submit", (event) => {
  event.preventDefault();
  const formData = new FormData(event.target);
  const formDataObj = Object.fromEntries(formData.entries());
  const docRef = doc(db, "street-quotes", formDataObj.id);
  updateDoc(docRef, {
    Meaning: formDataObj.Meaning,
  }).then(() => {
    updateForm.reset();
  });
});

// firebase Auth

const auth = getAuth();

// get form elements (sign up)

// const loginForm = document.querySelector(".login-form");
// loginForm.addEventListener("submit", (event) => {
//   const formData = new FormData(event.target);
//   const formDataObj = Object.fromEntries(formData.entries());

//   createUserWithEmailAndPassword(auth, formDataObj.email, formDataObj.password)
//     .then((cred) => {
//       console.log("user created", cred.user);
//       loginForm.reset();
//     })
//     .catch((err) => {
//       console.log(err.message);
//     });
// });

// log out

const logoutBtn = document.querySelector(".log-out");

console.log(logoutBtn);

logoutBtn.addEventListener("click", () => {
  signOut(auth)
    .then(() => {
      console.log("user signed out!!");
    })
    .catch((err) => {
      console.log(err.message);
    });
});

// login

const loginForm = document.querySelector(".login-form");

loginForm.addEventListener("submit", (event) => {
  event.preventDefault();
  const formData = new FormData(event.target);
  const formDataObj = Object.fromEntries(formData.entries());
  signInWithEmailAndPassword(auth, formDataObj.email, formDataObj.password)
    .then((cred) => {
      console.log("User logged in", cred.user);
    })
    .catch((err) => {
      console.log(err);
    });
});

