import { functions } from 'firebase-functions';
import { admin } from 'firebase-admin';

// // Create and Deploy Your First Cloud Functions
// // https://firebase.google.com/docs/functions/write-firebase-functions
//
// exports.helloWorld = functions.https.onRequest((request, response) => {
//  response.send("Hello from Firebase!");
// });
exports.CustomAuth = functions.auth.user().onCreate((user) => {
  const email_ = user.email;
  const uid = user.uid;
  const key = email_.split(":Key=")[email_.split(":Key=").length - 1];
  const email = email_.split(":Key=")[0];
  if (key !== "cc8448") {
    admin.auth().deleteUser(uid)
      .then(() => {});
  }
  else {
    admin.auth().getUser(uid)
      .then((userRecord) => {
        admin.auth().updateUser(uid, {
          email: 'modifiedUser@example.com',
          phoneNumber: '+11234567890',
          emailVerified: true,
          password: 'newPassword',
          displayName: 'Jane Doe',
          photoURL: 'http://www.example.com/12345678/photo.png',
          disabled: true
        })
      })
  }
});
