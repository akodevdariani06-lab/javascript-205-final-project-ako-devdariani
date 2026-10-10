# AI log

Every request made to an AI assistant while building this project, oldest first.

- AI coding agents such as Command Code add entries here by themselves. The rules are in `AGENTS.md`.
- If you use a chat AI in the browser, add the entry yourself, in the same format.
- Do not edit or delete entries. If you did not use AI, leave this file as it is.

AI აგენტი ყველა თქვენს მოთხოვნას აქ თვითონ წერს. თუ ბრაუზერის ჩატს იყენებთ (ChatGPT, Claude, Gemini), ჩანაწერი იმავე ფორმატით თქვენ დაამატეთ. ჩანაწერებს ნუ შეცვლით და ნუ წაშლით.

Format:

    ### 1 · 2026-10-14 19:42
    **Prompt:**
    > your message, word for word
    **Type:** explain | debug | review | plan | code | refused | other
    **What I did:** one or two sentences.
    **Files changed:** `js/api.js`, or "none"

---

### 1 · 2026-10-10 10:55
**Prompt:**
> look at files inside this folder and answer me what u read
**Type:** other
**What I did:** Read the repository files (README, AGENTS, CLAUDE, GEMINI, .gitignore, AI_LOG, the assignment folder) and summarised what is in them.
**Files changed:** none

### 2 · 2026-10-10 10:57
**Prompt:**
> as rules are set we will work on final project for reciepe book. u will gide me and give me edvices. u will teach me and become my mentor.
**Type:** other
**What I did:** Agreed to mentor the student through the Recipe Book project, explained how we will work, and asked them to start with a plan and the first small step.
**Files changed:** none

### 3 · 2026-10-10 11:03
**Prompt:**
> i connected to main.js dummyjson and created const of total pages. give me advice from what i need to start now?
**Type:** plan
**What I did:** Read main.js and index.html, explained that the next step is to fetch the recipe list and render cards, and asked the student to describe that first function in their own words. Also pointed out the style.css / styles.css name mismatch.
**Files changed:** none

### 4 · 2026-10-10 11:21
**Prompt:**
> is this code right from line 11 to 24?
**Type:** review
**What I did:** Reviewed the student's fetchRecipes function, confirmed the correct parts (skip formula, URL, response.json) and hinted at the typo on the response.ok line instead of fixing it.
**Files changed:** none

### 5 · 2026-10-10 11:40
**Prompt:**
> try/catch goes around the call, because fetchRecipe only fetches and returns the caller decides what to show up when it fails. for renderRecipes - reads data.recipes and if its empty unhides #emptystate. and recipes.map turns each recipe incto cards html and .join glues array into string.
**Type:** review
**What I did:** Reviewed renderRecipes, confirmed the empty-state handling, the B1 card fields and the clean re-render are correct, agreed with putting try/catch around the call, and asked the student to write the init that calls both functions.
**Files changed:** none

### 6 · 2026-10-10 11:56
**Prompt:**
> check the code again and tell me what will be our next step.
**Type:** review
**What I did:** Reviewed the new init function and its try/catch, confirmed Step 1 (fetch + render) is complete, and set out Step 2 (loading and error messages) as the next step with a check question.
**Files changed:** none

### 7 · 2026-10-10 12:42
**Prompt:**
> i wrote a code. please check it and after that i want to commit and push this to my excisting repository
**Type:** review
**What I did:** Reviewed showError and the updated init (loading, error and empty states). Explained that this folder is not a git repository yet, so connecting it to their GitHub repo needs a clone/init step, and explained the git commands instead of running them or writing the commit message.
**Files changed:** none

### 8 · 2026-10-10 12:47
**Prompt:**
> how exactly i must clone, commit and push step by step?
**Type:** explain
**What I did:** Explained the git commands step by step (clone the existing repo, copy the work files in, stage, commit with their own message, push), noted first-time name/email setup and authentication, and left all git actions for the student to run.
**Files changed:** none
