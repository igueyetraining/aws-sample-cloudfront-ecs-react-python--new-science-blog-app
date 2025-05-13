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
import {
  AppShell,
  Burger,
  Button,
  Flex,
  Group,
  ScrollArea,
  Title,
  useMantineTheme,
} from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { BrowserRouter } from "react-router-dom";
import "@aws-amplify/ui-react/styles.css";
import { Authenticator } from "@aws-amplify/ui-react";
import { Amplify } from "aws-amplify";
import { getAmplifyConfig } from "./amplify.ts";
import { AppRoutes } from "./routes";
import NavigationComponent from "./components/Navigation";

Amplify.configure(getAmplifyConfig());

function App() {
  const [opened, { toggle }] = useDisclosure();
  const theme = useMantineTheme();

  const title = (
    <Title order={1} style={{ marginLeft: "1em" }}>
      The <span style={{ color: theme.primaryColor }}>NEW</span> Science!
    </Title>
  );

  const getApp = (
    // the actual AuthEventData seems not to be exported by amplify. Working around with unknown.
    signOut: ((data?: unknown) => void) | undefined) => {
    return  (<BrowserRouter>
      <AppShell
        header={{ height: 60 }}
        navbar={{
          width: 300,
          breakpoint: "sm",
          collapsed: { mobile: !opened },
        }}
        padding="md"
      >
        <AppShell.Header>
          <Group style={{ whiteSpace: "nowrap" }}>
            <Burger
              opened={opened}
              onClick={toggle}
              hiddenFrom="sm"
              size="sm"
            />
            {title}
          </Group>
        </AppShell.Header>
  
        <AppShell.Navbar p="md">
          <ScrollArea h="100%">
            <NavigationComponent />
            {
              signOut ? <Flex justify={"center"} mt="lg">
              <Button onClick={signOut}>Sign out</Button>
            </Flex>  : undefined
            }
            
          </ScrollArea>
        </AppShell.Navbar>
        <AppShell.Main>
          <AppRoutes />
        </AppShell.Main>
      </AppShell>
    </BrowserRouter>)
  
  }

  return (
    <>
      {import.meta.env.VITE_LOCAL_DEV ? getApp(undefined) : <Authenticator
        hideSignUp
        components={{
          SignIn: {
            Footer: () => {
              return <></>;
            },
          },
          Header: () => {
            return (
              <>
                <Group justify="center" mb="xl">
                  {title}
                  <Title order={2}>Editor Login</Title>
                </Group>
              </>
            );
          },
        }}
      >
        {({ signOut }) => (
          getApp(signOut as ((data?: unknown) => void) | undefined)
        )}
      </Authenticator>}
      
    </>
  );
}

export default App;
