import React, { useState } from "react";
import {
  Modal,
  ModalHeader,
  ModalContent,
  ModalCloseButton,
  ModalFooter,
  Button,
  ModalOverlay,
  ModalBody,
  Text,
  useToast,
  IconButton,
  Box,
  FormControl,
  Input,
  Spinner,
} from "@chakra-ui/react";
import { useDisclosure } from "@chakra-ui/hooks";
import { ViewIcon } from "@chakra-ui/icons";
import { ChatState } from "../../Context/ChatProvider";
import UserBadgeItem from "../UserAvatar/UserBadgeItem";
import UserListItem from "../UserAvatar/UserListItem";
import axios from "axios";
const UpdateGroupchatModel = ({ fetchagain, setFetchagain }) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { user, selectedChat, setSelectedChat } = ChatState();
  const [groupchatName, setGroupchatName] = useState("");
  const [selecteduser, setSelecteduser] = useState([]);
  const [search, setSearch] = useState("");
  const [searchResult, setSearchResult] = useState([]);
  const [loading, setLoading] = useState(false);
  const [renameloading, setRenameloading] = useState(false);
  const toast = useToast();

  //rename
  const handleRename = async () => {
    if (!groupchatName) {
      return;
    }
    try {
      setRenameloading(true);
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };

      const { data } = await axios.put(
        `/api/chat/rename-group`,
        {
          chatId: selectedChat._id,
          chatName: groupchatName,
        },
        config
      );
      //console.log("data", data);
      setSelectedChat(data);
      setFetchagain(!fetchagain);
      setRenameloading(false);
    } catch (error) {
      toast({
        title: "Error",
        description: error.message,
        status: "error",
        duration: 6000,
        isClosable: true,
        position: "top-left",
      });
      setRenameloading(false);
    }
    setGroupchatName("");
  };

  //handlesearch
  //search
  const handleSearch = async (query) => {
    console.log(query);
    setSearch(query);
    if (!query) {
      return;
    }
    try {
      setLoading(true);
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };
      const { data } = await axios.get(`/api/user?search=${query}`, config);
      console.log("data", data);
      setLoading(false);
      setSearchResult(data);
    } catch (error) {
      toast({
        title: "Error",
        description: error.message,
        status: "error",
        duration: 6000,
        isClosable: true,
        position: "top-left",
      });
      setLoading(false);
    }
  };

  //remove
  const handleRemove = async (usertoremove) => {
    //&& usertoremove !== user._id
    if (selectedChat.groupAdmin._id !== user._id) {
      toast({
        title: "Only admin can add remove members..",
        status: "warning",
        duration: 6000,
        isClosable: true,
        position: "top-left",
      });
      return;
    }
    try {
      setLoading(true);
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };
      const { data } = await axios.put(
        `/api/chat/group-remove-member`,
        {
          chatId: selectedChat._id,
          userId: usertoremove._id,
        },
        config
      );
      console.log(selectedChat);
      usertoremove._id === user._id
        ? setSelectedChat("")
        : setSelectedChat(data);
      setFetchagain(!fetchagain);
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
      setLoading(false);
    }
  };

  //add
  const handleAdduser = async (usertoadd) => {
    if (selectedChat.users.find((u) => u._id === usertoadd._id)) {
      toast({
        title: "User Already In Group",
        status: "warning",
        duration: 6000,
        isClosable: true,
        position: "top-left",
      });
      return;
    }
    if (selectedChat.groupAdmin._id !== user._id) {
      toast({
        title: "Only admin can add new members..",
        status: "warning",
        duration: 6000,
        isClosable: true,
        position: "top-left",
      });
      return;
    }
    try {
      setLoading(true);
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };
      const { data } = await axios.put(
        `/api/chat/group-add-member`,
        {
          chatId: selectedChat._id,
          userId: usertoadd._id,
        },
        config
      );
      setSelectedChat(data);
      setFetchagain(!fetchagain);
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
      setLoading(false);
    }
  };
  return (
    <>
      <IconButton
        display={{ base: "flex" }}
        icon={<ViewIcon />}
        onClick={onOpen}
      />
      <Modal isOpen={isOpen} onClose={onClose} isCentered>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader
            fontFamily={"work sans"}
            fontSize="35px"
            display={"flex"}
            justifyContent="center"
          >
            {selectedChat.chatName}
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody display={"flex"} flexDir="column" alignItems={"center"}>
            <Box w={"100%"} display="flex" flexWrap={"wrap"}>
              {selectedChat.users.map((u) => (
                <UserBadgeItem
                  key={u._id}
                  user={u}
                  handleFunction={() => handleRemove(u)}
                ></UserBadgeItem>
              ))}
            </Box>
            <FormControl display={"flex"}>
              <Input
                type="text"
                placeholder="Chat Name"
                mb={3}
                value={groupchatName}
                onChange={(e) => setGroupchatName(e.target.value)}
              />
              <Button
                variant={"solid"}
                colorScheme="teal"
                ml={1}
                isLoading={renameloading}
                onClick={handleRename}
              >
                Update
              </Button>
            </FormControl>
            <FormControl>
              <Input
                type="text"
                placeholder="Search here"
                mb={2}
                onChange={(e) => handleSearch(e.target.value)}
              />
            </FormControl>

            {loading ? (
              <Spinner size={"lg"} />
            ) : (
              searchResult
                ?.slice(0, 4)
                .map((user) => (
                  <UserListItem
                    key={user._id}
                    user={user}
                    handleFunction={() => handleAdduser(user)}
                  ></UserListItem>
                ))
            )}
          </ModalBody>

          <ModalFooter>
            <Button onClick={() => handleRemove(user)} colorScheme="red">
              Leave Group
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};

export default UpdateGroupchatModel;
