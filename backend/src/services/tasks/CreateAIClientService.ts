import OpenAI from 'openai';

class CreateAIClientService {
  public handle(): OpenAI {
    console.log(process.env.OPENAI_API_KEY);
    return new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    });
  }
}

export default CreateAIClientService;
