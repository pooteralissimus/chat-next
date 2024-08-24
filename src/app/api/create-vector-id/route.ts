import {NextRequest, NextResponse} from "next/server";
import {openai} from "@/lib/openai";

export const POST = async (req: NextRequest) => {
    try {

        const formData = await req.formData();
        const files = formData.getAll('files') as File[];


        let vectorStore = await openai.beta.vectorStores.create({
            name: "Financial Statement",
        });

        await openai.beta.vectorStores.fileBatches.uploadAndPoll(vectorStore.id, {files: files})

        console.log('vectorStore',vectorStore)


        if (!vectorStore)
            return NextResponse.json({
                status: 'Failed',
                code: 500,
                data: {message: 'Failed to generate a message'},
            });

        return NextResponse.json({
            status: 'Success',
            code: 200,
            data: {
                vectorStore,
            },
        });
    } catch (e) {
        console.log(e);
        console.log('dfsfdsf')

        return NextResponse.json({status: 'Error', code: 400, data: e});
    }
};
