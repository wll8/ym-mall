<route lang="json5" type="page">
{
  style: {
    navigationBarTitleText: '添加商品',
    navigationBarBackgroundColor: '#fff',
    navigationStyle: 'default',
  },
}
</route>

<template>
  <view class="add-goods">
    <view class="main">
      <uv-form
        :rules="rules"
        labelPosition="left"
        labelWidth="100"
        :model="goodsForm"
        ref="formRef"
      >
        <uv-form-item label="商品名称" prop="goodsName" borderBottom>
          <uv-input
            v-model="goodsForm.goodsName"
            border="none"
            placeholder="请输入商品名称"
          ></uv-input>
        </uv-form-item>
        <!-- <uv-form-item label="商品编号" prop="goodsNo" borderBottom>
          <uv-input
            v-model="goodsForm.goodsNo"
            border="none"
            placeholder="请输入商品编号"
          ></uv-input>
        </uv-form-item> -->
        <uv-form-item label="商品分类" prop="goodsCategoryId" borderBottom>
          <uni-data-picker
            placeholder="请选择商品分类"
            popup-title="请选择商品分类"
            :localdata="productClass"
            :modelValue="goodsForm.goodsCategoryId"
            @update:modelValue="updateGoodsCategoryId"
          ></uni-data-picker>
        </uv-form-item>
        <uv-form-item label="商品活动" prop="activity" borderBottom>
          <wd-select-picker
            label-key="dictValue"
            value-key="dictKey"
            type="radio"
            v-model="goodsForm.activity"
            :columns="activities"
          ></wd-select-picker>
        </uv-form-item>
        <uv-form-item label="商品状态" prop="isSale" borderBottom>
          <uv-radio-group v-model="goodsForm.isSale">
            <uv-radio label="上架" :name="1"></uv-radio>
            <uv-radio label="下架" :name="0"></uv-radio>
          </uv-radio-group>
        </uv-form-item>
        <uv-form-item label="产地" prop="origin" borderBottom>
          <uv-textarea
            v-model="goodsForm.origin"
            border="none"
            placeholder="请输入产地"
            autoHeight
          ></uv-textarea>
        </uv-form-item>
        <uv-form-item label="单位" prop="unit" borderBottom>
          <wd-select-picker
            label-key="name"
            value-key="id"
            type="radio"
            v-model="goodsForm.unit"
            :columns="units"
          ></wd-select-picker>
        </uv-form-item>
        <uv-form-item label="商品规格" prop="goodsSpec" borderBottom>
          <uv-input
            v-model="goodsForm.goodsSpec"
            border="none"
            placeholder="请求输入商品规格"
          ></uv-input>
        </uv-form-item>
        <!-- <uv-form-item label="市场价" prop="marketPrice" borderBottom>
          <uv-input
            type="number"
            v-model="goodsForm.marketPrice"
            border="none"
            placeholder="请输入市场价"
          ></uv-input>
        </uv-form-item>
        <uv-form-item label="销售价" prop="salePrice" borderBottom>
          <uv-input
            type="number"
            v-model="goodsForm.salePrice"
            border="none"
            placeholder="请输入销售价"
          ></uv-input>
        </uv-form-item>
        <uv-form-item label="营销价" prop="name" borderBottom>
          <uv-input
            type="number"
            v-model="goodsForm.price"
            border="none"
            placeholder="请输入营销价"
          ></uv-input>
        </uv-form-item> -->
        <uv-form-item label="成本价" prop="costPrice" borderBottom>
          <uv-input
            type="number"
            v-model="goodsForm.costPrice"
            border="none"
            placeholder="请输入成本价"
          ></uv-input>
        </uv-form-item>
        <uv-form-item label="库存" prop="totalStock" borderBottom>
          <uv-input
            type="number"
            v-model="goodsForm.totalStock"
            border="none"
            placeholder="请输入商品库存"
          ></uv-input>
        </uv-form-item>
        <uv-form-item label="库存预警" prop="alertStock" borderBottom>
          <uv-input
            type="number"
            v-model="goodsForm.alertStock"
            border="none"
            placeholder="请输入库存预警"
          ></uv-input>
        </uv-form-item>
        <!-- <uv-form-item label="折扣价" prop="discountPrice" borderBottom>
          <uv-input
            type="number"
            v-model="goodsForm.discountPrice"
            border="none"
            placeholder="请输入折扣价"
          ></uv-input>
        </uv-form-item>
        <uv-form-item label="折扣" prop="discount" borderBottom>
          <uv-input
            type="number"
            v-model="goodsForm.discount"
            border="none"
            placeholder="请输入折扣"
          ></uv-input>
        </uv-form-item>
        <uv-form-item label="折扣说明" prop="discountRange" borderBottom>
          <uv-textarea
            v-model="goodsForm.discountRange"
            border="none"
            placeholder="请输入折扣说明"
            auto-height
          ></uv-textarea>
        </uv-form-item> -->
        <!-- <uv-form-item label="运费" prop="discount" borderBottom>
          <uv-input
            type="number"
            v-model="goodsForm.freePrice"
            border="none"
            placeholder="请输入运费"
          ></uv-input>
        </uv-form-item> -->
        <uv-form-item label="商品参数" prop="goodsParamsList" label-position="top" borderBottom>
          <AddGoodsParams v-model="goodsForm.goodsParamsList" />
        </uv-form-item>
        <uv-form-item label="商品封面图" label-position="top" prop="goodsCover">
          <view class="wrap-upload">
            <UploadImages
              :multiple="false"
              :max-count="1"
              v-model:imgs-list="goodsForm.goodsCover"
            />
          </view>
        </uv-form-item>
        <uv-form-item label="商品主图" label-position="top" prop="slideshowList">
          <view class="wrap-upload">
            <UploadImages v-model:imgs-list="goodsForm.slideshowList" />
          </view>
        </uv-form-item>
        <uv-form-item label="图文详情" label-position="top" prop="detailImgUrlList">
          <view class="wrap-upload">
            <UploadImages v-model:imgs-list="goodsForm.detailImgUrlList" />
          </view>
        </uv-form-item>
      </uv-form>
    </view>
    <FooterButtonCard>
      <CommonButton width="100%" @click="addGoods">确定</CommonButton>
    </FooterButtonCard>
  </view>
</template>

<script lang="ts" setup>
import AddGoodsParams from '@/components/add-goods-params/index.vue'
import { queryDictListByCode } from '@/service/dict'

import { fetchUnitList, getCategoryInfoTree, newGoods } from '@/service/goods'
import { findNodeById } from '@/utils/find-tree'
import { imgsToRichText } from '@/utils/imgs-to-rich-text'
import { showToast } from '@/utils/interaction'
import { mapOptionTree } from '@/utils/tree'

const formRef = ref<any>()
const goodsForm = reactive<any>({
  goodsName: '', // 商品名称
  // goodsNo: '', // 商品单号
  goodsParamsList: [
    {
      paramName: '',
      paramValue: '',
    },
  ],
  origin: '', // 产地
  unit: '', // 单位
  goodsCategoryId: '', // 商品分类
  goodsSpec: '', // 规格
  activity: '', // 商品活动
  isSale: 1, // 是否上架，默认上架
  // marketPrice: '', // 市场价
  // salePrice: '', // 销售价
  // activityPrice: '', // 营销价
  costPrice: '', // 成本价
  // discountPrice: '', // 折扣价
  // discount: '', // 折扣
  // discountRange: '', // 折扣说明
  // freePrice: 0, // 运费
  // activityRate: 0, // 行销利润
  goodsCover: [],
  slideshowList: [], // 轮播图
  totalStock: '', // 总库存
  alertStock: '1',
  detailContent: '', // 详情内容
  detailImgUrlList: [],
  // isFreeShipping: 0, // 是否包邮
  // isHot: 0, // 是否热销
  // isNew: 0, // 是否新品
  // isRecom: 0, // 是否推荐
})
const rules = reactive<any>({
  goodsName: {
    type: 'string',
    required: true,
    message: '请输入商品名称',
    trigger: ['bluer', 'change'],
  },
  goodsNo: {
    type: 'string',
    required: true,
    message: '请输入商品编号',
    trigger: ['bluer', 'change'],
  },
  goodsCategoryId: {
    type: 'string',
    required: true,
    message: '请选择商品分类',
    trigger: ['bluer', 'change'],
  },
  totalStock: {
    type: 'string',
    required: true,
    message: '请填写商品库存',
    trigger: ['bluer', 'change'],
  },
  alertStock: {
    type: 'string',
    required: true,
    message: '请填写库存预警',
    trigger: ['bluer', 'change'],
  },
  unit: {
    type: 'string',
    required: true,
    message: '请选择单位',
    trigger: ['bluer', 'change'],
  },
  goodsSpec: {
    type: 'string',
    required: true,
    message: '请输入商品规格',
    trigger: ['bluer', 'change'],
  },
  salePrice: {
    type: 'string',
    required: true,
    message: '请输入销售价',
    trigger: ['bluer', 'change'],
  },
  costPrice: {
    type: 'string',
    required: true,
    message: '请输入成本价',
    trigger: ['bluer', 'change'],
  },
  goodsCover: {
    // 自定义验证函数
    validator(rule, value, callback) {
      if (value && value.length) {
        return true
      }
      return false
    },
    message: '请上传商品封面',
    trigger: ['bluer'],
  },
  slideshowList: {
    // 自定义验证函数
    validator(rule, value, callback) {
      if (value && value.length) {
        return true
      }
      return false
    },
    message: '请上传商品主图',
    trigger: ['bluer'],
  },
  detailImgUrlList: {
    // 自定义验证函数
    validator(rule, value, callback) {
      if (value && value.length) {
        return true
      }
      return false
    },
    message: '请上传图文详情',
    trigger: ['bluer'],
  },
  // goodsParamsList: [
  //   {
  //     // 自定义验证函数
  //     validator(rule, value, callback) {
  //       for (const item of value) {
  //         if (!item.paramName || !item.paramValue) {
  //           return false
  //         }
  //       }
  //       return true
  //     },
  //     message: '商品参数必填',
  //     trigger: ['blur'],
  //   },
  // ],
})
const productClass = ref<any[]>([])
function getProductClass() {
  getCategoryInfoTree().then((res) => {
    productClass.value = mapOptionTree(res.data, { label: 'title', value: 'id' })
  })
}
getProductClass()

// 活动列表
const activities = ref([])
function getActivities() {
  queryDictListByCode('goods_activity').then((res) => {
    activities.value = res.data
  })
}
getActivities()

// 商品单位列表
const units = ref<any>([])
function getUnties() {
  fetchUnitList().then((res) => {
    units.value = res.data
  })
}
getUnties()

// 处理商品分类该斌
function updateGoodsCategoryId(value: IdType) {
  goodsForm.goodsCategoryId = `${value}`
}
function getGoodsCategoryId() {
  const node = findNodeById(productClass.value, goodsForm.goodsCategoryId)
  if (node) {
    const parentId = node.parentId
    return `${parentId}-${goodsForm.goodsCategoryId}`
  }
  return goodsForm.goodsCategoryId
}
// 添加商品
function addGoods() {
  const info = { ...goodsForm }
  // 处理商品封面
  info.goodsCover = goodsForm.goodsCover[0]
  // 处理详情
  info.detailContent = imgsToRichText(goodsForm.detailImgUrlList)

  formRef.value.validate().then(() => {
    const info = { ...goodsForm }
    // 处理商品分类
    info.goodsCategoryId = getGoodsCategoryId()
    // 处理商品封面
    info.goodsCover = goodsForm.goodsCover[0]
    // 处理详情
    info.detailContent = imgsToRichText(goodsForm.detailImgUrlList)
    newGoods(info)
      .then((res) => {
        showToast(res.msg).then(() => {
          uni.navigateBack({ delta: 1 })
        })
      })
      .catch((err) => {
        if (Array.isArray(err) && err.length) {
          showToast(err[0].message)
        }
      })
  })
}
</script>

<style lang="scss" scoped>
.main {
  padding: 0 24rpx;
}

.wrap-upload {
  padding-top: 24rpx;
}
</style>
