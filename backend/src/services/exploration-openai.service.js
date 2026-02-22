function buildPrompt(profile) {
    return {
        system: `
You are an advanced career-matching engine.

Your job is to generate highly specific, differentiated, and realistic career paths based strictly on the user’s exploration profile and stated interests.

Return ONLY valid JSON. No markdown. No extra text. No commentary outside JSON.

The tone must be second-person and humanized. 
Use language like:
- "You may be a great fit for..."
- "This could suit you because..."
- "Given your profile..."

Output schema:
{
  "summary": string,
  "careers": [
    {
      "title": string,
      "fitScore": number,
      "why": string[]
    }
  ]
}

STRICT RULES:
- Return exactly 6 careers.
- fitScore must be an integer from 0 to 100.
- Sort careers in descending order by fitScore.
- Careers must be meaningfully different from each other (no slight title variations).
- Avoid generic broad titles unless strongly justified.
- Incorporate both profile parameters AND interests into reasoning.
- Careers must logically align with:
  - problem solving style
  - public speaking preference
  - math preference
  - work environment preference
  - preferred work focus (Data, People, Systems, PhysicalTools, Ideas)
- If public speaking preference is "Avoid", deprioritize highly presentation-heavy roles.
- If math preference is Medium or Low, avoid highly theoretical math-heavy careers.
- The “why” array must:
    - Be written in second person
    - Clearly connect specific profile fields to the career
    - Include at least one sentence connecting an interest to the role
    - Be practical and realistic

SUMMARY REQUIREMENTS:
- 2-4 sentences
- Written in second person
- Human, encouraging tone
- Explain overall pattern of the recommendations
- Do not repeat the exact same reasoning as the career entries

Do NOT:
- Invent education credentials not provided
- Recommend unrealistic or extreme careers
- Repeat reasoning verbatim across careers
- Include markdown formatting

Base recommendations strictly on the provided exploration data
`.trim(),
        user: JSON.stringify({ exploration: profile })
    };
}

async function callAzureOpenAI(profile) {
    const endpoint = process.env.AZURE_OPENAI_ENDPOINT;
    const apiKey = process.env.AZURE_OPENAI_API_KEY;
    const deployment = process.env.AZURE_OPENAI_DEPLOYMENT;
    const apiVersion = process.env.AZURE_OPENAI_API_VERSION;

    if (!endpoint || !apiKey || !deployment || !apiVersion) {
        throw new Error("Missing Azure OpenAI env vars (endpoint/key/deployment/api-version).");
    }

    const url = `${endpoint}/openai/deployments/${deployment}/chat/completions?api-version=${apiVersion}`;

    const { system, user } = buildPrompt(profile);

    const body = {
        messages: [
            { role: "system", content: system },
            { role: "user", content: user }
        ]
        // If your Azure deployment supports it, uncomment:
        , response_format: { type: "json_object" }
    };

    const resp = await fetch(url, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "api-key": apiKey
        },
        body: JSON.stringify(body)
    });

    if (!resp.ok) {
        const errText = await resp.text();
        throw new Error(`Azure OpenAI error ${resp.status}: ${errText}`);
    }

    const data = await resp.json();
    const content = data?.choices?.[0]?.message?.content;

    if (!content) throw new Error("Azure OpenAI returned no message content.");

    // Parse JSON safely
    try {
        return JSON.parse(content);
    } catch (e) {
        // If the model returns extra text, try to extract the JSON block:
        const start = content.indexOf("{");
        const end = content.lastIndexOf("}");
        if (start !== -1 && end !== -1 && end > start) {
            const sliced = content.slice(start, end + 1);
            return JSON.parse(sliced);
        }
        throw new Error("Model response was not valid JSON.");
    }
}

module.exports = { callAzureOpenAI };