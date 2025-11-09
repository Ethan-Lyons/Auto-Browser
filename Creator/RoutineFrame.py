import tkinter
from ActionFrame import ActionFrame

class RoutineFrame():
    def __init__(self, parent, routine):
        self.parent = parent
        self.frame = tkinter.Frame(parent)
        self.actionsFrameContainer = None
        self.routine = routine
        self.actionFrames = []
        self.frame.grid(row=0, column=0)
        self._buildFrame()


    def _buildFrame(self):
        """
        Builds and places the save, load, and add buttons, as well as the
        container for the action frames. Also adds a default branch to the routine object if empty.
        """
        if len(self.routine.getBranches()) == 0:
            self.routine.createActionBranch()
        self.actionsFrameContainer = self._buildAFContainer()   # create frames

        self.addButton = tkinter.Button(self.frame, text="+",
                                        command=self.addActionBranch)       # create control buttons
        self.saveButton = tkinter.Button(self.frame, text="Save", command=lambda: self.frameSave())
        self.loadButton = tkinter.Button(self.frame, text="Load", command=lambda: self.frameLoad())
        
        self.actionsFrameContainer.grid(row=0, column=0)    # place frames and buttons
        self.addButton.grid(row=0, column=1)
        self.saveButton.grid(row=1, column=0)
        self.loadButton.grid(row=1, column=1)
    
    def frameSave(self):
        """Saves the routine to a file."""
        self.routine.saveRoutine()
    
    def frameLoad(self):
        """
        Loads a routine from a file and rebuilds the action frames accordingly.
        This function will destroy the existing action frames and rebuild the list from the loaded routine.
        """
        self.routine.loadRoutine()  # load the routine from file and remove previous frames
        self.actionsFrameContainer.destroy()
        self.actionFrames = []

        self.actionsFrameContainer = self._buildAFContainer()   # re-build the frame
        self.actionsFrameContainer.grid(row=0, column=0)
    
    def _buildAFContainer(self):
        """
        Builds and returns a frame containing all the action frames for the branches in the routine.
        """
        actionsFrameContainer = tkinter.Frame(self.frame)
        self.actionFrames = []
        actionBranchList = self.routine.getBranches()

        for currentBranch in actionBranchList:  # create each action frame
            newFrame = self._createActionFrame(currentBranch, actionsFrameContainer)
            self.actionFrames.append(newFrame)
            
        return actionsFrameContainer
    
    def addActionBranch(self):
        """
        Creates a new action branch in the routine and creates a new action frame for it.
        
        Returns:
            The new ActionFrame object for the created action branch.
        """
        newBranch = self.routine.createActionBranch()
        newFrame = self._createActionFrame(newBranch, parent=self.actionsFrameContainer)
        self.actionFrames.append(newFrame)
        return newFrame
    
    def _createActionFrame(self, action, parent):
        """
        Creates a new ActionFrame for the given action and adds it to the container frame under the routine frame.
        
        Args:
            action (Action): The action for which to create the action frame
            parent (Frame): The parent frame in which to place the action frame
        Returns:
            The new ActionFrame object.
        """
        actionFrame = ActionFrame(routineFrame=self, action=action, parent=parent)
        frame = actionFrame.getFrame()
        frame.grid(row=len(self.actionFrames), column=0)
        return actionFrame
    
    def moveAction(self, actionFrame, offset):
        """
        Moves an action frame to a new position in the routine frame's list, given by the offset.
        Also moves the action in the routine object accordingly.
        
        Args:
            actionFrame (ActionFrame): The action frame to be moved
            offset (int): The offset of the new position from the current position
        """
        actionIndex = self.routine.getIndex(actionFrame.getAction())    # update action list in routine
        self.routine.moveAction(actionIndex, actionIndex + offset)

        actionFrameIndex = self.actionFrames.index(actionFrame)       # update actionFrames list in routineFrame
        popFrame = self.actionFrames.pop(actionFrameIndex)
        self.actionFrames.insert(actionIndex + offset, popFrame)

        self.reorderActionFrames()  # updates frames to match
    
    def reorderActionFrames(self):
        """
        Updates the action frames in the frame container to match their
        index in the list of action frames.
        """
        currentRow = 0
        for actionFrame in self.actionFrames:
            actionFrame.getFrame().grid(row=currentRow, column=0)
            currentRow += 1

    def removeActionBranch(self, actionFrame):
        """
        Removes an action branch from the routine and the frame from the list of action frames.
        
        Args: 
            actionFrame (ActionFrame): The ActionFrame object to be removed.
        """
        self.routine.removeAction(actionFrame.getAction())
        self.actionFrames.remove(actionFrame)
        actionFrame.destroy()
    
    def getBranches(self):
        """Returns the list of action branches in the routine."""
        return self.routine.getBranches()
    
    def getActionFrames(self):
        """Returns the list of action frames under the routine frame."""
        return self.actionFrames
    
    def getFrame(self):
        """Returns the tkinter frame associated with this routine frame."""
        return self.frame
    
    def getRoutine(self):
        """Returns the routine object associated with this routine frame."""
        return self.routine

    