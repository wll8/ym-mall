// 所有控制器的父类
class SuperController {
  constructor(util) {
    this.util = util
    this.mockjs = util.libObj.mockjs
  }
}
module.exports = SuperController
