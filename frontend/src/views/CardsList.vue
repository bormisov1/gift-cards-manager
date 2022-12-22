<template>
  <div>
    <qrdialog
      v-if="isScanQRDialog"
      :isDialog="isScanQRDialog"
      @closeDialog="closeScanQRDialog">
    </qrdialog>
    <v-toolbar flat :elevation="0">
      <v-row style="justify-content: space-between;">
        <v-col v-if="$vuetify.breakpoint.mdAndUp" cols="auto" style="align-self: center;">
          <div class="title">Выданные сертификаты</div>
        </v-col>
        <v-col cols="12" sm="auto">
          <v-row style="justify-content: flex-end;">
            <v-col cols="auto">
              <v-btn icon @click="createQR">
                <v-icon color="#6667aa">add</v-icon>
              </v-btn>
            </v-col>
            <v-col cols="auto">
              <v-btn icon @click="isScanQRDialog = true">
                <v-icon color="#6667aa">qr_code_scanner</v-icon>
              </v-btn>
            </v-col>
            <v-col cols="auto">
              <v-btn icon @click="logout">
                <v-icon style="color: red">logout</v-icon>
              </v-btn>
            </v-col>
          </v-row>
        </v-col>
      </v-row>
    </v-toolbar>
    <v-row class="gift-cards-row">
      <v-col
        cols="12" sm="6" md="6" lg="3"
        v-for="(giftCard, giftCardIndex) in giftCards"
        :key="giftCardIndex">
        <v-card @click="openGiftCard(giftCard.id)" outlined class="diod-container">
          <div :class="`diod ${giftCard.active ? 'active' : ''}`"></div>
          <!-- id copieble-->
          <v-card-title v-if="giftCard.receiverFullName" class="gift-card-title">
            {{giftCard.receiverFullName}}
          </v-card-title>
          <v-card-subtitle>
            <span v-if="giftCard.isService" class="describtion">
              На услугу {{giftCard.service}}
            </span>
            <span v-else-if="giftCard.spent" class="describtion">
              Потрачено {{giftCard.spent}} из {{giftCard.sum}}
            </span>
            <span v-else class="describtion">Сумма {{giftCard.sum}}</span>
          </v-card-subtitle>
        </v-card>
      </v-col>
    </v-row>
  </div>
</template>

<script>
import qrdialog from '@/components/qrdialog'
import {fetchRequest} from '@/scripts/index'
export default {
  name: 'CardsList',
  data: () => ({
    isScanQRDialog: false,
    giftCards: []
  }),
  async created() {
    //load cards
    const response = await fetchRequest('/gift-cards/', 'GET')
    if (response && response.body) {
      this.giftCards = response.body
    }
  },
  computed: {},
  methods: {
    openGiftCard(giftCardId) {
      this.$router.push({name: 'editGiftCard', params: {giftCardId}})
    },
    closeScanQRDialog(link) {
      this.isScanQRDialog = false
      if (link) {
        const splittedLink = link.split('/')
        const giftCardId = splittedLink[splittedLink.length - 1]
        this.openGiftCard(giftCardId)
      }
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
  components: {qrdialog}
}
</script>

<style>
.title {
  color: #6667aa;
  font-weight: 500;
  font-size: 20px;
  line-height: 20px;
}
.gift-cards-row {
  flex-wrap: wrap;
  width: 100%;
  margin: 0;
}
.gift-card-title {
  white-space: nowrap;
  text-overflow: ellipsis;
  padding-right: 10px;
  width: inherit;
  overflow-x: hidden;
  display: block;
}
.describtion {
  font-weight: 500;
  font-size: 16px;
  line-height: 16px;
}
</style>
