import InfiniteScroll from "react-infinite-scroll-component";
import { Message } from "../../../components/Message";
import { useChannelMessagesQuery } from "../queries/channelMessages";
import { useChannelStore } from "../store/channel";
import { Spinner } from "../../../components/loaders/Spinner";

export default function ChannelChat() {
  const currentChannel = useChannelStore((state) => state.currentChannel);
  const { hasNextPage, data, isFetchingNextPage, fetchNextPage } =
    useChannelMessagesQuery(currentChannel?.id ?? "");

  return (
    <div
      id="chat-scroll"
      className="flex flex-col-reverse overflow-y-auto py-2 relative h-full mx-2 mb-2 scrollbar-thin scrollbar-thumb-white/10 scrollbar-track-transparent"
    >
      <InfiniteScroll
        dataLength={data?.pages.flatMap((p) => p.messages).length ?? 0}
        next={() => {
          if (isFetchingNextPage) return;
          if (!hasNextPage) return;
          fetchNextPage();
        }}
        hasMore={hasNextPage ?? false}
        inverse={true}
        scrollableTarget="chat-scroll"
        loader={false}
      >
        {data?.pages
          .flatMap((page) => page.messages)
          .reverse()
          .map((message, index, allMessages) => {
            const previousMessage = allMessages[index - 1];
            const isSameSenderAsPrevious =
              previousMessage?.sender?.userId === message?.sender?.userId;

            return (
              <Message
                key={message?.id}
                isSameSenderAsPrevious={isSameSenderAsPrevious}
                senderName={message?.sender?.userName}
                createdAt={message?.createdAt}
                message={message?.content}
              />
            );
          })}
      </InfiniteScroll>

      {isFetchingNextPage && (
        <div className="p-4 self-center">
          <Spinner className="text-blue-400" />
        </div>
      )}
    </div>
  );
}
