import { ArrowBackIcon } from "@chakra-ui/icons";
import {
  Box,
  FormControl,
  IconButton,
  Input,
  Spinner,
  Text,
  useToast,
} from "@chakra-ui/react";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { getSender, getSenderFull } from "../config/ChatLogics";
import { ChatState } from "../Context/ChatProvider";
import Profilemodel from "./miscellancious/Profilemodel";
import UpdateGroupchatModel from "./miscellancious/UpdateGroupchatModel";
const SingleChat = ({ fetchagain, setFetchagain }) => {
  const { user, selectedChat, setSelectedChat } = ChatState();
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [newmessages, setNewMessages] = useState("");
  const toast = useToast();
  //fetch message
  const fetchMeassge = async () => {
    if (!selectedChat) return;
    try {
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };
      setLoading(true);
      const { data } = await axios.get(
        `/api/message/${selectedChat._id}`,
        config
      );
      console.log("message", data);
      setMessages(data);
      setLoading(false);
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
  //useeffect
  useEffect(() => {
    fetchMeassge();
  }, [selectedChat]);
  //message
  const sendMessage = async (event) => {
    if (event.key === "Enter" && newmessages) {
      try {
        const config = {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${user.token}`,
          },
        };
        setNewMessages("");
        const { data } = await axios.post(
          "/api/message",
          {
            content: newmessages,
            chatId: selectedChat._id,
          },
          config
        );
        console.log("data", data);

        setMessages({ ...messages, data });
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
    }
  };

  //typing
  const typinghandler = (e) => {
    setNewMessages(e.target.value);
  };
  return (
    <>
      {selectedChat ? (
        <>
          <Text
            fontSize={{ base: "28px", md: "30px" }}
            pb={3}
            px={2}
            w="100%"
            fontFamily={"work sans"}
            display="flex"
            justifyContent={{ base: "space-between" }}
            alignItems="center"
          >
            <IconButton
              display={{ base: "flex", md: "none" }}
              icon={<ArrowBackIcon />}
              onClick={() => setSelectedChat("")}
            />
            {!selectedChat.isGroupChat ? (
              <>
                {getSender(user, selectedChat.users)}
                <Profilemodel user={getSenderFull(user, selectedChat.users)} />
              </>
            ) : (
              <>
                {selectedChat.chatName.toUpperCase()}
                <UpdateGroupchatModel
                  fetchagain={fetchagain}
                  setFetchagain={setFetchagain}
                />
              </>
            )}
          </Text>
          <Box
            display={"flex"}
            flexDir="column"
            justifyContent={"flex-end"}
            p={3}
            bg="#E8E8E8"
            w={"100%"}
            h="100%"
            borderRadius={"lg"}
            overflow="hidden"
          >
            {loading ? (
              <Spinner size={"xl"} w={20} h={20} alignSelf="center" />
            ) : (
              <div>messages</div>
            )}
            <FormControl onKeyDown={sendMessage} isRequired mt={3}>
              <Input
                variant={"filled"}
                bg={"#E0E0E0"}
                placeholder="Enter your message"
                onChange={typinghandler}
                value={newmessages}
              />
            </FormControl>
          </Box>
        </>
      ) : (
        <Box
          display={"flex"}
          alignItems="center"
          justifyContent={"center"}
          h="100%"
        >
          <Text fontFamily={"work sans"} fontSize="30px">
            Click on a user to start chatting
          </Text>
        </Box>
      )}
    </>
  );
};

export default SingleChat;
