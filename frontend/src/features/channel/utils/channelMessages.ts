import type {
  IChannelMessagesData,
  IChannelMessage,
} from "../types/channelMessages";

function updateMessagesInCache(
  oldData: IChannelMessagesData,
  newMessage: IChannelMessage
) {
  if (!oldData) return oldData;

  const lastPageIndex = oldData.pages.length - 1;
  const lastPage = oldData.pages[lastPageIndex];

  const newMessages = [newMessage, ...lastPage.messages];

  const newLastPage = {
    ...lastPage,
    messages: newMessages,
  };

  const newPages = oldData.pages.map((page, index) =>
    index === lastPageIndex ? newLastPage : page
  );

  return {
    ...oldData,
    pages: newPages,
  };
}

export { updateMessagesInCache };
