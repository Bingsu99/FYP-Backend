const OpenAI = require('openai');

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY // This is also the default, can be omitted
});

async function generateContent(activityKey, numOfExercises, content) {
    const completion = await openai.chat.completions.create({
      messages: [
        {
          role: "system",
          content: generatePrompts(activityKey, numOfExercises),
        },
        { role: "user", content: content },
      ],
      model: "gpt-3.5-turbo-0125",
      response_format: { type: "json_object" },
    });
    return completion.choices[0].message.content;
}

function generatePrompts(activityKey, numOfExercises){
    if (activityKey === 0){
        return `Given the text input from a caregiver, create a set of sentence completion exercises for an aphasia patient. Each exercise should include an orignal, unmodified sentence, a list of words that should be hidden in the sentence, and a list of incorrect words to add an element of challenge. Format the output as an array of objects, each representing an exercise. Here's the format for each exercise object:

        {
          "sentence": "The original sentence",
          "wordsToHide": ["word1", "word2", ...],
          "incorrectWords": ["incorrectWord1", "incorrectWord2", ...]
        }
        
        Generate ${numOfExercises} exercises based on the content that will be provided, ensuring that they are suitable for therapeutic use and tailored to the patient's needs. Place the array of exercise in JSON with key 'data'`

    }else if (activityKey === 1){
        return `Create a series of "Repeat the Sentence" exercises for an aphasia patient based on the input text from a caregiver. Each exercise should focus on a sentence that the patient needs to repeat, aimed at helping them with language and speech therapy. Format the exercises as an array of objects, where each object contains a single sentence. Here's the format for each exercise object:

        {
          "sentence": "A sentence for the patient to repeat"
        }
        Generate ${numOfExercises} exercises using the sentences or content that will be provided by the caregiver, ensuring that they are suitable for therapeutic use and tailored to the patient's needs. Place the array of exercise in JSON with key 'data'`
    }
}
  
module.exports = generateContent;