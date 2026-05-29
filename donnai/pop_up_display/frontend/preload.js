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

  onGenerationProgress: (callback) =>
    ipcRenderer.on('generation-progress', (event, data) => callback(data)),

  onGenerationError: (callback) =>
    ipcRenderer.on('generation-error', (event, error) => callback(error)),

  onPlaybackUpdate: (callback) =>
    ipcRenderer.on('playback-update', (event, data) => callback(data)),

  // Cleanup listeners
  removeAllListeners: () => {
    ipcRenderer.removeAllListeners('music-generated');
    ipcRenderer.removeAllListeners('generation-progress');
    ipcRenderer.removeAllListeners('generation-error');
    ipcRenderer.removeAllListeners('playback-update');
  },
});
