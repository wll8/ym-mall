<route lang="json5" type="page">
{
  style: {
    navigationBarTitleText: '搜索',
    navigationStyle: 'custom',
  },
}
</route>

<template>
  <fly-navbar />
  <view class="content" :style="{ paddingTop: safeAreaInsets?.top + 'px' }">
    <drag-cart v-if="showResult && userStore.userInfo.role_name === 'user'" />
    <view class="search-box">
      <view class="input-box">
        <input
          focus
          type="text"
          adjust-position="true"
          v-model="keyword"
          :placeholder="defaultKeyword"
          placeholder-class="search_text"
          @confirm="doSearch"
          confirm-type="search"
          @input="onInput"
        />
        <view class="i-carbon-close-filled" @click="onClear" v-if="showClear === true"></view>
      </view>
      <view :class="[`search-btn`, { 'g-disable': keyword.length === 0 }]" @click="doSearch">
        搜索
      </view>
    </view>

    <view class="search-keyword" v-if="!showResult">
      <scroll-view class="keyword-box" scroll-y>
        <view class="keyword-block" v-if="oldKeywordList.length > 0">
          <view class="keyword-list-header">
            <view>历史搜索</view>
            <view>
              <view @click="oldDelete" class="i-carbon-trash-can"></view>
            </view>
          </view>
          <view class="keyword">
            <view v-for="(item, index) in oldKeywordList" :key="index" @click="doHisSearch(item)">
              {{ item }}
            </view>
          </view>
        </view>
      </scroll-view>
    </view>
    <result v-if="showResult" :topheight="topheight" :keyword="keyword" :querys="options" />
  </view>
</template>

<script lang="js" setup>
import result from './result.vue'
import { getRect } from 'wot-design-uni/components/common/util'
const { safeAreaInsets = {} } = uni.getSystemInfoSync()
const topheight = ref(`0px`)
const kStorageKey = 'searchKeyword'

const defaultKeyword = ref('')
const keyword = ref('')
const oldKeywordList = ref([])
const showClear = ref(false)
const options = ref({})

const showResult = ref(false)

watch(
  keyword,
  () => {
    if (keyword.value === ``) {
      showResult.value = false
    }
  },
  {
    immediate: true,
  },
)
onReady(() => {
  getRect('.search-box', false).then((rects) => {
    topheight.value = rects.height + safeAreaInsets.top + `px`
  })
})

const loadDefaultKeyword = () => {
  // 定义默认搜索关键字，可以自己实现ajax请求数据再赋值,用户未输入时，以水印方式显示在输入框，直接不输入内容搜索会搜索默认关键字
  defaultKeyword.value = `请输入搜索的内容`
}

// 保存关键字到历史记录
const saveKeyword = (keyword) => {
  uni.getStorage({
    key: kStorageKey,
    success: (res) => {
      const OldKeys = JSON.parse(res.data)
      const findIndex = OldKeys.indexOf(keyword)

      if (findIndex === -1) {
        OldKeys.unshift(keyword)
      } else {
        OldKeys.splice(findIndex, 1)
        OldKeys.unshift(keyword)
      } // 最多10个纪录

      OldKeys.length > 10 && OldKeys.pop()
      uni.setStorage({
        key: kStorageKey,
        data: JSON.stringify(OldKeys),
      })
      oldKeywordList.value = OldKeys
    },
    fail: (e) => {
      const OldKeys = [keyword]
      uni.setStorage({
        key: kStorageKey,
        data: JSON.stringify(OldKeys),
      })
      oldKeywordList.value = OldKeys
    },
  })
}

// 加载历史搜索,自动读取本地Storage
const loadOldKeyword = () => {
  uni.getStorage({
    key: kStorageKey,
    success: (res) => {
      const OldKeys = JSON.parse(res.data)
      oldKeywordList.value = OldKeys
    },
  })
}
// 执行搜索事件
const doSearch = () => {
  if (keyword.value === '') {
    uni.showToast({
      title: '请输入要搜索的内容',
      icon: 'none',
    })
    return
  }
  //
  if (keyword.value && keyword.value !== '') {
    saveKeyword(keyword.value) // 保存为历史
  }
  showResult.value = false
  nextTick(() => {
    showResult.value = true
  })
}

const onClear = (e) => {
  keyword.value = ``
  showClear.value = false
}

const onInput = (e) => {
  const value = typeof e === `string` ? e : e.detail.value
  keyword.value = value
  showClear.value = value !== ''
}

const oldDelete = () => {
  uni.showModal({
    content: '确定清除历史搜索记录？',
    success: (res) => {
      if (res.confirm) {
        console.log('用户点击确定')
        oldKeywordList.value = []
        uni.removeStorage({
          key: kStorageKey,
        })
      } else if (res.cancel) {
        console.log('用户点击取消')
      }
    },
  })
}

// 点击历史记录搜索
const doHisSearch = (item) => {
  onInput(item)
  setTimeout(() => {
    doSearch()
  }, 100)
}

const init = () => {
  loadDefaultKeyword()
  loadOldKeyword()
}

onLoad((opt) => {
  options.value = opt
  if (opt.pageType === `auto`) {
    showResult.value = true
  }
  init()
})
</script>

<style lang="scss" scoped>
view {
  display: block;
}

.search-box {
  position: sticky;
  top: 0;
  display: flex;
  justify-content: space-between;
  padding: 15rpx 2.5%;
  padding-bottom: 15px;
  padding-left: 44px;

  // background-color: rgb(242 242 242);

  .input-box {
    display: flex;
    flex-shrink: 1;
    align-items: center;
    justify-content: center;
    width: 85%;
    padding: 0 3%;
    margin: 0;
    font-size: 24rpx;
    appearance: none;
    background-color: #fff;
    border: 1px solid #ccc;
    border-radius: 60rpx;

    image {
      position: absolute;
      top: 50%;
      right: 2%;
      z-index: 100;
      float: right;
      width: 40rpx;
      height: 40rpx;
      transform: translateY(-50%);
    }

    & > input {
      width: 95%;
      height: 60rpx;
      margin: 0;
      font-size: 24rpx;
      appearance: none;
      background-color: #fff;
    }
  }

  .mSearch-input-box {
    width: 100%;
  }

  .search-btn {
    display: flex;
    flex-shrink: 0;
    align-items: center;
    justify-content: center;
    width: 15%;
    margin: 0 0 0 2%;
    font-size: 24rpx;
    color: #fff;
    background: linear-gradient(to right, #4492eb, #3f92ee);
    border-radius: 60rpx;
  }

  .search-keyword {
    width: 100%;
    background-color: rgb(242 242 242);

    .keyword-box {
      height: calc(100vh - 110rpx);
      background-color: #fff;
      border-radius: 20rpx 20rpx 0 0;
    }
  }
}

.keyword-block {
  padding: 10rpx 0;

  .keyword-list-header {
    display: flex;
    justify-content: space-between;
    width: 94%;
    padding: 10rpx 3%;
    font-size: 27rpx;
    color: #333;

    image {
      width: 40rpx;
      height: 40rpx;
    }
  }

  .keyword {
    display: flex;
    flex-flow: wrap;
    justify-content: flex-start;
    width: 94%;
    padding: 3px 3%;

    & > view {
      display: flex;
      align-items: center;
      justify-content: center;
      height: 60rpx;
      padding: 0 20rpx;
      margin: 10rpx 20rpx 10rpx 0;
      font-size: 24rpx;
      line-height: 60rpx;
      color: #6b6b6b;
      background-color: rgb(242 242 242);
      border-radius: 38rpx;
    }
  }
}

.search_text {
  font-size: 24rpx;
  color: #b6b6c6;
}
</style>
