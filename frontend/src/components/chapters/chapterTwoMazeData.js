// Shared reed-maze data for Chapter Two (forward route) and its alt-state (reverse route).
export const REED_MAZE_GRID = [
  [0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0],
];

export const REED_ROUTE_POSITIONS = [
  [7, 2], [6, 2], [5, 2], [4, 2], [4, 1], [3, 1], [2, 1], [1, 1], [1, 2], [0, 2],
  [0, 3], [0, 4], [1, 4], [2, 4], [3, 4], [4, 4], [4, 5], [5, 5], [6, 5], [6, 6],
  [6, 7], [5, 7], [4, 7], [3, 7], [3, 6], [2, 6], [1, 6], [0, 6],
];

export const POSITION_BY_ARROW = {
  ArrowUp: [-1, 0],
  ArrowDown: [1, 0],
  ArrowLeft: [0, -1],
  ArrowRight: [0, 1],
};

export const positionsMatch = (first, second) =>
  first[0] === second[0] && first[1] === second[1];

export const getPositionKey = (position) => `${position[0]}-${position[1]}`;

export const getRouteIndexForPosition = (position) =>
  REED_ROUTE_POSITIONS.findIndex((routePosition) =>
    positionsMatch(routePosition, position)
  );

export const REED_ROUTE_KEY_SET = new Set(
  REED_ROUTE_POSITIONS.map(getPositionKey)
);
