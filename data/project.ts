export enum ProjectStatus {
  Draft = 1,
  Review,
  Rejected,
  Reopened,
  Approved,
  Active = 10,
  Cancelled,
  Suspended,
  Completed = 20,
  PaymentPending,
  PaymentFailed,
  PaymentSuccessful,
  PaymentRefunded,
  PaymentCancelled,
  Failed = 50,
  Archived = 100,
}

export enum DonationStatus {
  Pending = 1,
  Processing = 2,
  Successful = 3,
  Failed = 4,
  Refunded = 5,
  Cancelled = 6,
}
