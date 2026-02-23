import tkinter as tk
import pytest

from Creator.RoutineMaker.Routine import Routine
from Creator.RoutineMaker.RoutineFrame import RoutineFrame
import Creator.RoutineMaker.InputOutput as InputOutput

import os

# Specifies a folder to be used for storing temporary test output data
FOLDER_NAME = "tmp"
TMP_DIR = os.path.join(os.path.dirname(__file__), FOLDER_NAME)

@pytest.fixture
def routineEnv():
    """Generates a generic root window, Routine, Routine Frame, and
    Step Frame for each test"""
    root = tk.Tk()
    routine = Routine(InputOutput)
    rFrame = RoutineFrame(parent=root, routine=routine)
    sFrame = rFrame.getStepFrames()[0]

    yield root, routine, rFrame, sFrame

    # Clean up (called after tests)
    root.destroy()

def test_init_len(routineEnv):
    """Check that the routine frame has the correct number of steps compared to the routine"""
    _, routine, rFrame, _ = routineEnv

    # Note: routine frames auto create 1 action when the frame is created
    assert len(routine.steps) == 1
    assert len(rFrame.getSteps()) == 1   
    assert len(rFrame.getStepFrames()) == 1

    assert routine.steps[0] is rFrame.getSteps()[0]

def test_init_linked(routineEnv):
    """Check that the routine frame steps point to the routine steps"""
    _, routine, rFrame, _ = routineEnv

    assert routine.steps[0] is rFrame.getSteps()[0]

def test_addStepFrame_len(routineEnv):
    """Check that the routine frame and routine have the correct number of
    steps after adding a step frame"""
    _, routine, rFrame, _ = routineEnv

    newBranch = rFrame.addStepFrame()

    assert len(routine.steps) == 2
    assert len(rFrame.getSteps()) == 2
    assert len(rFrame.getStepFrames()) == 2

def test_addStepFrame_linked(routineEnv):
    """Check that new routine frame steps point to the original routine steps"""
    _, routine, rFrame, _ = routineEnv

    newBranch = rFrame.addStepFrame()

    assert routine.steps[1] is rFrame.getSteps()[1]

def test_removeStepFrame(routineEnv):
    """Check that the routine frame and routine have the correct number of
    steps after removing a step frame"""
    _, routine, rFrame, _ = routineEnv

    rFrame.addStepFrame()

    rFrame.removeStepFrame(rFrame.getStepFrames()[1])

    assert len(routine.steps) == 1
    assert len(rFrame.getSteps()) == 1
    assert len(rFrame.getStepFrames()) == 1

def test_removeStepFrame_not_found(routineEnv):
    """Check that removing a step frame that is not in the routine frame does not modify the routine or routine frame"""
    _, routine, rFrame, _ = routineEnv

    # Obtain a step frame not related to the original routine
    fakeParent = tk.Tk()
    fakeR = Routine(InputOutput)
    fakeRF = RoutineFrame(parent=fakeParent, routine=fakeR)
    fakeFrame = fakeRF.getStepFrames()[0]

    rFrame.removeStepFrame(fakeFrame)

    assert len(routine.steps) == 1
    assert len(rFrame.getSteps()) == 1
    assert len(rFrame.getStepFrames()) == 1

def test_frameSave(routineEnv):
    """Check that a routine frame can be saved and loaded"""
    _, _, rFrame, _ = routineEnv

    filePath = os.path.join(TMP_DIR, "testRoutine.json")
    rFrame.addStepFrame()

    rFrame.frameSave(filePath)
    assert os.path.exists(filePath)

    # Clean up
    os.remove(filePath)

def test_frame_load(routineEnv):
    """Check that a routine frame can be saved and loaded"""
    _, _, rFrame, _ = routineEnv

    filePath = os.path.join(TMP_DIR, "testRoutine.json")
    rFrame.addStepFrame()

    newRoutine = Routine(InputOutput)
    newRoutine.createDefStep()
    newRoutine.createDefStep()

    newRoutine.saveRoutine(filePath)

    rFrame.frameLoad(filePath)

    assert len(rFrame.getSteps()) == 2
    assert len(rFrame.getStepFrames()) == 2

    os.remove(filePath)

def test_moveStep(routineEnv):
    """Check that routine steps are moved as expected by the frame moveStep"""
    _, routine, rFrame, sFrame1 = routineEnv

    sFrame2 = rFrame.addStepFrame()
    rFrame.moveStep(sFrame2, -1)

    assert routine.getSteps() == [sFrame2.getStep(), sFrame1.getStep()]

def test_moveStep_bounds(routineEnv):
    """Check that steps frames will stop moving when reaching the edge of a list"""
    _, routine, rFrame, sFrame1 = routineEnv

    sFrame2 = rFrame.addStepFrame()
    sFrame3 = rFrame.addStepFrame()

    rFrame.moveStep(sFrame2, 2)

    assert routine.getSteps() == [sFrame1.getStep(), sFrame3.getStep(), sFrame2.getStep()]

def test_moveStep_zero(routineEnv):
    """Check that order is unaffected when moving a frame 0 indexes"""
    _, routine, rFrame, sFrame = routineEnv

    rFrame.moveStep(sFrame, 0)

    assert routine.getSteps() == [sFrame.getStep()]

def test_getSteps(routineEnv):
    """Check that getSteps returns the same steps as the routine"""
    _, routine, rFrame, _ = routineEnv

    assert routine.getSteps() == rFrame.getSteps()

def test_getSteps_add(routineEnv):
    """Check that getSteps returns the same steps as the routine after adding a step frame"""
    _, routine, rFrame, _ = routineEnv

    rFrame.addStepFrame()

    assert routine.getSteps() == rFrame.getSteps()

def test_getSteps_empty(routineEnv):
    """Check that getSteps returns the same steps as the routine when all steps are removed"""
    _, _, rFrame, _ = routineEnv

    rFrame.removeStepFrame(rFrame.getStepFrames()[0])

    assert rFrame.getSteps() == []

def test_getStepFrames(routineEnv):
    """Check that getStepFrames returns the correct step frames for the routine"""
    _, routine, rFrame, _ = routineEnv

    assert routine.getSteps() == [sFrame.getStep() for sFrame in rFrame.getStepFrames()]

def test_getStepFrames_add(routineEnv):
    """Check that getStepFrames returns the correct step frames for the routine after adding a step frame"""
    _, routine, rFrame, _ = routineEnv

    rFrame.addStepFrame()

    assert routine.getSteps() == [sFrame.getStep() for sFrame in rFrame.getStepFrames()]

def test_getStepFrames_empty(routineEnv):
    """Check that getStepFrames returns the correct step frames for the routine when all steps are removed"""
    _, _, rFrame, _ = routineEnv

    rFrame.removeStepFrame(rFrame.getStepFrames()[0])

    assert rFrame.getStepFrames() == []

def test_getFrame(routineEnv):
    """Check that getFrame returns the correct frame"""
    _, _, rFrame, _ = routineEnv

    assert rFrame.getFrame() is rFrame.frame

def test_getRoutine(routineEnv):
    """Check that getRoutine returns the correct routine"""
    _, routine, rFrame, _ = routineEnv

    assert rFrame.getRoutine() is routine