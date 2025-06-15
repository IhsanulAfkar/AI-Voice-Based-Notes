import { TSession } from '@/types';
import { CircleStop, Mic } from 'lucide-react'
import { NextPage } from 'next'
import { useRef, useState } from 'react';
import { toast } from 'sonner';

interface Props {
    conversationId?: string,
    session: TSession
}

const RecordSection: NextPage<Props> = ({ conversationId, session }) => {
    const mediaRecorderRef = useRef<MediaRecorder | null>(null);
    const [recording, setRecording] = useState(false);
    const [audioUrl, setAudioUrl] = useState<string | null>(null);
    const startRecording = async () => {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
            const mediaRecorder = new MediaRecorder(stream);
            mediaRecorderRef.current = mediaRecorder;
            const chunks: BlobPart[] = [];

            mediaRecorder.ondataavailable = (e) => chunks.push(e.data);

            mediaRecorder.onstop = async () => {
                const blob = new Blob(chunks, { type: 'audio/webm' });
                const url = URL.createObjectURL(blob);
                setAudioUrl(url);

                const formData = new FormData();
                formData.append('audio', blob, 'recording.webm');
                if (conversationId)
                    formData.append('conversation_id', conversationId)

                try {
                    const res = await fetch('/api/audio', {
                        method: 'POST',
                        body: formData,
                    });

                    if (!res.ok) {
                        throw new Error('Upload failed');
                    }

                    console.log('Upload successful');
                } catch (error) {
                    toast.error('Error upload audio')
                    console.error('Error uploading audio:', error);
                }
            };

            mediaRecorder.start();
            setRecording(true);
        } catch (err) {
            toast.error("Microphone access denied")
            console.error('Microphone access denied or error:', err);
        }
    };

    const stopRecording = () => {
        mediaRecorderRef.current?.stop();
        setRecording(false);
    };

    return <>
        {!recording ? (<div onClick={startRecording} className='bg-white shadow-md rounded-full p-2 border hover:cursor-pointer hover:outline-2 focus:bg-gray-300'>
            <Mic />
        </div>) : (<div onClick={stopRecording} className='bg-white shadow-md rounded-full p-2 border hover:cursor-pointer hover:outline-2 focus:bg-gray-300'>
            <CircleStop />
        </div>)}
    </>
}

export default RecordSection