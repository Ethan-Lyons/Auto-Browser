from Creator.StepsGuide import StepsGuide
from Creator.RoutineMaker.UserStepBuilder import UserActionBuilder

if __name__ == "__main__":
    uAB = UserActionBuilder()
    userSteps = uAB.getUserActionGroup()

    stepsGuide = StepsGuide(stepTypes=[userSteps])
    stepsGuide.run()