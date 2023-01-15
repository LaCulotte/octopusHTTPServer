import { HTTPServer } from "./Server";

let app = new HTTPServer("ws://localhost:8000/", 80);
app.launch();