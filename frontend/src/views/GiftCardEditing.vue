<template>
  <div>
    <v-dialog persistent v-model="showQRDialog" :width="500">
      <v-card :style="`min-height: 350px; padding: 10px;`">
        <v-layout column style="min-height: 340px;">
          <v-flex style="text-align: end">
            <v-btn
              icon
              color="red"
              @click="showQRDialog = false">
              <v-icon>close</v-icon>
            </v-btn>
          </v-flex>
          <v-flex style="text-align: center">
            <img
              :src="qrImageSrc" alt="Image">
          </v-flex>
        </v-layout>
      </v-card>
    </v-dialog>
    <v-dialog v-model="isConfirmActivationDialog"
      persistent max-width=500 style="margin: 0">
      <v-card :style="`min-height: 150px; padding: 10px`">
        <v-layout column style="min-height: 140px;">
          <v-flex>
            <v-layout row style="width: 100%; justify-content: flex-end" class="ma-0">
              <v-flex shrink>
                <v-btn
                  icon
                  color="red"
                  @click="isConfirmActivationDialog = false">
                  <v-icon>close</v-icon>
                </v-btn>
              </v-flex>
              <v-flex style="text-align: center">
                <p
                  class="headline"
                  style="word-break: break-word">
                  Вы уверены, что хотите выдать сертификат для {{form.clientFullName}} на сумму {{form.sum}}?
                </p>
              </v-flex>
              <v-flex ml-4 mr-4>
                <v-layout row
                  style="width: 100%; justify-content: space-around; margin: 0; margin-top: 20px;">
                  <v-flex shrink>
                    <v-btn outlined
                      style="color: red; border-radius: 30px"
                      @click="isConfirmActivationDialog = false">
                      Отмена
                    </v-btn>
                  </v-flex>
                  <v-flex shrink>
                    <v-btn
                      class="submit-btn" outlined
                      @click="activate">
                      Подтвердить
                    </v-btn>
                  </v-flex>
                </v-layout>
              </v-flex>
            </v-layout>
        </v-flex>
        </v-layout>
      </v-card>
    </v-dialog>
    <v-card outlined class="gift-card-data diod-container back-btn-container">
      <v-btn
        v-if="'unauthGiftCardCreation' != currentEditingType"
        class="back-btn"
        icon
        @click="$router.go(-1)">
        <v-icon>arrow_back</v-icon>
      </v-btn>
      <div v-if="form.active || form.expired"
        class="status">{{form.active ? 'Активен' : 'Неактивен'}}</div>
      <div v-if="form.active || form.expired"
        :class="'diod ' + (form.active ? 'active' : '')"></div>
      <v-card-text>
        <v-col>
          <v-row v-if="qrImageSrc" style="justify-content: center;">
            <img
              :src="qrImageSrc" alt="Image">
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
              v-if="field.name.includes('Phone') && !hideField(field.name)"
              :defaultCountry="'RU'"
              :label="field.label"
              :disabled="fieldDisabled(field.name)"
              :mode="'international'"
              :validCharactersOnly="true"
              :inputOptions="{placeholder: field.label, label: field.label, showDialCode: true}"
              style="margin-bottom: 15px; width: 100%"
              v-model="form[field.name]">
              <template slot="arrow-icon"> <span class="vti__dropdown-arrow">&nbsp;▼</span> </template>
              <template slot="label"><div>{{field.label}}</div></template>
            </vue-tel-input>
            <v-checkbox
              v-else-if="field.component == 'checkbox' && !hideField(field.name)"
              :disabled="fieldDisabled(field.name)"
              :label="field.label"
              :true-value="field.name == 'spent' ? 1 : true"
              :false-value="field.name == 'spent' ? 0 : false"
              v-model="form[field.name]">
            </v-checkbox>
            <v-text-field
              v-else-if="!['dates', 'spentPrev'].includes(field.name)
                && !hideField(field.name) && field.type == 'number'"
              :disabled="fieldDisabled(field.name)"
              :label="field.label"
              :class="errorFields.includes(field.name) ? 'error-field' : ''"
              :error="errorFields.includes(field.name)"
              v-model="form[field.name]"
              v-mask="'######'">
            </v-text-field>
            <v-text-field
              v-else-if="!['dates', 'spentPrev'].includes(field.name) && !hideField(field.name)"
              :disabled="fieldDisabled(field.name)"
              :label="field.label"
              :class="errorFields.includes(field.name) ? 'error-field' : ''"
              :error="errorFields.includes(field.name)"
              v-model="form[field.name]">
            </v-text-field>
            <span
              v-else-if="getString(field.name)"
              class="string-field">{{getString(field.name)}}</span>
          </v-row>
          <v-row>
            <v-btn
              @click="save"
              outlined
              :disabled="actionsDisabled"
              class="submit-btn">Сохранить</v-btn>
              <v-btn
                v-if="activeBtnAvailable"
                :disabled="actionsDisabled"
                @click="isConfirmActivationDialog = true"
                class="submit-btn" outlined style="margin-left: 30px">
                Активировать
              </v-btn>
          </v-row>
        </v-col>
      </v-card-text>
    </v-card>
  </div>
</template>
<script>
import { VueTelInput } from 'vue-tel-input';
import {mask} from 'vue-the-mask'
import _ from 'lodash'

import {fetchRequest, formatDate, blobToBase64} from '@/scripts/index'

export default {
  name: 'GiftCardEditing',
  directives: {mask},
  data: () => ({
    form: {},
    showQRDialog: false,
    isConfirmActivationDialog: false,
    qrImageSrc: '',
    errorFields: []
  }),
  async created() {
    if (this.$route.params.giftCardId) {
      await this.init()
    }
  },
  watch: {
    showQRDialog(value, oldValue) {
      if (value === false && oldValue === true) {
        this.$router.push({name: 'cardsList'})
      }
    },
    'form.spentNow'(value) {
      const totalSpent = +value + (this.form.spent ? +this.form.spent : 0)
      if (totalSpent > this.form.sum) {
        this.errorFields.push('spentNow')
      } else {
        this.errorFields.splice(this.errorFields.indexOf('spentNow'), 1)
      }
    }
  },
  computed: {
    requiredFieldNames() {
      let fields = _.cloneDeep(this.fields) || []
      fields = fields.filter(f => {
        return !this.hideField(f.name)
          && !this.fieldDisabled(f.name)
          && !['isService', 'spentNow', 'spent', 'dates', 'spentPrev'].includes(f.name)
      })
      return fields.map(f => f.name)
    },
    actionsDisabled() {
      return !!this.errorFields.length || this.requiredFieldNames.some(fName => {
        return !this.form[fName]
      })
    },
    activeBtnAvailable() {
      const usedService = this.form.isService && this.form.spent
      const usedSum = this.form.spent >= this.form.sum
      return !this.form.active
        && !usedService && !usedSum
        && !this.form.expired
        && this.currentEditingType == 'giftCardEditing'
    },
    currentEditingType() {
      const pathToEditingType = {
        'createGiftCard': 'userGiftCardCreation',
        'formGiftCard': 'unauthGiftCardCreation',
        'editGiftCard': 'giftCardEditing'
      }
      return pathToEditingType[this.$route.name]
    },
    fields() {
      const fields = [
        {name: 'receiverFullName', label: 'ФИО клиента'},
        {name: 'receiverPhone', label: 'Телефон клиента'},
        {name: 'clientFullName', label: 'ФИО покупателя'},
        {name: 'clientPhone', label: 'Телефон покупателя',},
        {name: 'isService', label: 'Конкретная процедура', component: 'checkbox'},
        {name: 'sum', label: 'Сумма подарочного сертификата', type: 'number'},
        {name: 'service', label: 'Подарочный сертификат на услугу'},
        {name: 'spentPrev'},
        {name: 'spent', label: 'Использован', component: 'checkbox'},
        {name: 'spentNow', label: 'Потрачено', type: 'number'},
        {name: 'dates'},
      ]
      return fields
    }
  },
  methods: {
    hideField(fieldName) {
      const usedSum = this.form.spent >= this.form.sum
      const unauthCreationHiddenFields = this.currentEditingType == 'unauthGiftCardCreation'
        && ['isService', 'service', 'spent', 'spentNow'].includes(fieldName)
      const serviceExtraFields = ['spentNow', 'sum'].includes(fieldName) && this.form.isService
      const sumExtraFields = ['spent', 'service'].includes(fieldName) && !this.form.isService
      return unauthCreationHiddenFields
        || serviceExtraFields
        || sumExtraFields
        || 'spent' == fieldName && !this.form.active
        || 'spentNow' == fieldName && usedSum
    },
    fieldDisabled(fieldName) {
      if (fieldName.includes('receiver') || fieldName.includes('client')) {
        return this.currentEditingType == 'giftCardEditing'
      } else if (fieldName == 'isService') {
        return this.form.isService && (this.form.spent || this.form.active)
      } else if (fieldName == 'sum') {
        const usedSum = this.form.spent >= this.form.sum
        return this.currentEditingType == 'giftCardEditing' && (this.form.active || usedSum)
      } else if (fieldName == 'service') {
        return this.currentEditingType == 'giftCardEditing' && (this.form.active || this.form.spent)
      }
      return false
    },
    async qrImage(id) {
      if ((!this.form.id || !this.form.active) && !id) return ''
      const blob = await fetchRequest('/file-handler/' + (this.form.id || id), 'GET')
      this.qrImageSrc = await blobToBase64(blob)
      //const urlCreator = window.URL || window.webkitURL
      //console.log(urlCreator.createObjectURL(body))
      //return urlCreator.createObjectURL(body)
    },
    async init() {
      const {body} = await fetchRequest('/gift-cards/' + this.$route.params.giftCardId, 'GET')
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
      if (this.form.expirationDate < new Date()) this.form.expired = true
      this.qrImage()
    },
    getString(fieldName) {
      if (fieldName == 'spentPrev') {
        if (this.form.isService && this.form.spent) {
          return 'Использован'
        } else if (this.form.spent) {
          return 'Потрачено ' + this.form.spent + ', осталось ' + (this.form.sum - this.form.spent) 
        }
      } else if (fieldName == 'dates' && this.currentEditingType == 'giftCardEditing') {
        if (!this.form.activationDate) return ''
        return formatDate(this.form.activationDate) + ' - ' + formatDate(this.form.expirationDate)
      }
      return ''
    },
    async save() {
      if (this.actionsDisabled) return
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
      if (this.form.sum) dataToSend.sum = +dataToSend.sum
      if (!this.form.isService) dataToSend.spent = +dataToSend.spentNow
      const editTypeToUrl = {
        unauthGiftCardCreation: 'create',
        userGiftCardCreation: 'create',
        giftCardEditing: 'update'
      }
      const result = await fetchRequest(`/gift-cards/${editTypeToUrl[this.currentEditingType]}`,'POST', dataToSend)
      if (result && result.body) {
        if ('userGiftCardCreation' == this.currentEditingType) {
          console.log(result.body)
          this.qrImage(result.body)
          this.showQRDialog = true
          return
        }
        if ('unauthGiftCardCreation' == this.currentEditingType) {
          this.$router.push({name: 'success'})
        } else this.$router.push({name: 'cardsList'})
      } else {
        //TODO inform user about error
      }
      /* if (this.currentEditingType == 'unauthGiftCardCreation') {
        fetchRequest('/gift-cards/', 'POST', this.form)
      } else fetchRequest('/gift-cards/update', 'POST', this.form) */
    },
    /* telFieldTouched(fieldName, phoneStr, phoneObj) {
      this.$set(this.form, fieldName, phoneObj)
    }, */
    async activate() {
      if (this.actionsDisabled) return
      const dataToSend = {
        id: this.form.id,
        active: true,
      }
      if (this.form.sum) dataToSend.sum = +this.form.sum
      if (this.form.service) dataToSend.service = +this.form.service
      const result = await fetchRequest(`/gift-cards/activate`,'POST', dataToSend)
      if (result && result.body) {
        this.isConfirmActivationDialog = false
        await this.qrImage(this.form.id)
        this.showQRDialog = true
      }
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
    padding-top: 20px;
  }
}
@media (min-width: 800px) {
  .gift-card-data {
    position: absolute;
    top: calc(30% - 240px);
    left: calc(50% - 400px);
    max-width: 800px;
    width: 100%;
  }
}

.error-field {
  color: red !important
}

.error-field .v-label {
  color: red !important
}

.vue-tel-input:focus-within {
  border-color: black !important;
  box-shadow: none !important;
}

.string-field {
  font-size: 18px;
  margin-bottom: 10px;
}
</style>
<style src="vue-tel-input/dist/vue-tel-input.css"></style>
