<template>
  <v-dialog
    v-model="isDialog"
    max-width="800px">
    <v-card>
      <v-layout column>
        <v-flex>
          <v-spacer></v-spacer>
          <v-btn
            icon
            color="red"
            @click="$emit('closeDialog')">
            <v-icon>close</v-icon>
          </v-btn>
        </v-flex>
        <v-flex>
          <qrcode-stream @decode="onDecode" />
        </v-flex>
      </v-layout>
    </v-card>
  </v-dialog>
</template>

<script>
import { QrcodeStream } from 'vue-qrcode-reader'

export default {
  name: 'qrdialog',
  props: ['isDialog'],
  data: () => ({
  }),
  methods: {
    async onDecode(decodedString) {
      const link = decodedString
      this.$emit('closeDialog', link)
    },
  },
  components: {
    QrcodeStream
  }
}
</script>

<style>

</style>