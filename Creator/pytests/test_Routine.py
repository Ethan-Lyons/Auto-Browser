"""class Routine:
    def __init__(self, inputOutput=None):
        self.inputOutput = inputOutput  # gives access to the InputOutput class functions
        self.AB = UserActionBuilder()
        self.userActionGroup = self.AB.getUserActionGroup()
        self.steps = []

    def __str__(self):
        routineDict = {"actions": [self.inputOutput.actionsToDict(b) for b in self.steps]}
        return "[Routine: " + str(routineDict) + "]"
    
    def saveRoutine(self, filePath=None):

        self.inputOutput.saveRoutine(self, filePath)
    
    # Returns a bool indicating if the routine has been updated
    def loadRoutine(self, filePath=None):

        newRoutine = self.inputOutput.loadRoutine(filePath)
        if newRoutine:
            self.steps = newRoutine.getSteps()
            return True
        return False

    def addStep(self, action):
        self.steps.append(action)
    
    def removeAction(self, action):
        self.steps.remove(action)

    def createDefaultAG(self):

        defaultCopy = self._createUserAGCopy()
        self.steps.append(defaultCopy)
        return defaultCopy
    
    def _createUserAGCopy(self):
        defaultType = self.userActionGroup.copy()
        return defaultType
    
    def getActionFromName(self, name):
        return self.AB.getActionFromName(name)
    
    def getIndex(self, action):

        if action not in self.steps:
            print("Action not found in routine: " + str(action))
            return -1
        return self.steps.index(action)

    def getSteps(self):
        return self.steps
    
    def getActionFromIndex(self, index):
        return self.steps[index]
    
    def removeByIndex(self, index):
        return self.steps.pop(index)
    
    def moveAction(self, actionIndex, toIndex):
        moved_action = self.steps.pop(actionIndex)
        self.steps.insert(toIndex, moved_action)

    def replaceAction(self, oldAction, newAction):
        try:
            index = self.steps.index(oldAction)
            self.steps[index] = newAction
        except ValueError:
            print(f"Action {oldAction} not found in routine.")
"""

