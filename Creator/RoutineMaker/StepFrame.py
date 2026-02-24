import tkinter as tk
from Creator.RoutineMaker.ButtonFrame import ButtonFrame
from Creator.RoutineMaker.Steps import Action
from Creator.RoutineMaker.Steps import ActionGroup
from Creator.RoutineMaker.Steps import Argument
from Creator.RoutineMaker import RoutineFrame

class StepFrame:
    """Represents a frame for a step inside a routine frame"""
    def __init__(self, routineFrame: RoutineFrame, step: Action | ActionGroup | Argument, parent: tk.Frame):
        """
        Initializes an ActionFrame object.

        Args:
            routineFrame (RoutineFrame): The routine frame which contains this action frame
            action (Action or ActionGroup): The action or action group for this action frame
            parent (Frame): The parent frame for this action frame
        """
        self.routine = routineFrame.getRoutine()
        self.routineFrame = routineFrame
        self.parent = parent
        self.step = step
        self.buttonFrame = None
        self.groupFrames = {}

        self.rootContainer = tk.Frame(self.parent)
        self._buildFrame()
    
    def __str__(self):
        return "(Frame for step: " + str(self.step) + ")"
    
    def getFrame(self):
        """Returns the tkinter frame associated with this step frame"""
        return self.rootContainer

    def getStep(self):
        """Returns the step associated with this step frame"""
        return self.step

    def _buildFrame(self):
        """Builds and places the argument frame and button frame"""
        self.subStepFrame = self.buildSubStepFrame(self.step, self.rootContainer)
        self.buttonFrame = self.getButtonFrame()
        
        self.subStepFrame.grid(row=0, column=0)
        self.buttonFrame.grid(row=0, column=2)
    
    def buildSubStepFrame(self, currentStep: Argument | Action | ActionGroup, parent: tk.Frame):
        """Builds and returns a frame containing the sub-entries for the given step.

        Args:
            currentAction (Argument or Action or ActionGroup): The action for which to build the argument frame
            parent (Frame): The parent frame to which the argument frame should be added

        Returns:
            A frame containing the argument entries for the given action
        """
        subStepFrame = tk.Frame(parent)
        currentColumn = 0

        if isinstance(currentStep, Argument):         # Argument
            argFrame = self.buildArgumentFrame(subStepFrame, currentStep)
            argFrame.grid(row=0, column=currentColumn)
            currentColumn += 1

        elif isinstance(currentStep, Action):         # Action
            aFrame = self.buildActionFrame(subStepFrame, currentStep)
            aFrame.grid(row=0, column=currentColumn)
            currentColumn += 1

        elif isinstance(currentStep, ActionGroup):    # ActionGroup
            gFrame = self.buildGroupFrame(subStepFrame, currentStep)
            gFrame.grid(row=0, column=currentColumn)
            currentColumn += 1

        else:                                           # Unknown
            print("Unknown input type for getArgsFrame: " + str(currentStep) + ", Type: " + str(type(currentStep)))
        
        return subStepFrame
    
    def buildArgumentFrame(self, parentFrame: tk.Frame, argument: Argument):
        """Builds and returns a frame containing a single entry for the given argument.
        The frame contains a label and an entry for the argument.

        Args:
            parentFrame (Frame): The parent frame to which the argument frame should be added
            argument (Argument): The argument for which to build the frame

        Returns:
            A frame containing a single entry for the given argument
        """
        sFrame = tk.Frame(parentFrame)
        
        var = tk.StringVar()    # tracks inputs and updates argument value to match
        var.trace_add("write", lambda name, index, mode, a=argument, v=var: a.setValue(v.get()))
        argEntry = tk.Entry(sFrame, textvariable=var)
        
        labelText = argument.getName()
        tk.Label(sFrame, text=labelText).grid(row=0, column=0)
        argEntry.grid(row=0, column=1)

        argValue = argument.getValue()
        if argValue:    #restore arg value if already set
            var.set(argValue)

        return sFrame


    def buildActionFrame(self, parentFrame: tk.Frame, action: Action):
        
        """Builds and returns a frame containing a label with the action name and associated sub-frames for the action's arguments.

        Args:
            parentFrame (Frame): The parent frame to which the action frame should be added
            actionArg (Action): The action whose arguments should be displayed

        Returns:
            A frame containing the action name and associated sub-frames.
        """
        aFrame = tk.Frame(parentFrame)
        labelText = action.getName()
        tk.Label(aFrame, text=labelText).grid(row=0, column=0)

        argList = action.getArgs()
        column = 1
        if argList is not None:
            for subArg in argList:
                subFrame = self.buildSubStepFrame(subArg, aFrame)
                subFrame.grid(row=0, column=column)
                column += 1

        return aFrame

    def buildGroupFrame(self, pFrame: tk.Frame, group: ActionGroup):
        """
        Builds and returns a frame containing a dropdown menu and a subframe for the currently
        selected action in the given action group.

        Args:
            pFrame (Frame): The parent frame to which the group frame should be added
            group (ActionGroup): The action group to build the frame for

        Returns:
            A frame containing a dropdown menu and a subframe for the currently selected action
        """
        newFrame = tk.Frame(pFrame)
        stepStrList = [a.getName() for a in group.getArgs()]
        initial = group.getSelected().getName()

        labelText = group.getName()
        dropDown = self.getDropDown(entryList=stepStrList,
                                    pFrame=newFrame,
                                    name=labelText,
                                    callback=lambda selectedName:
                                        self.updateActionGroupFrame(group=group, gFrame=newFrame, newSelectedName=selectedName),
                                    initial=initial)
        dropDown.grid(row=0, column=0)

        subFrame = self.buildSubStepFrame(group.getSelected(), newFrame)
        subFrame.grid(row=0, column=1)

        self.groupFrames[group] = subFrame

        return newFrame

    
    def updateActionGroupFrame(self, group: ActionGroup, gFrame: tk.Frame, newSelectedName: str):
        """
        Updates the frame associated with a given action group when a
        new action is selected in the dropdown menu.

        Args:
            group (ActionGroup): The action group whose frame should be updated
            gFrame (Frame): The parent frame associated with the action group
            newStrSelection (str): The string name of the newly selected action in the dropdown menu
        """
        newSelection = group.get(newSelectedName)
        group.setSelected(newSelection)

        oldFrame = self.groupFrames[group]   # Destroy old args subframe
        oldFrame.destroy()

        newFrame = self.buildSubStepFrame(group.getSelected(), gFrame)    # Build and grid new subframe
        newFrame.grid(row=0, column=1)

        self.groupFrames[group] = newFrame  # Store frame reference for deletion operation
    
    def getDropDown(self, entryList: list, pFrame: tk.Frame, name="Type", callback=lambda x: print("Default callback called"), initial=None):
        """
        Builds and returns a frame containing a dropdown menu (OptionMenu) and a label.

        Args:
            entryList (list): List of options for the dropdown menu
            pFrame (Frame): The parent frame to which the dropdown frame should be added
            name (str): Text for the label. Defaults to "Type"
            callback (function): The callback function to be called when an option is selected in the dropdown menu. Defaults to a function that prints a message indicating that the default callback was called.
            initial: The initial value of the dropdown menu. Defaults to the first element of the entryList.

        Returns:
            A frame containing a dropdown menu and a label
        """
        dropDownFrame = tk.Frame(pFrame)

        # Already using names here, no need to convert again
        if initial is None:
            initial = entryList[0]

        initialValue = tk.StringVar(value=initial)
        dropBox = tk.OptionMenu(
            dropDownFrame,
            initialValue,
            *entryList,
            command=callback
        )
        
        tk.Label(dropDownFrame, text=name + ": ").grid(row=0, column=0)
        dropBox.grid(row=0, column=1)
        return dropDownFrame

    def getButtonFrame(self):
        """Returns the frame containing the move and manage buttons for this action frame"""
        if self.buttonFrame is None:
            bf = ButtonFrame(parent=self.rootContainer, moveFunction=self.buttonMove, manageFunction=self.buttonManage)
            self.buttonFrame = bf.getFrame()
        return self.buttonFrame

    def buttonMove(self, moveType: str):
        """Handles the result of pressing a move button for this action frame"""
        moveType = moveType.upper()
        offset = 0

        if moveType == "UP":
            offset = -1
        elif moveType == "DOWN":
            offset = 1
        else:
            raise Exception("Unknown move type: " + moveType)

        self.routineFrame.moveStep(self, offset)
    
    def buttonManage(self, manageType: str):
        """Handles the result of pressing a manage button for this action frame"""
        manageType = manageType.upper()

        if manageType == "REMOVE":
            self.routineFrame.removeStepFrame(self)
        else:
            raise Exception("Unknown manage type: " + manageType)

    def destroy(self):
        """Destroys the tkinter frame associated with this action frame"""
        self.rootContainer.destroy()