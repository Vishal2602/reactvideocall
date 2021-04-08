const app = require("express")();
const server = require("http").createServer(app)
const cors = require("cors");

const io = require("socket.io")(server, {
    cors:{
        origin: "*",
        methods: ["GET", "POST"]
    }
})

app.use(cors());

const PORT = process.env.PORT || 5000;

app.get("/", (req,res) =>{
    res.send("Server Started")
})

io.on("connection", (socket)=>{
    socket.emmit("me", socket.id);

    socket.on("disconnect", () =>{
        socket.broadcast.emmit("callended");
    });

    socket.on("call user", ({userToCall, signalData, from, name})=>{
        io.to(userToCall).emmit("calluser", {signal: signalData, from, namre});
    });

    socket.on("answercall", (data) =>{
        io.to(data.to).emit("callaccepted", data.signal)
    });
})

server.listen(PORT, () => console.log(`Server running on port ${PORT}` ))