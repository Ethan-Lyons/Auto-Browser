import tkinter as tk
from Creator.RoutineMaker.Steps import Action, ActionGroup, Argument
from Creator.RoutineMaker.HelpLabelFactory import buildFrameList

class HelpFrame:
    def __init__(self, parent: tk.Frame, step: Action | ActionGroup | Argument | None):
        self.parent = parent
        self.frame = tk.Frame(parent)

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

        newFrames = buildFrameList(self.frame, step)
        print("Len: " + str(len(newFrames)))

        curr = 0
        for frame in newFrames:
            frame.grid(row=curr, column=0, sticky="NSEW")
            divider = self.divider()
            divider.grid(row=curr+1, column=0, sticky="NSEW")
            curr += 2