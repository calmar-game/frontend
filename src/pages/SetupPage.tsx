import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Check, AlertCircle, Info } from 'lucide-react';
import { GAME_AVATARS, CharacterClass } from '../constants/avatars';
import { useAuthStore } from '../store/authStore';
import { getProfile, updateProfile } from '../api';

export function SetupPage() {
  const navigate = useNavigate();
  const { setUserProfile, accessToken } = useAuthStore();
  const [username, setUsername] = useState('');
  const [selectedAvatar, setSelectedAvatar] = useState<CharacterClass>(CharacterClass.CYBER_SENTINEL); // default
  const [error, setError] = useState('');
  const [showAvatarInfo, setShowAvatarInfo] = useState<CharacterClass | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const getMe = () => {
    getProfile(String(accessToken)).then((r) => {
      if (r.isProfileCompleted === true) {
        navigate("/runner");
        // window.location.href = "/runner"
      }
    }).catch((err) => {
      console.info(err)
    });
  };

  useEffect(() => {
    if (accessToken === null) {
      navigate("/");
    } else {
      getMe();
    }
  }, [accessToken, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!username.trim()) {
      setError('Please enter a username');
      return;
    }

    if (username.length < 3) {
      setError('Username must be at least 3 characters');
      return;
    }

    if (username.length > 15) {
      setError('Username must be less than 15 characters');
      return;
    }

    if (!/^[a-zA-Z0-9_]+$/.test(username)) {
      setError('Username can only contain letters, numbers, and underscores');
      return;
    }

    setIsLoading(true);

    // try {
      await updateProfile({
        username,
        characterClass: selectedAvatar,
      }, String(accessToken))
      // await setUserProfile({
      //   username,
      //   characterClass: selectedAvatar,
      // });
      // navigate('/runner');
    // } catch (error) {
    //   setError('Failed to save profile');
    //   setIsLoading(false);
    // }
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center p-4 bg-black grid-pattern">
      <div className="max-w-md w-full">
        <form onSubmit={handleSubmit} className="glass-effect pixel-corners p-6 md:p-8">
          <h1 className="text-[#00ff00] text-xl md:text-2xl mb-8 text-center tracking-wider">
            CUSTOMIZE YOUR PROFILE
          </h1>

          {/* Username Input */}
          <div className="mb-8">
            <label className="block text-[#00ff00] text-sm mb-2">CHOOSE USERNAME</label>
            <input
              type="text"
              value={username}
              onChange={(e) => {
                setUsername(e.target.value);
                setError('');
              }}
              className="w-full bg-black/30 text-white px-4 py-3 glass-effect pixel-corners
                       focus:outline-none focus:ring-1 focus:ring-[#00ff00]
                       placeholder:text-gray-500"
              placeholder="Enter username"
            />
            {error && (
              <div className="flex items-center gap-2 mt-2 text-red-400 text-sm">
                <AlertCircle className="w-4 h-4" />
                <span>{error}</span>
              </div>
            )}
          </div>

          {/* Avatar Selection */}
          <div className="mb-8">
            <label className="block text-[#00ff00] text-sm mb-4">SELECT CHARACTER CLASS</label>
            <div className="grid grid-cols-5 gap-3">
              {GAME_AVATARS.map((avatar) => (
                <div key={avatar.id} className="relative">
                  <button
                    type="button"
                    onClick={() => setSelectedAvatar(avatar.id)}
                    onMouseEnter={() => setShowAvatarInfo(avatar.id)}
                    onMouseLeave={() => setShowAvatarInfo(null)}
                    className={`relative aspect-square overflow-hidden pixel-corners
                             transition-all duration-300 flex items-center justify-center
                             ${selectedAvatar === avatar.id
                               ? 'ring-2'
                               : 'opacity-50 hover:opacity-75 hover:ring-1'}`}
                    style={{ 
                      ringColor: avatar.borderColor,
                      backgroundColor: avatar.bgColor,
                      boxShadow: selectedAvatar === avatar.id 
                        ? `0 0 10px ${avatar.borderColor}` 
                        : 'none'
                    }}
                  >
                    {React.createElement(avatar.icon, {
                      size: 32,
                      style: { color: avatar.borderColor },
                      strokeWidth: 1.5
                    })}
                    {selectedAvatar === avatar.id && (
                      <div 
                        className="absolute inset-0 flex items-center justify-center"
                        style={{ backgroundColor: `${avatar.borderColor}20` }}
                      >
                        <Check className="w-6 h-6" style={{ color: avatar.borderColor }} />
                      </div>
                    )}
                  </button>

                  {showAvatarInfo === avatar.id && (
                    <div 
                      className="absolute -top-20 left-1/2 transform -translate-x-1/2 w-48 
                               glass-effect pixel-corners p-2 z-50"
                      style={{ borderColor: avatar.borderColor }}
                    >
                      <div className="text-center">
                        <h3 className="text-sm font-bold mb-1" style={{ color: avatar.borderColor }}>
                          {avatar.name}
                        </h3>
                        <p className="text-xs text-gray-400">{avatar.description}</p>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Selected Character Info */}
          <div className="mb-8 glass-effect pixel-corners p-4">
            <div className="flex items-center gap-2 mb-2">
              <Info className="w-4 h-4 text-[#00ff00]" />
              <span className="text-sm text-[#00ff00]">Selected: {selectedAvatar}</span>
            </div>
            <p className="text-xs text-gray-400">
              {GAME_AVATARS.find((a) => a.id === selectedAvatar)?.description}
            </p>
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-[#00ff00] text-black p-4 pixel-corners
                     hover:neon-box transition-all duration-300
                     flex items-center justify-center gap-3 text-base font-bold tracking-wider
                     disabled:opacity-50 disabled:cursor-not-allowed"
          >
            CONTINUE TO GAME
          </button>
        </form>
      </div>
    </div>
  );
}