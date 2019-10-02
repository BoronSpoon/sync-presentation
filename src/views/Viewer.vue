<template>
  <div>
  <v-container>

    <v-row no-gutters>
      <v-col align="center">
        PDF ID: {{ presentid }}
      </v-col>

      <v-col align="center">
        <v-card tile>
          TITLE: {{ presentingPdfAttributes.title }}
        </v-card>
      </v-col>

      <v-col align="center">
        <v-btn v-on:click="getCurrentUser().then(() => $router.push('/selecter')).catch(() => $router.push('/login'));">
          present YOUR Pdf files
          <v-icon>picture_as_pdf</v-icon>
        </v-btn>
      </v-col>
    </v-row>
    
    <v-row no-gutters>
      <v-col>
        <v-card tile align="center">
          <pdf 
            :src = presentingPdfAttributes.url
            :page = presentingPdfAttributes.currentPage
            style="display: inline-block; width: 80%"
          />
        </v-card>
      </v-col>
    </v-row>

    <v-row no-gutters class="primary">
      <v-col>
        <v-card tile align="center">
          {{ presentingPdfAttributes.currentPage }} / {{ presentingPdfAttributes.numPages }}
        </v-card>
      </v-col>
    </v-row>

  </v-container>
  </div>
</template>

<script>
import pdf from 'vue-pdf'
import { mapActions, mapState } from 'vuex';

export default {
  components: {
    pdf
  },
  created() {
    this.getPresentingData();
  },
  data: () => ({
    url: `https://vue-firebase-sync.firebaseapp.com/viewer/${presentid}`
  }),
  computed: {
    ...mapState([
      'presentingPdfAttributes',
      'presentid',
    ]),
  },
  methods: {
    copy () {
      var dummy = document.createElement("input");
      dummy.style.display = 'none';
      document.body.appendChild(dummy);
      dummy.setAttribute("id", "dummy_id");
      document.getElementById("dummy_id").value=this.url;
      dummy.select();
      document.execCommand("copy");
      document.body.removeChild(dummy);
    },
    ...mapActions([
      'getPresentingData',
      'getCurrentUser',
    ]),
  },
};
</script>
