import tkinter as tk
from Creator.RoutineMaker.Steps import Action, ActionGroup, Argument

def createDefLabel(parent: tk.Frame, text: str):
    label = tk.Label(parent, text=text, justify="left", anchor="w", wraplength=400, font=("Arial", 12, "normal"))
    return label

def buildFrameList(parent: tk.Frame, step: Action | ActionGroup | Argument):
        frameList = []
        if step is None:
            return []
        elif isinstance(step, Argument):
            argFrame = argumentHelpFrame(parent, step)
            frameList.append(argFrame)

        elif isinstance(step, Action):
            actFrame = actionHelpFrame(parent, step)
            frameList.append(actFrame)

            for entry in step.getArgs():
                frameList.extend(buildFrameList(actFrame, entry))

        elif isinstance(step, ActionGroup):
            groupFrame = groupHelpFrame(parent, step)
            frameList.append(groupFrame)

            selectFrameList = buildFrameList(parent, step.getSelected())
            frameList.extend(selectFrameList)
        else:
            raise TypeError(f"Unsupported step type: {type(step)}")
        
        return frameList

def argumentHelpFrame(parent: tk.Frame, argStep: Argument):
    argFrame = tk.Frame(parent)
    name = "Name: " + str(argStep.getName())
    value = "Value: " + str(argStep.getValue())
    desc = "Description: \"" + str(argStep.getDescription()) + "\""

    nameLabel = createDefLabel(argFrame, name)
    valueLabel = createDefLabel(argFrame, value)
    descLabel = createDefLabel(argFrame, desc)

    nameLabel.grid(row=0, column=0)
    valueLabel.grid(row=1, column=0)
    descLabel.grid(row=2, column=0)

    return argFrame

def actionHelpFrame(parent: tk.Frame, actStep: Action):
    actFrame = tk.Frame(parent)
    name = "Name: " + str(actStep.getName())
    desc = "Description: \"" + str(actStep.getDescription()) + "\""
    args = actStep.getArgs()

    nameLabel = createDefLabel(actFrame, name)
    descLabel = createDefLabel(actFrame, desc)
    argNames = [a.getName() for a in args]
    argsLabel = createDefLabel(actFrame, "Child Arguments: " + str(argNames))

    nameLabel.grid(row=0, column=0)
    descLabel.grid(row=1, column=0)
    argsLabel.grid(row=2, column=0)

    return actFrame

def groupHelpFrame(parent: tk.Frame, groupStep: ActionGroup):
    groupFrame = tk.Frame(parent)
    name = "Name: " + str(groupStep.getName())
    desc = "Description: \"" + str(groupStep.getDescription()) + "\""
    selected = "Selected: " + str(groupStep.getSelected().getName())
    args = groupStep.getArgs()

    nameLabel = createDefLabel(groupFrame, name)
    descLabel = createDefLabel(groupFrame, desc)
    selectedLabel = createDefLabel(groupFrame, selected)
    argNames = [a.getName() for a in args]
    argsLabel = createDefLabel(groupFrame, "Modes: " + str(argNames))

    nameLabel.grid(row=0, column=0)
    descLabel.grid(row=1, column=0)
    selectedLabel.grid(row=2, column=0)
    argsLabel.grid(row=3, column=0)

    return groupFrame