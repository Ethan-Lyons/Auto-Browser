import tkinter as tk
from ButtonFrame import ButtonFrame
from Steps import Action
from Steps import ActionGroup
from Steps import Argument

class ActionFrame:
    def __init__(self, routineFrame, action, parent):
        self.routine = routineFrame.getRoutine()
        self.routineFrame = routineFrame
        self.parent = parent
        self.action = action
        self.buttonFrame = None
        self.groupFrames = {}

        self.frame = tk.Frame(self.parent)
        self._buildFrame()
    
    def __str__(self):
        return "(Frame for action: " + str(self.action) + ")"
    
    def getFrame(self):
        """Returns the tkinter frame associated with this action frame"""
        return self.frame

    def getAction(self):
        """Returns the action associated with this action frame"""
        return self.action

    def _buildFrame(self):
        """Builds and places the argument frame and button frame"""
        self.argsF = self.getArgsFrame(self.action, self.frame)
        self.buttonFrame = self.getButtonFrame()
        
        self.argsF.grid(row=0, column=0, columnspan=2)
        self.buttonFrame.grid(row=0, column=2)
    
    def getArgsFrame(self, currentAction, parent):
        """Builds and returns a frame containing the sub-entries for the given action.

        Args:
            currentAction (Argument or Action or ActionGroup): The action for which to build the argument frame
            parent (Frame): The parent frame to which the argument frame should be added

        Returns:
            A frame containing the argument entries for the given action
        """
        argsFrame = tk.Frame(parent)
        currentColumn = 0

        if isinstance(currentAction, Argument):         # Argument
            sFrame = self.buildArgumentFrame(argsFrame, currentAction)
            sFrame.grid(row=0, column=currentColumn)
            currentColumn += 1
        elif isinstance(currentAction, Action):         # Action
            aFrame = self.buildActionFrame(argsFrame, currentAction)
            aFrame.grid(row=0, column=currentColumn)
            currentColumn += 1
        elif isinstance(currentAction, ActionGroup):    # ActionGroup
            gFrame = self.buildGroupFrame(argsFrame, currentAction)
            gFrame.grid(row=0, column=currentColumn)
            currentColumn += 1
        else:                                           # Unknown
            print("Unknown input type for getArgsFrame: " + str(currentAction) + ", Type: " + str(type(currentAction)))
        
        return argsFrame
    
    def buildArgumentFrame(self, parentFrame, argument):
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
        
        tk.Label(sFrame, text=argument).grid(row=0, column=0)
        argEntry.grid(row=0, column=1)

        argValue = argument.getValue()
        if argValue:    #restore arg value if already set
            argEntry.insert(0, argValue)

        return sFrame


    def buildActionFrame(self, parentFrame, actionArg):
        
        """Builds and returns a frame containing a label with the action name and associated sub-frames for the action's arguments.

        Args:
            parentFrame (Frame): The parent frame to which the action frame should be added
            actionArg (Action): The action whose arguments should be displayed

        Returns:
            A frame containing the action name and associated sub-frames.
        """
        aFrame = tk.Frame(parentFrame)
        tk.Label(aFrame, text=str(actionArg)).grid(row=0, column=0)

        argList = actionArg.getArgs()
        column = 1
        if argList is not None:
            for subArg in argList:
                subFrame = self.getArgsFrame(subArg, aFrame)
                subFrame.grid(row=0, column=column)
                column += 1

        return aFrame

    def buildGroupFrame(self, pFrame, group):
        """
        Builds and returns a frame containing a dropdown menu and a subframe for the currently
        selected action in the given action group.

        Args:
            pFrame (Frame): The parent frame to which the group frame should be added
            group (ActionGroup): The action group to build the frame for

        Returns:
            A frame containing a dropdown menu and a subframe for the currently selected action
        """
        gFrame = tk.Frame(pFrame)
        actionStrList = [str(a) for a in group.getActions()]
        initial = str(group.getSelected())

        groupDD = self.getDropDown(entryList=actionStrList, pFrame=gFrame,
                                    name=str(group),
                                    callback=lambda selectedName:
                                        self.updateActionGroupFrame(group=group, gFrame=gFrame, newStrSelection=selectedName),
                                    initial=initial)
        groupDD.grid(row=0, column=0)

        subFrame = self.getArgsFrame(group.getSelected(), gFrame)
        subFrame.grid(row=0, column=1)

        self.groupFrames[group] = subFrame

        return gFrame

    
    def updateActionGroupFrame(self, group, gFrame, newStrSelection):
        """
        Updates the frame associated with a given action group when a
        new action is selected in the dropdown menu.

        Args:
            group (ActionGroup): The action group whose frame should be updated
            gFrame (Frame): The parent frame associated with the action group
            newStrSelection (str): The string name of the newly selected action in the dropdown menu
        """
        newSelection = group.findAction(actionName=newStrSelection)
        group.setSelected(newSelection)

        oldFrame = self.groupFrames[group]   # Destroy old args subframe
        oldFrame.destroy()

        newFrame = self.getArgsFrame(group.getSelected(), gFrame)    # Build and grid new subframe
        newFrame.grid(row=0, column=1)

        self.groupFrames[group] = newFrame  # Store frame reference for deletion operation

    
    def getDropDown(self, entryList, pFrame, name="Type", callback=lambda: print("Default dropdown callback"), initial=None):
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
        entryList = [str(e) for e in entryList]
        if initial is None:
            initial = str(entryList[0])
        else:
            initial = str(initial)

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
        if not self.buttonFrame:
            newFrame = ButtonFrame(parent=self.frame, moveFunction=self.buttonMove, manageFunction=self.buttonManage)
        return newFrame.getFrame()

    def buttonMove(self, moveType):
        """Handles the result of pressing a move button for this action frame"""
        offset = 0
        if moveType == "UP":
            offset = -1
        elif moveType == "DOWN":
            offset = 1
        self.routineFrame.moveAction(actionFrame=self, offset=offset)
    
    def buttonManage(self, manageType):
        """Handles the result of pressing a manage button for this action frame"""
        if manageType == "REMOVE":
            self.routineFrame.removeActionFrame(self)

    def destroy(self):
        """Destroys the tkinter frame associated with this action frame"""
        self.frame.destroy()