// utils/socket.js
import { io } from "socket.io-client";
import { BASE_URL } from "./constants";

let socket;

const getSocket = () => {
    if (!socket) {
        socket = io(BASE_URL, {
            autoConnect: true,
            withCredentials: true,
        });
    }
    return socket;
};

export { getSocket };
