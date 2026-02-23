from Creator.RoutineMaker.Routine import Routine

import pytest as pytest

def test_init():
    """Check routine creation values are set"""
    routine = Routine()
    assert routine.steps == []

def test_add_step():
    """Adds a step to a routine"""
    routine = Routine()
    new_action = routine.createDefStep()
    assert len(routine.steps) == 1
    assert routine.steps[0] == new_action

def test_remove_step():
    """Removes a step from a routine"""
    routine = Routine()
    newAction = routine.createDefStep()
    routine.removeStep(newAction)
    assert len(routine.steps) == 0

def test_get_steps():
    """Gets the steps from a routine"""
    routine = Routine()
    action1 = routine.createDefStep()
    action2 = routine.createDefStep()
    assert routine.getSteps() == [action1, action2]

def test_move_step():
    """Moves a step in a routine"""
    routine = Routine()
    action1 = routine.createDefStep()
    action2 = routine.createDefStep()
    routine.moveAction(0, 1)
    assert routine.getSteps() == [action2, action1]