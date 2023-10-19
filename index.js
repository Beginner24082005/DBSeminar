import { initializeApp } from 'firebase/app'
import {
    getFirestore, collection, onSnapshot,
    addDoc, deleteDoc, doc,
    query, where,
    orderBy, serverTimestamp,
    getDoc, updateDoc
} from 'firebase/firestore'
import {
    getAuth,
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword, signOut,
    onAuthStateChanged,
    deleteUser
} from 'firebase/auth'

const firebaseConfig = {
    apiKey: "AIzaSyBpbirt3L_OBsz-yXkTqmnTO7d-9eVEd1A",
    authDomain: "seminar-database-213.firebaseapp.com",
    projectId: "seminar-database-213",
    storageBucket: "seminar-database-213.appspot.com",
    messagingSenderId: "463187824378",
    appId: "1:463187824378:web:403fdb17dda32959efc343",
    measurementId: "G-ZFRV0HMF5K"
};

// init firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);


const userEmail = document.querySelector("#userEmail");
const userPassword = document.querySelector("#userPassword");
const authForm = document.querySelector("#authForm");
const secretContent = document.querySelector("#secretContent");
const signUpButton = document.querySelector("#signUpButton");
const signInButton = document.querySelector("#signInButton");
const signOutButton = document.querySelector("#signOutButton");

secretContent.style.display = 'none';

const userSignUp = async() => {
  const signUpEmail = userEmail.value;
  const signUpPassword = userPassword.value;
  createUserWithEmailAndPassword(auth, signUpEmail, signUpPassword)
  .then((userCredential) => {
      const user = userCredential.user;
      console.log(user);
      alert("Your account has been created!");
  })
  .catch((error) => {
      const errorCode = error.code;
      const errorMessage = error.message;
      console.log(errorCode + errorMessage)
  })
}

const userSignIn = async() => {
  const signInEmail = userEmail.value;
  const signInPassword = userPassword.value;
  signInWithEmailAndPassword(auth, signInEmail, signInPassword)
  .then((userCredential) => {
      const user = userCredential.user;
      alert("You have signed in successfully!");
  })
  .catch((error) => {
      const errorCode = error.code;
      const errorMessage = error.message;
      console.log(errorCode + errorMessage)
  })
}

const checkAuthState = async() => {
  onAuthStateChanged(auth, user => {
    if(user) {
      authForm.style.display = 'none';
      secretContent.style.display = 'block';
      // init services
      const db = getFirestore()

      // collection ref
      const colRef = collection(db, 'books')

      // queries
      const q = query(colRef, orderBy('createdAt'))

      // real time collection data
      const unsubCol = onSnapshot(q, (snapshot) => {
        let books = []
        snapshot.docs.forEach(doc => {
          books.push({ ...doc.data(), id: doc.id })
        })
        console.log(books)
      })

      // adding docs
      const addBookForm = document.querySelector('.add')
      addBookForm.addEventListener('submit', (e) => {
        e.preventDefault()

        addDoc(colRef, {
          title: addBookForm.title.value,
          author: addBookForm.author.value,
          createdAt: serverTimestamp()
        })
        .then(() => {
          addBookForm.reset()
        })
      })

      // deleting docs
      const deleteBookForm = document.querySelector('.delete')
      deleteBookForm.addEventListener('submit', (e) => {
        e.preventDefault()

        const docRef = doc(db, 'books', deleteBookForm.id.value)

        deleteDoc(docRef)
        .then(() => {
          deleteBookForm.reset()
        })
      })

      // updating a document
      const updateForm = document.querySelector('.update')
      updateForm.addEventListener('submit', (e) => {
        e.preventDefault()

        let docRef = doc(db, 'books', updateForm.id.value)

        updateDoc(docRef, {
          title: updateForm.title.value,
          author: updateForm.author.value
        })
        .then(() => {
          updateForm.reset()
        })
      })

    }
    else {
      authForm.style.display = 'block';
      secretContent.style.display = 'none';

    }
  })
}
const userSignOut = async() => {
  await signOut(auth);
}

checkAuthState();
signUpButton.addEventListener('click', userSignUp);
signInButton.addEventListener('click', userSignIn);
signOutButton.addEventListener('click', userSignOut);
