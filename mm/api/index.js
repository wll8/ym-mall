const { wrapApiData, likeFilter, paginate, stringToNumber, isNumber } = require(`../util.js`)
const modules = require('./modules/index')
const path = require(`path`)
/** @type {import('mockm/@types/config').Config} */
module.exports = (util) => {
  const {
    libObj: { mockjs },
  } = util
  return {
    api: {
      // 注入模块
      ...modules(util),
      // 个人中心 --------------------------------------------- start
      '/v1/goods/supplierCount': (req, res) => {
        res.json(
          globalThis.config.apiWebWrap(
            mockjs.mock({
              data: `@integer(0, 100)`,
            }),
          ),
        )
      },
      // 版本更新
      async '/v1/apk/download'(req, res, next) {
        res.download(process.execPath, `假的安装包.apk`)
      },
      async '/v1/versionUpgrade'(req, res, next) {
        res.json(
          globalThis.config.apiWebWrap(
            mockjs.mock({
              data: {
                apkSize: `@integer(50, 100)mb`, //	APP大小
                apkUrl: `/v1/apk/download`, //	apk路径
                content: `1.新增在线升级功能<br>2.修复若干bug<br> @ctitle`, //	更新内容
                type: `@pick(0, 1, 2)`, //	是否升级 1升级，0不升级，2强制升级
                versionCode: `100`, //	版本编号
                versionName: `1.5.4`, //	版本名称
              },
            }),
          ),
        )
      },
      // 用户信息
      async '/v1/userInfo/get'(req, res, next) {
        const db = await globalThis.config._db
        const data = db.getState()
        const user = data.user.find((item) => Number(item.id) === Number(req.userId))
        res.json(
          globalThis.config.apiWebWrap({
            data: {
              ...user,
              name: user.nick_name,
              phone: user.account,
            },
          }),
        )
      },
      // 我的商家-列表
      async 'get /invite/invite/myInviteUserList'(req, res, next) {
        if (!req.query.userName) {
          delete req.query.userName
        }
        req.url = '/user'
        next()
      },
      // 我的商家修改审批状态
      async 'post /blade-user/updateRegisterState'(req, res, next) {
        const db = await globalThis.config._db
        const data = db.getState()
        const user = data.user.find((item) => Number(item.id) === Number(req.userId))
        user.registerState = stringToNumber(req.body.registerState)
        db.write()
        res.json(wrapApiData())
      },
      // 获取客服电话
      async '/v1/after-sales/user/serviceTel'(req, res, next) {
        const db = await globalThis.config._db
        const data = db.getState()
        const user = data.user.find((item) => Number(item.id) === Number(req.userId))
        res.json(
          globalThis.config.apiWebWrap({
            data: [
              {
                name: user.nick_name,
                dictKey: user.account,
              },
            ],
          }),
        )
      },
      // 地址列表
      async '/v1/address/list'(req, res, next) {
        const db = await globalThis.config._db
        const data = db.getState()
        const address = data.address
        address.forEach((item) => {
          item.addressAllName = item.city
        })
        res.json(
          globalThis.config.apiWebWrap({
            data: {
              records: [...address],
            },
          }),
        )
      },
      // 新增收货地址
      async '/v1/userAddress-save'(req, res, next) {
        const userInfo = req.body
        const db = await globalThis.config._db
        const data = db.getState()
        const address = data.address
        address.push({
          id: mockjs.mock(`@uuid`),
          defaultState: userInfo.defaultState,
          city: userInfo.addressAllName,
          detail: userInfo.detail,
          realName: userInfo.realName,
          phone: userInfo.phone,
        })
        db.write() // 调用 write 存储变更
        res.json(
          globalThis.config.apiWebWrap({
            data: '添加成功',
          }),
        )
      },
      // 删除收货地址
      async '/v1/address/removeById'(req, res, next) {
        const item = req.body
        const db = await globalThis.config._db
        const data = db.getState()
        const address = data.address
        address.splice(
          address.findIndex((v) => v.id === item),
          1,
        )
        db.write() // 调用 write 存储变更
        res.json(
          globalThis.config.apiWebWrap({
            data: '删除成功',
          }),
        )
      },
      // 修改收货地址回显
      async '/v1/userAddress-detailById'(req, res, next) {
        res.json(
          globalThis.config.apiWebWrap({
            data: '添加成功',
          }),
        )
      },
      // 设置默认地址
      async '/v1/address/defaultSet'(req, res, next) {
        const db = await globalThis.config._db
        const data = db.getState()
        const address = data.address.find((item) => item.id === req.id)
        res.json(
          globalThis.config.apiWebWrap({
            data: {
              msg: '设置成功',
            },
          }),
        )
      },
      // 获取默认地址
      async '/v1/userAddress-detailByUserId'(req, res) {
        const db = await globalThis.config._db
        const data = db.getState()
        const address = data.address
        const addressInfo = address.find((item) => Number(item.defaultState) === 2)
        if (address) {
          res.json(
            globalThis.config.apiWebWrap({
              data: addressInfo,
            }),
          )
        } else {
          res.json(
            globalThis.config.apiWebWrap({
              data: null,
            }),
          )
        }
      },
      // 获取详情
      async '/v1/article/detail'(req, res) {
        const data = globalThis.config.apiWebWrap({
          data: {
            content: mockjs.mock(
              `<center>\n<h1> @ctitle </h1> <img src="@image " /> <p> @cparagraph </p> <img src="@image " /> <p> @cparagraph </p> <img src="@image " /> <p> @cparagraph </p> <img src="@image " /> <p> @cparagraph </p> <img src="@image " /> <p> @cparagraph </p> <img src="@image " /> <p> @cparagraph </p> \n</center>`,
            ),
            title: '服务条款',
          },
        })
        res.json(data)
      },
      // 退出登录
      async '/blade-auth/oauth/logout'(req, res) {
        const data = globalThis.config.apiWebWrap({
          data: '退出成功',
        })
        res.json(data)
      },
      // 注销账号
      async '/v1/logOut'(req, res) {
        const userInfo = req.body
        const db = await globalThis.config._db
        const data = db.getState()
        const user = data.user || []
        db.write() // 调用 write 存储变更
        res.status(200).json(
          globalThis.config.apiWebWrap({
            data: '注销账号成功',
          }),
        )
      },
      // 个人中心 --------------------------------------------- end
      // 优惠券 --------------------------------------------- start
      // 首页查询优惠卷
      async 'get /coupon/coupon/getIndexlist'(req, res, next) {
        req.query.getStatus = '0'
        req.query.useStatus = '0'
        req.url = `/coupon` // 未领取的优惠券
        next()
      },
      // 领取优惠卷
      async 'post /coupon/couponreceive/receive'(req, res, next) {
        const { key } = req.body
        const db = await globalThis.config._db
        const data = db.getState()
        const coupon = data.coupon || []
        // 得到商品信息
        const index = coupon.findIndex((item) => {
          return item.id === (isNumber(key) ? key : stringToNumber(key))
        })
        if (index > -1) {
          // 模拟领取优惠券
          const couponItem = coupon[index]
          couponItem.getStatus = 1
          db.write() // 调用 write 存储变更
          res.json(globalThis.config.apiWebWrap({}))
        } else {
          res.json(globalThis.config.apiWebWrap({ code: '1011' }))
        }
      },
      // 查询已领取优惠券列表
      async 'get /coupon/couponreceive/list'(req, res, next) {
        req.query.getStatus = '1'
        req.url = `/coupon`
        next()
      },
      // 优惠券 --------------------------------------------- end
      // 通知 --------------------------------------------- start
      async '/blade-desk/notice/list'(req, res, next) {
        const db = await globalThis.config._db
        const data = db.getState()
        const records = (data.notice || []).slice(0, 10)
        res.json(
          globalThis.config.apiWebWrap({
            data: {
              records,
            },
          }),
        )
      },
      async '/blade-desk/notice/detail'(req, res, next) {
        req.url = `/notice/${req.query.id}`
        next()
      },
      // 通知 --------------------------------------------- end
      // 购物车 --------------------------------------------- start
      // 获取购购物车列表
      'post /v1/cart/list': util.side({
        alias: [`post /v1/cart/listByUserId`],
        action(req, res, next) {
          res.redirect(301, '/car')
        },
      }),
      // 修改购物车数量
      async 'post /v1/cart/updateNum'(req, res, next) {
        const { shoppingCartId, goodsNum } = req.query
        const db = await globalThis.config._db
        const data = db.getState()
        data.car.some((item, index) => {
          if (item.id === shoppingCartId) {
            data.car[index].goodsNum = goodsNum
            return true
          } else {
            return false
          }
        })
        db.write() // 调用 write 存储变更
        res.json(globalThis.config.apiWebWrap({}))
      },
      // 删除购物车商品
      async '/v1/cart/remove'(req, res) {
        const ids = req.body.shoppingCartIds || []
        const db = await globalThis.config._db
        const data = db.getState()
        data.car = data.car.filter((item) => {
          return !ids.includes(item.id)
        })
        db.write() // 调用 write 存储变更
        res.json(globalThis.config.apiWebWrap({}))
      },
      // 加入购物车
      async 'post /v1/cart/add'(req, res, next) {
        const { goodsInfoId, num } = req.body
        if (goodsInfoId) {
          const db = await globalThis.config._db
          const data = db.getState()
          const goods = data.goods || []
          // 得到商品信息
          const index = goods.findIndex((item) => {
            return item.id === stringToNumber(goodsInfoId)
          })

          if (index > -1) {
            const goodsInfo = goods[index]
            const car = data.car || []
            const carId = mockjs.mock('@uuid')
            car.push({
              id: carId,
              cover: goodsInfo.goodsCover,
              goodsId: goodsInfoId,
              goodsImg: goodsInfo.goodsCover,
              goodsName: goodsInfo.goodsName, // 商品名称
              goodsNum: num,
              goodsSpecName: goodsInfo.goodsSpec,
              goodsSpec: goodsInfo.goodsSpec,
              salePrice: goodsInfo.salePrice,
              shoppingCartId: carId,
              zoneType: goodsInfo.zoneType,
            })
            db.write() // 调用 write 存储变更
            res.json(globalThis.config.apiWebWrap({}))
          } else {
            res.json(globalThis.config.apiWebWrap({ code: 601 }))
          }
        }
      },
      // 购物车 --------------------------------------------- end

      // 商城模块 --------------------------------------------- start
      // 查询分类列表
      '/v1/category/list': (req, res, next) => {
        req.url = `/category`
        next()
      },
      // 分类列表树
      async 'get /v1/category/listTree'(_, res) {
        const db = await global.config._db
        const data = db.getState()
        const list = data.category || []
        // 递归获取分类列表
        function listToTree(list) {
          const map = {}
          let node
          const roots = []
          let i
          for (i = 0; i < list.length; i += 1) {
            map[list[i].id] = i // initialize the map
            list[i].children = [] // initialize the children
          }
          for (i = 0; i < list.length; i += 1) {
            node = list[i]
            if (node.parentId !== '0') {
              // if you have dangling branches check that map[node.parentId] exists
              list[map[node.parentId]].children.push(node)
            } else {
              roots.push(node)
            }
          }
          return roots
        }
        res.json(wrapApiData(globalThis.config.apiWebWrap({ data: listToTree(list) })))
      },
      // 首页商品活动目录列表
      async '/v1/goods/list'(req, res, next) {
        res.json(
          globalThis.config.apiWebWrap(
            mockjs.mock({
              'data|2-5': [
                {
                  'id|+1': 1,
                  'dictKey|+1': `@int(10, 99)`,
                  dictValue: `@ctitle`,
                },
              ],
            }),
          ),
        )
      },
      // 商品分页接口
      async 'use /v1/goods/page'(req, res, next) {
        const { page, size, like, value } = {
          page: req.query._page,
          size: req.query._limit,
          like: req.query._like_key || `goodsName`,
          value: req.query._like_value || req.query.goodsName,
        }
        if (value) {
          const db = await global.config._db
          const data = db.getState()
          const list = likeFilter({
            data: data.goods,
            like,
            value,
          })
          const limit = paginate(list, Number(page), Number(size))
          res.json(
            wrapApiData({
              data: {
                total: list.length,
                records: limit,
              },
            }),
          )
        }
        next()
      },
      '/v1/goods/page': function (req, res, next) {
        req.url = `/goods`
        next()
      },
      // 商品详情
      async '/mall/goodsinfo/detail'(req, res, next) {
        const { id } = req.query
        req.url = `/goods/${id}`
        next()
      },
      // 商城模块 --------------------------------------------- end

      // 登录注册 --------------------------------------------- start
      // 手机验证码登录
      async '/v1/user/phoneLogin'(req, res, next) {
        const db = await globalThis.config._db
        const data = db.getState()
        const user = data.user.find((item) => Number(item.account) === Number(req.body.phone))
        if (user) {
          res.json(
            globalThis.config.apiWebWrap({
              data: {
                ...user,
                access_token: user.id,
              },
            }),
          )
        } else {
          res.status(401).json(
            globalThis.config.apiWebWrap({
              code: 401,
              data: `登录失败`,
            }),
          )
        }
      },
      // 获取Authorization
      async '/v1/getAuthorization'(req, res, next) {
        res.json(
          globalThis.config.apiWebWrap({
            data: {
              Authorization: 'Basic c2FiZXI6c2FiZXJfc2VjcmV0',
              Tenant_Id: '000000',
            },
          }),
        )
      },
      // 用户注册
      async 'post /v1/register'(req, res, next) {
        const userInfo = req.body
        const db = await globalThis.config._db
        const data = db.getState()
        const user = data.user || []
        user.push({
          id: mockjs.mock(`@uuid`),
          account: userInfo.phone,
          nick_name: mockjs.mock(`@cword(3)`),
          role_name: `user`,
          indexPage: '/pages/index/index',
          avatar: 'https://dummyimage.com/300x200.jpg',
        })
        db.write() // 调用 write 存储变更
        res.status(200).json(
          globalThis.config.apiWebWrap({
            data: null,
            msg: '注册成功',
          }),
        )
      },
      // 登录注册 --------------------------------------------- end

      // 公共接口 --------------------------------------------- start
      // 查询轮播数据
      '/v1/ads-list': function (req, res, next) {
        req.url = `/banner`
        next()
        // res.redirect(301, '/banner')
      },
      // 短信发送
      '/v1/common/send-validate': function (req, res, next) {
        res.json(
          globalThis.config.apiWebWrap({
            data: {
              success: true,
              phone: null,
              id: mockjs.mock(`@uuid`),
            },
          }),
        )
      },
      // 公共接口 --------------------------------------------- end
    },
  }
}
