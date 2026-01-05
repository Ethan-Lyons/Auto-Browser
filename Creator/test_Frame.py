import tkinter
import pytest

from Routine import Routine
from RoutineFrame import RoutineFrame
from ActionFrame import ActionFrame

@pytest.fixture
def routineEnv():
    root = tkinter.Tk()
    routine = Routine()
    frame = RoutineFrame(parent=root, routine=routine)

    yield root, routine, frame

    root.destroy()

def test_init(routineEnv):
    _, routine, frame = routineEnv

    assert len(routine.steps) == 1
    assert len(frame.getSteps()) == 1   # Routine frames will create 1 action on creation
    assert len(frame.getActionFrames()) == 1
    assert routine.steps[0] is frame.getSteps()[0]

def test_add_frame(routineEnv):
    _, routine, frame = routineEnv

    newBranch = frame.addActionBranch()

    assert len(routine.steps) == 2
    assert len(frame.getSteps()) == 2
    assert len(frame.getActionFrames()) == 2

    assert newBranch.getAction() is routine.steps[1]
    assert newBranch.getAction() is frame.getSteps()[1]

def test_remove_action(routineEnv):
    _, routine, frame = routineEnv

    frame.addActionBranch()

    frame.removeActionBranch(frame.getActionFrames()[1])

    assert len(routine.steps) == 1
    assert len(frame.getSteps()) == 1
    assert len(frame.getActionFrames()) == 1

