// src/pages/MyPosts.jsx
import React, { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../supabaseClient';

const MyPosts = () => {
  const [posts, setPosts] = useState([]);
  const [userProfile, setUserProfile] = useState({ name: '', photo: '' });
  const [openMenuId, setOpenMenuId] = useState(null);
  const menuRefs = useRef({});
  const navigate = useNavigate();

  useEffect(() => {
    const fetchPosts = async () => {
      const {
        data: { user },
        error,
      } = await supabase.auth.getUser();

      if (error || !user) {
        navigate('/login');
        return;
      }

      const { data: profile } = await supabase
        .from('profiles')
        .select('name, photo')
        .eq('id', user.id)
        .single();

      setUserProfile({
        name: profile?.name || 'Your Name',
        photo: profile?.photo || '/default-avatar.png',
      });

      const { data: myPosts } = await supabase
        .from('posts')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      setPosts(myPosts || []);
    };

    fetchPosts();
  }, []);

  useEffect(() => {
    const handleClickOutside = (e) => {
      const menuElements = Object.values(menuRefs.current);
      if (!menuElements.some((ref) => ref && ref.contains(e.target))) {
        setOpenMenuId(null);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleEdit = (postId) => {
    alert(`Edit post: ${postId}`);
  };

  const handleDelete = async (postId) => {
    const confirmDelete = window.confirm('Are you sure you want to delete this post?');
    if (!confirmDelete) return;

    const { error } = await supabase.from('posts').delete().eq('id', postId);
    if (!error) {
      setPosts(posts.filter((post) => post.id !== postId));
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-6">
      <button
        onClick={() => navigate('/myaccount')}
        className="mb-6 text-sm text-blue-600 hover:underline"
      >
        ← Back to My Account
      </button>

      <h2 className="text-3xl font-bold mb-6 text-center text-blue-600">
        📌 My Progress Posts
      </h2>

      {posts.length === 0 ? (
        <p className="text-center text-gray-600">No posts found.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {posts.map((post) => (
            <div
              key={post.id}
              className="border rounded-lg p-4 shadow bg-white relative"
            >
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center space-x-3">
                  <img
                    src={userProfile.photo}
                    alt="Profile"
                    className="w-10 h-10 rounded-full"
                  />
                  <div className="font-medium text-gray-800">
                    {userProfile.name}
                  </div>
                </div>
                <div className="relative" ref={(el) => (menuRefs.current[post.id] = el)}>
                  <button
                    className="text-gray-600 text-xl"
                    onClick={() => setOpenMenuId(openMenuId === post.id ? null : post.id)}
                  >
                    &#8942;
                  </button>
                  {openMenuId === post.id && (
                    <div className="absolute right-0 mt-1 w-32 bg-white border rounded shadow z-10">
                      <button
                        onClick={() => handleEdit(post.id)}
                        className="block w-full px-3 py-2 text-left hover:bg-gray-100"
                      >
                        ✏️ Edit
                      </button>
                      <button
                        onClick={() => handleDelete(post.id)}
                        className="block w-full px-3 py-2 text-left text-red-600 hover:bg-gray-100"
                      >
                        🗑️ Delete
                      </button>
                    </div>
                  )}
                </div>
              </div>

              <h3 className="font-semibold text-green-600 mb-1">
                {post.skill}
              </h3>
              <p className="text-gray-800 text-sm mb-2">{post.caption}</p>

              {post.media_url &&
                (post.media_url.includes('.mp4') ? (
                  <video
                    src={post.media_url}
                    controls
                    className="w-full rounded"
                  />
                ) : (
                  <img
                    src={post.media_url}
                    alt="Post media"
                    className="w-full rounded"
                  />
                ))}

              <button className="mt-3 w-full py-1 border border-blue-500 text-blue-600 rounded hover:bg-blue-50">
                💾 Save Post
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MyPosts;
