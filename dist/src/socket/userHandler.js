"use strict";
module.exports = (io, socket) => {
    const users = [];
    const addUser = ({ socket_id, name, user_id, room_id }) => {
        const exist = users.find(user => user.room_id === room_id && user.user_id === user_id);
        if (exist) {
            return { error: 'User already exist in this room' };
        }
        const user = { socket_id, name, user_id, room_id };
        users.push(user);
        return { user };
    };
    const removeUser = (socket_id) => {
        const index = users.findIndex(user => user.socket_id === socket_id);
        if (index !== -1) {
            return users.splice(index, 1)[0];
        }
    };
    const getUser = (socket_id) => users.find(user => user.socket_id === socket_id);
    console.log('register user handlers');
    socket.on("user:add_user", addUser);
    socket.on("user:romove_user", removeUser);
    socket.on("user:get_user", getUser);
};
//# sourceMappingURL=userHandler.js.map