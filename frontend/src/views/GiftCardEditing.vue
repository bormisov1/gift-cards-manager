<template>
  <div>
    <v-card>
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
            <v-text-field v-if="field.name != 'dates'"
              :disabled="field.disabled"
              :label="field.disabled">
            </v-text-field>
            <custom-vue-tel-input
              v-else-if="field.name.includes('phone')"
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
            </custom-vue-tel-input>
            <span v-else>{{datesString}}</span>
          </v-row>
          <v-row>
            <v-btn @click="save">Сохранить</v-btn>
          </v-row>
        </v-col>
      </v-card-text>
    </v-card>
  </div>
</template>

<script>
import {fetchRequest} from '@/scripts/index'
import CustomVueTelInput from '@/components/CustomVueTelInput';
import 'vue-tel-input/dist/vue-tel-input.css';
export default {
  name: 'GiftCardEditing',
  data: () => ({
    form: {},
  }),
  async created() {
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
  },
  computed: {
    datesString() {
      //parse dates to string
    },
    async qrImage() {
      const {body} = await fetchRequest('/file-handler', 'GET', {giftCardId: this.form.id})
      const urlCreator = window.URL || window.webkitURL
      resolve(urlCreator.createObjectURL(body))
    },
    currentEditingType() {
      const pathToEditingType = {
        'create-gift-card': 'userGiftCardCreation',
        'form-gift-card': 'unauthGiftCardCreation',
        'edit-gift-card': 'giftCardEditing'
      }
      return pathToEditingType[this.$route.path]
    },
    fields() {
      const fields = [
        {name: 'receiverFullName', label: 'ФИО получателя',
          disabled: this.currentEditingType == 'giftCardEditing'},
        {name: 'clientFullName', label: 'ФИО клиента',
          disabled: this.currentEditingType == 'giftCardEditing'},
        {name: 'clientPhone', label: 'Телефон клиента',
          disabled: this.currentEditingType == 'giftCardEditing'},
        {name: 'receiverPhone', label: 'Телефон получателя',
          disabled: this.currentEditingType == 'giftCardEditing'},
        {name: 'sum', label: 'Сумма подарочного сертификата',
          min: 1000, max: 10000, disabled: this.currentEditingType == 'giftCardEditing'},
        {name: 'spentSum', label: 'Потрачено',
          disabled: this.currentEditingType == 'unauthGiftCardCreation'},
        {name: 'dates'}
      ]
      return fields
    }
  },
  methods: {
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
      if (this.currentEditingType == 'unauthGiftCardCreation') {
        fetchRequest('/gift-cards/unauth-create', 'POST', this.form)
      } else fetchRequest('/gift-cards/update', 'POST', this.form)
    },
    telFieldTouched(fieldName, phoneStr, phoneObj) {
      this.$set(this.form, fieldName, phoneObj)
    },
  },
  components: {CustomVueTelInput}
}
</script>
