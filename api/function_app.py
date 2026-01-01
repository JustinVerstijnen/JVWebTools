import azure.functions as func

# Single Functions app for the Static Web App.
app = func.FunctionApp()

# Register tool routes (namespaced by folder/tool name)
from DNSMegaTool.routes import register as register_DNSMegaTool
from PortCheckerTool.routes import register as register_PortCheckerTool

register_DNSMegaTool(app)
register_PortCheckerTool(app)
