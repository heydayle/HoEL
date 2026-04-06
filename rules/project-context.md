# 📁 Project Specification & Context: LingoNote

**Document Purpose:** This file defines the core business logic, user roles, database schema, and features of the project. The AI Assistant MUST read and strictly follow these definitions when generating modules, routing, and database interactions.

---

## 1. Project Overview

- **Project Name:** LingoNote
- **Description:** A web application designed to record and manage language learning sessions. It helps users take notes, build vocabulary lists, and generate AI-powered reading/listening exercises based on learned words.
- **Architecture Note:** The application uses **Next.js 16 (App Router)** for the frontend and **Supabase (PostgreSQL + Auth)** as the backend. Data interactions should be performed via the Supabase client or dedicated API routes.

---

## 2. User Roles & Authentication

Since the database tracks ownership (`createdBy`), the application requires authentication via Supabase Auth.

- **Authenticated User (Teacher/Student):** Can log in, create lessons, add vocabularies, generate summaries using AI, and view their own data exclusively.
- **Guest:** Can only access public landing pages and the authentication screen.

---

## 3. Global Core Features

- **Database as a Service:** Full CRUD operations communicating directly with Supabase via `@supabase/auth-helpers-nextjs`.
- **AI Integration:** Uses LLMs (e.g., DeepSeek) to automatically generate reading paragraphs and comprehension questions based on a lesson's vocabulary list.
- **Multi-language Support (i18n):** System UI toggles between English (en) and Vietnamese (vi).
- **Theme Management:** System-wide Dark/Light mode using `styled-components` and `shadcn/ui`.

---

## 4. Core Database Schema (Supabase ERD)

The AI must strictly follow these exact table structures and data types when creating TypeScript interfaces (`core/models`) and writing Supabase queries.

### Table: `lessons`

Represents a single learning session.

- `id` (uuid, Primary Key)
- `created_at` (timestamptz)
- `date` (text) - The date the lesson took place.
- `topic` (text) - The main subject of the lesson.
- `participantName` (text) - Name of the other person in the session (e.g., student name or teacher name).
- `isPinned` (Bool) - For UI sorting.
- `isFavorite` (Bool) - For UI filtering.
- `priority` (text) - e.g., 'Low', 'Medium', 'High'.
- `notes` (varchar) - Rich text or markdown content of the lesson.
- `createdBy` (uuid) - Foreign key to Supabase Auth user ID (owner of the record).

### Table: `vocabularies`

Represents words/phrases learned, linked to a specific lesson.

- `id` (uuid, Primary Key)
- `created_at` (timestamptz)
- `word` (varchar) - The vocabulary item.
- `ipa` (varchar) - International Phonetic Alphabet.
- `partOfSpeech` (varchar) - Noun, verb, adj, etc.
- `meaning` (varchar) - Target language definition.
- `translation` (varchar) - Native language translation.
- `pronunciation` (text) - Guide or audio link.
- `example` (varchar) - Example sentence.
- `lesson_id` (uuid, Foreign Key -> `lessons.id`)

### Table: `summaries`

AI-generated practice content based on the lesson's vocabularies.

- `id` (uuid, Primary Key)
- `created_at` (timestamptz)
- `lesson_id` (uuid, Foreign Key -> `lessons.id`)
- `paragraph` (varchar) - An AI-generated text utilizing the lesson's vocabularies.
- `question_1` (varchar) - First comprehension/practice question.
- `question_2` (varchar) - Second comprehension/practice question.
- `question_3` (varchar) - Third comprehension/practice question.

---

## 5. Screens & Module Features

_(Note: These module names match the folder names in `app/modules/`)_

### Module: `auth`

- **Route:** `/auth` (Single Unified Route)
- **Features:**
  - Uses Supabase Email/Password authentication (`signInWithPassword` & `signUp`).
  - Seamless UI toggle (Tabs component from `shadcn`) between Login and Register modes on the exact same page.
  - Form validation using Zod & React Hook Form.
  - Auto-redirect to `/lessons` upon successful authentication.

### Module: `lessons` (Main Interface)

- **Route:** `/lessons` (List View)
  - **Features:** Display lessons belonging to the current `createdBy` user. Includes Search, Filter (`isPinned`, `isFavorite`), and Sort functionalities.
- **Route:** `/lessons/new`, `/lessons/[id]` (Detail/Edit View), `/s/[id]` (public share view, not allow edit and not authenticated)
  - **Features:**
    - **Lesson Metadata Form:** Update topic, date, participant, and notes.
    - **Vocabulary Manager:** Add/Edit/Delete records in the `vocabularies` table linked to this `lesson_id`.
    - **AI Practice Generator:** A specific UI section to trigger the LLM. It gathers all `word` fields from the related `vocabularies`, sends them to the AI, and saves the resulting paragraph and 3 questions into the `summaries` table.
    - **Summary View:** Display the generated `paragraph` and the 3 questions for review or practice.

---

## 6. Business Rules & Edge Cases

- **Data Privacy:** Row Level Security (RLS) must be enabled in Supabase so users can only `SELECT`, `INSERT`, `UPDATE`, `DELETE` records where `createdBy = auth.uid()`.
- **Foreign Key Constraints:** Deleting a lesson MUST cascade and delete all associated `vocabularies` and `summaries` to prevent orphaned data.
- **Data Synchronization:** When generating a summary via AI, the system must check if a summary for that `lesson_id` already exists. If yes, it should update (`UPDATE`) the existing row rather than inserting (`INSERT`) a duplicate.
