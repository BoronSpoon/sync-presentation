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

export default new Vuex.Store({
  state: {
    name: '',
    email: '',
    loadings: {
      login: false,
      newPdf: false,
      getAllPdfs: false,
      deletingPdf: false,
      presentingPdf: false,
      countingNumPages: false,
      submittingPdfs: false,
    },
    status: {
      presentingPdf: false,
    },
    uid: '',
    pdfList: [],
    uploadPdfAttributes: {
      numPages: 0,
      title: '',
    },
  },
  mutations: {
    setNewPdfLoading(state, data) {
      state.loadings.newPdf = data;
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
       * pdfList{ PdfId, path, numPages }
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
    },
    setUploadPdfAttributes(state, payload) {
      state.uploadPdfAttributes.title = payload.title;
      state.uploadPdfAttributes.numPages = payload.numPages;
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
        commit('setNewPdfLoading', true);
        firebase
          .database()
          .ref(`${DATABASE}/${state.uid}`)
          .push(payload)
          .then(() => {
            commit('setNewPdfLoading', false);
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
    presentPdf({ commit, state }, payload) {
      commit('setPresentPdfLoading', true);
      const updates = {};
      updates[`/${payload.PdfId}/`] = null;
      firebase
        .database()
        .ref(`${DATABASE}/${state.uid}`)
        .update(updates)
        .then(() => commit('setPresentPdfLoading', false));
    },
    countNumPages({ commit }, payload) {
      return new Promise((resolve, reject) => {
        commit('setCountingNumPages', true);
        var reader = new FileReader();
        var success = 'countNumPages = success'
        var error = 'zero pages'
        reader.onloadend = () => {
          var loadingTask = pdfjsLib.getDocument({ data: reader.result });
          loadingTask.promise.then((doc) => {
            commit('setUploadPdfAttributes', {
              title: payload.name,
              numPages: doc.numPages,
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
        .then((success) => {
          dispatch('submitPdfToFirebase', {
            title: state.uploadPdfAttributes.title,
            numPages: state.uploadPdfAttributes.numPages,
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
