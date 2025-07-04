import CreateAIClientService from './CreateAIClientService';
import GeneratedTaskType from '../../types/GeneratedTaskType';

class GetAIGeneratedUserTasksService {
  constructor(private readonly createAIClientService = new CreateAIClientService()) {}

  get prompt(): string {
    return `Generate a JSON array of 5 tasks for a todo app. Each task should have a "name" (string), optional "description" (string). Example:[{"name": "Buy groceries","description": "Milk, Bread, Eggs"},...]. Return only json array as a plain test so I could JSON.parse it`;
  }

  public async handle(): Promise<GeneratedTaskType[]> {
    const client = this.createAIClientService.handle();

    const response = await client.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [
        { role: 'system', content: 'You are a helpful task generator assistant.' },
        { role: 'user', content: this.prompt },
      ],
    });

    const text = response.choices[0].message?.content;
    if (!text) throw new Error('No response from OpenAI');
    console.log(text);
    return JSON.parse(text) as unknown as GeneratedTaskType[];
  }
}

export default GetAIGeneratedUserTasksService;
