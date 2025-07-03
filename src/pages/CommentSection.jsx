import React, { useState, useEffect } from 'react';
import { supabase } from '../utils/supabaseClient';

const CommentSection = ({ postId }) => {
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');

  useEffect(() => {
    fetchComments();
  }, []);

  const fetchComments = async () => {
    const { data, error } = await supabase
      .from('comments')
      .select('*')
      .eq('post_id', postId)
      .order('created_at', { ascending: true });

    if (!error) setComments(data);
  };

  const handleAddComment = async () => {
    const { data, error } = await supabase
      .from('comments')
      .insert([{ post_id: postId, content: newComment }]);

    if (!error) {
      setNewComment('');
      fetchComments();
    }
  };

  return (
    <div className="mt-4">
      <h4 className="font-semibold text-sm text-gray-700 mb-1">Comments</h4>
      <div className="space-y-2 max-h-40 overflow-y-auto">
        {comments.map(c => (
          <div key={c.id} className="text-sm bg-gray-100 p-2 rounded">
            {c.content}
          </div>
        ))}
      </div>
      <div className="flex mt-2">
        <input
          type="text"
          value={newComment}
          placeholder="Write a comment..."
          onChange={(e) => setNewComment(e.target.value)}
          className="flex-grow border p-2 rounded-l"
        />
        <button
          onClick={handleAddComment}
          className="bg-green-600 text-white px-3 rounded-r"
        >
          Send
        </button>
      </div>
    </div>
  );
};

export default CommentSection;
