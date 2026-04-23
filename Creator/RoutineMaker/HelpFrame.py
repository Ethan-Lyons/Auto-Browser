import tkinter as tk
from Creator.RoutineMaker.Steps import Action, ActionGroup, Argument
from Creator.RoutineMaker.HelpLabelFactory import buildFrameList

class HelpFrame:
    def __init__(self, parent: tk.Frame, step: Action | ActionGroup | Argument | None):
        self.parent = parent
        self.frame = tk.Frame(parent)

        # Allow the frame to expand
        self.frame.rowconfigure(0, weight=1)
        self.frame.columnconfigure(0, weight=1)

        self.updateHelp(step)
    
    def getFrame(self):
        return self.frame
    
    def divider(self):
        return tk.Label(self.frame, text="|", font=("Arial", 12, "normal"), bg="black", fg="white")

    def updateHelp(self, step: Action | ActionGroup | Argument | None):
        # clear frame content (if any)
        for widget in self.frame.winfo_children():
            widget.destroy()

        # Generate frames for step and substeps
        newFrames = buildFrameList(self.frame, step)

        curr = 0
        for frame in newFrames:
            frame.grid(row=curr, column=0, sticky="NSEW")

            # Add a divider between entries
            divider = self.divider()
            divider.grid(row=curr+1, column=0, sticky="NSEW")

            # Allow new frames to expand
            self.frame.grid_rowconfigure([curr, curr+1], weight=1)

            curr += 2