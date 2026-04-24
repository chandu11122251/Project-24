import { generateSudoku, generateMinesweeper } from "./geminiService.js";
import { storePuzzle } from "./puzzleStorage.js";

export const runDailyGeneration = async () => {
  console.log("Starting daily puzzle generation...");

  try {
    // Generate and store Sudoku
    const sudokuData = await generateSudoku();
    await storePuzzle("sudoku", sudokuData);

    // Generate and store Minesweeper
    const minesweeperData = await generateMinesweeper();
    await storePuzzle("minesweeper", minesweeperData);

    console.log("Daily puzzle generation completed successfully.");
  } catch (error) {
    console.error("Failed to generate daily puzzles:", error);
  }
};

// If run directly
if (import.meta.url.endsWith("puzzleGenerator.js")) {
  runDailyGeneration();
}
