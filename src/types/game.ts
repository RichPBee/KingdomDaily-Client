export type GameMode = 'Hidden' | 'Visible';

export type ResourceType = 'population' | 'gold' | 'food';

export interface KingdomStats {
  population: number;
  gold: number;
  food: number;
}

export type ResourceDelta = Partial<Record<ResourceType, number>>;

export interface EventRange {
  min: number;
  max: number;
}

export interface EventDefinition {
  id: string;
  title: string;
  description: string;
  icon: string;
  category: ResourceType;
  impactRanges: Partial<Record<ResourceType, EventRange>>;
}

export interface ResolvedEvent {
  id: string;
  title: string;
  description: string;
  icon: string;
  category: ResourceType;
  impact: ResourceDelta;
}

export interface ActionCard {
  id: string;
  title: string;
  description: string;
  icon: string;
  cost: ResourceDelta;
  benefit: ResourceDelta;
}

export interface TurnHistoryItem {
  round: number; // 1 through 9
  event: ResolvedEvent;
  playedAction: ActionCard;
  statsBefore: KingdomStats;
  statsAfter: KingdomStats;
}

export interface PuzzleData {
  dateStr: string; // "YYYY-MM-DD"
  mode: GameMode;
  seed: string;
  initialStats: KingdomStats;
  events: ResolvedEvent[];
  actions: ActionCard[];
}

export interface LocalGameRecord {
  dateStr: string;
  mode: GameMode;
  score: number;
  survivedRounds: number;
  isVictory: boolean;
  completedAt: string;
  history: TurnHistoryItem[];
}