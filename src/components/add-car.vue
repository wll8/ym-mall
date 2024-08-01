<template>
  <view
    @click.stop="addToCar()"
    v-if="userStore.userInfo.role_name === 'user'"
    class="i-carbon-add-filled add"
  >
    <view v-show="cur">{{ cur }}</view>
  </view>
</template>

<script lang="ts" setup>
import { useCarStore } from '@/store/car'
import toBindInvitaionCode from '@/utils/to-bind-invitaion-code'

const carStore = useCarStore()
carStore.refreshList()

const cur = ref(0)

const props = withDefaults(
  defineProps<{
    goodsId?: string | number
  }>(),
  {
    goodsId: ``,
  },
)

function addToCar() {
  if (toBindInvitaionCode()) {
    carStore.add(props.goodsId, 1)
  }
}
</script>

<style lang="scss" scoped>
.add {
  width: 20px;
  height: 20px;
  background-color: #f00;
}
</style>
