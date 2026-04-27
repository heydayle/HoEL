# 🎤 GAME 2: PRONUNCIATION MASTER - DESIGN & LOGIC RULEBOOK

<system_directive>
You are an expert Front-End Engineer specializing in Next.js 16, Web Audio API, and Clean Architecture. Implement the "Pronunciation Master" game strictly adhering to the Bento Neo-Brutalism design system. This game is stateless (NO database saving). Focus on the single-button recording mechanics, the specific color-coded feedback UI, and the modal flows.
</system_directive>

<suggested_analysis_architecture>
<preferred_option name="Azure Cognitive Services - Pronunciation Assessment"> - **Why**: This is the industry standard for language learning apps (like Duolingo or Elsa Speak). It doesn't just convert speech to text; it evaluates phoneme-level accuracy, fluency, and completeness. - **Flow**: UI triggers `startRecording()` -> AudioBlob is captured -> Sent to Infras layer -> Sent to Azure Speech API along with the `referenceText`. - **Response**: Returns a granular JSON object containing an `AccuracyScore` (0-100) and a `Words` array where each word has its own accuracy score.
</preferred_option>
<fallback_option name="OpenAI Whisper + LLM (via Dify)"> - **Why**: If you must stay entirely within the Dify ecosystem. - **Flow**: UI sends AudioBlob to Dify -> Whisper node transcribes to text -> LLM node compares transcribed text with the target text and uses a prompt to evaluate intelligibility and output a structured JSON schema. - **Note**: This measures intelligibility (how well the AI understands the user) rather than perfect phonetic pronunciation.
</fallback_option>
<data_contract>
Regardless of the backend used, the Infras layer MUST normalize the response to this schema for the UI:
`{ totalScore: number (0-100), wordDetails: [{ word: string, status: 'green' | 'yellow' | 'red' }] }`
</data_contract>
</suggested_analysis_architecture>

<state_and_logic>
<core_state>
Manage state purely on the client side: - `currentSentence`: The target English sentence. - `recordState`: Enum (`IDLE`, `RECORDING`, `ANALYZING`, `RESULT`). - `audioBlob`: The recorded audio data. - `analysisResult`: The normalized object containing `totalScore` and `wordDetails`. - `sessionStats`: Object `{ totalAttempts: number, cumulativeScore: number }` to calculate the average score at the end. - `modalState`: Enum/String (`NONE`, `CONFIRM_EXIT`, `SUMMARY`).
</core_state>

  <mechanics>
    - **Record Toggle**: 
      - Click once: Start Web Audio API `MediaRecorder`, change state to `RECORDING`.
      - Click again: Stop recorder, change state to `ANALYZING`, trigger API call.
    - **Reset/Next**: After viewing the result, a "Next Sentence" or "Try Again" action resets the state back to `IDLE`.
  </mechanics>
</state_and_logic>

<ui_implementation>
<layout_structure> 1. **Header**: - Left: Navigation/Back. - Right: Color Mode Toggle, "End Game" button (`bg-terracotta text-white border-2 border-black`).

    2. **Main Session (Bento Grid Central)**:
       - **Prompt Card**: Displays the target sentence prominently.
       - **Action Card**: Centered horizontally. Contains a SINGLE massive toggle button for Record/Stop.
       - **Result Card (Conditional Render)**: Appears only in `RESULT` state, displaying the score and the color-coded sentence.

</layout_structure>

<brutalist_elements> - **Record Toggle Button**: - _Idle_: A massive circle (`w-32 h-32 rounded-full border-4 border-black bg-cream shadow-brutal-md`). Icon: Microphone. - _Recording_: Turns `bg-terracotta`. Icon: A square 'Stop' icon. - _Analyzing_: Turns `bg-lemon` with a loading spinner/icon. Disabled state. - **Color-Coded Text Feedback**: - Render the sentence by mapping over `wordDetails`. - Green (Perfect): `text-green-600 font-bold`. - Yellow (Almost): `text-yellow-500 font-bold`. - Red (Incorrect): `text-red-500 font-bold underline decoration-wavy decoration-red-500`. - **Percentage Display**: Massive typography (`text-7xl font-black`) inside the Result Card.
</brutalist_elements>

  <modals>
    Neo-Brutalist popup style (`border-4 border-black rounded-bento shadow-brutal-lg bg-cream z-50`).
    - **Confirm Exit Modal**: "Are you sure you want to end the session?" -> Resume / Confirm.
    - **Summary Modal**:
      - Displays: Total attempts (`totalAttempts`), and Average Pronunciation Accuracy (`Math.round(cumulativeScore / totalAttempts)%`).
      - Action: "Return to Dashboard".
  </modals>
</ui_implementation>

<animation_physics>
<framer_motion_rules>
Use spring physics (`stiffness: 300, damping: 20`) for all layout shifts and mounts.
</framer_motion_rules>

<specific_animations> - **Recording Pulse**: When `RECORDING`, the giant button scales slightly back and forth (`scale: [1, 1.05, 1]`) on an infinite loop to indicate active listening. - **Analyzing State**: The button spins or shakes gently while awaiting the API response. - **Score Counter**: When displaying the `totalScore`, use Framer Motion to animate the number counting up from `0` to the actual percentage over `1.5` seconds. - **Word Reveal**: The color-coded words in the Result Card appear with a slight stagger (`staggerChildren: 0.05`), sliding up from a masked container.
</specific_animations>
</animation_physics>
