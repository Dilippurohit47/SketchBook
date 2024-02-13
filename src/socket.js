import { io } from "socket.io-client";
//  export const socket = io("http://localhost:5000")
const URL  = process.env.NODE_ENV === 'production' ? 'https://sketchbook-server-u4hc.onrender.com' : 'http://localhost:5000'
 export const socket = io(URL)