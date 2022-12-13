<template>
  <div class="gift-card-preview">
    <v-row :class="{
        'preview-container': true,
        'preview-container-small': $vuetify.breakpoint.smAndDown
      }">
      <v-col cols="12" sm="12" md="6" lg="6" style="text-align: center">
        <cube v-if="qrImageSrc" :qrURL="qrImageSrc"></cube>
      </v-col>
      <v-col cols="12" sm="12" md="6" lg="6">
        <v-card class="preview-card">
          <v-card-title class="preview-title">Подарочный сертификат на посещение косметолога</v-card-title>
          <v-card-text>
            <v-col>
              <v-row v-for="(field, fieldIndex) in fields"
                :key="fieldIndex">
                <div class="preview-text">{{field.describtion}}{{giftCard[field.name]}}</div>
              </v-row>
            </v-col>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </div>
</template>


<script>
import {fetchRequest, formatDate, blobToBase64} from '@/scripts/index'
import cube from '@/components/cube.vue'
export default {
  components: { cube },
  name: 'gift-card',
  data: () => ({
    qrImageSrc: '',
    giftCard: {},
    fields: [
      {name: 'to', describtion: 'Кому: '},
      {name: 'from', describtion: 'От кого: '},
      {name: 'sum', describtion: 'Совершенствуйте Вашу красоту за '},
      {name: 'expirationDate', describtion: 'Успейте до '}
    ]
  }),
  async created() {
    const {body} = await fetchRequest('/gift-cards/preview/' + this.$route.params.giftCardId, 'GET')
    if (!body || body.id == null) {
      this.$router.push({name: 'notFoundPage'})
      return
    }
    console.log(body)
    this.giftCard = {
      to: body.description.receiver.fullName,
      from: body.description.client.fullName,
      sum: body.sum + ' рублей',
      expirationDate: formatDate(body.expirationDate)
    }
    this.qrImage()
  },
  methods: {
    async qrImage() {
      const blob = await fetchRequest('/file-handler/' + this.$route.params.giftCardId, 'GET')
      this.qrImageSrc = await blobToBase64(blob)
      //const urlCreator = window.URL || window.webkitURL
      //console.log(urlCreator.createObjectURL(body))
      //return urlCreator.createObjectURL(body)
    },
  }
}
</script>

<style>
.gift-card-preview {
  height: 100vh;
  background: linear-gradient(306deg, #6667aa, #f6e059);
}
.preview-text {
  font-size: 30px;
  line-height: 30px;
  color: white;
  font-weight: 500;
  padding-bottom: 10px;
}
.v-card.preview-card {
  max-width: 800px;
  background: rgba(255, 255, 255, 0);
  border-radius: 16px;
  box-shadow: 0 4px 30px rgba(0, 0, 0, 0.1);
  backdrop-filter: blur(1.5px);
  -webkit-backdrop-filter: blur(1.5px);
  border: 1px solid rgba(255, 255, 255, 0.57);
}
.preview-title{
  color: white;
  font-size: 25px;
  font-weight: 600;
  word-break: break-word;
}

.preview-container{
  width: 100%; margin: 0;position: absolute;
  top: calc(50% - 150px); flex-wrap: wrap;
  overflow-y: auto;
}

.preview-container-small{
  top: 0 !important;
  height: 100%;
}
</style>
