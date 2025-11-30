import unittest
from Routine import Routine
from Action import ActionGroup
from Action import Action
from Action import Argument
from RoutineFrame import RoutineFrame
from ActionFrame import ActionFrame
import InputOutput
import os

class TestRoutine(unittest.TestCase):
    def test_save(self):
        initialDir = os.path.join(os.path.dirname(__file__), "Routines")
        filePath = os.path.join(initialDir, "testRoutine.json")
        routine = Routine(inputOutput=InputOutput)
        routine.createDefaultAG()
        routine.saveRoutine(filePath)
        assert os.path.exists(filePath)
        os.remove(filePath)

    def test_load(self):
        testArg = Argument("test")
        testArg.setValue("testValue")
        testAction = Action(name="Action Name", args=[testArg], description="Action Description")
        testGroup = ActionGroup(name="Group Name", args=[testAction], description="Group Description")

        initialDir = os.path.join(os.path.dirname(__file__), "Routines")
        filePath = os.path.join(initialDir, "testRoutine.json")
        originalRoutine = Routine(inputOutput=InputOutput)
        originalRoutine.addStep(testGroup)
        originalRoutine.saveRoutine(filePath)

        blankRoutine = Routine(inputOutput=InputOutput)
        blankRoutine.loadRoutine(filePath)
        
        self.assertEqual(str(originalRoutine), str(blankRoutine))

        originalRoutine.createDefaultAG()
        self.assertNotEqual(str(originalRoutine), str(blankRoutine))

        os.remove(filePath)
        

if __name__ == '__main__':
    unittest.main()