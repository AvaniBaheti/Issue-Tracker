import React from 'react';
import SimpleMDE from 'react-simplemde-editor';
import "easymde/dist/easymde.min.css";

interface MarkdownEditorProps {
  value: string;
  onChange: (value: string) => void;
}

const MarkdownEditor= ({ value, onChange }:MarkdownEditorProps) => {
  return (
    <SimpleMDE value={value} onChange={onChange} />
  );
};

export default MarkdownEditor;
