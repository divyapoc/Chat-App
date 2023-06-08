import { Box } from "@chakra-ui/react";
import React from "react";
import { ChatState } from "../Context/ChatProvider";
import SingleChat from "./SingleChat";
const Chatbox = ({ fetchagain, setFetchagain }) => {
  const { user, selectedChat, setSelectedChat, chats, setChats } = ChatState();
  return (
    <Box
      display={{ base: selectedChat ? "flex" : "none", md: "flex" }}
      alignItems={"center"}
      flexDir="column"
      p={3}
      bg="#fff"
      w={{ base: "100%", md: "66%" }}
      borderRadius="lg"
      borderWidth={"1px"}
    >
      <SingleChat fetchagain={fetchagain} setFetchagain={setFetchagain} />
    </Box>
  );
};

export default Chatbox;
