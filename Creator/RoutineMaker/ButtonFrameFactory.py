import tkinter as tk

class ButtonInfo:
    """Object to hold information about a button to be created"""
    def __init__(self, text, onPressFunction):
        """Initializes the ButtonInfo object with the given text and onPressFunction"""
        self.text = text
        self.onPressFunction = onPressFunction

    def getText(self):
        """Returns the text to display on the button"""
        return self.text

    def getOnPressFunction(self):
        """Returns the function to call when the button is pressed"""
        return self.onPressFunction

def createButton(parent: tk.Frame, text: str, onPressFunction: callable):
    """Creates a button with the given text and onPressFunction

    Args:
        parent (tk.Frame): The parent frame to add the button to
        text (str): The text to display on the button
        onPressFunction (callable): The function to call when the button is pressed

    Returns:
        tk.Button: The created button
    """
    return tk.Button(master=parent,
                     text=text,
                     command=lambda: onPressFunction())

def verticalButtonFrame(parent: tk.Frame, buttonList: list[ButtonInfo]):
    """Creates a frame with buttons in a vertical layout
    
    Args:
        parent (tk.Frame): The parent frame to add the buttons to
        buttonList (list[ButtonInfo]): A list of ButtonInfo objects to create buttons for

    Returns:
        tk.Frame: A frame with buttons in a vertical layout
    """
    # Create frame
    bFrame = tk.Frame(parent)
    bFrame.columnconfigure(0, weight=1)

    # Create buttons
    tkList = infoToTkList(buttonList, bFrame)

    # Layout buttons
    row = 0
    for button in tkList:
        button.grid(row=row, column=0, sticky="NSEW")
        bFrame.rowconfigure(row, weight=1)
        row += 1

    return bFrame

def horizontalButtonFrame(parent: tk.Frame, buttonList: list[ButtonInfo]):
    """Creates a frame with buttons in a horizontal layout

    Args:
        parent (tk.Frame): The parent frame to add the buttons to
        buttonList (list[ButtonInfo]): A list of ButtonInfo objects to create buttons for

    Returns:
        tk.Frame: A frame with buttons in a horizontal layout
    """
    # Create frame
    bFrame = tk.Frame(parent)
    bFrame.rowconfigure(0, weight=1)

    # Create buttons
    tkList = infoToTkList(buttonList, bFrame)

    # Layout buttons
    column = 0
    for button in tkList:
        button.grid(row=0, column=column, sticky="NSEW")
        bFrame.columnconfigure(column, weight=1)
        column += 1

    return bFrame


def infoToTkList(bInfoList: list[ButtonInfo], parent: tk.Frame) -> list[tk.Button]:
    """
    Converts a list of ButtonInfo objects to a list of tkinter.Button objects
    given a parent frame.

    Args:
        bInfoList (list[ButtonInfo]): A list of ButtonInfo objects
        parent (tk.Frame): The parent frame to which the buttons should be added

    Returns:
        A list of tkinter.Button objects
    """
    tkList = []
    for bInfo in bInfoList:
        text = bInfo.getText()
        onPressFunction = bInfo.getOnPressFunction()

        tkButton = createButton(parent, text, onPressFunction)
        tkList.append(tkButton)

    return tkList