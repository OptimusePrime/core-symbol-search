export interface SymbolItem {
  symbol: string | null;
  rotationDeg: string | null;
}

export interface Task {
  objectives: SymbolItem[];
  options: SymbolItem[];
}

export interface GameResult {
  name: string;
  class: string;
  score: number;
  totalTasks: number;
  timestamp: string;
}
