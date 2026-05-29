const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electronAPI', {
  // Existing functionality
  sendEvent: (eventData) => ipcRenderer.send('event-detected', eventData),

  // Music generation APIs
  generateMusicFromText: (prompt, options = {}) =>
    ipcRenderer.invoke('generate-music-text', { prompt, options }),

  generateMusicFromImage: (imagePath, options = {}) =>
    ipcRenderer.invoke('generate-music-image', { imagePath, options }),

  generateMusicFromData: (dataPoints, options = {}) =>
    ipcRenderer.invoke('generate-music-data', { dataPoints, options }),

  styleTransferAudio: (audioPath, style, options = {}) =>
    ipcRenderer.invoke('style-transfer-audio', { audioPath, style, options }),

  continueMusic: (seedAudio, options = {}) =>
    ipcRenderer.invoke('continue-music', { seedAudio, options }),

  // Voice generation & cloning APIs
  cloneVoice: (audioSample, options = {}) =>
    ipcRenderer.invoke('clone-voice', { audioSample, options }),

  generateVoiceFromText: (text, voiceId, options = {}) =>
    ipcRenderer.invoke('generate-voice-text', { text, voiceId, options }),

  generateVoiceFromAudio: (audioPath, voiceId, options = {}) =>
    ipcRenderer.invoke('generate-voice-audio', { audioPath, voiceId, options }),

  listVoiceClones: () =>
    ipcRenderer.invoke('list-voice-clones'),

  deleteVoiceClone: (voiceId) =>
    ipcRenderer.invoke('delete-voice-clone', { voiceId }),

  // Music + Voice synthesis
  addVoiceToMusic: (musicPath, voiceSettings, options = {}) =>
    ipcRenderer.invoke('add-voice-to-music', { musicPath, voiceSettings, options }),

  generateMusicWithVocals: (prompt, voiceSettings, options = {}) =>
    ipcRenderer.invoke('generate-music-with-vocals', { prompt, voiceSettings, options }),

  // Voice effects
  applyVoiceEffect: (audioPath, effectType, options = {}) =>
    ipcRenderer.invoke('apply-voice-effect', { audioPath, effectType, options }),

  // Recording & voice capture
  startVoiceRecording: () =>
    ipcRenderer.invoke('start-voice-recording'),

  stopVoiceRecording: () =>
    ipcRenderer.invoke('stop-voice-recording'),

  // Playback controls
  playAudio: (audioPath) => ipcRenderer.send('play-audio', audioPath),
  stopAudio: () => ipcRenderer.send('stop-audio'),
  pauseAudio: () => ipcRenderer.send('pause-audio'),
  resumeAudio: () => ipcRenderer.send('resume-audio'),

  // File operations
  saveAudio: (audioPath, savePath) =>
    ipcRenderer.invoke('save-audio', { audioPath, savePath }),

  loadAudioFile: () =>
    ipcRenderer.invoke('load-audio-file'),

  // Event listeners
  onMusicGenerated: (callback) =>
    ipcRenderer.on('music-generated', (event, data) => callback(data)),

  onVoiceGenerated: (callback) =>
    ipcRenderer.on('voice-generated', (event, data) => callback(data)),

  onVoiceCloned: (callback) =>
    ipcRenderer.on('voice-cloned', (event, data) => callback(data)),

  onGenerationProgress: (callback) =>
    ipcRenderer.on('generation-progress', (event, data) => callback(data)),

  onGenerationError: (callback) =>
    ipcRenderer.on('generation-error', (event, error) => callback(error)),

  onPlaybackUpdate: (callback) =>
    ipcRenderer.on('playback-update', (event, data) => callback(data)),

  onVoiceRecordingStarted: (callback) =>
    ipcRenderer.on('voice-recording-started', (event, data) => callback(data)),

  onVoiceRecordingStopped: (callback) =>
    ipcRenderer.on('voice-recording-stopped', (event, data) => callback(data)),

  // Cleanup listeners
  removeAllListeners: () => {
    ipcRenderer.removeAllListeners('music-generated');
    ipcRenderer.removeAllListeners('voice-generated');
    ipcRenderer.removeAllListeners('voice-cloned');
    ipcRenderer.removeAllListeners('generation-progress');
    ipcRenderer.removeAllListeners('generation-error');
    ipcRenderer.removeAllListeners('playback-update');
    ipcRenderer.removeAllListeners('voice-recording-started');
    ipcRenderer.removeAllListeners('voice-recording-stopped');
  },
});
