module.exports = {
  key: `get-user`,
  main({ config }) {
    return {
      useCreated(app) {
        app.use((req, res, next) => {
          const token = req.header(`Blade-Auth`) || ``
          const list = token.split(` `) || []
          req.userId = list[1]
          next()
        })
      },
    }
  },
}
