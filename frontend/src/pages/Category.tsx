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
  Loader,
  Title,
  Pagination,
  Flex,
} from "@mantine/core";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { get } from "aws-amplify/api";
import ArticleComponent, { Article } from "../components/Article";
import { IconExclamationMark } from "@tabler/icons-react";
import { fetchAuthSession } from "aws-amplify/auth";

interface ArticleResponse {
  articles: Article[];
  total_pages: number;
}

export default function CategoryPage() {
  const { categoryId, page } = useParams();
  const [stories, setStories] = useState<Article[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [totalPages, setTotalPages] = useState(1);
  const navigate = useNavigate();

  async function getStories() {
    try {
      setError("");
      setStories([]);
      setTotalPages(1);
      setLoading(true);
      const restOperation = get({
        apiName: "restApi",
        path: `/category/${categoryId}/${page}`,
        options: import.meta.env.VITE_LOCAL_DEV
          ? undefined
          : {
              headers: {
                Authorization: (
                  await fetchAuthSession()
                ).tokens!.idToken!.toString(),
              },
            },
      });
      const response = await restOperation.response;
      const responseJson =
        (await response.body.json()) as unknown as ArticleResponse;
      setStories(responseJson.articles);
      setTotalPages(responseJson.total_pages);
    } catch (error) {
      setError("Error loading articles: " + String(error));
      console.error("Error fetching top stories:", error);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    getStories();
  }, [categoryId, page]);

  return (
    <>
      <Title order={2}>{categoryId}</Title>
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
      {stories.map((article) => (
        <Box key={`${article.date}${article.title}`}>
          <ArticleComponent article={article}></ArticleComponent>
          <Divider my="md"></Divider>
        </Box>
      ))}
      <Flex justify={"center"} mt="lg">
        <Pagination
          total={totalPages}
          value={page ? Number(page) : 1}
          onNextPage={() => {
            navigate(`/category/${categoryId}/${Number(page) + 1}`);
          }}
          onPreviousPage={() => {
            navigate(`/category/${categoryId}/${Number(page) - 1}`);
          }}
          onFirstPage={() => {
            navigate(`/category/${categoryId}/1`);
          }}
          onLastPage={() => {
            navigate(`/category/${categoryId}/${totalPages}`);
          }}
          onChange={(page) => {
            navigate(`/category/${categoryId}/${page}`);
          }}
        ></Pagination>
      </Flex>
    </>
  );
}
