import React, { useState, useEffect, useRef } from 'react';
import { Check, X } from 'lucide-react';
import toast from 'react-hot-toast';
import { editMessage } from '../../utils/socket';

function MessageEditor({ message, conversationId, onClose }) {
  const [editContent, setEditContent] = useState(message.content || '');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const editorRef = useRef(null);

  useEffect(() => {
    // Focus the editor when it opens
    if (editorRef.current) {
      editorRef.current.focus();
      // Place cursor at the end of the text
      editorRef.current.selectionStart = editorRef.current.value.length;
      editorRef.current.selectionEnd = editorRef.current.value.length;
    }
  }, []);

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    } else if (e.key === 'Escape') {
      onClose();
    }
  };

  const handleSubmit = async () => {
    if (editContent.trim() === '') return;
    if (editContent.trim() === message.content) {
      onClose();
      return;
    }
    
    try {
      setIsSubmitting(true);
      await editMessage(message._id, conversationId, editContent);
      toast.success('Message updated', {
        style: {
          background: '#1F2937',
          color: '#fff',
        },
      });
      onClose();
    } catch {
      toast.error('Failed to update message', {
        style: {
          background: '#1F2937',
          color: '#fff',
        },
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-gray-800 bg-opacity-95 rounded-lg p-2 shadow-lg">
      <div className="text-xs text-blue-400 mb-1">Edit message</div>
      <textarea
        ref={editorRef}
        className="w-full bg-gray-700 text-white rounded p-2 outline-none resize-none max-h-32"
        value={editContent}
        onChange={(e) => setEditContent(e.target.value)}
        onKeyDown={handleKeyDown}
        rows={Math.min(editContent.split('\n').length, 4)}
      />
      <div className="flex justify-end space-x-2 mt-2">
        <button 
          className="p-1 text-gray-400 hover:text-white rounded"
          onClick={onClose}
          disabled={isSubmitting}
        >
          <X size={18} />
        </button>
        <button 
          className={`p-1 rounded ${isSubmitting ? 'text-gray-400' : 'text-green-500 hover:text-green-400'}`}
          onClick={handleSubmit}
          disabled={isSubmitting || editContent.trim() === ''}
        >
          {isSubmitting ? (
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-green-500"></div>
          ) : (
            <Check size={18} />
          )}
        </button>
      </div>
    </div>
  );
}

export default MessageEditor;