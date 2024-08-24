// import { NextRequest, NextResponse } from "next/server";
// import { openai } from "@/lib/openai";

// export const POST = async (req: NextRequest) => {
//     try {
//         const assistant = await openai.beta.assistants.create({
//             name: "Financial Analyst Assistant",
//             instructions: "You are an expert financial analyst. Use you knowledge base to answer questions about audited financial statements.",
//             model: "gpt-4o",
//             tools: [{ type: "file_search" }],
//         });


//         if (!assistant)
//             return NextResponse.json({
//                 status: 'Failed',
//                 code: 500,
//                 data: { message: 'Failed to generate a message' },
//             });

//         return NextResponse.json({
//             status: 'Success',
//             code: 200,
//             data: {
//                 assistant,
//             },
//         });
//     } catch (e) {
//         console.log(e);

//         return NextResponse.json({ status: 'Error', code: 400, data: e });
//     }
// };
import { NextRequest, NextResponse } from "next/server";
import { openai } from "@/lib/openai";

export const POST = async (req: NextRequest) => {
    try {
        const { message, threadId, assistantId } = await req.json();

        if (!message || !assistantId) {
            throw new Error('Missing required parameters');
        }

        let thread;
        if (threadId) {
            thread = await openai.beta.threads.retrieve(threadId);
        } else {
            thread = await openai.beta.threads.create();
        }

        await openai.beta.threads.messages.create(thread.id, {
            role: "user",
            content: message,
        });

        const run = await openai.beta.threads.runs.create(thread.id, {
            assistant_id: assistantId,
        });

        // Wait for the run to complete
        let runStatus = await openai.beta.threads.runs.retrieve(thread.id, run.id);
        let attempts = 0;
        const maxAttempts = 30; // Adjust as needed

        while (runStatus.status !== "completed" && attempts < maxAttempts) {
            await new Promise(resolve => setTimeout(resolve, 1000));
            runStatus = await openai.beta.threads.runs.retrieve(thread.id, run.id);
            attempts++;
        }

        if (runStatus.status !== "completed") {
            throw new Error('Run did not complete in the allotted time');
        }

        // Retrieve the assistant's response
        const messages = await openai.beta.threads.messages.list(thread.id);
        const assistantMessage = messages.data.find(m => m.role === "assistant");

        let responseContent = "";
        if (assistantMessage && assistantMessage.content) {
            for (const content of assistantMessage.content) {
                if (content.type === 'text') {
                    responseContent += content.text.value;
                }
                // Handle other content types if needed
            }
        }

        if (!responseContent) {
            throw new Error('No response content found');
        }

        return NextResponse.json({
            status: 'Success',
            code: 200,
            data: {
                message: responseContent,
                threadId: thread.id,
            },
        });
    } catch (e) {
        console.error('Error in chat API:', e);
        return NextResponse.json({
            status: 'Error',
            code: 500,
            message: e instanceof Error ? e.message : 'An unknown error occurred'
        }, { status: 500 });
    }
};