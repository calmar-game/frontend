import { useEffect, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { AlertCircle, Info, ArrowRight, User } from 'lucide-react';
import { CharacterClass } from '../constants/avatars';
import { useAuthStore } from '../store/authStore';
import { getProfile, updateProfile } from '../api';

export function SetupPage() {
  const navigate = useNavigate();
  const { accessToken } = useAuthStore();
  const [username, setUsername] = useState('');
  // Hidden default class selection - user doesn't choose, we set it automatically
  const [selectedAvatar] = useState<CharacterClass>(CharacterClass.CYBER_SENTINEL);
  const [error, setError] = useState('');
  // const [showAvatarInfo, setShowAvatarInfo] = useState<CharacterClass | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const getMe = useCallback(() => {
    getProfile(String(accessToken)).then((r) => {

      // @ts-expect-error isProfileCompleted is not null
      if (r.isProfileCompleted === true) {
        navigate("/profile");
        // window.location.href = "/runner"
      }
    }).catch((err) => {
      console.info(err)
    });
  }, [accessToken, navigate]);

  useEffect(() => {
    if (accessToken === null) {
      navigate("/");
    } else {
      getMe();
    }
  }, [accessToken, navigate, getMe]);

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
      }, String(accessToken));
      navigate("/profile");
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
    <div className="min-h-screen w-full bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
      {/* Animated background elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 -right-32 w-96 h-96 bg-purple-500/20 rounded-full mix-blend-multiply filter blur-3xl animate-blob"></div>
        <div className="absolute -bottom-32 -left-32 w-96 h-96 bg-blue-500/20 rounded-full mix-blend-multiply filter blur-3xl animate-blob animation-delay-2000"></div>
        <div className="absolute top-1/2 left-1/3 w-96 h-96 bg-cyan-500/10 rounded-full mix-blend-multiply filter blur-3xl animate-blob animation-delay-4000"></div>
      </div>

      {/* Content */}
      <div className="relative z-10 min-h-screen flex flex-col items-center justify-center px-4 py-6">
        <div className="max-w-md w-full">
          {/* Header Section */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 mb-4 rounded-2xl bg-gradient-to-br from-purple-500/20 to-blue-500/20 border border-purple-500/30 backdrop-blur-xl">
              <User className="w-8 h-8 text-blue-400" />
            </div>
            
            <h1 className="text-3xl font-bold mb-2">
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-white via-purple-200 to-blue-200">
                Create Profile
              </span>
            </h1>
            
            <p className="text-sm text-gray-400">
              Set up your username to continue
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Username Input Card */}
            <div className="bg-slate-900/80 backdrop-blur-xl rounded-xl p-6 border border-slate-700/50">
              <label className="block text-white text-sm font-semibold mb-3">Username</label>
              <input
                type="text"
                value={username}
                onChange={(e) => {
                  setUsername(e.target.value);
                  setError('');
                }}
                className="w-full bg-slate-800/50 text-white px-4 py-3 rounded-lg
                         border border-slate-700 focus:border-purple-500/50
                         focus:outline-none focus:ring-2 focus:ring-purple-500/20
                         placeholder:text-gray-500 transition-all"
                placeholder="Enter your username"
                maxLength={15}
              />
              <p className="text-xs text-gray-500 mt-2">
                characters, letters, numbers, and underscores only
              </p>
              {error && (
                <div className="flex items-center gap-2 mt-3 text-red-400 text-sm bg-red-500/10 p-3 rounded-lg border border-red-500/20">
                  <AlertCircle className="w-4 h-4 flex-shrink-0" />
                  <span>{error}</span>
                </div>
              )}
            </div>

            {/* Info Card */}
            <div className="bg-slate-900/80 backdrop-blur-xl rounded-xl p-4 border border-slate-700/50">
              <div className="flex items-start gap-3">
                <Info className="w-5 h-5 text-blue-400 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm text-gray-300 mb-1">
                    After registration, the game and all features will be available to you.
                  </p>
                  <p className="text-xs text-gray-500">
                    Complete your profile and jump into gameplay and earning rewards!
                  </p>
                </div>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full px-6 py-4 rounded-xl font-semibold 
                       bg-gradient-to-r from-purple-600 to-blue-600 text-white
                       hover:from-purple-500 hover:to-blue-500
                       transition-all duration-300 
                       flex items-center justify-center gap-2 text-base
                       shadow-lg shadow-purple-500/50 hover:shadow-xl hover:shadow-purple-400/50
                       disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:shadow-lg"
            >
              {isLoading ? 'Loading...' : 'Continue to Game'}
              <ArrowRight className="w-5 h-5" />
            </button>
          </form>

          {/* Commented out character selection - kept for potential future use */}
          {/* 
          <div className="mb-6">
            <label className="block text-white text-sm font-semibold mb-4">Select Character Class</label>
            <div className="grid grid-cols-5 gap-3">
              {GAME_AVATARS.map((avatar) => (
                <div key={avatar.id} className="relative">
                  <button
                    type="button"
                    onClick={() => setSelectedAvatar(avatar.id)}
                    onMouseEnter={() => setShowAvatarInfo(avatar.id)}
                    onMouseLeave={() => setShowAvatarInfo(null)}
                    className={`relative aspect-square overflow-hidden rounded-lg
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
                               bg-slate-900/95 backdrop-blur-xl rounded-lg p-2 z-50 border"
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
          */}
        </div>
      </div>
    </div>
  );
}