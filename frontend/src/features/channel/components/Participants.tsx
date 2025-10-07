import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";
import CallAvatar from "../../../components/CallAvatar";
import { useLocalParticipantStore } from "../store/localParticipant";
import { useParticipantStore } from "../store/remoteParticipant";
import classNames from "classnames";
import { useChannelStore } from "../store/channel";
import "swiper/css";
import "swiper/css/navigation";

export default function Participants() {
  const participantsHidden = useChannelStore(
    (state) => state.participantsHidden
  );

  return (
    <div
      className={classNames(
        "relative px-4 mt-4 mb-24 max-w-[25rem] md:max-w-[50rem]",
        {
          "opacity-0 pointer-events-none": participantsHidden,
          "opacity-100": !participantsHidden,
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
          {renderLocalParticipant()}
          {renderRemoteParticipants()}
        </Swiper>
      </div>
    </div>
  );
}

function renderLocalParticipant() {
  const localParticipant = useLocalParticipantStore(
    (state) => state.localParticipant
  );

  return (
    <>
      {localParticipant && (
        <SwiperSlide className="!w-auto">
          <div
            key={localParticipant.user.userId}
            className="flex space-x-2 participant-group"
          >
            <CallAvatar participantId={localParticipant.user.userId} />

            {localParticipant.streams.screen && (
              <CallAvatar
                participantId={localParticipant.user.userId}
                isDisplayStream
              />
            )}
          </div>
        </SwiperSlide>
      )}
    </>
  );
}

function renderRemoteParticipants() {
  const participants = useParticipantStore((state) => state.participants);

  return (
    <>
      {[...participants.values()].map((participant) => {
        const screenConsumer = participant.consumers?.screen;

        return (
          <SwiperSlide key={participant.user.userId} className="!w-auto">
            <div className="flex space-x-2 participant-group">
              <CallAvatar participantId={participant.user.userId} />

              {screenConsumer && (
                <CallAvatar
                  participantId={participant.user.userId}
                  isDisplayStream
                />
              )}
            </div>
          </SwiperSlide>
        );
      })}
    </>
  );
}
