module.exports = {
  key: `change-page`,
  main({ config }) {
    config.resHandleJsonApi = ({ req, res: { statusCode: code }, data }) => {
      function wrapApiData({ data, code = 200 }) {
        // 包裹 api 的返回值
        code = String(code)
        // eslint-disable-next-line no-unused-expressions, no-self-assign
        data.results && ((data.records = data.results), delete data.results)
        // eslint-disable-next-line no-unused-expressions, no-self-assign
        data.count && ((data.total = data.count), delete data.count)
        return {
          code,
          success: Boolean(code.match(/^[2]/)), // 如果状态码以2开头则为 true
          data,
        }
      }
      return wrapApiData({ data, code })
    }
    return {
      useCreated(app) {
        app.use((req, res, next) => {
          const { size, current } = req.query
          // eslint-disable-next-line no-unused-expressions
          size && ((req.query._limit = size), delete req.query.size)
          // eslint-disable-next-line no-unused-expressions
          current && ((req.query._page = current), delete req.query.current)
          next()
        })
      },
    }
  },
}
