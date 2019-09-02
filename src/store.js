import Vue from 'vue';
import Vuex from 'vuex';
import firebase from 'firebase/app';
import pdf from 'vue-pdf';
import 'firebase/auth';
import 'firebase/database';
import 'firebase/storage';
import pdfjsLib from 'pdfjs-dist';
import router from './router';

Vue.use(Vuex);
/* eslint-disable no-console */

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
    uid: '',
    url: '',
    file: '',
    isFirst: false,
    pdfList: [],
    uploadBuffer: {
      title: '',
      file: '',
    },
    uploadPdfAttributes: {
      numPages: 0,
      resumePage: 1,
      title: '',
    },
    presentingPdfAttributes: {
      numPages: 0,
      currentPage: 1,
      title: '',
      timestamp: '',
      url: '',
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
    setUploadBuffer(state, payload) {
      state.uploadBuffer.title = payload.title;
      state.uploadBuffer.file = payload.file;
    },
    resetUploadBuffer(state) {
      state.uploadBuffer.title = '';
      state.uploadBuffer.file = '';
    },
    setPresentingPdfAttributes(state, payload) {
      state.presentingPdfAttributes.title = payload.title;
      state.presentingPdfAttributes.numPages = payload.numPages;
      state.presentingPdfAttributes.currentPage = payload.currentPage;
      state.presentingPdfAttributes.timestamp = payload.timestamp;
      state.presentingPdfAttributes.url = payload.url;
    },
    setPresentingPdfPageIncrement(state, payload) {
      state.presentingPdfAttributes.currentPage += payload;
    },
    setUplodadingFile(state, payload) {
      state.uplodadingFile = payload;
    },
    setUrl(state, payload) {
      state.url = payload;
    },
    setFile(state, payload) {
      state.file = payload;
    },
    setIsFirst(state, payload) {
      state.isFirst = payload;
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
        // Sign-in the user det
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
          .ref(`${DATABASE}/presenting/data`)
          .set(payload)
          .then(() => {
            commit('setSubmittingPresentingDataToFirebase', false);
            resolve();
          });
      });
    },
    submitPresentingPageToFirebase({ state }) {
      return new Promise((resolve) => {
        firebase
          .database()
          .ref(`${DATABASE}/presenting/data/currentPage`)
          .set(state.presentingPdfAttributes.currentPage)
          .then(() => {
            resolve();
          });
      });
    },
    submitFakePresentingPageToFirebase({ state }) {
      return new Promise((resolve) => {
        const prevPage = state.presentingPdfAttributes.currentPage;
        firebase
          .database()
          .ref(`${DATABASE}/presenting/data/currentPage`)
          .set(0)
          .then(() => {
            firebase
              .database()
              .ref(`${DATABASE}/presenting/data/currentPage`)
              .set(prevPage)
              .then(() => {
                resolve();
              });
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
      });
      commit('setAllPdfsLoading', false);
    },
    getTimestamp({ state }) {
      const Timestamp = firebase
        .database()
        .ref(`${DATABASE}/presenting/data/timestamp`);
      Timestamp.on('value', () => {
        if (state.isFirst === false) {
          router.replace('/');
        }
      });
    },
    getPresentingData({ commit }) {
      const PresentingData = firebase
        .database()
        .ref(`${DATABASE}/presenting/data`);
      PresentingData.on('value', (data) => {
        const payload = data.val();
        commit('setPresentingPdfAttributes', {
          title: payload.title,
          numPages: payload.numPages,
          currentPage: payload.currentPage,
          timestamp: '',
          url: pdf.createLoadingTask(payload.url),
        });
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
    uploadFile({ state }, payload) {
      return new Promise((resolve) => {
        storageRef.child(`user/${state.uid}/${payload.title}`).put(payload.file).then(() => {
          resolve();
        });
      });
    },
    uploadPresentingFile({ state }, payload) {
      return new Promise((resolve) => {
        storageRef.child(`presenting/${payload}`).put(state.file).then(() => {
          resolve();
        });
      });
    },
    setFileAction({ commit }, payload) {
      commit('setFile', payload);
    },
    downloadFile1(payload) {
      return new Promise((resolve) => {
        const xhr = new XMLHttpRequest();
        xhr.responseType = 'blob';
        xhr.onload = () => {
          resolve(xhr.response);
        };
        xhr.open('GET', payload);
        xhr.send();
      });
    },
    downloadFile({ dispatch }) {
      return new Promise((resolve) => {
        dispatch('downloadFile1')
          .then((response) => {
            dispatch('setFileAction', response)
              .then(() => {
                resolve();
              });
          });
      });
    },
    getDownloadURL({ commit }, payload) {
      return new Promise((resolve) => {
        storageRef.child(payload).getDownloadURL().then((url) => {
          commit('setUrl', url);
          resolve();
        });
      });
    },
    presentPdf({ commit, state, dispatch }, payload) {
      commit('setPresentPdfLoading', true);
      dispatch('getDownloadURL', `user/${state.uid}/${payload.title}`)
        .then(() => {
          dispatch('downloadFile', state.url)
            .then(() => {
              dispatch('uploadPresentingFile', payload.title)
                .then(() => {
                  commit('setPresentingPdfAttributes', {
                    title: payload.title,
                    numPages: payload.numPages,
                    currentPage: payload.resumePage,
                    timestamp: '',
                    url: state.url,
                  });
                  dispatch('submitPresentingDataToFirebase', {
                    title: state.presentingPdfAttributes.title,
                    numPages: state.presentingPdfAttributes.numPages,
                    currentPage: state.presentingPdfAttributes.currentPage,
                    timestamp: new Date().toISOString(),
                    url: state.presentingPdfAttributes.url,
                  })
                    .then(() => {
                      commit('setPresentPdfLoading', false);
                      router.push('presenter');
                    });
                });
            });
        });
    },
    incrementPage({ commit, state, dispatch }, payload) {
      return new Promise((resolve) => {
        if (payload === 1) {
          if (state.presentingPdfAttributes.currentPage !== state.presentingPdfAttributes.numPages) {
            commit('setPresentingPdfPageIncrement', 1);
          }
        }
        else if (payload === -1) {
          if (state.presentingPdfAttributes.currentPage !== 1) {
            commit('setPresentingPdfPageIncrement', -1);
          }
        }
        dispatch('submitPresentingPageToFirebase')
          .then(() => {
            resolve();
          });
      });
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
            if (doc.numPages !== 0) {
              resolve(success);
            } else {
              reject(error);
            }
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
                title: state.uploadPdfAttributes.title,
                file: payload,
              })
                .then(() => {
                  dispatch('resetUploadPdfAttributes');
                  commit('setSubmittingPdfs', false);
                });
            });
        }, error => console.error(error));
    },
    resetUploadPdfAttributes({ commit }) {
      commit('resetUploadPdfAttributes');
    },
    setIsFirstAction({ commit }, payload) {
      commit('setIsFirst', payload);
    },
  },
});
