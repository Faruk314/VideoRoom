import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";
import ChannelAvatar from "./ChannelAvatar";
import { useLocalParticipantStore } from "../store/localParticipant";
import { useParticipantStore } from "../store/remoteParticipant";
import { useChannelStore } from "../store/channel";
import classNames from "classnames";
import "swiper/css";
import "swiper/css/navigation";

export default function ChannelParticipants() {
  const participantsHidden = useChannelStore((s) => s.participantsHidden);

  const localParticipant = useLocalParticipantStore(
    (state) => state.localParticipant
  );

  const participantsMap = useParticipantStore((state) => state.participants);

  const remoteParticipants = [...participantsMap.values()];

  return (
    <div
      className={classNames(
        "relative px-4 mt-4 mb-24 max-w-[25rem] md:max-w-[50rem]",
        {
          "opacity-0 pointer-events-none": participantsHidden,
        }
      )}
    >
      <div className="flex items-center space-x-2">
        <Swiper
          modules={[Navigation]}
          slidesPerView="auto"
          slidesPerGroup={1}
          spaceBetween={9}
        >
          {localParticipant && (
            <SwiperSlide className="!w-auto" key={localParticipant.user.userId}>
              <div className="flex space-x-2 participant-group">
                <ChannelAvatar participantId={localParticipant.user.userId} />

                {localParticipant.isStreaming && (
                  <ChannelAvatar
                    participantId={localParticipant.user.userId}
                    isDisplayStream
                  />
                )}
              </div>
            </SwiperSlide>
          )}

          {remoteParticipants.map((participant) => {
            const isStreaming = participant.isStreaming;

            return (
              <SwiperSlide key={participant.user.userId} className="!w-auto">
                <div className="flex space-x-2 participant-group">
                  <ChannelAvatar participantId={participant.user.userId} />

                  {isStreaming && (
                    <ChannelAvatar
                      participantId={participant.user.userId}
                      isDisplayStream
                    />
                  )}
                </div>
              </SwiperSlide>
            );
          })}
        </Swiper>
      </div>
    </div>
  );
}
