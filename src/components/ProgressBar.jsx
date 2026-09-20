import { useState, useEffect } from "react"

const ProgressBar = ({ trackDuration, trackProgress }) => {
  const [progress, setProgress] = useState(trackProgress)

  useEffect(() => {
    setProgress(trackProgress)
  }, [trackProgress])

  const formatTime = (milliseconds) => {
    const totalSeconds = Math.floor(milliseconds / 1000)
    const minutes = Math.floor(totalSeconds / 60)
    const seconds = totalSeconds % 60

    return `${minutes}:${seconds < 10 ? "0" : ""}${seconds}`
  }

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress((prevProgress) => {
        const newProgress = Math.min(prevProgress + 1000, trackDuration)
        return newProgress
      })
    }, 1000)
    return () => clearInterval(interval)
  }, [trackDuration])

  return (
    <div className="w-full flex flex-col items-center select-none">
      <div className="flex justify-between w-full text-xs sm:text-sm text-gray-300 font-light mb-1.5 px-0.5">
        <span>{formatTime(progress)}</span>
        <span>{formatTime(trackDuration)}</span>
      </div>
      <div className="relative w-full h-1.5 sm:h-2 bg-white/20 rounded-full overflow-hidden">
        <div
          className="absolute top-0 left-0 h-full bg-white rounded-full transition-all duration-1000 ease-linear"
          style={{
            width: `${Math.min(100, (progress / trackDuration) * 100)}%`,
          }}
        />
      </div>
    </div>
  )
}

export default ProgressBar
