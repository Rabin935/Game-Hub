"use client";

import { useEffect, useEffectEvent, useState } from "react";
import type { SnakeGameMode } from "@/types/game";

type SnakeGameProps = {
  mode: SnakeGameMode;
};

type GridPosition = {
  x: number;
  y: number;
};

const BOARD_SIZE = 20;
const TOTAL_GRID_CELLS = BOARD_SIZE * BOARD_SIZE;
const GAME_SPEED = 200;
const INITIAL_DIRECTION: GridPosition = { x: 1, y: 0 };

const modeContent: Record<
  SnakeGameMode,
  { badge: string; title: string; description: string; accent: string }
> = {
  free: {
    badge: "Free Mode",
    title: "Endless Snake Run",
    description:
      "Move freely, collect food, and keep the snake alive for as long as you can.",
    accent: "bg-emerald-100 text-emerald-700",
  },
  levels: {
    badge: "Levels Mode",
    title: "Stage-Based Snake Challenge",
    description:
      "Take on level goals with a more guided progression and steadily rising pressure.",
    accent: "bg-sky-100 text-sky-700",
  },
};

function createInitialSnake(): GridPosition[] {
  return [
    { x: 10, y: 10 },
    { x: 9, y: 10 },
    { x: 8, y: 10 },
  ];
}

function isSamePosition(a: GridPosition, b: GridPosition): boolean {
  return a.x === b.x && a.y === b.y;
}

function isOppositeDirection(
  current: GridPosition,
  next: GridPosition
): boolean {
  return current.x + next.x === 0 && current.y + next.y === 0;
}

function createRandomFruit(occupiedCells: GridPosition[]): GridPosition {
  let nextFruit = { x: 5, y: 5 };

  do {
    nextFruit = {
      x: Math.floor(Math.random() * BOARD_SIZE),
      y: Math.floor(Math.random() * BOARD_SIZE),
    };
  } while (
    occupiedCells.some((segment) => isSamePosition(segment, nextFruit))
  );

  return nextFruit;
}

export function SnakeGame({ mode }: SnakeGameProps) {
  const content = modeContent[mode];
  const [snake, setSnake] = useState<GridPosition[]>(() => createInitialSnake());
  const [direction, setDirection] = useState<GridPosition>(INITIAL_DIRECTION);
  const [fruit, setFruit] = useState<GridPosition>({ x: 14, y: 10 });
  const [score, setScore] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [hasWon, setHasWon] = useState(false);

  const handleDirectionChange = useEffectEvent((nextDirection: GridPosition) => {
    setDirection((currentDirection) =>
      isOppositeDirection(currentDirection, nextDirection)
        ? currentDirection
        : nextDirection
    );
  });

  const moveSnake = useEffectEvent(() => {
    if (gameOver || hasWon) {
      return;
    }

    setSnake((currentSnake) => {
      const nextHead = {
        x: currentSnake[0].x + direction.x,
        y: currentSnake[0].y + direction.y,
      };

      const hitWall =
        nextHead.x < 0 ||
        nextHead.x >= BOARD_SIZE ||
        nextHead.y < 0 ||
        nextHead.y >= BOARD_SIZE;

      const hasEatenFruit = isSamePosition(nextHead, fruit);
      const movedSnake = [nextHead, ...currentSnake];
      const nextSnake = hasEatenFruit ? movedSnake : movedSnake.slice(0, -1);
      const hitSelf = nextSnake
        .slice(1)
        .some((segment) => isSamePosition(segment, nextHead));

      if (hitWall || hitSelf) {
        setGameOver(true);
        return currentSnake;
      }

      if (hasEatenFruit) {
        setScore((currentScore) => currentScore + 1);

        if (nextSnake.length === TOTAL_GRID_CELLS) {
          setHasWon(true);
          return nextSnake;
        }

        setFruit(createRandomFruit(nextSnake));
      }

      return nextSnake;
    });
  });

  function restartGame() {
    const initialSnake = createInitialSnake();

    setSnake(initialSnake);
    setDirection(INITIAL_DIRECTION);
    setFruit(createRandomFruit(initialSnake));
    setScore(0);
    setGameOver(false);
    setHasWon(false);
  }

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      switch (event.key) {
        case "ArrowUp":
        case "w":
        case "W":
          handleDirectionChange({ x: 0, y: -1 });
          break;
        case "ArrowDown":
        case "s":
        case "S":
          handleDirectionChange({ x: 0, y: 1 });
          break;
        case "ArrowLeft":
        case "a":
        case "A":
          handleDirectionChange({ x: -1, y: 0 });
          break;
        case "ArrowRight":
        case "d":
        case "D":
          handleDirectionChange({ x: 1, y: 0 });
          break;
        default:
          break;
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  useEffect(() => {
    if (gameOver || hasWon) {
      return;
    }

    const interval = window.setInterval(() => {
      moveSnake();
    }, GAME_SPEED);

    return () => window.clearInterval(interval);
  }, [gameOver, hasWon]);

  const snakeHead = snake[0];
  const gridCells = Array.from({ length: BOARD_SIZE * BOARD_SIZE }, (_, index) => {
    const x = index % BOARD_SIZE;
    const y = Math.floor(index / BOARD_SIZE);
    const isHead = snakeHead ? isSamePosition(snakeHead, { x, y }) : false;
    const isBody = snake
      .slice(1)
      .some((segment) => isSamePosition(segment, { x, y }));
    const isFruitCell = isSamePosition(fruit, { x, y });

    return {
      key: `${x}-${y}`,
      isHead,
      isBody,
      isFruitCell,
    };
  });

  return (
    <section className="w-full max-w-3xl rounded-[2rem] border border-white/70 bg-white/85 p-6 shadow-[0_30px_80px_-40px_rgba(15,23,42,0.55)] backdrop-blur sm:p-8">
      <div className="flex flex-col gap-5">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <span
              className={`inline-flex rounded-full px-4 py-2 text-sm font-semibold ${content.accent}`}
            >
              {content.badge}
            </span>
            <h2 className="mt-4 text-3xl font-black tracking-tight text-slate-900">
              {content.title}
            </h2>
            <p className="mt-3 max-w-2xl text-base leading-7 text-slate-600">
              {content.description}
            </p>
          </div>

          <div className="flex flex-wrap gap-3">
            <div className="rounded-2xl bg-slate-100 px-4 py-3">
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">
                Score
              </p>
              <p className="mt-1 text-2xl font-black text-slate-900">{score}</p>
            </div>
            <div className="rounded-2xl bg-slate-100 px-4 py-3">
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">
                Status
              </p>
              <p className="mt-1 text-sm font-bold text-slate-900">
                {hasWon ? "Won" : gameOver ? "Game Over" : "Running"}
              </p>
            </div>
          </div>
        </div>

        <div className="rounded-[1.75rem] bg-[linear-gradient(145deg,_#0f172a,_#1e293b)] p-5 text-white shadow-inner">
          <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.25em] text-emerald-300">
                Snake Board
              </p>
              <p className="mt-2 text-sm text-slate-300">
                Use the arrow keys or WASD to move. The snake updates every
                200ms.
              </p>
            </div>
            <button
              type="button"
              onClick={restartGame}
              className="inline-flex items-center justify-center rounded-full bg-emerald-500 px-5 py-3 text-sm font-semibold text-slate-950 transition hover:bg-emerald-400"
            >
              Restart
            </button>
          </div>

          <div
            className="grid aspect-square w-full overflow-hidden rounded-[1.4rem] border border-white/10 bg-[linear-gradient(180deg,_#111827,_#0f172a)] p-1"
            style={{
              gridTemplateColumns: `repeat(${BOARD_SIZE}, minmax(0, 1fr))`,
            }}
          >
            {gridCells.map((cell) => (
              <div
                key={cell.key}
                className={`rounded-[0.22rem] border border-white/4 ${
                  cell.isHead
                    ? "bg-emerald-300"
                    : cell.isBody
                      ? "bg-emerald-500"
                      : cell.isFruitCell
                        ? "bg-rose-400"
                        : "bg-white/4"
                }`}
              />
            ))}
          </div>
        </div>

        {hasWon ? (
          <div className="rounded-[1.5rem] border border-emerald-200 bg-emerald-50 px-5 py-4 text-emerald-700">
            <p className="text-lg font-black">
              {"\u{1F389} You filled the entire map!"}
            </p>
            <p className="mt-2 text-sm leading-6">Final score: {score}</p>
          </div>
        ) : null}

        {gameOver ? (
          <div className="rounded-[1.5rem] border border-rose-200 bg-rose-50 px-5 py-4 text-rose-700">
            <p className="text-lg font-black">Game Over</p>
            <p className="mt-2 text-sm leading-6">
              Final score: {score}. Hit restart to try again.
            </p>
          </div>
        ) : null}
      </div>
    </section>
  );
}
