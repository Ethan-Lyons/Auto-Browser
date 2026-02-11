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

from Creator.RoutineMaker.Routine import Routine
from Creator.RoutineMaker.Steps import ActionGroup
from Creator.RoutineMaker.Steps import Action
from Creator.RoutineMaker.Steps import Argument

import pytest as pytest

def test_init():
    routine = Routine()
    assert routine.steps == []

def test_add_step():
    routine = Routine()
    new_action = routine.createDefaultAG()
    assert len(routine.steps) == 1
    assert routine.steps[0] == new_action

def test_remove_step():
    routine = Routine()
    newAction = routine.createDefaultAG()
    routine.removeStep(newAction)
    assert len(routine.steps) == 0

def test_get_steps():
    routine = Routine()
    action1 = routine.createDefaultAG()
    action2 = routine.createDefaultAG()
    assert routine.getSteps() == [action1, action2]

def test_move_step():
    routine = Routine()
    action1 = routine.createDefaultAG()
    action2 = routine.createDefaultAG()
    routine.moveAction(0, 1)
    assert routine.getSteps() == [action2, action1]