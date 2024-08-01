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
        <uv-form-item label="审核状态" prop="auditStatus" borderBottom>
          <uv-radio-group v-model="goodsForm.auditStatus">
            <uv-radio label="审核中" :name="0"></uv-radio>
            <uv-radio label="通过" :name="1"></uv-radio>
            <uv-radio label="拒绝" :name="2"></uv-radio>
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
        <uv-form-item label="成本价" prop="costPrice" borderBottom>
          <uv-input
            type="digit"
            :modelValue="goodsForm.costPrice"
            @update:modelValue="updateCostPrice"
            border="none"
            placeholder="请输入成本价"
          ></uv-input>
        </uv-form-item>
        <uv-form-item label="毛利率" prop="promotionRate" borderBottom>
          <uv-input
            type="number"
            :modelValue="goodsForm.promotionRate"
            @update:modelValue="updatePromotionRate"
            border="none"
            placeholder="请输入毛利率"
            :disabled="isCooperation == '1'"
          ></uv-input>
          %
        </uv-form-item>
        <uv-form-item label="销售价" prop="salePrice" borderBottom>
          <uv-input
            type="digit"
            :modelValue="goodsForm.salePrice"
            @update:modelValue="updateSalePrice"
            border="none"
            placeholder="请输入销售价"
            :disabled="isCooperation == '1'"
          ></uv-input>
        </uv-form-item>
        <uv-form-item label="划线价" prop="marketPrice" borderBottom>
          <uv-input
            type="digit"
            v-model="goodsForm.marketPrice"
            border="none"
            placeholder="请输入划线价"
          ></uv-input>
        </uv-form-item>
        <uv-form-item label="无理由退货" prop="isReturn" borderBottom>
          <uv-radio-group :modelValue="goodsForm.isReturn" @update:modelValue="updateIsReturn">
            <uv-radio label="是" name="1"></uv-radio>
            <uv-radio label="否" name="0"></uv-radio>
          </uv-radio-group>
        </uv-form-item>
        <uv-form-item
          label="退货比率"
          prop="returnGoodsRate"
          v-if="goodsForm.isReturn == 0"
          borderBottom
        >
          <uv-input
            type="number"
            :modelValue="goodsForm.returnGoodsRate"
            border="none"
            placeholder="请输入退货比率"
            @update:modelValue="updateReturnGoodsRate"
          ></uv-input>
          %
        </uv-form-item>
        <uv-form-item
          label="退货金额"
          prop="returnGoodsPrice"
          v-if="goodsForm.isReturn == 0"
          borderBottom
        >
          <uv-input
            type="digit"
            :modelValue="goodsForm.returnGoodsPrice"
            @update:modelValue="updateReturnGoodsPrice"
            border="none"
            placeholder="请输入退货金额"
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

import {
  getCategoryInfoTree,
  addGoodsForSupplier,
  getSupplerInfoById,
  fetchUnitList,
} from '@/service/goods'
import { queryDictListByCode } from '@/service/dict'

import { imgsToRichText } from '@/utils/imgs-to-rich-text'
import { showToast } from '@/utils/interaction'
import { mapOptionTree } from '@/utils/tree'
import { findNodeById } from '@/utils/find-tree'

const formRef = ref<any>()
const goodsForm = reactive<any>({
  supplierId: '',
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
  activity: '',
  isSale: 1, // 商品状态： 是否上架，默认上架
  auditStatus: 0, // 审核状态
  marketPrice: '', // 市场价、划线价
  salePrice: '', // 销售价
  // activityPrice: '', // 营销价
  costPrice: '', // 成本价
  promotionRate: '', // 毛利率
  isReturn: '1', // 是否允许无理由退货
  returnGoodsRate: 0, // 退货比率
  returnGoodsPrice: 0, // 退货金额
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
  unit: {
    type: 'string',
    required: true,
    message: '请选择单位',
    trigger: ['bluer', 'change'],
  },
  costPrice: {
    type: 'string',
    required: true,
    message: '请输入成本价',
    trigger: ['bluer', 'change'],
  },
  // activity: {
  //   type: 'string',
  //   required: true,
  //   message: '请选择商品活动',
  //   trigger: ['bluer', 'change'],
  // },
  promotionRate: {
    type: 'string',
    required: true,
    message: '请填写正确的毛利率0-100之间',
    // 自定义验证函数
    validator(rule, value, callback) {
      if (+value >= 0 && +value <= 100) {
        return true
      }
      return false
    },
    trigger: ['bluer', 'change'],
  },
  marketPrice: {
    type: 'string',
    // 自定义验证函数
    validator(rule, value, callback) {
      if (+value >= +goodsForm.salePrice) {
        return true
      }
      return false
    },
    message: '划线价必须大于或等于销售价',
    trigger: ['bluer', 'change'],
  },
  isReturn: {
    type: 'string',
    required: true,
    message: '请选择是否可以无理由退货',
    trigger: ['bluer', 'change'],
  },
  returnGoodsRate: {
    type: 'string',
    // 自定义验证函数
    validator(rule, value, callback) {
      if (+value >= 0 && +value <= 100) {
        return true
      }
      return false
    },
    message: '请填写正确的退货比率0-100之间',
    trigger: ['bluer', 'change'],
  },
  returnGoodsPrice: {
    type: 'string',
    required: true,
    message: '请填写退货金额',
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

// 获取供应商id
onLoad((options) => {
  if (options.supplierId) {
    goodsForm.supplierId = options.supplierId
    getPromotionRate()
  }
})
const isCooperation = ref('0')

// 获取毛利率
function getPromotionRate() {
  getSupplerInfoById(goodsForm.supplierId).then((res) => {
    isCooperation.value = res.data.isCooperation
    if (isCooperation.value === '1') {
      goodsForm.promotionRate = res.data.cooperationRate
    }
  })
}

// 商品分类
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

const goodsRate = ref<any>('')
// 获取退货比率
function getReturnGoodsRate() {
  queryDictListByCode('return_goods_rate').then((res) => {
    goodsRate.value = res.data[0].dictKey
    goodsForm.returnGoodsRate = res.data[0].dictKey
  })
}
getReturnGoodsRate()

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
// 通过成本价和毛利率计算销售价
function calcSalePriceByCostPriceAndPromotionRate() {
  goodsForm.salePrice = String(
    (+goodsForm.costPrice * (1 + +goodsForm.promotionRate / 100)).toFixed(2),
  )
}
// 通过成本价和和销售价计算毛利率
function calcPromotionRateByCostPriceAndSalePrice() {
  goodsForm.promotionRate = String(
    ((+goodsForm.salePrice / +goodsForm.costPrice - 1) * 100).toFixed(0),
  )
}
// 更新成本价
function updateCostPrice(value) {
  goodsForm.costPrice = value
  // 计算销售价
  if (goodsForm.promotionRate) {
    calcSalePriceByCostPriceAndPromotionRate()
    // 计算毛利率
  } else if (goodsForm.salePrice) {
    calcPromotionRateByCostPriceAndSalePrice()
  }
}

// 更新毛利率
function updatePromotionRate(value) {
  goodsForm.promotionRate = value
  // 计算销售价
  if (goodsForm.costPrice) {
    calcSalePriceByCostPriceAndPromotionRate()
  }
}
// 通过退货比率和销售价计算退货金额
function returnGoodsPriceByReturnGoodsRateAndSalePrice() {
  goodsForm.returnGoodsPrice = String(
    ((+goodsForm.returnGoodsRate / 100) * +goodsForm.salePrice).toFixed(2),
  )
}
// 通过退货价和销售价计算退货比率
function returnGoodsRateByReturnGoodsPriceAndSalePrice() {
  goodsForm.returnGoodsRate = String(
    ((+goodsForm.returnGoodsPrice / +goodsForm.salePrice) * 100).toFixed(),
  )
}
// 更新销售价
function updateSalePrice(value) {
  goodsForm.salePrice = value
  // 计算毛利率
  if (goodsForm.costPrice) {
    calcPromotionRateByCostPriceAndSalePrice()
  }
  // 退货金额
  if (goodsForm.returnGoodsRate) {
    returnGoodsPriceByReturnGoodsRateAndSalePrice()
  } else if (goodsForm.returnGoodsPrice) {
    // 退货比率
    returnGoodsRateByReturnGoodsPriceAndSalePrice()
  }
}
const cacheReturnGoodsRate = ref<any>('')
// 更新是否允许无理由退货
function updateIsReturn(value) {
  goodsForm.isReturn = value
  if (value === '1') {
    cacheReturnGoodsRate.value = goodsForm.returnGoodsRate
    goodsForm.returnGoodsRate = goodsRate.value
  } else {
    if (cacheReturnGoodsRate.value) {
      goodsForm.returnGoodsRate = cacheReturnGoodsRate.value
    }
  }
  returnGoodsPriceByReturnGoodsRateAndSalePrice()
}
// 更新退货比率
function updateReturnGoodsRate(value) {
  goodsForm.returnGoodsRate = value
  // 计算退货金额
  if (goodsForm.salePrice) {
    returnGoodsPriceByReturnGoodsRateAndSalePrice()
  }
}
// 更新退货金额
function updateReturnGoodsPrice(value) {
  goodsForm.returnGoodsPrice = value
  // 计算退货比率
  if (goodsForm.salePrice) {
    returnGoodsRateByReturnGoodsPriceAndSalePrice()
  }
}

// 添加商品
function addGoods() {
  const info = { ...goodsForm }
  // 处理商品封面
  info.goodsCover = goodsForm.goodsCover[0]
  // 处理详情
  info.detailContent = imgsToRichText(goodsForm.detailImgUrlList)
  formRef.value
    .validate()
    .then(() => {
      const info = { ...goodsForm }
      // 处理商品分类
      info.goodsCategoryId = getGoodsCategoryId()
      // 处理商品封面
      info.goodsCover = goodsForm.goodsCover[0]
      // 处理详情
      info.detailContent = imgsToRichText(goodsForm.detailImgUrlList)
      addGoodsForSupplier(info).then((res) => {
        showToast(res.msg).then(() => {
          uni.navigateBack({ delta: 1 })
        })
      })
    })
    .catch((err) => {
      if (Array.isArray(err) && err.length) {
        showToast(err[0].message)
      }
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
