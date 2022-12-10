<template>
  <div>
    <v-card outlined class="gift-card-data">
      <v-card-text>
        <v-col>
          <v-row v-if="qrImage">
            <v-img
              :src="qrImage">
            </v-img>
          </v-row>
          <v-row
            v-for="(field, fieldIndex) in fields"
            :key="fieldIndex">
            <!-- <custom-vue-tel-input
              v-if="field.name.includes('Phone')"
              :id="'tel-input-' + fieldIndex"
              :key="'tel-input-' + fieldIndex"
              :disabled="field.disabled"
              :value="form[field.name] ? form[field.name].nationalNumber : ''"
              :defaultCountry="'RU'"
              @input="(...args)=>telFieldTouched(field.name,...args)"
              :input-options="{
                placeholder: ' ',disabled: field.disabled
              }"
              :dropdownOptions="{
                showDialCodeInSelection: true,showFlags: true,disabled: field.disabled
              }">
              <template v-slot:arrow-icon> <v-icon>arrow_drop_down</v-icon> </template>
            </custom-vue-tel-input> -->
            <vue-tel-input
              v-if="field.name.includes('Phone')"
              :defaultCountry="'RU'"
              :label="field.label"
              :inputOptions="{placeholder: field.label, label: field.label}"
              style="margin-bottom: 15px; width: 100%"
              v-model="form[field.name]">
              <template slot="arrow-icon"> <span class="vti__dropdown-arrow">&nbsp;▼</span> </template>
              <template slot="label"><div>{{field.label}}</div></template>
            </vue-tel-input>
            <v-text-field v-else-if="!['dates', 'spent'].includes(field.name)"
              :disabled="field.disabled"
              :label="field.label"
              v-model="form[field.name]">
            </v-text-field>
            <span v-else>{{getString(field.name)}}</span>
          </v-row>
          <v-row>
            <v-btn
              @click="save"
              outlined
              class="submit-btn">Сохранить</v-btn>
          </v-row>
        </v-col>
      </v-card-text>
    </v-card>
  </div>
</template>

<script>
import {fetchRequest} from '@/scripts/index'
import { VueTelInput } from 'vue-tel-input';
export default {
  name: 'GiftCardEditing',
  data: () => ({
    form: {},
  }),
  async created() {
    if (this.$route.params.giftCardId) {
      const {body} = await fetchRequest('/gift-cards/', 'GET', {id: this.$route.params.giftCardId})
      if (!body || body.id == null) {
        let toName = 'cardsList'
        if (this.currentEditingType == 'unauthGiftCardCreation') toName = 'notFoundPage'
        this.$router.push({name: toName})
        return
      }
      if (body.description) {
        Object.keys(body.description).forEach(descriptionField => {
          if (typeof body.description[descriptionField] == 'object') {
            Object.keys(body.description[descriptionField]).forEach(field => {
              //to save in form clientFullName for example
              const formFieldName = field[0].toUpperCase() + field.slice(1)
              body[descriptionField + formFieldName] = body.description[descriptionField][field]
            })
          } else body[descriptionField] = body.description[descriptionField]
        })
        delete body.description
      }
      this.form = body
    }
  },
  computed: {
    qrImage() {
      if (this.form.id == null) return ''
      //const {body} = await fetchRequest('/file-handler', 'GET', {giftCardId: this.form.id})
      const urlCreator = window.URL || window.webkitURL
      //return urlCreator.createObjectURL(body)
    },
    currentEditingType() {
      const pathToEditingType = {
        '/create-gift-card': 'userGiftCardCreation',
        '/form-gift-card': 'unauthGiftCardCreation',
        '/edit-gift-card': 'giftCardEditing'
      }
      console.log(this.$route)
      return pathToEditingType[this.$route.path]
    },
    fields() {
      const fields = [
        {name: 'receiverFullName', label: 'ФИО получателя',
          disabled: this.currentEditingType == 'giftCardEditing'},
        {name: 'receiverPhone', label: 'Телефон получателя',
          disabled: this.currentEditingType == 'giftCardEditing'},
        {name: 'clientFullName', label: 'ФИО клиента',
          disabled: this.currentEditingType == 'giftCardEditing'},
        {name: 'clientPhone', label: 'Телефон клиента',
          disabled: this.currentEditingType == 'giftCardEditing'},
        {name: 'sum', label: 'Сумма подарочного сертификата',
          min: 1000, max: 10000, disabled: this.currentEditingType == 'giftCardEditing'},
        {name: 'spentSum', label: 'Потрачено',
          disabled: this.currentEditingType == 'unauthGiftCardCreation'},
        {name: 'spent'},
        {name: 'dates'}
      ]
      return fields
    }
  },
  methods: {
    getString(fieldName) {
      return ''
    },
    save() {
      const dataToSend = this.form
      dataToSend.description = {
        client: {
          fullName: this.form.clientFullName,
          phone: this.form.clientPhone,
          //email?: string;
        },
        receiver: {
          fullName: this.form.receiverFullName,
          phone: this.form.receiverPhone,
        },
      }
      dataToSend.sum = +dataToSend.sum
      console.log(dataToSend, this.currentEditingType)
      const editTypeToUrl = {
        unauthGiftCardCreation: 'unauth-create',
        userGiftCardCreation: 'create',
        giftCardEditing: 'update'
      }
      fetchRequest(`/gift-cards/${editTypeToUrl[this.currentEditingType]}`, 'POST', dataToSend)
      /* if (this.currentEditingType == 'unauthGiftCardCreation') {
        fetchRequest('/gift-cards/', 'POST', this.form)
      } else fetchRequest('/gift-cards/update', 'POST', this.form) */
    },
    telFieldTouched(fieldName, phoneStr, phoneObj) {
      this.$set(this.form, fieldName, phoneObj)
    },
  },
  components: {
    VueTelInput,
  }
}
</script>

<style>
@media (max-width: 800px) {
  .gift-card-data {
    position: initial;
    top: 0;
    left: 0;
    max-width: 800px;
    width: 100%;
  }
}
@media (min-width: 800px) {
  .gift-card-data {
    position: absolute;
    top: calc(50% - 240px);
    left: calc(50% - 400px);
    max-width: 800px;
    width: 100%;
  }
}

.vue-tel-input:focus-within {
  border-color: black !important;
  box-shadow: none !important;
} 

</style>
<style src="vue-tel-input/dist/vue-tel-input.css"></style>
