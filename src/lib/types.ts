export interface SymbolItem {
  symbol: string | null;
  rotationDeg: string | null;
}

export interface Task {
  objectives: SymbolItem[];
  options: SymbolItem[];
}

export interface VasResponse {
  questionId: string;
  value: number;
}

export interface GameResult {
  name: string;
  class: string;
  measurementNumber: 1 | 2 | 3 | 4;
  group: "A" | "B";
  score: number;
  totalTasks: number;
  vasResponses: VasResponse[];
  timestamp: string;
}
