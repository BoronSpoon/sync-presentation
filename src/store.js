import Vue from 'vue';
import Vuex from 'vuex';
import firebase from 'firebase/app';
import 'firebase/auth';
import 'firebase/database';
import pdfjsLib from 'pdfjs-dist';

Vue.use(Vuex);

// firebase config.
firebase.initializeApp({
  apiKey: process.env.VUE_APP_API_KEY,
  authDomain: process.env.VUE_APP_AUTH_DOMAIN,
  databaseURL: process.env.VUE_APP_DB_URL,
  projectId: process.env.VUE_APP_PROJECT_ID,
  storageBucket: process.env.VUE_APP_STORAGE_BUCKET,
  messagingSenderId: process.env.VUE_APP_MESSAGING_SENDER_ID,
  appId: process.env.VUE_APP_APP_ID,
});

const DATABASE = 'pdf-list';
const storageRef = firebase.storage().ref();

export default new Vuex.Store({
  state: {
    name: '',
    email: '',
    loadings: {
      login: false,
      submittingPdfToFirebase: false,
      submittingPresentingDataToFirebase: false,
      getAllPdfs: false,
      deletingPdf: false,
      presentingPdf: false,
      countingNumPages: false,
      submittingPdfs: false,
      uplodadingFile: false,
    },
    status: {
      presentingPdf: false,
    },
    bufferedPdf: '',
    uid: '',
    pdfList: [],
    uploadPdfAttributes: {
      numPages: 0,
      resumePage: 1,
      title: '',
    },
    presentingPdfAttributes: {
      numPages: 0,
      currentPage: 1,
      title: '',
      uid: '',
      pdfid: '',
    },
  },
  mutations: {
    setSubmittingPdfToFirebase(state, data) {
      state.loadings.submittingPdfToFirebase = data;
    },
    setSubmittingPresentingDataToFirebase(state, data) {
      state.loadings.submittingPresentingDataToFirebase = data;
    },
    setDeletePdfLoading(state, data) {
      state.loadings.deletingPdf = data;
    },
    setPresentPdfLoading(state, data) {
      state.loadings.presentingPdf = data;
    },
    setAllPdfsLoading(state, data) {
      state.loadings.getAllPdfs = data;
    },
    setUserId(state, data) {
      state.uid = data;
    },
    setPdfList(state, data) {
      /**
       * pdfList{ PdfId, title, numPages, resumePage }
       * */
      state.pdfList = [];
      // Initially there will be no Pdf-list.
      if (data) {
        const PdfIds = Object.keys(data);
        PdfIds.forEach((PdfId) => {
          state.pdfList.push({
            PdfId,
            ...data[PdfId],
          });
        });
      }
    },
    setNumPages(state, data) {
      state.numPages = data;
    },
    setCountingNumPages(state, data) {
      state.loadings.countingNumPages = data;
    },
    setSubmittingPdfs(state, data) {
      state.loadings.submittingPdfs = data;
    },
    beforeAuth(state) {
      state.loadings.login = true;
    },
    afterSuccessfulAuth(state, { name, email, uid }) {
      state.loadings.login = false;
      state.name = name;
      state.email = email;
      state.uid = uid;
    },
    afterErrorAuth(state) {
      state.loadings.login = false;
    },
    resetUploadPdfAttributes(state) {
      state.uploadPdfAttributes.title = '';
      state.uploadPdfAttributes.numPages = 0;
      state.uploadPdfAttributes.resumePage = 1;
    },
    setUploadPdfAttributes(state, payload) {
      state.uploadPdfAttributes.title = payload.title;
      state.uploadPdfAttributes.numPages = payload.numPages;
      state.uploadPdfAttributes.resumePage = payload.resumePage;
    },
    setPresentingPdfAttributes(state, payload) {
      state.presentingPdfAttributes.title = payload.title;
      state.presentingPdfAttributes.numPages = payload.numPages;
      state.presentingPdfAttributes.currentPage = payload.currentPage;
      state.presentingPdfAttributes.uid = payload.uid;
      state.presentingPdfAttributes.pdfid = payload.pdfid;
    },
    setBufferedPdf(state, payload) {
      state.bufferedPdf = payload;
    },
    setUplodadingFile(state, payload) {
      state.uplodadingFile = payload;
    },
  },
  actions: {
    createNewUserAccount({ commit }, payload) {
      return new Promise((resolve, reject) => {
        commit('beforeAuth');
        // create new account.
        firebase
          .auth()
          .createUserWithEmailAndPassword(payload.email, payload.password)
          .then((response) => {
            commit('afterSuccessfulAuth', {
              uid: response.user.uid,
              ...payload,
            });
            resolve();
          })
          .catch((error) => {
            // Handle Errors here.
            commit('afterErrorAuth');
            reject(error.message);
          });
      });
    },
    signInExistingUser({ commit }, payload) {
      return new Promise((resolve, reject) => {
        commit('beforeAuth');
        // Sign-in the user details.
        firebase
          .auth()
          .signInWithEmailAndPassword(payload.email, payload.password)
          .then((response) => {
            commit('afterSuccessfulAuth', {
              uid: response.user.uid,
              ...payload,
            });
            resolve();
          })
          .catch((error) => {
            // Handle Errors here.
            commit('afterErrorAuth');
            reject(error.message);
          });
      });
    },
    submitPdfToFirebase({ commit, state }, payload) {
      return new Promise((resolve) => {
        commit('setSubmittingPdfToFirebase', true);
        firebase
          .database()
          .ref(`${DATABASE}/${state.uid}`)
          .push(payload)
          .then(() => {
            commit('setSubmittingPdfToFirebase', false);
            resolve();
          });
      });
    },
    submitPresentingDataToFirebase({ commit }, payload) {
      return new Promise((resolve) => {
        commit('setSubmittingPresentingDataToFirebase', true);
        firebase
          .database()
          .ref(`${DATABASE}/presenting`)
          .push(payload)
          .then(() => {
            commit('setSubmittingPresentingDataToFirebase', false);
            resolve();
          });
      });
    },
    getAllPdfsForUser({ commit, state }) {
      commit('setAllPdfsLoading', true);
      const PdfList = firebase
        .database()
        .ref(`${DATABASE}/${state.uid}`);
      PdfList.on('value', (data) => {
        commit('setPdfList', data.val());
        commit('setAllPdfsLoading', false);
      });
    },
    getCurrentUser({ commit }) {
      return new Promise((resolve, reject) => {
        const user = firebase.auth().currentUser;
        // if there is a logged in user.
        if (user) {
          commit('setUserId', user.uid);
          resolve();
        } else {
          reject();
        }
      });
    },
    deletePdf({ commit, state }, payload) {
      commit('setDeletePdfLoading', true);
      const updates = {};
      updates[`/${payload.PdfId}/`] = null;
      firebase
        .database()
        .ref(`${DATABASE}/${state.uid}`)
        .update(updates)
        .then(() => commit('setDeletePdfLoading', false));
    },
    uploadFile(payload) {
      return new Promise((resolve) => {
        storageRef.child(payload.path).put(payload.file).then(() => {
          resolve();
        });
      });
    },
    presentPdf({ commit, state }, payload) {
      commit('setPresentPdfLoading', true);
      pdfjsLib.getDocument(state.presentingPdfAttributes.title).promise.then((pdf) => {
        commit('setBufferedPdf', pdf);
      });
      commit('setPresentingPdfAttributes', {
        title: payload.title,
        numPages: payload.numPages,
        currentPage: payload.resumePage,
        uid: state.uid,
        pdfid: payload.pdfid,
      });
      commit('setSubmittingPresentingDataToFirebase', {
        title: state.presentingPdfAttributes.title,
        numPages: state.presentingPdfAttributes.numPages,
        currentPage: state.presentingPdfAttributes.currentPage,
      })
        .then(() => commit('setPresentPdfLoading', false));
    },
    countNumPages({ commit }, payload) {
      return new Promise((resolve, reject) => {
        commit('setCountingNumPages', true);
        const reader = new FileReader();
        const success = 'countNumPages = success';
        const error = 'zero pages';
        reader.onloadend = () => {
          const loadingTask = pdfjsLib.getDocument({ data: reader.result });
          loadingTask.promise.then((doc) => {
            commit('setUploadPdfAttributes', {
              title: payload.name,
              numPages: doc.numPages,
              resumePage: 1,
            });
            commit('setCountingNumPages', false);
            doc.numPages != 0 ? resolve(success) : reject(error);
          });
        };
        reader.readAsBinaryString(payload);
      });
    },
    submitPdf({ commit, state, dispatch }, payload) {
      commit('setSubmittingPdfs', true);
      dispatch('countNumPages', payload)
        .then(() => {
          dispatch('submitPdfToFirebase', {
            title: state.uploadPdfAttributes.title,
            numPages: state.uploadPdfAttributes.numPages,
            resumePage: state.uploadPdfAttributes.resumePage,
          })
            .then(() => {
              dispatch('uploadFile', {
                path: `user/${state.uid}/${state.uploadPdfAttributes.title}`,
                file: payload,
              });
            })
            .then(() => {
              dispatch('resetUploadPdfAttributes');
              commit('setSubmittingPdfs', false);
            });
        }, error => alert(error));
    },
    resetUploadPdfAttributes({ commit }) {
      commit('resetUploadPdfAttributes');
    },
  },
});
