import { useState, useEffect } from "react";
import {
  Button,
  Input,
  IconButton,
  Editable,
  Checkbox,
  useCheckbox,
  Flex,
  Heading,
  Box,
} from "@chakra-ui/react";
import { LuCheck, LuPencilLine, LuX } from "react-icons/lu";

type Task = {
  id: number;
  text: string;
  completed: boolean;
};

const toDoList = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const checkbox = useCheckbox();
  const [newTask, setNewTask] = useState("");

  const addTask = () => {
    if (newTask.trim() !== "") {
      setTasks((prevTasks) => [
        ...prevTasks,
        { id: Date.now(), text: newTask, completed: false },
      ]);
      setNewTask("");
    }
  };

  const deleteTask = (index: number) => {
    setTasks((prevTasks) => prevTasks.filter((_, i) => i !== index));
  };

  const updateTaskText = (index: number, newText: string) => {
    setTasks((prevTasks) =>
      prevTasks.map((task, i) =>
        i === index ? { ...task, text: newText } : task
      )
    );
  };

  const moveTaskUp = (index: number) => {
    if (index > 0) {
      setTasks((prevTasks) => {
        const updatedTasks = [...prevTasks];
        [updatedTasks[index], updatedTasks[index - 1]] = [
          updatedTasks[index - 1],
          updatedTasks[index],
        ];
        return updatedTasks;
      });
    }
  };

  const moveTaskDown = (index: number) => {
    if (index < tasks.length - 1) {
      setTasks((prevTasks) => {
        const updatedTasks = [...prevTasks];
        [updatedTasks[index], updatedTasks[index + 1]] = [
          updatedTasks[index + 1],
          updatedTasks[index],
        ];
        return updatedTasks;
      });
    }
  };

  useEffect(() => {
    const storedTasks = localStorage.getItem("tasks");
    if (storedTasks) {
      setTasks(JSON.parse(storedTasks));
    }
  }, []);

  useEffect(() => {
    if (tasks.length > 0) {
      localStorage.setItem("tasks", JSON.stringify(tasks));
    }
  }, [tasks]);

  return (
    <>
      <div>
        <Heading flex="1" mx={3} my={1} p={2}>
          To-Do List
        </Heading>
        {/* Input element and add button */}
        <Flex gap={1} p={2}>
          <Input
            flex="1"
            type="text"
            placeholder="Enter a task"
            value={newTask}
            onChange={(e) => setNewTask(e.target.value)}
            p={3}
            mx={2}
          />
          <Button onClick={addTask} mx={2} px={6} py={3}>
            Add
          </Button>
        </Flex>
      </div>

      {/* Task Elements as a list with edit, delete, up, down buttons */}
      <ol>
        <Flex direction="column" mx={2} gap={1}>
          {tasks.map((task, index) => (
            <li key={task.id}>
              <Box
                mx={2}
                borderRadius="md"
                borderColor="grey.400"
                borderWidth="1px"
              >
                <Flex
                  align="center"
                  justify="space-between"
                  w="100%"
                  p={3}
                  borderRadius="md"
                  bg="gray.300  "
                >
                  <Checkbox.RootProvider value={checkbox}>
                    <Checkbox.Root>
                      <Checkbox.HiddenInput />
                      <Checkbox.Control>
                        <Checkbox.Indicator />
                      </Checkbox.Control>
                    </Checkbox.Root>
                  </Checkbox.RootProvider>
                  <Editable.Root
                    textAlign="start"
                    defaultValue={task.text}
                    activationMode="dblclick"
                    onSubmit={(event) => {
                      const newText = event.currentTarget.textContent || "";
                      updateTaskText(index, newText);
                    }}
                    flex="1"
                    mx={2}
                    my={1}
                    p={2}
                  >
                    <Editable.Preview />
                    <Editable.Input />
                    <Editable.Control>
                      <Editable.EditTrigger asChild>
                        <IconButton variant="ghost" size="xs">
                          <LuPencilLine />
                        </IconButton>
                      </Editable.EditTrigger>
                      <Editable.CancelTrigger asChild>
                        <IconButton variant="outline" size="xs">
                          <LuX />
                        </IconButton>
                      </Editable.CancelTrigger>
                      <Editable.SubmitTrigger asChild>
                        <IconButton variant="outline" size="xs">
                          <LuCheck />
                        </IconButton>
                      </Editable.SubmitTrigger>
                    </Editable.Control>
                  </Editable.Root>

                  <Flex gap={2}>
                    <Button size="sm" onClick={() => deleteTask(index)}>
                      Delete
                    </Button>
                    <Button size="sm" onClick={() => moveTaskUp(index)}>
                      ⬆️
                    </Button>
                    <Button size="sm" onClick={() => moveTaskDown(index)}>
                      ⬇️
                    </Button>
                  </Flex>
                </Flex>
              </Box>
            </li>
          ))}
        </Flex>
      </ol>
    </>
  );
};

export default toDoList;
