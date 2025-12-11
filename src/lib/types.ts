/**
 * Type Definitions and Validation Schemas
 */

import { z } from "zod";
import { ObjectId } from "mongodb";

// Zod schemas for runtime validation
export const createNoteSchema = z.object({
  title: z.string().min(1, "Title is required").max(200, "Title too long"),
  content: z.string().max(10000, "Content too long"),
});

export const updateNoteSchema = z.object({
  id: z.string().min(1, "Note ID is required"),
  title: z.string().min(1).max(200).optional(),
  content: z.string().max(10000).optional(),
});

export const deleteNoteSchema = z.object({
  id: z.string().min(1, "Note ID is required"),
});

// TypeScript types inferred from Zod
export type CreateNoteInput = z.infer<typeof createNoteSchema>;
export type UpdateNoteInput = z.infer<typeof updateNoteSchema>;
export type DeleteNoteInput = z.infer<typeof deleteNoteSchema>;

// MongoDB document structure
export interface NoteResponse {
  _id: ObjectId;
  title: string;
  content: string;
  createdAt: Date;
  updatedAt: Date;
}

// Client-facing note type
export interface Note {
  id: string;
  title: string;
  content: string;
  createdAt: string;
  updatedAt: string;
}

// Converter function
export function documentToNote(doc: NoteResponse): Note {
  return {
    id: doc._id.toString(),
    title: doc.title,
    content: doc.content,
    createdAt: doc.createdAt.toISOString(),
    updatedAt: doc.updatedAt.toISOString(),
  };
}
