"use client";

import Image from "next/image";
import { useEffect, useEffectEvent, useState, type CSSProperties } from "react";
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
const DEFAULT_GAME_SPEED = 100;
const INITIAL_DIRECTION: GridPosition = { x: 1, y: 0 };
const LEVEL_CONFIGS = [
  { fruitsRequired: 5, speed: 100 },
  { fruitsRequired: 10, speed: 90 },
  { fruitsRequired: 15, speed: 80 },
  { fruitsRequired: 20, speed: 70 },
];

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

function createBoardItemStyle(
  position: GridPosition,
  transitionMs: number
): CSSProperties {
  return {
    width: `${100 / BOARD_SIZE}%`,
    height: `${100 / BOARD_SIZE}%`,
    transform: `translate(${position.x * 100}%, ${position.y * 100}%)`,
    transitionDuration: `${transitionMs}ms`,
  };
}

function getDirectionRotation(direction: GridPosition): number {
  if (direction.x === 1 && direction.y === 0) {
    return 90;
  }

  if (direction.x === 0 && direction.y === 1) {
    return 180;
  }

  if (direction.x === -1 && direction.y === 0) {
    return -90;
  }

  return 0;
}

export function SnakeGame({ mode }: SnakeGameProps) {
  const content = modeContent[mode];
  const isLevelsMode = mode === "levels";
  const [snake, setSnake] = useState<GridPosition[]>(() => createInitialSnake());
  const [direction, setDirection] = useState<GridPosition>(INITIAL_DIRECTION);
  const [fruit, setFruit] = useState<GridPosition>({ x: 14, y: 10 });
  const [score, setScore] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [hasWon, setHasWon] = useState(false);
  const [currentLevel, setCurrentLevel] = useState(1);
  const [fruitsEaten, setFruitsEaten] = useState(0);
  const [fruitsRequired, setFruitsRequired] = useState(
    LEVEL_CONFIGS[0].fruitsRequired
  );
  const [levelComplete, setLevelComplete] = useState(false);
  const [boardInstance, setBoardInstance] = useState(0);

  const currentLevelConfig =
    LEVEL_CONFIGS[currentLevel - 1] ?? LEVEL_CONFIGS[0];
  const gameSpeed = isLevelsMode
    ? currentLevelConfig.speed
    : DEFAULT_GAME_SPEED;
  const snakeTransitionMs = Math.max(Math.round(gameSpeed * 0.82), 55);
  const headRotation = getDirectionRotation(direction);
  const isFinalLevel = currentLevel === LEVEL_CONFIGS.length;
  const statusLabel = hasWon
    ? "Won"
    : levelComplete
      ? "Level Complete"
      : gameOver
        ? "Game Over"
        : "Running";
  const stats = [
    {
      label: "Score",
      value: score.toString(),
    },
    {
      label: "Level",
      value: isLevelsMode ? currentLevel.toString() : "Endless",
    },
    {
      label: "Fruits",
      value: isLevelsMode ? `${fruitsEaten} / ${fruitsRequired}` : `${score}`,
    },
    {
      label: "Mode",
      value: isLevelsMode ? "Levels" : "Free",
    },
  ];

  const handleDirectionChange = useEffectEvent((nextDirection: GridPosition) => {
    setDirection((currentDirection) =>
      isOppositeDirection(currentDirection, nextDirection)
        ? currentDirection
        : nextDirection
    );
  });

  const moveSnake = useEffectEvent(() => {
    if (gameOver || hasWon || levelComplete) {
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

        if (isLevelsMode) {
          const nextFruitsEaten = fruitsEaten + 1;
          setFruitsEaten(nextFruitsEaten);

          if (nextFruitsEaten >= fruitsRequired) {
            if (isFinalLevel) {
              setHasWon(true);
            } else {
              setLevelComplete(true);
            }

            return nextSnake;
          }

          setFruit(createRandomFruit(nextSnake));
          return nextSnake;
        }

        if (nextSnake.length === TOTAL_GRID_CELLS) {
          setHasWon(true);
          return nextSnake;
        }

        setFruit(createRandomFruit(nextSnake));
      }

      return nextSnake;
    });
  });

  function resetBoardState() {
    const initialSnake = createInitialSnake();

    setSnake(initialSnake);
    setDirection(INITIAL_DIRECTION);
    setFruit(createRandomFruit(initialSnake));
    setGameOver(false);
    setHasWon(false);
    setLevelComplete(false);
    setBoardInstance((currentInstance) => currentInstance + 1);
  }

  function restartGame() {
    resetBoardState();
    setScore(0);
    setCurrentLevel(1);
    setFruitsEaten(0);
    setFruitsRequired(LEVEL_CONFIGS[0].fruitsRequired);
  }

  function handleNextLevel() {
    if (!isLevelsMode || isFinalLevel) {
      return;
    }

    const nextLevel = currentLevel + 1;

    resetBoardState();
    setCurrentLevel(nextLevel);
    setFruitsEaten(0);
    setFruitsRequired(
      LEVEL_CONFIGS[nextLevel - 1]?.fruitsRequired ?? LEVEL_CONFIGS[0].fruitsRequired
    );
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
    if (gameOver || hasWon || levelComplete) {
      return;
    }

    const interval = window.setInterval(() => {
      moveSnake();
    }, gameSpeed);

    return () => window.clearInterval(interval);
  }, [gameOver, hasWon, levelComplete, gameSpeed]);

  const boardCells = Array.from({ length: TOTAL_GRID_CELLS }, (_, index) => index);

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

          <div className="inline-flex items-center rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 shadow-sm">
            Status: {statusLabel}
          </div>
        </div>

        <div className="rounded-[1.75rem] bg-[linear-gradient(145deg,_#0f172a,_#1e293b)] p-5 text-white shadow-inner">
          <div className="mb-4 flex flex-col gap-4">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="text-sm font-semibold uppercase tracking-[0.25em] text-emerald-300">
                  Snake Board
                </p>
                <p className="mt-2 text-sm text-slate-300">
                  Use the arrow keys or WASD to move. The snake currently
                  updates every {gameSpeed}ms.
                </p>
              </div>
            </div>

            <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
              {stats.map((stat) => (
                <div
                  key={stat.label}
                  className="rounded-[1.25rem] border border-white/10 bg-white/5 px-4 py-3 shadow-[0_12px_35px_-25px_rgba(15,23,42,0.8)]"
                >
                  <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">
                    {stat.label}
                  </p>
                  <p className="mt-2 text-2xl font-black tracking-tight text-white">
                    {stat.value}
                  </p>
                </div>
              ))}
            </div>

            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.25em] text-emerald-300">
                Current Status
              </p>
              <p className="mt-2 text-sm text-slate-300">
                {statusLabel === "Running"
                  ? "Keep moving and collect the next fruit."
                  : `Game status: ${statusLabel}.`}
              </p>
            </div>
          </div>

          <div className="relative aspect-square w-full overflow-hidden rounded-[1.4rem] border border-white/10 bg-[radial-gradient(circle_at_top,_rgba(52,211,153,0.16),transparent_40%),linear-gradient(180deg,_#111827,_#0b1220)] p-1 shadow-[inset_0_1px_0_rgba(255,255,255,0.06)]">
            <div
              className="absolute inset-1 grid"
              style={{
                gridTemplateColumns: `repeat(${BOARD_SIZE}, minmax(0, 1fr))`,
              }}
            >
              {boardCells.map((cell) => (
                <div
                  key={cell}
                  className="border border-white/[0.06] bg-white/[0.03]"
                />
              ))}
            </div>

            <div key={boardInstance} className="pointer-events-none absolute inset-1">
              {snake.map((segment, index) => (
                <div
                  key={index}
                  className="absolute left-0 top-0 transition-transform ease-linear"
                  style={createBoardItemStyle(segment, snakeTransitionMs)}
                >
                  <div
                    className="relative h-full w-full"
                    style={
                      index === 0
                        ? { transform: `rotate(${headRotation}deg)` }
                        : undefined
                    }
                  >
                    <Image
                      src={
                        index === 0
                          ? "/games/snake/snake-head.png"
                          : "/games/snake/snake-body.png"
                      }
                      alt=""
                      fill
                      unoptimized
                      sizes="(max-width: 768px) 5vw, 2.5vw"
                      className="object-contain drop-shadow-[0_8px_10px_rgba(15,23,42,0.35)]"
                      style={{ imageRendering: "pixelated" }}
                    />
                  </div>
                </div>
              ))}

              <div
                key={`${fruit.x}-${fruit.y}`}
                className="absolute left-0 top-0"
                style={createBoardItemStyle(fruit, 0)}
              >
                <div className="relative h-full w-full">
                  <Image
                    src="/games/snake/apple.png"
                    alt=""
                    fill
                    unoptimized
                    sizes="(max-width: 768px) 5vw, 2.5vw"
                    className="object-contain drop-shadow-[0_8px_10px_rgba(127,29,29,0.35)]"
                    style={{ imageRendering: "pixelated" }}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        {hasWon ? (
          isLevelsMode ? (
            <div className="rounded-[1.5rem] border border-emerald-200 bg-emerald-50 px-5 py-4 text-emerald-700">
              <p className="text-lg font-black">All Levels Complete</p>
              <p className="mt-2 text-sm leading-6">Final score: {score}</p>
              <button
                type="button"
                onClick={restartGame}
                className="mt-4 inline-flex items-center justify-center rounded-full bg-emerald-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-emerald-700"
              >
                Restart Levels
              </button>
            </div>
          ) : (
            <div className="rounded-[1.5rem] border border-emerald-200 bg-emerald-50 px-5 py-4 text-emerald-700">
              <p className="text-lg font-black">
                {"\u{1F389} You filled the entire map!"}
              </p>
              <p className="mt-2 text-sm leading-6">Final score: {score}</p>
              <button
                type="button"
                onClick={restartGame}
                className="mt-4 inline-flex items-center justify-center rounded-full bg-emerald-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-emerald-700"
              >
                Restart
              </button>
            </div>
          )
        ) : null}

        {levelComplete ? (
          <div className="rounded-[1.5rem] border border-amber-200 bg-amber-50 px-5 py-4 text-amber-800">
            <p className="text-lg font-black">Level Complete</p>
            <p className="mt-2 text-sm leading-6">
              You reached the target of {fruitsRequired} fruits for Level{" "}
              {currentLevel}.
            </p>
            <div className="mt-4 flex flex-wrap gap-3">
              <button
                type="button"
                onClick={handleNextLevel}
                className="inline-flex items-center justify-center rounded-full bg-amber-500 px-5 py-3 text-sm font-semibold text-slate-950 transition hover:bg-amber-400"
              >
                Next Level
              </button>
              <button
                type="button"
                onClick={restartGame}
                className="inline-flex items-center justify-center rounded-full border border-amber-300 bg-white px-5 py-3 text-sm font-semibold text-amber-800 transition hover:bg-amber-100"
              >
                Restart
              </button>
            </div>
          </div>
        ) : null}

        {gameOver ? (
          <div className="rounded-[1.5rem] border border-rose-200 bg-rose-50 px-5 py-4 text-rose-700">
            <p className="text-lg font-black">Game Over</p>
            <p className="mt-2 text-sm leading-6">
              Final score: {score}. Hit restart to try again.
            </p>
            <button
              type="button"
              onClick={restartGame}
              className="mt-4 inline-flex items-center justify-center rounded-full bg-rose-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-rose-700"
            >
              Restart
            </button>
          </div>
        ) : null}
      </div>
    </section>
  );
}
