<template>
  <div>
  <v-container>

    <v-row no-gutters>

      <v-col align="left">
        <v-btn to='/'>
          go back to viewer
          <v-icon>exit_to_app</v-icon>
        </v-btn>
      </v-col>

      <v-col align="center">
      </v-col>

      <v-col align="center">
      </v-col>

    </v-row>
    
    <v-row no-gutters>
      <v-col align="center">      
        <v-layout row>
          <v-flex xs12 sm6>
          <v-form v-model="valid" @submit.prevent="submitPdf">
            <v-layout row>
            <v-file-input
              label="Select Pdf File"
              accept=".pdf"
              @change="updateFile"
            ></v-file-input>
            <v-btn
              color="success"
              :loading="newPdfLoading"
              :disabled="!valid"
              @click="submitPdf(file)">
              Submit
              <v-icon right>send</v-icon>
            </v-btn>
            </v-layout>
          </v-form>
          </v-flex>
        </v-layout>
        <v-layout>
          <v-flex xs12 sm6>
          <v-card class="mt-3">
            <v-toolbar color="light-green" dark>
            <v-toolbar-title class="text-xs-center">Your PDFs</v-toolbar-title>
            </v-toolbar>
            <template v-if="getAllPdfsLoading">
            <v-progress-linear :indeterminate="true"></v-progress-linear>
            </template>
            <template v-else>
            <v-list>
              <template v-if="pdfList.length">
              <v-list-item
                class="pl-2"
                :key="item.PdfId"
                v-for="item in pdfList">
                <v-list-item-action>
                <v-btn
                  @click="deletePdf(item)"
                  :loading="deletePdfLoading" text icon>
                  <v-icon>delete_outline</v-icon>
                </v-btn>
                </v-list-item-action>
                <v-list-item-action>
                <v-btn
                  @click="presentPdf(item)"
                  :loading="presentPdfLoading" text icon>
                  <v-icon>slideshow</v-icon>
                </v-btn>
                </v-list-item-action>
                <v-list-item-content>
                <v-list-item-title>
                  {{ item.title }}: total {{ item.numPages }} pages at p.{{ item.resumePage }}
                </v-list-item-title>
                </v-list-item-content>
              </v-list-item>
              </template>
              <template v-else>
              <v-list-item class="pl-2">
                <v-list-item-content>
                <v-alert :value="true" outlined color="warning" icon="info">
                  No Pdfs
                </v-alert>
                </v-list-item-content>
              </v-list-item>
              </template>
            </v-list>
            </template>
          </v-card>
          </v-flex>
        </v-layout>
      </v-col>
    </v-row>
    </v-container>
  </div>
</template>

<script>
import { mapActions, mapState } from 'vuex';

export default {
  created() {
    this.getAllPdfsForUser();
  },
  data: () => ({
    file: [],
    valid: false,
    newPdfRules: [
      v => !!v || 'New Pdf is required',
    ],
  }),
  computed: {
    ...mapState({
      newPdfLoading: state => state.loadings.newPdf,
      markPdfsAsDoneLoading: state => state.loadings.markPdfsAsDone,
      getAllPdfsLoading: state => state.loadings.getAllPdfs,
      deletePdfLoading: state => state.loadings.deletingPdf,
      presentPdfLoading: state => state.loadings.presentingPdf,
      pdfList: state => state.pdfList,
    }),
  },
  methods: {
    updateFile(e) {
      this.file = e;
    },
    ...mapActions([
      'getAllPdfsForUser',
      'getPresentingData',
      'deletePdf',
      'presentPdf',
      'submitPdf',
    ]),
  },
};
</script>
