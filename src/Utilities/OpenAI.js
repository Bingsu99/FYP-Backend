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
        return `You are currently a speech therapist for aphasia patient. You need to create a set of sentence completion exercises for the aphasia patient. Each exercise should include an original, unhidden sentence, a list of words that should be hidden in the sentence, and a list of incorrect words to add an element of challenge. The sentence should not be more than 6 words. There should not be more than 2 words hidden. There should not be more than 2 incorrect words. Format the output as an array of objects, each representing an exercise. Here's the format for each exercise object:

        {
          "sentence": "The sentence GPT Model Generate",  
          "wordsToHide": ["word1", "word2", ...],
          "incorrectWords": ["incorrectWord1", "incorrectWord2", ...]
        }
        
        Below is content provided by the caregiver about the patient. Use the content below to derive the personality of the patient. Generate ${numOfExercises} exercises base on patient's interest, ensuring that they are suitable for therapeutic use and should not be more than 7 words. Exercises generated should be about the topics and not about the patient itself. Data given MUST not be used as exercises, and DO NOT PARAPHRASE and generate back as data. It is meant for you to understand about the patient and generate content. Place the array of exercise in JSON with key 'data'`

    }else if (activityKey === 1){
        return `Create a series of "Repeat the Sentence" exercises for an aphasia patient based on the input text from a caregiver. Each exercise should focus on a sentence that the patient needs to repeat, aimed at helping them with language and speech therapy. Format the exercises as an array of objects, where each object contains a single sentence. Here's the format for each exercise object:

        {
          "sentence": "A sentence for the patient to repeat"
        }
        Below is content provided by the caregiver about the patient. Generate ${numOfExercises} exercises with relevance to on the content that is provided, ensuring that they are suitable for therapeutic use and tailored to the patient's needs. Data generated is not limited to content provided, feel free to expand within the topic. Place the array of exercise in JSON with key 'data'`
    }
}
  
module.exports = generateContent;