import { nanoid } from "nanoid";
import React, { useEffect, useRef, useState, Fragment } from "react";
import styled from "styled-components";
import { css } from "styled-components";
const maxHeight = window.innerHeight;
const maxWidth = window.innerWidth;
const widthNode = Math.trunc(
  (maxWidth < maxHeight ? maxHeight : maxWidth) / 50
);

const Food = styled.div.attrs((props) => ({
  style: {
    background: props.background,
    top: `${props.y}px`,
    left: `${props.x}px`,
    width: `${widthNode}px`,
    height: `${widthNode}px`,
  },
}))`
  background-color: red;
  border-radius: 50%;
  position: absolute;
`;
const SnakeNode = styled.div.attrs((props) => ({
  style: {
    backgroundColor: props.color,
    top: `${props.y}px`,
    left: `${props.x}px`,
    width: `${widthNode}px`,
    height: `${widthNode}px`,
  },
}))`
  border-radius: 50%;
  position: absolute;
`;
const ENUM_DIRECTION_MOVE = {
  LEFT: 0,
  RIGHT: 1,
  UP: 2,
  DOWN: 3,
};
const inititalSnake = [{ x: 0, y: 0, id: nanoid() }];
for (let i = 1; i < 3; i++) {
  const length = inititalSnake.length;
  const prevNode = inititalSnake[length - 1];
  const point = {
    x: prevNode.x - widthNode,
    y: prevNode.y,
    id: nanoid(),
  };
  inititalSnake.push(point);
}
const App = () => {
  const ref = useRef(null);
  const [directionMove, setDirectionMove] = useState(ENUM_DIRECTION_MOVE.RIGHT);
  const [snake, setSnake] = useState(inititalSnake);
  const [food, setFood] = useState(null);
  const snakeHead = snake.at(0);
  const makeFood = () => {
    let x = 0,
      y = 0;
    do {
      x = Math.trunc(Math.random() * maxWidth);
      y = Math.trunc(Math.random() * maxHeight);
    } while (x % widthNode !== 0 || y % widthNode !== 0);
    setFood({ x, y });
  };

  useEffect(() => {
    makeFood();
  }, []);
  useEffect(() => {
    const { current } = ref;
    current.focus();
  }, []);
  useEffect(() => {
    const appendNode = () => {
      const length = snake.length;
      const prevNode = snake[length - 1];
      const point = {
        x: prevNode.x,
        y: prevNode.y,
        id: nanoid(),
      };
      switch (directionMove) {
        case ENUM_DIRECTION_MOVE.LEFT:
          point.x = prevNode.x - widthNode;
          break;
        case ENUM_DIRECTION_MOVE.RIGHT:
          point.x = prevNode.x + widthNode;
          break;
        case ENUM_DIRECTION_MOVE.DOWN:
          point.y = prevNode.y + widthNode;
          break;
        case ENUM_DIRECTION_MOVE.UP:
          point.y = prevNode.y - widthNode;
          break;
        default:
          break;
      }
      if (point.x === prevNode.x && point.y === prevNode.y) return;
      setSnake((prevState) => [...prevState, point]);
    };
    if (!food) return;
    const { x: headX, y: headY } = snakeHead;
    const { x: foodX, y: foodY } = food;
    if (headX === foodX && headY === foodY) {
      appendNode();
      makeFood();
    }
  }, [snakeHead, food]);
  useEffect(() => {
    const move = (direction, point) => {
      const { x, y } = point;
      switch (direction) {
        case ENUM_DIRECTION_MOVE.RIGHT:
          return { x: x + widthNode, y };
        case ENUM_DIRECTION_MOVE.LEFT:
          return {
            x: x - widthNode,
            y,
          };
        case ENUM_DIRECTION_MOVE.UP:
          return { x, y: y - widthNode };
        case ENUM_DIRECTION_MOVE.DOWN:
          return {
            x,
            y: y + widthNode,
          };
        default:
          return point;
      }
    };
    const interval = setInterval(
      () =>
        setSnake((prevSnake) => {
          const newSnake = prevSnake.map((e, i, snake) => {
            const { x, y, id } = e;
            if (i === 0) {
              return { ...move(directionMove, { x, y }), id };
            }
            const prevNode = snake[i - 1];
            return {
              ...prevNode,
              id: id,
            };
          });
          return newSnake;
        }),
      100
    );
    return () => {
      clearInterval(interval);
    };
  }, [directionMove]);
  return (
    <Fragment>
      <input
        onKeyDownCapture={(e) => {
          const { key } = e;
          switch (key) {
            case "ArrowLeft":
              if (directionMove === ENUM_DIRECTION_MOVE.RIGHT) return;
              setDirectionMove(ENUM_DIRECTION_MOVE.LEFT);
              break;
            case "ArrowRight":
              if (directionMove === ENUM_DIRECTION_MOVE.LEFT) return;
              setDirectionMove(ENUM_DIRECTION_MOVE.RIGHT);
              break;
            case "ArrowUp":
              if (directionMove === ENUM_DIRECTION_MOVE.DOWN) return;
              setDirectionMove(ENUM_DIRECTION_MOVE.UP);
              break;
            case "ArrowDown":
              if (directionMove === ENUM_DIRECTION_MOVE.UP) return;
              setDirectionMove(ENUM_DIRECTION_MOVE.DOWN);
              break;
            default:
              break;
          }
        }}
        ref={ref}
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          opacity: 0,
        }}
      />
      <div
        onMouseDown={(e) => {
          const x = e.clientX;
          const y = e.clientY;
          if (directionMove <= ENUM_DIRECTION_MOVE.RIGHT) {
            const middleY = maxHeight / 2;
            if (y > middleY) setDirectionMove(ENUM_DIRECTION_MOVE.DOWN);
            else setDirectionMove(ENUM_DIRECTION_MOVE.UP);
          } else {
            const middleX = maxWidth / 2;
            if (x > middleX) setDirectionMove(ENUM_DIRECTION_MOVE.RIGHT);
            else setDirectionMove(ENUM_DIRECTION_MOVE.LEFT);
          }
        }}
        className="area"
        style={{
          height: maxHeight + "px",
          width: maxWidth + "px",
          position: "relative",
          backgroundColor: "black",
          overflow: "hidden",
        }}
      >
        {food && <Food {...food} />}
        {snake.map((e, i) => (
          <SnakeNode
            key={e.id}
            x={e.x}
            y={e.y}
            color={i % 2 === 0 ? "yellow" : "blue"}
          />
        ))}
      </div>
    </Fragment>
  );
};

export default App;
