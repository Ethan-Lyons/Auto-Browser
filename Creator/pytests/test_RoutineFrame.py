import tkinter as tk
import pytest

from Creator.RoutineMaker.Routine import Routine
from Creator.RoutineMaker.RoutineFrame import RoutineFrame
from Creator.RoutineMaker.StepFrame import StepFrame
import Creator.RoutineMaker.InputOutput as InputOutput

import os

FOLDER_NAME = "tmp"
TMP_DIR = os.path.join(os.path.dirname(__file__), FOLDER_NAME)

@pytest.fixture
def routineEnv():
    root = tk.Tk()
    routine = Routine(InputOutput)
    rFrame = RoutineFrame(parent=root, routine=routine)
    sFrame = rFrame.getStepFrames()[0]

    yield root, routine, rFrame, sFrame

    root.destroy()

def test_init(routineEnv):
    _, routine, rFrame, _ = routineEnv

    assert len(routine.steps) == 1
    assert len(rFrame.getSteps()) == 1   # Routine frames will create 1 action on creation
    assert len(rFrame.getStepFrames()) == 1
    assert routine.steps[0] is rFrame.getSteps()[0]

def test_addStepBranch(routineEnv):
    _, routine, rFrame, _ = routineEnv

    newBranch = rFrame.addStepFrame()

    assert len(routine.steps) == 2
    assert len(rFrame.getSteps()) == 2
    assert len(rFrame.getStepFrames()) == 2

    assert newBranch.getStep() is routine.steps[1]
    assert newBranch.getStep() is rFrame.getSteps()[1]

def test_removeStepFrame(routineEnv):
    _, routine, rFrame, _ = routineEnv

    rFrame.addStepFrame()

    rFrame.removeStepFrame(rFrame.getStepFrames()[1])

    assert len(routine.steps) == 1
    assert len(rFrame.getSteps()) == 1
    assert len(rFrame.getStepFrames()) == 1

def test_removeStepFrame_not_found(routineEnv):
    _, routine, rFrame, _ = routineEnv

    fakeParent = tk.Tk()
    fakeR = Routine(InputOutput)
    fakeRF = RoutineFrame(parent=fakeParent, routine=fakeR)
    fakeFrame = fakeRF.getStepFrames()[0]

    rFrame.removeStepFrame(fakeFrame)

    assert len(routine.steps) == 1
    assert len(rFrame.getSteps()) == 1
    assert len(rFrame.getStepFrames()) == 1

def test_frameSave(routineEnv):
    _, routine, rFrame, _ = routineEnv

    filePath = os.path.join(TMP_DIR, "testRoutine.json")
    rFrame.addStepFrame()

    rFrame.frameSave(filePath)
    assert os.path.exists(filePath)
    os.remove(filePath)

def test_frame_load(routineEnv):
    _, _, rFrame, _ = routineEnv

    filePath = os.path.join(TMP_DIR, "testRoutine.json")
    rFrame.addStepFrame()

    newRoutine = Routine(InputOutput)
    newRoutine.createDefaultAG()
    newRoutine.createDefaultAG()

    newRoutine.saveRoutine(filePath)

    rFrame.frameLoad(filePath)

    assert len(rFrame.getSteps()) == 2
    assert len(rFrame.getStepFrames()) == 2

    os.remove(filePath)

def test_moveStep(routineEnv):
    _, routine, rFrame, sFrame1 = routineEnv

    sFrame2 = rFrame.addStepFrame()
    rFrame.moveStep(sFrame2, -1)

    assert routine.getSteps() == [sFrame2.getStep(), sFrame1.getStep()]

def test_moveStep_bounds(routineEnv):
    _, routine, rFrame, sFrame1 = routineEnv

    sFrame2 = rFrame.addStepFrame()
    sFrame3 = rFrame.addStepFrame()

    rFrame.moveStep(sFrame2, 2)

    assert routine.getSteps() == [sFrame1.getStep(), sFrame3.getStep(), sFrame2.getStep()]

def test_moveStep_zero(routineEnv):
    _, routine, rFrame, sFrame = routineEnv

    rFrame.moveStep(sFrame, 0)

    assert routine.getSteps() == [sFrame.getStep()]

def test_getSteps(routineEnv):
    _, routine, rFrame, _ = routineEnv

    assert routine.getSteps() == rFrame.getSteps()

def test_getSteps_add(routineEnv):
    _, routine, rFrame, _ = routineEnv

    rFrame.addStepFrame()

    assert routine.getSteps() == rFrame.getSteps()

def test_getSteps_empty(routineEnv):
    _, routine, rFrame, _ = routineEnv

    rFrame.removeStepFrame(rFrame.getStepFrames()[0])

    assert routine.getSteps() == []
    assert rFrame.getSteps() == []

def test_getStepFrames(routineEnv):
    _, routine, rFrame, _ = routineEnv

    assert routine.getSteps() == [sFrame.getStep() for sFrame in rFrame.getStepFrames()]

def test_getStepFrames_add(routineEnv):
    _, routine, rFrame, _ = routineEnv

    rFrame.addStepFrame()

    assert routine.getSteps() == [sFrame.getStep() for sFrame in rFrame.getStepFrames()]

def test_getStepFrames_empty(routineEnv):
    _, routine, rFrame, _ = routineEnv

    rFrame.removeStepFrame(rFrame.getStepFrames()[0])

    assert rFrame.getStepFrames() == []

def test_getFrame(routineEnv):
    _, _, rFrame, _ = routineEnv

    assert rFrame.getFrame() == rFrame.frame
    assert type(rFrame.getFrame()) == tk.Frame

def test_getRoutine(routineEnv):
    _, routine, rFrame, _ = routineEnv

    assert rFrame.getRoutine() == routine
