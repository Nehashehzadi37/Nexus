import React, { useEffect, useRef,useState } from "react";
import {
  Phone,
  PhoneOff,
  Mic,
  MicOff,
  Video,
  VideoOff,
  Monitor,
} from "lucide-react";

export const VideoCallPage: React.FC = () => {
  const [isCalling, setIsCalling] = useState(false);
  const [micOn, setMicOn] = useState(true);
  const [cameraOn, setCameraOn] = useState(true);
  const [screenSharing, setScreenSharing] = useState(false);
  const [seconds, setSeconds] = useState(0);

  const videoRef = useRef<HTMLVideoElement>(null);
  const screenRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    let timer: ReturnType<typeof setInterval>;

    if (isCalling) {
      timer = setInterval(() => {
        setSeconds((prev) => prev + 1);
      }, 1000);
    }

    return () => clearInterval(timer);
  }, [isCalling]);

useEffect(() => {
  if (cameraOn) {
    navigator.mediaDevices
      .getUserMedia({
        video: true,
        audio: true,
      })
      .then((stream) => {
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
      })
      .catch((err) => {
        console.log(err);
      });
  }
}, [cameraOn]); 

  const formatTime = () => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;

    return `${String(mins).padStart(2, "0")}:${String(secs).padStart(
      2,
      "0"
    )}`;
  };

  const startCall = () => {
    setIsCalling(true);
    setSeconds(0);
  };

  const endCall = () => {
    setIsCalling(false);
    setSeconds(0);
    setScreenSharing(false);
  };

  return (
    <section className="space-y-6">

      {/* Header */}
      <header>
        <h1 className="text-3xl font-bold text-gray-900">
          Video Calling
        </h1>

        <p className="text-gray-600 mt-2">
          Start secure meetings with investors and entrepreneurs.
        </p>
      </header>

      {/* Status */}
      <div className="flex items-center justify-between rounded-xl bg-white shadow p-4 border">
        <div>
          <h2 className="font-semibold text-lg">
            {isCalling ? "Call in Progress" : "No Active Call"}
          </h2>

          <p className="text-sm text-gray-500">
            {isCalling
              ? `Duration: ${formatTime()}`
              : "Click Start Call to begin"}
          </p>
        </div>

        <span
          className={`px-3 py-1 rounded-full text-sm font-medium ${
            isCalling
              ? "bg-green-100 text-green-700"
              : "bg-red-100 text-red-700"
          }`}
        >
          {isCalling ? "Connected" : "Disconnected"}
        </span>
      </div>

      {/* Video Screens */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

        {/* Local Video */}
       <div className="h-72 rounded-xl bg-gray-900 overflow-hidden shadow">
  {cameraOn ? (
    <video
      ref={videoRef}
      autoPlay
      playsInline
      muted
      className="w-full h-full object-cover"
    />
  ) : (
    <div className="flex h-full items-center justify-center text-white text-lg">
      Camera Off
    </div>
  )}
</div>

        {/* Remote Video */}
        <div className="h-72 rounded-xl bg-gray-800 flex items-center justify-center text-white text-lg shadow">
          {isCalling ? "👤 Remote Participant" : "Waiting for Call"}
        </div>
      </div>

            {/* Controls */}
      <div className="rounded-xl border bg-white p-6 shadow">
        <div className="flex flex-wrap justify-center gap-4">

          {/* Start Call */}
          <button
            onClick={startCall}
            disabled={isCalling}
            className={`flex items-center gap-2 px-5 py-3 rounded-lg font-medium transition ${
              isCalling
                ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                : "bg-green-600 hover:bg-green-700 text-white"
            }`}
          >
            <Phone size={18} />
            Start Call
          </button>

          {/* End Call */}
          <button
            onClick={endCall}
            disabled={!isCalling}
            className={`flex items-center gap-2 px-5 py-3 rounded-lg font-medium transition ${
              !isCalling
                ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                : "bg-red-600 hover:bg-red-700 text-white"
            }`}
          >
            <PhoneOff size={18} />
            End Call
          </button>

          {/* Mic */}
          <button
            onClick={() => setMicOn(!micOn)}
            className="flex items-center gap-2 px-5 py-3 rounded-lg bg-gray-100 hover:bg-gray-200"
          >
            {micOn ? <Mic size={18} /> : <MicOff size={18} />}
            {micOn ? "Mute Mic" : "Unmute Mic"}
          </button>

          {/* Camera */}
          <button
            onClick={() => setCameraOn(!cameraOn)}
            className="flex items-center gap-2 px-5 py-3 rounded-lg bg-gray-100 hover:bg-gray-200"
          >
            {cameraOn ? <Video size={18} /> : <VideoOff size={18} />}
            {cameraOn ? "Turn Camera Off" : "Turn Camera On"}
          </button>

          {/* Screen Share */}
          <button
            onClick={async () => {
  if (!screenSharing) {
    try {
      const screenStream = await navigator.mediaDevices.getDisplayMedia({
        video: true,
      });

      if (screenRef.current) {
  screenRef.current.srcObject = screenStream;
  await screenRef.current.play();
}

screenStream.getVideoTracks()[0].onended = () => {
  setScreenSharing(false);

  if (screenRef.current) {
    screenRef.current.srcObject = null;
  }
};

      setScreenSharing(true);
    } catch (err) {
      console.log(err);
    }
  } else {
    if (screenRef.current?.srcObject) {
      const tracks = (screenRef.current.srcObject as MediaStream).getTracks();
      tracks.forEach(track => track.stop());

      screenRef.current.srcObject = null;
    }

    setScreenSharing(false);
  }
}}
            className={`flex items-center gap-2 px-5 py-3 rounded-lg font-medium transition ${
              screenSharing
                ? "bg-blue-600 text-white"
                : "bg-gray-100 hover:bg-gray-200"
            }`}
          >
            <Monitor size={18} />
            {screenSharing ? "Stop Sharing" : "Share Screen"}
          </button>

        </div>

        {/* Screen Share Status */}
        {screenSharing && (
  <div className="mt-6">
    <h3 className="text-lg font-semibold mb-3">
      Shared Screen
    </h3>

    <video
      ref={screenRef}
      autoPlay
      playsInline
      muted
      className="w-full h-96 rounded-xl border object-contain bg-black"
    />
  </div>
)}
      </div>

    </section>
  );
};