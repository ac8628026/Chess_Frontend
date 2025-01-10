// VideoChat.jsx
import { useEffect, useRef, useState, useContext } from 'react';
import { useSocket } from '../useContext/SocketContext';
import { RoomContext } from '../useContext/RoomContext';
import mute from '../assets/mute.png';
import unmute from '../assets/unmute.png';
import videocam from '../assets/videocam.png';
import videocam_off from '../assets/videocam_off.png';


const VideoChat = () => {
  const { roomId } = useContext(RoomContext);
  const socket = useSocket();
  const localVideoRef = useRef(null);
  const remoteVideoRef = useRef(null);
  const localStreamRef = useRef(null);
  const peerConnectionRef = useRef(null);
  const [isConnected, setIsConnected] = useState(false);
  const [incomingCall, setIncomingCall] = useState(false);
  const [isAudioEnabled, setIsAudioEnabled] = useState(true);
 const [isVideoEnabled, setIsVideoEnabled] = useState(true);

  useEffect(() => {
    if (!socket) return;

    // Configuration for the RTCPeerConnection
    const configuration = {
      iceServers: [
        {
          urls: 'stun:stun.l.google.com:19302'
        }
      ]
    };

    // Create a new RTCPeerConnection
    const peerConnection = new RTCPeerConnection(configuration);
    peerConnectionRef.current = peerConnection;

    // Handle incoming ice candidates from remote peer
    peerConnection.onicecandidate = event => {
      if (event.candidate) {
        console.log('Sending ice candidate', event.candidate)
        socket.emit('ice-candidate', { candidate: event.candidate, room: roomId });
      }
    };

    // Handle incoming media stream from remote peer
    peerConnection.ontrack = event => {
      console.log('Received remote stream', event.streams[0]);
      remoteVideoRef.current.srcObject = event.streams[0];
    };

    // Listen for offers
    socket.on('offer', async (data) => {
      if (data.room === roomId) {
        console.log('Offer received', data.offer, peerConnection);
        await peerConnection.setRemoteDescription(new RTCSessionDescription(data.offer));
        setIncomingCall(true); // Set incoming call state to true
      }
    });

    // Listen for answers
    socket.on('answer', async (data) => {
      if (data.room === roomId) {
        console.log('Answer received', data.answer, peerConnection);
        await peerConnection.setRemoteDescription(new RTCSessionDescription(data.answer));
        setIsConnected(true); // Set connected state to true
      }
    });

    // Listen for ICE candidates
    socket.on('ice-candidate', (data) => {

      if (data.room === roomId) {
        console.log('Received ice candidate', data.candidate, peerConnection);
        peerConnection.addIceCandidate(new RTCIceCandidate(data.candidate));
      }
    });

    // Cleanup on component unmount
    return () => {
      peerConnection.close();
      localStreamRef.current?.getTracks().forEach(track => track.stop());
      socket.off('offer');
      socket.off('answer');
      socket.off('ice-candidate');
    };
  }, [socket, roomId]);

  // Function to get user media
  const getUserMedia = async () => {
    try {
      
      const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
      
      localVideoRef.current.srcObject = stream;
      localStreamRef.current = stream;

      if (peerConnectionRef.current.signalingState !== 'closed') {
        // Add the local stream tracks to the peer connection
        stream.getTracks().forEach(track => peerConnectionRef.current.addTrack(track, stream));
      }
    } catch (error) {
      console.error('Error accessing media devices.', error);
    }
  };

  // Function to create and send an offer
  const createOffer = async () => {
    await getUserMedia();
    console.log('Creating offer1');
    const offer = await peerConnectionRef.current.createOffer();
    await peerConnectionRef.current.setLocalDescription(offer);
    socket.emit('offer', { offer, room: roomId });
    console.log('Offer sent1');
  };

  // Function to create and send an answer
  const createAnswer = async () => {
    console.log('Creating answer1')
    await getUserMedia();
    const answer = await peerConnectionRef.current.createAnswer();
    await peerConnectionRef.current.setLocalDescription(answer);
    socket.emit('answer', { answer, room: roomId });
    console.log('Answer sent1')
    setIsConnected(true); // Set connected state to true
  };
// Function to toggle video
const toggleVideo = () => {
  const videoTrack = localStreamRef.current.getVideoTracks()[0];
  if (videoTrack) {
    videoTrack.enabled = !videoTrack.enabled;
    setIsVideoEnabled(videoTrack.enabled);
  }
};
// Function to toggle audio
const toggleAudio = () => {
  const audioTrack = localStreamRef.current.getAudioTracks()[0];
  if (audioTrack) {
    audioTrack.enabled = !audioTrack.enabled;
    setIsAudioEnabled(audioTrack.enabled);
  }
};
  return (
    <div className='m-2 p-2 flex flex-col items-center  '>
      <div className='flex flex-col sm:flex-row md:flex-col  m-3'>
      <video ref={localVideoRef} autoPlay muted  className="w-[328px] h-[246px] min-w-[320px] border m-1 border-black bg-black" ></video>
      <video  ref={remoteVideoRef} autoPlay className="w-[328px] h-[246px] border m-1 border-black bg-black "></video>
      </div>
      {!isConnected && !incomingCall && (
      <button onClick={createOffer} className=" text-white p-2.5 bg-green-700 rounded-lg hover:bg-green-950 w-full">Join Call</button>
    )}
    
    {!isConnected && incomingCall && (
      <button onClick={createAnswer} className="text-white p-2.5 bg-green-700 rounded-lg hover:bg-green-950 w-full">Accept Call</button>
    )}

    {isConnected && (
      <div className="flex m-5 justify-between">
        <button onClick={toggleAudio} className="bg-black rounded-full p-2 h-12 w-12">
          {isAudioEnabled ? <img className=" " src={unmute} alt="Mute" /> : <img className=" "  src={mute} alt="Unmute" />}
        </button>
        <button onClick={toggleVideo} className="bg-black rounded-full p-3 h-12 w-12">
          {isVideoEnabled ? <img className="" src={videocam} alt="Mute" /> :  <img className=" "  src={videocam_off} alt="Unmute" />}
        </button>
      </div>
    )}
  </div>
  );
};

export default VideoChat;
