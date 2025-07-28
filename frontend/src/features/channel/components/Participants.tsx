import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";
import CallAvatar from "../../../components/CallAvatar";
import { useLocalParticipantStore } from "../store/localParticipant";
import { useParticipantStore } from "../store/remoteParticipant";
import "swiper/css";
import "swiper/css/navigation";

export default function Participants() {
  return (
    <div className="relative px-4 mt-4 mb-24 max-w-[25rem] md:max-w-[50rem]">
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
  const { localParticipant } = useLocalParticipantStore();

  return (
    <>
      {localParticipant && (
        <SwiperSlide className="!w-auto">
          <div
            key={localParticipant.user.userId}
            className="flex space-x-2 participant-group"
          >
            <CallAvatar
              isLocal
              muteCamera
              participantId={localParticipant.user.userId}
              stream={localParticipant.streams.video}
              audioStream={localParticipant.streams.audio}
            />

            {localParticipant.streams.screen && (
              <CallAvatar
                isLocal
                participantId={localParticipant.user.userId}
                stream={localParticipant.streams.screen}
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
  const { participants } = useParticipantStore.getState();

  return (
    <>
      {[...participants.values()].map((participant) => {
        const videoConsumer = participant.consumers?.video;
        const audioConsumer = participant.consumers?.audio;
        const screenConsumer = participant.consumers?.screen;

        return (
          <SwiperSlide key={participant.user.userId} className="!w-auto">
            <div className="flex space-x-2 participant-group">
              <CallAvatar
                participantId={participant.user.userId}
                consumer={videoConsumer}
                audioConsumer={audioConsumer}
              />

              {screenConsumer && (
                <CallAvatar
                  participantId={participant.user.userId}
                  consumer={screenConsumer}
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
