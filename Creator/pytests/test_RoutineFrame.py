import tkinter
import pytest

from Creator.RoutineMaker.Routine import Routine
from Creator.RoutineMaker.RoutineFrame import RoutineFrame
from Creator.RoutineMaker.StepFrame import StepFrame

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
    assert len(frame.getStepFrames()) == 1
    assert routine.steps[0] is frame.getSteps()[0]

def test_add_frame(routineEnv):
    _, routine, frame = routineEnv

    newBranch = frame.addActionBranch()

    assert len(routine.steps) == 2
    assert len(frame.getSteps()) == 2
    assert len(frame.getStepFrames()) == 2

    assert newBranch.getStep() is routine.steps[1]
    assert newBranch.getStep() is frame.getSteps()[1]

def test_remove_step(routineEnv):
    _, routine, frame = routineEnv

    frame.addActionBranch()

    frame.removeStepFrame(frame.getStepFrames()[1])

    assert len(routine.steps) == 1
    assert len(frame.getSteps()) == 1
    assert len(frame.getStepFrames()) == 1

