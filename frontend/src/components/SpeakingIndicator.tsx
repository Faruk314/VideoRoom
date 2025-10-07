import { memo } from "react";
import classNames from "classnames";
import { useChannelStore } from "../features/channel/store/channel";

interface Props {
  participantId: string;
  isDisplayed?: boolean;
  isDisplayStream?: boolean;
}

function SpeakingIndicator({
  participantId,
  isDisplayed,
  isDisplayStream,
}: Props) {
  const isSpeaking = useChannelStore(
    (state) => state.speakingMap[participantId] ?? false
  );

  if (!isSpeaking) return null;

  return (
    <div
      className={classNames(
        "absolute inset-0 border-3 border-green-600 pointer-events-none",
        {
          "border-none": isDisplayed || isDisplayStream,
        }
      )}
    />
  );
}

export default memo(SpeakingIndicator);
