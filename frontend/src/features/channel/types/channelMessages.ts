interface IChannelMessage {
  id: string;
  content: string;
  createdAt: Date;
  sender: {
    userId: string;
    userName: string;
  };
  optimistic?: boolean;
}

interface IChannelMessagesData {
  pages: IChannelMessagesPage[];
  pageParams: Array<number>;
}

interface IChannelMessagesPage {
  messages: IChannelMessage[];
  currentPage: number;
  nextPage: number | null;
}

export type { IChannelMessage, IChannelMessagesData };
