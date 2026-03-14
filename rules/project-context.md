# 📁 Project Specification & Context: Language Lesson Tracker

**Document Purpose:** This file defines the core business logic, user roles, data structures, and features of the project. The AI Assistant MUST read and strictly follow these definitions when generating modules, routing, and UI components.

---

## 1. Project Overview
* **Project Name:** LingoNote (or specific project name)
* **Description:** An offline-first, local-storage-based application designed to record and manage language learning sessions. It helps both teachers and students take notes, build vocabulary lists, and track knowledge delivered or acquired.
* **Architecture Note:** 100% of data is stored in the browser's `localStorage`. No backend database is required. State management (e.g., Zustand) will sync directly with `localStorage`.

---

## 2. User Modes (Contexts)
Since the app is local-storage based, users select their "Mode" upon first load, which dictates the UI terminology and primary workflow:
* **Student Mode:** Focuses on tracking what they have learned, logging the teacher's name, and reviewing vocab/questions.
* **Teacher Mode:** Focuses on planning lessons, logging the student's name, and preparing materials to export/share with students.

---

## 3. Global Core Features
* **Offline-First Storage:** All CRUD operations read from and write to `localStorage`.
* **Data Portability (Import/Export):** Users can export their data as JSON files and import them on other devices. Supports exporting a single lesson or the entire database.
* **Multi-language Support (i18n):** System UI toggles between English and Vietnamese.
* **Theme Management:** System-wide Dark/Light mode using `styled-components` and `shadcn/ui`.

---

## 4. Core Data Models (Entities)
The AI must strictly follow these object structures when creating TypeScript interfaces (`core/models`).

### A. Lesson
Represents a single learning session.
* `id` (string, UUID)
* `date` (string/Date ISO)
* `topic` (string)
* `participantName` (string) - The name of the Teacher (if user is Student) or Student (if user is Teacher).
* `isPinned` (boolean)
* `isFavorite` (boolean)
* `priority` (enum: Low, Medium, High)
* `notes` (string/Rich Text)
* `links` (string[]) - Array of URLs for reference.
* `vocabularies` (Vocabulary[]) - Array of vocabulary objects.
* `questions` (Question[]) - Array of Q&A objects.

### B. Vocabulary
Represents a word or phrase learned in the lesson.
* `id` (string, UUID)
* `word` (string) - The vocabulary item.
* `ipa` (string) - International Phonetic Alphabet transcription.
* `partOfSpeech` (string) - Noun, verb, adjective, etc.
* `meaning` (string) - Definition in the target language (e.g., English definition).
* `translation` (string) - Translated meaning (e.g., Vietnamese).
* `pronunciation` (string) - Guide on how to say it or a link to audio.
* `example` (string) - Usage in a sentence.

### C. Question
Represents a Q&A pair for review or homework.
* `id` (string, UUID)
* `questionText` (string)
* `answerText` (string)

---

## 5. Screens & Module Features
*(Note: These module names match the folder names in `app/modules/`)*

### Module: `lessons` (Main Interface)
* **Route:** `/lessons` (List View)
  * **Features:** * Display all lessons in a list or grid.
    * **Search:** By topic, participant name, or notes content.
    * **Filter:** By `isPinned`, `isFavorite`, `priority`, or date range.
    * **Sort:** By date (newest/oldest), priority, or topic name.
* **Route:** `/lessons/create` & `/lessons/[id]/edit` (Form View)
  * **Features:**
    * Multi-section form (using React Hook Form + Zod).
    * Section 1: Lesson Metadata (Date, Topic, Participant, Priority, Toggles for Pinned/Favorite).
    * Section 2: Rich Text Notes & Links input.
    * Section 3: Dynamic Vocabulary Builder (Add/Remove vocab items with all fields).
    * Section 4: Dynamic Q&A Builder (Add/Remove questions and answers).

### Module: `data-sync` (Import/Export)
* **Route:** `/settings/data` (or modal within lessons)
* **Features:**
  * **Export All:** Generates a `.json` file containing all `localStorage` data.
  * **Export Single:** Generates a `.json` file for a specific lesson ID.
  * **Import:** Reads a `.json` file, validates the schema (Zod), and merges or overwrites the `localStorage` data.

---

## 6. Business Rules & Edge Cases
* **Data Validation:** Before importing any JSON file, the application MUST validate the structure to prevent app crashes from corrupted `localStorage` data.
* **Local Storage Limits:** Warning should be implemented if local storage exceeds standard limits (though text data rarely hits the 5MB limit, it's good practice).
* **Search Optimization:** Since data is local, search and filter functions should be handled client-side using efficient array methods.