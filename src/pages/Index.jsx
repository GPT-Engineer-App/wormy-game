import { Box, Button, Container, Flex, Text } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { FaArrowRight, FaArrowLeft, FaArrowUp, FaArrowDown } from "react-icons/fa";

const cellSize = 20; // Size of each cell in the grid
const numRows = 20;
const numCols = 30;

const Index = () => {
  const [snake, setSnake] = useState([{ x: 8, y: 12 }]);
  const [food, setFood] = useState({ x: 5, y: 5 });
  const [direction, setDirection] = useState({ x: 1, y: 0 });
  const [gameOver, setGameOver] = useState(false);

  // Place food at a new location
  const placeFood = () => {
    let newFoodPosition;
    do {
      newFoodPosition = {
        x: Math.floor(Math.random() * numCols),
        y: Math.floor(Math.random() * numRows),
      };
    } while (snake.some((segment) => segment.x === newFoodPosition.x && segment.y === newFoodPosition.y));
    setFood(newFoodPosition);
  };

  // Move the snake
  const moveSnake = () => {
    if (gameOver) return;

    const newSnake = [...snake];
    const newHead = {
      x: newSnake[0].x + direction.x,
      y: newSnake[0].y + direction.y,
    };

    // Check for collisions with walls
    if (newHead.x >= numCols || newHead.x < 0 || newHead.y >= numRows || newHead.y < 0) {
      setGameOver(true);
      return;
    }

    // Check for collisions with itself
    if (newSnake.some((segment) => segment.x === newHead.x && segment.y === newHead.y)) {
      setGameOver(true);
      return;
    }

    newSnake.unshift(newHead);

    // Check if the snake has eaten the food
    if (newHead.x === food.x && newHead.y === food.y) {
      placeFood();
    } else {
      newSnake.pop();
    }

    setSnake(newSnake);
  };

  // Handle key presses
  const handleKeyPress = (e) => {
    switch (e.key) {
      case "ArrowUp":
        if (direction.y === 0) setDirection({ x: 0, y: -1 });
        break;
      case "ArrowDown":
        if (direction.y === 0) setDirection({ x: 0, y: 1 });
        break;
      case "ArrowLeft":
        if (direction.x === 0) setDirection({ x: -1, y: 0 });
        break;
      case "ArrowRight":
        if (direction.x === 0) setDirection({ x: 1, y: 0 });
        break;
      default:
        break;
    }
  };

  useEffect(() => {
    window.addEventListener("keydown", handleKeyPress);
    const gameInterval = setInterval(moveSnake, 200);

    return () => {
      window.removeEventListener("keydown", handleKeyPress);
      clearInterval(gameInterval);
    };
  }, [snake, direction, gameOver]);

  return (
    <Container maxW="container.xl" centerContent>
      <Flex direction="column" align="center" justify="center" height="100vh">
        <Text fontSize="2xl" mb={4}>
          Worm Game
        </Text>
        <Box width={numCols * cellSize} height={numRows * cellSize} bg="gray.700" position="relative">
          {snake.map((segment, index) => (
            <Box key={index} position="absolute" left={`${segment.x * cellSize}px`} top={`${segment.y * cellSize}px`} width={`${cellSize}px`} height={`${cellSize}px`} bg="green.500" />
          ))}
          <Box position="absolute" left={`${food.x * cellSize}px`} top={`${food.y * cellSize}px`} width={`${cellSize}px`} height={`${cellSize}px`} bg="red.500" />
        </Box>
        {gameOver && (
          <Text fontSize="xl" color="red.500" mt={4}>
            Game Over!
          </Text>
        )}
        <Flex mt={4}>
          <Button onClick={() => setDirection({ x: 0, y: -1 })} m={1}>
            <FaArrowUp />
          </Button>
          <Button onClick={() => setDirection({ x: 0, y: 1 })} m={1}>
            <FaArrowDown />
          </Button>
          <Button onClick={() => setDirection({ x: -1, y: 0 })} m={1}>
            <FaArrowLeft />
          </Button>
          <Button onClick={() => setDirection({ x: 1, y: 0 })} m={1}>
            <FaArrowRight />
          </Button>
        </Flex>
      </Flex>
    </Container>
  );
};

export default Index;
