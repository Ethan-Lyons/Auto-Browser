import unittest
from Routine import Routine
from Action import ActionGroup
from Action import Action
from Action import Argument

class TestRoutine(unittest.TestCase):
    def test_init(self):
        routine = Routine()
        self.assertEqual(routine.steps, [])

    def test_add_action(self):
        routine = Routine()
        newAction = routine.createDefaultAG()
        self.assertEqual(len(routine.steps), 1)
        self.assertEqual(routine.steps[0], newAction)

    def test_remove_action(self):
        routine = Routine()
        newAction = routine.createDefaultAG()
        routine.removeAction(newAction)
        self.assertEqual(len(routine.steps), 0)

    def test_get_actions(self):
        routine = Routine()
        action1 = routine.createDefaultAG()
        action2 = routine.createDefaultAG()
        self.assertEqual(routine.getSteps(), [action1, action2])

    def test_move_action(self):
        routine = Routine()
        action1 = routine.createDefaultAG()
        action2 = routine.createDefaultAG()
        routine.moveAction(0, 1)
        self.assertEqual(routine.getSteps(), [action2, action1])
    
    def test_argument_copy(self):
        argument = Argument("test")
        argument.setValue("testValue")
        argument2 = argument.copy()
        self.assertEqual(argument, argument2)
        self.assertEqual(argument.getValue(), argument2.getValue())
        self.assertEqual(argument.getDescription(), argument2.getDescription())
        self.assertNotEqual(id(argument), id(argument2))
    
    def test_argument_setValue(self):
        argument = Argument("test")
        argument.setValue("testValue")
        self.assertEqual(argument.getValue(), "testValue")
    
    def test_action_copy(self):
        action = Action(name="test", args=[Argument("testArg")], description="testDescription")
        action2 = action.copy()

        self.assertEqual(str(action), str(action2))
        self.assertEqual(action.getArgs(), action2.getArgs())
        self.assertEqual(action.getDescription(), action2.getDescription())

        self.assertNotEqual(id(action), id(action2))
        self.assertNotEqual(id(action.getArgs()[0]), id(action2.getArgs()[0]))
        self.assertNotEqual(id(action.getArgs()), id(action2.getArgs()))
    
    def test_action_group_copy(self):
        testAction = Action(name="Action Name", args=[Argument("testArg")], description="Action Description")
        actionGroup = ActionGroup(name="Group Name", args=[testAction], description="Group Description")
        actionGroup2 = actionGroup.copy()

        self.assertEqual(str(actionGroup), str(actionGroup2))
        self.assertEqual(len(actionGroup.getArgs()), len(actionGroup2.getArgs()))
        self.assertEqual(actionGroup.getDescription(), actionGroup2.getDescription())

        self.assertNotEqual(id(actionGroup), id(actionGroup2))
        self.assertNotEqual(actionGroup.getArgs(), actionGroup2.getArgs())
        self.assertNotEqual(id(actionGroup.getArgs()), id(actionGroup2.getArgs()))
        self.assertNotEqual(id(actionGroup.getArgs()[0]), id(actionGroup2.getArgs()[0]))


    def test_find_action_in_group(self):
        testName = "ActionName"
        testAction = Action(name=testName, args=[Argument("testArg")], description="Action Description")
        actionGroup = ActionGroup(name="GroupName", args=[testAction], description="Group Description")
        self.assertEqual(actionGroup.find("WrongName"), None)
        self.assertEqual(str(actionGroup.find(testName)), str(testAction))
        self.assertEqual(actionGroup.find(testName), testAction)

    def test_set_value_in_action_group(self):
        testName = "ActionName"
        testArg = Argument("testArg")
        testAction = Action(name=testName, args=[testArg])
        subGroup1 = ActionGroup(name="Group1", args=[testAction])
        subGroup2 = ActionGroup(name="Group2", args=[testAction])
        subGroup3 = subGroup1.copy()
        self.assertEqual(subGroup1.getArgs()[0], subGroup2.getArgs()[0])
        self.assertNotEqual(subGroup1.getArgs()[0], subGroup3.getArgs()[0])
        subGroup1.getArgs()[0].getArgs()[0].setValue("testValue")
        self.assertEqual(str(subGroup1.getArgs()[0].getArgs()[0].getValue()), "testValue")
        self.assertNotEqual(str(subGroup1.getArgs()[0].getArgs()[0].getValue()), 
                            str(subGroup3.getArgs()[0].getArgs()[0].getValue()))
    
    def test_set_value(self):
        argument = Argument("xpath")
        selectors = ActionGroup(name="Selectors", args=[argument])
        action1 = Action(name="Action1", args=[selectors])
        action2 = Action(name="Action2", args=[selectors])
        userGroup = ActionGroup(name="User Group", args=[action1, action2])

        userCopy = userGroup.copy()

        setSelector = userCopy.getArgs()[0].getArgs()[0]
        setArg = setSelector.getArgs()[0]
        unsetSelector = userCopy.getArgs()[1].getArgs()[0]
        unsetArg = unsetSelector.getArgs()[0]

        self.assertNotEqual(setSelector, unsetSelector)
        setSelector.getArgs()[0].setValue("testValue")
        self.assertNotEqual(str(setArg.getValue()), str(unsetArg.getValue()))

if __name__ == '__main__':
    unittest.main()