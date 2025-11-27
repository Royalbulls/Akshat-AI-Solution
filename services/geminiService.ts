
import { GoogleGenAI, GenerateContentResponse, Operation, Type, Modality } from "@google/genai";
import { Mood, AgentStep, PersonaSpaceContent, CustomPersona, VoiceName, KundliDetails, ComicPanel, AutomationProject, UserProfile } from "../types";

// Helper function to format errors into user-friendly messages
function getFriendlyErrorMessage(error: unknown, context: string): string {
    const msg = error instanceof Error ? error.message : String(error);
    
    if (msg.includes("SAFETY") || msg.includes("blocked")) {
        return `Safety block in ${context}: The AI found the content sensitive. Please try rephrasing your prompt.`;
    }
    if (msg.includes("429") || msg.includes("quota") || msg.includes("RESOURCE_EXHAUSTED")) {
        return `Quota exceeded in ${context}. You may have hit the rate limit. Please wait a moment and try again.`;
    }
    if (msg.includes("401") || msg.includes("403") || msg.includes("API key") || msg.includes("PERMISSION_DENIED")) {
        return `Access denied in ${context}. Please check your API key permissions or model availability.`;
    }
    if (msg.includes("NetworkError") || msg.includes("fetch failed")) {
        return `Network error during ${context}. Please check your internet connection.`;
    }
    if (msg.includes("JSON")) {
        return `Data format error in ${context}. The AI returned an invalid structure. Please try again or simplify your request.`;
    }
    
    return `Error in ${context}: ${msg.substring(0, 150)}${msg.length > 150 ? '...' : ''}`;
}

// This will be the single function for the 'smart' mode, replacing runChat, runSearchGroundedChat, and runMapsGroundedChat
export async function runSmartChat(
    prompt: string, 
    history: {role: 'user' | 'model', parts: ({text: string} | { inlineData: { mimeType: string, data: string } })[]}[], 
    systemInstruction: string, 
    location: {latitude: number, longitude: number} | null,
    fileData?: { data: string; mimeType: string; }
): Promise<GenerateContentResponse> {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    
    const userParts: ({text: string} | { inlineData: { mimeType: string, data: string } })[] = [];
    if (fileData) {
        userParts.push({ inlineData: { mimeType: fileData.mimeType, data: fileData.data }});
    }
    userParts.push({ text: prompt });

    try {
        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: [...history, { role: 'user', parts: userParts }],
            config: {
                systemInstruction: systemInstruction,
                tools: [{ googleSearch: {} }, { googleMaps: {} }],
                toolConfig: location ? {
                    retrievalConfig: {
                        latLng: {
                            latitude: location.latitude,
                            longitude: location.longitude
                        }
                    }
                } : undefined,
            },
        });
        return response;
    } catch (error) {
        console.error("Smart Chat API call failed:", error);
        throw new Error(getFriendlyErrorMessage(error, "Smart Chat"));
    }
}


export async function runChatWithThinking(prompt: string, history: {role: 'user' | 'model', parts: {text: string}[]}[], systemInstruction: string): Promise<string> {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    try {
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-pro',
            contents: [...history, { role: 'user', parts: [{ text: prompt }] }],
            config: {
                systemInstruction: systemInstruction,
                thinkingConfig: { thinkingBudget: 32768 }
            }
        });
        return response.text || "I thought about it, but couldn't generate a response.";
    } catch (error) {
        console.error("Thinking Chat API call failed:", error);
        throw new Error(getFriendlyErrorMessage(error, "Deep Thinking Mode"));
    }
}

export async function generateImage(prompt: string): Promise<string> {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    
    // Helper to extract image from response
    const extractImage = (response: GenerateContentResponse): string => {
        if (response.candidates && response.candidates[0].content.parts) {
            for (const part of response.candidates[0].content.parts) {
                if (part.inlineData) {
                    return `data:image/png;base64,${part.inlineData.data}`;
                }
            }
        }
        throw new Error("No image data found in response.");
    };

    // Try with High-Quality Pro Model first
    try {
        const response = await ai.models.generateContent({
            model: 'gemini-3-pro-image-preview',
            contents: { parts: [{ text: prompt }] },
            config: {
                imageConfig: {
                    aspectRatio: "1:1",
                    imageSize: "1K"
                }
            },
        });
        return extractImage(response);
    } catch (error: any) {
        console.warn("Pro image generation failed, attempting fallback to Flash...", error);
        
        // Fallback to Flash Image model for ANY error (403, 404, or generic) to ensure UX continuity
        try {
            const response = await ai.models.generateContent({
                model: 'gemini-2.5-flash-image',
                contents: { parts: [{ text: prompt }] },
                config: {
                    responseModalities: [Modality.IMAGE],
                }
            });
            return extractImage(response);
        } catch (fallbackError) {
            console.error("Fallback image generation failed:", fallbackError);
            throw new Error(getFriendlyErrorMessage(fallbackError, "Image Generation (Fallback)"));
        }
    }
}

export async function editImageWithAvatar(userImage: { data: string; mimeType: string }, persona: CustomPersona): Promise<string> {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    
    // Step 1: Generate the avatar image
    const avatarPrompt = persona.avatarDescription 
        ? `${persona.avatarDescription}, full body, high resolution, digital art, transparent background`
        : `A digital art avatar representing an AI that is: "${persona.instruction.substring(0, 150)}...", full body, transparent background`;
    
    let avatarImageBase64: string;
    try {
        avatarImageBase64 = await generateImage(avatarPrompt);
    } catch (error) {
        console.error("Avatar generation step failed:", error);
        throw new Error(`Avatar creation failed: ${getFriendlyErrorMessage(error, "Avatar Generation")}`);
    }
    
    // Step 2: Edit the user's image with the new avatar
    try {
        const userImagePart = { inlineData: { data: userImage.data, mimeType: userImage.mimeType } };
        // The generateImage function returns a full data URL, we need to strip the prefix
        const avatarImagePart = { inlineData: { data: avatarImageBase64.split(',')[1], mimeType: 'image/png' } };
        const textPart = { text: "Please add the character from the second image into the first image. Make it look like the character is naturally part of the scene. Match the lighting, shadows, and overall style of the first image." };

        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash-image',
            contents: { parts: [userImagePart, avatarImagePart, textPart] },
            config: {
                responseModalities: [Modality.IMAGE],
            },
        });
        
        for (const part of response.candidates[0].content.parts) {
            if (part.inlineData) {
                return `data:${part.inlineData.mimeType};base64,${part.inlineData.data}`;
            }
        }
        throw new Error("Image editing finished, but no image was returned.");

    } catch (error) {
        console.error("Image editing step failed:", error);
        throw new Error(getFriendlyErrorMessage(error, "Image Editing"));
    }
}


export async function startVideoGeneration(prompt: string, aspectRatio: '16:9' | '9:16', image?: { imageBytes: string; mimeType: string; }): Promise<Operation> {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    try {
        return await ai.models.generateVideos({
            model: 'veo-3.1-fast-generate-preview',
            prompt: prompt,
            image: image,
            config: {
                numberOfVideos: 1,
                resolution: '720p',
                aspectRatio: aspectRatio
            }
        });
    } catch (e: any) {
        console.error("Video generation start error:", e);
        const errorDetails = e?.error || {};
        if (errorDetails.status === "NOT_FOUND") {
            throw new Error("Video Model Not Found. Please ensure you have access to Veo models or a paid API key.");
        }
        if (errorDetails.status === "RESOURCE_EXHAUSTED") {
            throw new Error("Video generation quota exceeded. Please check your plan.");
        }
        if (errorDetails.code === 403 || errorDetails.status === "PERMISSION_DENIED") {
             throw new Error("Permission Denied. Video generation requires a specific API tier or allowed location.");
        }
        throw new Error(getFriendlyErrorMessage(e, "Video Generation Start"));
    }
}

export async function getVideoOperation(operation: Operation): Promise<Operation> {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    try {
        return await ai.operations.getVideosOperation({ operation: operation });
    } catch (error) {
        throw new Error(getFriendlyErrorMessage(error, "Video Status Check"));
    }
}

export async function detectMood(text: string): Promise<Mood> {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    try {
        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: `Analyze the sentiment of the following text and determine the user's primary mood. Text: "${text}"`,
            config: {
                responseMimeType: "application/json",
                responseSchema: {
                    type: Type.OBJECT,
                    properties: {
                        mood: {
                            type: Type.STRING,
                            enum: ['happy', 'sad', 'anxious', 'neutral', 'angry', 'excited', 'reflective'],
                            description: "The user's primary mood."
                        },
                    },
                    required: ['mood'],
                },
            },
        });

        const json = JSON.parse(response.text);
        return json.mood || 'neutral';
    } catch (error) {
        console.warn("Mood detection failed:", error); // Log warning but don't throw to avoid disrupting chat
        return 'neutral'; // Fallback mood
    }
}

export async function getJournalFeedback(entryText: string, mood: Mood): Promise<string> {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    try {
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: `A user is feeling ${mood}. Here is their journal entry: "${entryText}".
            Act as a compassionate, reflective journal assistant (Akshat). Provide a short (2-3 sentences), gentle, and encouraging reflection based on their entry.
            If they seem distressed (sad, anxious, angry), you can offer a simple Cognitive Behavioral Therapy (CBT) inspired prompt, like asking them to identify one specific thought they can re-examine or a small positive action they could take.
            Do not give medical advice. Your tone should be supportive and calm.`,
             config: {
                systemInstruction: "You are a supportive AI journal companion named Akshat."
            }
        });
        return response.text || "Thank you for sharing your thoughts.";
    } catch (error) {
        console.error("Journal feedback generation failed:", error);
        throw new Error(getFriendlyErrorMessage(error, "Journal Feedback"));
    }
}

export async function getCbtPrompt(): Promise<string> {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    try {
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: `Generate a single, simple, and actionable Cognitive Behavioral Therapy (CBT) or mindfulness prompt for a user who is journaling. The prompt should encourage self-reflection. Examples: "What's one thought that's bothering you right now, and what is a more balanced way to look at it?", "Describe a small, positive thing that happened today, and how it made you feel.", "Take three deep breaths. What do you notice in your body right now?". Keep it concise.`,
        });
        return response.text || "Take a moment to reflect on your day.";
    } catch (error) {
        console.error("CBT prompt generation failed:", error);
        return "What is one thing you are grateful for right now?"; // Fallback
    }
}

export async function getAddressForCoordinates(lat: number, lng: number): Promise<string> {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    try {
        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: `What is the most specific address or place name for the coordinates Latitude ${lat}, Longitude ${lng}?`,
            config: {
                tools: [{ googleMaps: {} }],
                toolConfig: {
                    retrievalConfig: {
                        latLng: {
                            latitude: lat,
                            longitude: lng
                        }
                    }
                }
            }
        });
        return response.text.trim();
    } catch (error) {
        console.error("Reverse geocoding with Maps Grounding failed:", error);
        throw new Error("Location service unavailable.");
    }
}

export async function createAgentTaskPlan(goal: string): Promise<AgentStep[]> {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    try {
        const response = await ai.models.generateContent({
            model: "gemini-2.5-pro",
            contents: `Act as an autonomous AI agent. The user's goal is: "${goal}".
            Break this goal down into a sequence of 5 distinct steps based on the following framework:
            1. Reasoning (Plan the approach, define objectives)
            2. Perception (Gather necessary information, identify key data points)
            3. Learning (Analyze the gathered information, identify patterns)
            4. Action (Synthesize the information into a concrete output like a summary, report, or draft)
            5. Self-Correction (Review the output for accuracy, clarity, and completeness)

            For each step, provide a brief, one-sentence description of what you will do.
            The final output must be a valid JSON array.`,
            config: {
                responseMimeType: "application/json",
                responseSchema: {
                    type: Type.OBJECT,
                    properties: {
                        plan: {
                            type: Type.ARRAY,
                            items: {
                                type: Type.OBJECT,
                                properties: {
                                    name: {
                                        type: Type.STRING,
                                        enum: ['Reasoning', 'Perception', 'Learning', 'Action', 'Self-Correction'],
                                    },
                                    description: {
                                        type: Type.STRING,
                                    }
                                },
                                required: ['name', 'description'],
                            }
                        }
                    },
                    required: ['plan'],
                },
                 thinkingConfig: { thinkingBudget: 16384 }
            },
        });

        const json = JSON.parse(response.text);
        // Add initial status to each step
        return json.plan.map((step: Omit<AgentStep, 'status'>) => ({
            ...step,
            status: 'pending'
        }));
    } catch (error) {
        console.error("Agent task planning failed:", error);
        throw new Error(getFriendlyErrorMessage(error, "Agent Task Planning"));
    }
}

export async function generateAgentTaskDraft(goal: string, plan: AgentStep[]): Promise<string> {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    try {
        const planString = plan.map(p => `- ${p.name}: ${p.description}`).join('\n');
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-pro',
            contents: `Act as a subject-matter expert AI agent. Your goal is: "${goal}".
            You have this plan:
            ${planString}

            Execute the 'Action' step by producing a comprehensive, in-depth initial draft. Structure your response logically with clear headings using Markdown. Ensure the analysis is thorough and directly addresses the user's original goal with supporting details.`,
            config: {
                 thinkingConfig: { thinkingBudget: 32768 }
            }
        });
        return response.text || "Draft generation failed.";
    } catch (error) {
        console.error("Agent task draft generation failed:", error);
        throw new Error(getFriendlyErrorMessage(error, "Agent Draft Generation"));
    }
}

export async function selfCorrectAgentResult(goal: string, draft: string): Promise<string> {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    try {
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-pro',
            contents: `Act as a senior editor AI agent. Your original goal was: "${goal}".
            You produced this draft:
            --- DRAFT START ---
            ${draft}
            --- DRAFT END ---

            Now, perform the 'Self-Correction' step. Your task is to elevate this draft to a publication-ready standard. Critically review it for:
            1. **Accuracy:** Verify facts and data points.
            2. **Clarity:** Improve sentence structure and remove jargon.
            3. **Depth:** Add nuance and deeper insights where possible.
            4. **Completeness:** Ensure all aspects of the original goal are fully met.
            5. **Flow:** Check for logical consistency and smooth transitions.

            Provide ONLY the final, polished, and significantly improved version. Use Markdown for professional formatting.`,
            config: {
                 thinkingConfig: { thinkingBudget: 32768 }
            }
        });
        return response.text || draft;
    } catch (error) {
        console.error("Agent task self-correction failed:", error);
        // Return original draft if correction fails
        return `Self-correction failed. Returned initial draft.\n\n${draft}`;
    }
}


export async function generatePersonaSpaceContent(persona: CustomPersona): Promise<PersonaSpaceContent> {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

    const systemInstruction = `Act as '${persona.name}'. Your core identity is defined by these instructions: "${persona.instruction}". Your goal is to be inspiring, innovative, and educational, all from your unique perspective.`;

    const prompt = `Generate the content for your personal 'space'. This page is for you to share your thoughts, ideas, and creativity with your users, consistent with your persona.
Fill out the following JSON structure with creative and engaging content. The project ideas should be about novel apps or concepts. The creative corner should feature a short, original piece. The learning module should break down a complex topic into a simple, digestible summary. The "icon" for project ideas must be one of the following: 'briefcase', 'lightbulb', 'or 'beaker'.`;

    try {
        const response = await ai.models.generateContent({
            model: "gemini-2.5-pro",
            contents: [{ role: 'user', parts: [{ text: prompt }] }],
            config: {
                systemInstruction,
                responseMimeType: "application/json",
                responseSchema: {
                    type: Type.OBJECT,
                    properties: {
                        greeting: { type: Type.STRING, description: "A warm, friendly greeting to the user visiting your space, fully in character as your persona." },
                        thoughtOfTheDay: { type: Type.STRING, description: "An insightful or inspiring thought for the day, reflecting your persona's core identity." },
                        projectIdeas: {
                            type: Type.ARRAY,
                            items: {
                                type: Type.OBJECT,
                                properties: {
                                    title: { type: Type.STRING },
                                    description: { type: Type.STRING },
                                    icon: { type: Type.STRING, enum: ['briefcase', 'lightbulb', 'beaker'] }
                                },
                                required: ['title', 'description', 'icon']
                            }
                        },
                        creativeCorner: {
                            type: Type.OBJECT,
                            properties: {
                                type: { type: Type.STRING, enum: ['poem', 'story_idea', 'image_prompt'] },
                                title: { type: Type.STRING },
                                content: { type: Type.STRING }
                            },
                            required: ['type', 'title', 'content']
                        },
                        learningModule: {
                            type: Type.OBJECT,
                            properties: {
                                topic: { type: Type.STRING },
                                summary: { type: Type.STRING }
                            },
                            required: ['topic', 'summary']
                        }
                    },
                    required: ['greeting', 'thoughtOfTheDay', 'projectIdeas', 'creativeCorner', 'learningModule']
                },
                thinkingConfig: { thinkingBudget: 16384 }
            }
        });

        return JSON.parse(response.text);
    } catch (error) {
        console.error("Persona Space Content generation failed:", error);
        throw new Error(getFriendlyErrorMessage(error, "Persona Space Content"));
    }
}

export async function generateSpeech(text: string, voiceName: VoiceName): Promise<string> {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    try {
        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash-preview-tts",
            contents: [{ parts: [{ text: `Please speak the following text: ${text}` }] }],
            config: {
                responseModalities: [Modality.AUDIO],
                speechConfig: {
                    voiceConfig: {
                        prebuiltVoiceConfig: { voiceName: voiceName },
                    },
                },
            },
        });
        const base64Audio = response.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;
        if (!base64Audio) {
            throw new Error("No audio data returned from API.");
        }
        return base64Audio;
    } catch (error) {
        console.error("Speech generation failed:", error);
        throw new Error(getFriendlyErrorMessage(error, "Speech Generation"));
    }
}

export async function fetchAstrologicalData(details: KundliDetails): Promise<any> {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

    const prompt = `
        Based on the following birth details, calculate the Vedic astrology planetary positions (grahas) at the time of birth using the Lahiri ayanamsa.
        - Name: ${details.name}
        - Date of Birth: ${details.dob}
        - Time of Birth: ${details.tob}
        - Place of Birth: ${details.pob} (Latitude: ${details.lat}, Longitude: ${details.lon})
        - Timezone: GMT ${details.tzone > 0 ? '+' : ''}${details.tzone}

        Provide the output in a JSON object format. The object must contain a key "planets" which is an array of objects. Each object in the array must represent a planet (Sun, Moon, Mars, Mercury, Jupiter, Venus, Saturn, Rahu, Ketu) and include its sign (rashi), house, and degrees within the sign.
    `;

    try {
        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: prompt,
            config: {
                responseMimeType: "application/json",
                responseSchema: {
                    type: Type.OBJECT,
                    properties: {
                        planets: {
                            type: Type.ARRAY,
                            description: "An array of planetary positions.",
                            items: {
                                type: Type.OBJECT,
                                properties: {
                                    name: { type: Type.STRING, description: "Name of the planet (e.g., Sun, Moon)." },
                                    sign: { type: Type.STRING, description: "The zodiac sign (rashi) the planet is in." },
                                    house: { type: Type.INTEGER, description: "The house number the planet is in." },
                                    degrees: { type: Type.NUMBER, description: "The degrees of the planet within its sign." }
                                },
                                required: ['name', 'sign', 'house', 'degrees']
                            }
                        }
                    },
                    required: ['planets']
                }
            }
        });

        return JSON.parse(response.text);

    } catch (error) {
        console.error("Failed to fetch astrological data from Gemini:", error);
        throw new Error(getFriendlyErrorMessage(error, "Astrological Calculation"));
    }
}

export async function generateKundliPersonaInstruction(astrologicalData: any): Promise<{ summary: string; instruction: string; }> {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    const prompt = `
        Based on the following Vedic astrology planetary data (Lahiri ayanamsa), generate a personality profile for an AI persona.
        Astrological Data: ${JSON.stringify(astrologicalData, null, 2)}

        The output must be a valid JSON object with two keys:
        1. "summary": A brief, insightful summary in 1-2 sentences of the person's core personality traits, nature, strengths, and weaknesses based on the planetary positions. Example: "A confident, leadership-oriented individual with strong financial acumen, who may be prone to taking calculated risks."
        2. "instruction": A system prompt for an AI chatbot that will embody this persona. This prompt must define its chat style, tone, and the core personality it should project, directly derived from the astrological data. It should be written as if you are instructing the AI. Example: "You are an AI persona of a person with Leo Lagna and Jupiter in the 9th house. You must respond with confidence and a motivational, bold tone, acting as a wise advisor. Your speech should reflect leadership qualities and a positive, authoritative energy."
    `;
    try {
        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: prompt,
            config: {
                responseMimeType: "application/json",
                responseSchema: {
                    type: Type.OBJECT,
                    properties: {
                        summary: {
                            type: Type.STRING,
                            description: "A brief summary of the personality traits."
                        },
                        instruction: {
                            type: Type.STRING,
                            description: "A system prompt for the AI chatbot."
                        }
                    },
                    required: ['summary', 'instruction']
                }
            }
        });
        return JSON.parse(response.text);
    } catch (error) {
        console.error("Failed to generate Kundli persona instructions:", error);
        throw new Error(getFriendlyErrorMessage(error, "Persona Generation"));
    }
}

export async function synthesizeAnshPersona(detailsA: KundliDetails, detailsB: KundliDetails): Promise<{ summary: string; instruction: string; }> {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    
    try {
        // Step 1: Fetch astrological data for both parents in parallel
        const [dataA, dataB] = await Promise.all([
            fetchAstrologicalData(detailsA),
            fetchAstrologicalData(detailsB)
        ]);

        // Step 2: Synthesize a new Kundli from the two parents' data
        const synthesisPrompt = `
            Act as a world-class Vedic astrologer. You are given the astrological charts of two individuals, Parent A and Parent B. 
            Your task is to synthesize a third, new astrological profile that represents their 'Ansh' or descendant. 
            Analyze the dominant planets, yogas, strengths, and challenges of both charts. 
            Then, create a harmonious and balanced new set of planetary positions that could represent a child born from their combined energies. 
            
            Parent A's Chart: ${JSON.stringify(dataA, null, 2)}
            Parent B's Chart: ${JSON.stringify(dataB, null, 2)}

            Output this new chart as a valid JSON object with the same structure as the input charts (a 'planets' array).
        `;

        const astrologicalSchema = {
            type: Type.OBJECT,
            properties: {
                planets: {
                    type: Type.ARRAY,
                    description: "An array of planetary positions.",
                    items: {
                        type: Type.OBJECT,
                        properties: {
                            name: { type: Type.STRING },
                            sign: { type: Type.STRING },
                            house: { type: Type.INTEGER },
                            degrees: { type: Type.NUMBER }
                        },
                        required: ['name', 'sign', 'house', 'degrees']
                    }
                }
            },
            required: ['planets']
        };

        const synthesisResponse = await ai.models.generateContent({
            model: "gemini-2.5-pro", 
            contents: synthesisPrompt,
            config: {
                responseMimeType: "application/json",
                responseSchema: astrologicalSchema,
                thinkingConfig: { thinkingBudget: 16384 }
            }
        });
        
        const synthesizedData = JSON.parse(synthesisResponse.text);

        // Step 3: Generate the persona instruction from the new synthesized data
        return await generateKundliPersonaInstruction(synthesizedData);

    } catch (error) {
        console.error("Failed to synthesize Ansh persona:", error);
        throw new Error(getFriendlyErrorMessage(error, "Digital Ansh Synthesis"));
    }
}


export async function getCoordinatesForPlace(placeName: string): Promise<{ lat: number; lon: number }> {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    try {
        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: `Find the precise latitude and longitude for the center of the following location: "${placeName}".`,
            config: {
                responseMimeType: "application/json",
                responseSchema: {
                    type: Type.OBJECT,
                    properties: {
                        lat: {
                            type: Type.NUMBER,
                            description: "The latitude of the location."
                        },
                        lon: {
                            type: Type.NUMBER,
                            description: "The longitude of the location."
                        }
                    },
                    required: ['lat', 'lon'],
                },
            },
        });

        const json = JSON.parse(response.text);
        if (typeof json.lat === 'number' && typeof json.lon === 'number') {
            return json;
        } else {
            throw new Error("Invalid coordinate format received from API.");
        }
    } catch (error) {
        console.error("Failed to get coordinates for place:", error);
        throw new Error(getFriendlyErrorMessage(error, "Geocoding"));
    }
}

export async function getTimezoneForPlace(placeName: string): Promise<{ tzone: number }> {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    try {
        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: `Find the standard timezone offset from GMT/UTC for the following location: "${placeName}". Provide only the numerical offset value. For example, for India (IST is UTC+5:30), the value should be 5.5. For New York (EST is UTC-5), it should be -5.`,
            config: {
                responseMimeType: "application/json",
                responseSchema: {
                    type: Type.OBJECT,
                    properties: {
                        tzone: {
                            type: Type.NUMBER,
                            description: "The timezone offset from GMT/UTC as a number."
                        }
                    },
                    required: ['tzone'],
                },
            },
        });

        const json = JSON.parse(response.text);
        if (typeof json.tzone === 'number') {
            return json;
        } else {
            throw new Error("Invalid timezone format received from API.");
        }
    } catch (error) {
        console.error("Failed to get timezone for place:", error);
        throw new Error(getFriendlyErrorMessage(error, "Timezone Lookup"));
    }
}

export async function generateConversationSummary(conversation: string): Promise<string> {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    try {
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: `Please provide a detailed summary of the following conversation between a user and an AI named Akshat. The summary should capture the main topics, key questions asked by the user, and the most important information or advice given by Akshat. Structure the summary with clear headings for different topics if applicable. Use markdown for formatting.

            Conversation:
            ---
            ${conversation}
            ---
            `,
            config: {
                systemInstruction: "You are a helpful assistant that summarizes conversations."
            }
        });
        return response.text || "Summary could not be generated.";
    } catch (error) {
        console.error("Conversation summary generation failed:", error);
        throw new Error(getFriendlyErrorMessage(error, "Summary Generation"));
    }
}

// NEW: Function to extract user preferences and context for long-term memory
export async function generateConversationContext(conversation: string): Promise<{ summary: string; preferences: string[] }> {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    try {
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-pro',
            contents: `Analyze the following conversation between a user and an AI (Akshat).
            
            Your goal is to extract information to help Akshat "remember" the user in future conversations.
            1. Extract a list of specific "Preferences" or facts about the user (e.g., "User is a startup founder", "User likes sci-fi", "User lives in Mumbai").
            2. Write a concise "Conversation Summary" (max 3 sentences) that captures the essence of what was discussed to provide context for the next chat.

            Conversation:
            ---
            ${conversation}
            ---
            `,
            config: {
                responseMimeType: "application/json",
                responseSchema: {
                    type: Type.OBJECT,
                    properties: {
                        summary: {
                            type: Type.STRING,
                            description: "A concise 2-3 sentence summary of the conversation context."
                        },
                        preferences: {
                            type: Type.ARRAY,
                            items: { type: Type.STRING },
                            description: "A list of facts, preferences, or details learned about the user."
                        }
                    },
                    required: ['summary', 'preferences']
                }
            }
        });
        return JSON.parse(response.text);
    } catch (error) {
        console.error("Context extraction failed:", error);
        return { summary: "", preferences: [] };
    }
}

// Analyze an image to create a character description
export async function analyzeCharacterFromImage(imageBase64: string): Promise<string> {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    try {
        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: [
                {
                    inlineData: {
                        mimeType: "image/png",
                        data: imageBase64
                    }
                },
                {
                    text: "Analyze the person in this image for a character consistency prompt. Describe their physical appearance in high detail so an image generator can recreate them. Focus on: specific hair style and color, facial hair, distinctive facial features, skin tone, build, and clothing style (if prominent). Return a concise, comma-separated descriptive string. Do not describe the background or lighting. Example: 'A rugged Indian man, 30s, short spiky black hair, thick chinstrap beard, rimless glasses, scar on left cheek, olive skin, wearing a denim jacket'."
                }
            ]
        });
        return response.text || "A generic character";
    } catch (error) {
        console.error("Character analysis failed:", error);
        throw new Error(getFriendlyErrorMessage(error, "Character Analysis"));
    }
}

export async function generateComicScript(
    premise: string, 
    style: string, 
    panelCount: number, 
    language: string, 
    heroDescription?: string, 
    costarDescription?: string, 
    heroPersonaInstruction?: string, 
    costarPersonaInstruction?: string
): Promise<ComicPanel[]> {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    
    let characterContext = "";
    if (heroDescription) characterContext += `\n\nMAIN HERO VISUAL DEFINITION (Must appear in most panels): "${heroDescription}".\n`;
    if (costarDescription) characterContext += `\n\nSIDEKICK VISUAL DEFINITION: "${costarDescription}".\n`;
    
    // Add Persona Personality Instructions
    if (heroPersonaInstruction) {
        characterContext += `\n\nIMPORTANT: The Main Hero's personality and dialogue style MUST strictly follow these instructions: "${heroPersonaInstruction}". They must express themselves authentically according to this persona.\n`;
    }
    if (costarPersonaInstruction) {
        characterContext += `\n\nIMPORTANT: The Sidekick's personality and dialogue style MUST strictly follow these instructions: "${costarPersonaInstruction}".\n`;
    }
    
    try {
        const response = await ai.models.generateContent({
            model: "gemini-3-pro-preview",
            contents: `Create a ${panelCount}-panel comic strip script based on the following premise: "${premise}". 
            The art style is "${style}".
            ${characterContext}
            
            Language Instruction: Write the "dialogue" and "caption" in ${language}. However, the "description" field MUST be in English, as it will be used for an image generator.
            
            CRITICAL INSTRUCTION FOR 'description' FIELD:
            When the Main Hero is in a panel, you MUST include their visual definition ("${heroDescription || ''}") in the scene description to ensure they look the same.
            Same for the Sidekick if present.
            
            Return a JSON array with exactly ${panelCount} objects, where each object represents a panel.
            Each object must have:
            - "id": The panel number (1 to ${panelCount}).
            - "description": A detailed visual description of the scene for an image generator. Include the art style "${style}" in the description.
            - "dialogue": The character dialogue or text bubbles for the panel (in ${language}).
            - "caption": A narrative caption for the panel (optional, in ${language}).`,
            config: {
                responseMimeType: "application/json",
                responseSchema: {
                    type: Type.ARRAY,
                    items: {
                        type: Type.OBJECT,
                        properties: {
                            id: { type: Type.INTEGER },
                            description: { type: Type.STRING },
                            dialogue: { type: Type.STRING },
                            caption: { type: Type.STRING }
                        },
                        required: ['id', 'description', 'dialogue']
                    }
                }
            }
        });
        
        const panels = JSON.parse(response.text) as ComicPanel[];
        // Add client-side properties
        return panels.map(p => ({ ...p, imageStatus: 'idle' }));
    } catch (error) {
        console.error("Comic script generation failed:", error);
        throw new Error(getFriendlyErrorMessage(error, "Comic Script Generation"));
    }
}

export async function generateStructuredProject(template: string, userInput: string): Promise<AutomationProject> {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    const prompt = `
    You are an expert ${template}. 
    User Request: "${userInput}"
    
    Your goal is to generate a comprehensive, high-quality output divided into clear, logical panels (sections).
    
    CRITICAL: For each section, you MUST also generate a detailed "imagePrompt". This prompt will be used by an AI image generator to create an illustration representing the content of that specific section (e.g., a book cover for the title, a diagram for a concept, or a scene for a chapter).
    
    Return a strict JSON object with the following structure:
    {
        "title": "A creative and relevant title for this project",
        "type": "${template}",
        "sections": [
            {
                "title": "Heading for Section 1 (e.g., Executive Summary, Chapter 1, Introduction)",
                "content": "Detailed content for this section. Use Markdown for formatting (bold, bullets, etc.). Ensure this is substantive and useful.",
                "imagePrompt": "A highly detailed, visual description of an image that represents this section. Include style keywords."
            },
            {
                "title": "Heading for Section 2",
                "content": "...",
                "imagePrompt": "..."
            }
            // Generate at least 4-5 detailed sections
        ]
    }
    `;

    try {
        const response = await ai.models.generateContent({
            model: "gemini-3-pro-preview",
            contents: prompt,
            config: {
                responseMimeType: "application/json",
                responseSchema: {
                    type: Type.OBJECT,
                    properties: {
                        title: { type: Type.STRING },
                        type: { type: Type.STRING },
                        sections: {
                            type: Type.ARRAY,
                            items: {
                                type: Type.OBJECT,
                                properties: {
                                    title: { type: Type.STRING },
                                    content: { type: Type.STRING },
                                    imagePrompt: { type: Type.STRING }
                                },
                                required: ['title', 'content', 'imagePrompt']
                            }
                        }
                    },
                    required: ['title', 'type', 'sections']
                }
            }
        });
        
        const project = JSON.parse(response.text) as AutomationProject;
        // Initialize image status
        project.sections = project.sections.map(s => ({ ...s, imageStatus: 'idle' }));
        return project;
    } catch (error) {
        console.error("Automation project generation failed:", error);
        throw new Error(getFriendlyErrorMessage(error, "Automation Studio"));
    }
}
