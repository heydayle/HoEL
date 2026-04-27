# 🎮 GAME 1: VOCABULARY SPRINT - DESIGN & LOGIC RULEBOOK

<system_directive>
You are an expert Front-End Engineer. Implement the "Vocabulary Sprint" game strictly adhering to the Bento Neo-Brutalism design system. This game is a stateless, free-practice session (NO database saving required). Focus heavily on the specific UI layout, modal flows, and Framer Motion spring physics described below.
</system_directive>

<access_modes>

The game operates in two access modes:

| Mode | Route | Auth required | Data source |
|------|-------|--------------|-------------|
| **Authenticated** | `/lessons/[id]/practice` | ✅ Yes (redirects to `/auth` if not logged in) | `getVocabulariesForLesson` — direct Supabase query with auth token |
| **Public** | `/s/[id]/play` | ❌ No | `getPublicVocabulariesForLesson` — hits `/api/share/[id]/vocab` using the Supabase anon key |

- The same `FreePracticeGamePage` component handles both modes via an `isPublic?: boolean` prop.
- The same `useFreePractice(lessonId, isPublic?)` hook selects the correct data fetcher based on `isPublic`.
- In public mode, the **Back** button returns to the public share page `/s/[id]` instead of `/lessons`.
- The public share page (`/s/[id]`) displays a **🎮 Play** button (i18n key: `practice_btn`) in the top-right controls bar that links to `/s/[id]/play`.
- The middleware (`proxy.ts`) only blocks `/lessons/*` routes — `/s/*` is always publicly accessible without changes.
- The public API endpoint `GET /api/share/[id]/vocab` returns a `{ vocabularies: IVocabulary[] }` JSON payload using the Supabase `anon` key (no auth header needed). Supabase RLS must grant the `anon` role `SELECT` on the `vocabularies` table filtered by `lesson_id`.

</access_modes>

<state_and_logic>
<core_state>
Manage state purely on the client side (e.g., Zustand or custom React Hook).
- `quizQueue`: Array of fetched vocabulary questions.
- `currentIndex`: Current question index.
- `timeLeft`: Countdown timer (default 30s). Use a `timeLeftRef` alongside the state to drive the interval — do NOT update state inside a `setInterval` updater to avoid React StrictMode double-fire issues.
- `totalAnswered`: Integer tracking how many questions the user has attempted.
- `correctAnswers`: Integer tracking correct responses.
- `userInput`: Current string in the input field.
- `modalState`: Enum/String (`NONE`, `CONFIRM_EXIT`, `SUMMARY`).
</core_state>

  <mechanics>
    - **Timer**: 30 seconds per question. Reaching 0 triggers a "Timeout" flow.
    - **Submission**: Triggered ONLY by the `Enter` key.
    - **Validation**: Case-insensitive, ignore trailing/leading spaces.
    - **HTML Stripping**: Example sentences from the database may contain HTML tags (e.g. `<b>word</b>`). Always strip HTML before displaying or processing blanked sentences using a `stripHtml` helper (`raw.replace(/<[^>]*>/g, '')`). This prevents empty tags like `<b></b>` from appearing after the word is blanked.
    - **Flow on Wrong Answer**: Shake the input field. Do NOT advance — allow the user to retry while time permits.
    - **Flow on Timeout**: Lock the input, inline-reveal the correct answer in the Prompt section for 2 seconds, increment `totalAnswered`, then auto-advance to the next question.
    - **Flow on Correct Answer**: Lock input, inline-reveal the answer in the Prompt section for 2 seconds, increment `correctAnswers`, increment `totalAnswered`, then auto-advance to the next question.
    - **Game Completion**: When all questions in the queue are exhausted, automatically show the Summary modal.
  </mechanics>
</state_and_logic>

<ui_implementation>
<layout_structure>
The page uses a full-height flex layout structured as follows:

> **iOS keyboard fix**: On iOS Safari, focusing an input scrolls the entire page upward to position the input above the software keyboard. This pushes the header and question off the top of the screen. The fix: the header, prompt card, and timer bar live inside a **`sticky top-0 z-10 bg-background`** container. When Safari scrolls the page, this sticky block pins itself to the top of the visible area so the question is always readable. The input sits at the natural document bottom — Safari scrolls to it automatically. A `flex-1` spacer between the sticky block and the input keeps the layout vertically distributed on desktop / tall screens.

    1. **Header**:
       - Left: Navigation/Back button (icon-only on mobile `< sm`, label visible on `sm+`).
       - Right: Color Mode Toggle and a prominent "End Game" (Kết thúc) button (Brutalist style: `bg-terracotta text-white border-2 border-black`).

    2. **Main Session (Bento Grid Central)**:
       - **Prompt Area (Hero Card)**:
         - **Prompt Type Label**: A small, uppercase, wide-tracking label above the main prompt that tells the user what kind of hint they are looking at. In meaning mode it shows **What is this word?** (i18n key: `meaning_prompt_label`). In example mode it shows **Fill in the blank** (i18n key: `example_prompt_label`). Styled: `text-xs font-bold uppercase tracking-widest text-foreground-muted`.
         - **Main Prompt**: Displays the target vocabulary's meaning OR a highlighted example sentence with a blank (e.g., "The company decided to ____ the new policy."). Example sentences must be stripped of HTML before rendering.
         - **Vocabulary Hints**: A mini contextual line rendered **below** the main prompt showing extra word details to help the user. Styled as `text-xs text-foreground-muted` with centered flex-wrap layout:
           - **IPA**: Always shown (when available). Monospace font, accent colour. Example: `/ˈæp.əl/`.
           - **Part of Speech**: Always shown (when available). Rendered as a small pill badge with italic text. Example: `noun`.
           - **Meaning**: Shown only in **example** mode (since the sentence alone may not be enough context).
           - **Translation**: Shown only in **meaning** mode (complements the meaning without repeating it).
           - Fields are gracefully hidden when empty.
       - **Progress Bar**: A slim horizontal bar (`h-2`) representing 30s → 0s. Soft border: `border border-brutal-black/30`. Inner fill shrinks right-to-left.
       - **Input Area**: A large centered input field. **Must always maintain focus** — use `useRef` + `useEffect` to re-focus whenever `answerStatus` returns to `idle` or `wrong`. Do NOT use HTML `autoFocus`.

</layout_structure>

<interaction_feedback>
- **Correct Reveal**: When correct, the blank `____` in the example sentence seamlessly types out the correct word, OR the correct English word appears right next to the Vietnamese meaning. Use `text-green-600 font-black` for the revealed word.
- **Timeout Reveal**: Same visual treatment as Correct Reveal but uses `text-terracotta` colour to indicate it was a timeout, not a correct answer.
</interaction_feedback>

  <modals>
    Both modals MUST follow the Neo-Brutalist popup style (`border-4 border-black rounded-bento shadow-brutal-lg bg-cream z-50`).
    - **Confirm Exit Modal**:
      - Triggered by clicking "End Game".
      - Text: "Are you sure you want to end the session?"
      - Actions: "Resume" (Cancel) or "Confirm" (End).
    - **Summary Modal**:
      - Triggered after Confirm Exit OR when all questions in the queue are exhausted.
      - Displays: Total questions answered (`totalAnswered`), Total correct (`correctAnswers`), percentage, and a calculated "Memory Level" (Mức độ trí nhớ) text based on the percentage (e.g., < 50%: "Needs Review", 50-80%: "Good Grasp", > 80%: "Excellent Memory").
      - Actions (stacked vertically):
        1. **Play Again** (i18n key: `replay_btn`) — resets all state (`currentIndex`, scores, timer, input) and resumes the same quiz queue from question 1 without re-fetching data.
        2. **Return to Dashboard** (i18n key: `return_dashboard_btn`) — navigates to `/s/[id]` in public mode or `/lessons` in authenticated mode.
  </modals>
</ui_implementation>

<animation_physics>
<framer_motion_rules>
- Single-keyframe transitions (scale, opacity, etc.) use **spring** physics (`stiffness: 300, damping: 20`).
- Multi-keyframe sequences (3+ keyframes, e.g. shake) must use **tween** (`type: 'tween'`) because Framer Motion spring only supports 2 keyframes. Using spring with more keyframes will cause a runtime crash.
</framer_motion_rules>

<specific_animations>
- **Wrong Answer**: The input field triggers a horizontal shake (`x: [-10, 10, -10, 10, 0]`). Uses `type: 'tween', duration: 0.4` (NOT spring — spring does not support 5 keyframes).
- **Timer Critical**: Progress bar fill turns `bg-terracotta` and pulses when time <= 5s.
- **Correct Reveal Inline**: The revealed text inside the prompt area slightly scales up from `0.8` to `1` and fades in. Uses spring physics.
- **Timeout Reveal Inline**: Same as correct reveal but with `text-terracotta` colour. Uses spring physics.
- **Modal Mount**: Modals scale up (`scale: 0.9` to `1`) and fade in. Uses spring physics. The background overlay uses a simple opacity fade (`backdrop-blur-sm`).
</specific_animations>
</animation_physics>
