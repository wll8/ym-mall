<route lang="json5" type="page">
{
  style: {
    navigationBarTitleText: '地址管理',
    navigationBarBackgroundColor: '#fff',
    navigationStyle: 'default',
  },
}
</route>

<template>
  <view class="bg-stone-50 h-full">
    <view>
      <wd-form ref="form" :model="formData">
        <scroll-view scroll-y="true" style="height: 85vh">
          <wd-card
            v-for="item in AddressList"
            :key="item.id"
            @click="deliverAddress(item, routeType)"
          >
            <template #title>
              <view class="title flex items-center">
                <wd-img
                  v-if="item.defaultState == 2"
                  :width="28"
                  :height="17"
                  :src="httpurl('/static/images/personalCenter/hot@2x.png')"
                />
                <view class="mx-1 text-xl">{{ item.realName }}</view>
                <view class="title-tip text-slate-500">{{ item.phone }}</view>
              </view>
            </template>
            <view class="text-sm text-slate-500">
              {{ item.addressAllName + item.detail }}
            </view>
            <template #footer>
              <view class="flex items-center justify-between text-slate-500">
                <view class="flex items-center">
                  <view @click.stop="changeDefault(item.id)">
                    <wd-img
                      v-if="item.defaultState === 2"
                      :width="16"
                      :height="16"
                      :src="httpurl('/static/images/personalCenter/icon_cell/Selected.png')"
                    />
                    <wd-img
                      v-else
                      :width="16"
                      :height="16"
                      :src="httpurl('/static/images/personalCenter/icon_cell/notSelected.png')"
                    />
                  </view>
                  <view>设置为默认收货地址</view>
                </view>
                <view class="flex items-center" @click.stop="toEdit(item.id)">
                  <wd-img
                    :width="16"
                    :height="16"
                    :src="httpurl('/static/images/personalCenter/icon_cell/edit.png')"
                  />
                  <span class="mx-1">编辑</span>
                </view>
                <view class="flex items-center" @click.stop="deleteAddress(item.id)">
                  <wd-img
                    :width="18"
                    :height="18"
                    :src="httpurl('/static/images/personalCenter/icon_cell/Delete.png')"
                  />
                  <span class="mx-1">删除</span>
                </view>
              </view>
            </template>
          </wd-card>
        </scroll-view>
      </wd-form>
      <view class="footer">
        <view class="btnstyle text-center" @click="toAdd()">新增收货地址</view>
      </view>
    </view>
  </view>
</template>

<script lang="js" setup>
import { getAddressList, changeDefaultAddress, deleteAddressdata } from '@/service/address'
import useAddress from '@/hooks/useAddress'
const AddressList = ref([])
const formData = ref({
  phoneNumber: null,
  consignee: null,
  address: null,
  description: null,
  defaultState: null,
})
const addressData = ref({
  current: 1,
  size: 100,
})
const routeType = ref(null)

onLoad((option) => {
  if (option.type) {
    routeType.value = option.type
  }
})

onShow(() => {
  handleSubmit()
})
function deliverAddress(data, type) {
  if (type) {
    uni.navigateBack({
      delta: 1, // 返回的页面数
      success: () => {
        uni.$emit('getAddress', {
          current: data,
        })
      },
    })
  }
}

function changeDefault(id) {
  changeDefaultAddress({ id }).then((res) => {
    useAddress().loadDefaultAddress()
    handleSubmit()
  })
}
const form = ref()
const toEdit = (id) => {
  uni.navigateTo({ url: `EditAddress?id=${id}` })
}
const toAdd = () => {
  uni.navigateTo({ url: `EditAddress` })
}

function deleteAddress(id) {
  uni.showModal({
    content: '是否确认删除该地址',
    success: function (res) {
      if (res.confirm) {
        deleteAddressdata({ id }).then((res) => {
          useAddress().loadDefaultAddress()
          handleSubmit()
        })
      }
    },
  })
}
function handleSubmit() {
  getAddressList(addressData.value).then((result) => {
    AddressList.value = result.data.records
  })
}

// /** 触底事件 */
// function onReachBottom() {
//   addressData.value.current++
//   handleSubmit()
// }
</script>

<style lang="scss" scoped>
.btnstyle {
  position: absolute;
  bottom: 2vh;
  left: 50%;
  width: 319px;
  height: 6vh;
  line-height: 6vh;
  color: #fff;
  background: #b42a3e;
  border-radius: 24px;
  transform: translateX(-50%);
}
</style>
