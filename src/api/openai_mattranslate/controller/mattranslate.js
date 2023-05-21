const { Configuration, OpenAIApi } = require("openai");
//const {encode, decode} = require('gpt-3-encoder')

const configuration = new Configuration({
  apiKey: process.env.OPEN_AI_TOKEN,
});
const openai = new OpenAIApi(configuration);

module.exports = {
  async generateResponse(ctx) {
    console.log("entre aqui");
    const { prompt, language1, language2, users_permissions_user } =
      ctx.request.body;

    try {
      const response = await openai.createCompletion({
        model: "text-davinci-003",
        prompt: `This is a translation application. It translates anything into two languages.
        --
        input: "Translate this: 'Upgrade your shopping experience with ShopEase. Find what you need, fast.' into 1. Spanish, 2. French."
        Correct output: 
        1. "Mejora tu experiencia de compra con ShopEase. Encuentra lo que necesitas, rápido."
        2. "Améliorez votre expérience de magasinage avec ShopEase. Trouvez ce dont vous avez besoin, rapidement."
        --
        input: "Translate this: 'Bring your farm to the next level with our innovative AgroSustain. More yield, less hassle!' into 1. German, 2. Italian."
        Correct output: 
        1. "Bringen Sie Ihren Bauernhof mit unserem innovativen AgroSustain auf die nächste Stufe. Mehr Ertrag, weniger Aufwand!"
        2. "Porta la tua fattoria al livello successivo con il nostro innovativo AgroSustain. Più rendimento, meno complicazioni!"
        --
        input: "Translate this: 'Say goodbye to long wait times and high costs. Our CareLink offers affordable, accessible healthcare for everyone.' into 1. Portuguese, 2. Dutch."
        Correct output: 
        1. "Diga adeus aos longos tempos de espera e aos custos elevados. Nosso CareLink oferece assistência médica acessível e acessível para todos."
        2. "Zeg vaarwel tegen lange wachttijden en hoge kosten. Onze CareLink biedt betaalbare, toegankelijke gezondheidszorg voor iedereen."
        --
        input: "Translate this: 'Discover the joy of stress-free shopping with QuickCart. It's the smart way to shop.' into 1. Korean, 2. Japanese."
        Correct output: 
        1. "QuickCart로 스트레스 없는 쇼핑의 즐거움을 발견하세요. 현명한 쇼핑 방법입니다."
        2. "クイックカートでストレスフリーのショッピングの喜びを見つけてください。賢い買い物の方法です。"
        --
        input: "Translate this: '${prompt}' into 1. ${language1}, 2. ${language2}."
        Correct output:`,
        temperature: 0.8,
        max_tokens: 500,
      });
      console.log(response.data.choices);
      const data = {
        data: {
          payload_in: { prompt: prompt },
          payload_out: { resp: response.data.choices[0].text.trim() },
          users_permissions_user: users_permissions_user,
          Source: "MatTranslation",
        },
      };
      const request = await strapi.db
        .query("api::request.request")
        .create(data);

      ctx.send({ data: response.data.choices[0].text.trim() });
    } catch (err) {
      ctx.badRequest("Could not generate response" + err);
    }
  },
};