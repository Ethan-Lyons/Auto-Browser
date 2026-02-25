# Auto-Browser

> A modular, full-stack web automation framework built from scratch.
>
> Website-Interact separates **routine creation (Python)** from **routine execution (JavaScript)**, demonstrating cross-language architecture, factory patterns, interpreter design, and automated testing across multiple runtimes.

---

## Overview

Website-Interact is a structured automation framework designed to:

- Define web interactions as formalized routines
- Execute those routines inside a live Chromium-based browser
- Support modular, extensible step definitions
- Maintain state and custom variables across execution
- Provide conditional and iterative control flow
- Maintain automated test coverage across both Python and JavaScript layers

This project was fully designed and implemented by me as a portfolio demonstration of:

- Software architecture design
- Interpreter & Factory design patterns
- Cross-runtime system coordination
- GUI-driven structured data generation
- State management within execution engines
- Test-driven development across ecosystems

---

# Architecture

The system is intentionally divided into two independent layers.

---

## 1. Creator (Python Layer)

The **Creator** is responsible for constructing structured automation routines.

It provides a GUI interface for building routines in a controlled, validated format.

### Responsibilities

- Define and validate step structures
- Enforce argument requirements
- Construct routine objects
- Manage internal routine state
- Synchronize GUI components with backend data
- Export structured routine files for execution

### Key Characteristics

- Factory-based step construction
- Modular step definitions
- Separation of visualization and data logic
- Extensive pytest coverage

### Run Tests (Python)

```bash
pytest Creator
```

or

```bash
npm run test:py
```

---

## 2️2. Interpreter (JavaScript Layer)

The **Interpreter** executes structured routines inside a live browser context.

It connects to a Chromium-based browser via remote debugging and evaluates routine steps sequentially.

### Responsibilities

- Interpret structured step definitions
- Map steps to executable helper modules
- Maintain execution stack state
- Manage stored variables
- Handle asynchronous browser navigation
- Execute conditional and iterative blocks

### Key Characteristics

- Interpreter-style execution engine
- StepFactory mapping system
- Modular WebHelpers
- Conditional logic support (`IF`, `FOR`, `WHILE`)
- CLI execution mode
- Jest-based test coverage

### Run Tests (JavaScript)

```bash
npm run test:js
```

### Run All Tests

```bash
npm run test
```

---

# Technology Stack

### Python Layer
- Python 3.11+
- pytest

### JavaScript Layer
- Node.js
- Jest

---

# Getting Started

---

## 1. Browser Setup (Required)

A Chromium-based browser is required:
- Chrome
- Edge
- Brave
- Other Chromium builds

The browser must be launched with a remote debugging port.

### Recommended Method (Shortcut)

Add this flag to your browser shortcut:

```
--remote-debugging-port=9222
```

### Command Line Launch (Example: Chrome)

```bash
"C:\Program Files\Google\Chrome\Application\chrome.exe" --remote-debugging-port=9222
```

---

## 2. Installation

### Python

```bash
pip install -r requirements.txt
```

### Node.js

```bash
npm install
```

---

# Running the System

---

## Running the Creator (Primary Entry Point)

```bash
python RunCreatorApp.py
```

The GUI allows you to:

- Add steps
- Reorder steps
- Delete steps
- Save routines
- Load routines
- Execute routines directly
- Inspect available step types

### GUI Example

![Creator GUI Screenshot](/docs/images/creator_gui.png)

---

## Running the Interpreter Directly (CLI Mode)

Navigate into the Interpreter directory:

```bash
cd Interpreter
```

Then execute:

```bash
node CLI.js path/to/yourRoutine.json
```

This runs an existing routine file without launching the Creator.

---

# Additional Tools

---

## Steps Guide

Run:

```bash
python RunStepsGuide.py
```

StepsGuide provides:

- A hierarchical view of all available step types
- Required arguments for each step
- Detailed descriptions of step behavior

![Steps Guide Placeholder](/docs/images/steps_guide.png)

---

## Debug Outputs

After routine execution:

- `stack.log` → Execution stack changes
- `variables.log` → Stored variables from last run
- `OutputFiles/` → Screenshots and file outputs

---

# Examples

---

# Example 1: Basic Search Automation
[Example Routine JSON](/docs/routines/example_1.json)

**Goal:** Open Google and perform a search.

![Example Routine Screenshot](/docs/images/example_1.png)

### Routine Steps

1. `NEW_TAB`
2. `URL_NAV` → `google.com`
3. `KEYBOARD` → `TYPE_TEXT`
   - text: `"Hello World!"`
   - delay_ms: `(optional)`
   - `SET_FOCUS` → `FIND`
     - selector mode: `aria`
     - value: `[role="combobox"]`
4. `KEYBOARD` → `SHORTCUT`
   - key: `Enter`
   - `WAIT_FOR_NAV` → `True`
   - `SET_FOCUS` → `SKIP`

### TYPE_TEXT vs SHORTCUT Explained
 - `TYPE_TEXT`: simulates typing a string of characters. (The input 'control' will type out the literal word)
 - `SHORTCUT`: allows the pressing of multiple characters (separated by a space or '+') at the same time, including special characters (Here the input 'control' will press simulate pressing the keyboard control key)

 ### WAIT_FOR_NAV Explained

Since pressing Enter here triggers a navigation to new page, the interpreter must be told pause execution until the new page loads to prevent race conditions.


### SET_FOCUS Explained
`SET_FOCUS` is used to determine what element we want our action to affect.  Our first keyboard action locates the box to type in and focuses it.  Since our first keyboard action just put the element we want into focus, the final action does not need to re-focus it again. (Some `SHORTCUT` actions occur regardless of element focus and these can be skipped as well)

---

# Example 2: Variables and Control Flow

Advanced capabilities include:

### Stored Variables

You can the `STORE` step to store values during execution and reuse them later.

Example:

```
Hello {username}
```

The interpreter resolves `{username}` from its internal variable store before execution.

---

### Conditional Execution

- `IF` ... `ELSE (optional)` ... `END_IF`
- `FOR` ... `END_FOR`
- `WHILE` ... `END_WHILE`

Example usage:

- Loop over number of open tabs
- Execute actions conditionally based on element existence

---

# Internal Execution Model (High-Level)

1. Routine file is parsed
2. StepFactory maps step definitions to executable modules
3. Interpreter processes steps sequentially
4. Execution stack tracks control flow
5. Variable store maintains runtime state
6. Browser actions execute via WebHelpers

---

# Why This Project Matters (Portfolio Context)

This project demonstrates:

- End-to-end system architecture
- Cross-language integration
- Interpreter engine design
- Structured execution control
- Modular extensibility
- Automated testing in two ecosystems
- State management within browser automation

It is designed as a reusable automation framework — not a single-use script.

---

# Potential Extensions

- Headless browser support
- JSON schema validation
- CI integration
- Plugin architecture
- Distributed execution
- Web-based routine editor

---

# Status

Actively developed and structured for extensibility.

---

# Author

Built and maintained by Ethan Lyons