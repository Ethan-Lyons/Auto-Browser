# TODO: move action step frame, action group step frame / dropdown, argument step frame creation to here

import tkinter as tk
from Creator.RoutineMaker.Steps import Action, ActionGroup, Argument
from typing import Callable


def buildSubStepFrame(step, parent, onGroupChange: Callable[[ActionGroup, tk.Frame, str], None], storeSubFrame: Callable[[ActionGroup, tk.Frame], None]):
    # Create the frame
    frame = tk.Frame(parent)

    # Build the subframe
    if isinstance(step, Argument):
        sub = buildArgumentFrame(frame, step)

    elif isinstance(step, Action):
        sub = buildActionFrame(frame, step, onGroupChange, storeSubFrame)

    elif isinstance(step, ActionGroup):
        sub = buildGroupFrame(frame, step, onGroupChange, storeSubFrame)

    else:
        raise TypeError(f"Unsupported step type: {type(step)}")

    # Add the subframe
    sub.grid(row=0, column=0, sticky="NSEW")
    return frame


def buildArgumentFrame(parent, argument):
    # Create the frame
    frame = tk.Frame(parent)

    # Label
    tk.Label(frame, text=argument.getName()).grid(row=0, column=0)

    # Entry box
    if argument.getHasValue():
        var = tk.StringVar()

        def sync_var(*_):
            argument.setValue(var.get())

        var.trace_add("write", sync_var)

        entry = tk.Entry(frame, textvariable=var)
        entry.grid(row=0, column=1)

        if argument.getValue():
            var.set(argument.getValue())

    return frame


def buildActionFrame(parent, action, onGroupChange: Callable[[ActionGroup, tk.Frame, str], None], storeSubFrame: Callable[[ActionGroup, tk.Frame], None]):
    # Create the frame
    frame = tk.Frame(parent)

    # Label
    tk.Label(frame, text=action.getName()).grid(row=0, column=0)

    # Subframes
    col = 1
    for arg in action.getArgs() or []:
        # Build subframe
        sub = buildSubStepFrame(arg, frame, onGroupChange, storeSubFrame)

        # Add subframe
        sub.grid(row=0, column=col)
        col += 1

    return frame

def buildGroupFrame(parent, group, onGroupChange: Callable[[ActionGroup, tk.Frame, str, bool], None], storeSubFrame: Callable[[ActionGroup, tk.Frame], None]):
    # Create the frame
    frame = tk.Frame(parent)

    # Label
    tk.Label(frame, text=group.getName() + ":").grid(row=0, column=0)

    # Dropdown values
    options = [a.getName() for a in group.getArgs()]
    selected = tk.StringVar(value=group.getSelected().getName())

    # Create dropdown
    dropdown = tk.OptionMenu(
        frame,
        selected,
        *options,
        command=lambda name:
            onGroupChange(group, frame, name)
    )

    # Add dropdown
    dropdown.grid(row=0, column=1)

    # Build and add subframe
    sub = buildSubStepFrame(group.getSelected(), frame, onGroupChange, storeSubFrame)
    sub.grid(row=0, column=2)

    # Store subframe
    storeSubFrame(group, sub)

    return frame