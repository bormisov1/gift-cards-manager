<template>
  <div>
    <v-img
      v-if="qrImage"
      :src="qrImage">
    </v-img>
    {{giftCard}}
  </div>
</template>


<script>
import {fetchRequest} from '@/scripts/index'
export default {
  name: 'gift-card',
  data: () => ({
    giftCard: {}
  }),
  async created() {
    const {body} = await fetchRequest('/gift-cards/preview', 'GET', {id: this.$route.params.giftCardId})
    if (!body || body.id == null) {
      this.$router.push({name: 'notFoundPage'})
      return
    }
    this.giftCard = body
  },
  computed: {
    async qrImage() {
      const {body} = await fetchRequest('/file-handler', 'GET', {giftCardId: this.giftCard.id})
      const urlCreator = window.URL || window.webkitURL
      resolve(urlCreator.createObjectURL(body))
    },
  },
}
</script>
