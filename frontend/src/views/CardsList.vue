<template>
  <div>
    <qr-dialog
      :isDialog="isScanQRDialog"
      @closeDialog="closeScanQRDialog">
    </qr-dialog>
    <v-toolbar>
      <v-btn @click="createQR">add</v-btn>
      <v-btn @click="isScanQRDialog = true">scan</v-btn>
      <v-btn>logout</v-btn>
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
      this.$router.push({name: 'gift-card-editing', params: {id: giftCardId}})
    },
    closeScanQRDialog(link) {
      if (link) {
        const splittedLink = link.split('/')
        const giftCardId = splittedLink[splittedLink.length - 1]
        this.$router.push({name: 'gift-card-editing', params: {giftCardId}})
      }
      this.isScanQRDialog = false
    },
    async createQR() {
      const {body} = await fetchRequest('/gift-cards/create', 'POST')
      if (!body || body.id == null) return
      this.$router.push({name: 'gift-card-editing', params: {giftCardId: body.id}})
    }
  },
  components: {QRDialog}
}
</script>
