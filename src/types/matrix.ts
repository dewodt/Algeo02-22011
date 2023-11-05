import { type } from "os";
import type { RGB } from "./image";

export type hsv = [number,number,number];
export type Matrix<T> = T[][];
export type Array<T> = T[];

export type RGBMatrix = Matrix<RGB>;
export type rgbnxnx = Array<RGB>;
export type hsvarray = Array<hsv>;