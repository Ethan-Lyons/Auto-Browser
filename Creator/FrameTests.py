import unittest
from Routine import Routine
from RoutineFrame import RoutineFrame
from ActionFrame import ActionFrame
import tkinter

class TestRoutine(unittest.TestCase):
    def test_init(self):
        root = tkinter.Tk()
        routine = Routine()
        routineFrame = RoutineFrame(parent=root, routine=routine)
        self.assertEqual(len(routine.steps), 1)
        self.assertEqual(len(routineFrame.getSteps()), 1)
        self.assertEqual(routine.steps[0], routineFrame.getSteps()[0])
        root.destroy()

    def test_add_action(self): 
        root = tkinter.Tk()
        routine = Routine()
        routine.createDefaultAG()
        routineFrame = RoutineFrame(parent=root, routine=routine)
        self.assertEqual(len(routine.steps), 1)
        self.assertEqual(len(routineFrame.getSteps()), 1)
        self.assertEqual(routine.steps[0], routineFrame.getSteps()[0])
        root.destroy()

    def test_add_frame(self):
        root = tkinter.Tk()
        routine = Routine()
        routineFrame = RoutineFrame(parent=root, routine=routine)
        newBranch = routineFrame.addActionBranch()
        self.assertEqual(len(routine.steps), 2)
        self.assertEqual(len(routineFrame.getSteps()), 2)
        self.assertEqual(routine.steps[1], routineFrame.getSteps()[1])
        self.assertEqual(str(newBranch.getAction()), str(routineFrame.getSteps()[1]))
        self.assertIn(newBranch.getAction(), routineFrame.getSteps())
        self.assertEqual(newBranch.getAction(), routineFrame.getSteps()[1])
        root.destroy()
    
    def test_remove_action(self):
        root = tkinter.Tk()
        routine = Routine()
        routine.createDefaultAG()
        routineFrame = RoutineFrame(parent=root, routine=routine)
        self.assertEqual(len(routine.steps), 1)
        self.assertEqual(len(routineFrame.getSteps()), 1)

    def test_remove_frame(self):
        root = tkinter.Tk()
        routine = Routine()
        routineFrame = RoutineFrame(parent=root, routine=routine)
        newBranch = routineFrame.addActionBranch()
        self.assertEqual(len(routine.steps), 2)
        self.assertEqual(str(routine.steps[1]), str(newBranch.getAction()))
        self.assertEqual(str(routineFrame.getSteps()[1]), str(newBranch.getAction()))
        self.assertEqual(len(routineFrame.getSteps()), 2)

        #self.assertEqual(routineFrame.getActions()[1], newBranch.getAction())
        self.assertEqual(newBranch.getAction(), routine.steps[1])
        routineFrame.removeActionBranch(newBranch)
        self.assertEqual(len(routine.steps), 1)
        self.assertEqual(len(routineFrame.getSteps()), 1)
        root.destroy()

if __name__ == '__main__':
    unittest.main()