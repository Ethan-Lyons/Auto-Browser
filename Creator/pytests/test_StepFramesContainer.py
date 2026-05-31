import pytest
import tkinter as tk

from Creator.RoutineMaker.Routine import Routine
from Creator.RoutineMaker.RoutineFrame import RoutineFrame
from Creator.RoutineMaker.Steps import Action, ActionGroup, Argument
#import Creator.RoutineMaker.RoutineIO as RoutineIO

@pytest.fixture
def routineEnv():
    """Generates a generic root window, Routine, step frame container, and
    Step Frame for each test"""
    root = tk.Tk()
    routine = Routine()
    rFrame = RoutineFrame(root=root, routine=routine)
    sFsContainer = rFrame.getStepFrameContainer()

    yield routine, sFsContainer

    # Clean up (called after tests)
    root.destroy()

def test_init(routineEnv):
    """Check step frame container creation values are set"""
    _, sFsContainer = routineEnv

    assert type(sFsContainer.frame) == tk.Frame
    assert len(sFsContainer.getStepFrames()) == 1

def test_init_function_types(routineEnv):
    """Check that the injected functions are callable"""
    _, sFsContainer = routineEnv

    assert callable(sFsContainer.routineGetSteps)
    assert callable(sFsContainer.routineCreateStep)
    assert callable(sFsContainer.routineRemoveStep)
    assert callable(sFsContainer.routineMoveStep)

def test_function_return_get(routineEnv):
    """Check that the injected get steps function returns the correct values"""
    _, sFsContainer = routineEnv

    assert isinstance(sFsContainer.routineGetSteps(), list)

def test_function_return_create(routineEnv):
    """Check that the injected create step function returns the correct values"""
    _, sFsContainer = routineEnv

    assert isinstance(sFsContainer.routineCreateStep(), (Action | ActionGroup | Argument))

def test_function_return_move(routineEnv):
    """Check that the injected move step function returns the correct values"""
    _, sFsContainer = routineEnv

    assert sFsContainer.routineMoveStep(0, 0) is None

def test_function_return_remove(routineEnv):
    """Check that the injected remove step function returns the correct values"""
    _, sFsContainer = routineEnv

    assert sFsContainer.routineRemoveStep(0) is None

def test_addStepFrame_len(routineEnv):
    """Check that the step frame container and routine have the correct number of
    steps after adding a step frame"""
    routine, sFsContainer = routineEnv

    sFsContainer.addStepFrame()

    assert len(routine.getSteps()) == 2
    assert len(sFsContainer.getStepFrames()) == 2

def test_addStepFrame_linked(routineEnv):
    """Check that new step frame container steps point to the original routine steps"""
    routine, sFsContainer = routineEnv

    sFsContainer.addStepFrame()

    assert routine.getSteps()[1] is sFsContainer.getStepFrames()[1].getStep()

def test_removeStepFrame(routineEnv):
    """Check that the step frame container and routine have the correct number of
    steps after removing a step frame"""
    routine, sFsContainer = routineEnv

    sFsContainer.addStepFrame()
    sFsContainer.removeStepFrame(sFsContainer.getStepFrames()[1])

    assert len(routine.getSteps()) == 1
    assert len(sFsContainer.getStepFrames()) == 1

def test_removeStepFrame_not_found(routineEnv):
    """Check that trying to remove a step frame that doesn't exist raises an error"""
    _, sFsContainer = routineEnv

    fakeParent = tk.Tk()
    fakeR = Routine()
    fakeRF = RoutineFrame(root=fakeParent, routine=fakeR)
    fakeFrame = fakeRF.getStepFrames()[0]

    sFsContainer.addStepFrame()

    with pytest.raises(ValueError):
        sFsContainer.removeStepFrame(fakeFrame)

def test_moveStep(routineEnv):
    """Check that routine steps are moved as expected by the frame moveStep"""
    routine, sFsContainer = routineEnv

    sFsContainer.addStepFrame()
    [sFrame1, sFrame2] = sFsContainer.getStepFrames()
    sFsContainer.moveStepFrame(sFrame2, -1)

    assert routine.getSteps() == [sFrame2.getStep(), sFrame1.getStep()]

def test_moveStep_bounds(routineEnv):
    """Check that steps frames will stop moving when reaching the edge of a list"""
    routine, sFsContainer = routineEnv

    sFsContainer.addStepFrame()
    sFsContainer.addStepFrame()
    [sFrame1, sFrame2, sFrame3] = sFsContainer.getStepFrames()
    sFsContainer.moveStepFrame(sFrame2, 2)

    assert routine.getSteps() == [sFrame1.getStep(), sFrame3.getStep(), sFrame2.getStep()]

def test_moveStep_zero(routineEnv):
    """Check that order is unaffected when moving a frame 0 indexes"""
    routine, sFsContainer = routineEnv

    sFsContainer.addStepFrame()
    [sFrame1, sFrame2] = sFsContainer.getStepFrames()
    sFsContainer.moveStepFrame(sFrame2, 0)

    assert routine.getSteps() == [sFrame1.getStep(), sFrame2.getStep()]

def test_getStepFrames_add(routineEnv):
    """Check that getStepFrames returns the correct step frames for the routine after adding a step frame"""
    routine, sFsContainer = routineEnv

    sFsContainer.addStepFrame()

    assert routine.getSteps() == [sFrame.getStep() for sFrame in sFsContainer.getStepFrames()]

def test_getStepFrames_empty(routineEnv):
    """Check that getStepFrames returns the correct step frames for the routine when all steps are removed"""
    _, sFsContainer = routineEnv

    sFsContainer.removeStepFrame(sFsContainer.getStepFrames()[0])

    assert sFsContainer.getStepFrames() == []