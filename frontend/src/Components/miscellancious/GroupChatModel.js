import React, { useState } from "react";
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Button,
  useToast,
  FormControl,
  FormLabel,
  FormErrorMessage,
  FormHelperText,
  Input,
  Box,
} from "@chakra-ui/react";
import { useDisclosure } from "@chakra-ui/hooks";
import { ChatState } from "../../Context/ChatProvider";
import axios from "axios";
import UserListItem from "../UserAvatar/UserListItem";
import UserBadgeItem from "../UserAvatar/UserBadgeItem";
const GroupChatModel = ({ children }) => {
  const { user, chats, setChats } = ChatState();
  const toast = useToast();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [groupchatName, setGroupchatName] = useState("");
  const [selecteduser, setSelecteduser] = useState([]);
  const [search, setSearch] = useState("");
  const [searchResult, setSearchResult] = useState([]);
  const [loading, setLoading] = useState(false);
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
    }
  };

  //submit
  const handleSubmit = async () => {
    if (!groupchatName || !selecteduser) {
      toast({
        title: "Please fill all the fields",
        status: "warning",
        duration: 6000,
        isClosable: true,
        position: "top-left",
      });
      return;
    }
    try {
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };
      const { data } = await axios.post(
        `/api/chat/group`,
        {
          name: groupchatName,
          users: JSON.stringify(selecteduser.map((u) => u._id)),
        },
        config
      );

      setChats([data, ...chats]);
      onClose();
      toast({
        title: "New Group Created",
        status: "success",
        duration: 6000,
        isClosable: true,
        position: "top-left",
      });
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

  //handleGroup
  const handleGroup = (usertoadd) => {
    if (selecteduser.includes(usertoadd)) {
      toast({
        title: "User already exist",
        status: "warning",
        duration: 6000,
        isClosable: true,
        position: "top-left",
      });
      return;
    }
    setSelecteduser([...selecteduser, usertoadd]);
  };

  //handleDelete
  const handleDelete = (usertodelete) => {
    setSelecteduser(selecteduser.filter((sel) => sel._id !== usertodelete._id));
  };
  return (
    <>
      <span onClick={onOpen}>{children}</span>
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader
            fontFamily={"work sans"}
            fontSize="35px"
            display={"flex"}
            justifyContent="center"
          >
            Create New Group Chat
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody display={"flex"} flexDir="column" alignItems={"center"}>
            <FormControl>
              <Input
                type="text"
                placeholder="Chat Name"
                mb={3}
                onChange={(e) => setGroupchatName(e.target.value)}
                // onChange={(e) => {
                //   setGroupchatName(e.target.value);
                // }}
              />
            </FormControl>
            <FormControl>
              <Input
                type="text"
                placeholder="Search here"
                mb={2}
                onChange={(e) => handleSearch(e.target.value)}
              />
            </FormControl>
            <Box w={"100%"} display="flex" flexWrap={"wrap"}>
              {selecteduser.map((u) => (
                <UserBadgeItem
                  key={u._id}
                  user={u}
                  handleFunction={() => handleDelete(u)}
                ></UserBadgeItem>
              ))}
            </Box>

            {loading ? (
              <div>loading</div>
            ) : (
              searchResult
                ?.slice(0, 4)
                .map((user) => (
                  <UserListItem
                    key={user._id}
                    user={user}
                    handleFunction={() => handleGroup(user)}
                  ></UserListItem>
                ))
            )}
            {/* selected user,render search user  */}
          </ModalBody>

          <ModalFooter>
            <Button colorScheme="blue" onClick={handleSubmit}>
              Create Chat
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};

export default GroupChatModel;
