# Website-Interact

> A modular, full-stack web automation framework built from scratch.
>
> Website-Interact separates **routine creation (Python)** from **routine execution (JavaScript)**, demonstrating cross-language architecture, factory patterns, interpreter design, and automated testing across two runtimes.

---

## Overview

Website-Interact is a custom-built automation framework designed to:

- Programmatically define structured web interaction routines
- Serialize routines into an executable format
- Interpret and execute those routines inside a browser context
- Provide modular, extensible step logic
- Support automated testing in both Python and JavaScript environments

This project was fully designed and implemented by me as a portfolio demonstration of:

- Software architecture design
- Factory and Interpreter patterns
- Cross-language system integration
- Test-driven development
- Modular automation tooling

---

## Architecture

The system is intentionally divided into two layers:

### 1. Creator (Python)

Responsible for building structured routines.

Key characteristics:
- Modular step definitions
- Factory-based step creation
- GUI components for structured routine building
- Strong pytest coverage
- Separation of step metadata from execution logic

Core responsibilities:
- Define steps
- Validate arguments
- Construct routine objects
- Export structured routine data

Testing:
pytest Creator/pytests


---

### 2. Interpreter (JavaScript)

Responsible for executing routines in a browser environment.

Key characteristics:
- StepFactory pattern
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

Run tests:
npm test


---

## Design Patterns Used

- Factory Pattern (StepFactory implementations)
- Interpreter Pattern (RoutineInterpreter)
- Modular Command-like step execution
- Separation of construction and execution layers
- Structured test architecture in both runtimes

---

## Technology Stack

**Python (Creator Layer)**
- Python 3.11+
- pytest

**JavaScript (Interpreter Layer)**
- Node.js
- Jest
- Modular CommonJS architecture

---

## Installation

### Python Environment
pip install -r requirements.txt

### Node Environment
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

Built and maintained by [Your Name]