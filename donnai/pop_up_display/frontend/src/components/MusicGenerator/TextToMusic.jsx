import React, { useState, useRef, useEffect } from 'react';
import './TextToMusic.css';

export function TextToMusic() {
  const [prompt, setPrompt] = useState('');
  const [duration, setDuration] = useState(30);
  const [style, setStyle] = useState('pop');
  const [bpm, setBpm] = useState(128);
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [generatedAudio, setGeneratedAudio] = useState(null);
  const [error, setError] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef(null);

  // Listen for generation progress
  useEffect(() => {
    window.electronAPI?.onGenerationProgress((data) => {
      setProgress(data.progress || 0);
    });

    window.electronAPI?.onMusicGenerated((data) => {
      setGeneratedAudio(data);
      setLoading(false);
      setProgress(0);
    });

    window.electronAPI?.onGenerationError((error) => {
      setError(error.message);
      setLoading(false);
    });

    return () => {
      window.electronAPI?.removeAllListeners?.();
    };
  }, []);

  const handleGenerate = async () => {
    if (!prompt.trim()) {
      setError('Please enter a music description');
      return;
    }

    setLoading(true);
    setError(null);
    setProgress(0);

    try {
      const result = await window.electronAPI?.generateMusicFromText(prompt, {
        duration,
        style,
        bpm,
      });
      
      if (result) {
        setGeneratedAudio(result);
        if (audioRef.current) {
          audioRef.current.src = `data:audio/wav;base64,${result.audio_data}`;
        }
      }
    } catch (err) {
      setError(err.message || 'Failed to generate music');
    } finally {
      setLoading(false);
    }
  };

  const handlePlayPause = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const handleDownload = async () => {
    if (generatedAudio) {
      try {
        await window.electronAPI?.saveAudio(
          generatedAudio.audio_file,
          `generated_music_${Date.now()}.wav`
        );
      } catch (err) {
        setError('Failed to download audio');
      }
    }
  };

  return (
    <div className="text-to-music-container">
      <div className="header">
        <h1>🎵 Text to Music</h1>
        <p>Describe the music you want to create</p>
      </div>

      <div className="input-section">
        <div className="prompt-input">
          <label htmlFor="prompt">Music Description</label>
          <textarea
            id="prompt"
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="e.g., upbeat electronic pop with synth leads and heavy bass, energetic and fun"
            rows={4}
            disabled={loading}
          />
        </div>

        <div className="controls-grid">
          <div className="control-group">
            <label htmlFor="duration">Duration (seconds)</label>
            <input
              id="duration"
              type="range"
              min="10"
              max="120"
              step="10"
              value={duration}
              onChange={(e) => setDuration(Number(e.target.value))}
              disabled={loading}
            />
            <span className="value-display">{duration}s</span>
          </div>

          <div className="control-group">
            <label htmlFor="style">Style</label>
            <select
              id="style"
              value={style}
              onChange={(e) => setStyle(e.target.value)}
              disabled={loading}
            >
              <option value="pop">Pop</option>
              <option value="electronic">Electronic</option>
              <option value="classical">Classical</option>
              <option value="jazz">Jazz</option>
              <option value="ambient">Ambient</option>
              <option value="hip-hop">Hip-Hop</option>
              <option value="rock">Rock</option>
            </select>
          </div>

          <div className="control-group">
            <label htmlFor="bpm">BPM</label>
            <input
              id="bpm"
              type="range"
              min="60"
              max="180"
              step="5"
              value={bpm}
              onChange={(e) => setBpm(Number(e.target.value))}
              disabled={loading}
            />
            <span className="value-display">{bpm}</span>
          </div>
        </div>
      </div>

      <button
        className="generate-btn"
        onClick={handleGenerate}
        disabled={loading || !prompt.trim()}
      >
        {loading ? (
          <>
            <span className="spinner"></span>
            {progress > 0 && <span> {progress}%</span>}
          </>
        ) : (
          'Generate Music ✨'
        )}
      </button>

      {error && <div className="error-message">{error}</div>}

      {generatedAudio && (
        <div className="playback-section">
          <div className="playback-controls">
            <button
              className="play-btn"
              onClick={handlePlayPause}
            >
              {isPlaying ? '⏸ Pause' : '▶ Play'}
            </button>
            <button className="download-btn" onClick={handleDownload}>
              ⬇ Download
            </button>
          </div>

          <audio
            ref={audioRef}
            onEnded={() => setIsPlaying(false)}
            className="audio-player"
          />

          <div className="audio-info">
            <p>✓ Generated successfully!</p>
            <p className="duration">Duration: {duration}s</p>
          </div>
        </div>
      )}
    </div>
  );
}
