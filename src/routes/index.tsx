import { createFileRoute, useRouter } from "@tanstack/react-router";
import { useState } from "react";
import { getNotes, createNote, updateNote, deleteNote } from "../server/notes";
import type { Note } from "../lib/types";
import { formatDate } from "../lib/utils";

export const Route = createFileRoute("/")({
  component: Home,
  loader: async () => {
    const notes = await getNotes();
    return { notes };
  },
});

function Home() {
  const router = useRouter();
  const { notes: initialNotes } = Route.useLoaderData();
  const [notes, setNotes] = useState<Note[]>(initialNotes);

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editTitle, setEditTitle] = useState("");
  const [editContent, setEditContent] = useState("");
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);
  const [isCreating, setIsCreating] = useState(false);

  const refreshNotes = async () => {
    const updated = await getNotes();
    setNotes(updated);
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    setIsCreating(true);
    try {
      await createNote({
        data: { title: title.trim(), content: content.trim() },
      });
      setTitle("");
      setContent("");
      await refreshNotes();
    } catch (error) {
      console.error("Failed to create note:", error);
      alert("Failed to create note");
    } finally {
      setIsCreating(false);
    }
  };

  const handleEdit = (note: Note) => {
    setEditingId(note.id);
    setEditTitle(note.title);
    setEditContent(note.content);
  };

  const handleUpdate = async (id: string) => {
    try {
      await updateNote({
        data: {
          id,
          title: editTitle.trim(),
          content: editContent.trim(),
        },
      });
      setEditingId(null);
      await refreshNotes();
    } catch (error) {
      console.error("Failed to update note:", error);
      alert("Failed to update note");
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteNote({ data: { id } });
      setDeleteConfirmId(null);
      await refreshNotes();
    } catch (error) {
      console.error("Failed to delete note:", error);
      alert("Failed to delete note");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
      <div className="container mx-auto max-w-7xl px-4 py-8">
        {/* Header */}
        <header className="mb-8 text-center">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">
            📝 Notes App
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Built with TanStack Start + MongoDB
          </p>
        </header>

        {/* Create Note Form */}
        <div className="mb-8 max-w-2xl mx-auto">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
            <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">
              Create New Note
            </h2>
            <form onSubmit={handleCreate} className="space-y-4">
              <div>
                <label
                  htmlFor="title"
                  className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                >
                  Title *
                </label>
                <input
                  type="text"
                  id="title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Enter note title..."
                  maxLength={200}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                  disabled={isCreating}
                />
              </div>
              <div>
                <label
                  htmlFor="content"
                  className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                >
                  Content
                </label>
                <textarea
                  id="content"
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  placeholder="Enter note content..."
                  rows={4}
                  maxLength={10000}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                  disabled={isCreating}
                />
              </div>
              <button
                type="submit"
                disabled={isCreating || !title.trim()}
                className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white font-medium py-2 px-4 rounded-lg transition-colors"
              >
                {isCreating ? "Creating..." : "Create Note"}
              </button>
            </form>
          </div>
        </div>

        {/* Notes List */}
        <div className="max-w-6xl mx-auto">
          {notes.length === 0 ? (
            <div className="text-center py-12 bg-white dark:bg-gray-800 rounded-lg shadow">
              <p className="text-gray-500 dark:text-gray-400 text-lg">
                No notes yet. Create your first note above! 👆
              </p>
            </div>
          ) : (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {notes.map((note) => (
                <div
                  key={note.id}
                  className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 hover:shadow-xl transition-shadow"
                >
                  {editingId === note.id ? (
                    <div className="space-y-3">
                      <input
                        type="text"
                        value={editTitle}
                        onChange={(e) => setEditTitle(e.target.value)}
                        className="w-full px-3 py-2 border rounded-lg dark:bg-gray-700 dark:text-white dark:border-gray-600"
                      />
                      <textarea
                        value={editContent}
                        onChange={(e) => setEditContent(e.target.value)}
                        rows={4}
                        className="w-full px-3 py-2 border rounded-lg dark:bg-gray-700 dark:text-white dark:border-gray-600"
                      />
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleUpdate(note.id)}
                          className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg"
                        >
                          Save
                        </button>
                        <button
                          onClick={() => setEditingId(null)}
                          className="flex-1 bg-gray-300 hover:bg-gray-400 text-gray-800 py-2 rounded-lg"
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  ) : deleteConfirmId === note.id ? (
                    <div className="space-y-3">
                      <p className="text-red-600 dark:text-red-400 font-medium">
                        Delete "{note.title}"?
                      </p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        This action cannot be undone.
                      </p>
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleDelete(note.id)}
                          className="flex-1 bg-red-600 hover:bg-red-700 text-white py-2 rounded-lg"
                        >
                          Delete
                        </button>
                        <button
                          onClick={() => setDeleteConfirmId(null)}
                          className="flex-1 bg-gray-300 hover:bg-gray-400 text-gray-800 py-2 rounded-lg"
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  ) : (
                    <>
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                        {note.title}
                      </h3>
                      <p className="text-sm text-gray-500 dark:text-gray-400 mb-3">
                        {formatDate(note.updatedAt)}
                      </p>
                      {note.content && (
                        <p className="text-gray-700 dark:text-gray-300 mb-4 whitespace-pre-wrap">
                          {note.content}
                        </p>
                      )}
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleEdit(note)}
                          className="flex-1 bg-blue-100 hover:bg-blue-200 dark:bg-blue-900 dark:hover:bg-blue-800 text-blue-700 dark:text-blue-300 py-2 rounded-lg font-medium"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => setDeleteConfirmId(note.id)}
                          className="flex-1 bg-red-100 hover:bg-red-200 dark:bg-red-900 dark:hover:bg-red-800 text-red-700 dark:text-red-300 py-2 rounded-lg font-medium"
                        >
                          Delete
                        </button>
                      </div>
                    </>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
