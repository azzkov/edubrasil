import React, { useState, useRef, useEffect } from 'react';
import 'bulma/css/bulma.min.css';

const App = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [musicFile, setMusicFile] = useState(null);
  const [isLocked, setIsLocked] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [password, setPassword] = useState('edubrasil2025');
  const [enteredPassword, setEnteredPassword] = useState('');
  const [isPasswordCorrect, setIsPasswordCorrect] = useState(true);
  const [showAdminPanel, setShowAdminPanel] = useState(false); // Flag for showing admin panel
  const audioRef = useRef(null);

  useEffect(() => {
    const savedMusic = localStorage.getItem('musicFile');
    if (savedMusic) {
      setMusicFile(savedMusic);
    }
  }, []);

  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (file && file.type.startsWith('audio/')) {
      const url = URL.createObjectURL(file);
      setMusicFile(url);

      localStorage.setItem('musicFile', url);
    } else {
      alert('Por favor, selecione um arquivo de áudio válido');
    }
  };

  const togglePlay = () => {
    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play();
    }
    setIsPlaying(!isPlaying);
  };

  const handleTimeUpdate = () => {
    setCurrentTime(audioRef.current.currentTime);
  };

  const handleLoadedMetadata = () => {
    setDuration(audioRef.current.duration);
  };

  const handleSeek = (e) => {
    const time = e.target.value;
    audioRef.current.currentTime = time;
    setCurrentTime(time);
  };

  const formatTime = (time) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  const lockPlayer = () => {
    setIsLocked(true);
  };

  const timeRemaining = duration - currentTime;

  const handlePasswordChange = (e) => {
    setEnteredPassword(e.target.value);
  };

  const handleSubmitPassword = () => {
    if (enteredPassword === password) {
      setIsPasswordCorrect(true);
      setEnteredPassword('');
      setShowAdminPanel(true); // Show admin panel after correct password
    } else {
      setIsPasswordCorrect(false);
      alert('Senha incorreta!');
    }
  };

  const resetMusic = () => {
    setMusicFile(null);
    localStorage.removeItem('musicFile');
    setIsPasswordCorrect(true);
  };

  // Renderiza o painel de administrador
  const renderAdminPanel = () => (
    <div className="admin-panel mt-5">
      <h3 className="title is-4" style={{ color: '#f9d923' }}>Painel de Admin</h3>
      <button
        className="button is-danger"
        onClick={resetMusic}
        style={{ backgroundColor: '#f9d923', color: '#440154' }}
      >
        Resetar Música
      </button>
      <button
        className="button is-warning mt-3"
        onClick={lockPlayer}
        style={{ backgroundColor: '#f9d923', color: '#440154' }}
      >
        Bloquear Player
      </button>
    </div>
  );

  return (
    <div className="container has-text-centered my-5" style={{ backgroundColor: '#2a003d', color: '#f9d923' }}>
      <div className="navbar-brand">
        <a className="navbar-item" href="#">
          <strong style={{ color: '#f9d923' }}>Edu Brasil!</strong>
        </a>
      </div>

      <section className="hero is-medium" style={{ backgroundColor: '#2a003d' }}>
        <div className="hero-body">
          <div className="container">
            <h1 className="title is-1 has-text-white">Edu Brasil!</h1>
            <h2 className="subtitle is-3 has-text-light">Novo Single: "Mar de Emoções"</h2>

              <div className="box music-player-box" style={{ background: 'linear-gradient(135deg, #440154, #f9d923)' }}>
              <figure className="image is-square mb-5">
                <img src="/mar de emocoes.png" alt="Capa do Single" className="album-cover" />
              </figure>

              <div className="audio-player-container">
                {!isLocked && !musicFile && (
                  <div className="file is-centered is-boxed is-success mb-4">
                    <label className="file-label">
                      <input
                        className="file-input"
                        type="file"
                        accept="audio/*"
                        onChange={handleFileUpload}
                      />
                      <span className="file-cta">
                        <span className="file-label" style={{ color: '#440154' }}>
                          Escolher música...
                        </span>
                      </span>
                    </label>
                  </div>
                )}

                {musicFile && (
                  <>
                    <audio
                      ref={audioRef}
                      src={musicFile}
                      onTimeUpdate={handleTimeUpdate}
                      onLoadedMetadata={handleLoadedMetadata}
                    />

                    <div className="player-controls">
                      <button
                        className={`button is-medium ${isPlaying ? 'is-danger' : 'is-primary'}`}
                        onClick={togglePlay}
                        style={{ backgroundColor: '#f9d923', color: '#440154' }}
                      >
                        {isPlaying ? 'Pausar' : 'Play'}
                      </button>

                      <div className="timeline-container mt-3">
                        <input
                          type="range"
                          min="0"
                          max={duration}
                          value={currentTime}
                          onChange={handleSeek}
                          className="timeline"
                          style={{ backgroundColor: '#440154' }}
                        />
                        <div className="time-display" style={{ color: '#f9d923' }}>
                          <span>{formatTime(currentTime)}</span>
                          <span> / </span>
                          <span>{formatTime(duration)}</span>
                          <span> (Restante: {formatTime(timeRemaining)})</span>
                        </div>
                      </div>

                     
                    </div>
                  </>
                )}

                {/* Verifica a senha e permite o painel de administração */}
                {showAdminPanel && renderAdminPanel()}
              </div>

              <div className="content mt-6">
                <h3 className="title is-4" style={{ color: '#f9d923' }}>Letra da Música</h3>
                <div className="box lyrics-box" style={{ backgroundColor: '#2a003d' }}>
                  <p>
                    [Aqui você colocará a letra da música]
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <footer className="footer is-dark" style={{ backgroundColor: '#3b0a45' }}>
        <div className="content has-text-centered">
          <p>
            <strong style={{ color: '#f9d923' }}>© 2024 Edu Brasil todos os direitos reservados!</strong>
          </p>
        </div>
      </footer>
    </div>
  );
};

export default App;
