/**
MIT No Attribution

Copyright 2024 Amazon.com, Inc. or its affiliates. All Rights Reserved.

Permission is hereby granted, free of charge, to any person obtaining a copy of
this software and associated documentation files (the "Software"), to deal in
the Software without restriction, including without limitation the rights to
use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of
the Software, and to permit persons to whom the Software is furnished to do so.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS
FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR
COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER
IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN
CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
**/

import { Divider, Flex, NavLink, Title } from "@mantine/core";
import { IconHome, IconPencil, IconPlus } from "@tabler/icons-react";
import { useLocation } from "react-router-dom";
import { NavLink as RRNavLink } from "react-router-dom";
import { categories } from "../lib/categories";
/* START chat-imports
import { useDisclosure } from "@mantine/hooks";
import GenAiChatComponent from "./GenAiChat";
import ChatButton from "./ChatButton";
END chat-imports */

export default function NavigationComponent() {
  const location = useLocation();
  /* START chat-disclosure
  const [opened, { open, close }] = useDisclosure(false);
  END chat-disclosure */

  return (
    <>
      <NavLink
        to="/"
        label="Home"
        leftSection={<IconHome />}
        styles={{ label: { fontSize: "1em" } }}
        active={location.pathname === "/"}
        component={RRNavLink}
      ></NavLink>
      <Divider my="xs" />
      {categories.map((category) => (
        <NavLink
          key={category.name}
          to={`/category/${category.name}/1`}
          label={category.name}
          leftSection={category.icon}
          styles={{ label: { fontSize: "1em" } }}
          active={location.pathname.startsWith(`/category/${category.name}/`)}
          component={RRNavLink}
        ></NavLink>
      ))}
      {
        //
        /* START chat-button
        <ChatButton open={open}></ChatButton>
        END chat-button */
      }
      <Divider mt="xs" mb="lg" />
      <Flex justify={"center"}>
        <Title order={5}>
          <IconPencil size={"1em"} /> Editor Tools
        </Title>
      </Flex>
      <NavLink
        to="/add-article"
        label="Add Article"
        leftSection={<IconPlus />}
        styles={{ label: { fontSize: "1em" } }}
        active={location.pathname === "/add-article"}
        component={RRNavLink}
      ></NavLink>
      {
        //
        /* START chat-component
        <GenAiChatComponent opened={opened} close={close}></GenAiChatComponent>
        END chat-component */
      }
    </>
  );
}
