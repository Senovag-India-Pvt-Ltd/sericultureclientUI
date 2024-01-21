import { useRef } from 'react';
import { Editor } from '@tinymce/tinymce-react';
import '../../../assets/scss/libs/editors/tinymce.scss';

function Tinymce({height, toolbar, menubar, inline, initialValue, ...props}) {
    const editorRef = useRef(null);
    return (
        <Editor
            onInit={(evt, editor) => editorRef.current = editor}
            initialValue={initialValue}
            init={{
                plugins: 'wordcount',
                height: height || 300,
                skin: false,
                branding: false,
                toolbar: toolbar,
                menubar: menubar,
                inline: inline
            }}
        />
    )
}

export default Tinymce;
