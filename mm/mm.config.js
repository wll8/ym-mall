const internal = require('stream')
const { pinyin } = require('pinyin')
const path = require(`path`)
const fs = require(`fs`)
const publicDir = path.join(__dirname, `./httpData/public/`)

const api = require(`./api/index.js`)
const changePage = require(`./change-page.js`)
const getUser = require(`./get-user.js`)
const { wrapApiData } = require(`./util.js`)

const tableIndex = {
  driver: `/pages/driver-me/index`,
  busi: `/pages/index/index`,
  user: `/pages/index/index`,
  store: `/pages/vendor-me/index`,
}

const tableTabbar = {
  driver: [],
  busi: [
    {
      iconPath: '/static/tabbar/index0.png',
      selectedIconPath: '/static/tabbar/index1.png',
      pagePath: '/pages/index/index',
      text: '首页',
    },
    {
      iconPath: '/static/tabbar/type0.png',
      selectedIconPath: '/static/tabbar/type1.png',
      pagePath: '/pages/type/index',
      text: '分类',
    },
    {
      iconPath: '/static/tabbar/me0.png',
      selectedIconPath: '/static/tabbar/me1.png',
      pagePath: '/pages/me/index',
      text: '我的',
    },
  ],
  user: [
    {
      iconPath: '/static/tabbar/index0.png',
      selectedIconPath: '/static/tabbar/index1.png',
      pagePath: '/pages/index/index',
      text: '首页',
    },
    {
      iconPath: '/static/tabbar/type0.png',
      selectedIconPath: '/static/tabbar/type1.png',
      pagePath: '/pages/type/index',
      text: '分类',
    },
    {
      iconPath: '/static/tabbar/car0.png',
      selectedIconPath: '/static/tabbar/car1.png',
      pagePath: '/pages/car/index',
      text: '购物车',
    },
    {
      iconPath: '/static/tabbar/me0.png',
      selectedIconPath: '/static/tabbar/me1.png',
      pagePath: '/pages/me/index',
      text: '我的',
    },
    {
      iconPath: '/static/tabbar/example.png',
      selectedIconPath: '/static/tabbar/exampleHL.png',
      pagePath: '/pages/demo/index',
      text: '示例',
    },
  ],
  store: [],
}

/**
 * 配置说明请参考文档:
 * https://hongqiye.com/doc/mockm/config/option.html
 * @type {import('mockm/@types/config').Config}
 */
module.exports = (util) => {
  const mockjs = util.libObj.mockjs
  return {
    disable: true,
    guard: false,
    port: 9900,
    testPort: 9905,
    replayPort: 9901,
    watch: [`./api/`],
    apiWeb: `./apiWeb.json`,
    plugin: [changePage, getUser],
    proxy: {
      '/': 'https://www.test.com/rp/ym/api',
      '/anything/intercept': [`origin`, `127.0.0.1`], // 修改接口返回的数据
    },
    api: {
      // 在其他文件里的 api
      // ...api(util).api,

      // 当为基本数据类型时, 直接返回数据, 这个接口返回 {"msg":"ok"}
      '/api/1': { msg: `ok` },

      // 也可以像 express 一样返回数据
      '/api/2': function (req, res) {
        res.send({ msg: `ok` })
      },

      // 一个只能使用 post 方法访问的接口
      'post /api/3': { msg: `ok` },

      // // 一个 websocket 接口, 会发送收到的消息
      // 'ws /api/4' (ws, req) {
      //   ws.on('message', (msg) => ws.send(msg))
      // },

      // 一个下载文件的接口
      '/file': function (req, res) {
        res.download(__filename, `mm.config.js`)
      },
      // 获取动态的接口路径的参数 code
      '/status/:code': function (req, res) {
        res.json({ statusCode: req.params.code })
      },
      async '/car/:id'(req, res, next) {
        const id = req.params.id
        const db = await globalThis.config._db
        const data = db.getState()
        res.mm.resHandleJsonApi = (arg) => {
          arg.data.goods = data.goods.find((item) => String(item.id) === String(id))
          return arg.resHandleJsonApi(arg)
        }
        next()
      },
      async 'post /file/upload'(req, res, next) {
        const multiparty = await util.toolObj.generate.initPackge(`multiparty`)
        !fs.existsSync(publicDir) && fs.mkdirSync(publicDir, { recursive: true })
        const form = new multiparty.Form({ uploadDir: publicDir })
        form.parse(req, async (_err, fields = [], files) => {
          const file = files.file[0]
          const url = `http://${global.config.osIp}:${global.config.port}/public/${path.parse(file.path).base}`
          res.json({ url })
        })
      },
      // 文件上传mock2
      async 'post /v1/file/put-file'(req, res, next) {
        const multiparty = await util.toolObj.generate.initPackge(`multiparty`)
        !fs.existsSync(publicDir) && fs.mkdirSync(publicDir, { recursive: true })
        const form = new multiparty.Form({ uploadDir: publicDir })
        form.parse(req, async (_err, fields = [], files) => {
          const file = files.file[0]
          const link = `http://${global.config.osIp}:${global.config.port}/public/${path.parse(file.path).base}`
          res.json(
            wrapApiData({
              data: { link },
            }),
          )
        })
      },
      async 'post /user'(req, res, next) {
        res.mm.resHandleJsonApi = (arg) => {
          arg.data.role_name = `user`
          arg.data.indexPage = tableIndex[arg.data.role_name]
          return arg.resHandleJsonApi(arg)
        }
        next()
      },
    },
    dbCover: true,
    db: mockjs.mock({
      'foo|1-3': [
        {
          'id|+1': 1,
          name: `@cname`,
        },
      ],
      type: {
        'list|5-10': [
          {
            'id|+1': 1,
            imagePath: `@image()`,
            name: `@cword(3, 4)`,
            'children|5-15': [
              {
                'id|+1': 1,
                name: `@ctitle`,
                imagePath: `@image()`,
              },
            ],
          },
        ],
      },
      'goods|50-100': [
        {
          'id|+1': 1,
          goodsName: `@ctitle`, // 商品名称
          activity: `@integer(10, 99)`, // 	商品活动
          goodsCategoryId: `@integer(10, 99)`, // 	商品活动
          activityName: `@ctitle`, // 	商品活动名称
          goodsCover: `@image()`, // 商品封面
          goodsSpec: `@ctitle`, // 商品规格
          'goodsParamsList|2-6': [
            // 商品参数
            {
              'id|+1': 1,
              paramName: `@ctitle`,
              paramValue: `@cword(5,10)`,
            },
          ],
          'slideshowList|3-5': [`@image()`], // 轮播图
          'detailImgUrlList|3-5': [`@image()`], // 详情图片
          detailContent: `<center>
            <h1> @ctitle </h1> <img src="@image " /> <p> @cparagraph </p> <img src="@image " /> <p> @cparagraph </p> <img src="@image " /> <p> @cparagraph </p> <img src="@image " /> <p> @cparagraph </p> <img src="@image " /> <p> @cparagraph </p> <img src="@image " /> <p> @cparagraph </p>
        </center>`, // 详情内容
          totalStock: `@integer(10, 1000)`, // 总库存
          totalSales: `@integer(1, 100)`, // 总销量
          guidePrice: `@integer(1, 100)`, // 指导价
          salePrice: `@integer(1, 100)`, // 销售价
          isHot: `@pick(0, 1)`, // 是否热销;1-是 0-否
          zoneType: `@integer(1, 3)`, // 专区类型
          商家Id: `@integer(1, 3)`, // 专区类型
          isActivity: `@pick(0, 1)`, // 是否参加活动;1-是 0-否
          isSale: `@pick(0, 1)`, // 商品上架状态;1-上架 0-下架
          costPrice: `@integer(1, 100)`, // 成本价
          goodsNo: `@uuid`, // 商品编号
          auditStatus: `@pick(0, 1, 2)`, //  0-待审核 1-通过 2-未通过
        },
      ],
      'car|0': [
        {
          'id|+1': 1,
          cover: `@image`, // 商品图片
          'goodsId|+1': 1, // 商品id
          goodsImg: `@image`, // 商品封面
          goodsName: `@ctitle`, // 商品名称
          goodsNum: `@integer(1, 100)`, // 商品数量
          'goodsSpecId|+1': 1, // 规格id
          goodsSpecName: `@ctitle`, // 规格名称
          isActivity: `@pick(0, 1)`, // 是否参加活动;1-是 0-否
          isSale: `@pick(0, 1)`, // 商品上架状态;1-上架 0-下架
          needAmount: `@integer(1, 100)`, // 积分兑换时需要扣除的金额
          needIntegral: `@integer(1, 100)`, // 抵扣所需积分
          obtainIntegral: `@integer(1, 100)`, // 购买时获得的积分数
          salePrice: `@integer(1, 100)`, // 商品价格
          'shoppingCartId|+1': 1, // 购物车id
          zoneType: `@integer(1, 3)`, // 专区类型
        },
      ],
      'order|30': [
        {
          'id|+1': 1,
          consignee: `@cname`, // 收货人
          consigneePhoneNumber: `@phone`, // 收货人手机号
          discountAmount: `@integer(1, 999)`, // 优惠金额
          createTime: `@datetime`, // 创建时间或下单时间
          // distributeMode: `@integer(1, 2)`, // 配送方式;1-快递 2-自取
          'driverId|+1': 1, // 司机ID
          driverName: `@cname`, // 	司机名称
          driverState: `@pick(1, 2, 3)`, // 司机订单状态（1待发货，2已发货，3已送达）
          'fileUrl|2-4': [`@image`], // 配送司机上传图片
          // 订单地址
          orderDetail: {
            'id|+1': 1,
            address: `@cword(5, 10)`, // 详细地址
            city: `@city`, // 市
            district: `@county`, // 区
            province: `@province`, // 省
          },
          orderGrouponGoods: [
            {
              'id|+1': 1,
              afterSalesGoodsNum: `@integer(1, 100)`, // 	售后商品数量
              costPrice: `@integer(10, 999)`, // 成本价
              'goodsId|+1': 1,
              goodsImage: `@image`,
              goodsName: `@ctitle`,
              goodsNo: `@uuid`, // 商品编号
              goodsNum: `@integer(1, 200)`, // 商品购买数量
              goodsPrice: `@integer(10, 999)`, // 商品价格
              goodsSpec: `@ctitle`, // 商品规格
              orderId: `integer(1, 5)`, // 订单id
            },
          ],
          orderNo: `@uuid`,
          // 订单状态;1-待付款 2-待发货 3-待收货 4-已完成 5-已取消 6-退款中 7-已退款
          orderState: `@pick(1, 2, 3, 4, 5, 6, 7)`,
          paymentAmount: `@integer(10, 999)`, // 支付金额
          paymentMode: `@pick('微信支付', '支付宝支付')`,
          paymentState: `@pick(1, 2, 3)`, // 支付状态;1-未支付 2-已支付 3-已退款
          paymentTime: `@datetime`, // 支付时间
          recordTime: `@datetime`, // 收货时间
          remainingTime: 1000 * 60 * 20, // 剩余时间
          sendTime: `@datetime`, // 发货时间
          supState: `@pick(1, 2, 3)`, // 1待发货，2已发货，3已送达
          'goodsId|+1': 1, // 商品id
          isCart: `@interger(0, 1)`, // 是否购物车下单
        },
      ],
      // 订单关联订单编号id
      'orderOrderNo|0': [
        {
          id: `@uuid`,
          orderNo: `@uuid`,
          orderId: `@uuid`,
        },
      ],
      'banner|10-20': [
        {
          'id|+1': 1,
          type: `@pick(1,2,3)`,
          advertisementType: `@pick('0','1','2')`, // 广告类型 0-商品 1-分类 2-供货商
          businessId: `@pick('1','2','3')`, // 广告类型 跳转 id
          imageUrl() {
            const text = pinyin(this.advertisementType, {
              style: 'NORMAL',
            })
              .flat()
              .join(` `)
            return mockjs.Random.image(undefined, undefined, text)
          },
        },
      ],
      'notice|8-20': [
        {
          'id|+1': 1,
          category: `@pick(1,2,3)`,
          categoryName: `@ctitle`,
          title: `@ctitle(10, 20)`,
          content: `<center>
            <h1> @ctitle </h1> <img src="@image " /> <p> @cparagraph </p> <img src="@image " /> <p> @cparagraph </p> <img src="@image " /> <p> @cparagraph </p> <img src="@image " /> <p> @cparagraph </p> <img src="@image " /> <p> @cparagraph </p> <img src="@image " /> <p> @cparagraph </p>
          </center>`,
        },
      ],
      'category|10-99': [
        {
          'id|+1': 1, // 主键
          logo: `@image`, // 分类图标
          parentId() {
            return this.id > 9 ? String(this.id).slice(0, -1) : `0`
          }, // 分类父id
          selectImage: `@image`, // 选中状态时的图标
          'sort|+1': 1, // 排序
          state: `@pick(1,1,1,1,1,0)`, // 状态;1：有效；0：无效；
          title: `@cword(2, 5)`, // 分类名称
        },
      ],
      'user|5-10': [
        {
          'id|+1': 1,
          role_name() {
            // 角色
            return [undefined, `store`, `busi`, `driver`, `user`][this.id] || `user`
          },
          account() {
            // 手机号码
            return 18212341230 + this.id
          },
          tabbar() {
            // tabbar
            return tableTabbar[this.role_name]
          },
          indexPage() {
            // 首页
            return tableIndex[this.role_name]
          },
          nick_name: `@cname`, // 昵称
          avatar: `@image`, // 头像
          address: `@county(true) @cword(5, 8)`, // 地址
          businessLicense: `@image`, // 营业执照,
          orderNum: `@integer(1, 100)`,
          userName: `@cname`,
          phone: `@phone`,
          registerState: `@pick(10, 20, 30)`, // 注册申请状态（10：申请中，20通过, 30拒绝）
        },
      ],
      'address|4': [
        {
          'id|+1': 1,
          defaultState: '1',
          city: '@county(true)',
          detail: '@cword(5, 7)区',
          realName: `@cname`,
          phone: `@phone`,
          addressAllName: '',
        },
      ],
      'changeAddress|1': [{}],
      'coupon|10-20': [
        {
          code: `@uuid`, // 优惠券唯一编码
          couponStatus: `@pick(1,2,3)`, // 优惠券状态
          couponType: `@pick(1,2)`, // 优惠类型（1固定金额,2百分比折扣）
          detai: `@cword(9, 12)`, // 使用说明
          effectiveDays: `@integer(1, 30)`, // 有效天数
          endDate: `@datetime`, // 优惠券结束日期
          expirationType: `@pick(1,2)`, // 到期类型（1领取后生效，2固定时间）
          'id|+1': 1, // 主键
          isEnable: `@pick(1,0)`, // 1启用,0停用
          issueImg: `@image`, // 图片地址
          issueNum: `@integer(1, 100)`, // 发行数量
          maxDiscount: `@integer(1, 100)`, // 最大减免金额（仅对部分优惠券适用）
          minSpend: `@integer(1, 100)`, // 使用门槛值
          name: `@ctitle`, // 优惠卷名称
          receive: `@integer(1, 5)`, // 已领取数量
          startDate: `@datetime`, // 优惠券开始生效日期
          val: `@integer(1, 100)`, // 优惠值
          expirationDate: `@endDate`, // 有效期
          getStatus: 0, // 领取状态: （0未领取，1已领取）
          useStatus: `@pick(0,1,-1)`, // 使用状态: （0未使用，1已使用，-1已过期）
        },
      ],
    }),
    static: [
      {
        path: `/static`,
        fileDir: `../src/static-http`,
        list: true,
      },
      {
        path: `/public`,
        fileDir: publicDir,
        list: true,
      },
    ],
    resHandleReplay: ({ req, res }) => wrapApiData({ code: 200, data: {} }),
  }
}
