import { Button, Flex } from "@mantine/core";
import { IconBrain } from "@tabler/icons-react";

export default function ChatButton({ open }: { open: () => void }) {
  return (
    <>
      <Flex justify={"center"}>
        <Button leftSection={<IconBrain></IconBrain>} onClick={open}>
          Chat with our articles!
        </Button>
      </Flex>
    </>
  );
}
