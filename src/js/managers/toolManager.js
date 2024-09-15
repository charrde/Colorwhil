export const toolManager = {
    activeTool: null,

    setActiveTool(tool) {
        // Save state before switching tools to prevent vanishing strokes
        if (this.activeTool && this.activeTool.deactivate) {
            this.activeTool.deactivate();
        }

        // Enable all buttons before disabling the active one
        document.querySelectorAll('.tool-button').forEach(button => {
            button.disabled = false;
        });

        // Set the active tool and activate it
        tool.activate();
        this.activeTool = tool;
        tool.loadOptions();

        // Automatically find and disable the button based on the tool name
        const toolName = tool.name;
        console.log(toolName);
        const activeButton = document.getElementById(`${toolName}`);
        console.log(activeButton);
        if (activeButton) {
            activeButton.disabled = true;
        }
    }
};