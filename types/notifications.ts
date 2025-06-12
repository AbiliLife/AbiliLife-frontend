export interface NotificationItem {
  id: string;
  title: string;
  message: string;
  date: string;
  day: number;
  month: string;
  isNew?: boolean;
}