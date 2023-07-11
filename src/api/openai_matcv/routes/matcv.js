const openai = require("../controller/matcv");
module.exports = {
  routes: [
    {
      method: "POST",
      path: "/openai/matcv",
      handler: openai.generateResponse,
      config: {
        policies: [],
        auth: false,
      },
    },
  ],
};
