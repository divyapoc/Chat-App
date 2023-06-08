import React, { useEffect, useState } from "react";
import { ChatState } from "../Context/ChatProvider";
import { useToast, Box, Button, Stack, Text } from "@chakra-ui/react";
import axios from "axios";
import { AddIcon } from "@chakra-ui/icons";
import Chatloading from "./miscellancious/Chatloading";
import { getSender } from "../config/ChatLogics";
import GroupChatModel from "./miscellancious/GroupChatModel";
const Mychats = ({ fetchagain }) => {
  const [loggedUser, setLoggedUser] = useState("");
  const { user, selectedChat, setSelectedChat, chats, setChats } = ChatState();
  const toast = useToast();

  //fetch chat
  const fetchChats = async () => {
    console.log("userid", user._id);
    try {
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };
      const { data } = await axios.get("/api/chat", config);
      console.log("data", data);
      setChats(data);
    } catch (error) {
      toast({
        title: "Error",
        description: error.message,
        status: "error",
        duration: 6000,
        isClosable: true,
        position: "top-left",
      });
    }
  };
  useEffect(() => {
    setLoggedUser(JSON.parse(localStorage.getItem("userInfo")));
    fetchChats();
  }, [fetchagain]);
  console.log("chat", chats);
  return (
    <>
      <Box
        display={{ base: selectedChat ? "none" : "flex", md: "flex" }}
        flexDir="column"
        alignItems={"center"}
        p={3}
        bg="#fff"
        w={{ base: "100%", md: "33%" }}
        borderRadius="lg"
        borderWidth={"1px"}
      >
        <Box
          pb={3}
          px={3}
          fontSize={{ base: "28px", md: "30px" }}
          fontFamily="Work sans"
          display={"flex"}
          w="100%"
          justifyContent="space-between"
          alignItems="center"
        >
          My chats
          <GroupChatModel>
            <Button
              display={"flex"}
              fontSize={{ base: "17px", md: "10px", lg: "17px" }}
              rightIcon={<AddIcon />}
            ></Button>
          </GroupChatModel>
        </Box>
        <Box
          display={"flex"}
          flexDir="column"
          p={3}
          bg="#F8F8F8"
          w="100%"
          h={"100%"}
          borderRadius="lg"
          overflow={"hidden"}
        >
          {chats ? (
            <Stack overflowY={"scroll"}>
              {chats.map((chat) => (
                <Box
                  onClick={() => setSelectedChat(chat)}
                  cursor="pointer"
                  bg={selectedChat === chat ? "#38B2AC" : "#E8E8E8"}
                  color={selectedChat === chat ? "#fff" : "#000"}
                  px={3}
                  py={2}
                  borderRadius="lg"
                  key={chat._id}
                >
                  <Text>
                    {!chat.isGroupChat
                      ? getSender(loggedUser, chat.users)
                      : chat.chatName}
                  </Text>
                </Box>
              ))}
            </Stack>
          ) : (
            <Chatloading />
          )}
        </Box>
      </Box>
    </>
  );
};

export default Mychats;
