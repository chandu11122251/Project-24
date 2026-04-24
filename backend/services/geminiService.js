import { GoogleGenerativeAI } from "@google/generative-ai";
import dotenv from "dotenv";

dotenv.config();

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

export const generateSudoku = async () => {
  const model = genAI.getGenerativeModel({ model: "gemini-pro" });
  const prompt = `
    Generate a 9x9 Sudoku puzzle. 
    Return the result in JSON format with two fields:
    1. "initial": A 2D array of strings where '0' represents empty cells.
    2. "solution": A 2D array of strings representing the full solution.
    Ensure the puzzle has a unique solution and is of medium difficulty.
    Only return the JSON.
  `;

  try {
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    // Clean up possible markdown code blocks
    const cleanedText = text.replace(/```json|```/g, "").trim();
    return JSON.parse(cleanedText);
  } catch (error) {
    console.error("Error generating Sudoku:", error);
    throw error;
  }
};

export const generateMinesweeper = async () => {
  const model = genAI.getGenerativeModel({ model: "gemini-pro" });
  const prompt = `
    Generate an 8x8 Minesweeper grid with exactly 10 mines.
    Return the result in JSON format with one field:
    1. "mineMap": A 2D array of booleans where true represents a mine.
    Ensure the mines are distributed randomly.
    Only return the JSON.
  `;

  try {
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    const cleanedText = text.replace(/```json|```/g, "").trim();
    return JSON.parse(cleanedText);
  } catch (error) {
    console.error("Error generating Minesweeper:", error);
    throw error;
  }
};
