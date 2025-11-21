/**
 * Perform the WHIP (WHEP) SDP exchange for playback.
 * @param {RTCPeerConnection} pc
 * @param {string} endpoint  the WHEP playback URL (webRTC/play)
 */
export default async function negotiateConnectionWithClientOffer (pc: RTCPeerConnection, endpoint: string) {
  // 1) Tell the server we only want to receive video
  pc.addTransceiver('video', { direction: 'recvonly' })
  // (Optional: receive audio too)
  // pc.addTransceiver('audio', { direction: 'recvonly' });

  // 2) Create and set the local SDP offer
  const offer = await pc.createOffer()
  await pc.setLocalDescription(offer)

  // 3) POST the SDP offer to the playback endpoint
  const res = await fetch(endpoint, {
    method: 'POST',
    mode: 'cors',
    headers: {
      'Content-Type': 'application/sdp'
    },
    body: offer.sdp
  })

  if (!res.ok) {
    const text = await res.text()
    useGeneralNotify({
      type: 'error',
      title: 'WHEP negotiation failed',
      description: `WHEP negotiation failed (status ${res.status}): ${text}`,
    })

    return
  }

  // 4) Apply the SDP answer you get back
  const answerSdp = await res.text()
  await pc.setRemoteDescription({ type: 'answer', sdp: answerSdp })
}
