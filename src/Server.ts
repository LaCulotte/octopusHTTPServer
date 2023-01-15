import { OctopusApp } from "octopus-app";
import express from "express";
import { CloseEvent } from "ws";
import { Server } from "http";
import ip from "ip"


export class HTTPServer extends OctopusApp {
    port : number;
    app: express.Application;
    server : Server;

    type: string = "HTTPServer";
    description: string = "Not serving";
    
    constructor(octopusUrl : string, port : number) {
        super(octopusUrl);

        this.port = port;

        this.app = express();

        this.app.get("/", (req, res) => {
            res.redirect("/ui/index.html");
        });

        this.app.use("/ui", express.static("serverFiles/app"));
        this.app.use("/dist", express.static("serverFiles/dist"));
        this.app.post("/api/ip", (req, res) => {
            const config = this.config.getConfigSync();
            console.log(config);

            const clientIp = (req.headers['x-forwarded-for'] || req.connection.remoteAddress) as string;

            let ip = clientIp;
            if (config.sendIPV4) {
                ip = clientIp.match(/^(?:[0-9]{1,3}\.){3}[0-9]{1,3}$/) ? clientIp : null;
                if(!ip){
                    ip = clientIp.substr(7);
                }
            }

            res.send(ip);
        })
    }

    launch() {
        this.connect();
        this.server = this.app.listen(this.port, () => { 
            console.log(`Listening http server on ${this.getAddress()}:${this.port}`) 
            this.updateDescription(`Serving http://${this.getAddress()}:${this.port}`)
        });
    }

    getAddress() {
        return ip.address();
    }

    onClose(event: CloseEvent): void {
        super.onClose(event);

        if(this.server)
            this.server.close();
    }
};