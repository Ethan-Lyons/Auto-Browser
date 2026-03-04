import pytest
import tkinter as tk

from Creator.RoutineMaker.Routine import Routine
from Creator.RoutineMaker.RoutineFrame import RoutineFrame
from Creator.RoutineMaker.Steps import Action, ActionGroup, Argument
import Creator.RoutineMaker.InputOutput as InputOutput

@pytest.fixture
def routineEnv():
    """Generates a generic root window, Routine, step frame container, and
    Step Frame for each test"""
    root = tk.Tk()
    routine = Routine(InputOutput)
    rFrame = RoutineFrame(parent=root, routine=routine)
    sfContainer = rFrame.getStepFrameContainer()

    yield routine, sfContainer

    # Clean up (called after tests)
    root.destroy()

def test_init(routineEnv):
    """Check step frame container creation values are set"""
    _, sfContainer = routineEnv

    assert type(sfContainer.frame) == tk.Frame
    assert len(sfContainer.getStepFrames()) == 1

def test_init_function_types(routineEnv):
    """Check that the injected functions are callable"""
    _, sfContainer = routineEnv

    assert callable(sfContainer.routineGetSteps)
    assert callable(sfContainer.routineCreateStep)
    assert callable(sfContainer.routineRemoveStep)
    assert callable(sfContainer.routineMoveStep)

def test_function_return_get(routineEnv):
    """Check that the injected get steps function returns the correct values"""
    _, sfContainer = routineEnv

    assert isinstance(sfContainer.routineGetSteps(), list)

def test_function_return_create(routineEnv):
    """Check that the injected create step function returns the correct values"""
    _, sfContainer = routineEnv

    assert isinstance(sfContainer.routineCreateStep(), (Action | ActionGroup | Argument))

def test_function_return_move(routineEnv):
    """Check that the injected move step function returns the correct values"""
    _, sfContainer = routineEnv

    assert sfContainer.routineMoveStep(0, 0) is None

def test_function_return_remove(routineEnv):
    """Check that the injected remove step function returns the correct values"""
    _, sfContainer = routineEnv

    assert sfContainer.routineRemoveStep(0) is None

def test_addStepFrame_len(routineEnv):
    """Check that the step frame container and routine have the correct number of
    steps after adding a step frame"""
    routine, sfContainer = routineEnv

    sfContainer.addStepFrame()

    assert len(routine.getSteps()) == 2
    assert len(sfContainer.getStepFrames()) == 2

def test_addStepFrame_linked(routineEnv):
    """Check that new step frame container steps point to the original routine steps"""
    routine, sfContainer = routineEnv

    sfContainer.addStepFrame()

    assert routine.getSteps()[1] is sfContainer.getStepFrames()[1].getStep()

def test_removeStepFrame(routineEnv):
    """Check that the step frame container and routine have the correct number of
    steps after removing a step frame"""
    routine, sfContainer = routineEnv

    sfContainer.addStepFrame()
    sfContainer.removeStepFrame(sfContainer.getStepFrames()[1])

    assert len(routine.getSteps()) == 1
    assert len(sfContainer.getStepFrames()) == 1

def test_removeStepFrame_not_found(routineEnv):
    """Check that trying to remove a step frame that doesn't exist raises an error"""
    _, sfContainer = routineEnv

    fakeParent = tk.Tk()
    fakeR = Routine(InputOutput)
    fakeRF = RoutineFrame(parent=fakeParent, routine=fakeR)
    fakeFrame = fakeRF.getStepFrames()[0]

    sfContainer.addStepFrame()

    with pytest.raises(ValueError):
        sfContainer.removeStepFrame(fakeFrame)

def test_moveStep(routineEnv):
    """Check that routine steps are moved as expected by the frame moveStep"""
    routine, sfContainer = routineEnv

    sfContainer.addStepFrame()
    [sFrame1, sFrame2] = sfContainer.getStepFrames()
    sfContainer.moveStepFrame(sFrame2, -1)

    assert routine.getSteps() == [sFrame2.getStep(), sFrame1.getStep()]

def test_moveStep_bounds(routineEnv):
    """Check that steps frames will stop moving when reaching the edge of a list"""
    routine, sfContainer = routineEnv

    sfContainer.addStepFrame()
    sfContainer.addStepFrame()
    [sFrame1, sFrame2, sFrame3] = sfContainer.getStepFrames()
    sfContainer.moveStepFrame(sFrame2, 2)

    assert routine.getSteps() == [sFrame1.getStep(), sFrame3.getStep(), sFrame2.getStep()]

def test_moveStep_zero(routineEnv):
    """Check that order is unaffected when moving a frame 0 indexes"""
    routine, sfContainer = routineEnv

    sfContainer.addStepFrame()
    [sFrame1, sFrame2] = sfContainer.getStepFrames()
    sfContainer.moveStepFrame(sFrame2, 0)

    assert routine.getSteps() == [sFrame1.getStep(), sFrame2.getStep()]

def test_getStepFrames_add(routineEnv):
    """Check that getStepFrames returns the correct step frames for the routine after adding a step frame"""
    routine, sfContainer = routineEnv

    sfContainer.addStepFrame()

    assert routine.getSteps() == [sFrame.getStep() for sFrame in sfContainer.getStepFrames()]

def test_getStepFrames_empty(routineEnv):
    """Check that getStepFrames returns the correct step frames for the routine when all steps are removed"""
    _, sfContainer = routineEnv

    sfContainer.removeStepFrame(sfContainer.getStepFrames()[0])

    assert sfContainer.getStepFrames() == []