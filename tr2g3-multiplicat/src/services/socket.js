import io from "socket.io-client";
import { reactive } from "vue";

export const socket = io.connect("http://localhost:3333");
