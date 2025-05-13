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
  Button,
  Flex,
  Select,
  Textarea,
  TextInput,
  Title,
} from "@mantine/core";
import { useState } from "react";
import { post } from "aws-amplify/api";
import { IconCheck, IconExclamationMark } from "@tabler/icons-react";
import { categories } from "../lib/categories";
import { fetchAuthSession } from "aws-amplify/auth";

export default function AddArticlePage() {
  const [category, setCategory] = useState<string | null>("Mathematics");
  const [title, setTitle] = useState("");
  const maxTitleLength = 100;
  const [text, setText] = useState("");
  const maxTextLength = 2000;
  const [author, setAuthor] = useState("");
  const maxAuthorLength = 50;
  const [agency, setAgency] = useState("");
  const maxAgencyLength = 50;
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  async function publishArticle() {
    setLoading(true);
    setError("");
    setSuccess("");
    try {
      const restOperation = post({
        apiName: "restApi",
        path: "/article",
        options: {
          body: {
            category,
            title,
            text,
            author,
            agency,
            date: new Date().toISOString(),
            user_submitted: 1,
          },
          headers: import.meta.env.VITE_LOCAL_DEV ? undefined : {
            Authorization: (await fetchAuthSession()).tokens!.idToken!.toString()
          }
        },
      });
      if ((await restOperation.response).statusCode === 200) {
        setCategory("Mathematics");
        setTitle("");
        setText("");
        setAuthor("");
        setAgency("");
        setSuccess("Article published successfully");
      } else {
        throw new Error("Failed to publish article");
      }
    } catch (error) {
      setError("Error publishing article!");
      console.error("Error publishing article:", error);
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <Title order={2}>Add Article</Title>
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
      {success ? (
        <Alert
          my="lg"
          variant="filled"
          color="green"
          title="Success"
          icon={<IconCheck />}
          withCloseButton
          onClose={() => setSuccess("")}
        >
          {success}
        </Alert>
      ) : undefined}
      <Flex>
        <Select
          label="Category"
          data={categories.map((item) => item.name)}
          required
          value={category}
          onChange={setCategory}
        ></Select>
      </Flex>

      <TextInput
        label="Title"
        placeholder="Title"
        value={title}
        onChange={(event) =>
          setTitle(event.currentTarget.value.substring(0, maxTitleLength))
        }
        description={`${title.length}/${maxTitleLength}`}
        required
      ></TextInput>
      <Textarea
        label="Text"
        placeholder="Text"
        required
        resize="both"
        autosize
        minRows={6}
        maxRows={10}
        value={text}
        onChange={(event) =>
          setText(event.currentTarget.value.substring(0, maxTextLength))
        }
        description={`${text.length}/${maxTextLength}`}
      />
      <TextInput
        label="Author"
        placeholder="Author"
        value={author}
        onChange={(event) =>
          setAuthor(event.currentTarget.value.substring(0, maxAuthorLength))
        }
        description={`${author.length}/${maxAuthorLength}`}
        required
      ></TextInput>
      <TextInput
        label="Agency"
        placeholder="Agency"
        value={agency}
        onChange={(event) =>
          setAgency(event.currentTarget.value.substring(0, maxAgencyLength))
        }
        description={`${agency.length}/${maxAgencyLength}`}
        required
      ></TextInput>
      <Button
        mt="md"
        disabled={!(category && title && text && author && agency)}
        loading={loading}
        onClick={() => publishArticle()}
      >
        Publish
      </Button>
    </>
  );
}
