export type EmojiTriplet = [string, string, string];

export interface EmojiSet {
  id: string;
  prompt: string;
  emojis: EmojiTriplet;
  createdAt: string;
  model?: string;
  notes?: string;
}

export interface EmojiGenerationResponse {
  result: EmojiSet;
  raw?: unknown;
}

export interface EmojiGenerationError {
  message: string;
  status?: number;
  recoverable: boolean;
}
