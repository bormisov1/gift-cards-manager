<template>
  <div class="gift-card-preview">
    <v-row :class="{
        'preview-container': true,
        'preview-container-small': $vuetify.breakpoint.smAndDown
      }">
      <v-col cols="12" sm="12" md="6" lg="6" style="justify-content: center;display: flex;">
        <cube v-if="qrImageSrc" :qrURL="qrImageSrc"></cube>
      </v-col>
      <v-col cols="12" sm="12" md="6" lg="6" style="max-height: 800px;">
        <v-card class="preview-card">
          <v-card-title class="preview-title">{{`Подарочный сертификат \nВсе начинается с красивой кожи...`}}</v-card-title>
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
      <v-col v-if="$vuetify.breakpoint.smAndDown" sm="12" style="position: relative">
        <contactbox></contactbox>
      </v-col>
    </v-row>
    <contactbox v-if="$vuetify.breakpoint.mdAndUp"></contactbox>
    <div id="background"></div>
  </div>
</template>


<script>
import {fetchRequest, formatDate, blobToBase64} from '@/scripts/index'
import cube from '@/components/cube.vue'
import Contactbox from '@/components/contactbox.vue'
export default {
  components: { cube, Contactbox },
  name: 'gift-card',
  data: () => ({
    qrImageSrc: '',
    giftCard: {},
    fields: [
      {name: 'to', describtion: 'Кому: '},
      {name: 'from', describtion: 'От кого: '},
      {name: 'sum', describtion: 'На сумму '},
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
@media (max-width: 800px) {
  .cube-container {
    display: flex;
    height: 320px;
    width: 350px;
    align-self: center;
    margin-top: 30px;
  }
  .gift-card-preview {
    background: linear-gradient(306deg, #febad1,#0000) !important;
  }
  .v-card.preview-card {
    margin-bottom: 100px
  }
  .contact-box {
    z-index: 1 !important;
  }
}
.contact-box_container * {
  display: flex;
  justify-content: center;
  padding: 3px;
}
.contact-box__text.link {
  cursor: pointer;
}
.wa-btn {
  width: 25px;
  height: 25px;
  background-image: url(/whatsapp.svg);
  background-position: top left;
  background-repeat: no-repeat;
  background-color: transparent;
  background-size: cover;
  margin-right: 20px;
  background-size: contain;
  display: block;
}
.contact-box__wa_text {
  line-height: 25px;
  cursor: pointer;
  color: black;
  text-decoration: none  !important;
}
.gift-card-preview {
  height: 100vh;
}
.preview-container {
  z-index: 2;
}
#background {
  height: 100vh;
  background: url('/background.png');
  background-size: cover;
  opacity: 0.65;
  z-index: 0;
  /* linear-gradient(306deg, #6667aa, #f6e059); */
}
.preview-text {
  font-size: 30px;
  line-height: 30px;
  color: #4f073b;
  font-weight: 500;
  padding-bottom: 10px;
}
.v-card.preview-card {
  max-width: 650px;
  background: rgba(255, 255, 255, 0);
  border-radius: 16px;
  box-shadow: 0 4px 30px rgba(0, 0, 0, 0.1);
  backdrop-filter: blur(1.5px);
  -webkit-backdrop-filter: blur(1.5px);
  border: 1px solid rgba(255, 255, 255, 0.57);
  padding: 10px;
  max-height: 500px;
}
.preview-title{
  color: #4f073b;
  font-size: 25px;
  font-weight: 600;
  word-break: break-word;
  white-space: break-spaces;
}

.preview-container{
  width: 100%; margin: 0;position: absolute;
  top: calc(50% - 200px); flex-wrap: wrap;
  overflow-y: auto;
}

.preview-container-small{
  top: 0 !important;
  height: 100%;
}
.contact-box {
  position: absolute;
  bottom: 0;
  left: calc(50% - 171px);
  width: 342px;
  z-index: 2;
}
</style>
