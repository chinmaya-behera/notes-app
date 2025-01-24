import React, { useState, useEffect } from 'react';
import { PlusCircle, Trash2, Edit, LogOut } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../context/AuthContext';
import type { Note } from '../types';
import toast from 'react-hot-toast';

export default function Notes() {
  const [notes, setNotes] = useState<Note[]>([]);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [editingNote, setEditingNote] = useState<Note | null>(null);
  const { user, signOut } = useAuth();

  useEffect(() => {
    fetchNotes();
  }, []);

  const fetchNotes = async () => {
    try {
      const { data, error } = await supabase
        .from('notes')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setNotes(data || []);
    } catch (error) {
      toast.error('Error fetching notes');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingNote) {
        const { error } = await supabase
          .from('notes')
          .update({ title, content, updated_at: new Date().toISOString() })
          .eq('id', editingNote.id);

        if (error) throw error;
        toast.success('Note updated successfully');
      } else {
        const { error } = await supabase.from('notes').insert([
          {
            title,
            content,
            user_id: user?.id,
          },
        ]);

        if (error) throw error;
        toast.success('Note created successfully');
      }

      setTitle('');
      setContent('');
      setEditingNote(null);
      fetchNotes();
    } catch (error) {
      toast.error(editingNote ? 'Error updating note' : 'Error creating note');
    }
  };

  const handleDelete = async (id: string) => {
    try {
      const { error } = await supabase.from('notes').delete().eq('id', id);
      if (error) throw error;
      toast.success('Note deleted successfully');
      fetchNotes();
    } catch (error) {
      toast.error('Error deleting note');
    }
  };

  const handleEdit = (note: Note) => {
    setEditingNote(note);
    setTitle(note.title);
    setContent(note.content);
  };

  const handleSignOut = async () => {
    try {
      await signOut();
    } catch (error) {
      toast.error('Error signing out');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 py-6 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-purple-600">
            My Notes
          </h1>
          <button
            onClick={handleSignOut}
            className="flex items-center px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors duration-200 ease-in-out bg-white/50 backdrop-blur-sm rounded-lg hover:bg-white/80"
          >
            <LogOut className="h-5 w-5 mr-2" />
            Sign Out
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Note Form */}
          <div className="lg:col-span-1">
            <div className="sticky top-6">
              <div className="bg-white/70 backdrop-blur-lg rounded-2xl shadow-xl p-6 transition-all duration-300 hover:shadow-2xl">
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <input
                      type="text"
                      placeholder="Note Title"
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      className="w-full px-4 py-3 border-0 bg-white/50 backdrop-blur-sm rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all duration-300"
                      required
                    />
                  </div>
                  <div>
                    <textarea
                      placeholder="Note Content"
                      value={content}
                      onChange={(e) => setContent(e.target.value)}
                      className="w-full px-4 py-3 border-0 bg-white/50 backdrop-blur-sm rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all duration-300 note-content resize-none"
                      rows={6}
                      required
                    ></textarea>
                  </div>
                  <button
                    type="submit"
                    className="w-full px-4 py-3 flex items-center justify-center text-white bg-gradient-to-r from-indigo-600 to-purple-600 rounded-xl hover:from-indigo-700 hover:to-purple-700 transition-all duration-300 transform hover:scale-[1.02] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                  >
                    <PlusCircle className="h-5 w-5 mr-2" />
                    {editingNote ? 'Update Note' : 'Add Note'}
                  </button>
                </form>
              </div>
            </div>
          </div>

          {/* Notes List */}
          <div className="lg:col-span-2 space-y-4">
            {notes.map((note) => (
              <div
                key={note.id}
                className="group bg-white/70 backdrop-blur-lg rounded-2xl p-6 shadow-lg transition-all duration-300 hover:shadow-xl hover:bg-white/80 hover:translate-y-[-2px]"
              >
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">
                      {note.title}
                    </h3>
                    <p className="text-gray-600 mb-3 whitespace-pre-wrap">
                      {note.content}
                    </p>
                    <p className="text-sm text-gray-400">
                      {new Date(note.created_at).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                      })}
                    </p>
                  </div>
                  <div className="flex space-x-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <button
                      onClick={() => handleEdit(note)}
                      className="p-2 text-indigo-600 hover:text-indigo-800 hover:bg-indigo-50 rounded-lg transition-colors duration-200"
                    >
                      <Edit className="h-5 w-5" />
                    </button>
                    <button
                      onClick={() => handleDelete(note.id)}
                      className="p-2 text-red-600 hover:text-red-800 hover:bg-red-50 rounded-lg transition-colors duration-200"
                    >
                      <Trash2 className="h-5 w-5" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
            {notes.length === 0 && (
              <div className="text-center py-12">
                <p className="text-gray-500">No notes yet. Create your first note!</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}