const { Configuration, OpenAIApi } = require("openai");

const configuration = new Configuration({
  apiKey: process.env.OPEN_AI_TOKEN,
});
const openai = new OpenAIApi(configuration);

module.exports = {
  async generateResponse(ctx) {
    console.log("entre aqui");
    const {
      name,
      languages,
      country,
      studies
    } = ctx.request.body;

    try {
      // Extraer los datos de la colección "user" de Strapi
      const user = await strapi
        .query("user", "users-permissions")
        .findOne({ id: ctx.state.user.id });

      const { name, lastname, country, domainofstudy, activity_area } = user;

      const response = await openai.createCompletion({
        model: "text-davinci-003",
        prompt: `You are a human resources manager, and I need you to write a curriculum vitae based on the following options. Furthermore, I would like you to infer a list of five skills and a professional objective based on the data I provide. Don't add references information, experience and the note:

        Name: ${name} ${lastname}
        
        Languages: ${languages}
        
        Education: ${domainofstudy} 
        
        Country: ${country}

        Activity Interests: ${activity_area}
        `,
        temperature: 0.8,
        max_tokens: 1500,
      });

      const data = {
        data: {
          payload_in: {
            name: name, 
            country: country,
            languages: languages,
            studies: studies,
          },
          payload_out: {
            resp: response.data.choices[0].text.trim(),
          },
          users_permissions_user: user,
          Source: "MatCV",
        },
      };

      const request = await strapi.db
        .query("api::request.request")
        .create(data);

      ctx.send({ data: JSON.parse(response.data.choices[0].text.trim()) });
    } catch (error) {
      console.error("Error try to generate the quiz questions", error);
      ctx.badRequest({ error: "Error try to generate the quiz questions" });
    }
  },
};
