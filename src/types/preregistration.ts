export interface StatsData {
  totalRegistered: number;
  maxDiscountSpots: number;
  spotsRemaining: number;
  isDiscountAvailable: boolean;
  discountPercentage: number;
}

export interface SuccessResult {
  email: string;
  fullName: string;
  queueNumber: number;
  isEligibleForDiscount: boolean;
  discountPercentage: number;
  discountCode?: string;
  spotsRemaining?: number;
}

export type StepType = "form" | "otp" | "success";

export const DEFAULT_STATS: StatsData = {
  totalRegistered: 0,
  maxDiscountSpots: 100,
  spotsRemaining: 100,
  isDiscountAvailable: true,
  discountPercentage: 50,
};
