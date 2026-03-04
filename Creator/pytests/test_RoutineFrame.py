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

def test_getSteps(routineEnv):
    """Check that getSteps returns the same steps as the routine"""
    _, routine, rFrame, _ = routineEnv

    assert routine.getSteps() == rFrame.getSteps()

def test_getStepFrames(routineEnv):
    """Check that getStepFrames returns the correct step frames for the routine"""
    _, routine, rFrame, _ = routineEnv

    assert routine.getSteps() == [sFrame.getStep() for sFrame in rFrame.getStepFrames()]

def test_getFrame(routineEnv):
    """Check that getFrame returns the correct frame"""
    _, _, rFrame, _ = routineEnv

    assert rFrame.getFrame() is rFrame.frame

def test_getRoutine(routineEnv):
    """Check that getRoutine returns the correct routine"""
    _, routine, rFrame, _ = routineEnv

    assert rFrame.getRoutine() is routine

def test_frameSave(routineEnv):
    """Check that a routine frame can be saved and loaded"""
    _, _, rFrame, _ = routineEnv

    filePath = os.path.join(TMP_DIR, "testRoutine.json")

    rFrame.frameSave(filePath)
    assert os.path.exists(filePath)

    # Clean up
    os.remove(filePath)

def test_frame_load(routineEnv):
    """Check that a routine frame can be saved and loaded"""
    _, _, rFrame, _ = routineEnv

    filePath = os.path.join(TMP_DIR, "testRoutine.json")

    newRoutine = Routine(InputOutput)
    newRoutine.createDefStep()
    newRoutine.createDefStep()

    newRoutine.saveRoutine(filePath)

    rFrame.frameLoad(filePath)

    assert len(rFrame.getSteps()) == 2
    assert len(rFrame.getStepFrames()) == 2

    # Clean up
    os.remove(filePath)