import React, { useState } from "react";
import { VStack } from "@chakra-ui/layout";
import { Input, InputGroup, InputRightElement } from "@chakra-ui/input";
import { FormControl, FormLabel } from "@chakra-ui/form-control";
import { Button, ButtonGroup } from "@chakra-ui/react";
import { useToast } from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const Login = () => {
  const toast = useToast();
  const navigate = useNavigate();
  const [show, setShow] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsloading] = useState(false);
  const handleclick = () => {
    setShow(!show);
  };

  //login - post
  const submitHandler = async () => {
    setIsloading(true);
    if (!email || !password) {
      toast({
        title: "Please Fill All Feild",
        status: "warning",
        duration: 6000,
        isClosable: true,
        position: "bottom",
      });
      setIsloading(false);
    }
    try {
      const config = {
        headers: {
          "content-type": "application/json",
        },
      };
      const { data } = await axios.post(
        "/api/user/login",
        { email, password },
        config
      );
      toast({
        title: "Login successful",
        status: "success",
        duration: 6000,
        isClosable: true,
        position: "top-right",
      });

      localStorage.setItem("userInfo", JSON.stringify(data));
      setIsloading(false);
      navigate("/chat");
    } catch (error) {
      toast({
        title: "Error",
        description: error.response.data.message,
        //description: error.message,
        status: "success",
        duration: 6000,
        isClosable: true,
        position: "top-left",
      });
      setIsloading(false);
    }
  };
  return (
    <VStack>
      <FormControl id="loginemail" isRequired>
        <FormLabel>Email</FormLabel>
        <Input
          // size="sm"
          type={"email"}
          placeholder="example@gmail.com"
          onChange={(e) => setEmail(e.target.value)}
        />
      </FormControl>
      <FormControl id="loginpassword" isRequired>
        <FormLabel>Password</FormLabel>
        <InputGroup>
          <Input
            mb={3}
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
      <Button
        colorScheme="blue"
        width="100%"
        onClick={submitHandler}
        isLoading={isLoading}
      >
        Login
      </Button>
      <Button
        variant={"solid"}
        colorScheme="red"
        width="100%"
        onClick={() => {
          setEmail("guest@example.com");
          setPassword("123456");
        }}
        //isLoading={isLoading}
      >
        Get Guest User Credentials
      </Button>
    </VStack>
  );
};

export default Login;
