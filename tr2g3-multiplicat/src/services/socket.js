import io from "socket.io-client";
import { reactive } from "vue";

export const socket = io.connect("http://multiplicatg3.dam.inspedralbes.cat:3817");
