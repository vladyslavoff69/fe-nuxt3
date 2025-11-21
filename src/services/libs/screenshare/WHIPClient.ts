import negotiateConnectionWithClientOffer from '~/services/libs/screenshare/negotiateConnectionWithClientOffer'

/**
 * WHIPClient broadcasts a MediaStream (screen or camera) over WebRTC using WHIP for signaling.
 *
 * Usage:
 *   // inside a user gesture (e.g. button click):
 *   const stream = await navigator.mediaDevices.getDisplayMedia({ video: true, audio: true });
 *   const client = new WHIPClient("YOUR_WHIP_URL", videoElement);
 *   await client.ingest(stream);
 */
export default class WHIPClient {
  private readonly endpoint: string
  private videoElement: HTMLVideoElement
  private readonly peerConnection: RTCPeerConnection
  private localStream: MediaStream | undefined

  constructor (endpoint: string, videoElement: HTMLVideoElement) {
    this.endpoint = endpoint
    this.videoElement = videoElement
    // Initialize RTCPeerConnection with Cloudflare STUN
    this.peerConnection = new RTCPeerConnection({
      iceServers: [{ urls: 'stun:stun.cloudflare.com:3478' }],
      bundlePolicy: 'max-bundle',
    })

    // When negotiation is needed, use WHIP protocol
    this.peerConnection.addEventListener('negotiationneeded', async () => {
      await negotiateConnectionWithClientOffer(this.peerConnection, this.endpoint)
    })
  }

  /**
   * Ingests a pre-captured MediaStream into the PeerConnection and renders locally.
   * Must be called after a user gesture.
   */
  async ingest (stream: MediaStream) {
    this.localStream = stream
    this.videoElement.srcObject = stream
    stream?.getTracks()?.forEach((track) => {
      const transceiver: RTCRtpTransceiver = this.peerConnection.addTransceiver(track, { direction: 'sendonly' })
      if (track.kind === 'video' && transceiver.sender.track) {
        transceiver.sender.track.applyConstraints({ width: 1280, height: 720 })
      }
    })
    // 'negotiationneeded' will fire automatically
  }

  /**
   * Terminates the WHIP session and stops media.
   */
  async disconnectStream () {
    let _a: any
    try {
      await fetch(this.endpoint, { method: 'DELETE', mode: 'cors' })
    } catch (e) {
      console.error('Error terminating WHIP session', e)
    }

    this.peerConnection.close();

    // eslint-disable-next-line no-unused-expressions,@typescript-eslint/no-unused-expressions
    (_a = this.localStream) === null || _a === void 0 ? void 0 : _a?.getTracks()?.forEach((track: any) => track?.stop())
  }
}
