<route lang="json5" type="page">
{
  style: {
    navigationBarTitleText: '新增/编辑收货地址',
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
          <wd-input
            placeholder="请输入姓名"
            label="姓名"
            label-width="80px"
            prop="realName"
            clearable
            v-model="formData.realName"
            :rules="[
              {
                required: false,
                pattern: /^.+$/,
                message: '请输入姓名',
              },
            ]"
          />
          <wd-input
            label="手机号码"
            label-width="80px"
            prop="phone"
            clearable
            v-model="formData.phone"
            placeholder="请输入手机号码"
            :rules="[
              {
                required: false,
                pattern:
                  /^(13[0-9]|14[01456879]|15[0-35-9]|16[2567]|17[0-8]|18[0-9]|19[0-35-9])\d{8}$/,
                message: '请填写正确的手机号码',
              },
            ]"
          />
          <wd-cell left title="所在地区" title-width="60px">
            <view class="custom-value">
              <uni-data-picker
                :clear-icon="false"
                :ellipsis="true"
                :localdata="dataTree"
                v-model="classes"
                @change="onchange"
                @nodeclick="onnodeclick"
                v-slot:default="{ data, error }"
              >
                <view class="input-border">
                  <view v-if="error" class="error">
                    <text>{{ error }}</text>
                  </view>
                  <view v-else-if="data.length" class="input-selected">
                    <view v-for="(item, index) in data" :key="index" class="selected-item">
                      <text>{{ item.text }}</text>
                    </view>
                  </view>
                  <view class="text1" v-else><text>请选择收货地址所在地区</text></view>
                </view>
              </uni-data-picker>
            </view>
          </wd-cell>
          <wd-textarea
            v-model="formData.detail"
            auto-height
            label-width="60px"
            label="详细地址"
            placeholder="详细到街道、门牌号"
          />
          <wd-cell left title="设置为默认收货地址" title-width="127px">
            <view class="custom-value">
              <switch :checked="isChecked" color="#B42A3E" @change="switch2Change" />
            </view>
          </wd-cell>
        </wd-cell-group>

        <view class="footer">
          <view class="btnstyle" @click="handleSubmit">确认</view>
        </view>
      </wd-form>
    </view>
  </view>
</template>

<script lang="js" setup>
import useAddress from '@/hooks/useAddress'
import { getPickerList, getAddressdata, addAddress, updateAddress } from '@/service/address'
const addressHook = useAddress()
const isChecked = ref(false)
const formData = ref({
  phone: '',
  realName: '',
  province: '',
  city: '',
  district: '',
  detail: '',
  defaultState: false,
})
const formDataRef = ref()
const classes = ref('0')
const dataTree = ref([])
const addRessId = ref(null)

onLoad((options) => {
  if (options.id) {
    addRessId.value = options.id
    getAddressById(addRessId.value)
  }
})

function handleSubmit() {
  formDataRef.value.validate().then(({ valid, errors }) => {
    console.log(valid)
    if (valid) {
      if (!isChecked.value) {
        formData.value.defaultState = '1'
      } else {
        isChecked.value === true
          ? (formData.value.defaultState = '2')
          : (formData.value.defaultState = '1')
      }
      if (addRessId.value) {
        updateAddress(formData.value).then((res) => {
          // 加载默认地址
          if (formData.value.defaultState === '2' && !addressHook.current.value.id) {
            addressHook.loadDefaultAddress()
          }
          uni.navigateBack({
            delta: 1,
          })
        })
      } else {
        addAddress(formData.value).then((res) => {
          // 加载默认地址
          if (formData.value.defaultState === '2' && !addressHook.current.value.id) {
            addressHook.loadDefaultAddress()
          }
          uni.navigateBack({
            delta: 1,
          })
        })
      }
    }
  })
}

function switch2Change(e) {
  isChecked.value = e.detail.value
}
function getAddressById(id) {
  getAddressdata({ id, type: 0 }).then((res) => {
    const data = res.data
    formData.value = data
    if (data.defaultState === 2) {
      isChecked.value = true
    } else if (data.defaultState === 1) {
      isChecked.value = false
    }
    classes.value = data.district
  })
}
function handlePickerList() {
  getPickerList().then((res) => {
    dataTree.value = test(res.data)
  })
}
function onnodeclick(e) {}
function onchange(e) {
  const data = e.detail.value
  formData.value.province = data[0].value
  formData.value.city = data[1].value
  formData.value.district = data[2].value
  formData.value.addressAllName = data[0].text + data[1].text + data[2].text
}
function test(tree) {
  const outArray = []
  for (const data of tree) {
    const out = { text: data.name, value: data.code }
    if (data.children && data.children.length) {
      out.children = test(data.children)
    }
    outArray.push(out)
  }
  return outArray
}

handlePickerList()
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
