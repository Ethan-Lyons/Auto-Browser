import tkinter as tk
from tkinter import ttk
from Steps import Action
from Steps import ActionGroup
from Steps import Argument
from UserActionBuilder import UserActionBuilder

class StepsGuide():
    def __init__(self, stepTypes=[]):
        self.stepTypes = stepTypes
        self.root = self.createWindow()
        self.root.mainloop()

    def createWindow(self):
        """
        Create

        Returns:
            tkinter.Tk: The root of the window.
        """
        root = tk.Tk()
        root.title("Action Viewer")
        sContainer = tk.Frame(root)
        self.frameLayout(sContainer)
        return root
    
    def frameLayout(self, sContainer):
        tree = self.createTree(self.stepTypes, sContainer)
        #for action in self.stepTypes:
            #newFrame = self.createTree(action, sContainer)
        sContainer.grid(row=0, column=0)
        tree.grid(row=0, column=0)

    
    def createTree(self, stepTypes, sContainer):
        tree = ttk.Treeview(sContainer, columns=("type", "description"), show="tree headings")
        tree.heading("#0", text="Name")
        tree.heading("type", text="Type")
        tree.heading("description", text="Description")
        self.addTreeSteps(stepTypes, tree)
        for item_id in tree.get_children(""):
            tree.item(item_id, open=True)

        return tree
    
    def addTreeSteps(self, currStep, tree, parent_id=""):
        if isinstance(currStep, (ActionGroup, Action)):
            node_id = tree.insert(
                parent_id,
                "end",
                text=currStep.getName(),
                values=(type(currStep).__name__, currStep.getDescription())
            )

            for subAction in currStep.getArgs():
                self.addTreeSteps(subAction, tree, node_id)

        elif isinstance(currStep, Argument):
            tree.insert(
                parent_id,
                "end",
                text=currStep.getName(),
                values=(type(currStep).__name__, currStep.getDescription())
            )

        else:
            raise TypeError(
                f"addTreeSteps: Unknown step type {currStep} ({type(currStep)})"
            )



if __name__ == "__main__":
    uAB = UserActionBuilder()
    uAG = uAB.getUserActionGroup()
    stepsGuide = StepsGuide(stepTypes=uAG)