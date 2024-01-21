
import { useQuill } from 'react-quilljs';
import '../../../assets/scss/libs/editors/quill.scss'; 

// quill default component
export const Quill = ({placeholderValue, ...props}) => {
    let placeholder = `${!placeholderValue ? "Hello World!" : placeholderValue}`;
    const { quillRef } = useQuill({ placeholder });

    return (
      <div style={{ width: "100%", height: "100%" }}>
        <div ref={quillRef} />
      </div>
    );
}

// quill minimal component
export const QuillMinimal = ({placeholderValue, ...props}) => {
 
    const modules = {
        toolbar: [
            ['bold', 'italic', 'underline', 'strike'],
            [ 'blockquote' ,{ 'list': 'bullet' }],
            [{ 'header': 1 }, { 'header': 2 }, { 'header': [ 3, 4, 5, 6, false] }],

            [{ 'align': [] }],

            ['clean']
        ],
    };
    
    const placeholder = `${!placeholderValue ? "Write some awesome text..." : placeholderValue}`;

    const formats = ['bold', 'italic', 'underline', 'strike'];

    const {quillRef } = useQuill({ modules, formats, placeholder });


    return (
        <div style={{ width: "100%", height: "100%" }}>
          <div ref={quillRef} />
        </div>
    );
}

export default Quill;
