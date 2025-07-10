import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function getPreetyTime(seconds: number) {
  let time;
  if (seconds > 60 * 2) {
    time = `${Math.floor(seconds / 60)} min ${Math.floor(seconds % 60)} sec`;
  } else {
    time = `${seconds} seconds`;
  }

  return time;
}

export function checkDifference(expiryDateString: Date) {
  let expiryDate = new Date(expiryDateString).getTime();
  let now = new Date().getTime();

  const diffMili = expiryDate - now;
  const diffSeconds = Math.floor(diffMili / 1000);

  return diffSeconds;
}

export function addMinutes(date: Date, minutes: number) {
  return new Date(date.getTime() + minutes * 60000);
}

export function bytesToMB(bytes: number) {
  return Number(bytes / (1000 * 1000));
}

export function MBtoBytes(MB: number) {
  return MB * 1000 * 1000;
}

const SIZE_COST_COEFF = 0.01;
const TIME_COST_COEFF = 0.00002;

export function CreationCostCalculation(bytes: number, minutes: number) {
  let MB = bytesToMB(bytes);

  let sizeCost = SizeOnlyCost(MB);
  let timeCost = TimeCost(minutes, MB);

  let totalCost = sizeCost + timeCost;

  // to round to 2nd place (2.7777 = 2.78, 3.834782 = 3.83)
  totalCost = Math.round((totalCost + Number.EPSILON) * 100) / 100;

  return totalCost;
}

export function SizeOnlyCost(MB: number) {
  return MB * SIZE_COST_COEFF;
}

export function AddedSizeCost(MB: number, remaining_minutes: number) {
  const costPerMB = SIZE_COST_COEFF + remaining_minutes * TIME_COST_COEFF;
  const totlCost = MB * costPerMB;

  return totlCost;
}

export function TimeCost(minutes: number, MB: number) {
  return minutes * MB * TIME_COST_COEFF;
}
