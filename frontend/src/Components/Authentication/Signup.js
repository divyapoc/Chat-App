import React, { useState } from "react";
import { VStack } from "@chakra-ui/layout";
import { Input, InputGroup, InputRightElement } from "@chakra-ui/input";
import { FormControl, FormLabel } from "@chakra-ui/form-control";
import { Button, ButtonGroup, mergeThemeOverride } from "@chakra-ui/react";
import { useToast } from "@chakra-ui/react";
// import { ViewIcon } from "@chakra-ui/icons";
const Signup = () => {
  const toast = useToast();
  const [show, setShow] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmpassword, setConfirmpassword] = useState("");
  const [pic, setPic] = useState("");
  const [loading, setLoading] = useState(false);
  //password event
  const handleclick = () => {
    setShow(!show);
  };

  const postDetails = (pics) => {
    setLoading(true);
    if (pic === undefined) {
      toast({
        title: "Please select an Image",
        status: "warning",
        duration: 6000,
        isClosable: true,
        position: "bottom",
      });
      return;
    }
    if (pic.type === "image/jpeg" || pic.type === "image/png") {
      const data = new FormData();
      data.append("file", pic);
      data.append("upload_preset", "chat-app");
      data.append("cloud_name", "duxho0kjp");
      fetch("https://api.cloudinary.com/v1_1/duxho0kjp/image/upload", {
        method: "post",
        body: data,
      })
        .then((res) => res.json())
        .then((data) => {
          setPic(data.url.toString());
          setLoading(false);
        })
        .catch((err) => {
          console.log(err);
          setLoading(false);
        });
    } else {
      toast({
        title: "Please select an Image",
        status: "warning",
        duration: 6000,
        isClosable: true,
        position: "bottom",
      });
      return;
    }
  };

  //post
  const submitHandler = () => {};

  return (
    <>
      <VStack>
        <FormControl id="name" isRequired>
          <FormLabel>Name</FormLabel>
          <Input
            // size="sm"
            type={"text"}
            placeholder="Enter Your Name"
            onChange={(e) => setName(e.target.value)}
          />
        </FormControl>
        <FormControl id="email" isRequired>
          <FormLabel>Email</FormLabel>
          <Input
            // size="sm"
            type={"email"}
            placeholder="example@gmail.com"
            onChange={(e) => setEmail(e.target.value)}
          />
        </FormControl>
        <FormControl id="password" isRequired>
          <FormLabel>Password</FormLabel>
          <InputGroup>
            <Input
              // size="sm"
              type={show ? "text" : "password"}
              placeholder="Enter Your Password"
              onChange={(e) => setPassword(e.target.value)}
            />
            <InputRightElement alignItems={"center"}>
              <Button size="xs" onClick={handleclick}>
                {show ? "Hide" : "Show"}
              </Button>
            </InputRightElement>
          </InputGroup>
        </FormControl>
        <FormControl id="confirm-password" isRequired>
          <FormLabel>confirm password</FormLabel>
          <InputGroup>
            <Input
              // size="sm"
              placeholder="confirm your password"
              onChange={(e) => setConfirmpassword(e.target.value)}
            />
            <InputRightElement>
              <Button size="xs" onClick={handleclick}>
                {show ? "Hide" : "Show"}
              </Button>
            </InputRightElement>
          </InputGroup>
        </FormControl>
        <FormControl id="pic">
          <FormLabel>Upload your picture</FormLabel>
          <Input
            type="file"
            p={1.5}
            mb={3}
            placeholder="confirm your password"
            onChange={(e) => postDetails(e.target.files[0])}
            accept="image/*"
          />
        </FormControl>
        <Button
          colorScheme="blue"
          width="100%"
          onClick={submitHandler}
          isLoading={loading}
        >
          Sign Up
        </Button>
      </VStack>
    </>
  );
};

export default Signup;
