'use client'
import { NextPage } from 'next'
import { useEditor, EditorContent, EditorProvider } from '@tiptap/react'
import Code from '@tiptap/extension-code'
import Document from '@tiptap/extension-document'
import Paragraph from '@tiptap/extension-paragraph'
import Text from '@tiptap/extension-text'
import Typography from '@tiptap/extension-typography'
import { Color } from '@tiptap/extension-color'

import style from './styles.module.scss'
import TextStyle from '@tiptap/extension-text-style'
import ListItem from '@tiptap/extension-list-item'
import StarterKit from '@tiptap/starter-kit'
import { cn, htmlToMarkdown, markdownToHtml } from '@/lib/utils'
import { useEffect, useRef, useState } from 'react'

interface Props {
    content: string,
    saveData: (html: string) => void
}

const TipTapEditor: NextPage<Props> = ({ content, saveData }) => {
    const [isDirty, setIsDirty] = useState(false);
    const editorRef = useRef<any>(null);
    const extensions = [
        Color.configure({ types: [TextStyle.name, ListItem.name] }),
        // @ts-ignore
        TextStyle.configure({ types: [ListItem.name] }),
        StarterKit.configure(),
    ]
    const editor = useEditor({
        immediatelyRender: false,
        extensions,
        onUpdate: () => {
            setIsDirty(true)
        },
        editorProps: {
            attributes: {
                class: cn(
                    'prose max-w-none [&_ol]:list-decimal [&_ul]:list-disc'
                ),
            },
        },
        content
    })

    editorRef.current = editor;
    const saveContent = () => {
        if (!editorRef.current) return;
        const html = editorRef.current.getHTML();
        saveData(html)
    };
    useEffect(() => {
        const interval = setInterval(() => {
            if (isDirty) {
                saveContent();
                setIsDirty(false);
            }
        }, 2000);

        return () => clearInterval(interval);
    }, [isDirty]);
    useEffect(() => {
        editor?.commands.setContent(content)
    }, [content])
    return <div className={style.tiptap + " h-full"}>
        <EditorContent editor={editor} />
    </div>
}

export default TipTapEditor