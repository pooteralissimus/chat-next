'use client';
import Chat from '../components/pages/chat';

import { FC, useEffect, useState } from 'react';

type PageProps = {};
// 
const Page: FC<PageProps> = ({ }) => {

    useEffect(() => {
        testFunction()
    }, [])

    const testFunction = async () => {
        // Fetch the file from the public folder using a relative path
        const response = await fetch('/files/forChatGPT.docx');
        const blob = await response.blob();


        const formData = new FormData()
        formData.append('files', blob, 'forChatGPT.docx')

        // console.log(blob);

        //
        // const response = await fetch('/api/create-assistant', {
        //     method: 'POST',
        //     // body: formData,
        // });
        //
        // const responseData = (await response.json()) as any;

        // console.log('responseData', responseData)


        const response2 = await fetch('/api/create-vector-id', {
            method: 'POST',
            body: formData,
        });

        const responseData2 = (await response2.json()) as any;


        console.log('responseData2', responseData2)
    }

    return (
        <main>
            <Chat></Chat>
        </main>
    );
};

export default Page;
