<template>
  <div>
    <qr-dialog
      :isDialog="isScanQRDialog"
      @closeDialog="closeScanQRDialog">
    </qr-dialog>
    <v-toolbar flat :elevation="0">
      <v-row style="justify-content: flex-end;">
        <v-col cols="auto">
          <v-btn @click="createQR">
            <v-icon>add</v-icon>
          </v-btn>
        </v-col>
        <v-col cols="auto">
          <v-btn @click="isScanQRDialog = true">
            <v-icon>qr_code_scanner</v-icon>
          </v-btn>
        </v-col>
        <v-col cols="auto">
          <v-btn @click="logout">
            <v-icon>logout</v-icon>
          </v-btn>
        </v-col>
      </v-row>
    </v-toolbar>
    <v-row>
      <v-col
        v-for="(giftCard, giftCardIndex) in giftCards"
        :key="giftCardIndex">
        <v-card @click="openGiftCard(giftCard.id)">
          <v-card-title>
            {{giftCard.receiver.fullName}}
          </v-card-title>
          <v-card-subtitle>
            <span v-if="giftCard.spent">{{giftCard.spent}}р. / {{giftCard.sum}}р.</span>
            <span v-else>{{giftCard.sum}}р.</span>
          </v-card-subtitle>
        </v-card>
      </v-col>
    </v-row>
  </div>
</template>

<script>
import QRDialog from '@/components/QRDialog.vue'
import {fetchRequest} from '@/scripts/index'
export default {
  name: 'CardsList',
  data: () => ({
    isScanQRDialog: false
  }),
  async created() {
    //load cards
    await fetchRequest('/gift-cards/', 'GET')
  },
  computed: {},
  methods: {
    openGiftCard(giftCardId) {
      this.$router.push({name: 'editGiftCard', params: {id: giftCardId}})
    },
    closeScanQRDialog(link) {
      if (link) {
        const splittedLink = link.split('/')
        const giftCardId = splittedLink[splittedLink.length - 1]
        this.$router.push({name: 'editGiftCard', params: {giftCardId}})
      }
      this.isScanQRDialog = false
    },
    async createQR() {
      //const {body} = await fetchRequest('/gift-cards/create', 'POST')
      //if (!body || body.id == null) return
      this.$router.push({name: 'createGiftCard'})
      // params: {giftCardId: body.id}})
    },
    logout() {
      localStorage.clear()
      this.$router.push({name: 'auth'})
    }
  },
  components: {QRDialog}
}
</script>
