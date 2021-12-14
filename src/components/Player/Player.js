import { useEffect, useState } from "react";
import ReactGA from "react-ga";
import "./Player.css";

function Player(props) {
  const playerId = "ytplayer";
  const defaultVideoId = "guXMb7zLblM";
  let [player, setPlayer] = useState(null);
  let [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    window.onYouTubePlayerAPIReady = function () {
      const newPlayer = new window.YT.Player(playerId, {
        videoId: defaultVideoId,
        playerVars: {
          autoplay: 1,
          loop: 1,
          rel: 0,
          showinfo: 0,
        },
        events: {
          onReady: () => setIsInitialized(true),
          onStateChange: (a) => {
            if (a.data === 0) {
              newPlayer.playVideo();
            }
          },
          onError: () =>
            ReactGA.exception({
              description: `Player doesn't feel well`,
            }),
        },
      });
      setPlayer(newPlayer);
    };
  }, []);

  useEffect(() => {
    if (!player || !player.loadVideoById || !props.videoId) {
      return;
    }

    player.loadVideoById(props.videoId);
  }, [props.videoId, player, isInitialized]);

  return (
    <div className="player">
      <div className="player_header"></div>
      <div id={playerId} className="player_content"></div>
    </div>
  );
}

export default Player;
