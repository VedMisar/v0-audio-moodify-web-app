"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Slider } from "@/components/ui/slider"
import { Card } from "@/components/ui/card"
import {
  Play,
  Pause,
  SkipBack,
  SkipForward,
  Volume2,
  VolumeX,
  Heart,
  Repeat,
  Shuffle,
  MoreHorizontal,
} from "lucide-react"
import { useMusic } from "@/contexts/music-context"

export function MusicPlayer() {
  const { currentSong, isPlaying, setIsPlaying, playNext, playPrevious } = useMusic()

  const [currentTime, setCurrentTime] = useState(0)
  const [volume, setVolume] = useState(75)
  const [isMuted, setIsMuted] = useState(false)
  const [isLiked, setIsLiked] = useState(false)
  const [isRepeat, setIsRepeat] = useState(false)
  const [isShuffle, setIsShuffle] = useState(false)
  const [showVolumeSlider, setShowVolumeSlider] = useState(false)

  useEffect(() => {
    console.log("[v0] Current song changed:", currentSong)
  }, [currentSong])

  // Format time in MM:SS format
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = Math.floor(seconds % 60)
    return `${mins}:${secs.toString().padStart(2, "0")}`
  }

  const handleVolumeChange = (newVolume: number[]) => {
    const vol = newVolume[0]
    setVolume(vol)
    setIsMuted(vol === 0)
  }

  const toggleMute = () => {
    setIsMuted(!isMuted)
  }

  const handleSeek = (newTime: number[]) => {
    const time = newTime[0]
    setCurrentTime(time)
  }

  const handlePlayPause = () => {
    console.log("[v0] Play/pause clicked, current state:", isPlaying)
    setIsPlaying(!isPlaying)
  }

  // Default song for demo purposes
  const defaultSong = {
    id: "demo",
    title: "Select a song to play",
    artist: "AudioMoodify",
    duration: 180,
    coverUrl: "/abstract-soundscape.png",
  }

  const displaySong = currentSong || defaultSong

  return (
    <Card className="fixed bottom-0 left-0 right-0 z-50 bg-card/95 backdrop-blur-md border-t border-border shadow-lg">
      <div className="flex items-center gap-4 p-4 max-w-screen-2xl mx-auto">
        {/* Song Info */}
        <div className="flex items-center gap-3 min-w-0 flex-1 md:flex-none md:w-80">
          <div className="w-12 h-12 md:w-14 md:h-14 rounded-lg overflow-hidden bg-muted flex-shrink-0">
            <img
              src={displaySong.coverUrl || "/placeholder.svg"}
              alt={displaySong.title}
              className="w-full h-full object-cover"
            />
          </div>
          <div className="min-w-0 flex-1">
            <h4 className="font-medium text-sm md:text-base text-foreground truncate">{displaySong.title}</h4>
            <p className="text-xs md:text-sm text-muted-foreground truncate">{displaySong.artist}</p>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsLiked(!isLiked)}
            className="hidden md:flex flex-shrink-0"
          >
            <Heart className={`h-4 w-4 ${isLiked ? "fill-red-500 text-red-500" : ""}`} />
          </Button>
        </div>

        {/* Player Controls */}
        <div className="flex flex-col items-center gap-2 flex-1 max-w-2xl">
          {/* Control Buttons */}
          <div className="flex items-center gap-2 md:gap-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsShuffle(!isShuffle)}
              className={`hidden md:flex ${isShuffle ? "text-primary" : "text-muted-foreground"}`}
            >
              <Shuffle className="h-4 w-4" />
            </Button>

            <Button variant="ghost" size="sm" onClick={playPrevious} disabled={!currentSong}>
              <SkipBack className="h-4 w-4" />
            </Button>

            <Button
              variant="default"
              size="sm"
              onClick={handlePlayPause}
              disabled={!currentSong}
              className="h-8 w-8 md:h-10 md:w-10 rounded-full"
            >
              {isPlaying ? (
                <Pause className="h-4 w-4 md:h-5 md:w-5" />
              ) : (
                <Play className="h-4 w-4 md:h-5 md:w-5 ml-0.5" />
              )}
            </Button>

            <Button variant="ghost" size="sm" onClick={playNext} disabled={!currentSong}>
              <SkipForward className="h-4 w-4" />
            </Button>

            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsRepeat(!isRepeat)}
              className={`hidden md:flex ${isRepeat ? "text-primary" : "text-muted-foreground"}`}
            >
              <Repeat className="h-4 w-4" />
            </Button>
          </div>

          {/* Progress Bar */}
          <div className="hidden md:flex items-center gap-2 w-full max-w-md">
            <span className="text-xs text-muted-foreground w-10 text-right">{formatTime(currentTime)}</span>
            <Slider
              value={[currentTime]}
              max={displaySong.duration}
              step={1}
              onValueChange={handleSeek}
              className="flex-1"
              disabled={!currentSong}
            />
            <span className="text-xs text-muted-foreground w-10">{formatTime(displaySong.duration)}</span>
          </div>
        </div>

        {/* Volume and Additional Controls */}
        <div className="flex items-center gap-2 flex-shrink-0">
          <Button variant="ghost" size="sm" className="hidden md:flex">
            <MoreHorizontal className="h-4 w-4" />
          </Button>

          <div className="hidden md:flex items-center gap-2 relative">
            <Button variant="ghost" size="sm" onClick={toggleMute} onMouseEnter={() => setShowVolumeSlider(true)}>
              {isMuted || volume === 0 ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
            </Button>

            {showVolumeSlider && (
              <div
                className="absolute bottom-full right-0 mb-2 p-2 bg-popover border border-border rounded-lg shadow-lg"
                onMouseLeave={() => setShowVolumeSlider(false)}
              >
                <div className="w-20 h-24 flex items-center justify-center">
                  <Slider
                    value={[isMuted ? 0 : volume]}
                    max={100}
                    step={1}
                    onValueChange={handleVolumeChange}
                    orientation="vertical"
                    className="h-16"
                  />
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Mobile Progress Bar */}
      <div className="md:hidden px-4 pb-2">
        <div className="flex items-center gap-2 w-full">
          <span className="text-xs text-muted-foreground">{formatTime(currentTime)}</span>
          <Slider
            value={[currentTime]}
            max={displaySong.duration}
            step={1}
            onValueChange={handleSeek}
            className="flex-1"
            disabled={!currentSong}
          />
          <span className="text-xs text-muted-foreground">{formatTime(displaySong.duration)}</span>
        </div>
      </div>
    </Card>
  )
}
