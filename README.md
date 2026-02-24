# Website-Interact

> A modular, full-stack web automation framework built from scratch.
>
> Website-Interact separates **routine creation (Python)** from **routine execution (JavaScript)**, demonstrating cross-language architecture, factory patterns, interpreter design, and automated testing across two runtimes.

---

## Overview

Website-Interact is a custom-built automation framework designed to:

- Programmatically define structured web interactions into a formalized routine
- Interpret and execute those routines inside a live browser context
- Provide modular, extensible step logic structures
- Support automated testing in both Python and JavaScript environments

This project was fully designed and implemented by me as a portfolio demonstration of:

- Software architecture design
- Factory and Interpreter patterns
- Cross-language system integration
- Cross-system compatability
- Test-driven development
- Modular automation tooling

---

## Architecture

The system is intentionally divided into two layers:

---

### 1. Creator (Python)

Responsible for building structured routines.

Key characteristics:
- Modular step definitions
- Factory-based step creation
- GUI components for user-friendly and structured routine building
- Separate visualization and data modification functionality
- Creator-wide extensive pytest coverage

Core responsibilities:
- Define steps
- Validate arguments
- Construct routine objects
- Export structured routine data
- Create interactive GUI components
- Sync data between visual elements and back-end data

### Testing:
pytest Creator
or
npm run test:py

---

### 2. Interpreter (JavaScript)

Responsible for executing routines in a browser environment.

Key characteristics:
- Interpreter-style execution flow
- Modular WebHelpers
- Conditional execution support (If / For / While)
- Jest-based unit testing
- CLI entry point

Core execution modules include:
- Browser interaction
- DOM querying
- Click actions
- Keyboard input
- Assertions
- Screenshot handling
- Tab and navigation management
- Conditional logic blocks

### Testing:
npm run test:js

---

### Testing (Both Layers):
npm run test

---

## Technology Stack

**Python (Creator Layer)**
- Python (3.11+)
- pytest

**JavaScript (Interpreter Layer)**
- Node.js
- Jest

---

## Installation

### Python Environment
pip install -r requirements.txt

### NodeJS Environment
npm install

---

## Why This Project Matters (Portfolio Context)

This project demonstrates:

- End-to-end system design
- Multi-language architecture
- Strong modular decomposition
- Clean separation of concerns
- Automated testing across ecosystems
- Extensible automation tooling

It is intentionally designed as a reusable automation framework rather than a single-use script.

---

## Potential Extensions

- Headless browser integration
- JSON schema validation for routines
- CI pipeline integration
- Web UI for routine management
- Plugin system for custom step types
- Distributed execution layer

---

## Status

Actively developed and structured for extensibility.

---

## License

(Insert preferred license here)

---

## Author

Built and maintained by Ethan Lyons