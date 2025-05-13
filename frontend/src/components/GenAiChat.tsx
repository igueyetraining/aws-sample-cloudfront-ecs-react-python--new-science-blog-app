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
  Button,
  Drawer,
  Image,
  Paper,
  ScrollArea,
  Text,
  TextInput,
  Title,
} from "@mantine/core";
import { IconBrain } from "@tabler/icons-react";
import { post } from "aws-amplify/api";
import { fetchAuthSession } from "aws-amplify/auth";
import { useState, useEffect } from "react";

export default function GenAiChatComponent({
  opened,
  close,
}: {
  opened: boolean;
  close: () => void;
}) {
  const [input, setInput] = useState("");
  const maxInputLength = 200;
  const [paperContent, setPaperContent] = useState(
    `Hi! I'm Newsci, your news bot. Ask me anything about our articles in the Question field below!`
  );
  const [loading, setLoading] = useState(false);
  const [disabled, setDisabled] = useState(false);
  const [countdown, setCountdown] = useState(0);

  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => {
        setCountdown((prev) => prev - 1);
      }, 1000);
      return () => clearTimeout(timer);
    } else {
      setDisabled(false); // Enable button when countdown finishes
    }
  }, [countdown]);

  function setPaperContentCharByChar(content: string) {
    setPaperContent("");
    [...content].forEach((char, index) => {
      setTimeout(() => {
        setPaperContent((prev) => prev + char);
      }, 5 * index);
    });
  }

  async function askQuestion() {
    setLoading(true);
    setPaperContentCharByChar("Let me see...");
    try {
      const restOperation = post({
        apiName: "restApi",
        path: "/chat",
        options: {
          body: {
            prompt: input,
          },
          headers: {
            "Content-Type": "application/json",
            Authorization: (
              await fetchAuthSession()
            ).tokens!.idToken!.toString(),
          },
        },
      });
      const response = await restOperation.response;
      const body = (await response.body.json()) as unknown as object;
      if (
        response.statusCode === 200 &&
        body &&
        "response" in body &&
        typeof body.response === "string"
      ) {
        setPaperContentCharByChar(body.response);
      } else {
        console.error(response.statusCode);
        console.error(body);
        throw new Error("Unexpected answer format");
      }
    } catch (error) {
      console.error("Error asking question:", error);
      setPaperContentCharByChar(
        "Oh no, there was an error! Please try again later."
      );
    } finally {
      await new Promise((resolve) => setTimeout(resolve, 5000));
      setLoading(false);
      setDisabled(true);
      setCountdown(10);
    }
  }

  return (
    <>
      <Drawer
        opened={opened}
        onClose={close}
        title={
          <Title order={2} component={"span"}>
            <IconBrain style={{ marginRight: "0.5em" }}></IconBrain>Chat with
            our articles
          </Title>
        }
        position="right"
      >
        <ScrollArea h="100%">
          <Paper radius={"lg"} shadow="xs" p="xl" withBorder>
            <Text size="sm">{paperContent}</Text>
          </Paper>
          <Image src="/robot.png" w={"50%"}></Image>
          <TextInput
            label="Question"
            placeholder="Question"
            value={input}
            onChange={(event) =>
              setInput(event.currentTarget.value.substring(0, maxInputLength))
            }
            description={`${input.length}/${maxInputLength}`}
          ></TextInput>
          <Button
            mt="md"
            disabled={!input || disabled}
            loading={loading}
            onClick={() => askQuestion()}
          >
            {disabled
              ? `Wait ${countdown}
        s`
              : "Ask"}
          </Button>
        </ScrollArea>
      </Drawer>
    </>
  );
}
