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
  Alert,
  Box,
  Center,
  Divider,
  Flex,
  Group,
  Loader,
  Spoiler,
  Text,
  Title,
} from "@mantine/core";
import ArticleComponent, { Article } from "../components/Article";
import { NavLink as RRNavLink } from "react-router-dom";
import { useEffect, useState } from "react";
import { get } from "aws-amplify/api";
import { categories } from "../lib/categories";
import { IconExclamationMark } from "@tabler/icons-react";
import { fetchAuthSession } from "aws-amplify/auth";

export default function HomePage() {
  const [topStories, setTopStories] = useState<Article[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function getTopStories() {
    try {
      setError("");
      setLoading(true);
      const restOperation = get({
        apiName: "restApi",
        path: "/top-stories",
        options: import.meta.env.VITE_LOCAL_DEV ? undefined :  {
          headers: {
            Authorization: (await fetchAuthSession()).tokens!.idToken!.toString()
          }
        }
      });
      const response = await restOperation.response;
      setTopStories((await response.body.json()) as unknown as Article[]);
    } catch (error) {
      console.error("Error fetching top stories:", error);
      if (
        typeof error === "object" &&
        error &&
        "message" in error &&
        typeof error.message === "string" &&
        // pre-build, message is "token is undefined". After build, "e is undefined"
        error.message.endsWith("is undefined")
      ) {
        // currently a workaround as intermittently right after login, amplify get method throws this message
        // auth token not available quickly enough
        // subsequent calls are fine
        window.location.reload();
      } else {
        setError("Error loading articles: " + String(error));
      }
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    getTopStories();
  }, []);

  return (
    <>
      <Title order={2}>Top Stories</Title>
      <Divider my="md"></Divider>
      {error ? (
        <Alert
          my="lg"
          variant="filled"
          color="red"
          title="Error"
          icon={<IconExclamationMark />}
          withCloseButton
          onClose={() => setError("")}
        >
          {error}
        </Alert>
      ) : undefined}
      {loading ? (
        <Center>
          <Loader></Loader>
        </Center>
      ) : undefined}
      {topStories.sort((a, b) => b.date.localeCompare(a.date)).map((article) => {
        return (
          <Box key={article.category}>
            <Spoiler maxHeight={160} showLabel="Show more" hideLabel="Hide">
              <Group>
                {
                  categories.find(
                    (category) => category.name === article.category
                  )?.icon
                }
                <Text>{article.category}</Text>
              </Group>
              <ArticleComponent article={article}></ArticleComponent>
            </Spoiler>
            <Flex justify={"flex-end"}>
              <Text style={{ fontSize: "1em", color: "inherit" }}>
                <RRNavLink to={`/category/${article.category}`}>
                  all stories in {article.category}
                </RRNavLink>
              </Text>
            </Flex>
            <Divider my="md"></Divider>
          </Box>
        );
      })}
    </>
  );
}
