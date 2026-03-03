import tkinter as tk
from Creator.RoutineMaker.Steps import Action
from Creator.RoutineMaker.Steps import ActionGroup
from Creator.RoutineMaker.Steps import Argument
from Creator.RoutineMaker.ButtonFrameFactory import horizontalButtonFrame, ButtonInfo
from typing import Callable
from Creator.RoutineMaker.StepFrameFactory import buildSubStepFrame

class StepFrame:
    """Represents a frame for a step inside a routine frame"""
    def __init__(
        self,
        parent: tk.Frame,
        step: Action | ActionGroup | Argument,
        removeStepFrame: Callable [[StepFrame], None],
        moveStepFrame: Callable [[StepFrame, int], None]
    ):
        # Create the frame
        self.frame = tk.Frame(parent)
        
        # injected behavior
        self.removeStepFrame = removeStepFrame
        self.moveStepFrame = moveStepFrame
        
        # set argument values
        self.parent = parent
        self.step = step

        # mutable values
        self.buttonFrame = None
        self.groupSubFrames = {}
        self.stepFrames = []

        self._build()
    
    def __str__(self):
        return "(Frame for step: " + str(self.step) + ")"
    
    def getFrame(self):
        """Returns the tkinter frame associated with this step frame"""
        return self.frame

    def getStep(self):
        """Returns the step associated with this step frame"""
        return self.step

    def _build(self):
        """Builds and places the argument frame and button frame"""

        self.subStepFrame = buildSubStepFrame(
            self.step,
            self.frame,
            self.onGroupChange,
            self.storeGroupSubFrame
        )
        self.buttonFrame = self.buildButtonFrame(self.frame)
        
        self.subStepFrame.grid(row=0, column=0, sticky="NSEW")
        self.buttonFrame.grid(row=0, column=2, sticky="NSEW")

    def onGroupChange(self, group: ActionGroup, groupFrame: tk.Frame, selectStepStr: str):
        oldSubFrame = self.groupSubFrames.get(group)
        if oldSubFrame:
            oldSubFrame.destroy()

        selectStep = group.get(selectStepStr)
        group.setSelected(selectStep)

        newSub = buildSubStepFrame(
            group.getSelected(),
            groupFrame,
            self.onGroupChange,
            self.storeGroupSubFrame
        )
        newSub.grid(row=0, column=2)

        self.groupSubFrames[group] = newSub
    
    def storeGroupSubFrame(self, group, subframe):
        self.groupSubFrames[group] = subframe

    def destroy(self):
        """Destroys the tkinter frame associated with this action frame"""
        self.frame.destroy()
    
    def buildButtonFrame(self, parentFrame: tk.Frame):
        """Builds and returns a frame containing buttons for moving and managing a step frame"""
        upButtonInfo = ButtonInfo("↑", lambda: self.moveStepFrame(self, -1))
        downButtonInfo = ButtonInfo("↓", lambda: self.moveStepFrame(self, 1))
        removeButtonInfo = ButtonInfo("X", lambda: self.removeStepFrame(self))

        bFrame = horizontalButtonFrame(parentFrame, [upButtonInfo, downButtonInfo, removeButtonInfo])
        return bFrame
    
    """def _buildSubStepFrame(self, currentStep: Argument | Action | ActionGroup, parent: tk.Frame):
        
        subStepFrame = tk.Frame(parent)

        # does this have any effect?
        currentColumn = 0

        if isinstance(currentStep, Argument):         # Argument
            argFrame = self._buildArgumentFrame(subStepFrame, currentStep)
            argFrame.grid(row=0, column=currentColumn, sticky="NSEW")
            currentColumn += 1

        elif isinstance(currentStep, Action):         # Action
            aFrame = self._buildActionFrame(subStepFrame, currentStep)
            aFrame.grid(row=0, column=currentColumn, sticky="NSEW")
            currentColumn += 1

        elif isinstance(currentStep, ActionGroup):    # ActionGroup
            gFrame = self._buildGroupFrame(subStepFrame, currentStep)
            gFrame.grid(row=0, column=currentColumn)
            currentColumn += 1

        else:                                           # Unknown
            print("Unknown input type for getArgsFrame: " + str(currentStep) + ", Type: " + str(type(currentStep)))
        
        return subStepFrame
    
    def _buildArgumentFrame(self, parentFrame: tk.Frame, argument: Argument):

        sFrame = tk.Frame(parentFrame)

        # Label
        labelText = argument.getName()
        tk.Label(sFrame, text=labelText).grid(row=0, column=0)
        
        # Check if argument has a value that can be set (requires an entry box)
        if argument.getHasValue():
            var = tk.StringVar()    # tracks inputs and updates argument value to match
            var.trace_add("write", lambda name, index, mode, a=argument, v=var: a.setValue(v.get()))
            argEntry = tk.Entry(sFrame, textvariable=var)

            argEntry.grid(row=0, column=1, sticky="NSEW")

            # restore arg value if already set
            argValue = argument.getValue()
            if argValue:    
                var.set(argValue)

        return sFrame


    def _buildActionFrame(self, parentFrame: tk.Frame, action: Action):

        aFrame = tk.Frame(parentFrame)
        labelText = action.getName()
        tk.Label(aFrame, text=labelText).grid(row=0, column=0)

        argList = action.getArgs()
        column = 1
        if argList is not None:
            for subArg in argList:
                subFrame = self.buildSubStepFrame(subArg, aFrame)
                subFrame.grid(row=0, column=column, sticky="NSEW")
                column += 1

        return aFrame

    def _buildGroupFrame(self, pFrame: tk.Frame, group: ActionGroup):

        newFrame = tk.Frame(pFrame)
        stepStrList = [a.getName() for a in group.getArgs()]
        initial = group.getSelected().getName()

        labelText = group.getName()
        dropDown = self._getDropDown(entryList=stepStrList,
                                    pFrame=newFrame,
                                    name=labelText,
                                    callback=lambda selectedName:
                                        self._updateActionGroupFrame(group=group, gFrame=newFrame, newSelectedName=selectedName),
                                    initial=initial)
        dropDown.grid(row=0, column=0)

        subFrame = self.buildSubStepFrame(group.getSelected(), newFrame)
        subFrame.grid(row=0, column=1)

        self.groupSubFrames[group] = subFrame

        return newFrame
    
    def _getDropDown(self, entryList: list, pFrame: tk.Frame, name: str, callback: Callable [[str], None] = lambda x: print("Default callback called"), initial=None):

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
    
"""