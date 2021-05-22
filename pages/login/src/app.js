import { constants } from '../../_shared/constants.js';
import { UserDb } from '../../_shared/userDb.js';

// Your web app's Firebase configuration
const { firebaseConfig } = constants;
// Initialize Firebase
firebase.initializeApp(firebaseConfig);

const provider = new firebase.auth.GithubAuthProvider();

provider.addScope('read:user');

function redirectToLobby() {
  window.location = constants.pages.lobby;
}

function onLogin(provider, firebase) {
  return () => {
    firebase
      .auth()
      .signInWithPopup(provider)
      .then((result) => {
        /** @type {firebase.auth.OAuthCredential} */
        // The signed-in user info.
        const { user } = result;
        const userData = {
          img: user.photoURL,
          username: user.displayName,
        };
        UserDb.insert(userData);
        redirectToLobby();
      })
      .catch((error) => {
        alert(JSON.stringify(error));
        console.log('error login', error);
      });
  };
}
const currentUser = UserDb.get();
if (Object.keys(currentUser).length) redirectToLobby();

const btnLogin = document.getElementById('btnLogin');
btnLogin.addEventListener('click', onLogin(provider, firebase));
