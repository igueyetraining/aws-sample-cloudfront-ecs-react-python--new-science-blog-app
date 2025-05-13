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
import { Flex, Group, Stack, Text, Title, Tooltip } from "@mantine/core";
import { IconCalendarMonth, IconPencil } from "@tabler/icons-react";

export interface Article {
  title: string;
  date: string;
  author: string;
  text: string;
  agency: string;
  category: string;
  user_submitted: 0 | 1;
}

export default function ArticleComponent({ article }: { article: Article }) {
  return (
    <>
      <Stack gap="xs">
        <Title order={3}>{article.title}</Title>
        <Group>
          <Group>
            {article.date.split("T")[0] ===
            new Date().toISOString().split("T")[0]
              ? <Tooltip label="HOT! New story!" color="orange"><Text>🔥 </Text></Tooltip>
              : undefined}
            <IconCalendarMonth />
            <Text size="sm" fs={"italic"}>
              {article.date.split("T")[0]}
            </Text>
          </Group>
          <Group>
            <IconPencil />
            <Text size="sm">{article.author}</Text>
          </Group>
        </Group>
        <Text component="div">
          {article.text.split("\n").map((paragraph, index) => (
            <p key={index} style={{ textAlign: "justify" }}>
              {paragraph}
            </p>
          ))}
        </Text>
        <Flex justify={"flex-end"}>
          <Text size="sm" style={{ marginRight: "0.5em" }}>
            via
          </Text>
          <Text size="sm" fs={"italic"}>
            {article.agency}
          </Text>
        </Flex>
      </Stack>
    </>
  );
}
