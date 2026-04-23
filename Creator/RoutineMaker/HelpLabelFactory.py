import tkinter as tk
from Creator.RoutineMaker.Steps import Action, ActionGroup, Argument

def createDefLabel(parent: tk.Frame, text: str):
    """Creates a label with the given text

    Args:
        parent (tk.Frame): The parent frame to add the label to
        text (str): The text to display in the label

    Returns:
        tk.Label: The created label
    """
    label = tk.Label(parent, text=text, justify="left", anchor="w", wraplength=400, font=("Arial", 12, "normal"))
    return label

def buildFrameList(parent: tk.Frame, step: Action | ActionGroup | Argument):
        """Builds a list of frames for the given step and its substeps

        Args:
            parent (tk.Frame): The parent frame to add the frames to
            step (Action | ActionGroup | Argument): The step to build frames for

        Returns:
            List[tk.Frame]: A list of frames for the given step and its substeps
        """        
        frameList = []

        # Base case
        if step is None:
            return []
        
        elif isinstance(step, Argument):
            # Create argument frame and add to list
            argFrame = argumentHelpFrame(parent, step)
            frameList.append(argFrame)

        elif isinstance(step, Action):
            # Create action frame and add to list
            actFrame = actionHelpFrame(parent, step)
            frameList.append(actFrame)

            # Create frames for each substep and add to list
            for entry in step.getArgs():
                frameList.extend(buildFrameList(actFrame, entry))

        elif isinstance(step, ActionGroup):
            # Create group frame and add to list
            groupFrame = groupHelpFrame(parent, step)
            frameList.append(groupFrame)

            # Create frames for each substep and add to list
            selectFrameList = buildFrameList(parent, step.getSelected())
            frameList.extend(selectFrameList)

        else:
            raise TypeError(f"Unsupported step type: {type(step)}")
        
        return frameList

def argumentHelpFrame(parent: tk.Frame, argStep: Argument):
    """Builds a frame for the given argument step

    Args:
        parent (tk.Frame): The parent frame to add the frames to
        argStep (Argument): The argument step to build a frame for

    Returns:
        tk.Frame: A frame for the given argument step
    """
    # Create frame
    argFrame = tk.Frame(parent)

    # Create display strings
    name = "Name: " + str(argStep.getName())
    value = "Value: " + str(argStep.getValue())
    desc = "Description: \"" + str(argStep.getDescription()) + "\""

    # Create labels
    nameLabel = createDefLabel(argFrame, name)
    valueLabel = createDefLabel(argFrame, value)
    descLabel = createDefLabel(argFrame, desc)

    # Layout labels
    nameLabel.grid(row=0, column=0)
    valueLabel.grid(row=1, column=0)
    descLabel.grid(row=2, column=0)

    return argFrame

def actionHelpFrame(parent: tk.Frame, actStep: Action):
    """Builds a frame for the given action step

    Args:
        parent (tk.Frame): The parent frame to add the frames to
        actStep (Action): The action step to build a frame for

    Returns:
        tk.Frame: A frame for the given action step
    """
    # Create frame
    actFrame = tk.Frame(parent)

    # Create display strings
    name = "Name: " + str(actStep.getName())
    desc = "Description: \"" + str(actStep.getDescription()) + "\""
    argNames = [a.getName() for a in actStep.getArgs()]
    args = "Child Arguments: " + str(argNames)

    # Create labels
    nameLabel = createDefLabel(actFrame, name)
    descLabel = createDefLabel(actFrame, desc)
    argsLabel = createDefLabel(actFrame, args)

    # Layout labels
    nameLabel.grid(row=0, column=0)
    descLabel.grid(row=1, column=0)
    argsLabel.grid(row=2, column=0)

    return actFrame

def groupHelpFrame(parent: tk.Frame, groupStep: ActionGroup):
    """Builds a frame for the given group step

    Args:
        parent (tk.Frame): The parent frame to add the frames to
        groupStep (ActionGroup): The group step to build a frame for

    Returns:
        tk.Frame: A frame for the given group step
    """
    # Create frame
    groupFrame = tk.Frame(parent)

    # Create display strings
    name = "Name: " + str(groupStep.getName())
    desc = "Description: \"" + str(groupStep.getDescription()) + "\""
    selected = "Selected: " + str(groupStep.getSelected().getName())
    argNames = [a.getName() for a in groupStep.getArgs()]
    args = "Modes: " + str(argNames)

    # Create labels
    nameLabel = createDefLabel(groupFrame, name)
    descLabel = createDefLabel(groupFrame, desc)
    selectedLabel = createDefLabel(groupFrame, selected)
    argsLabel = createDefLabel(groupFrame, args)

    # Layout labels
    nameLabel.grid(row=0, column=0)
    descLabel.grid(row=1, column=0)
    selectedLabel.grid(row=2, column=0)
    argsLabel.grid(row=3, column=0)

    return groupFrame