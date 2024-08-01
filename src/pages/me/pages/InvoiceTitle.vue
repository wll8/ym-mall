<route lang="json5" type="page">
{
  style: {
    navigationBarTitleText: '发票抬头管理',
    navigationBarBackgroundColor: '#fff',
    navigationStyle: 'default',
  },
}
</route>

<template>
  <view class="text-center">
    <view class="p-10px">
      <wd-form ref="formDataRef" :model="formData">
        <wd-cell-group border>
          <wd-cell title="抬头类型" title-width="60px">
            <view class="custom-value" style="height: 32px">
              <wd-radio-group
                v-model="formData.headerType"
                style="line-height: 0"
                shape="button"
                checked-color="#fa4350"
              >
                <wd-radio :value="'0'">个人</wd-radio>
                <wd-radio :value="'1'">单位</wd-radio>
              </wd-radio-group>
            </view>
          </wd-cell>
          <wd-input
            placeholder="请输入抬头名称"
            label="抬头名称"
            label-width="80px"
            prop="headerName"
            clearable
            v-model="formData.headerName"
            :rules="[
              {
                required: false,
                pattern: /^.+$/,
                message: '请输入抬头名称',
              },
            ]"
          />
          <view v-show="formData.headerType == 1">
            <wd-input
              v-if="formData.headerType == 1"
              placeholder="请输入单位税号"
              label="单位税号"
              label-width="80px"
              prop="unit"
              clearable
              v-model="formData.unit"
              :rules="[
                {
                  required: false,
                  pattern: /^.+$/,
                  message: '请输入单位税号',
                },
              ]"
            />
            <wd-input
              placeholder="选填"
              label="注册地址"
              label-width="80px"
              prop="registerAddress"
              clearable
              v-model="formData.registerAddress"
            />
            <wd-input
              placeholder="选填"
              label="注册电话"
              label-width="80px"
              prop="registerPhone"
              clearable
              v-model="formData.registerPhone"
            />
            <wd-input
              placeholder="选填"
              label="开户银行"
              label-width="80px"
              prop="bank"
              clearable
              v-model="formData.bank"
            />
            <wd-input
              placeholder="选填"
              label="银行账户"
              label-width="80px"
              prop="bankNumber"
              clearable
              v-model="formData.bankNumber"
            />
          </view>
          <wd-input
            placeholder="请注意填写正确邮箱格式，可选填"
            label="收票邮箱"
            label-width="80px"
            prop="remark"
            clearable
            v-model="formData.remark"
          />
        </wd-cell-group>

        <view class="footer">
          <view class="btnstyle" @click="handleSubmit">保存</view>
        </view>
      </wd-form>
    </view>
  </view>
</template>

<script lang="js" setup>
import { getInvoiceTitle, addInvoiceTitle, updateInvoiceTitle } from '@/service/Invoice'
const formData = ref({
  headerType: '0',
  headerName: '',
  UnitTaxNumber: '',
  RegisteredAddress: '',
  RegistrationPhone: '',
  accountBank: '',
  bankAccount: '',
  TicketEmail: '',
})
const formDataRef = ref()
const addRessId = ref(null)

onLoad(() => {
  getInvoiceTitleById()
})

function handleSubmit() {
  formDataRef.value.validate().then(({ valid, errors }) => {
    if (valid) {
      formData.value.id = null
      if (addRessId.value) {
        updateInvoiceTitle(formData.value).then((res) => {
          uni.navigateBack({
            delta: 1,
          })
        })
      } else {
        addInvoiceTitle(formData.value).then((res) => {
          uni.navigateBack({
            delta: 1,
          })
        })
      }
    }
  })
}

function getInvoiceTitleById() {
  getInvoiceTitle().then((res) => {
    if (res.data) {
      const data = res.data
      formData.value = data
    }
  })
}
</script>

<style lang="scss" scoped>
.from {
  position: relative;
  height: 50px;
  margin: 0 auto;
}

.link {
  position: absolute;
  right: 10px;
  bottom: 25px;
  font-size: 14px;
  color: #999;
}

.link-left {
  position: absolute;
  bottom: 25px;
  left: 10px;
  font-size: 14px;
  color: #999;
}

.btnstyle {
  position: absolute;
  bottom: 16px;
  left: 50%;
  width: 319px;
  height: 48px;
  line-height: 48px;
  color: #fff;
  background: #b42a3e;
  border-radius: 24px;
  transform: translateX(-50%);
}

.text1 {
  overflow: hidden;
  color: #bfbfbf;
  text-align: left;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.input-selected {
  /* #ifndef APP-NVUE */
  display: flex;
  /* #endif */
  flex-direction: row;
  line-height: 2;
}
</style>
